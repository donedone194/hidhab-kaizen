"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const { locale, t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/admin");
      } else {
        setError(
          locale === "ar"
            ? "بيانات الدخول غير صحيحة أو ليس لديك صلاحية المشرف"
            : "Identifiants invalides ou droits administrateur requis"
        );
      }
    } catch {
      setError(locale === "ar" ? "حدث خطأ أثناء الاتصال بالخادم" : "Erreur de connexion au serveur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-sand-50 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 end-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 start-0 w-96 h-96 bg-navy-800/40 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group focus:outline-none mb-4">
          <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-white flex items-center justify-center text-orange-600 font-black text-3xl shadow-2xl shadow-orange-500/25 border-2 border-white/40 group-hover:scale-105 transition-transform p-2">
            <span>HK</span>
            <img
              src="/logo.png"
              alt="Hidhab Kaizen"
              className="absolute inset-0 w-full h-full object-contain p-1 bg-white"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t.admin.portal}
        </h2>
        <p className="mt-2 text-xs text-sand-300">
          {locale === "ar"
            ? "بوابة الإدارة المركزية الآمنة لمتجر هضاب كايزن"
            : "Portail sécurisé d'administration centrale Hidhab Kaizen"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-navy-900/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-navy-800 space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold text-center leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1.5">
                {t.admin.email}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-sand-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  dir="ltr"
                  className="w-full ps-10 pe-4 py-3 rounded-xl bg-navy-950/80 border border-navy-700 text-white text-sm focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1.5">
                {t.admin.password}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-sand-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  dir="ltr"
                  className="w-full ps-10 pe-10 py-3 rounded-xl bg-navy-950/80 border border-navy-700 text-white text-sm focus:border-orange-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center pe-3 text-sand-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{submitting ? "..." : t.admin.loginBtn}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-sand-400 hover:text-white transition-colors">
              {locale === "ar" ? "← العودة إلى المتجر الرئيسي" : "← Retourner à la boutique"}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

