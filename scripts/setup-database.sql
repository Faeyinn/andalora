-- ============================================================================
-- ANDALORA MARKETPLACE - DATABASE SCHEMA
-- ============================================================================
-- Marketplace barang bekas antar mahasiswa dengan sistem listing berbayar
-- Penjual membayar admin untuk menampilkan produk (per bulan/tahun)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: users
-- ============================================================================
-- Profil mahasiswa yang terdaftar
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL, -- untuk hubungi penjual
  university TEXT NOT NULL,
  campus TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- TABLE: categories
-- ============================================================================
-- Kategori produk
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- TABLE: listing_plans
-- ============================================================================
-- Paket listing untuk penjual (Bulanan, Tahunan)
CREATE TABLE IF NOT EXISTS public.listing_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL, -- 'Bulanan', 'Tahunan'
  duration_days INTEGER NOT NULL, -- 30, 365
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- TABLE: products
-- ============================================================================
-- Produk yang dijual dengan sistem listing berbayar
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL, -- harga barang
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  condition TEXT NOT NULL CHECK (condition IN ('baru', 'seperti baru', 'bekas baik', 'bekas')),
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'active', 'expired', 'sold')),
  images TEXT[] NOT NULL DEFAULT '{}', -- array of image URLs
  listing_plan_id UUID REFERENCES public.listing_plans(id) ON DELETE SET NULL,
  listing_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- TABLE: listing_payments
-- ============================================================================
-- Pembayaran listing dari penjual ke admin
CREATE TABLE IF NOT EXISTS public.listing_payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  listing_plan_id UUID REFERENCES public.listing_plans(id) ON DELETE SET NULL NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'midtrans', -- 'midtrans'
  midtrans_order_id TEXT UNIQUE, -- order_id dari Midtrans
  midtrans_transaction_id TEXT, -- transaction_id dari Midtrans
  midtrans_snap_token TEXT, -- snap token untuk payment
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- TABLE: favorites
-- ============================================================================
-- Favorit produk - support guest (session_id) dan authenticated user (user_id)
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- nullable untuk guest
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT, -- untuk guest favorites
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Constraint: user harus punya user_id atau session_id
  CONSTRAINT favorites_user_check CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Unique constraint untuk authenticated users
CREATE UNIQUE INDEX favorites_user_product_unique 
ON public.favorites(user_id, product_id) 
WHERE user_id IS NOT NULL;

-- Unique constraint untuk guest users
CREATE UNIQUE INDEX favorites_session_product_unique 
ON public.favorites(session_id, product_id) 
WHERE session_id IS NOT NULL;

-- ============================================================================
-- TABLE: notifications
-- ============================================================================
-- Notifikasi untuk user
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'listing_approved', 'listing_expiring', 'product_sold', etc
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  related_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Products indexes
CREATE INDEX IF NOT EXISTS products_user_id_idx ON public.products(user_id);
CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products(category_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON public.products(status);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC);

-- Listing payments indexes
CREATE INDEX IF NOT EXISTS listing_payments_user_id_idx ON public.listing_payments(user_id);
CREATE INDEX IF NOT EXISTS listing_payments_product_id_idx ON public.listing_payments(product_id);
CREATE INDEX IF NOT EXISTS listing_payments_status_idx ON public.listing_payments(status);

-- Favorites indexes
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_product_id_idx ON public.favorites(product_id);
CREATE INDEX IF NOT EXISTS favorites_session_id_idx ON public.favorites(session_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS POLICIES
-- ============================================================================

-- Users can read their own data
CREATE POLICY "Users can read own data"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own data (on signup)
CREATE POLICY "Users can insert own data"
ON public.users FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- CATEGORIES POLICIES
-- ============================================================================

-- Everyone can read categories (public)
CREATE POLICY "Categories are publicly readable"
ON public.categories FOR SELECT
TO public
USING (true);

-- ============================================================================
-- LISTING PLANS POLICIES
-- ============================================================================

-- Everyone can read active listing plans (public)
CREATE POLICY "Active listing plans are publicly readable"
ON public.listing_plans FOR SELECT
TO public
USING (is_active = true);

-- ============================================================================
-- PRODUCTS POLICIES
-- ============================================================================

-- Everyone can read active products (public)
CREATE POLICY "Active products are publicly readable"
ON public.products FOR SELECT
TO public
USING (status = 'active');

-- Authenticated users can read their own products (all statuses)
CREATE POLICY "Users can read own products"
ON public.products FOR SELECT
USING (auth.uid() = user_id);

-- Authenticated users can insert products
CREATE POLICY "Authenticated users can insert products"
ON public.products FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own products
CREATE POLICY "Users can update own products"
ON public.products FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own products
CREATE POLICY "Users can delete own products"
ON public.products FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- LISTING PAYMENTS POLICIES
-- ============================================================================

-- Users can read their own payments
CREATE POLICY "Users can read own payments"
ON public.listing_payments FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own payments
CREATE POLICY "Users can insert own payments"
ON public.listing_payments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- FAVORITES POLICIES
-- ============================================================================

-- Everyone can read favorites (for guest and authenticated)
CREATE POLICY "Favorites are readable"
ON public.favorites FOR SELECT
TO public
USING (
  auth.uid() = user_id OR 
  user_id IS NULL
);

-- Everyone can insert favorites (for guest and authenticated)
CREATE POLICY "Anyone can insert favorites"
ON public.favorites FOR INSERT
TO public
WITH CHECK (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND user_id IS NULL AND session_id IS NOT NULL)
);

-- Everyone can delete their own favorites
CREATE POLICY "Users can delete own favorites"
ON public.favorites FOR DELETE
TO public
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND user_id IS NULL)
);

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for products table
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, whatsapp, university, campus)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', ''),
    COALESCE(NEW.raw_user_meta_data->>'university', ''),
    COALESCE(NEW.raw_user_meta_data->>'campus', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Create storage bucket for product images (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can read product images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Storage policy: Authenticated users can upload product images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Storage policy: Users can update their own product images
CREATE POLICY "Users can update own product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policy: Users can delete their own product images
CREATE POLICY "Users can delete own product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================================
-- COMPLETED
-- ============================================================================
-- Database schema setup complete!
-- Next step: Run seed-data.sql to populate initial data
-- ============================================================================
