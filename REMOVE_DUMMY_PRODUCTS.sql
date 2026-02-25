-- REMOVE ALL EXISTING PRODUCTS - COMPLETE CLEANUP
-- This will remove ALL products from the database for a fresh start with genuine artist uploads

-- First, let's see what products currently exist
SELECT 
  'CURRENT PRODUCTS IN DATABASE:' as info,
  COUNT(*) as total_products
FROM public.products;

SELECT 
  id,
  title,
  vendor_name,
  price,
  created_at,
  moderation_status
FROM public.products
ORDER BY created_at DESC;

-- Remove ALL existing products (complete cleanup)
-- This includes all dummy data, test products, and duplicates

-- Step 1: Remove all order items first (to avoid foreign key constraints)
DELETE FROM public.order_items 
WHERE product_id IN (SELECT id FROM public.products);

-- Step 2: Remove all cart items (to avoid foreign key constraints)  
DELETE FROM public.cart_items 
WHERE product_id IN (SELECT id FROM public.products);

-- Step 3: Remove ALL products
DELETE FROM public.products;

-- Reset the sequence if needed (optional - for clean IDs)
-- This ensures new products start with clean ID numbers
SELECT setval(pg_get_serial_sequence('public.products', 'id'), 1, false);

-- Verify cleanup
SELECT 
  'CLEANUP VERIFICATION:' as info,
  COUNT(*) as remaining_products
FROM public.products;

SELECT 
  'CART ITEMS REMAINING:' as info,
  COUNT(*) as remaining_cart_items  
FROM public.cart_items;

SELECT 
  'ORDER ITEMS REMAINING:' as info,
  COUNT(*) as remaining_order_items
FROM public.order_items;

SELECT '✅ ALL PRODUCTS REMOVED - DATABASE READY FOR GENUINE ARTIST UPLOADS!' as result;