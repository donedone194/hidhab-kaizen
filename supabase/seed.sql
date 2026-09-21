-- ==============================================================================
-- HIDHAB KAIZEN (هضاب كايزن) - SEED DATA
-- 58 Algerian Wilayas, Delivery Rates, Categories, Products & Sample Orders
-- ==============================================================================

-- 1. SEED 58 ALGERIAN WILAYAS
INSERT INTO public.wilayas (id, code, name_ar, name_fr) VALUES
(1, '01', 'أدرار', 'Adrar'),
(2, '02', 'الشلف', 'Chlef'),
(3, '03', 'الأغواط', 'Laghouat'),
(4, '04', 'أم البواقي', 'Oum El Bouaghi'),
(5, '05', 'باتنة', 'Batna'),
(6, '06', 'بجاية', 'Béjaïa'),
(7, '07', 'بسكرة', 'Biskra'),
(8, '08', 'بشار', 'Béchar'),
(9, '09', 'البليدة', 'Blida'),
(10, '10', 'البويرة', 'Bouira'),
(11, '11', 'تمنراست', 'Tamanrasset'),
(12, '12', 'تبسة', 'Tébessa'),
(13, '13', 'تلمسان', 'Tlemcen'),
(14, '14', 'تيارت', 'Tiaret'),
(15, '15', 'تيزي وزو', 'Tizi Ouzou'),
(16, '16', 'الجزائر', 'Alger'),
(17, '17', 'الجلفة', 'Djelfa'),
(18, '18', 'جيجل', 'Jijel'),
(19, '19', 'سطيف', 'Sétif'),
(20, '20', 'سعيدة', 'Saïda'),
(21, '21', 'سكيكدة', 'Skikda'),
(22, '22', 'سيدي بلعباس', 'Sidi Bel Abbès'),
(23, '23', 'عنابة', 'Annaba'),
(24, '24', 'قالمة', 'Guelma'),
(25, '25', 'قسنطينة', 'Constantine'),
(26, '26', 'المدية', 'Médéa'),
(27, '27', 'مستغانم', 'Mostaganem'),
(28, '28', 'المسيلة', 'M''Sila'),
(29, '29', 'معسكر', 'Mascara'),
(30, '30', 'ورقلة', 'Ouargla'),
(31, '31', 'وهران', 'Oran'),
(32, '32', 'البيض', 'El Bayadh'),
(33, '33', 'إليزي', 'Illizi'),
(34, '34', 'برج بوعريريج', 'Bordj Bou Arréridj'),
(35, '35', 'بومرداس', 'Boumerdès'),
(36, '36', 'الطارف', 'El Tarf'),
(37, '37', 'تندوف', 'Tindouf'),
(38, '38', 'تيسمسيلت', 'Tissemsilt'),
(39, '39', 'الوادي', 'El Oued'),
(40, '40', 'خنشلة', 'Khenchela'),
(41, '41', 'سوق أهراس', 'Souk Ahras'),
(42, '42', 'تيبازة', 'Tipaza'),
(43, '43', 'ميلة', 'Mila'),
(44, '44', 'عين الدفلى', 'Aïn Defla'),
(45, '45', 'النعامة', 'Naâma'),
(46, '46', 'عين تموشنت', 'Aïn Témouchent'),
(47, '47', 'غرداية', 'Ghardaïa'),
(48, '48', 'غليزان', 'Relizane'),
(49, '49', 'تيميمون', 'Timimoun'),
(50, '50', 'برج باجي مختار', 'Bordj Badji Mokhtar'),
(51, '51', 'أولاد جلال', 'Ouled Djellal'),
(52, '52', 'بني عباس', 'Béni Abbès'),
(53, '53', 'عين صالح', 'In Salah'),
(54, '54', 'عين قزام', 'In Guezzam'),
(55, '55', 'تقرت', 'Touggourt'),
(56, '56', 'جانت', 'Djanet'),
(57, '57', 'المغير', 'El M''Ghair'),
(58, '58', 'المنيعة', 'El Meniaa')
ON CONFLICT (id) DO UPDATE 
SET name_ar = EXCLUDED.name_ar, name_fr = EXCLUDED.name_fr;

-- 2. SEED SAMPLE COMMUNES FOR MAJOR WILAYAS
INSERT INTO public.communes (wilaya_id, name_ar, name_fr, postal_code) VALUES
-- Alger (16)
(16, 'الجزائر الوسطى', 'Alger Centre', '16000'),
(16, 'سيدي امحمد', 'Sidi M''Hamed', '16014'),
(16, 'باب الوادي', 'Bab El Oued', '16008'),
(16, 'حيدرة', 'Hydra', '16035'),
(16, 'بن عكنون', 'Ben Aknoun', '16028'),
(16, 'الرويبة', 'Rouïba', '16016'),
(16, 'الدار البيضاء', 'Dar El Beïda', '16033'),
(16, 'بئر مراد رايس', 'Bir Mourad Raïs', '16030'),
(16, 'بئر خادم', 'Birkhadem', '16029'),
(16, 'دالي ابراهيم', 'Dély Ibrahim', '16020'),
(16, 'الشراقة', 'Chéraga', '16002'),
(16, 'زرالدة', 'Zéralda', '16063'),
-- Sétif (19) - Brand Heartland
(19, 'سطيف', 'Sétif', '19000'),
(19, 'العلمة', 'El Eulma', '19600'),
(19, 'عين أرنات', 'Aïn Arnat', '19014'),
(19, 'عين ولمان', 'Aïn Oulmene', '19200'),
(19, 'بوقاعة', 'Bougaa', '19300'),
(19, 'عين الكبيرة', 'Aïn El Kebira', '19400'),
-- Oran (31)
(31, 'وهران', 'Oran', '31000'),
(31, 'السانية', 'Es Sénia', '31100'),
(31, 'بئر الجير', 'Bir El Djir', '31130'),
(31, 'عين الترك', 'Aïn El Turk', '31300'),
(31, 'أرزيو', 'Arzew', '31200'),
-- Constantine (25)
(25, 'قسنطينة', 'Constantine', '25000'),
(25, 'الخروب', 'El Khroub', '25100'),
(25, 'علي منجلي', 'Ali Mendjeli', '25016'),
(25, 'حامة بوزيان', 'Hamma Bouziane', '25200'),
-- Blida (09)
(9, 'البليدة', 'Blida', '09000'),
(9, 'بوفاريك', 'Boufarik', '09400'),
(9, 'أولاد يعيش', 'Ouled Yaïch', '09004'),
(9, 'موزاية', 'Mouzaïa', '09300'),
-- Batna (05)
(5, 'باتنة', 'Batna', '05000'),
(5, 'بريكة', 'Barika', '05500'),
(5, 'عين التوتة', 'Aïn Touta', '05200'),
-- Annaba (23)
(23, 'عنابة', 'Annaba', '23000'),
(23, 'البوني', 'El Bouni', '23005'),
(23, 'سيدي عمار', 'Sidi Amar', '23014'),
-- Tizi Ouzou (15)
(15, 'تيزي وزو', 'Tizi Ouzou', '15000'),
(15, 'ذراع بن خدة', 'Draa Ben Khedda', '15100'),
(15, 'عزازقة', 'Azazga', '15300'),
-- Béjaïa (06)
(6, 'بجاية', 'Béjaïa', '06000'),
(6, 'أميزور', 'Amizour', '06300'),
(6, 'أقبو', 'Akbou', '06200'),
-- Bordj Bou Arréridj (34)
(34, 'برج بوعريريج', 'Bordj Bou Arréridj', '34000'),
(34, 'رأس الوادي', 'Ras El Oued', '34200')
ON CONFLICT DO NOTHING;

-- 3. SEED DELIVERY PRICING FOR ALL 58 WILAYAS
-- Rates calibrated to standard Algerian express courier tiers (Yalidine, ZR Express)
INSERT INTO public.delivery_pricing (wilaya_id, home_delivery_price, office_delivery_price, is_active) VALUES
(1, 1000, 750, true),   -- Adrar
(2, 600, 400, true),    -- Chlef
(3, 800, 550, true),    -- Laghouat
(4, 650, 450, true),    -- Oum El Bouaghi
(5, 600, 400, true),    -- Batna
(6, 600, 400, true),    -- Béjaïa
(7, 750, 500, true),    -- Biskra
(8, 900, 650, true),    -- Béchar
(9, 450, 300, true),    -- Blida
(10, 550, 350, true),   -- Bouira
(11, 1200, 900, true),  -- Tamanrasset
(12, 700, 450, true),   -- Tébessa
(13, 650, 450, true),   -- Tlemcen
(14, 650, 450, true),   -- Tiaret
(15, 550, 350, true),   -- Tizi Ouzou
(16, 400, 250, true),   -- Alger (Capital)
(17, 750, 500, true),   -- Djelfa
(18, 600, 400, true),   -- Jijel
(19, 500, 300, true),   -- Sétif (Headquarters)
(20, 700, 450, true),   -- Saïda
(21, 600, 400, true),   -- Skikda
(22, 650, 450, true),   -- Sidi Bel Abbès
(23, 600, 400, true),   -- Annaba
(24, 650, 450, true),   -- Guelma
(25, 550, 350, true),   -- Constantine
(26, 500, 350, true),   -- Médéa
(27, 600, 400, true),   -- Mostaganem
(28, 650, 450, true),   -- M'Sila
(29, 650, 450, true),   -- Mascara
(30, 850, 600, true),   -- Ouargla
(31, 550, 350, true),   -- Oran
(32, 850, 600, true),   -- El Bayadh
(33, 1200, 900, true),  -- Illizi
(34, 500, 300, true),   -- Bordj Bou Arréridj
(35, 450, 300, true),   -- Boumerdès
(36, 650, 450, true),   -- El Tarf
(37, 1300, 950, true),  -- Tindouf
(38, 700, 450, true),   -- Tissemsilt
(39, 850, 600, true),   -- El Oued
(40, 700, 450, true),   -- Khenchela
(41, 700, 450, true),   -- Souk Ahras
(42, 450, 300, true),   -- Tipaza
(43, 600, 400, true),   -- Mila
(44, 550, 350, true),   -- Aïn Defla
(45, 850, 600, true),   -- Naâma
(46, 650, 450, true),   -- Aïn Témouchent
(47, 850, 600, true),   -- Ghardaïa
(48, 650, 450, true),   -- Relizane
(49, 1000, 750, true),  -- Timimoun
(50, 1400, 1000, true), -- Bordj Badji Mokhtar
(51, 800, 550, true),   -- Ouled Djellal
(52, 1000, 750, true),  -- Béni Abbès
(53, 1100, 800, true),  -- In Salah
(54, 1400, 1000, true), -- In Guezzam
(55, 850, 600, true),   -- Touggourt
(56, 1300, 950, true),  -- Djanet
(57, 850, 600, true),   -- El M'Ghair
(58, 900, 650, true),   -- El Meniaa
(59, 800, 550, true),   -- Aflou
(60, 600, 400, true),   -- Barika
(61, 700, 500, true),   -- El Kantara
(62, 700, 500, true),   -- Bir El Ater
(63, 650, 450, true),   -- El Aricha
(64, 650, 450, true),   -- Ksar Chellala
(65, 650, 450, true),   -- Aïn Ouessara
(66, 700, 500, true),   -- Messaad
(67, 600, 400, true),   -- Ksar El Boukhari
(68, 650, 450, true),   -- Bou Saâda
(69, 800, 600, true)    -- El Abiodh Sidi Cheikh
ON CONFLICT (wilaya_id) DO UPDATE 
SET home_delivery_price = EXCLUDED.home_delivery_price, 
    office_delivery_price = EXCLUDED.office_delivery_price;

-- 4. SEED CATEGORIES
INSERT INTO public.categories (id, name_ar, name_fr, slug, image_url) VALUES
('11111111-1111-1111-1111-111111111111', 'الإلكترونيات الذكية', 'Électronique Intelligente', 'electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'),
('22222222-2222-2222-2222-222222222222', 'المنزل العصري والمعيشة', 'Maison & Confort', 'home-living', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80'),
('33333333-3333-3333-3333-333333333333', 'معدات وأدوات احترافية', 'Outillage Professionnel', 'pro-tools', 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=800&auto=format&fit=crop&q=80'),
('44444444-4444-4444-4444-444444444444', 'العناية والصحة الشخصية', 'Soins & Bien-être', 'wellness-care', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED PRODUCTS
INSERT INTO public.products (id, name_ar, name_fr, category_id, price, images, videos, description_ar, description_fr, stock_count, is_active) VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'سماعات لاسلكية برو بخاصية العزل النشط للضوضاء Kaizen SoundX',
    'Écouteurs Sans Fil Pro Kaizen SoundX avec ANC',
    '11111111-1111-1111-1111-111111111111',
    6900,
    ARRAY[
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop&q=80'
    ],
    ARRAY['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    'سماعات SoundX الاحترافية مع تقنية العزل الصوتي النشط (Active Noise Cancelling) وتصميم مريح للأذن. بطارية تدوم حتى 36 ساعة مع علبة الشحن السريع Type-C. ميكروفونات رباعية فائقة النقاء للمكالمات والاجتماعات مع مقاومة للتعرق والرطوبة IPX5.',
    'Écouteurs haute fidélité Kaizen SoundX dotés de la réduction active du bruit (ANC). Autonomie impressionnante de 36 heures avec l''étui de charge rapide Type-C. Quatre microphones ultra-clairs pour appels limpides et étanchéité IPX5 certifiée.',
    28,
    true
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'ساعة يد ذكية مقاومة للماء مع مراقبة الصحة والاتصال Kaizen Pulse Ultra',
    'Montre Connectée Sport & Santé Kaizen Pulse Ultra',
    '11111111-1111-1111-1111-111111111111',
    8500,
    ARRAY[
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80'
    ],
    ARRAY['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    'ساعة ذكية عصرية بشاشة AMOLED فائقة الوضوح بحجم 1.96 إنش، تدعم المكالمات عبر البلوتوث واستقبال الإشعارات باللغة العربية. بطارية تدوم حتى 10 أيام استخدام متواصل مع حساسات دقيقة لقياس نبضات القلب ونسبة الأكسجين وتتبع أكثر من 100 تمرين رياضي.',
    'Montre connectée haut de gamme avec écran AMOLED 1.96 pouce. Appels Bluetooth directs, suivi précis de la fréquence cardiaque et de la SpO2, autonomie prolongée jusqu''à 10 jours et compatibilité totale iOS/Android.',
    14,
    true
),
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'جهاز تدليك العضلات الاحترافي المحمول Kaizen Theragun Pro 6-Speed',
    'Pistolet de Massage Musculaire Kaizen Theragun Pro',
    '44444444-4444-4444-4444-444444444444',
    9800,
    ARRAY[
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80'
    ],
    ARRAY[]::text[],
    'جهاز مساج وتدليك عميق للأنسجة والعضلات مع 6 سرعات قابلة للتعديل و4 رؤوس تدليك مخصصة لكل عضلة. مثالي للرياضيين ولتخفيف آلام الظهر والرقبة بعد يوم عمل شاق. محرك هادئ للغاية مع بطارية ليثيوم طويلة الأمد.',
    'Pistolet de massage à percussion pour soulager les tensions musculaires en profondeur. 6 vitesses réglables, 4 embouts ergonomiques inclus et moteur ultra-silencieux à haute puissance.',
    6,
    true
),
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'مصباح طاولة ذكي متعدد الألوان مع شاحن لاسلكي سريع Kaizen Aura Light',
    'Lampe de Bureau Intelligente avec Chargeur Sans Fil Kaizen Aura',
    '22222222-2222-2222-2222-222222222222',
    5400,
    ARRAY[
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&auto=format&fit=crop&q=80'
    ],
    ARRAY[]::text[],
    'مصباح مكتب عصري متعدد الوظائف بتصميم مينيمالي انسيابي. قاعدة شحن لاسلكي سريع بقوة 15 واط متوافقة مع جميع الهواتف الذكية. إضاءة LED مريحة للعين مع 3 درجات حرارة ألوان وسطوع قابل للتحكم باللمس.',
    'Lampe moderne et minimaliste intégrant une station de recharge sans fil 15W. Luminosité tactile à intensité variable et 3 modes d''éclairage protégeant vos yeux lors de vos lectures nocturnes.',
    19,
    true
),
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'طقم مفكات براغي كهربائي دقيق مع 48 قطعة Kaizen Precision Kit',
    'Tournevis Électrique de Précision 48-en-1 Kaizen',
    '33333333-3333-3333-3333-333333333333',
    4900,
    ARRAY[
        'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=900&auto=format&fit=crop&q=80'
    ],
    ARRAY[]::text[],
    'طقم مفكات كهربائية عالية الدقة من الفولاذ المقاوم للصدأ S2 المطور، مخصص لإصلاح الهواتف، الحواسيب، الساعات والأجهزة الإلكترونية. عزم دوران كهربائي مزدوج وإضاءة LED أمامية مدمجة لرؤية الزوايا الدقيقة.',
    'Set de tournevis électrique de précision comprenant 48 embouts magnétiques en acier trempé S2. Idéal pour la réparation d''ordinateurs portables, smartphones et petits appareils.',
    3, -- Low stock trigger!
    true
),
(
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'كوب ذكي ذاتي التسخين مع تحكم دقيق بدرجة الحرارة Kaizen ThermoCup',
    'Mug Intelligent Auto-Chauffant Kaizen ThermoCup',
    '22222222-2222-2222-2222-222222222222',
    4200,
    ARRAY[
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=80'
    ],
    ARRAY[]::text[],
    'كوب حراري ذكي يحافظ على قهوتك أو شايك عند درجة الحرارة المثالية (55°C) طوال اليوم. مصنوع من السيراميك الفاخر مع قاعدة تسخين لاسلكية ذكية تعمل أيضاً كشاحن سريع للهاتف.',
    'Mug thermique intelligent gardant votre boisson à température parfaite de 55°C. Finition céramique haut de gamme avec socle induction 2-en-1.',
    22,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED REALISTIC SAMPLE ORDERS FOR ANALYTICS AND WORKFLOW
INSERT INTO public.orders (
    id, order_number, customer_name, phone, product_id, quantity, wilaya_id, 
    commune_name, precise_address, customer_note, product_price, delivery_price, 
    total_price, delivery_type, status, internal_notes, created_at
) VALUES
(
    '10101010-1010-1010-1010-101010101010',
    'HK-2026-0001',
    'كريم بلقاسم',
    '0550123456',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    1,
    16,
    'حيدرة',
    'شارع سيدي يحيى، عمارة 14، الطابق 2',
    'يرجى الاتصال قبل الوصول بنصف ساعة',
    6900,
    400,
    7300,
    'home',
    'delivered',
    'تم التوصيل بنجاح واستلام المبلغ كاش كامل',
    now() - interval '5 days'
),
(
    '20202020-2020-2020-2020-202020202020',
    'HK-2026-0002',
    'سمير عيساوي',
    '0661987654',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    1,
    19,
    'سطيف',
    'حي 1000 مسكن، قرب المركز التجاري بارك مول',
    'توصيل في الفترة المسائية إن أمكن',
    8500,
    500,
    9000,
    'home',
    'delivered',
    'زبون وفي، تم تأكيد الطلب فوراً والتسليم باليد',
    now() - interval '4 days'
),
(
    '30303030-3030-3030-3030-303030303030',
    'HK-2026-0003',
    'ياسمين بن عمارة',
    '0770456123',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    2,
    31,
    'بئر الجير',
    'حي خميستي فيلا رقم 8',
    'الرجاء تغليف إضافي للهدايا',
    19600,
    550,
    20150,
    'home',
    'shipped',
    'أرسل مع شركة ياليدين، رقم التتبع YAL-89210',
    now() - interval '2 days'
),
(
    '40404040-4040-4040-4040-404040404040',
    'HK-2026-0004',
    'أحمد منصوري',
    '0542334455',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    1,
    25,
    'علي منجلي',
    'الوحدة الجوارية 16، عمارة 04',
    '',
    5400,
    350,
    5750,
    'office',
    'confirmed',
    'تم الاتصال وتأكيد رغبة الزبون في الاستلام من المكتب',
    now() - interval '1 day'
),
(
    '50505050-5050-5050-5050-505050505050',
    'HK-2026-0005',
    'فاطمة الزهراء رحماني',
    '0671889900',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    1,
    9,
    'بوفاريك',
    'وسط المدينة قرب بنك التنمية المحلية',
    'اتصلوا بي في الصباح',
    4900,
    450,
    5350,
    'home',
    'new',
    NULL,
    now() - interval '2 hours'
),
(
    '60606060-6060-6060-6060-606060606060',
    'HK-2026-0006',
    'طارق حداد',
    '0555112233',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    1,
    5,
    'باتنة',
    'طريق بسكرة، عمارة الأوراس',
    '',
    4200,
    600,
    4800,
    'home',
    'new',
    NULL,
    now() - interval '30 minutes'
)
ON CONFLICT (id) DO NOTHING;

