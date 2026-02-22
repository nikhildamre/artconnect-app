-- 🔧 Safe Admin Setup for ArtVpp
-- This script works with existing database structures
-- Run this in your Supabase SQL Editor

-- Step 1: Create app_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('customer', 'vendor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Step 3: Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create seller_applications table if it doesn't exist
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

-- Step 5: Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;

-- Step 6: Create has_role function only if it doesn't exist
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create RLS Policies (only if they don't exist)
DO $$
BEGIN
    -- Users read own roles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Users read own roles') THEN
        CREATE POLICY "Users read own roles" ON public.user_roles
          FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Admins manage roles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Admins manage roles') THEN
        CREATE POLICY "Admins manage roles" ON public.user_roles
          FOR ALL USING (public.has_role(auth.uid(), 'admin'));
    END IF;

    -- Admins view audit logs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Admins view audit logs') THEN
        CREATE POLICY "Admins view audit logs" ON public.audit_logs
          FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
    END IF;

    -- Admins insert audit logs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Admins insert audit logs') THEN
        CREATE POLICY "Admins insert audit logs" ON public.audit_logs
          FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
    END IF;

    -- Users view own applications
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seller_applications' AND policyname = 'Users view own applications') THEN
        CREATE POLICY "Users view own applications" ON public.seller_applications
          FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Users create own applications
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seller_applications' AND policyname = 'Users create own applications') THEN
        CREATE POLICY "Users create own applications" ON public.seller_applications
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Admins view all applications
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seller_applications' AND policyname = 'Admins view all applications') THEN
        CREATE POLICY "Admins view all applications" ON public.seller_applications
          FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
    END IF;

    -- Admins update applications
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seller_applications' AND policyname = 'Admins update applications') THEN
        CREATE POLICY "Admins update applications" ON public.seller_applications
          FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

-- Step 8: Grant admin role to artvppcoeteam@gmail.com
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the user ID for the admin email
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
        
        -- Also ensure customer role exists (users can have multiple roles)
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (admin_user_id, 'customer')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin role granted successfully to artvppcoeteam@gmail.com';
    END IF;
END $$;

-- Step 9: Create user registration function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Assign customer role to new users
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- Step 11: Verify setup
SELECT 
    'Safe admin setup completed successfully!' as status;

-- Show current admin users
SELECT 
    u.email,
    ur.role,
    ur.created_at as role_granted_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY ur.created_at DESC;