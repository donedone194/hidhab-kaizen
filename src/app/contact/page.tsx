"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, Send, CheckCircle2, ShieldCheck, Mail } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { locale, t } = useLanguage();
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-sand-50">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-3">
              <Phone className="w-3.5 h-3.5" />
              <span>{t.nav.contact}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-navy-950 tracking-tight">
              {t.contact.title}
            </h1>
            <p className="mt-3 text-base text-charcoal-600 leading-relaxed">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Direct Phone Lines Card */}
            <div className="p-8 rounded-3xl bg-white border border-sand-200/90 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-navy-950 text-xl mb-2">
                  {t.contact.callUs}
                </h3>
                <p className="text-xs text-charcoal-500 leading-relaxed">
                  {locale === "ar"
                    ? "فريق خدمة الزبائن في خدمتكم للإجابة على جميع الاستفسارات ومتابعة الطلبيات."
                    : "Notre équipe service client est disponible pour répondre à vos questions et suivre vos commandes."}
                </p>
              </div>
              
              <div className="space-y-2.5 pt-2">
                <a
                  href="tel:+213675667808"
                  className="flex items-center justify-between p-4 rounded-2xl bg-sand-50 hover:bg-orange-50/70 border border-sand-200 hover:border-orange-500/40 transition-all group"
                >
                  <span className="font-bold text-navy-950 group-hover:text-orange-600 text-sm">
                    {locale === "ar" ? "الخط 1 (واتساب ومكالمات)" : "Ligne 1 (WhatsApp & Appels)"}
                  </span>
                  <span className="font-mono text-sm font-black text-orange-600" dir="ltr">
                    0675 66 78 08
                  </span>
                </a>

                <a
                  href="tel:+213657573848"
                  className="flex items-center justify-between p-4 rounded-2xl bg-sand-50 hover:bg-orange-50/70 border border-sand-200 hover:border-orange-500/40 transition-all group"
                >
                  <span className="font-bold text-navy-950 group-hover:text-orange-600 text-sm">
                    {locale === "ar" ? "الخط 2 (مكالمات مباشرة)" : "Ligne 2 (Appels directs)"}
                  </span>
                  <span className="font-mono text-sm font-black text-orange-600" dir="ltr">
                    0657 57 38 48
                  </span>
                </a>
              </div>
            </div>

            {/* Direct WhatsApp Chat Card */}
            <div className="p-8 rounded-3xl bg-white border border-sand-200/90 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-navy-950 text-xl mb-2">
                  {t.contact.whatsapp}
                </h3>
                <p className="text-xs text-charcoal-500 leading-relaxed">
                  {locale === "ar"
                    ? "تواصل فوري ومباشر عبر واتساب لتأكيد الطلبات وإرسال صور وفيديوهات المنتجات."
                    : "Contact direct et instantané via WhatsApp pour confirmer vos commandes et échanger."}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href="https://wa.me/213675667808"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{locale === "ar" ? "مراسلة عبر واتساب الآن" : "Discuter sur WhatsApp"}</span>
                </a>
                <p className="text-[11px] text-center text-charcoal-400 font-mono" dir="ltr">
                  +213 675 66 78 08
                </p>
              </div>
            </div>

            {/* Social Media Channels Card */}
            <div className="p-8 rounded-3xl bg-white border border-sand-200/90 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-navy-100 text-navy-900 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-navy-950 text-xl mb-2">
                  {t.contact.socialTitle}
                </h3>
                <p className="text-xs text-charcoal-500 leading-relaxed">
                  {locale === "ar"
                    ? "تابع صفحاتنا الرسمية للاطلاع على جديد المنتجات، العروض الترويجية والمسابقات."
                    : "Suivez nos comptes officiels pour découvrir nos nouveautés, offres et jeux-concours."}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {/* Facebook Link */}
                <a
                  href="https://www.facebook.com/people/Hidhab-Kaizen/100063169392492/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-sand-50 transition-colors border border-sand-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                      f
                    </div>
                    <span className="font-bold text-sm text-navy-950 group-hover:text-blue-600 transition-colors">
                      {t.contact.facebook}
                    </span>
                  </div>
                  <span className="text-xs text-charcoal-500 font-medium font-mono" dir="ltr">Hidhab-Kaizen</span>
                </a>

                {/* TikTok Link */}
                <a
                  href="https://www.tiktok.com/@hidhabkaizen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-sand-50 transition-colors border border-sand-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs shadow-sm">
                      d
                    </div>
                    <span className="font-bold text-sm text-navy-950 group-hover:text-orange-500 transition-colors">
                      {t.contact.tiktok}
                    </span>
                  </div>
                  <span className="text-xs text-charcoal-500 font-medium font-mono" dir="ltr">@hidhabkaizen</span>
                </a>

                {/* Instagram Link */}
                <a
                  href="https://www.instagram.com/hidhab_kaizen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-sand-50 transition-colors border border-sand-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                      ig
                    </div>
                    <span className="font-bold text-sm text-navy-950 group-hover:text-pink-600 transition-colors">
                      {t.contact.instagram}
                    </span>
                  </div>
                  <span className="text-xs text-charcoal-500 font-medium font-mono" dir="ltr">@hidhab_kaizen</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

