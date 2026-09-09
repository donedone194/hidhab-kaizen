"use client";

import React, { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, MapPin, Phone, User, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Product, createOrder, getDeliveryPriceForWilaya, Order } from "@/lib/data-service";
import { ALGERIA_WILAYAS, getCommunesByWilayaId, getWilayaById } from "@/data/algeria-data";
import { formatDZD, validateAlgerianPhone } from "@/lib/utils";
import OrderSuccessModal from "./OrderSuccessModal";

interface OrderFormProps {
  product: Product;
}

export default function OrderForm({ product }: OrderFormProps) {
  const { locale, t } = useLanguage();
  const formId = useId();

  // Form states in requested exact sequence
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [deliveryType, setDeliveryType] = useState<"home" | "office">("home");
  const [selectedWilayaId, setSelectedWilayaId] = useState<number | "">("");
  const [selectedCommuneName, setSelectedCommuneName] = useState("");
  const [preciseAddress, setPreciseAddress] = useState("");
  const [note, setNote] = useState("");

  // Calculation & Delivery Fee states
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [availableCommunes, setAvailableCommunes] = useState<{ id: number; name_ar: string; name_fr: string }[]>([]);
  
  // Submission & Validation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // When Wilaya or Delivery Type changes, fetch and update delivery price dynamically
  useEffect(() => {
    if (selectedWilayaId) {
      // Update communes
      const communes = getCommunesByWilayaId(selectedWilayaId);
      setAvailableCommunes(communes);
      setSelectedCommuneName(""); // reset commune selection

      // Fetch dynamic delivery price from delivery pricing table
      getDeliveryPriceForWilaya(Number(selectedWilayaId), deliveryType).then((price) => {
        setDeliveryFee(price);
      });
    } else {
      setAvailableCommunes([]);
      setDeliveryFee(0);
    }
  }, [selectedWilayaId, deliveryType]);

  // Derived Calculations
  const productCost = product.price * quantity;
  const totalCost = productCost + deliveryFee;

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = t.orderForm.fullNameRequired;
    }

    if (!phone.trim()) {
      errors.phone = t.orderForm.phoneRequired;
    } else if (!validateAlgerianPhone(phone)) {
      errors.phone = locale === "ar" 
        ? "رقم الهاتف غير صالح. يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام" 
        : "Numéro invalide. Doit commencer par 05, 06 ou 07 et comporter 10 chiffres.";
    }

    if (!selectedWilayaId) {
      errors.wilaya = t.orderForm.wilayaRequired;
    }

    if (!selectedCommuneName.trim()) {
      errors.commune = t.orderForm.communeRequired;
    }

    if (!preciseAddress.trim()) {
      errors.address = t.orderForm.addressRequired;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        customer_name: fullName.trim(),
        phone: phone.trim(),
        product_id: product.id,
        quantity,
        wilaya_id: Number(selectedWilayaId),
        commune_name: selectedCommuneName.trim(),
        precise_address: preciseAddress.trim(),
        customer_note: note.trim() || undefined,
        product_price: productCost,
        delivery_price: deliveryFee,
        total_price: totalCost,
        delivery_type: deliveryType,
      });

      setCreatedOrder(order);
    } catch (err) {
      console.error("Order submission error:", err);
      alert(locale === "ar" ? "حدث خطأ أثناء حفظ الطلب. يرجى المحاولة ثانية." : "Erreur lors de l'enregistrement. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-white rounded-3xl p-6 sm:p-10 border border-sand-200/90 shadow-xl" id="order-form-anchor">
      {/* Header Banner */}
      <div className="border-b border-sand-200 pb-6 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-extrabold uppercase tracking-wider mb-2">
          <Truck className="w-3.5 h-3.5" />
          <span>{t.orderForm.title}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
          {locale === "ar" ? "أطلب الآن وادفع عند الاستلام" : "Commandez Maintenant & Payez à la Livraison"}
        </h2>
        <p className="mt-1 text-sm text-charcoal-600">
          {t.orderForm.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* FIELD 1: Full Name (الاسم الكامل) */}
        <div>
          <label htmlFor={`${formId}-fullname`} className="block text-sm font-bold text-navy-950 mb-2">
            1. {t.orderForm.fullName} <span className="text-orange-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-charcoal-400">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              id={`${formId}-fullname`}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (formErrors.fullName) setFormErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              placeholder={t.orderForm.fullNamePlaceholder}
              required
              className={`w-full ps-11 pe-4 py-3.5 rounded-xl border text-sm transition-colors ${
                formErrors.fullName
                  ? "border-red-500 bg-red-50/50"
                  : "border-sand-300 bg-sand-50/40 hover:border-sand-400"
              }`}
            />
          </div>
          {formErrors.fullName && (
            <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {formErrors.fullName}
            </p>
          )}
        </div>

        {/* FIELD 2: Phone Number (رقم الهاتف) */}
        <div>
          <label htmlFor={`${formId}-phone`} className="block text-sm font-bold text-navy-950 mb-2">
            2. {t.orderForm.phone} <span className="text-orange-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-charcoal-400">
              <Phone className="w-5 h-5" />
            </div>
            <input
              type="tel"
              id={`${formId}-phone`}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: "" }));
              }}
              placeholder={t.orderForm.phonePlaceholder}
              dir="ltr"
              required
              className={`w-full ps-11 pe-4 py-3.5 rounded-xl border text-sm font-mono tracking-wide transition-colors ${
                formErrors.phone
                  ? "border-red-500 bg-red-50/50"
                  : "border-sand-300 bg-sand-50/40 hover:border-sand-400"
              }`}
            />
          </div>
          {formErrors.phone ? (
            <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {formErrors.phone}
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-charcoal-400">
              {locale === "ar" ? "نستخدم رقم الهاتف لتأكيد موعد وصول الموزع لطردكم." : "Votre numéro servira au livreur pour coordonner la remise."}
            </p>
          )}
        </div>

        {/* FIELD 3: Quantity (الكمية) */}
        <div>
          <label className="block text-sm font-bold text-navy-950 mb-2">
            3. {t.orderForm.quantity} <span className="text-orange-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-12 h-12 rounded-xl border border-sand-300 bg-sand-100/60 hover:bg-sand-200 text-navy-950 font-bold text-lg disabled:opacity-40 transition-colors"
            >
              -
            </button>
            <div className="w-20 h-12 flex items-center justify-center font-bold text-lg rounded-xl border border-sand-300 bg-white">
              {quantity}
            </div>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(product.stock_count || 10, q + 1))}
              disabled={quantity >= (product.stock_count || 10)}
              className="w-12 h-12 rounded-xl border border-sand-300 bg-sand-100/60 hover:bg-sand-200 text-navy-950 font-bold text-lg disabled:opacity-40 transition-colors"
            >
              +
            </button>
            <span className="text-xs text-charcoal-500">
              {locale === "ar" ? `(السعر الإفرادي: ${formatDZD(product.price, locale)})` : `(${formatDZD(product.price, locale)} / pièce)`}
            </span>
          </div>
        </div>

        {/* Delivery Type Option (Home vs Office) */}
        <div>
          <label className="block text-sm font-bold text-navy-950 mb-2">
            {t.orderForm.deliveryType}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeliveryType("home")}
              className={`p-3.5 rounded-xl border text-start flex items-center justify-between transition-all ${
                deliveryType === "home"
                  ? "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20"
                  : "border-sand-200 bg-sand-50 hover:bg-sand-100/50"
              }`}
            >
              <div>
                <span className="block text-sm font-bold text-navy-950">{t.orderForm.homeDelivery}</span>
                <span className="text-[11px] text-charcoal-500">
                  {locale === "ar" ? "توصيل لباب منزلك أو مكان عملك" : "Livré directement à votre porte"}
                </span>
              </div>
              {deliveryType === "home" && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
            </button>

            <button
              type="button"
              onClick={() => setDeliveryType("office")}
              className={`p-3.5 rounded-xl border text-start flex items-center justify-between transition-all ${
                deliveryType === "office"
                  ? "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20"
                  : "border-sand-200 bg-sand-50 hover:bg-sand-100/50"
              }`}
            >
              <div>
                <span className="block text-sm font-bold text-navy-950">{t.orderForm.officeDelivery}</span>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  {locale === "ar" ? "استلام من المكتب (سعر أقل)" : "Retrait au bureau express"}
                </span>
              </div>
              {deliveryType === "office" && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
            </button>
          </div>
        </div>

        {/* FIELD 4: الولاية (Wilaya - 58 Algerian Wilayas) */}
        <div>
          <label htmlFor={`${formId}-wilaya`} className="block text-sm font-bold text-navy-950 mb-2">
            4. {t.orderForm.wilaya} <span className="text-orange-500">*</span>
          </label>
          <div className="relative">
            <select
              id={`${formId}-wilaya`}
              value={selectedWilayaId}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : "";
                setSelectedWilayaId(val);
                if (formErrors.wilaya) setFormErrors((prev) => ({ ...prev, wilaya: "" }));
              }}
              required
              className={`w-full px-4 py-3.5 rounded-xl border text-sm bg-sand-50/40 text-navy-950 appearance-none transition-colors ${
                formErrors.wilaya
                  ? "border-red-500 bg-red-50/50"
                  : "border-sand-300 hover:border-sand-400"
              }`}
            >
              <option value="">{t.orderForm.wilayaSelect}</option>
              {ALGERIA_WILAYAS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.code} - {locale === "ar" ? w.name_ar : w.name_fr} ({locale === "ar" ? w.name_fr : w.name_ar})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none text-charcoal-400">
              ▼
            </div>
          </div>
          {formErrors.wilaya && (
            <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {formErrors.wilaya}
            </p>
          )}
        </div>

        {/* FIELD 5: البلدية (Commune - Dependent Dropdown) */}
        <div>
          <label htmlFor={`${formId}-commune`} className="block text-sm font-bold text-navy-950 mb-2">
            5. {t.orderForm.commune} <span className="text-orange-500">*</span>
          </label>
          <div className="relative">
            <select
              id={`${formId}-commune`}
              value={selectedCommuneName}
              onChange={(e) => {
                setSelectedCommuneName(e.target.value);
                if (formErrors.commune) setFormErrors((prev) => ({ ...prev, commune: "" }));
              }}
              disabled={!selectedWilayaId}
              required
              className={`w-full px-4 py-3.5 rounded-xl border text-sm bg-sand-50/40 text-navy-950 appearance-none disabled:opacity-50 transition-colors ${
                formErrors.commune
                  ? "border-red-500 bg-red-50/50"
                  : "border-sand-300 hover:border-sand-400"
              }`}
            >
              <option value="">
                {selectedWilayaId ? t.orderForm.communeSelect : t.orderForm.communeSelectWilayaFirst}
              </option>
              {availableCommunes.map((c) => (
                <option key={c.id} value={c.name_ar}>
                  {locale === "ar" ? c.name_ar : c.name_fr}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none text-charcoal-400">
              ▼
            </div>
          </div>
          {formErrors.commune && (
            <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {formErrors.commune}
            </p>
          )}
        </div>

        {/* FIELD 6: العنوان الدقيق (Precise Address) */}
        <div>
          <label htmlFor={`${formId}-address`} className="block text-sm font-bold text-navy-950 mb-2">
            6. {t.orderForm.address} <span className="text-orange-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3.5 start-0 flex items-center ps-3.5 pointer-events-none text-charcoal-400">
              <MapPin className="w-5 h-5" />
            </div>
            <textarea
              id={`${formId}-address`}
              rows={2}
              value={preciseAddress}
              onChange={(e) => {
                setPreciseAddress(e.target.value);
                if (formErrors.address) setFormErrors((prev) => ({ ...prev, address: "" }));
              }}
              placeholder={t.orderForm.addressPlaceholder}
              required
              className={`w-full ps-11 pe-4 py-3 rounded-xl border text-sm transition-colors ${
                formErrors.address
                  ? "border-red-500 bg-red-50/50"
                  : "border-sand-300 bg-sand-50/40 hover:border-sand-400"
              }`}
            />
          </div>
          {formErrors.address && (
            <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {formErrors.address}
            </p>
          )}
        </div>

        {/* FIELD 7: ملاحظة (Note - Optional) */}
        <div>
          <label htmlFor={`${formId}-note`} className="block text-sm font-bold text-navy-950 mb-2">
            7. {t.orderForm.note}
          </label>
          <div className="relative">
            <div className="absolute top-3.5 start-0 flex items-center ps-3.5 pointer-events-none text-charcoal-400">
              <FileText className="w-5 h-5" />
            </div>
            <input
              type="text"
              id={`${formId}-note`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.orderForm.notePlaceholder}
              className="w-full ps-11 pe-4 py-3 rounded-xl border border-sand-300 bg-sand-50/40 text-sm hover:border-sand-400"
            />
          </div>
        </div>

        {/* LIVE ORDER SUMMARY BEFORE SUBMIT */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-navy-950 text-white space-y-3 shadow-lg">
          <h3 className="font-extrabold text-base text-sand-100 border-b border-navy-800 pb-3 flex items-center justify-between">
            <span>{t.orderForm.summaryTitle}</span>
            <span className="text-xs text-orange-400 font-semibold">{locale === "ar" ? "الدفع عند الاستلام" : "COD"}</span>
          </h3>

          <div className="flex items-center justify-between text-sm text-sand-200">
            <span>{t.orderForm.itemTotal}:</span>
            <span className="font-bold">{formatDZD(productCost, locale)}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-sand-200">
            <span>{t.orderForm.deliveryFee}:</span>
            <span className="font-bold">
              {selectedWilayaId ? formatDZD(deliveryFee, locale) : (locale === "ar" ? "حدد الولاية أولاً" : "À calculer")}
            </span>
          </div>

          <div className="border-t border-navy-800 pt-3 flex items-center justify-between text-lg sm:text-xl font-black">
            <span className="text-sand-50">{t.orderForm.totalToPay}:</span>
            <span className="text-orange-400 text-2xl font-black tracking-tight">
              {formatDZD(totalCost, locale)}
            </span>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-xs text-center text-charcoal-500">
          {t.orderForm.noticeCod}
        </p>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-base sm:text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-6 h-6" />
          <span>{isSubmitting ? t.orderForm.submitting : t.orderForm.submitButton}</span>
        </button>
      </form>

      {/* Confirmation Modal */}
      <OrderSuccessModal
        order={createdOrder}
        productName={locale === "ar" ? product.name_ar : product.name_fr}
        onClose={() => setCreatedOrder(null)}
      />
    </div>
  );
}

