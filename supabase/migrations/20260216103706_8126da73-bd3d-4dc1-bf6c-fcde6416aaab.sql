
-- Create seller_applications table
CREATE TABLE public.seller_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  government_id_url text,
  portfolio_url text,
  social_media_links jsonb DEFAULT '[]'::jsonb,
  artist_bio text,
  bank_details jsonb,
  art_category text NOT NULL,
  sample_work_urls text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  rejection_reason text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own application
CREATE POLICY "Users view own application" ON public.seller_applications
  FOR SELECT USING (user_id = auth.uid());

-- Users can create their own application
CREATE POLICY "Users create own application" ON public.seller_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update own pending application
CREATE POLICY "Users update own pending application" ON public.seller_applications
  FOR UPDATE USING (user_id = auth.uid() AND status = 'pending');

-- Admins can view all applications
CREATE POLICY "Admins view all applications" ON public.seller_applications
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update applications (approve/reject)
CREATE POLICY "Admins update applications" ON public.seller_applications
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Add moderation columns to products
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS admin_feedback text,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

-- Update products RLS: only show approved products publicly
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view approved active products" ON public.products
  FOR SELECT USING (is_active = true AND moderation_status = 'approved');

-- Admins can view all products for moderation
CREATE POLICY "Admins view all products" ON public.products
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update any product (for moderation)
DROP POLICY IF EXISTS "Vendors update own products" ON public.products;
CREATE POLICY "Vendors update own products" ON public.products
  FOR UPDATE USING ((vendor_id = auth.uid() AND has_role(auth.uid(), 'vendor'::app_role)) OR has_role(auth.uid(), 'admin'::app_role));

-- Create audit_logs table for admin actions
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view audit logs" ON public.audit_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on seller_applications
CREATE TRIGGER update_seller_applications_updated_at
  BEFORE UPDATE ON public.seller_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Update existing seeded products to be approved
UPDATE public.products SET moderation_status = 'approved' WHERE moderation_status = 'pending';
