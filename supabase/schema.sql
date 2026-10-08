-- Create categories table
CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    name_fr VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create store_settings table (usually just one row)
CREATE TABLE public.store_settings (
    id SERIAL PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    contact_email VARCHAR(255),
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the products table
CREATE TABLE public.products (
    id SERIAL PRIMARY KEY,
    title_fr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    reviews INTEGER DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2),
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    description_fr TEXT,
    description_en TEXT,
    description_ar TEXT,
    stock INTEGER DEFAULT 0,
    imgs JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create promo_banners table
CREATE TABLE public.promo_banners (
    id SERIAL PRIMARY KEY,
    layout TEXT NOT NULL, 
    subtitle_fr TEXT NOT NULL,
    subtitle_en TEXT NOT NULL,
    subtitle_ar TEXT NOT NULL,
    title_fr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description_fr TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    image_url TEXT NOT NULL,
    bg_color TEXT NOT NULL,
    theme_color TEXT NOT NULL, 
    button_text_fr TEXT NOT NULL,
    button_text_en TEXT NOT NULL,
    button_text_ar TEXT NOT NULL,
    button_link TEXT NOT NULL
);

-- Create hero_sliders table
CREATE TABLE public.hero_sliders (
    id SERIAL PRIMARY KEY,
    discount TEXT NOT NULL,
    title_fr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description_fr TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    image_url TEXT NOT NULL,
    button_text_fr TEXT NOT NULL,
    button_text_en TEXT NOT NULL,
    button_text_ar TEXT NOT NULL,
    target_id INT
);

-- Create hero_side_banners table
CREATE TABLE public.hero_side_banners (
    id SERIAL PRIMARY KEY,
    title_fr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    price TEXT NOT NULL,
    original_price TEXT,
    image_url TEXT NOT NULL,
    target_id INT
);

-- Create orders table
CREATE TABLE public.orders (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    total_price DECIMAL(10, 2) NOT NULL,
    items JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Set up Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_side_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to store_settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to promo_banners" ON public.promo_banners FOR SELECT USING (true);
CREATE POLICY "Allow public read access to hero_sliders" ON public.hero_sliders FOR SELECT USING (true);
CREATE POLICY "Allow public read access to hero_side_banners" ON public.hero_side_banners FOR SELECT USING (true);
CREATE POLICY "Allow public insert to orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Create policies to allow authenticated users (admin) to INSERT, UPDATE, and DELETE
CREATE POLICY "Allow authenticated full access categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access store_settings" ON public.store_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access promo_banners" ON public.promo_banners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access hero_sliders" ON public.hero_sliders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access hero_side_banners" ON public.hero_side_banners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
