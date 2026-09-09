"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Printer, ArrowLeft, ArrowRight, ShieldCheck, Phone, MapPin, Truck } from "lucide-react";
import { getOrderById, getProductById, Order, Product } from "@/lib/data-service";
import { getWilayaById } from "@/data/algeria-data";
import { formatDZD } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function DeliverySlipPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, dir } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getOrderById(id).then(async (ord) => {
      if (ord) {
        setOrder(ord);
        const prod = await getProductById(ord.product_id);
        if (prod) setProduct(prod);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-sm font-bold">جاري تجهيز بيان التوصيل...</div>;
  }

  if (!order) {
    return <div className="p-12 text-center text-sm text-red-500 font-bold">لم يتم العثور على الطلب.</div>;
  }

  const wilaya = getWilayaById(order.wilaya_id);

  return (
    <div className="min-h-screen bg-sand-100 p-4 sm:p-8 flex flex-col items-center">
      
      {/* Non-printable Control Toolbar */}
      <div className="no-print w-full max-w-3xl flex items-center justify-between mb-6">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-sand-300 text-xs font-bold text-navy-950 shadow-sm"
        >
          {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{locale === "ar" ? "الرجوع للطلبات" : "Retour"}</span>
        </button>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>{locale === "ar" ? "طباعة بيان التوصيل الآن" : "Imprimer le bordereau"}</span>
        </button>
      </div>

      {/* PRINTABLE SLIP CONTAINER (A5 / Thermal format) */}
      <div className="delivery-slip-sheet w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-sand-300 p-8 text-black space-y-6">
        
        {/* Header Strip: Logo + Slip Title + Barcode */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-black text-xl">
              HK
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">
                {locale === "ar" ? "هضاب كايزن | بيان توصيل طرد" : "HIDHAB KAIZEN | BORDEREAU DE LIVRAISON"}
              </h1>
              <p className="text-xs text-gray-700">
                {locale === "ar" ? "التجارة الإلكترونية - الدفع عند الاستلام (COD)" : "E-commerce - Paiement à la livraison (COD)"}
              </p>
            </div>
          </div>

          {/* Barcode Mock Visual */}
          <div className="text-end">
            <div className="font-mono text-xs font-bold tracking-widest">{order.order_number}</div>
            <div className="h-9 w-36 bg-black flex items-center justify-center text-white text-[9px] font-mono tracking-widest mt-1">
              ||| | |||| || ||| ||||
            </div>
          </div>
        </div>

        {/* Sender & Carrier Info */}
        <div className="grid grid-cols-2 gap-4 text-xs p-3.5 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <span className="font-bold text-gray-500 block">{locale === "ar" ? "المرسل (Expéditeur):" : "Expéditeur:"}</span>
            <span className="font-bold text-sm">متجر هضاب كايزن (Hidhab Kaizen)</span>
            <span className="block text-gray-700">سطيف، الجزائر • هاتف: 0550123456</span>
          </div>
          <div>
            <span className="font-bold text-gray-500 block">{locale === "ar" ? "شركة النقل والشحن:" : "Transporteur:"}</span>
            <span className="font-bold text-sm">Yalidine / ZR Express / Procolis</span>
            <span className="block text-gray-700">{order.delivery_type === "home" ? "توصيل للعنوان (Domicile)" : "استلام من المكتب (Stop Desk)"}</span>
          </div>
        </div>

        {/* RECIPIENT INFORMATION (Destinataire) - PROMINENT */}
        <div className="border-2 border-black rounded-2xl p-5 space-y-3 bg-white">
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <span className="font-black text-xs uppercase tracking-wider text-gray-600">
              {locale === "ar" ? "بيانات الزبون المستلم (Destinataire)" : "INFORMATIONS DESTINATAIRE"}
            </span>
            <span className="px-3 py-1 rounded-md bg-black text-white text-xs font-bold">
              {wilaya?.code} - {wilaya?.name_ar} ({wilaya?.name_fr})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500 block">{locale === "ar" ? "اسم الزبون:" : "Nom complet:"}</span>
              <span className="text-lg font-black">{order.customer_name}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">{locale === "ar" ? "رقم الهاتف للتواصل:" : "Téléphone:"}</span>
              <span className="text-lg font-black font-mono" dir="ltr">{order.phone}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-xs text-gray-500 block">{locale === "ar" ? "البلدية والعنوان الدقيق:" : "Commune & Adresse:"}</span>
              <span className="text-sm font-bold block">
                {order.commune_name ? `${order.commune_name} • ` : ""} {order.precise_address}
              </span>
            </div>
            {order.customer_note && (
              <div className="sm:col-span-2 p-2 bg-yellow-50 border border-yellow-200 text-xs rounded-lg">
                <span className="font-bold">{locale === "ar" ? "ملاحظة خاصة:" : "Note:"}</span> {order.customer_note}
              </div>
            )}
          </div>
        </div>

        {/* ITEM & PRICING TABLE */}
        <div className="border border-black rounded-xl overflow-hidden text-xs">
          <table className="w-full text-start">
            <thead className="bg-black text-white font-bold uppercase">
              <tr>
                <th className="p-3 text-start">{locale === "ar" ? "بيان السلعة" : "Désignation"}</th>
                <th className="p-3 text-center">{locale === "ar" ? "الكمية" : "Qté"}</th>
                <th className="p-3 text-end">{locale === "ar" ? "السعر الإفرادي" : "Prix unitaire"}</th>
                <th className="p-3 text-end">{locale === "ar" ? "المجموع" : "Total"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-3 font-bold">
                  {product ? (locale === "ar" ? product.name_ar : product.name_fr) : "منتج هضاب كايزن"}
                </td>
                <td className="p-3 text-center font-bold text-sm">{order.quantity}</td>
                <td className="p-3 text-end font-mono">{formatDZD(order.product_price / order.quantity, locale)}</td>
                <td className="p-3 text-end font-mono font-bold">{formatDZD(order.product_price, locale)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td colSpan={3} className="p-3 text-end font-bold text-gray-600">
                  {locale === "ar" ? "تكلفة التوصيل (Frais de livraison):" : "Frais de livraison:"}
                </td>
                <td className="p-3 text-end font-mono font-bold">{formatDZD(order.delivery_price, locale)}</td>
              </tr>
              <tr className="bg-gray-100 text-base">
                <td colSpan={2} className="p-3 font-black text-black">
                  {locale === "ar" ? "المبلغ المستحق للدفع عند الاستلام (COD):" : "MONTANT NET À ENCAISSER (COD):"}
                </td>
                <td colSpan={2} className="p-3 text-end font-black text-xl text-black">
                  {formatDZD(order.total_price, locale)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Courier Instructions & Stamp Area */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-300 text-xs">
          <div className="space-y-1 text-gray-600">
            <span className="font-bold text-black block">{locale === "ar" ? "تعليمات عون التوصيل:" : "Consignes livreur:"}</span>
            <p>1. {locale === "ar" ? "السماح للزبون بمعاينة الطرد والتأكد منه." : "Vérification du colis autorisée avant remise."}</p>
            <p>2. {locale === "ar" ? "تحصيل المبلغ كاش كاملاً قبل تسليم المنتج." : "Encaisser la somme exacte en espèces."}</p>
            <p>3. {locale === "ar" ? "في حال عدم الرد، الاتصال مرتين قبل تسجيل الفشل." : "Contacter 2 fois avant tout signalement d'échec."}</p>
          </div>

          <div className="border border-dashed border-gray-400 rounded-xl p-4 flex flex-col justify-between h-24 text-center">
            <span className="text-[10px] text-gray-400 uppercase font-bold">
              {locale === "ar" ? "ختم وتوقيع شركة التوصيل / المستلم" : "Signature & Cachet Transporteur"}
            </span>
          </div>
        </div>

        {/* Footer date */}
        <div className="text-[10px] text-gray-400 text-center border-t border-gray-200 pt-2">
          {locale === "ar" ? "طُبع بتاريخ:" : "Imprimé le :"} {new Date().toLocaleString()} • Hidhab Kaizen e-Commerce Logistics
        </div>

      </div>

    </div>
  );
}

