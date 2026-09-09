"use client";

import React from "react";
import Link from "next/link";
import { Phone, MapPin, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { locale, t } = useLanguage();

  return (
    <footer className="bg-navy-950 text-sand-100 border-t border-navy-800 mt-auto">
      {/* Trust Highlights Strip */}
      <div className="border-b border-navy-800/80 bg-navy-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-start">
            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-navy-850/40 border border-navy-800/50">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  {locale === "ar" ? "توصيل سريع لـ 58 ولاية" : "Livraison Express 58 Wilayas"}
                </h4>
                <p className="text-xs text-sand-300 mt-0.5">
                  {locale === "ar" ? "إلى باب منزلك أو عبر مكاتب التوصيل" : "À domicile ou en point relais"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-navy-850/40 border border-navy-800/50">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  {locale === "ar" ? "الدفع عند الاستلام كاش" : "Paiement à la Livraison"}
                </h4>
                <p className="text-xs text-sand-300 mt-0.5">
                  {locale === "ar" ? "لا تدفع شيئاً حتى يصلك الطرد وتعاينه" : "Réglez en espèces après réception"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-navy-850/40 border border-navy-800/50">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  {locale === "ar" ? "جودة مضمونة وخدمة متميزة" : "Qualité & Service Garanti"}
                </h4>
                <p className="text-xs text-sand-300 mt-0.5">
                  {locale === "ar" ? "متابعة هاتفية مستمرة مع خدمة الزبائن" : "Accompagnement et SAV réactif"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand Wordmark & Story */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-lg shadow-black/30 border border-white/30 shrink-0 p-1">
                <span className="text-orange-600 font-black text-2xl">HK</span>
                <img
                  src="/logo.png"
                  alt="Hidhab Kaizen"
                  className="absolute inset-0 w-full h-full object-contain p-0.5 bg-white"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
                Hidhab Kaizen
              </span>
            </div>
            <p className="text-sm text-sand-300 leading-relaxed max-w-lg">
              {t.footer.about}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-orange-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {locale === "ar" ? "نستقبل طلباتكم الآن" : "Commandes en ligne ouvertes 24/7"}
              </span>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <a
                href="https://www.facebook.com/people/Hidhab-Kaizen/100063169392492/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-xs font-black shadow transition-all"
              >
                f
              </a>
              <a
                href="https://www.tiktok.com/@hidhabkaizen"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                className="w-8 h-8 rounded-xl bg-black hover:bg-navy-900 border border-navy-700 text-white flex items-center justify-center text-xs font-black shadow transition-all"
              >
                d
              </a>
              <a
                href="https://www.instagram.com/hidhab_kaizen/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 hover:opacity-90 text-white flex items-center justify-center text-xs font-black shadow transition-all"
              >
                ig
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-sand-300">
              <li>
                <Link href="/#products-section" className="hover:text-orange-400 transition-colors">
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link href="/location" className="hover:text-orange-400 transition-colors">
                  {t.nav.location}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Summary */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.contactInfo}
            </h4>
            <ul className="space-y-3 text-sm text-sand-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-1" />
                <span>{locale === "ar" ? "حي قاوة (Cité Gaoua)، سطيف، 19000، الجزائر" : "Cité Gaoua, Sétif 19000, Algérie"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="tel:+213675667808" className="hover:text-orange-400 font-mono" dir="ltr">
                  0675 66 78 08
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sand-400 shrink-0" />
                <a href="tel:+213657573848" className="hover:text-orange-400 font-mono" dir="ltr">
                  0657 57 38 48
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights Strip */}
        <div className="border-t border-navy-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-400">
          <p>{t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <span>{locale === "ar" ? "هضاب كايزن - التجارة الموثوقة" : "Hidhab Kaizen - E-commerce de confiance"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

