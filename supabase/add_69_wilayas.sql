-- ==============================================================================
-- HIDHAB KAIZEN - ADD WILAYAS 59 TO 69 TO SUPABASE DATABASE
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ayaihdxudfqaoqomykko/sql/new
-- ==============================================================================

INSERT INTO public.delivery_pricing (wilaya_id, home_delivery_price, office_delivery_price, is_active) VALUES
(59, 800, 550, true),   -- ???? (Aflou)
(60, 600, 400, true),   -- ????? (Barika)
(61, 700, 500, true),   -- ??????? (El Kantara)
(62, 700, 500, true),   -- ??? ?????? (Bir El Ater)
(63, 650, 450, true),   -- ??????? (El Aricha)
(64, 650, 450, true),   -- ??? ??????? (Ksar Chellala)
(65, 650, 450, true),   -- ??? ????? (Aïn Ouessara)
(66, 700, 500, true),   -- ???? (Messaad)
(67, 600, 400, true),   -- ??? ??????? (Ksar El Boukhari)
(68, 650, 450, true),   -- ??????? (Bou Saâda)
(69, 800, 600, true)    -- ?????? ???? ????? (El Abiodh Sidi Cheikh)
ON CONFLICT (wilaya_id) DO UPDATE 
SET home_delivery_price = EXCLUDED.home_delivery_price, 
    office_delivery_price = EXCLUDED.office_delivery_price,
    is_active = true;

