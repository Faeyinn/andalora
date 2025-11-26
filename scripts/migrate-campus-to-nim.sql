-- Update database schema untuk ganti campus menjadi nim
-- Jalankan di Supabase SQL Editor

-- 1. Rename column campus menjadi nim di tabel users
ALTER TABLE public.users 
RENAME COLUMN campus TO nim;

-- 2. Add unique constraint untuk NIM
ALTER TABLE public.users 
ADD CONSTRAINT users_nim_unique UNIQUE (nim);

-- 3. Update trigger function untuk handle new user dengan nim
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, whatsapp, university, nim)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'whatsapp',
    NEW.raw_user_meta_data->>'university',
    NEW.raw_user_meta_data->>'nim'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
