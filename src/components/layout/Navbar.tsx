"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { locale, toggleLocale, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact navigation items in exact order requested:
  // 1. Logo
  // 2. Products (المنتجات)
  // 3. Location (الموقع)
  // 4. Contact (اتصل بنا)
  const navLinks = [
    { href: "/#products-section", label: t.nav.products },
    { href: "/location", label: t.nav.location },
    { href: "/contact", label: t.nav.contact },
  ];

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" || pathname.startsWith("/products/");
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-950/95 backdrop-blur-md border-b border-navy-800 text-sand-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Navigation Group: Logo + Ordered Links */}
        <div className="flex items-center gap-8 md:gap-12">
          {/* Logo (leftmost in LTR, rightmost in RTL) */}
          <Link
            href="/"
            className="group flex items-center gap-3.5 text-left focus:outline-none py-1"
          >
            <div className="relative w-13 h-13 sm:w-15 sm:h-15 rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-lg shadow-black/30 border border-white/40 group-hover:scale-105 transition-transform shrink-0 p-1">
              <span className="text-orange-600 font-black text-2xl tracking-tighter">HK</span>
              {/* Custom logo loaded from public/logo.png with white background */}
              <img
                src="/logo.png"
                alt="Hidhab Kaizen"
                className="absolute inset-0 w-full h-full object-contain p-0.5 bg-white"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white group-hover:text-orange-400 transition-colors font-sans">
                Hidhab Kaizen
              </span>
              <span className="text-[10px] sm:text-[11px] text-orange-400 font-bold tracking-wider uppercase">
                {locale === "ar" ? "الدفع عند الاستلام" : "Paiement à la Livraison"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links in strict sequence */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-lg ${
                    active ? "text-orange-400" : "text-sand-100/80 hover:text-white hover:bg-navy-900/60"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange-500 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls: Language Toggle */}
        <div className="flex items-center gap-3">
          {/* Language Switcher Button (AR / FR) */}
          <button
            onClick={toggleLocale}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-navy-700 bg-navy-900/80 hover:bg-navy-850 hover:border-orange-500/50 text-xs font-bold text-sand-100 transition-all shadow-sm focus:ring-2 focus:ring-orange-500/30"
            title={locale === "ar" ? "Passer en Français" : "التحويل إلى العربية"}
          >
            <Globe className="w-3.5 h-3.5 text-orange-400" />
            <span className="tracking-wide">{locale === "ar" ? "FR" : "عربي"}</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-navy-900 text-sand-100 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-900 border-b border-navy-800 px-6 py-5 space-y-3"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-base font-semibold text-sand-100 hover:text-orange-400 border-b border-navy-800/50"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

