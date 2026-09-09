"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Search, CheckCircle2, Truck, ShieldCheck, ArrowDown, PackageX } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/storefront/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { getCategories, getProducts, Product, Category } from "@/lib/data-service";

export default function HomePage() {
  const { locale, t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([getCategories(), getProducts(true)]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error("Failed to load catalog data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter products by selected category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategoryId === "all" || product.category_id === selectedCategoryId;
    const name = locale === "ar" ? product.name_ar : product.name_fr;
    const matchesSearch =
      !searchQuery.trim() || name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-sand-50">
      <Navbar />

      <main className="flex-1">
        {/* EDITORIAL HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-20 sm:py-28">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 end-0 -translate-y-12 translate-x-12 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 translate-y-12 -translate-x-12 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-bold tracking-wide mb-6"
              >
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>{t.hero.badge}</span>
              </motion.div>

              {/* Bold Oversized Typography */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15]"
              >
                {t.hero.titleStart}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300">
                  {t.hero.titleHighlight}
                </span>{" "}
                {t.hero.titleEnd}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-base sm:text-lg text-sand-200 leading-relaxed max-w-2xl font-normal"
              >
                {t.hero.description}
              </motion.p>

              {/* Hero Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <a
                  href="#products-section"
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all"
                >
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowDown className="w-4 h-4" />
                </a>

                <Link
                  href="/location"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-navy-850 hover:bg-navy-800 text-sand-100 font-bold text-sm sm:text-base border border-navy-700 transition-colors"
                >
                  <span>{t.hero.ctaSecondary}</span>
                </Link>
              </motion.div>
            </div>

            {/* Quick Stats Strip */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 pt-8 border-t border-navy-800 grid grid-cols-2 md:grid-cols-3 gap-6"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{t.hero.statDelivery}</div>
                  <div className="text-xs text-sand-400">{t.hero.statDeliverySub}</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{t.hero.statSatisfaction}</div>
                  <div className="text-xs text-sand-400">{t.hero.statSatisfactionSub}</div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{t.hero.statSupport}</div>
                  <div className="text-xs text-sand-400">{t.hero.statSupportSub}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PRODUCTS CATALOG SECTION */}
        <section id="products-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200/60 text-navy-950 text-xs font-bold uppercase tracking-wider mb-2">
                {locale === "ar" ? "تسوق حسب التشكيلة" : "Collection 2026"}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
                {t.catalog.heading}
              </h2>
              <p className="mt-1 text-sm text-charcoal-600">
                {t.catalog.subheading}
              </p>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-charcoal-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.catalog.searchPlaceholder}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-sand-300 bg-white text-sm focus:border-orange-500 shadow-sm transition-colors"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryId("all")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                selectedCategoryId === "all"
                  ? "bg-navy-950 text-white shadow-navy-950/20"
                  : "bg-white text-charcoal-700 hover:bg-sand-100 border border-sand-200"
              }`}
            >
              {t.catalog.all} ({products.length})
            </button>
            {categories.map((cat) => {
              const active = selectedCategoryId === cat.id;
              const name = locale === "ar" ? cat.name_ar : cat.name_fr;
              const count = products.filter((p) => p.category_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                    active
                      ? "bg-orange-500 text-white shadow-orange-500/20"
                      : "bg-white text-charcoal-700 hover:bg-sand-100 border border-sand-200"
                  }`}
                >
                  {name} ({count})
                </button>
              );
            })}
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-sand-200 animate-pulse space-y-4">
                  <div className="aspect-square bg-sand-200 rounded-xl" />
                  <div className="h-5 bg-sand-200 rounded w-3/4" />
                  <div className="h-6 bg-sand-200 rounded w-1/3" />
                  <div className="h-10 bg-sand-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            /* Product Grid with Editorial Asymmetric Rhythm */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product, idx) => {
                const cat = categories.find((c) => c.id === product.category_id);
                const isFeatured = idx === 0 && selectedCategoryId === "all" && !searchQuery;
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category={cat}
                    featured={isFeatured}
                  />
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-3xl border border-sand-200 p-8">
              <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center mx-auto text-charcoal-400 mb-4">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-navy-950">{t.catalog.emptyMessage}</h3>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-md hover:bg-orange-600 transition-colors"
                >
                  {t.catalog.clearSearch}
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
