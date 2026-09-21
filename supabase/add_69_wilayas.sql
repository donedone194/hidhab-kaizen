-- ==============================================================================
-- HIDHAB KAIZEN - ADD WILAYAS 59 TO 69 TO SUPABASE DATABASE
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ayaihdxudfqaoqomykko/sql/new
-- ==============================================================================

-- STEP 1: Add Wilayas 59 to 69 to public.wilayas table first
INSERT INTO public.wilayas (id, code, name_ar, name_fr) VALUES
(59, '59', 'أفلو', 'Aflou'),
(60, '60', 'بريكة', 'Barika'),
(61, '61', 'القنطرة', 'El Kantara'),
(62, '62', 'بئر العاتر', 'Bir El Ater'),
(63, '63', 'العريشة', 'El Aricha'),
(64, '64', 'قصر الشلالة', 'Ksar Chellala'),
(65, '65', 'عين وسارة', 'Aïn Ouessara'),
(66, '66', 'مسعد', 'Messaad'),
(67, '67', 'قصر البخاري', 'Ksar El Boukhari'),
(68, '68', 'بوسعادة', 'Bou Saâda'),
(69, '69', 'الأبيض سيدي الشيخ', 'El Abiodh Sidi Cheikh')
ON CONFLICT (id) DO UPDATE 
SET code = EXCLUDED.code, name_ar = EXCLUDED.name_ar, name_fr = EXCLUDED.name_fr;

-- STEP 2: Add Communes for Wilayas 59 to 69
INSERT INTO public.communes (wilaya_id, name_ar, name_fr, postal_code) VALUES
(59, 'أفلو', 'Aflou', '59000'),
(59, 'سبقاق', 'Sebgag', '59100'),
(59, 'سيدي بوزيد', 'Sidi Bouzid', '59200'),
(60, 'بريكة', 'Barika', '60000'),
(60, 'إمدوكال', 'M''doukal', '60100'),
(60, 'بيطام', 'Bitam', '60200'),
(61, 'القنطرة', 'El Kantara', '61000'),
(61, 'عين زعطوط', 'Aïn Zaatout', '61100'),
(62, 'بئر العاتر', 'Bir El Ater', '62000'),
(62, 'العقلة', 'El Ogla', '62100'),
(62, 'أم علي', 'Oum Ali', '62200'),
(63, 'العريشة', 'El Aricha', '63000'),
(63, 'البويهي', 'El Bouihi', '63100'),
(63, 'سيدي الجيلالي', 'Sidi Djillali', '63200'),
(64, 'قصر الشلالة', 'Ksar Chellala', '64000'),
(64, 'سرغين', 'Serghine', '64100'),
(64, 'زمالة الأمير عبد القادر', 'Zmalet El Emir Abdelkader', '64200'),
(65, 'عين وسارة', 'Aïn Ouessara', '65000'),
(65, 'قرنيني', 'Guernini', '65100'),
(65, 'بيرين', 'Birine', '65200'),
(66, 'مسعد', 'Messaad', '66000'),
(66, 'دلدول', 'Deldoul', '66100'),
(66, 'سلمانة', 'Selmana', '66200'),
(66, 'سد رحال', 'Sed Rahal', '66300'),
(67, 'قصر البخاري', 'Ksar El Boukhari', '67000'),
(67, 'سانق', 'Saneg', '67100'),
(67, 'مفاتحة', 'M''fatha', '67200'),
(68, 'بوسعادة', 'Bou Saâda', '68000'),
(68, 'الهامل', 'El Hamel', '68100'),
(68, 'أولتم', 'Oulteme', '68200'),
(68, 'بن سرور', 'Ben Srour', '68300'),
(69, 'الأبيض سيدي الشيخ', 'El Abiodh Sidi Cheikh', '69000'),
(69, 'عين العراك', 'Aïn El Orak', '69100'),
(69, 'البنود', 'El Bnoud', '69200'),
(69, 'أربوات', 'Arbaouat', '69300')
ON CONFLICT DO NOTHING;

-- STEP 3: Add Delivery Pricing for Wilayas 59 to 69
INSERT INTO public.delivery_pricing (wilaya_id, home_delivery_price, office_delivery_price, is_active) VALUES
(59, 800, 550, true),   -- أفلو (Aflou)
(60, 600, 400, true),   -- بريكة (Barika)
(61, 700, 500, true),   -- القنطرة (El Kantara)
(62, 700, 500, true),   -- بئر العاتر (Bir El Ater)
(63, 650, 450, true),   -- العريشة (El Aricha)
(64, 650, 450, true),   -- قصر الشلالة (Ksar Chellala)
(65, 650, 450, true),   -- عين وسارة (Aïn Ouessara)
(66, 700, 500, true),   -- مسعد (Messaad)
(67, 600, 400, true),   -- قصر البخاري (Ksar El Boukhari)
(68, 650, 450, true),   -- بوسعادة (Bou Saâda)
(69, 800, 600, true)    -- الأبيض سيدي الشيخ (El Abiodh Sidi Cheikh)
ON CONFLICT (wilaya_id) DO UPDATE 
SET home_delivery_price = EXCLUDED.home_delivery_price, 
    office_delivery_price = EXCLUDED.office_delivery_price,
    is_active = true;
