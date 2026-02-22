-- 📊 Products Only Test Data
-- This creates only test products, no orders (to avoid table structure issues)
-- Run this in your Supabase SQL Editor

-- Step 1: Check what exists and create products only
DO $$
DECLARE
    admin_user_id UUID;
    has_products_table BOOLEAN := FALSE;
    products_columns TEXT[];
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'artvppcoeteam@gmail.com' LIMIT 1;
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Admin user not found. Please sign up with artvppcoeteam@gmail.com first.';
        RETURN;
    END IF;
    
    -- Check if products table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'products' AND table_schema = 'public'
    ) INTO has_products_table;
    
    IF NOT has_products_table THEN
        RAISE NOTICE 'Products table does not exist. Please run minimal-products-setup.sql first.';
        RETURN;
    END IF;
    
    -- Get column names for products table
    SELECT ARRAY_AGG(column_name) INTO products_columns
    FROM information_schema.columns 
    WHERE table_name = 'products' AND table_schema = 'public';
    
    RAISE NOTICE 'Products table columns found: %', products_columns;
    
    -- Ensure admin has vendor role
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (admin_user_id, 'vendor')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Create products based on available columns
    IF 'image_url' = ANY(products_columns) THEN
        -- Has image_url column
        RAISE NOTICE 'Creating products with image_url column';
        INSERT INTO public.products (
            title, description, price, category, vendor_id, vendor_name, 
            image_url, is_active, moderation_status, inventory, created_at
        ) VALUES 
        ('Beautiful Landscape Painting', 'A stunning oil painting of mountain landscapes', 15000, 'Paintings', admin_user_id, 'ArtVpp Admin', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500', true, 'pending', 1, NOW() - INTERVAL '2 days'),
        ('Modern Abstract Sculpture', 'Contemporary metal sculpture with geometric patterns', 25000, 'Sculptures', admin_user_id, 'ArtVpp Admin', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', true, 'approved', 1, NOW() - INTERVAL '1 day'),
        ('Digital Art Collection', 'Unique digital artwork created with modern techniques', 8000, 'Digital Art', admin_user_id, 'ArtVpp Admin', 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500', true, 'rejected', 1, NOW() - INTERVAL '3 days'),
        ('Traditional Folk Art', 'Handcrafted folk art piece with cultural significance', 12000, 'Folk Art', admin_user_id, 'ArtVpp Admin', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', false, 'approved', 1, NOW() - INTERVAL '4 days'),
        ('Photography Print', 'Limited edition photography print on premium paper', 5000, 'Photography', admin_user_id, 'ArtVpp Admin', 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500', true, 'approved', 1, NOW() - INTERVAL '5 days')
        ON CONFLICT (id) DO NOTHING;
    ELSIF 'image_urls' = ANY(products_columns) THEN
        -- Has image_urls array column
        RAISE NOTICE 'Creating products with image_urls column';
        INSERT INTO public.products (
            title, description, price, category, vendor_id, vendor_name, 
            image_urls, is_active, moderation_status, inventory, created_at
        ) VALUES 
        ('Beautiful Landscape Painting', 'A stunning oil painting of mountain landscapes', 15000, 'Paintings', admin_user_id, 'ArtVpp Admin', ARRAY['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500'], true, 'pending', 1, NOW() - INTERVAL '2 days'),
        ('Modern Abstract Sculpture', 'Contemporary metal sculpture with geometric patterns', 25000, 'Sculptures', admin_user_id, 'ArtVpp Admin', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'], true, 'approved', 1, NOW() - INTERVAL '1 day'),
        ('Digital Art Collection', 'Unique digital artwork created with modern techniques', 8000, 'Digital Art', admin_user_id, 'ArtVpp Admin', ARRAY['https://images.unsplash.com/photo-1549490349-8643362247b5?w=500'], true, 'rejected', 1, NOW() - INTERVAL '3 days'),
        ('Traditional Folk Art', 'Handcrafted folk art piece with cultural significance', 12000, 'Folk Art', admin_user_id, 'ArtVpp Admin', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'], false, 'approved', 1, NOW() - INTERVAL '4 days'),
        ('Photography Print', 'Limited edition photography print on premium paper', 5000, 'Photography', admin_user_id, 'ArtVpp Admin', ARRAY['https://images.unsplash.com/photo-1549490349-8643362247b5?w=500'], true, 'approved', 1, NOW() - INTERVAL '5 days')
        ON CONFLICT (id) DO NOTHING;
    ELSE
        -- No image columns - basic structure
        RAISE NOTICE 'Creating products without image columns';
        INSERT INTO public.products (
            title, description, price, category, vendor_id, vendor_name, 
            is_active, moderation_status, inventory, created_at
        ) VALUES 
        ('Beautiful Landscape Painting', 'A stunning oil painting of mountain landscapes', 15000, 'Paintings', admin_user_id, 'ArtVpp Admin', true, 'pending', 1, NOW() - INTERVAL '2 days'),
        ('Modern Abstract Sculpture', 'Contemporary metal sculpture with geometric patterns', 25000, 'Sculptures', admin_user_id, 'ArtVpp Admin', true, 'approved', 1, NOW() - INTERVAL '1 day'),
        ('Digital Art Collection', 'Unique digital artwork created with modern techniques', 8000, 'Digital Art', admin_user_id, 'ArtVpp Admin', true, 'rejected', 1, NOW() - INTERVAL '3 days'),
        ('Traditional Folk Art', 'Handcrafted folk art piece with cultural significance', 12000, 'Folk Art', admin_user_id, 'ArtVpp Admin', false, 'approved', 1, NOW() - INTERVAL '4 days'),
        ('Photography Print', 'Limited edition photography print on premium paper', 5000, 'Photography', admin_user_id, 'ArtVpp Admin', true, 'approved', 1, NOW() - INTERVAL '5 days')
        ON CONFLICT (id) DO NOTHING;
    END IF;
    
    RAISE NOTICE 'Test products created successfully for vendor: %', admin_user_id;
END $$;

-- Step 2: Verify what was created
SELECT 
    'Products created successfully!' as status,
    COUNT(*) as total_products
FROM public.products 
WHERE vendor_id = (SELECT id FROM auth.users WHERE email = 'artvppcoeteam@gmail.com');

-- Step 3: Show the products
SELECT 
    title,
    price,
    category,
    moderation_status,
    is_active,
    created_at
FROM public.products 
WHERE vendor_id = (SELECT id FROM auth.users WHERE email = 'artvppcoeteam@gmail.com')
ORDER BY created_at DESC;