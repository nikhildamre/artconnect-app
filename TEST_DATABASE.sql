-- TEST DATABASE STRUCTURE
-- Run this in Supabase SQL Editor to check if your database is set up correctly

-- Check if orders table exists and has correct columns
SELECT 
  'ORDERS TABLE STRUCTURE:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'orders'
ORDER BY ordinal_position;

-- Check if order_items table exists
SELECT 
  'ORDER_ITEMS TABLE STRUCTURE:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'order_items'
ORDER BY ordinal_position;

-- Check if carts table exists
SELECT 
  'CARTS TABLE STRUCTURE:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'carts'
ORDER BY ordinal_position;

-- Check if you have admin role
SELECT 
  'USER ROLES:' as info,
  u.email,
  ur.role
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'artvppcoeteam@gmail.com';

-- Test if you can insert a simple order (this will show the exact error)
DO $
DECLARE
    test_user_id UUID;
BEGIN
    -- Get your user ID
    SELECT id INTO test_user_id 
    FROM auth.users 
    WHERE email = 'artvppcoeteam@gmail.com';
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'User not found with email artvppcoeteam@gmail.com';
    ELSE
        -- Try to insert a test order
        INSERT INTO public.orders (
            user_id,
            subtotal,
            tax,
            shipping,
            total,
            shipping_address,
            payment_method,
            status
        ) VALUES (
            test_user_id,
            1000.00,
            180.00,
            0.00,
            1180.00,
            '{"name": "Test", "city": "Test City"}',
            'razorpay',
            'pending'
        );
        
        RAISE NOTICE 'Test order inserted successfully!';
        
        -- Clean up test order
        DELETE FROM public.orders WHERE user_id = test_user_id AND subtotal = 1000.00;
        RAISE NOTICE 'Test order cleaned up';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: %', SQLERRM;
END $;