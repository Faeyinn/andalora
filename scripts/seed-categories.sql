-- Seed Categories
INSERT INTO public.categories (name, slug)
VALUES 
  ('Elektronik', 'elektronik'),
  ('Fashion', 'fashion'),
  ('Buku', 'buku'),
  ('Olahraga', 'olahraga'),
  ('Lainnya', 'lainnya')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name;
