-- ========================================
-- COMPLETE ARTVPP DATABASE SETUP
-- ========================================
-- This script contains EVERYTHING needed for the ArtVpp app
-- Run this ONCE in your Supabase SQL Editor

-- ========================================
-- STEP 1: CREATE ENUMS AND BASIC TYPES
-- ========================================

DO $$ 
BEGIN
    CREATE TYPE app_role AS ENUM ('customer', 'vendor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ========================================
-- STEP 2: CREATE ALL TABLES
-- ========================================

-- Products table (core functionality)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  discounted_price DECIMAL(10,2),
  category TEXT NOT NULL,
  medium TEXT,
  dimensions JSONB,
  images TEXT[] DEFAULT '{}',
  image_url TEXT,
  image_urls TEXT[],
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_name TEXT,
  inventory INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  moderation_status TEXT DEFAULT 'pending',
  admin_feedback TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table (admin/vendor functionality)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Seller applications table (admin functionality)
CREATE TABLE IF NOT EXISTS public.seller_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  art_category TEXT NOT NULL,
  artist_bio TEXT,
  portfolio_url TEXT,
  sample_work_urls TEXT[],
  social_media_links JSONB,
  government_id_url TEXT,
  bank_details JSONB,
  status TEXT DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table (admin functionality)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carts table (shopping functionality)
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cart items table (shopping functionality)
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders table (checkout functionality)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  subtotal DECIMAL(10,2),
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table (checkout functionality)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fix existing orders table if it has customer_id instead of user_id
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'orders' 
               AND column_name = 'customer_id') 
    AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                    AND table_name = 'orders' 
                    AND column_name = 'user_id') THEN
        ALTER TABLE public.orders RENAME COLUMN customer_id TO user_id;
    END IF;
    
    -- Add missing columns to orders table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'orders' 
                   AND column_name = 'subtotal') THEN
        ALTER TABLE public.orders ADD COLUMN subtotal DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'orders' 
                   AND column_name = 'tax') THEN
        ALTER TABLE public.orders ADD COLUMN tax DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'orders' 
                   AND column_name = 'shipping') THEN
        ALTER TABLE public.orders ADD COLUMN shipping DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'orders' 
                   AND column_name = 'total') THEN
        ALTER TABLE public.orders ADD COLUMN total DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'orders' 
                   AND column_name = 'shipping_address') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_address JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'orders' 
                   AND column_name = 'payment_method') THEN
        ALTER TABLE public.orders ADD COLUMN payment_method VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'orders' 
                   AND column_name = 'payment_id') THEN
        ALTER TABLE public.orders ADD COLUMN payment_id VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'orders' 
                   AND column_name = 'payment_status') THEN
        ALTER TABLE public.orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending';
    END IF;
END $$;

-- ========================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_moderation_status ON public.products(moderation_status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- ========================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 5: CREATE HELPER FUNCTIONS
-- ========================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Assign customer role to new users
  INSERT INTO public.user_roles (user_id, role) 
  VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Create cart for new user
  INSERT INTO public.carts (user_id) 
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STEP 6: DROP ALL EXISTING POLICIES
-- ========================================

-- Products policies
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Public view active products" ON public.products;
DROP POLICY IF EXISTS "Vendors view own products" ON public.products;
DROP POLICY IF EXISTS "Vendors insert products" ON public.products;
DROP POLICY IF EXISTS "Vendors update own products" ON public.products;
DROP POLICY IF EXISTS "Vendors delete own products" ON public.products;
DROP POLICY IF EXISTS "Admins view all products" ON public.products;
DROP POLICY IF EXISTS "Admins update products" ON public.products;

-- User roles policies
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;

-- Seller applications policies
DROP POLICY IF EXISTS "Users view own applications" ON public.seller_applications;
DROP POLICY IF EXISTS "Users create own applications" ON public.seller_applications;
DROP POLICY IF EXISTS "Admins view all applications" ON public.seller_applications;
DROP POLICY IF EXISTS "Admins update applications" ON public.seller_applications;

-- Audit logs policies
DROP POLICY IF EXISTS "Admins view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins insert audit logs" ON public.audit_logs;

-- Cart policies
DROP POLICY IF EXISTS "Users can view their own cart" ON public.carts;
DROP POLICY IF EXISTS "Users can insert their own cart" ON public.carts;
DROP POLICY IF EXISTS "Users can update their own cart" ON public.carts;
DROP POLICY IF EXISTS "Users can delete their own cart" ON public.carts;

-- Cart items policies
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;

-- Orders policies
DROP POLICY IF EXISTS "Customers view own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers create orders" ON public.orders;
DROP POLICY IF EXISTS "Customers update pending orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

-- Order items policies
DROP POLICY IF EXISTS "View own order items" ON public.order_items;
DROP POLICY IF EXISTS "Insert own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- ========================================
-- STEP 7: CREATE ALL RLS POLICIES
-- ========================================

-- Products policies
CREATE POLICY "Public view active products" ON public.products
  FOR SELECT USING (is_active = true AND moderation_status = 'approved');

CREATE POLICY "Vendors view own products" ON public.products
  FOR SELECT USING (vendor_id = auth.uid());

CREATE POLICY "Vendors insert products" ON public.products
  FOR INSERT WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors update own products" ON public.products
  FOR UPDATE USING (vendor_id = auth.uid());

CREATE POLICY "Vendors delete own products" ON public.products
  FOR DELETE USING (vendor_id = auth.uid());

CREATE POLICY "Admins view all products" ON public.products
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update products" ON public.products
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Seller applications policies
CREATE POLICY "Users view own applications" ON public.seller_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own applications" ON public.seller_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all applications" ON public.seller_applications
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update applications" ON public.seller_applications
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Audit logs policies
CREATE POLICY "Admins view audit logs" ON public.audit_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Cart policies
CREATE POLICY "Users can view their own cart" ON public.carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart" ON public.carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON public.carts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart" ON public.carts
  FOR DELETE USING (auth.uid() = user_id);

-- Cart items policies
CREATE POLICY "Users can view their own cart items" ON public.cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own cart items" ON public.cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own cart items" ON public.cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own cart items" ON public.cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Order items policies
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- STEP 8: CREATE TRIGGERS
-- ========================================

-- Updated at triggers
DROP TRIGGER IF EXISTS handle_products_updated_at ON public.products;
CREATE TRIGGER handle_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_orders_updated_at ON public.orders;
CREATE TRIGGER handle_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- New user trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- STEP 9: SETUP ADMIN USER AND TEST DATA
-- ========================================

DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'artvppcoeteam@gmail.com';
    
    -- Check if user exists
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'User with email artvppcoeteam@gmail.com not found. Please sign up first, then run this script again.';
    ELSE
        -- Grant admin role
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- Grant vendor role (for testing vendor dashboard)
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (admin_user_id, 'vendor')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- Ensure customer role exists
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (admin_user_id, 'customer')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- Create cart for admin user
        INSERT INTO public.carts (user_id) 
        VALUES (admin_user_id)
        ON CONFLICT (user_id) DO NOTHING;
        
        RAISE NOTICE 'Admin roles granted successfully to artvppcoeteam@gmail.com';
    END IF;
END $$;

-- Insert sample artwork data
INSERT INTO public.products (
  title, description, price, discounted_price, category, images, vendor_name, 
  medium, dimensions, rating, reviews_count, is_active, moderation_status, 
  vendor_id, created_at
) VALUES
('Digital Dreams', 'A stunning digital artwork exploring the intersection of technology and dreams. This piece captures the ethereal beauty of our digital age through vibrant colors and flowing forms.', 15000.00, 18000.00, 'Digital Art', ARRAY['/assets/art-digital-1-DdN5oOHR.jpg'], 'Maya Patel', 'Digital Print', '{"width": "24", "height": "36", "unit": "inches"}', 4.8, 24, true, 'approved', (SELECT id FROM auth.users WHERE email = 'artvppcoeteam@gmail.com' LIMIT 1), NOW() - INTERVAL '5 days'),
('Miniature Marvel', 'Intricate miniature painting showcasing traditional Indian artistry. Every detail tells a story of ancient craftsmanship and cultural heritage.', 8500.00, 10000.00, 'Miniature', ARRAY['/assets/art-miniature-1-D3WNN5MU.jpg'], 'Rajesh Kumar', 'Watercolor on Paper', '{"width": "6", "height": "8", "unit": "inches"}', 4.9, 18, true, 'approved', (SELECT id FROM auth.users WHERE email = 'artvppcoeteam@gmail.com' LIMIT 1), NOW() - INTERVAL '4 days'),
('Abstract Emotions', 'Bold abstract painting expressing raw human emotions through color and form. A powerful piece that speaks to the soul and ignites imagination.', 22000.00, 25000.00, 'Paintings', ARRAY['/assets/art-painting-1-J34nQLiB.jpg'], 'Priya Sharma', 'Acrylic on Canvas', '{"width": "30", "height": "40", "unit": "inches"}', 4.7, 31, true, 'approved', (SELECT id FROM auth.users WHERE email = 'artvppcoeteam@gmail.com' LIMIT 1), NOW() - INTERVAL '3 days'),
('Stone Symphony', 'Contemporary sculpture carved from local stone, representing harmony in nature. A masterpiece that brings tranquility to any space.', 45000.00, 50000.00, 'Sculptures', ARRAY['/assets/art-sculpture-1-BukTzwvR.jpg'], 'Arjun Singh', 'Stone', '{"width": "18", "height": "12", "depth": "8", "unit": "inches"}', 4.9, 12, true, 'approved', (SELECT id FROM auth.users WHERE email = 'artvppcoeteam@gmail.com' LIMIT 1), NOW() - INTERVAL '2 days'),
('Tanjore Tradition', 'Traditional Tanjore painting with gold leaf work depicting divine beauty. A timeless piece that celebrates our rich cultural heritage.', 18000.00, 20000.00, 'Traditional', ARRAY['/assets/art-tanjore-1-Ajt28v3m.jpg'], 'Lakshmi Devi', 'Gold Leaf on Wood', '{"width": "16", "height": "20", "unit": "inches"}', 4.8, 27, true, 'approved', (SELECT id FROM auth.users WHERE email = 'artvppcoeteam@gmail.com' LIMIT 1), NOW() - INTERVAL '1 day'),
('Warli Wisdom', 'Authentic Warli art telling stories of rural life and ancient wisdom. This piece connects us to our roots and tribal traditions.', 12000.00, 14000.00, 'Folk Art', ARRAY['/assets/art-warli-1-ESjeIFZV.jpg'], 'Tribal Collective', 'Natural Pigments on Canvas', '{"width": "20", "height": "24", "unit": "inches"}', 4.6, 19, true, 'approved', (SELECT id FROM auth.users WHERE email = 'artvppcoeteam@gmail.com' LIMIT 1), NOW())
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- STEP 10: VERIFICATION
-- ========================================

SELECT '✅ COMPLETE DATABASE SETUP SUCCESSFUL!' as status;

-- Show table counts
SELECT 
  'TABLES CREATED:' as info,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('products', 'user_roles', 'seller_applications', 'audit_logs', 'carts', 'cart_items', 'orders', 'order_items')) as total_tables;

-- Show admin user setup
SELECT 
  'ADMIN USER SETUP:' as info,
  u.email,
  STRING_AGG(ur.role::text, ', ') as roles
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'artvppcoeteam@gmail.com'
GROUP BY u.email;

-- Show sample data
SELECT 
  'SAMPLE PRODUCTS:' as info,
  COUNT(*) as product_count
FROM public.products;

SELECT 
  'DATABASE READY FOR:' as info,
  '✅ Cart & Checkout' as cart_ready,
  '✅ Admin Dashboard' as admin_ready,
  '✅ Vendor Dashboard' as vendor_ready,
  '✅ Product Management' as products_ready;