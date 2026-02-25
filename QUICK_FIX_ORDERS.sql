-- QUICK FIX FOR ORDERS TABLE ISSUES
-- Run this in Supabase SQL Editor if you can't run the complete setup right now

-- Fix orders table structure
DO $ 
BEGIN
    -- Rename customer_id to user_id if it exists
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
END $;

SELECT '✅ ORDERS TABLE FIXED!' as status;