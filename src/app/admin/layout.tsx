"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Truck,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getOrders } from "@/lib/data-service";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAdminAuth();
  const { locale } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unconfirmedCount, setUnconfirmedCount] = useState(0);

  // If visiting /admin/login, render without sidebar shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [user, loading, isLoginPage, router]);

  // Fetch unconfirmed order badge count
  useEffect(() => {
    if (user) {
      getOrders({ status: "new" }).then((orders) => {
        setUnconfirmedCount(orders.length);
      });
    }
  }, [user, pathname]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-sand-100">{children}</div>;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold">جاري تحميل لوحة التحكم...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      href: "/admin",
      label: locale === "ar" ? "الرئيسية والإحصائيات" : "Tableau de Bord",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      href: "/admin/orders",
      label: locale === "ar" ? "إدارة الطلبات" : "Commandes",
      icon: ShoppingBag,
      badge: unconfirmedCount > 0 ? unconfirmedCount : null,
    },
    {
      href: "/admin/products",
      label: locale === "ar" ? "إدارة المنتجات" : "Produits",
      icon: Package,
      badge: null,
    },
    {
      href: "/admin/categories",
      label: locale === "ar" ? "التصنيفات" : "Catégories",
      icon: Layers,
      badge: null,
    },
    {
      href: "/admin/delivery-pricing",
      label: locale === "ar" ? "أسعار التوصيل (58 ولاية)" : "Tarifs Livraison (58)",
      icon: Truck,
      badge: null,
    },
    {
      href: "/admin/customers",
      label: locale === "ar" ? "فحص الزبائن المتكررين" : "Recherche Clients",
      icon: Users,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen flex bg-sand-100/60 text-charcoal-900 font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 bg-navy-950 text-sand-50 border-e border-navy-800 shrink-0">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-navy-850">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white flex items-center justify-center text-orange-600 font-black text-xl shadow-lg shadow-black/20 border border-white/30 shrink-0 p-1">
              <span>HK</span>
              <img
                src="/logo.png"
                alt="Hidhab Kaizen"
                className="absolute inset-0 w-full h-full object-contain p-0.5 bg-white"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white block tracking-tight">
                {locale === "ar" ? "هضاب كايزن" : "Hidhab Kaizen"}
              </span>
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                {locale === "ar" ? "لوحة الإدارة المركزية" : "Panneau Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  active
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                    : "text-sand-200 hover:text-white hover:bg-navy-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-black ${active ? "bg-white text-orange-600" : "bg-orange-500 text-white animate-pulse"}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Storefront Link */}
        <div className="p-4 border-t border-navy-850 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-sand-300 hover:text-white hover:bg-navy-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
              <span>{locale === "ar" ? "معاينة المتجر" : "Voir la boutique"}</span>
            </div>
          </Link>

          <div className="flex items-center justify-between p-3 rounded-xl bg-navy-900 border border-navy-800">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-navy-800 flex items-center justify-center text-orange-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="truncate text-start">
                <span className="block text-xs font-bold text-white truncate">{user.email}</span>
                <span className="text-[10px] text-orange-400 uppercase font-semibold">{user.role}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-sand-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-navy-950 text-white px-4 h-16 flex items-center justify-between border-b border-navy-800 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white flex items-center justify-center text-orange-600 font-black text-xs shrink-0 p-0.5 border border-white/20">
            <span>HK</span>
            <img
              src="/logo.png"
              alt="Hidhab Kaizen"
              className="absolute inset-0 w-full h-full object-contain bg-white"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <span className="font-bold text-sm">Hidhab Admin</span>
        </div>
        <div className="flex items-center gap-3">
          {unconfirmedCount > 0 && (
            <Link href="/admin/orders" className="relative p-2 text-orange-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 end-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                {unconfirmedCount}
              </span>
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-sand-100 focus:outline-none"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-navy-950/95 pt-20 px-6 pb-6 flex flex-col justify-between">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold ${
                    active ? "bg-orange-500 text-white" : "text-sand-100 hover:bg-navy-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-white text-orange-600">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="pt-6 border-t border-navy-800 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm text-sand-300 font-bold"
            >
              <ExternalLink className="w-4 h-4 text-orange-400" />
              <span>{locale === "ar" ? "العودة للمتجر" : "Retour à la boutique"}</span>
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 font-bold text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>{locale === "ar" ? "تسجيل الخروج" : "Déconnexion"}</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN ADMIN CONTENT STAGE */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 pt-20 lg:pt-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}

