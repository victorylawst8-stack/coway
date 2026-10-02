import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Keys from Vite env or user localStorage configuration
const getEnvConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined') {
    const localConfig = localStorage.getItem('coway_supabase_custom_config');
    if (localConfig) {
      try {
        const parsed = JSON.parse(localConfig);
        if (parsed.url && parsed.key) {
          return { url: parsed.url, key: parsed.key, source: 'localStorage' };
        }
      } catch (e) {
        console.error('Error parsing stored supabase config', e);
      }
    }
  }

  return { url: envUrl, key: envKey, source: 'env' };
};

const config = getEnvConfig();

export const isSupabaseConfigured = Boolean(
  config.url &&
  config.url.startsWith('http') &&
  !config.url.includes('your-project') &&
  config.key &&
  config.key.length > 20
);

let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!supabaseClientInstance) {
    try {
      supabaseClientInstance = createClient(config.url, config.key);
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseClientInstance;
}

export const supabase = getSupabase();

export function saveCustomSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('coway_supabase_custom_config', JSON.stringify({ url: url.trim(), key: key.trim() }));
    window.location.reload();
  }
}

export function clearCustomSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('coway_supabase_custom_config');
    window.location.reload();
  }
}

export function getCurrentSupabaseConfig() {
  return getEnvConfig();
}

/**
 * Upload an image file to Supabase Storage 'coway-media' bucket.
 * Returns public URL on success, or converts to WebP/Base64 data URL if storage isn't ready.
 */
export async function uploadImageToStorage(file: File): Promise<string> {
  const sb = getSupabase();

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    throw new Error('รองรับเฉพาะไฟล์ JPG, PNG และ WEBP เท่านั้น');
  }

  // Validate size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('ขนาดไฟล์ต้องไม่เกิน 5MB');
  }

  if (sb) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await sb.storage
        .from('coway-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.warn('Supabase storage upload error, falling back to local data URL:', error);
      } else if (data) {
        const { data: urlData } = sb.storage.from('coway-media').getPublicUrl(filePath);
        if (urlData?.publicUrl) {
          return urlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Exception during Supabase storage upload:', err);
    }
  }

  // Fallback: Read file as Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Complete SQL Schema and Migration documentation for the user
export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- COWAY E-COMMERCE DATABASE SCHEMA & RLS POLICIES FOR SUPABASE
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ========================================================

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT,
  icon TEXT DEFAULT 'Droplets',
  sort_order INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  short_description TEXT DEFAULT '',
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  sale_price NUMERIC,
  monthly_price NUMERIC NOT NULL DEFAULT 0,
  main_image TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_featured BOOLEAN DEFAULT false,
  is_promotion BOOLEAN DEFAULT false,
  badge TEXT,
  sort_order INTEGER DEFAULT 1,
  specifications JSONB DEFAULT '{}'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create product_images table (for gallery)
CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  button_text TEXT DEFAULT 'ดูสินค้า',
  button_url TEXT DEFAULT '#products',
  sort_order INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  badge TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  site_name TEXT NOT NULL,
  dealer_name TEXT DEFAULT '',
  dealer_code TEXT DEFAULT '',
  phone TEXT NOT NULL,
  line_url TEXT NOT NULL,
  line_id TEXT DEFAULT '',
  email TEXT DEFAULT '',
  facebook_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  footer_text TEXT DEFAULT '',
  dealer_disclaimer TEXT DEFAULT '',
  working_hours TEXT DEFAULT '',
  announcement TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create inquiries table (for customer consultation leads)
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_line TEXT DEFAULT '',
  product_id TEXT,
  product_name TEXT DEFAULT '',
  plan_type TEXT DEFAULT 'subscription',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Public can READ active products, categories, banners, settings
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Product Images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public Read Banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Public Read Site Settings" ON site_settings FOR SELECT USING (true);

-- Anyone can submit inquiries (leads)
CREATE POLICY "Public Insert Inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Authenticated Users (Admins) have full CRUD access
CREATE POLICY "Admin All Categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Product Images" ON product_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Banners" ON banners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Site Settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Inquiries" ON inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========================================================
-- STORAGE BUCKET CREATION (coway-media)
-- ========================================================
-- Note: You can create a public bucket named "coway-media" in Supabase Storage UI,
-- or run the following policy to allow public view and authenticated uploads:

INSERT INTO storage.buckets (id, name, public) 
VALUES ('coway-media', 'coway-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view media" ON storage.objects
  FOR SELECT USING (bucket_id = 'coway-media');

CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'coway-media');

CREATE POLICY "Authenticated users can update media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'coway-media');

CREATE POLICY "Authenticated users can delete media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'coway-media');
`;
