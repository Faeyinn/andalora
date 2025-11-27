-- Fix Infinite Recursion in RLS Policies
-- Run this in Supabase SQL Editor

-- 1. Create a secure function to check if user is admin
-- SECURITY DEFINER means this function runs with the privileges of the creator (postgres/superuser), bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop problematic policies on USERS table
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete all users" ON public.users;

-- 3. Drop problematic policies on PRODUCTS table
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Admins can update all products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete all products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;

-- 4. Re-create policies using the safe function
-- Users table
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all users" ON public.users FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete all users" ON public.users FOR DELETE USING (public.is_admin());

-- Products table
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all products" ON public.products FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete all products" ON public.products FOR DELETE USING (public.is_admin());
