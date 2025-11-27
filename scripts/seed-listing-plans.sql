-- Seed Listing Plans
-- Run this in Supabase SQL Editor

INSERT INTO public.listing_plans (name, duration_days, price, description, is_active)
VALUES 
('Paket Bulanan', 30, 15000, 'Listing produk aktif selama 30 hari', true),
('Paket Tahunan', 365, 100000, 'Listing produk aktif selama 1 tahun (Hemat 45%)', true)
ON CONFLICT DO NOTHING;
