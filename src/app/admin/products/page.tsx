"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Search, CheckCircle2, XCircle, AlertCircle, Video, Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { getProducts, getCategories, saveProduct, deleteProduct, Product, Category } from "@/lib/data-service";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { formatDZD } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminProductsPage() {
  const { locale } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatFilter, setSelectedCatFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const refreshProducts = async () => {
    const [prods, cats] = await Promise.all([getProducts(false), getCategories()]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct({
      name_ar: "",
      name_fr: "",
      category_id: categories[0]?.id || null,
      price: 4500,
      images: [],
      videos: [],
      description_ar: "",
      description_fr: "",
      stock_count: 15,
      is_active: true,
    });
    setImageUrlInput("");
    setVideoUrlInput("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct({ ...p });
    setImageUrlInput("");
    setVideoUrlInput("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name_ar) return;

    try {
      await saveProduct(editingProduct);
      await refreshProducts();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(
        locale === "ar"
          ? `⚠️ تعذر حفظ التعديلات في قاعدة البيانات: ${err.message || err}\n\nيرجى تشغيل كود تصحيح الصلاحيات (fix_rls.sql) في لوحة تحكم Supabase SQL Editor.`
          : `⚠️ Impossible d'enregistrer les modifications: ${err.message || err}\n\nVeuillez exécuter le script fix_rls.sql dans Supabase SQL Editor.`
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(locale === "ar" ? "هل أنت متأكد من رغبتك في حذف هذا المنتج؟" : "Supprimer définitivement ce produit ?")) {
      try {
        await deleteProduct(id);
        await refreshProducts();
      } catch (err: any) {
        if (err.message === "has_orders") {
          alert(
            locale === "ar"
              ? "⚠️ لا يمكن حذف هذا المنتج لأن هناك طلبات شراء مرتبطة به في سجل الطلبات لحماية الحسابات والمبيعات.\n\n💡 الحل: يمكنك النقر على زر (نشط بالمتجر) ليتحول إلى (مخفي) فيختفي فوراً من أمام الزبائن في متجرك، أو يمكنك تفعيل الحذف الكامل بتشغيل كود SQL في Supabase."
              : "⚠️ Impossible de supprimer ce produit car des commandes clients lui sont associées dans la base de données.\n\n💡 Solution: Cliquez sur le statut 'Actif' pour le passer en 'Masqué' afin qu'il disparaisse immédiatement du magasin."
          );
        } else {
          alert(
            locale === "ar"
              ? `⚠️ تعذر حذف المنتج: ${err.message || err}`
              : `⚠️ Erreur lors de la suppression: ${err.message || err}`
          );
        }
      }
    }
  };

  const handleToggleActive = async (p: Product) => {
    try {
      await saveProduct({ ...p, is_active: !p.is_active });
      await refreshProducts();
    } catch (err: any) {
      alert(
        locale === "ar"
          ? `⚠️ تعذر تحديث حالة المنتج: ${err.message || err}`
          : `⚠️ Erreur lors de la mise à jour: ${err.message || err}`
      );
    }
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim() || !editingProduct) return;
    const current = editingProduct.images || [];
    setEditingProduct({ ...editingProduct, images: [...current, imageUrlInput.trim()] });
    setImageUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProduct) return;
    const current = [...(editingProduct.images || [])];
    current.splice(index, 1);
    setEditingProduct({ ...editingProduct, images: current });
  };

  const handleAddVideo = () => {
    if (!videoUrlInput.trim() || !editingProduct) return;
    const current = editingProduct.videos || [];
    setEditingProduct({ ...editingProduct, videos: [...current, videoUrlInput.trim()] });
    setVideoUrlInput("");
  };

  const handleRemoveVideo = (index: number) => {
    if (!editingProduct) return;
    const current = [...(editingProduct.videos || [])];
    current.splice(index, 1);
    setEditingProduct({ ...editingProduct, videos: current });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(locale === "ar" ? "حجم الصورة يجب ألا يتجاوز 10 ميغابايت." : "L'image ne doit pas dépasser 10 Mo.");
      return;
    }

    setIsUploadingImage(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, { cacheControl: "3600", upsert: true });

        if (error) throw error;

        const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
        if (data?.publicUrl) {
          const current = editingProduct.images || [];
          setEditingProduct({ ...editingProduct, images: [...current, data.publicUrl] });
        }
      } else {
        alert(locale === "ar" ? "يرجى ربط Supabase لتفعيل الرفع السحابي المباشر." : "Veuillez connecter Supabase pour le téléversement direct.");
      }
    } catch (err: any) {
      alert(locale === "ar" ? `فشل رفع الصورة: ${err.message || err}` : `Erreur de téléversement: ${err.message || err}`);
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    if (file.size > 50 * 1024 * 1024) {
      alert(locale === "ar" ? "حجم الفيديو يجب ألا يتجاوز 50 ميغابايت (يُفضل استخدام YouTube للفيديوهات الأكبر)." : "La vidéo ne doit pas dépasser 50 Mo (préférez YouTube pour les vidéos plus lourdes).");
      return;
    }

    setIsUploadingVideo(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const fileExt = file.name.split(".").pop() || "mp4";
        const fileName = `vid-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, { cacheControl: "3600", upsert: true });

        if (error) throw error;

        const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
        if (data?.publicUrl) {
          const current = editingProduct.videos || [];
          setEditingProduct({ ...editingProduct, videos: [...current, data.publicUrl] });
        }
      } else {
        alert(locale === "ar" ? "يرجى ربط Supabase لتفعيل الرفع السحابي المباشر." : "Veuillez connecter Supabase pour le téléversement direct.");
      }
    } catch (err: any) {
      alert(locale === "ar" ? `فشل رفع الفيديو: ${err.message || err}` : `Erreur de téléversement: ${err.message || err}`);
    } finally {
      setIsUploadingVideo(false);
      e.target.value = "";
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCatFilter !== "all" && p.category_id !== selectedCatFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const name = locale === "ar" ? p.name_ar : p.name_fr;
      return name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
            {locale === "ar" ? "إدارة كتالوج المنتجات" : "Gestion des Produits"}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            {locale === "ar"
              ? "إضافة وتعديل المنتجات، الأسعار، الصور، الفيديوهات وحالة المخزون."
              : "Ajoutez, modifiez ou activez/désactivez vos articles du catalogue."}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{locale === "ar" ? "إضافة منتج جديد" : "Ajouter un produit"}</span>
        </button>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white p-4 rounded-3xl border border-sand-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-charcoal-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === "ar" ? "بحث عن منتج..." : "Recherche..."}
            className="w-full ps-9 pe-3 py-2 rounded-xl border border-sand-300 text-xs focus:border-orange-500 transition-colors"
          />
        </div>

        <select
          value={selectedCatFilter}
          onChange={(e) => setSelectedCatFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 rounded-xl border border-sand-300 text-xs bg-white text-navy-950"
        >
          <option value="all">{locale === "ar" ? "كافة التصنيفات" : "Toutes catégories"}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "ar" ? c.name_ar : c.name_fr}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-sand-100 text-navy-950 font-bold uppercase tracking-wider border-b border-sand-200">
              <tr>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "المنتج" : "Article"}</th>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "التصنيف" : "Catégorie"}</th>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "السعر (د.ج)" : "Prix (DZD)"}</th>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "المخزون" : "Stock"}</th>
                <th className="px-4 py-3.5 text-start">{locale === "ar" ? "الحالة" : "Visibilité"}</th>
                <th className="px-4 py-3.5 text-end">{locale === "ar" ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {filteredProducts.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id);
                const isLowStock = p.stock_count <= 5;
                const img = p.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80";

                return (
                  <tr key={p.id} className="hover:bg-sand-50 transition-colors">
                    {/* Image & Title */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-sand-100 shrink-0 border border-sand-200">
                          <Image src={img} alt={p.name_ar} fill sizes="48px" className="object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-navy-950 block text-sm line-clamp-1">
                            {locale === "ar" ? p.name_ar : p.name_fr}
                          </span>
                          <span className="text-[10px] text-charcoal-400 block line-clamp-1">
                            {locale === "ar" ? p.name_fr : p.name_ar}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 font-semibold text-charcoal-600">
                      {cat ? (locale === "ar" ? cat.name_ar : cat.name_fr) : "-"}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-black text-sm text-orange-600 font-mono">
                      {formatDZD(p.price, locale)}
                    </td>

                    {/* Stock & Low Stock Badge */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold font-mono text-sm">{p.stock_count}</span>
                        {isLowStock && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            {locale === "ar" ? "مخزون منخفض" : "Faible"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Active Toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          p.is_active
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-gray-100 text-gray-600 border border-gray-300"
                        }`}
                      >
                        {p.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{p.is_active ? (locale === "ar" ? "نشط بالمتجر" : "Actif") : (locale === "ar" ? "مخفي" : "Masqué")}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-end whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-navy-900 hover:bg-sand-200 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl border border-sand-200">
            <h3 className="text-xl font-black text-navy-950 border-b border-sand-200 pb-3">
              {editingProduct.id
                ? (locale === "ar" ? "تعديل بيانات المنتج" : "Modifier le produit")
                : (locale === "ar" ? "إضافة منتج جديد" : "Nouveau produit")}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Arabic Name */}
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  {locale === "ar" ? "اسم المنتج بالعربية *" : "Nom en Arabe *"}
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name_ar || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name_ar: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-sand-300 text-xs"
                />
              </div>

              {/* French Name */}
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  {locale === "ar" ? "اسم المنتج بالفرنسية *" : "Nom en Français *"}
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={editingProduct.name_fr || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name_fr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-sand-300 text-xs"
                />
              </div>

              {/* Category & Price & Stock Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1">
                    {locale === "ar" ? "التصنيف" : "Catégorie"}
                  </label>
                  <select
                    value={editingProduct.category_id || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sand-300 text-xs bg-white"
                  >
                    <option value="">{locale === "ar" ? "بدون تصنيف" : "Aucune"}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {locale === "ar" ? c.name_ar : c.name_fr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1">
                    {locale === "ar" ? "السعر (د.ج) *" : "Prix (DZD) *"}
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={100}
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-sand-300 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1">
                    {locale === "ar" ? "الكمية في المخزون" : "Quantité stock"}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.stock_count ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_count: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-sand-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Multi-Image URL Manager */}
              <div className="space-y-2 p-3 bg-sand-50 rounded-2xl border border-sand-200">
                <label className="block text-xs font-bold text-navy-950 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
                  <span>{locale === "ar" ? "روابط صور المنتج (Supabase Storage أو Unsplash):" : "Images du produit:"}</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      placeholder={locale === "ar" ? "رابط صورة https://..." : "Lien image https://..."}
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-sand-300 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-3 py-2 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-bold shrink-0"
                    >
                      {locale === "ar" ? "إضافة رابط" : "Ajouter lien"}
                    </button>
                  </div>
                  
                  <label className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm shrink-0">
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{locale === "ar" ? "جاري الرفع..." : "Téléversement..."}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>{locale === "ar" ? "رفع صورة من الجهاز" : "Téléverser photo"}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {editingProduct.images.map((img, i) => (
                      <div key={i} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-sand-300">
                        <Image src={img} alt="preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video URL Manager */}
              <div className="space-y-2 p-3 bg-sand-50 rounded-2xl border border-sand-200">
                <label className="block text-xs font-bold text-navy-950 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-orange-500" />
                  <span>{locale === "ar" ? "فيديو توضيحي للمنتج (YouTube أو رفع MP4):" : "Vidéo produit (YouTube ou MP4):"}</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      placeholder={locale === "ar" ? "YouTube، Vimeo، أو رابط ملف .mp4 مباشر" : "YouTube, Vimeo ou lien .mp4"}
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-sand-300 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddVideo}
                      className="px-3 py-2 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-bold shrink-0"
                    >
                      {locale === "ar" ? "إضافة رابط" : "Ajouter lien"}
                    </button>
                  </div>

                  <label className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-sand-200 hover:bg-sand-300 text-navy-950 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm shrink-0">
                    {isUploadingVideo ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{locale === "ar" ? "جاري الرفع..." : "Téléversement..."}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>{locale === "ar" ? "رفع فيديو (MP4)" : "Téléverser vidéo"}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoUpload}
                      disabled={isUploadingVideo}
                      className="hidden"
                    />
                  </label>
                </div>
                {editingProduct.videos && editingProduct.videos.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {editingProduct.videos.map((vid, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-1.5 bg-white rounded border border-sand-200">
                        <span className="truncate max-w-sm font-mono text-[11px]">{vid}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(i)}
                          className="text-red-500 font-bold px-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1">
                    {locale === "ar" ? "الوصف بالعربية" : "Description en Arabe"}
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.description_ar || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_ar: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sand-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1">
                    {locale === "ar" ? "الوصف بالفرنسية" : "Description en Français"}
                  </label>
                  <textarea
                    rows={3}
                    dir="ltr"
                    value={editingProduct.description_fr || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_fr: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sand-300 text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand-200">
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
                  {locale === "ar" ? "حفظ المنتج" : "Enregistrer"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

