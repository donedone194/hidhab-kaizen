// ==============================================================================
// HIDHAB KAIZEN (هضاب كايزن) - UNIFIED DATA SERVICE LAYER
// Seamlessly connects to Supabase when configured, or provides local persistent demo storage
// ==============================================================================

import { supabase, isSupabaseConfigured } from "./supabase/client";
import { ALGERIA_WILAYAS, getWilayaById } from "@/data/algeria-data";

export interface Category {
  id: string;
  name_ar: string;
  name_fr: string;
  slug: string;
  image_url?: string;
}

export interface Product {
  id: string;
  name_ar: string;
  name_fr: string;
  category_id?: string | null;
  price: number;
  images: string[];
  videos: string[];
  description_ar?: string;
  description_fr?: string;
  stock_count: number;
  is_active: boolean;
  created_at: string;
}

export type OrderStatus = "new" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned";

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  product_id: string;
  quantity: number;
  wilaya_id: number;
  commune_id?: number | null;
  commune_name?: string;
  precise_address: string;
  customer_note?: string;
  product_price: number;
  delivery_price: number;
  total_price: number;
  delivery_type: "home" | "office";
  status: OrderStatus;
  internal_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface WilayaDeliveryPrice {
  wilaya_id: number;
  home_delivery_price: number;
  office_delivery_price: number;
  is_active: boolean;
}

// Initial Mock Seed Data for instantaneous local preview & fallback
const INITIAL_CATEGORIES: Category[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name_ar: "الإلكترونيات الذكية",
    name_fr: "Électronique Intelligente",
    slug: "electronics",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name_ar: "المنزل العصري والمعيشة",
    name_fr: "Maison & Confort",
    slug: "home-living",
    image_url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name_ar: "معدات وأدوات احترافية",
    name_fr: "Outillage Professionnel",
    slug: "pro-tools",
    image_url: "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name_ar: "العناية والصحة الشخصية",
    name_fr: "Soins & Bien-être",
    slug: "wellness-care",
    image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    name_ar: "سماعات لاسلكية برو بخاصية العزل النشط للضوضاء Kaizen SoundX",
    name_fr: "Écouteurs Sans Fil Pro Kaizen SoundX avec ANC",
    category_id: "11111111-1111-1111-1111-111111111111",
    price: 6900,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop&q=80",
    ],
    videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    description_ar: "سماعات SoundX الاحترافية مع تقنية العزل الصوتي النشط (Active Noise Cancelling) وتصميم مريح للأذن. بطارية تدوم حتى 36 ساعة مع علبة الشحن السريع Type-C. ميكروفونات رباعية فائقة النقاء للمكالمات والاجتماعات مع مقاومة للتعرق والرطوبة IPX5.",
    description_fr: "Écouteurs haute fidélité Kaizen SoundX dotés de la réduction active du bruit (ANC). Autonomie impressionnante de 36 heures avec l'étui de charge rapide Type-C. Quatre microphones ultra-clairs pour appels limpides et étanchéité IPX5 certifiée.",
    stock_count: 28,
    is_active: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    name_ar: "ساعة يد ذكية مقاومة للماء مع مراقبة الصحة والاتصال Kaizen Pulse Ultra",
    name_fr: "Montre Connectée Sport & Santé Kaizen Pulse Ultra",
    category_id: "11111111-1111-1111-1111-111111111111",
    price: 8500,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80",
    ],
    videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    description_ar: "ساعة ذكية عصرية بشاشة AMOLED فائقة الوضوح بحجم 1.96 إنش، تدعم المكالمات عبر البلوتوث واستقبال الإشعارات باللغة العربية. بطارية تدوم حتى 10 أيام استخدام متواصل مع حساسات دقيقة لقياس نبضات القلب ونسبة الأكسجين وتتبع أكثر من 100 تمرين رياضي.",
    description_fr: "Montre connectée haut de gamme avec écran AMOLED 1.96 pouce. Appels Bluetooth directs, suivi précis de la fréquence cardiaque et de la SpO2, autonomie prolongée jusqu'à 10 jours et compatibilité totale iOS/Android.",
    stock_count: 14,
    is_active: true,
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    name_ar: "جهاز تدليك العضلات الاحترافي المحمول Kaizen Theragun Pro 6-Speed",
    name_fr: "Pistolet de Massage Musculaire Kaizen Theragun Pro",
    category_id: "44444444-4444-4444-4444-444444444444",
    price: 9800,
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
    ],
    videos: [],
    description_ar: "جهاز مساج وتدليك عميق للأنسجة والعضلات مع 6 سرعات قابلة للتعديل و4 رؤوس تدليك مخصصة لكل عضلة. مثالي للرياضيين ولتخفيف آلام الظهر والرقبة بعد يوم عمل شاق. محرك هادئ للغاية مع بطارية ليثيوم طويلة الأمد.",
    description_fr: "Pistolet de massage à percussion pour soulager les tensions musculaires en profondeur. 6 vitesses réglables, 4 embouts ergonomiques inclus et moteur ultra-silencieux à haute puissance.",
    stock_count: 6,
    is_active: true,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    name_ar: "مصباح طاولة ذكي متعدد الألوان مع شاحن لاسلكي سريع Kaizen Aura Light",
    name_fr: "Lampe de Bureau Intelligente avec Chargeur Sans Fil Kaizen Aura",
    category_id: "22222222-2222-2222-2222-222222222222",
    price: 5400,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&auto=format&fit=crop&q=80",
    ],
    videos: [],
    description_ar: "مصباح مكتب عصري متعدد الوظائف بتصميم مينيمالي انسيابي. قاعدة شحن لاسلكي سريع بقوة 15 واط متوافقة مع جميع الهواتف الذكية. إضاءة LED مريحة للعين مع 3 درجات حرارة ألوان وسطوع قابل للتحكم باللمس.",
    description_fr: "Lampe moderne et minimaliste intégrant une station de recharge sans fil 15W. Luminosité tactile à intensité variable et 3 modes d'éclairage protégeant vos yeux lors de vos lectures nocturnes.",
    stock_count: 19,
    is_active: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    name_ar: "طقم مفكات براغي كهربائي دقيق مع 48 قطعة Kaizen Precision Kit",
    name_fr: "Tournevis Électrique de Précision 48-en-1 Kaizen",
    category_id: "33333333-3333-3333-3333-333333333333",
    price: 4900,
    images: [
      "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=900&auto=format&fit=crop&q=80",
    ],
    videos: [],
    description_ar: "طقم مفكات كهربائية عالية الدقة من الفولاذ المقاوم للصدأ S2 المطور، مخصص لإصلاح الهواتف، الحواسيب، الساعات والأجهزة الإلكترونية. عزم دوران كهربائي مزدوج وإضاءة LED أمامية مدمجة لرؤية الزوايا الدقيقة.",
    description_fr: "Set de tournevis électrique de précision comprenant 48 embouts magnétiques en acier trempé S2. Idéal pour la réparation d'ordinateurs portables, smartphones et petits appareils.",
    stock_count: 3, // Low stock indicator
    is_active: true,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    name_ar: "كوب ذكي ذاتي التسخين مع تحكم دقيق بدرجة الحرارة Kaizen ThermoCup",
    name_fr: "Mug Intelligent Auto-Chauffant Kaizen ThermoCup",
    category_id: "22222222-2222-2222-2222-222222222222",
    price: 4200,
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=80",
    ],
    videos: [],
    description_ar: "كوب حراري ذكي يحافظ على قهوتك أو شايك عند درجة الحرارة المثالية (55°C) طوال اليوم. مصنوع من السيراميك الفاخر مع قاعدة تسخين لاسلكية ذكية تعمل أيضاً كشاحن سريع للهاتف.",
    description_fr: "Mug thermique intelligent gardant votre boisson à température parfaite de 55°C. Finition céramique haut de gamme avec socle induction 2-en-1.",
    stock_count: 22,
    is_active: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "10101010-1010-1010-1010-101010101010",
    order_number: "HK-2026-0001",
    customer_name: "كريم بلقاسم",
    phone: "0550123456",
    product_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    quantity: 1,
    wilaya_id: 16,
    commune_name: "حيدرة",
    precise_address: "شارع سيدي يحيى، عمارة 14، الطابق 2",
    customer_note: "يرجى الاتصال قبل الوصول بنصف ساعة",
    product_price: 6900,
    delivery_price: 400,
    total_price: 7300,
    delivery_type: "home",
    status: "delivered",
    internal_notes: "تم التوصيل بنجاح واستلام المبلغ كاش كامل",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "20202020-2020-2020-2020-202020202020",
    order_number: "HK-2026-0002",
    customer_name: "سمير عيساوي",
    phone: "0661987654",
    product_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    quantity: 1,
    wilaya_id: 19,
    commune_name: "سطيف",
    precise_address: "حي 1000 مسكن، قرب المركز التجاري بارك مول",
    customer_note: "توصيل في الفترة المسائية إن أمكن",
    product_price: 8500,
    delivery_price: 500,
    total_price: 9000,
    delivery_type: "home",
    status: "delivered",
    internal_notes: "زبون وفي، تم تأكيد الطلب فوراً والتسليم باليد",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "30303030-3030-3030-3030-303030303030",
    order_number: "HK-2026-0003",
    customer_name: "ياسمين بن عمارة",
    phone: "0770456123",
    product_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    quantity: 2,
    wilaya_id: 31,
    commune_name: "بئر الجير",
    precise_address: "حي خميستي فيلا رقم 8",
    customer_note: "الرجاء تغليف إضافي للهدايا",
    product_price: 19600,
    delivery_price: 550,
    total_price: 20150,
    delivery_type: "home",
    status: "shipped",
    internal_notes: "أرسل مع شركة ياليدين، رقم التتبع YAL-89210",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "40404040-4040-4040-4040-404040404040",
    order_number: "HK-2026-0004",
    customer_name: "أحمد منصوري",
    phone: "0542334455",
    product_id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    quantity: 1,
    wilaya_id: 25,
    commune_name: "علي منجلي",
    precise_address: "الوحدة الجوارية 16، عمارة 04",
    customer_note: "",
    product_price: 5400,
    delivery_price: 350,
    total_price: 5750,
    delivery_type: "office",
    status: "confirmed",
    internal_notes: "تم الاتصال وتأكيد رغبة الزبون في الاستلام من المكتب",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "50505050-5050-5050-5050-505050505050",
    order_number: "HK-2026-0005",
    customer_name: "فاطمة الزهراء رحماني",
    phone: "0671889900",
    product_id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    quantity: 1,
    wilaya_id: 9,
    commune_name: "بوفاريك",
    precise_address: "وسط المدينة قرب بنك التنمية المحلية",
    customer_note: "اتصلوا بي في الصباح",
    product_price: 4900,
    delivery_price: 450,
    total_price: 5350,
    delivery_type: "home",
    status: "new",
    internal_notes: "",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "60606060-6060-6060-6060-606060606060",
    order_number: "HK-2026-0006",
    customer_name: "طارق حداد",
    phone: "0555112233",
    product_id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    quantity: 1,
    wilaya_id: 5,
    commune_name: "باتنة",
    precise_address: "طريق بسكرة، عمارة الأوراس",
    customer_note: "",
    product_price: 4200,
    delivery_price: 600,
    total_price: 4800,
    delivery_type: "home",
    status: "new",
    internal_notes: "",
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
];

// Helper to interact with local store safely
const STORAGE_KEYS = {
  CATEGORIES: "hk_categories_store",
  PRODUCTS: "hk_products_store",
  ORDERS: "hk_orders_store",
  DELIVERY_PRICES: "hk_delivery_prices_store",
};

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn("Error saving to localStorage", err);
  }
}

// ------------------------------------------------------------------------------
// CATEGORIES SERVICE
// ------------------------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name_ar");
      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }
  return getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export async function saveCategory(category: Partial<Category>): Promise<Category> {
  const current = await getCategories();
  const id = category.id || generateUUID();
  const updatedCategory: Category = {
    id,
    name_ar: category.name_ar || "",
    name_fr: category.name_fr || "",
    slug: category.slug || id,
    image_url: category.image_url,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("categories").upsert(updatedCategory);
      if (error) {
        console.error("Supabase upsert category error:", error);
        throw new Error(error.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  const existingIdx = current.findIndex((c) => c.id === id);
  const next = [...current];
  if (existingIdx >= 0) {
    next[existingIdx] = updatedCategory;
  } else {
    next.push(updatedCategory);
  }
  setStored(STORAGE_KEYS.CATEGORIES, next);
  return updatedCategory;
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("categories").delete().eq("id", id);
    } catch (err) {
      console.error(err);
    }
  }
  const current = await getCategories();
  const next = current.filter((c) => c.id !== id);
  setStored(STORAGE_KEYS.CATEGORIES, next);
  return true;
}

// ------------------------------------------------------------------------------
// PRODUCTS SERVICE
// ------------------------------------------------------------------------------
export async function getProducts(onlyActive = true): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from("products").select("*").order("created_at", { ascending: false });
      if (onlyActive) {
        query = query.eq("is_active", true);
      }
      const { data, error } = await query;
      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  const all = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  return onlyActive ? all.filter((p) => p.is_active) : all;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await getProducts(false);
  return all.find((p) => p.id === id);
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const current = await getProducts(false);
  const id = product.id || generateUUID();
  const category_id =
    product.category_id && typeof product.category_id === "string" && product.category_id.trim() !== ""
      ? product.category_id.trim()
      : null;

  const updatedProduct: Product = {
    id,
    name_ar: product.name_ar || "",
    name_fr: product.name_fr || "",
    category_id,
    price: Number(product.price) || 0,
    images: product.images && product.images.length > 0 ? product.images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80"],
    videos: product.videos || [],
    description_ar: product.description_ar || "",
    description_fr: product.description_fr || "",
    stock_count: product.stock_count ?? 10,
    is_active: product.is_active ?? true,
    created_at: product.created_at || new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("products").upsert({
        ...updatedProduct,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error("Supabase upsert product error:", error);
        throw new Error(error.message);
      }
    } catch (err) {
      console.error("Save product exception:", err);
      throw err;
    }
  }

  const existingIdx = current.findIndex((p) => p.id === id);
  const next = [...current];
  if (existingIdx >= 0) {
    next[existingIdx] = updatedProduct;
  } else {
    next.unshift(updatedProduct);
  }
  setStored(STORAGE_KEYS.PRODUCTS, next);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Supabase deleteProduct error:", error);
      if (error.code === "23503" || error.message?.includes("foreign key constraint")) {
        throw new Error("has_orders");
      }
      throw new Error(error.message);
    }
  }
  const current = await getProducts(false);
  const next = current.filter((p) => p.id !== id);
  setStored(STORAGE_KEYS.PRODUCTS, next);
  return true;
}

// ------------------------------------------------------------------------------
// DELIVERY PRICING SERVICE (58 WILAYAS)
// ------------------------------------------------------------------------------
export async function getDeliveryPricing(): Promise<WilayaDeliveryPrice[]> {
  const defaultPricing: WilayaDeliveryPrice[] = ALGERIA_WILAYAS.map((w) => ({
    wilaya_id: w.id,
    home_delivery_price: w.default_home_delivery,
    office_delivery_price: w.default_office_delivery,
    is_active: true,
  }));

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("delivery_pricing").select("*");
      if (!error && data && data.length > 0) return data;
    } catch {
      // Fallback
    }
  }

  return getStored<WilayaDeliveryPrice[]>(STORAGE_KEYS.DELIVERY_PRICES, defaultPricing);
}

export async function getDeliveryPriceForWilaya(
  wilayaId: number,
  deliveryType: "home" | "office" = "home"
): Promise<number> {
  const all = await getDeliveryPricing();
  const pricing = all.find((p) => p.wilaya_id === Number(wilayaId));
  if (!pricing) {
    const wilaya = getWilayaById(wilayaId);
    if (!wilaya) return 500;
    return deliveryType === "home" ? wilaya.default_home_delivery : wilaya.default_office_delivery;
  }
  return deliveryType === "home" ? pricing.home_delivery_price : pricing.office_delivery_price;
}

export async function updateWilayaPricing(
  wilayaId: number,
  homePrice: number,
  officePrice: number
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("delivery_pricing").upsert({
        wilaya_id: wilayaId,
        home_delivery_price: homePrice,
        office_delivery_price: officePrice,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error("Supabase updateWilayaPricing error:", error);
        throw new Error(error.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  const current = await getDeliveryPricing();
  const idx = current.findIndex((p) => p.wilaya_id === wilayaId);
  const next = [...current];
  if (idx >= 0) {
    next[idx] = {
      ...next[idx],
      home_delivery_price: homePrice,
      office_delivery_price: officePrice,
    };
  } else {
    next.push({
      wilaya_id: wilayaId,
      home_delivery_price: homePrice,
      office_delivery_price: officePrice,
      is_active: true,
    });
  }
  setStored(STORAGE_KEYS.DELIVERY_PRICES, next);
}

// ------------------------------------------------------------------------------
// ORDERS SERVICE (COD WORKFLOW)
// ------------------------------------------------------------------------------
export async function getOrders(filter?: {
  status?: string;
  wilayaId?: number;
  search?: string;
}): Promise<Order[]> {
  let list = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        list = data;
      }
    } catch {
      // Fallback
    }
  }

  if (filter?.status && filter.status !== "all") {
    list = list.filter((o) => o.status === filter.status);
  }
  if (filter?.wilayaId) {
    list = list.filter((o) => o.wilaya_id === Number(filter.wilayaId));
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase().trim();
    list = list.filter(
      (o) =>
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.order_number.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const all = await getOrders();
  return all.find((o) => o.id === id);
}

export async function createOrder(
  data: Omit<Order, "id" | "order_number" | "created_at" | "status">
): Promise<Order> {
  const id = generateUUID();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const order_number = `HK-${new Date().getFullYear()}-${randNum}`;

  const newOrder: Order = {
    ...data,
    id,
    order_number,
    status: "new",
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("orders").insert(newOrder);
      if (error) {
        console.error("Supabase insert order error:", error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const current = await getOrders();
  const next = [newOrder, ...current];
  setStored(STORAGE_KEYS.ORDERS, next);

  // Decrement product stock
  try {
    const product = await getProductById(data.product_id);
    if (product) {
      const newStock = Math.max(0, product.stock_count - (data.quantity || 1));
      await saveProduct({ ...product, stock_count: newStock });
    }
  } catch (err) {
    console.error("Stock update error:", err);
  }

  return newOrder;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    } catch (err) {
      console.error(err);
    }
  }

  const current = await getOrders();
  const next = current.map((o) => (o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o));
  setStored(STORAGE_KEYS.ORDERS, next);
  return true;
}

export async function updateOrderInternalNotes(id: string, internal_notes: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("orders").update({ internal_notes, updated_at: new Date().toISOString() }).eq("id", id);
    } catch (err) {
      console.error(err);
    }
  }

  const current = await getOrders();
  const next = current.map((o) => (o.id === id ? { ...o, internal_notes } : o));
  setStored(STORAGE_KEYS.ORDERS, next);
  return true;
}

// ------------------------------------------------------------------------------
// CUSTOMER REPEAT-ORDER PHONE LOOKUP SERVICE
// Helps detect fake orders or serial cancelers vs loyal VIP buyers
// ------------------------------------------------------------------------------
export interface CustomerHistory {
  phone: string;
  customerName: string;
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  totalSpentDZD: number;
  trustScore: "high" | "medium" | "risk";
  orders: Order[];
}

export async function getCustomerHistoryByPhone(phoneQuery: string): Promise<CustomerHistory | null> {
  const cleanPhone = phoneQuery.replace(/\D/g, "");
  if (!cleanPhone) return null;

  const allOrders = await getOrders();
  const matches = allOrders.filter((o) => o.phone.replace(/\D/g, "").includes(cleanPhone));

  if (matches.length === 0) return null;

  const totalOrders = matches.length;
  const deliveredOrders = matches.filter((o) => o.status === "delivered").length;
  const cancelledOrders = matches.filter((o) => o.status === "cancelled").length;
  const returnedOrders = matches.filter((o) => o.status === "returned").length;

  const totalSpentDZD = matches
    .filter((o) => o.status === "delivered")
    .reduce((acc, o) => acc + o.product_price, 0);

  let trustScore: "high" | "medium" | "risk" = "medium";
  if (deliveredOrders >= 2 && returnedOrders === 0) {
    trustScore = "high";
  } else if (returnedOrders >= 2 || cancelledOrders >= 3) {
    trustScore = "risk";
  }

  return {
    phone: matches[0].phone,
    customerName: matches[0].customer_name,
    totalOrders,
    deliveredOrders,
    cancelledOrders,
    returnedOrders,
    totalSpentDZD,
    trustScore,
    orders: matches,
  };
}

// ------------------------------------------------------------------------------
// EARNINGS & LOGISTICS ANALYTICS SERVICE
// ------------------------------------------------------------------------------
export async function getAnalytics() {
  const orders = await getOrders();
  const products = await getProducts(false);

  // Revenue metrics
  const deliveredOrders = orders.filter((o) => o.status === "delivered");
  const confirmedOrders = orders.filter((o) => o.status === "confirmed" || o.status === "delivered");

  const productRevenueDelivered = deliveredOrders.reduce((acc, o) => acc + o.product_price, 0);
  const deliveryRevenueDelivered = deliveredOrders.reduce((acc, o) => acc + o.delivery_price, 0);
  const totalRevenueDelivered = productRevenueDelivered + deliveryRevenueDelivered;

  const averageOrderValue =
    deliveredOrders.length > 0 ? Math.round(productRevenueDelivered / deliveredOrders.length) : 0;

  const totalOrdersCount = orders.length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
  const returnedCount = orders.filter((o) => o.status === "returned").length;
  const cancellationRate =
    totalOrdersCount > 0 ? Math.round(((cancelledCount + returnedCount) / totalOrdersCount) * 100) : 0;

  // Status breakdown
  const statusCounts = {
    new: orders.filter((o) => o.status === "new").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    returned: orders.filter((o) => o.status === "returned").length,
  };

  // Orders by Wilaya
  const wilayaMap: Record<number, number> = {};
  orders.forEach((o) => {
    wilayaMap[o.wilaya_id] = (wilayaMap[o.wilaya_id] || 0) + 1;
  });

  const ordersByWilaya = Object.entries(wilayaMap)
    .map(([wId, count]) => {
      const wilaya = getWilayaById(wId);
      return {
        wilayaId: Number(wId),
        name_ar: wilaya ? wilaya.name_ar : `ولاية ${wId}`,
        name_fr: wilaya ? wilaya.name_fr : `Wilaya ${wId}`,
        count,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Best selling products
  const productSalesMap: Record<string, { units: number; revenue: number }> = {};
  orders.forEach((o) => {
    if (o.status !== "cancelled" && o.status !== "returned") {
      const curr = productSalesMap[o.product_id] || { units: 0, revenue: 0 };
      productSalesMap[o.product_id] = {
        units: curr.units + o.quantity,
        revenue: curr.revenue + o.product_price,
      };
    }
  });

  const bestSellingProducts = Object.entries(productSalesMap)
    .map(([pId, stats]) => {
      const prod = products.find((p) => p.id === pId);
      return {
        productId: pId,
        name_ar: prod ? prod.name_ar : "منتج",
        name_fr: prod ? prod.name_fr : "Produit",
        unitsSold: stats.units,
        revenue: stats.revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Operational alerts
  const today = new Date().toDateString();
  const ordersNeedingConfirmationToday = orders.filter(
    (o) => o.status === "new" && new Date(o.created_at).toDateString() === today
  );

  const threeDaysAgo = Date.now() - 3 * 86400000;
  const ordersStuckInShipped = orders.filter(
    (o) => o.status === "shipped" && new Date(o.created_at).getTime() < threeDaysAgo
  );

  const lowStockProducts = products.filter((p) => p.stock_count <= 5);

  return {
    totalRevenueDelivered,
    productRevenueDelivered,
    deliveryRevenueDelivered,
    averageOrderValue,
    cancellationRate,
    totalOrdersCount,
    statusCounts,
    ordersByWilaya,
    bestSellingProducts,
    ordersNeedingConfirmationToday,
    ordersStuckInShipped,
    lowStockProducts,
  };
}

