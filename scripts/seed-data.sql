-- ============================================================================
-- ANDALORA MARKETPLACE - SEED DATA
-- ============================================================================
-- Data awal untuk kategori dan paket listing
-- ============================================================================

-- ============================================================================
-- SEED: categories
-- ============================================================================

INSERT INTO public.categories (name, slug) VALUES
  ('Elektronik', 'elektronik'),
  ('Buku & Alat Tulis', 'buku-alat-tulis'),
  ('Pakaian & Aksesoris', 'pakaian-aksesoris'),
  ('Furniture & Dekorasi', 'furniture-dekorasi'),
  ('Olahraga & Outdoor', 'olahraga-outdoor'),
  ('Kendaraan', 'kendaraan'),
  ('Alat Musik', 'alat-musik'),
  ('Makanan & Minuman', 'makanan-minuman'),
  ('Kesehatan & Kecantikan', 'kesehatan-kecantikan'),
  ('Lainnya', 'lainnya')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SEED: listing_plans
-- ============================================================================

INSERT INTO public.listing_plans (name, duration_days, price, description, is_active) VALUES
  (
    'Paket Bulanan',
    30,
    15000.00,
    'Tampilkan produk Anda selama 1 bulan di marketplace',
    true
  ),
  (
    'Paket 3 Bulan',
    90,
    40000.00,
    'Tampilkan produk Anda selama 3 bulan di marketplace (Hemat 11%)',
    true
  ),
  (
    'Paket 6 Bulan',
    180,
    75000.00,
    'Tampilkan produk Anda selama 6 bulan di marketplace (Hemat 17%)',
    true
  ),
  (
    'Paket Tahunan',
    365,
    120000.00,
    'Tampilkan produk Anda selama 1 tahun di marketplace (Hemat 33%)',
    true
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMPLETED
-- ============================================================================
-- Seed data inserted successfully!
-- Categories: 10 items
-- Listing Plans: 4 items (Bulanan, 3 Bulan, 6 Bulan, Tahunan)
-- ============================================================================
