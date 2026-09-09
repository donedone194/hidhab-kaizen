"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Layers } from "lucide-react";
import { getCategories, saveCategory, deleteCategory, getProducts, Category, Product } from "@/lib/data-service";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminCategoriesPage() {
  const { locale } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const [cats, prods] = await Promise.all([getCategories(), getProducts(false)]);
    setCategories(cats);
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory({
      name_ar: "",
      name_fr: "",
      slug: "",
      image_url: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory({ ...c });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name_ar) return;

    await saveCategory(editingCategory);
    await refresh();
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا التصنيف؟" : "Supprimer cette catégorie ?")) {
      await deleteCategory(id);
      await refresh();
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-sm font-bold">جاري تحميل التصنيفات...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
            {locale === "ar" ? "إدارة تصنيفات المنتجات" : "Gestion des Catégories"}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            {locale === "ar"
              ? "إنشاء وتعديل تصنيفات المتجر لتسهيل تصفح الزبائن لمنتجاتكم."
              : "Organisez vos produits en rubriques pour votre boutique."}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{locale === "ar" ? "إضافة تصنيف جديد" : "Nouvelle catégorie"}</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => {
          const productCount = products.filter((p) => p.category_id === c.id).length;
          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-5 border border-sand-200/90 shadow-sm hover:border-orange-500/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-sand-100 border border-sand-200 shrink-0">
                  {c.image_url ? (
                    <Image src={c.image_url} alt={c.name_ar} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                      <Layers className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-navy-950">{locale === "ar" ? c.name_ar : c.name_fr}</h3>
                  <span className="text-xs text-charcoal-400 block font-medium">
                    {locale === "ar" ? c.name_fr : c.name_ar}
                  </span>
                  <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700">
                    {productCount} {locale === "ar" ? "منتجات مرتبطة" : "articles"}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-sand-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-2 rounded-xl text-navy-900 hover:bg-sand-100 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-sand-200">
            <h3 className="text-xl font-black text-navy-950 border-b border-sand-200 pb-3">
              {editingCategory.id
                ? (locale === "ar" ? "تعديل التصنيف" : "Modifier la catégorie")
                : (locale === "ar" ? "تصنيف جديد" : "Nouvelle catégorie")}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  {locale === "ar" ? "الاسم بالعربية *" : "Nom en Arabe *"}
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name_ar || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_ar: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-sand-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  {locale === "ar" ? "الاسم بالفرنسية *" : "Nom en Français *"}
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={editingCategory.name_fr || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_fr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-sand-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  {locale === "ar" ? "رابط صورة التصنيف (اختياري):" : "Image URL (optionnel):"}
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editingCategory.image_url || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-sand-300 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-sand-200 text-navy-950 font-bold text-xs hover:bg-sand-300"
                >
                  {locale === "ar" ? "إلغاء" : "Annuler"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md"
                >
                  {locale === "ar" ? "حفظ" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

