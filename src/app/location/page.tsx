"use client";

import React, { useState } from "react";
import { MapPin, Clock, Truck, ShieldCheck, Navigation, ExternalLink, Camera } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function LocationPage() {
  const { locale, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"map" | "photo">("map");

  return (
    <div className="min-h-screen flex flex-col bg-sand-50">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.nav.location}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-navy-950 tracking-tight">
              {t.location.title}
            </h1>
            <p className="mt-3 text-base text-charcoal-600 leading-relaxed">
              {t.location.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Info Cards (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Address Card */}
              <div className="p-6 rounded-3xl bg-white border border-sand-200/90 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Navigation className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-navy-950 text-lg">
                  {t.location.addressTitle}
                </h3>
                <p className="text-sm text-charcoal-700 leading-relaxed font-medium">
                  {t.location.addressBody}
                </p>
                <p className="text-xs text-charcoal-500 pt-2 border-t border-sand-100">
                  {t.location.hubNotice}
                </p>
              </div>

              {/* Working Hours Card */}
              <div className="p-6 rounded-3xl bg-white border border-sand-200/90 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900/10 flex items-center justify-center text-navy-900">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-navy-950 text-lg">
                  {t.location.hoursTitle}
                </h3>
                <p className="text-sm text-charcoal-700 leading-relaxed">
                  {t.location.hoursBody}
                </p>
              </div>

              {/* Delivery Coverage Badge */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-navy-950 to-navy-900 text-white space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                  <Truck className="w-5 h-5" />
                  <span>{locale === "ar" ? "تغطية لوجستية كاملة" : "Couverture Logistique"}</span>
                </div>
                <h4 className="text-xl font-black">
                  {locale === "ar" ? "شحن يومي نحو 58 ولاية" : "Expéditions quotidiennes 58 wilayas"}
                </h4>
                <p className="text-xs text-sand-300 leading-relaxed">
                  {locale === "ar"
                    ? "تنطلق شحناتنا يومياً من مركز الفرز والعمليات المركزي نحو كافة الولايات الشمالية والجنوبية لتصلكم في أسرع الآجال."
                    : "Nos colis partent quotidiennement de notre centre de tri vers toutes les wilayas du pays."}
                </p>
              </div>

            </div>

            {/* Interactive Location & Store Media Box (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-sand-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
              
              {/* Header & Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-3 mb-4">
                <div>
                  <h3 className="font-extrabold text-navy-950 text-base">
                    {t.location.mapLabel}
                  </h3>
                  <span className="text-xs text-orange-600 font-bold">
                    {locale === "ar" ? "سطيف - حي قاوة (Cité Gaoua)" : "Sétif - Cité Gaoua"}
                  </span>
                </div>

                {/* View Switcher: Map vs Store Photo */}
                <div className="inline-flex p-1 rounded-xl bg-sand-100 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab("map")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === "map"
                        ? "bg-white text-navy-950 shadow-sm"
                        : "text-charcoal-500 hover:text-navy-950"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>{locale === "ar" ? "الخريطة الحية" : "Carte"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("photo")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === "photo"
                        ? "bg-white text-navy-950 shadow-sm"
                        : "text-charcoal-500 hover:text-navy-950"
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5 text-orange-500" />
                    <span>{locale === "ar" ? "صورة المحل" : "Photo"}</span>
                  </button>
                </div>
              </div>

              {/* Stage Container */}
              <div className="relative w-full aspect-square sm:aspect-16/10 rounded-2xl overflow-hidden bg-sand-100 border border-sand-200/60 shadow-inner">
                {activeTab === "map" ? (
                  <iframe
                    title="Hidhab Kaizen Location Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=5.401%2C36.200%2C5.419%2C36.211&layer=mapnik&marker=36.20534%2C5.40972"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    className="w-full h-full"
                  />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-navy-950 text-white p-6 text-center">
                    <img
                      src="/location.jpg"
                      alt="محل هضاب كايزن سطيف"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="relative z-10 space-y-2 max-w-sm">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-orange-400 mx-auto">
                        <Camera className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-base text-white">
                        {locale === "ar" ? "صورة واجهة محل هضاب كايزن" : "Façade du local Hidhab Kaizen"}
                      </h4>
                      <p className="text-xs text-sand-300 leading-relaxed">
                        {locale === "ar"
                          ? "يمكنك وضع صورة محلك باسم location.jpg داخل مجلد public لتظهر هنا تلقائياً لزبائنك."
                          : "Placez la photo de votre local sous le nom location.jpg dans le dossier public pour l'afficher ici."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-4 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-sand-100">
                <span className="text-xs text-charcoal-600 font-medium text-center sm:text-start">
                  📍 {locale === "ar" ? "حي قاوة - سطيف 19000، الجزائر" : "Cité Gaoua - Sétif 19000, Algérie"}
                </span>
                <a
                  href="https://maps.app.goo.gl/yxLAurbfNevjkxTW6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all w-full sm:w-auto justify-center"
                >
                  <span>{locale === "ar" ? "فتح في خرائط Google" : "Ouvrir dans Google Maps"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
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

