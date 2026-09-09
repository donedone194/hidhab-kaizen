-- ==============================================================================
-- HIDHAB KAIZEN - FIX ROW LEVEL SECURITY (RLS) FOR STORE & ADMIN DASHBOARD
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/ayaihdxudfqaoqomykko/sql)
-- ==============================================================================

-- 1. PRODUCTS: Allow full viewing, adding, updating, and deleting
DROP POLICY IF EXISTS "Admin write products" ON public.products;
DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (true);

-- 2. CATEGORIES: Allow full viewing, adding, and editing
DROP POLICY IF EXISTS "Admin write categories" ON public.categories;
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (true);

-- 3. DELIVERY PRICING: Allow full viewing and editing for all 58 Wilayas
DROP POLICY IF EXISTS "Admin update delivery_pricing" ON public.delivery_pricing;
DROP POLICY IF EXISTS "Public read delivery_pricing" ON public.delivery_pricing;
CREATE POLICY "Public read delivery_pricing" ON public.delivery_pricing FOR SELECT USING (true);
CREATE POLICY "Admin update delivery_pricing" ON public.delivery_pricing FOR ALL USING (true);

-- 4. ORDERS: Allow placing orders, viewing orders in admin, and updating statuses
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can view orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can delete orders" ON public.orders;

CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Admin can update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Admin can delete orders" ON public.orders FOR DELETE USING (true);

-- 5. STORAGE: Ensure public bucket exists and allow image uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload to product images" ON storage.objects;

CREATE POLICY "Public access to product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Allow upload to product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
