"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Printer,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  XCircle,
  MessageSquare,
  FileText,
  User,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";
import {
  getOrders,
  getProducts,
  updateOrderStatus,
  updateOrderInternalNotes,
  Order,
  OrderStatus,
  Product,
} from "@/lib/data-service";
import { ALGERIA_WILAYAS, getWilayaById } from "@/data/algeria-data";
import { formatDZD, formatDate, exportOrdersToCSV } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label_ar: string; label_fr: string; color: string; bg: string; icon: any }
> = {
  new: { label_ar: "جديد", label_fr: "Nouveau", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Clock },
  confirmed: { label_ar: "مؤكد", label_fr: "Confirmé", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: CheckCircle2 },
  shipped: { label_ar: "تم الشحن", label_fr: "Expédié", color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: Truck },
  delivered: { label_ar: "تم التوصيل", label_fr: "Livré", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  cancelled: { label_ar: "ملغى", label_fr: "Annulé", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
  returned: { label_ar: "مسترجع", label_fr: "Retourné", color: "text-gray-700", bg: "bg-gray-100 border-gray-300", icon: RotateCcw },
};

export default function AdminOrdersPage() {
  const { locale } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [wilayaFilter, setWilayaFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Selected Order for Drawer Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [internalNoteText, setInternalNoteText] = useState("");

  const refreshData = async () => {
    const [ords, prods] = await Promise.all([getOrders(), getProducts(false)]);
    setOrders(ords);
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    await refreshData();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSaveInternalNote = async () => {
    if (!selectedOrder) return;
    await updateOrderInternalNotes(selectedOrder.id, internalNoteText);
    await refreshData();
    setSelectedOrder((prev) => (prev ? { ...prev, internal_notes: internalNoteText } : null));
    alert(locale === "ar" ? "تم حفظ الملاحظة الداخلية بنجاح" : "Remarque interne enregistrée");
  };

  // Filtered orders calculation
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status Filter
      if (statusFilter !== "all" && o.status !== statusFilter) return false;

      // Wilaya Filter
      if (wilayaFilter !== "all" && o.wilaya_id !== Number(wilayaFilter)) return false;

      // Date Filter
      if (dateFilter === "today") {
        const isToday = new Date(o.created_at).toDateString() === new Date().toDateString();
        if (!isToday) return false;
      } else if (dateFilter === "7days") {
        const pastWeek = Date.now() - 7 * 86400000;
        if (new Date(o.created_at).getTime() < pastWeek) return false;
      } else if (dateFilter === "30days") {
        const pastMonth = Date.now() - 30 * 86400000;
        if (new Date(o.created_at).getTime() < pastMonth) return false;
      }

      // Search Query (Customer name, phone, order number)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = o.customer_name.toLowerCase().includes(q);
        const matchesPhone = o.phone.includes(q);
        const matchesRef = o.order_number.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesRef) return false;
      }

      return true;
    });
  }, [orders, statusFilter, wilayaFilter, dateFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
            {locale === "ar" ? "إدارة ومتابعة الطلبيات" : "Gestion des Commandes"}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            {locale === "ar"
              ? `إجمالي ${filteredOrders.length} طلبية مطابقة للفلاتر الحالية`
              : `${filteredOrders.length} commandes correspondent aux filtres`}
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={() => exportOrdersToCSV(filteredOrders)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs shadow-sm transition-colors"
        >
          <Download className="w-4 h-4 text-orange-400" />
          <span>{locale === "ar" ? "تصدير إلى ملف CSV" : "Exporter CSV"}</span>
        </button>
      </div>

      {/* FILTERS & SEARCH TOOLBAR */}
      <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-charcoal-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === "ar" ? "بحث: الاسم، الهاتف، أو رقم الطلب..." : "Recherche: Nom, tél, réf..."}
              className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-sand-300 text-xs focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs bg-white text-navy-950"
          >
            <option value="all">{locale === "ar" ? "جميع الحالات" : "Tous les statuts"}</option>
            <option value="new">{locale === "ar" ? "جديد (غير مؤكد)" : "Nouveau"}</option>
            <option value="confirmed">{locale === "ar" ? "مؤكد" : "Confirmé"}</option>
            <option value="shipped">{locale === "ar" ? "تم الشحن" : "Expédié"}</option>
            <option value="delivered">{locale === "ar" ? "تم التوصيل" : "Livré"}</option>
            <option value="cancelled">{locale === "ar" ? "ملغى" : "Annulé"}</option>
            <option value="returned">{locale === "ar" ? "مسترجع" : "Retourné"}</option>
          </select>

          {/* Wilaya Filter */}
          <select
            value={wilayaFilter}
            onChange={(e) => setWilayaFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs bg-white text-navy-950"
          >
            <option value="all">{locale === "ar" ? "كل الولايات (58 ولاية)" : "Toutes les wilayas"}</option>
            {ALGERIA_WILAYAS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.code} - {locale === "ar" ? w.name_ar : w.name_fr}
              </option>
            ))}
          </select>

          {/* Date Range Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs bg-white text-navy-950"
          >
            <option value="all">{locale === "ar" ? "كافة التواريخ" : "Toutes les dates"}</option>
            <option value="today">{locale === "ar" ? "طلبات اليوم فقط" : "Aujourd'hui"}</option>
            <option value="7days">{locale === "ar" ? "آخر 7 أيام" : "7 derniers jours"}</option>
            <option value="30days">{locale === "ar" ? "آخر 30 يوم" : "30 derniers jours"}</option>
          </select>

        </div>
      </div>

      {/* ORDERS DATA TABLE */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-sand-100 text-navy-950 font-bold uppercase tracking-wider border-b border-sand-200">
              <tr>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "الطلب" : "Réf"}</th>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "الزبون والهاتف" : "Client & Tél"}</th>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "الوجهة" : "Destination"}</th>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "المنتج والكمية" : "Produit & Qté"}</th>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "المبلغ الكلي" : "Total DZD"}</th>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "الحالة" : "Statut"}</th>
                <th className="px-4 py-3.5 text-end">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const product = products.find((p) => p.id === order.product_id);
                  const wilaya = getWilayaById(order.wilaya_id);
                  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.new;

                  return (
                    <tr key={order.id} className="hover:bg-sand-50/70 transition-colors">
                      {/* Ref & Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-navy-950 block">{order.order_number}</span>
                        <span className="text-[10px] text-charcoal-400">{formatDate(order.created_at, locale)}</span>
                      </td>

                      {/* Customer & Phone */}
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-navy-950 block">{order.customer_name}</span>
                        <span className="font-mono text-charcoal-500" dir="ltr">{order.phone}</span>
                      </td>

                      {/* Wilaya & Address */}
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-navy-950 block">
                          {wilaya ? (locale === "ar" ? wilaya.name_ar : wilaya.name_fr) : order.wilaya_id}
                          {order.commune_name ? ` - ${order.commune_name}` : ""}
                        </span>
                        <span className="text-[10px] text-charcoal-500 truncate max-w-[160px] block">
                          {order.precise_address}
                        </span>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-navy-950 block truncate max-w-[180px]">
                          {product ? (locale === "ar" ? product.name_ar : product.name_fr) : "منتج"}
                        </span>
                        <span className="text-orange-600 font-bold">{order.quantity}x قطعة</span>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-black text-sm text-navy-950 block">
                          {formatDZD(order.total_price, locale)}
                        </span>
                        <span className="text-[10px] text-charcoal-400">
                          {locale === "ar" ? `(توصيل: ${order.delivery_price})` : `(Livraison: ${order.delivery_price})`}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:ring-0 ${statusInfo.bg} ${statusInfo.color}`}
                        >
                          <option value="new">{STATUS_CONFIG.new.label_ar}</option>
                          <option value="confirmed">{STATUS_CONFIG.confirmed.label_ar}</option>
                          <option value="shipped">{STATUS_CONFIG.shipped.label_ar}</option>
                          <option value="delivered">{STATUS_CONFIG.delivered.label_ar}</option>
                          <option value="cancelled">{STATUS_CONFIG.cancelled.label_ar}</option>
                          <option value="returned">{STATUS_CONFIG.returned.label_ar}</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details drawer */}
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setInternalNoteText(order.internal_notes || "");
                            }}
                            className="p-1.5 rounded-lg text-navy-900 hover:bg-sand-200 transition-colors"
                            title={locale === "ar" ? "تفاصيل الطلب وملاحظات" : "Détails"}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Print Delivery Slip (بيان التوصيل) */}
                          <Link
                            href={`/admin/orders/${order.id}/slip`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
                            title={locale === "ar" ? "طباعة بيان التوصيل" : "Bordereau de livraison"}
                          >
                            <Printer className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-charcoal-400 font-bold">
                    {locale === "ar" ? "لا توجد أي طلبيات تطابق هذه الشروط" : "Aucune commande trouvée."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS & INTERNAL NOTES DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-sand-200">
            
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-orange-600">{selectedOrder.order_number}</span>
                <h3 className="text-xl font-black text-navy-950">{locale === "ar" ? "تفاصيل الطلب الكاملة" : "Fiche Commande"}</h3>
              </div>
              <Link
                href={`/admin/orders/${selectedOrder.id}/slip`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 font-bold text-xs hover:bg-orange-100"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{locale === "ar" ? "طباعة بيان التوصيل" : "Imprimer bordereau"}</span>
              </Link>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-sand-50 p-4 rounded-2xl border border-sand-200">
              <div>
                <span className="text-charcoal-400 font-medium">{locale === "ar" ? "الاسم:" : "Nom:"}</span>
                <span className="font-bold text-navy-950 block">{selectedOrder.customer_name}</span>
              </div>
              <div>
                <span className="text-charcoal-400 font-medium">{locale === "ar" ? "الهاتف:" : "Tél:"}</span>
                <span className="font-bold font-mono text-navy-950 block" dir="ltr">{selectedOrder.phone}</span>
              </div>
              <div>
                <span className="text-charcoal-400 font-medium">{locale === "ar" ? "الولاية والبلدية:" : "Wilaya/Commune:"}</span>
                <span className="font-bold text-navy-950 block">
                  {getWilayaById(selectedOrder.wilaya_id)?.name_ar} ({selectedOrder.commune_name})
                </span>
              </div>
              <div>
                <span className="text-charcoal-400 font-medium">{locale === "ar" ? "نوع التوصيل:" : "Mode:"}</span>
                <span className="font-bold text-orange-600 block">
                  {selectedOrder.delivery_type === "home" ? "توصيل للمنزل" : "استلام من المكتب"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-charcoal-400 font-medium">{locale === "ar" ? "العنوان الدقيق:" : "Adresse:"}</span>
                <span className="font-bold text-navy-950 block">{selectedOrder.precise_address}</span>
              </div>
              {selectedOrder.customer_note && (
                <div className="col-span-2 bg-amber-50 p-2 rounded-lg border border-amber-200 text-amber-900">
                  <span className="font-bold block mb-0.5">{locale === "ar" ? "ملاحظة الزبون:" : "Note client:"}</span>
                  <span>{selectedOrder.customer_note}</span>
                </div>
              )}
            </div>

            {/* Internal Staff Notes (Section 6.5) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-navy-950 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-orange-500" />
                <span>{locale === "ar" ? "ملاحظات وتوجيهات الفريق الداخلية (خاص بالإدارة)" : "Remarques internes de l'équipe"}</span>
              </label>
              <textarea
                rows={3}
                value={internalNoteText}
                onChange={(e) => setInternalNoteText(e.target.value)}
                placeholder={locale === "ar" ? "مثال: تم الاتصال، الزبون طلب الشحن يوم الأحد، رقم تتبع ياليدين YAL-..." : "Notes d'appels ou suivi transporteur..."}
                className="w-full p-3 rounded-xl border border-sand-300 text-xs focus:border-orange-500"
              />
              <button
                onClick={handleSaveInternalNote}
                className="px-4 py-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs"
              >
                {locale === "ar" ? "حفظ الملاحظة" : "Enregistrer la remarque"}
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 rounded-xl bg-sand-200 text-navy-950 font-bold text-xs hover:bg-sand-300 transition-colors"
              >
                {locale === "ar" ? "إغلاق" : "Fermer"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

