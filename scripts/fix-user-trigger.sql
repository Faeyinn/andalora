-- Fix: Update trigger function untuk handle new user dengan nim (bukan campus)
-- Jalankan ini di Supabase SQL Editor untuk memperbaiki registrasi

-- 1. Drop trigger yang lama jika ada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop function yang lama
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Buat function baru dengan field nim
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, whatsapp, university, nim)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', ''),
    COALESCE(NEW.raw_user_meta_data->>'university', ''),
    COALESCE(NEW.raw_user_meta_data->>'nim', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Buat trigger baru
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Cek apakah ada user yang belum punya profile
-- Jalankan query ini untuk melihat user yang belum punya profile:
-- SELECT au.id, au.email 
-- FROM auth.users au 
-- LEFT JOIN public.users pu ON au.id = pu.id 
-- WHERE pu.id IS NULL;

-- 6. Jika ada user yang belum punya profile, buat manual:
-- INSERT INTO public.users (id, email, full_name, phone, whatsapp, university, nim)
-- SELECT 
--   id, 
--   email,
--   COALESCE(raw_user_meta_data->>'full_name', ''),
--   COALESCE(raw_user_meta_data->>'phone', ''),
--   COALESCE(raw_user_meta_data->>'whatsapp', ''),
--   COALESCE(raw_user_meta_data->>'university', ''),
--   COALESCE(raw_user_meta_data->>'nim', '')
-- FROM auth.users
-- WHERE id NOT IN (SELECT id FROM public.users);
