"use client";

import React, { useState } from "react";
import { Search, ShieldAlert, ShieldCheck, AlertCircle, ShoppingBag, Phone, MapPin, Calendar, Clock, DollarSign } from "lucide-react";
import { getCustomerHistoryByPhone, CustomerHistory } from "@/lib/data-service";
import { formatDZD, formatDate } from "@/lib/utils";
import { getWilayaById } from "@/data/algeria-data";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminCustomerLookupPage() {
  const { locale } = useLanguage();
  const [phoneQuery, setPhoneQuery] = useState("");
  const [customerData, setCustomerData] = useState<CustomerHistory | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneQuery.trim()) return;

    setLoading(true);
    const res = await getCustomerHistoryByPhone(phoneQuery.trim());
    setCustomerData(res);
    setHasSearched(true);
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
          {locale === "ar" ? "فحص الزبائن المتكررين وحماية الشحن" : "Historique & Détection Faux Ordres"}
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
          {locale === "ar"
            ? "أداة ذكية للبحث برقم الهاتف لكشف الزبائن الأوفياء وتمييز محترفي الطلبات الوهمية قبل تسليم الطرد لشركة الشحن."
            : "Vérifiez la fiabilité d'un numéro de téléphone avant d'engager les frais d'expédition."}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm max-w-2xl">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-charcoal-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              placeholder="مثال: 0550123456 أو 0661987654"
              dir="ltr"
              className="w-full ps-10 pe-4 py-3 rounded-xl border border-sand-300 font-mono text-sm focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? "..." : (locale === "ar" ? "فحص سجل الزبون" : "Rechercher")}</span>
          </button>
        </form>

        {/* Quick hint buttons */}
        <div className="mt-3 flex items-center gap-2 text-xs text-charcoal-400">
          <span>{locale === "ar" ? "أرقام تجريبية سريعة:" : "Exemples :"}</span>
          <button
            type="button"
            onClick={() => setPhoneQuery("0550123456")}
            className="text-orange-600 font-mono hover:underline"
          >
            0550123456
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setPhoneQuery("0661987654")}
            className="text-orange-600 font-mono hover:underline"
          >
            0661987654
          </button>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      {hasSearched && (
        <>
          {customerData ? (
            <div className="space-y-6">
              
              {/* Profile & Trust Score Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-6">
                  <div>
                    <span className="text-xs font-bold text-charcoal-400 block mb-1">
                      {locale === "ar" ? "بيانات صاحب الرقم:" : "Identité du client :"}
                    </span>
                    <h2 className="text-2xl font-black text-navy-950 flex items-center gap-2">
                      <span>{customerData.customerName}</span>
                      <span className="font-mono text-sm text-charcoal-500 font-normal" dir="ltr">
                        ({customerData.phone})
                      </span>
                    </h2>
                  </div>

                  {/* Trust Score Badge */}
                  <div>
                    {customerData.trustScore === "high" && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-extrabold text-sm">
                        <ShieldCheck className="w-5 h-5" />
                        <span>{locale === "ar" ? "زبون موثوق ومضمون (VIP)" : "Client Fiable (VIP)"}</span>
                      </div>
                    )}
                    {customerData.trustScore === "medium" && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-700 font-extrabold text-sm">
                        <Clock className="w-5 h-5" />
                        <span>{locale === "ar" ? "زبون اعتيادي (سجل طبيعي)" : "Client Standard"}</span>
                      </div>
                    )}
                    {customerData.trustScore === "risk" && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 font-extrabold text-sm animate-pulse">
                        <ShieldAlert className="w-5 h-5" />
                        <span>{locale === "ar" ? "تنبيه: مخاطرة عالية / إلغاءات سابقة" : "Risque Élevé d'Annulation"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                  <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200">
                    <span className="text-xs text-charcoal-400 font-bold block">{locale === "ar" ? "إجمالي الطلبات:" : "Total Commandes:"}</span>
                    <span className="text-2xl font-black text-navy-950">{customerData.totalOrders}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-xs text-emerald-700 font-bold block">{locale === "ar" ? "طلبات مستلمة (ناجحة):" : "Commandes Livrées:"}</span>
                    <span className="text-2xl font-black text-emerald-900">{customerData.deliveredOrders}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                    <span className="text-xs text-red-700 font-bold block">{locale === "ar" ? "طلبات ملغاة / مسترجعة:" : "Annulées / Retours:"}</span>
                    <span className="text-2xl font-black text-red-900">{customerData.cancelledOrders + customerData.returnedOrders}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                    <span className="text-xs text-orange-700 font-bold block">{locale === "ar" ? "إجمالي الإنفاق كاش:" : "Total Dépensé (COD):"}</span>
                    <span className="text-xl font-black text-orange-900">{formatDZD(customerData.totalSpentDZD, locale)}</span>
                  </div>
                </div>
              </div>

              {/* Past Order History Table */}
              <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-black text-navy-950">
                  {locale === "ar" ? "سجل كافة الطلبيات السابقة لهذا الهاتف" : "Historique complet des commandes"}
                </h3>

                <div className="divide-y divide-sand-100">
                  {customerData.orders.map((o) => {
                    const wilaya = getWilayaById(o.wilaya_id);
                    return (
                      <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-orange-600">{o.order_number}</span>
                            <span className="text-charcoal-400">•</span>
                            <span className="text-charcoal-500">{formatDate(o.created_at, locale)}</span>
                          </div>
                          <span className="font-bold text-navy-950 block text-sm">
                            {wilaya?.name_ar} - {o.commune_name} ({o.precise_address})
                          </span>
                          {o.internal_notes && (
                            <span className="inline-block p-1.5 rounded bg-sand-100 text-charcoal-700 text-[11px]">
                              {locale === "ar" ? "ملاحظة الفريق:" : "Note interne:"} {o.internal_notes}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 sm:text-end">
                          <div>
                            <span className="font-black text-base text-navy-950 block">{formatDZD(o.total_price, locale)}</span>
                            <span className="text-[10px] text-charcoal-400 capitalize">{o.delivery_type === "home" ? "منزل" : "مكتب"}</span>
                          </div>
                          <span className="px-3 py-1 rounded-lg font-bold uppercase text-[11px] bg-sand-100 border border-sand-300">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-sand-200 text-center space-y-3 max-w-2xl">
              <AlertCircle className="w-12 h-12 text-charcoal-400 mx-auto" />
              <h3 className="text-lg font-bold text-navy-950">
                {locale === "ar" ? "لا توجد أي طلبيات مسجلة بهذا الرقم" : "Aucun historique pour ce numéro"}
              </h3>
              <p className="text-xs text-charcoal-500">
                {locale === "ar"
                  ? "هذا الرقم جديد كلياً في قاعدة البيانات ولم يسبق له إجراء طلبية من قبل."
                  : "Nouveau client potentiel sans commande antérieure enregistrée."}
              </p>
            </div>
          )}
        </>
      )}

    </div>
  );
}

