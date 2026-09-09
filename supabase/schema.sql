-- ==============================================================================
-- HIDHAB KAIZEN (هضاب كايزن) - SUPABASE POSTGRESQL SCHEMA
-- Full-stack E-Commerce Database Schema (Cash on Delivery / COD)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar TEXT NOT NULL,
    name_fr TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar TEXT NOT NULL,
    name_fr TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price INTEGER NOT NULL CHECK (price >= 0), -- Stored in Algerian Dinar (DZD)
    images TEXT[] NOT NULL DEFAULT '{}',
    videos TEXT[] NOT NULL DEFAULT '{}',
    description_ar TEXT,
    description_fr TEXT,
    stock_count INTEGER NOT NULL DEFAULT 10 CHECK (stock_count >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. WILAYAS TABLE (58 Algerian Provinces)
CREATE TABLE IF NOT EXISTS public.wilayas (
    id INTEGER PRIMARY KEY, -- 1 to 58
    code VARCHAR(2) NOT NULL UNIQUE, -- '01' to '58'
    name_ar TEXT NOT NULL,
    name_fr TEXT NOT NULL
);

-- 4. COMMUNES TABLE (Algerian Municipalities)
CREATE TABLE IF NOT EXISTS public.communes (
    id SERIAL PRIMARY KEY,
    wilaya_id INTEGER NOT NULL REFERENCES public.wilayas(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_fr TEXT NOT NULL,
    postal_code VARCHAR(10)
);

-- 5. DELIVERY PRICING TABLE (Admin-configurable per Wilaya)
CREATE TABLE IF NOT EXISTS public.delivery_pricing (
    id SERIAL PRIMARY KEY,
    wilaya_id INTEGER NOT NULL UNIQUE REFERENCES public.wilayas(id) ON DELETE CASCADE,
    home_delivery_price INTEGER NOT NULL DEFAULT 500 CHECK (home_delivery_price >= 0),
    office_delivery_price INTEGER NOT NULL DEFAULT 350 CHECK (office_delivery_price >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE, -- e.g. 'HK-2026-0001'
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    wilaya_id INTEGER NOT NULL REFERENCES public.wilayas(id) ON DELETE RESTRICT,
    commune_id INTEGER REFERENCES public.communes(id) ON DELETE SET NULL,
    commune_name TEXT, -- Fallback string if commune id is not provided
    precise_address TEXT NOT NULL,
    customer_note TEXT,
    product_price INTEGER NOT NULL CHECK (product_price >= 0),
    delivery_price INTEGER NOT NULL DEFAULT 0 CHECK (delivery_price >= 0),
    total_price INTEGER NOT NULL CHECK (total_price >= 0),
    delivery_type VARCHAR(20) NOT NULL DEFAULT 'home' CHECK (delivery_type IN ('home', 'office')),
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned')),
    internal_notes TEXT, -- Admin / staff operational comments
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ADMIN USERS & ROLES TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_communes_wilaya ON public.communes(wilaya_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_wilaya ON public.orders(wilaya_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wilayas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, Admin write
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL TO authenticated USING (true);

-- Products: Public read active products, Admin all
CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admin write products" ON public.products FOR ALL TO authenticated USING (true);

-- Wilayas & Communes: Public read, Admin write
CREATE POLICY "Public read wilayas" ON public.wilayas FOR SELECT USING (true);
CREATE POLICY "Public read communes" ON public.communes FOR SELECT USING (true);

-- Delivery Pricing: Public read, Admin write
CREATE POLICY "Public read delivery_pricing" ON public.delivery_pricing FOR SELECT USING (true);
CREATE POLICY "Admin update delivery_pricing" ON public.delivery_pricing FOR ALL TO authenticated USING (true);

-- Orders: Public can create an order, Admin has full read/write
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view orders" ON public.orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can update orders" ON public.orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete orders" ON public.orders FOR DELETE TO authenticated USING (true);

-- Admin Users: Authenticated only
CREATE POLICY "Admin users self read" ON public.admin_users FOR SELECT TO authenticated USING (true);

-- ==============================================================================
-- SUPABASE STORAGE BUCKET SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public access to product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images');

