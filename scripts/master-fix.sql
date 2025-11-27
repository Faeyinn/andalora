-- MASTER FIX SCRIPT
-- Run this in Supabase SQL Editor to fix everything at once

-- 1. Add role column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user'));
    END IF;
END $$;

-- 2. Update trigger function
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
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Drop all existing policies to ensure clean slate
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete all users" ON public.users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;

DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Users can create products" ON public.products;
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Admins can update all products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete all products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;

-- 5. Re-create User Policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 6. Re-create Admin Policies for Users
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));
CREATE POLICY "Admins can update all users" ON public.users FOR UPDATE USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));
CREATE POLICY "Admins can delete all users" ON public.users FOR DELETE USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

-- 7. Re-create Product Policies
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view their own products" ON public.products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

CREATE POLICY "Users can create products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all products" ON public.products FOR UPDATE USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));
CREATE POLICY "Admins can delete all products" ON public.products FOR DELETE USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

-- 8. INSTRUCTION REMINDER (Run this manually if needed)
-- UPDATE public.users SET role = 'admin' WHERE email = 'YOUR_EMAIL';
