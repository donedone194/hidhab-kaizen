"use client";

import React, { useState, useEffect } from "react";
import { Truck, Save, CheckCircle2, RotateCcw, Search, Sparkles, SlidersHorizontal } from "lucide-react";
import { getDeliveryPricing, updateWilayaPricing, WilayaDeliveryPrice } from "@/lib/data-service";
import { ALGERIA_WILAYAS, getWilayaById } from "@/data/algeria-data";
import { useLanguage } from "@/context/LanguageContext";
import { formatDZD } from "@/lib/utils";

export default function DeliveryPricingPage() {
  const { locale } = useLanguage();
  const [pricingList, setPricingList] = useState<WilayaDeliveryPrice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedWilayaId, setSavedWilayaId] = useState<number | null>(null);
  const [bulkHomePrice, setBulkHomePrice] = useState<number>(600);
  const [bulkOfficePrice, setBulkOfficePrice] = useState<number>(400);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadPricing = async () => {
    const list = await getDeliveryPricing();
    setPricingList(list);
    setLoading(false);
  };

  useEffect(() => {
    loadPricing();
  }, []);

  const handlePriceChange = (wilayaId: number, field: "home" | "office", value: number) => {
    setPricingList((prev) =>
      prev.map((item) => {
        if (item.wilaya_id === wilayaId) {
          return {
            ...item,
            [field === "home" ? "home_delivery_price" : "office_delivery_price"]: Math.max(0, value),
          };
        }
        return item;
      })
    );
  };

  const handleSaveRow = async (wilayaId: number) => {
    const row = pricingList.find((p) => p.wilaya_id === wilayaId);
    if (!row) return;

    await updateWilayaPricing(wilayaId, row.home_delivery_price, row.office_delivery_price);
    setSavedWilayaId(wilayaId);
    setTimeout(() => setSavedWilayaId(null), 2000);
  };

  const handleBulkApply = async (category: "all" | "south" | "north") => {
    const southernWilayaIds = [1, 3, 7, 8, 11, 30, 32, 33, 37, 39, 45, 47, 49, 50, 52, 53, 54, 55, 56, 57, 58];
    
    let targetIds: number[] = [];
    if (category === "all") {
      targetIds = ALGERIA_WILAYAS.map((w) => w.id);
    } else if (category === "south") {
      targetIds = southernWilayaIds;
    } else {
      targetIds = ALGERIA_WILAYAS.map((w) => w.id).filter((id) => !southernWilayaIds.includes(id));
    }

    for (const id of targetIds) {
      await updateWilayaPricing(id, bulkHomePrice, bulkOfficePrice);
    }

    await loadPricing();
    setShowBulkModal(false);
    alert(locale === "ar" ? "تم تحديث أسعار الولايات المحددة بنجاح" : "Tarifs mis à jour en masse avec succès");
  };

  const filteredList = pricingList.filter((item) => {
    const wilaya = getWilayaById(item.wilaya_id);
    if (!wilaya) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      wilaya.name_ar.includes(q) ||
      wilaya.name_fr.toLowerCase().includes(q) ||
      wilaya.code.includes(q)
    );
  });

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-bold">
        جاري تحميل أسعار التوصيل للـ 58 ولاية...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
            {locale === "ar" ? "إدارة أسعار التوصيل (58 ولاية)" : "Tarifs de Livraison (58 Wilayas)"}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            {locale === "ar"
              ? "حدد تكلفة التوصيل لكل ولاية (للمنزل أو المكتب). الأسعار تطبق فوراً في استمارة الطلب بالمتجر."
              : "Modifiez les prix de livraison à domicile ou en point relais pour chaque wilaya."}
          </p>
        </div>

        {/* Bulk Update Modal Trigger */}
        <button
          onClick={() => setShowBulkModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{locale === "ar" ? "تعديل جماعي للأسعار (Bulk)" : "Mise à jour groupée"}</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-sand-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-charcoal-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === "ar" ? "ابحث باسم الولاية أو رقمها..." : "Rechercher par nom ou code..."}
            className="w-full ps-10 pe-4 py-2 rounded-xl border border-sand-300 text-xs focus:border-orange-500 transition-colors"
          />
        </div>
        <span className="text-xs font-bold text-charcoal-500 whitespace-nowrap">
          {filteredList.length} / 58 {locale === "ar" ? "ولاية" : "wilayas"}
        </span>
      </div>

      {/* 58 WILAYAS PRICING TABLE */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-sand-100 text-navy-950 font-bold uppercase tracking-wider border-b border-sand-200">
              <tr>
                <th className="px-4 py-3.5 text-start w-16">{locale === "ar" ? "الرقم" : "Code"}</th>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "اسم الولاية" : "Wilaya"}</th>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "سعر التوصيل للمنزل (د.ج)" : "Domicile (DZD)"}</th>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "سعر الاستلام من المكتب (د.ج)" : "Point Relais (DZD)"}</th>
                <th className="px-4 py-3.5 text-end w-32">{locale === "ar" ? "حفظ" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {filteredList.map((item) => {
                const wilaya = getWilayaById(item.wilaya_id);
                if (!wilaya) return null;
                const isSaved = savedWilayaId === item.wilaya_id;

                return (
                  <tr key={item.wilaya_id} className="hover:bg-sand-50 transition-colors">
                    {/* Code */}
                    <td className="px-4 py-3 font-mono font-bold text-navy-950">
                      {wilaya.code}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 font-bold text-navy-950">
                      <span>{locale === "ar" ? wilaya.name_ar : wilaya.name_fr}</span>
                      <span className="text-[11px] text-charcoal-400 ms-2 font-normal">
                        ({locale === "ar" ? wilaya.name_fr : wilaya.name_ar})
                      </span>
                    </td>

                    {/* Home Delivery Input */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 max-w-[140px]">
                        <input
                          type="number"
                          step={50}
                          min={0}
                          value={item.home_delivery_price}
                          onChange={(e) =>
                            handlePriceChange(item.wilaya_id, "home", Number(e.target.value))
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-sand-300 font-mono font-bold text-xs focus:border-orange-500"
                        />
                        <span className="text-charcoal-400 text-[10px]">د.ج</span>
                      </div>
                    </td>

                    {/* Office Delivery Input */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 max-w-[140px]">
                        <input
                          type="number"
                          step={50}
                          min={0}
                          value={item.office_delivery_price}
                          onChange={(e) =>
                            handlePriceChange(item.wilaya_id, "office", Number(e.target.value))
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-sand-300 font-mono font-bold text-xs focus:border-orange-500"
                        />
                        <span className="text-charcoal-400 text-[10px]">د.ج</span>
                      </div>
                    </td>

                    {/* Save Button */}
                    <td className="px-4 py-3 text-end">
                      <button
                        onClick={() => handleSaveRow(item.wilaya_id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSaved
                            ? "bg-emerald-600 text-white shadow"
                            : "bg-navy-950 hover:bg-orange-500 text-white"
                        }`}
                      >
                        {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                        <span>{isSaved ? (locale === "ar" ? "تم الحفظ" : "Sauvegardé") : (locale === "ar" ? "حفظ" : "Enregistrer")}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BULK PRICING MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-sand-200">
            <div>
              <h3 className="text-xl font-black text-navy-950">
                {locale === "ar" ? "تطبيق أسعار موحدة (Bulk Update)" : "Mise à jour groupée"}
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                {locale === "ar" ? "حدد السعر المراد تطبيقه على مجموعة ولايات دفعة واحدة" : "Définissez un tarif pour un groupe de wilayas"}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  {locale === "ar" ? "سعر التوصيل للمنزل (د.ج):" : "Prix Domicile (DZD):"}
                </label>
                <input
                  type="number"
                  step={50}
                  value={bulkHomePrice}
                  onChange={(e) => setBulkHomePrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-sand-300 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  {locale === "ar" ? "سعر التوصيل للمكتب (د.ج):" : "Prix Point Relais (DZD):"}
                </label>
                <input
                  type="number"
                  step={50}
                  value={bulkOfficePrice}
                  onChange={(e) => setBulkOfficePrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-sand-300 font-mono font-bold text-sm"
                />
              </div>

              <div className="space-y-2 pt-2">
                <span className="block text-xs font-bold text-charcoal-500">
                  {locale === "ar" ? "اختر الفئة لتطبيق الأسعار عليها:" : "Sélectionnez le groupe :"}
                </span>
                <button
                  onClick={() => handleBulkApply("north")}
                  className="w-full py-2.5 px-4 rounded-xl bg-sand-100 hover:bg-orange-50 hover:border-orange-500 border border-sand-300 text-navy-950 font-bold text-xs text-start transition-all"
                >
                  {locale === "ar" ? "1. الولايات الشمالية والوسطى (Alger, Sétif, Oran...)" : "1. Wilayas du Nord & Centre"}
                </button>
                <button
                  onClick={() => handleBulkApply("south")}
                  className="w-full py-2.5 px-4 rounded-xl bg-sand-100 hover:bg-orange-50 hover:border-orange-500 border border-sand-300 text-navy-950 font-bold text-xs text-start transition-all"
                >
                  {locale === "ar" ? "2. الولايات الجنوبية الكبرى (Adrar, Ouargla, Tamanrasset...)" : "2. Wilayas du Grand Sud"}
                </button>
                <button
                  onClick={() => handleBulkApply("all")}
                  className="w-full py-2.5 px-4 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs transition-all text-center"
                >
                  {locale === "ar" ? "تطبيق على جميع الـ 58 ولاية" : "Appliquer aux 58 wilayas"}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-5 py-2 rounded-xl bg-sand-200 text-navy-950 font-bold text-xs hover:bg-sand-300 transition-colors"
              >
                {locale === "ar" ? "إلغاء" : "Annuler"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

