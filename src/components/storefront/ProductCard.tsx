"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag, Eye, AlertCircle } from "lucide-react";
import { Product, Category } from "@/lib/data-service";
import { useLanguage } from "@/context/LanguageContext";
import { formatDZD } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  category?: Category;
  featured?: boolean;
}

export default function ProductCard({ product, category, featured = false }: ProductCardProps) {
  const { locale, t, dir } = useLanguage();
  const name = locale === "ar" ? product.name_ar : product.name_fr;
  const categoryName = category ? (locale === "ar" ? category.name_ar : category.name_fr) : null;
  const isLowStock = product.stock_count > 0 && product.stock_count <= 5;
  const mainImage = product.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-sand-200/80 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all duration-300 ${
        featured ? "md:col-span-2 md:grid md:grid-cols-2" : ""
      }`}
    >
      {/* Product Image Stage */}
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square w-full overflow-hidden bg-sand-100 focus:outline-none"
      >
        <Image
          src={mainImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          {categoryName ? (
            <span className="px-2.5 py-1 text-xs font-semibold bg-navy-950/80 backdrop-blur-md text-white rounded-md shadow-sm">
              {categoryName}
            </span>
          ) : <span />}

          {isLowStock && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-amber-500 text-white rounded-md shadow-sm">
              <AlertCircle className="w-3 h-3" />
              {t.catalog.lowStock}
            </span>
          )}
        </div>

        {/* Quick View Floating Hint */}
        <div className="absolute inset-0 bg-navy-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 text-navy-950 text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-orange-500" />
            {t.catalog.viewDetails}
          </span>
        </div>
      </Link>

      {/* Card Content & Ordering CTA */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div>
          <Link
            href={`/products/${product.id}`}
            className="block focus:outline-none"
          >
            <h3 className="font-bold text-lg text-charcoal-900 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
              {name}
            </h3>
          </Link>

          {/* Price Banner */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-orange-500 tracking-tight">
              {formatDZD(product.price, locale)}
            </span>
            <span className="text-xs text-charcoal-400 font-medium">
              {locale === "ar" ? "الدفع عند الاستلام" : "Paiement à la livraison"}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-5 pt-4 border-t border-sand-100">
          <Link
            href={`/products/${product.id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy-900 hover:bg-orange-500 text-white font-bold text-sm shadow-md hover:shadow-orange-500/25 transition-all duration-200 group/btn"
          >
            <ShoppingBag className="w-4 h-4 text-orange-400 group-hover/btn:text-white transition-colors" />
            <span>{t.catalog.orderNow}</span>
            {dir === "rtl" ? (
              <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            )}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

