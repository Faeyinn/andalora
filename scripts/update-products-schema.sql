-- Add missing columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_promoted boolean default false;

-- Optional: Rename listing_expires_at if it exists (to avoid confusion)
-- ALTER TABLE public.products RENAME COLUMN listing_expires_at TO expires_at;
