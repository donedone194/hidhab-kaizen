"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, PackageCheck, PhoneCall, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Order } from "@/lib/data-service";
import { formatDZD } from "@/lib/utils";
import { getWilayaById } from "@/data/algeria-data";

interface OrderSuccessModalProps {
  order: Order | null;
  productName: string;
  onClose: () => void;
}

export default function OrderSuccessModal({ order, productName, onClose }: OrderSuccessModalProps) {
  const { locale, t, dir } = useLanguage();

  useEffect(() => {
    if (order) {
      // Fire celebratory confetti explosion
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F5821F", "#0B1F3A", "#DE6D0C", "#FFF3E6"],
      });
    }
  }, [order]);

  if (!order) return null;

  const wilaya = getWilayaById(order.wilaya_id);
  const wilayaName = wilaya ? (locale === "ar" ? wilaya.name_ar : wilaya.name_fr) : "";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sand-200 text-center"
        >
          {/* Animated Success Badge */}
          <div className="mx-auto w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-6 shadow-inner">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 15 }}
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
          </div>

          {/* Heading & Order Number */}
          <h2 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
            {t.orderSuccess.title}
          </h2>
          
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-950 text-sand-50 font-mono text-sm font-bold tracking-wider">
            <span>{t.orderSuccess.orderIdLabel}</span>
            <span className="text-orange-400">{order.order_number}</span>
          </div>

          <p className="mt-4 text-sm text-charcoal-600 leading-relaxed">
            {t.orderSuccess.message}
          </p>

          {/* Recipient & Destination Summary Box */}
          <div className="mt-6 text-start p-4 rounded-2xl bg-sand-50 border border-sand-200/80 space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-sand-200/60 pb-2">
              <span className="text-charcoal-400 font-medium">{t.orderSuccess.product}</span>
              <span className="font-bold text-navy-950 max-w-[60%] truncate text-end">{productName} ({order.quantity}x)</span>
            </div>
            <div className="flex justify-between border-b border-sand-200/60 pb-2">
              <span className="text-charcoal-400 font-medium">{t.orderSuccess.recipient}</span>
              <span className="font-bold text-navy-950">{order.customer_name}</span>
            </div>
            <div className="flex justify-between border-b border-sand-200/60 pb-2">
              <span className="text-charcoal-400 font-medium">{t.orderSuccess.phone}</span>
              <span className="font-bold text-navy-950 font-mono" dir="ltr">{order.phone}</span>
            </div>
            <div className="flex justify-between border-b border-sand-200/60 pb-2">
              <span className="text-charcoal-400 font-medium">{t.orderSuccess.destination}</span>
              <span className="font-bold text-navy-950">
                {wilayaName} - {order.commune_name || ""}
              </span>
            </div>
            <div className="flex justify-between pt-1 text-base font-extrabold">
              <span className="text-navy-950">{t.orderSuccess.amountDue}</span>
              <span className="text-orange-600 font-black">{formatDZD(order.total_price, locale)}</span>
            </div>
          </div>

          {/* Next Steps Card */}
          <div className="mt-5 p-3 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center gap-3 text-xs text-orange-950 text-start">
            <PhoneCall className="w-5 h-5 text-orange-600 shrink-0" />
            <span>
              {locale === "ar"
                ? "يرجى إبقاء هاتفك مفتوحاً للرد على مكالمة التوصيل وتأكيد شحن الطرد."
                : "Merci de garder votre téléphone joignable pour valider l'expédition de votre colis."}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-sm shadow-md transition-colors"
            >
              {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{t.orderSuccess.backToCatalog}</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

