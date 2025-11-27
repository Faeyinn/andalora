-- Migration: Add role to users table
-- Run this in Supabase SQL Editor

-- 1. Add role column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user'));

-- 2. Update existing trigger function to handle role (optional, defaults to user anyway)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, whatsapp, university, nim, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', ''),
    COALESCE(NEW.raw_user_meta_data->>'university', ''),
    COALESCE(NEW.raw_user_meta_data->>'nim', ''),
    'user' -- Default role for new signups
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Policy for Admin Access
-- Allow admins to read all users
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'admin'
  )
);

-- Allow admins to update any user (optional, for banning etc)
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

-- 4. Create Policy for Admin Product Access (if not already covered)
-- Assuming products table exists, let's ensure admins can see everything
-- Note: You might need to adjust existing policies on products table if they are restrictive
-- Example:
-- CREATE POLICY "Admins can view all products" ON public.products FOR SELECT USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

-- 5. INSTRUCTION:
-- Manually update your user to admin after running this:
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
