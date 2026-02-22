-- 🔧 Minimal Products Table Setup
-- This creates a basic products table that works with your existing structure
-- Run this FIRST, then run simple-test-data.sql

-- Step 1: Check current products table structure
SELECT 
    'Current products table structure:' as info;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Create products table with minimal required columns
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  medium TEXT,
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_name TEXT,
  is_active BOOLEAN DEFAULT true,
  inventory INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Add moderation columns if they don't exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS admin_feedback TEXT,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Step 4: Add image columns (optional - will be added if they don't exist)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_moderation_status ON public.products(moderation_status);

-- Step 6: Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Step 7: Create basic RLS policies
DROP POLICY IF EXISTS "Public view active products" ON public.products;
DROP POLICY IF EXISTS "Vendors view own products" ON public.products;
DROP POLICY IF EXISTS "Vendors insert products" ON public.products;
DROP POLICY IF EXISTS "Vendors update own products" ON public.products;
DROP POLICY IF EXISTS "Vendors delete own products" ON public.products;
DROP POLICY IF EXISTS "Admins view all products" ON public.products;
DROP POLICY IF EXISTS "Admins update products" ON public.products;

-- Public can view active and approved products
CREATE POLICY "Public view active products" ON public.products
  FOR SELECT USING (is_active = true AND moderation_status = 'approved');

-- Vendors can view their own products
CREATE POLICY "Vendors view own products" ON public.products
  FOR SELECT USING (vendor_id = auth.uid());

-- Vendors can insert their own products
CREATE POLICY "Vendors insert products" ON public.products
  FOR INSERT WITH CHECK (vendor_id = auth.uid());

-- Vendors can update their own products
CREATE POLICY "Vendors update own products" ON public.products
  FOR UPDATE USING (vendor_id = auth.uid());

-- Vendors can delete their own products
CREATE POLICY "Vendors delete own products" ON public.products
  FOR DELETE USING (vendor_id = auth.uid());

-- Admins can view all products
CREATE POLICY "Admins view all products" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any product
CREATE POLICY "Admins update products" ON public.products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Step 8: Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_products_updated_at ON public.products;
CREATE TRIGGER handle_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Step 9: Show final table structure
SELECT 
    'Products table setup completed!' as status;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;