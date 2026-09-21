"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Users,
  DollarSign,
  Package,
  MapPin,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { getAnalytics } from "@/lib/data-service";
import { formatDZD } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboardPage() {
  const { locale } = useLanguage();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [includeDeliveryInRevenue, setIncludeDeliveryInRevenue] = useState(false);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    getAnalytics().then((data) => {
      setAnalytics(data);
      setLoading(false);
    });
  }, []);

  if (loading || !analytics) {
    return (
      <div className="py-20 text-center text-charcoal-500">
        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold">جاري تحميل بيانات الإحصائيات...</p>
      </div>
    );
  }

  // Revenue display based on delivery toggle
  const activeRevenue = includeDeliveryInRevenue
    ? analytics.totalRevenueDelivered
    : analytics.productRevenueDelivered;

  // Chart Data for status pie
  const statusPieData = [
    { name: locale === "ar" ? "جديد" : "Nouveau", value: analytics.statusCounts.new, color: "#3B82F6" },
    { name: locale === "ar" ? "مؤكد" : "Confirmé", value: analytics.statusCounts.confirmed, color: "#F59E0B" },
    { name: locale === "ar" ? "تم الشحن" : "Expédié", value: analytics.statusCounts.shipped, color: "#8B5CF6" },
    { name: locale === "ar" ? "تم التوصيل" : "Livré", value: analytics.statusCounts.delivered, color: "#10B981" },
    { name: locale === "ar" ? "ملغى" : "Annulé", value: analytics.statusCounts.cancelled, color: "#EF4444" },
    { name: locale === "ar" ? "مسترجع" : "Retourné", value: analytics.statusCounts.returned, color: "#6B7280" },
  ].filter((item) => item.value > 0);

  // Revenue trend sample points
  const revenueTrendData = [
    { period: timeRange === "daily" ? "الأحد" : "أسبوع 1", revenue: 24500, orders: 4 },
    { period: timeRange === "daily" ? "الإثنين" : "أسبوع 2", revenue: 42000, orders: 7 },
    { period: timeRange === "daily" ? "الثلاثاء" : "أسبوع 3", revenue: 38900, orders: 6 },
    { period: timeRange === "daily" ? "الأربعاء" : "أسبوع 4", revenue: 56000, orders: 9 },
    { period: timeRange === "daily" ? "الخميس" : "أسبوع 5", revenue: 68400, orders: 11 },
    { period: timeRange === "daily" ? "اليوم" : "أسبوع 6", revenue: activeRevenue, orders: analytics.totalOrdersCount },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
            {locale === "ar" ? "لوحة الإحصائيات والأداء" : "Tableau de Bord & KPIs"}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            {locale === "ar"
              ? "نظرة شاملة على المبيعات، الطلبيات، وإحصائيات التوصيل لكافة الـ 69 ولاية."
              : "Aperçu en temps réel de vos ventes, livraisons et flux COD."}
          </p>
        </div>

        {/* Deliver Pricing Quick Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/delivery-pricing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-sand-300 hover:border-orange-500 text-xs font-bold text-navy-950 shadow-sm transition-colors"
          >
            <Truck className="w-4 h-4 text-orange-500" />
            <span>{locale === "ar" ? "تعديل أسعار الـ 69 ولاية" : "Tarifs 69 Wilayas"}</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{locale === "ar" ? "معاينة الطلبات" : "Gérer Commandes"}</span>
          </Link>
        </div>
      </div>

      {/* OPERATIONAL QUICK ACTION ALERTS (Section 6.5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Quick Action 1: Orders needing confirmation today */}
        <Link
          href="/admin/orders?status=new"
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/15 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-amber-950">
                {locale === "ar" ? "طلبات تحتاج تأكيد اليوم" : "Commandes à confirmer"}
              </span>
              <span className="text-xl font-black text-amber-700">
                {analytics.ordersNeedingConfirmationToday.length} {locale === "ar" ? "طلبية جديدة" : "nouvelles"}
              </span>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>

        {/* Quick Action 2: Orders stuck in Shipped > 3 days */}
        <Link
          href="/admin/orders?status=shipped"
          className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/15 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-purple-950">
                {locale === "ar" ? "شحنات متأخرة (> 3 أيام)" : "Colis en transit (> 3j)"}
              </span>
              <span className="text-xl font-black text-purple-700">
                {analytics.ordersStuckInShipped.length} {locale === "ar" ? "شحنة" : "colis"}
              </span>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>

        {/* Quick Action 3: Low stock warning */}
        <Link
          href="/admin/products"
          className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/15 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center font-black">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-red-950">
                {locale === "ar" ? "تنبيهات انخفاض المخزون" : "Alerte Stock Faible"}
              </span>
              <span className="text-xl font-black text-red-700">
                {analytics.lowStockProducts.length} {locale === "ar" ? "منتجات شارفت على النفاد" : "produits"}
              </span>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-red-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>

      </div>

      {/* CORE KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Revenue with Toggle (Included vs Excluded Delivery) */}
        <div className="p-6 rounded-3xl bg-white border border-sand-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              {locale === "ar" ? "صافي المداخيل المحققة" : "Chiffre d'Affaires"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-navy-950">
              {formatDZD(activeRevenue, locale)}
            </div>
            <div className="text-[11px] text-charcoal-400 mt-1 flex items-center gap-1.5">
              <span>{locale === "ar" ? "سعر التوصيل:" : "Frais de livraison:"}</span>
              <button
                onClick={() => setIncludeDeliveryInRevenue(!includeDeliveryInRevenue)}
                className="text-orange-600 font-bold underline hover:text-orange-700"
              >
                {includeDeliveryInRevenue
                  ? (locale === "ar" ? "مشمول (انقر للاستثناء)" : "Inclus (clic pour exclure)")
                  : (locale === "ar" ? "مستثنى (انقر للتضمين)" : "Exclus (clic pour inclure)")}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-xs text-charcoal-500">
            <span>{locale === "ar" ? "مداخيل المنتجات:" : "Total Produits:"}</span>
            <span className="font-bold">{formatDZD(analytics.productRevenueDelivered, locale)}</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="p-6 rounded-3xl bg-white border border-sand-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              {locale === "ar" ? "إجمالي الطلبات" : "Total Commandes"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-navy-950">
              {analytics.totalOrdersCount}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {analytics.statusCounts.delivered} {locale === "ar" ? "تم تسليمها بنجاح" : "livrées avec succès"}
            </p>
          </div>

          <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-xs text-charcoal-500">
            <span>{locale === "ar" ? "قيد المعالجة والتأكيد:" : "En cours:"}</span>
            <span className="font-bold">{analytics.statusCounts.new + analytics.statusCounts.confirmed}</span>
          </div>
        </div>

        {/* Card 3: Average Order Value (AOV) */}
        <div className="p-6 rounded-3xl bg-white border border-sand-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              {locale === "ar" ? "متوسط قيمة الطلب (AOV)" : "Panier Moyen (AOV)"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-navy-950">
              {formatDZD(analytics.averageOrderValue, locale)}
            </div>
            <p className="text-[11px] text-charcoal-400 mt-1">
              {locale === "ar" ? "محسوب على الطلبات المسلّمة" : "Basé sur commandes livrées"}
            </p>
          </div>

          <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-xs text-charcoal-500">
            <span>{locale === "ar" ? "نسبة نجاح التوصيل:" : "Taux de livraison:"}</span>
            <span className="font-bold text-emerald-600">
              {analytics.totalOrdersCount > 0
                ? Math.round((analytics.statusCounts.delivered / analytics.totalOrdersCount) * 100)
                : 0}%
            </span>
          </div>
        </div>

        {/* Card 4: Cancelled / Return Rate */}
        <div className="p-6 rounded-3xl bg-white border border-sand-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              {locale === "ar" ? "نسبة الإلغاء والاسترجاع" : "Taux d'Annulation"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-navy-950">
              {analytics.cancellationRate}%
            </div>
            <p className="text-[11px] text-charcoal-400 mt-1">
              {analytics.statusCounts.cancelled} {locale === "ar" ? "ملغى" : "annulé"} • {analytics.statusCounts.returned} {locale === "ar" ? "مسترجع" : "retour"}
            </p>
          </div>

          <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-xs text-charcoal-500">
            <span>{locale === "ar" ? "فحص الزبائن:" : "Outil anti-fraude:"}</span>
            <Link href="/admin/customers" className="text-orange-600 font-bold hover:underline">
              {locale === "ar" ? "فحص الهاتف ←" : "Recherche →"}
            </Link>
          </div>
        </div>

      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue & Orders Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-navy-950">
                {locale === "ar" ? "تطور المداخيل والطلبيات عبر الوقت" : "Évolution du Chiffre d'Affaires"}
              </h3>
              <p className="text-xs text-charcoal-500">
                {locale === "ar" ? "متابعة المبيعات وحجم الطرود المسجلة" : "Suivi régulier de l'activité commerciale"}
              </p>
            </div>

            {/* Granularity Switcher */}
            <div className="flex items-center p-1 bg-sand-100 rounded-xl text-xs font-bold max-w-fit">
              <button
                onClick={() => setTimeRange("daily")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === "daily" ? "bg-navy-950 text-white shadow-sm" : "text-charcoal-600 hover:text-navy-950"
                }`}
              >
                {locale === "ar" ? "يومي" : "Jour"}
              </button>
              <button
                onClick={() => setTimeRange("weekly")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === "weekly" ? "bg-navy-950 text-white shadow-sm" : "text-charcoal-600 hover:text-navy-950"
                }`}
              >
                {locale === "ar" ? "أسبوعي" : "Semaine"}
              </button>
              <button
                onClick={() => setTimeRange("monthly")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === "monthly" ? "bg-navy-950 text-white shadow-sm" : "text-charcoal-600 hover:text-navy-950"
                }`}
              >
                {locale === "ar" ? "شهري" : "Mois"}
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="period" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(val: any) => [formatDZD(val, locale), locale === "ar" ? "المداخيل" : "Revenu"]}
                  contentStyle={{ backgroundColor: "#0B1F3A", borderRadius: "12px", border: "none", color: "#FFF" }}
                />
                <Bar dataKey="revenue" fill="#F5821F" radius={[8, 8, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/90 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-navy-950">
              {locale === "ar" ? "توزيع حالات الطلبيات" : "Statut des Commandes"}
            </h3>
            <p className="text-xs text-charcoal-500">
              {locale === "ar" ? "نسبة كل حالة من إجمالي الطلبيات" : "Répartition par étape logistique"}
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [val, name]}
                  contentStyle={{ backgroundColor: "#0B1F3A", borderRadius: "12px", border: "none", color: "#FFF" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {statusPieData.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-charcoal-600 font-medium">{s.name}:</span>
                <span className="font-bold text-navy-950">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* LOGISTICS & BEST SELLERS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Logistics Demand: Orders by Wilaya (Top provinces) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-navy-950 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{locale === "ar" ? "أعلى الولايات طلباً (التخطيط اللوجستي)" : "Wilayas les plus actives"}</span>
              </h3>
              <p className="text-xs text-charcoal-500">
                {locale === "ar" ? "تحديد مناطق الطلب العالي للتركيز على شركات التوصيل المناسبة" : "Optimisez vos accords transporteurs par wilaya"}
              </p>
            </div>
            <Link href="/admin/delivery-pricing" className="text-xs font-bold text-orange-600 hover:underline">
              {locale === "ar" ? "كل الولايات ←" : "Toutes →"}
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {analytics.ordersByWilaya.map((w: any, index: number) => {
              const maxCount = analytics.ordersByWilaya[0]?.count || 1;
              const percent = Math.round((w.count / maxCount) * 100);
              return (
                <div key={w.wilayaId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-navy-950">
                      {w.wilayaId}. {locale === "ar" ? w.name_ar : w.name_fr}
                    </span>
                    <span className="text-orange-600 font-black">{w.count} {locale === "ar" ? "طلبية" : "cmd"}</span>
                  </div>
                  <div className="h-2 w-full bg-sand-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-navy-900 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-navy-950 flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-500" />
                <span>{locale === "ar" ? "المنتجات الأكثر مبيعاً" : "Top Produits Vendus"}</span>
              </h3>
              <p className="text-xs text-charcoal-500">
                {locale === "ar" ? "المنتجات الأعلى تحقيقاً للمداخيل والكميات" : "Classement par volume et revenus"}
              </p>
            </div>
            <Link href="/admin/products" className="text-xs font-bold text-orange-600 hover:underline">
              {locale === "ar" ? "كل المنتجات ←" : "Tous →"}
            </Link>
          </div>

          <div className="divide-y divide-sand-100 pt-1">
            {analytics.bestSellingProducts.map((p: any, idx: number) => (
              <div key={p.productId} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-sand-100 text-charcoal-700 text-xs font-black flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-navy-950 max-w-xs truncate">
                      {locale === "ar" ? p.name_ar : p.name_fr}
                    </span>
                    <span className="text-xs text-charcoal-500">
                      {p.unitsSold} {locale === "ar" ? "قطعة مباعة" : "unités"}
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-orange-600">
                  {formatDZD(p.revenue, locale)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

