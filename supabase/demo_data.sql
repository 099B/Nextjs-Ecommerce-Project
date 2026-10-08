-- Clear old data if any
TRUNCATE TABLE public.hero_side_banners RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.hero_sliders RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.promo_banners RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.products RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.categories RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.store_settings RESTART IDENTITY CASCADE;

-- Insert demo store settings
INSERT INTO public.store_settings (store_name, logo_url, contact_email) VALUES
('NextJS Store', '/images/logo/logo.svg', 'support@nextjsstore.com');

-- Insert demo categories
INSERT INTO public.categories (id, name_fr, name_en, name_ar, slug, image_url) VALUES
(1, 'Électronique', 'Electronics', 'إلكترونيات', 'electronics', '/images/categories/electronics.png'),
(2, 'Mobiles', 'Mobiles', 'هواتف', 'mobiles', '/images/categories/mobiles.png'),
(3, 'Ordinateurs', 'Computers', 'حواسيب', 'computers', '/images/categories/computers.png'),
(4, 'Accessoires portables', 'Wearables', 'أجهزة قابلة للارتداء', 'wearables', '/images/categories/wearables.png'),
(5, 'Accessoires', 'Accessories', 'إكسسوارات', 'accessories', '/images/categories/accessories.png'),
(6, 'Tablettes', 'Tablets', 'أجهزة لوحية', 'tablets', '/images/categories/tablets.png'),
(7, 'Réseaux', 'Networking', 'شبكات', 'networking', '/images/categories/networking.png');

-- Insert demo data into products table
INSERT INTO public.products (id, title_fr, title_en, title_ar, reviews, price, discounted_price, category_id, description_fr, description_en, description_ar, stock, imgs) VALUES
(1, 'Manette USB Havit HV-G69', 'Havit HV-G69 USB Gamepad', 'يد تحكم هافيت HV-G69', 15, 59.00, 29.00, 1, 'Manette USB de haute qualité pour les jeux PC.', 'High quality USB Gamepad for PC gaming.', 'يد تحكم يو اس بي عالية الجودة لألعاب الكمبيوتر.', 50, '["/images/products/product-1-bg-1.png", "/images/products/product-1-bg-2.png", "/images/products/product-1-sm-1.png", "/images/products/product-1-sm-2.png"]'),
(2, 'iPhone 14 Plus, 6/128Go', 'iPhone 14 Plus , 6/128GB', 'ايفون ١٤ بلس ، ٦/١٢٨ جيجا', 5, 899.00, 99.00, 2, 'Dernier Apple iPhone 14 Plus avec 128 Go de stockage.', 'Latest Apple iPhone 14 Plus with 128GB storage.', 'أحدث هاتف ايفون 14 بلس بسعة 128 جيجابايت.', 20, '["/images/products/product-2-bg-1.png", "/images/products/product-2-bg-2.png", "/images/products/product-2-sm-1.png", "/images/products/product-2-sm-2.png"]'),
(3, 'Apple iMac M1 24 pouces 2021', 'Apple iMac M1 24-inch 2021', 'ابل ايماك ام 1 24 بوصة 2021', 5, 59.00, 29.00, 3, 'Apple iMac avec puce M1, écran Retina 24 pouces.', 'Apple iMac with M1 chip, 24-inch Retina display.', 'أبل آيماك بشريحة M1 ، شاشة ريتينا 24 بوصة.', 10, '["/images/products/product-3-bg-1.png", "/images/products/product-3-bg-2.png", "/images/products/product-3-sm-1.png", "/images/products/product-3-sm-2.png"]'),
(4, 'Puce MacBook Air M1, 8/256Go', 'MacBook Air M1 chip, 8/256GB', 'ماك بوك اير ام 1 ، 8/256 جيجا', 6, 59.00, 29.00, 3, 'MacBook Air léger avec des performances M1.', 'Lightweight MacBook Air with M1 performance.', 'جهاز ماك بوك اير خفيف الوزن بأداء شريحة M1.', 15, '["/images/products/product-4-bg-1.png", "/images/products/product-4-bg-2.png", "/images/products/product-4-sm-1.png", "/images/products/product-4-sm-2.png"]'),
(5, 'Apple Watch Ultra', 'Apple Watch Ultra', 'ساعة ابل الترا', 3, 99.00, 29.00, 4, 'Apple Watch Ultra robuste pour les sports extrêmes.', 'Rugged and capable Apple Watch Ultra for extreme sports.', 'ساعة أبل ألترا متينة وقادرة على الرياضات الشديدة.', 30, '["/images/products/product-5-bg-1.png", "/images/products/product-5-bg-2.png", "/images/products/product-5-sm-1.png", "/images/products/product-5-sm-2.png"]'),
(6, 'Souris Logitech MX Master 3', 'Logitech MX Master 3 Mouse', 'ماوس لوجيتك MX ماستر 3', 15, 59.00, 29.00, 5, 'Souris sans fil avancée pour la productivité.', 'Advanced wireless mouse for productivity.', 'ماوس لاسلكي متقدم للإنتاجية.', 40, '["/images/products/product-6-bg-1.png", "/images/products/product-6-bg-2.png", "/images/products/product-6-sm-1.png", "/images/products/product-6-sm-2.png"]'),
(7, 'Apple iPad Air 5e génération - 64 Go', 'Apple iPad Air 5th Gen - 64GB', 'ابل ايباد اير الجيل الخامس - 64 جيجا', 15, 59.00, 29.00, 6, 'iPad Air polyvalent avec puce M1.', 'Versatile iPad Air with M1 chip.', 'جهاز آيباد أير متعدد الاستخدامات بشريحة M1.', 25, '["/images/products/product-7-bg-1.png", "/images/products/product-7-bg-2.png", "/images/products/product-7-sm-1.png", "/images/products/product-7-sm-2.png"]'),
(8, 'Routeur double bande Asus RT', 'Asus RT Dual Band Router', 'راوتر اسوس RT مزدوج النطاق', 15, 59.00, 29.00, 7, 'Routeur WiFi double bande haut débit.', 'High-speed dual-band WiFi router.', 'راوتر واي فاي عالي السرعة مزدوج النطاق.', 60, '["/images/products/product-8-bg-1.png", "/images/products/product-8-bg-2.png", "/images/products/product-8-sm-1.png", "/images/products/product-8-sm-2.png"]');

-- Reset sequence to handle manual ID insertion
SELECT setval('public.categories_id_seq', 7);
SELECT setval('public.products_id_seq', 8);

-- Insert demo promo banners
INSERT INTO public.promo_banners (layout, subtitle_fr, subtitle_en, subtitle_ar, title_fr, title_en, title_ar, description_fr, description_en, description_ar, image_url, bg_color, theme_color, button_text_fr, button_text_en, button_text_ar, button_link) VALUES
('big', 'Apple iPhone 14 Plus', 'Apple iPhone 14 Plus', 'ابل ايفون 14 بلس', 'JUSQU''À 30% DE RÉDUCTION', 'UP TO 30% OFF', 'خصم يصل إلى 30٪', 'L''iPhone 14 possède la même puce ultra-rapide que celle de l''iPhone 13 Pro.', 'iPhone 14 has the same superspeedy chip that’s in iPhone 13 Pro.', 'يحتوي آيفون 14 على نفس الشريحة فائقة السرعة الموجودة في آيفون 13 برو.', '/images/promo/promo-01.png', '#F5F5F7', 'blue', 'Acheter', 'Buy Now', 'اشتري الآن', '#'),
('small_left_img', 'Tapis de course pliable', 'Foldable Motorised Treadmill', 'جهاز مشي قابل للطي', 'Entraînement à la maison', 'Workout At Home', 'تمرين في المنزل', '20% de réduction', 'Flat 20% off', 'خصم ثابت 20٪', '/images/promo/promo-02.png', '#DBF4F3', 'teal', 'Saisir', 'Grab Now', 'احصل عليه', '#'),
('small_right_img', 'Apple Watch Ultra', 'Apple Watch Ultra', 'ساعة ابل الترا', 'Jusqu''à 40% de réduction', 'Up to 40% off', 'خصم يصل إلى 40٪', 'Le boîtier en titane de qualité aérospatiale trouve l''équilibre parfait.', 'The aerospace-grade titanium case strikes the perfect balance of everything.', 'هيكل التيتانيوم المستخدم في مجال الطيران يحقق التوازن المثالي.', '/images/promo/promo-03.png', '#FFECE1', 'orange', 'Acheter', 'Buy Now', 'اشتري الآن', '#');


-- Insert demo hero sliders
INSERT INTO public.hero_sliders (discount, title_fr, title_en, title_ar, description_fr, description_en, description_ar, image_url, button_text_fr, button_text_en, button_text_ar, target_id) VALUES
('30', 'Casque antibruit sans fil', 'True Wireless Noise Cancelling Headphone', 'سماعة لاسلكية عازلة للضوضاء', 'Achetez les meilleurs casques avec annulation de bruit.', 'Buy the best noise cancelling headphones.', 'اشتري أفضل سماعات إلغاء الضوضاء.', '/images/hero/hero-01.png', 'Acheter', 'Shop Now', 'تسوق الآن', 1),
('20', 'Apple Watch Ultra', 'Apple Watch Ultra', 'ساعة ابل الترا', 'Montre robuste pour sports extrêmes.', 'Rugged watch for extreme sports.', 'ساعة متينة للرياضات الشديدة.', '/images/products/product-5-bg-1.png', 'Acheter', 'Shop Now', 'تسوق الآن', 5);

-- Insert demo hero side banners
INSERT INTO public.hero_side_banners (title_fr, title_en, title_ar, price, original_price, image_url, target_id) VALUES
('iPhone 18 Pro Bleu', 'iPhone 18 Pro Blue', 'ايفون 18 برو أزرق', '21.300dh', NULL, '/images/iphone/iPhone-18-Pro-Blue-Front-And-Back-Design-PNG.png', 2),
('Casque sans fil', 'Wireless Headphone', 'سماعة لاسلكية', '699dh', '999dh', '/images/hero/hero-01.png', 1);
