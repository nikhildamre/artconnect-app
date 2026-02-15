
-- Drop FK constraints that reference auth.users directly (prevents seeding and is bad practice)
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_vendor_id_fkey;
ALTER TABLE public.workshops DROP CONSTRAINT IF EXISTS workshops_vendor_id_fkey;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
ALTER TABLE public.commissions DROP CONSTRAINT IF EXISTS commissions_customer_id_fkey;
ALTER TABLE public.commissions DROP CONSTRAINT IF EXISTS commissions_artist_id_fkey;
ALTER TABLE public.carts DROP CONSTRAINT IF EXISTS carts_user_id_fkey;
ALTER TABLE public.wishlists DROP CONSTRAINT IF EXISTS wishlists_user_id_fkey;
ALTER TABLE public.workshop_bookings DROP CONSTRAINT IF EXISTS workshop_bookings_customer_id_fkey;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Add a vendor_name column to products for display purposes
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS vendor_name text;
