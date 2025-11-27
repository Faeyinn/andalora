-- Fix RLS Policies for Users table
-- Run this in Supabase SQL Editor

-- 1. Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to start fresh (avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete all users" ON public.users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;

-- 3. Create User Policies
-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- 4. Create Admin Policies
-- Allow admins to read all users
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'admin'
  )
);

-- Allow admins to update any user
CREATE POLICY "Admins can update all users"
ON public.users
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'admin'
  )
);

-- Allow admins to delete any user
CREATE POLICY "Admins can delete all users"
ON public.users
FOR DELETE
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'admin'
  )
);

-- 5. Public Access (Optional, e.g. for product seller info)
-- If you want seller info to be visible on product page, you might need this:
-- But be careful not to expose sensitive info. 
-- Better to fetch seller info via joined query on products table which usually bypasses RLS if using service role or if products are public.
-- For now, let's allow public to view basic info if needed, but strict is better.
-- We'll rely on "Users can view their own profile" for login.

-- 6. Fix Products RLS as well just in case
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Users can create products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;

-- Everyone can view active products
CREATE POLICY "Public products are viewable by everyone"
ON public.products
FOR SELECT
USING (status = 'active');

-- Users can view their own products (even if not active)
CREATE POLICY "Users can view their own products"
ON public.products
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all products
CREATE POLICY "Admins can view all products"
ON public.products
FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'admin'
  )
);

-- Users can create products
CREATE POLICY "Users can create products"
ON public.products
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own products
CREATE POLICY "Users can update their own products"
ON public.products
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own products
CREATE POLICY "Users can delete their own products"
ON public.products
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can update all products
CREATE POLICY "Admins can update all products"
ON public.products
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'admin'
  )
);

-- Admins can delete all products
CREATE POLICY "Admins can delete all products"
ON public.products
FOR DELETE
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'admin'
  )
);
