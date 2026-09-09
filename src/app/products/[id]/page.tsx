"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronLeft, ShieldCheck, Truck, RefreshCw, AlertCircle, ShoppingBag, Eye } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/storefront/ProductGallery";
import OrderForm from "@/components/storefront/OrderForm";
import { useLanguage } from "@/context/LanguageContext";
import { getProductById, getCategories, Product, Category } from "@/lib/data-service";
import { formatDZD } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, t, dir } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const prod = await getProductById(id);
        if (prod) {
          setProduct(prod);
          const cats = await getCategories();
          const foundCat = cats.find((c) => c.id === prod.category_id);
          if (foundCat) setCategory(foundCat);
        }
      } catch (err) {
        console.error("Error loading product", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-sand-50">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-sand-200 rounded-3xl" />
            <div className="space-y-6">
              <div className="h-8 bg-sand-200 rounded w-3/4" />
              <div className="h-10 bg-sand-200 rounded w-1/3" />
              <div className="h-32 bg-sand-200 rounded-2xl" />
              <div className="h-48 bg-sand-200 rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-sand-50">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-2xl font-bold text-navy-950">
            {locale === "ar" ? "المنتج غير موجود أو تم حذفه" : "Ce produit n'existe pas ou a été retiré"}
          </h2>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-md"
          >
            {t.orderSuccess.backToCatalog}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const name = locale === "ar" ? product.name_ar : product.name_fr;
  const description = locale === "ar" ? product.description_ar : product.description_fr;
  const categoryName = category ? (locale === "ar" ? category.name_ar : category.name_fr) : null;
  const isLowStock = product.stock_count > 0 && product.stock_count <= 5;

  return (
    <div className="min-h-screen flex flex-col bg-sand-50">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-charcoal-500 mb-8 overflow-hidden text-ellipsis whitespace-nowrap">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              {t.detail.homeBreadcrumb}
            </Link>
            {dir === "rtl" ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <Link href="/#products-section" className="hover:text-orange-600 transition-colors">
              {t.detail.productsBreadcrumb}
            </Link>
            {categoryName && (
              <>
                {dir === "rtl" ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span className="text-charcoal-400">{categoryName}</span>
              </>
            )}
            {dir === "rtl" ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span className="font-bold text-navy-950 truncate max-w-[200px] sm:max-w-md">{name}</span>
          </nav>

          {/* Product Showcase: Gallery + Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Gallery & Video (7 Cols) */}
            <div className="lg:col-span-7">
              <ProductGallery
                images={product.images}
                videos={product.videos}
                productName={name}
              />

              {/* Guarantees Box */}
              <div className="mt-8 p-6 rounded-2xl bg-white border border-sand-200/80 space-y-4 shadow-sm">
                <h4 className="font-extrabold text-navy-950 text-sm tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <span>{t.detail.guaranteesTitle}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-charcoal-600">
                  <div className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>{t.detail.guarantee2}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Eye className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>{t.detail.guarantee1}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <RefreshCw className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>{t.detail.guarantee3}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Price, Description & Fast Order Jump (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Category & Stock Badges */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {categoryName && (
                  <span className="px-3 py-1 rounded-md bg-navy-950 text-white text-xs font-bold">
                    {categoryName}
                  </span>
                )}
                {isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 text-amber-700 text-xs font-bold border border-amber-500/30">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {t.detail.stockLowWarning}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-500/30">
                    {t.detail.stockAvailable}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight leading-snug">
                {name}
              </h1>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-orange-600 tracking-tight">
                    {formatDZD(product.price, locale)}
                  </span>
                  <span className="block text-xs text-charcoal-500 font-semibold mt-1">
                    {locale === "ar" ? "الدفع نقداً بعد استلام الطرد" : "Paiement en espèces à la livraison"}
                  </span>
                </div>
                <a
                  href="#order-form-anchor"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.catalog.orderNow}</span>
                </a>
              </div>

              {/* Product Description */}
              <div className="prose prose-sm text-charcoal-700 leading-relaxed bg-white p-6 rounded-2xl border border-sand-200/80 shadow-sm">
                <h4 className="font-bold text-navy-950 text-base mb-2">
                  {locale === "ar" ? "وصف ومميزات المنتج" : "Description & Caractéristiques"}
                </h4>
                <p className="whitespace-pre-line text-sm leading-relaxed">
                  {description || (locale === "ar" ? "منتج عالي الجودة متوفر حصرياً عبر هضاب كايزن." : "Produit de haute qualité certifié Hidhab Kaizen.")}
                </p>
              </div>

              {/* Fast COD Order Form Component embedded right here! */}
              <OrderForm product={product} />

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

