
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('customer', 'vendor', 'admin');

-- User roles table (separate from profiles per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  discounted_price NUMERIC(10,2),
  category TEXT,
  medium TEXT,
  tags TEXT[],
  images TEXT[],
  dimensions JSONB,
  inventory INTEGER NOT NULL DEFAULT 1,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_id TEXT,
  shipping_address JSONB,
  tracking_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Commissions
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  artist_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  reference_images TEXT[],
  budget NUMERIC(10,2),
  timeline TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  milestones JSONB DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Workshops
CREATE TABLE public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[],
  video_url TEXT,
  type TEXT DEFAULT 'online',
  skill_level TEXT DEFAULT 'beginner',
  duration INTEGER,
  capacity INTEGER,
  enrolled INTEGER DEFAULT 0,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  schedule JSONB,
  materials_needed TEXT[],
  location TEXT,
  meeting_link TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

-- Workshop bookings
CREATE TABLE public.workshop_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.workshop_bookings ENABLE ROW LEVEL SECURITY;

-- Cart
CREATE TABLE public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Cart items
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Wishlists
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Wishlist items
CREATE TABLE public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID REFERENCES public.wishlists(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(wishlist_id, product_id)
);
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Security definer helper functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-create profile and assign customer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  INSERT INTO public.carts (user_id) VALUES (NEW.id);
  INSERT INTO public.wishlists (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON public.commissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON public.workshops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies

-- User roles: users can read their own, admins can manage all
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Profiles: public read, own write
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Products: public read active, vendors manage own
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Vendors view own products" ON public.products FOR SELECT TO authenticated USING (vendor_id = auth.uid());
CREATE POLICY "Vendors insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (vendor_id = auth.uid() AND public.has_role(auth.uid(), 'vendor'));
CREATE POLICY "Vendors update own products" ON public.products FOR UPDATE TO authenticated USING (vendor_id = auth.uid() AND public.has_role(auth.uid(), 'vendor'));
CREATE POLICY "Vendors delete own products" ON public.products FOR DELETE TO authenticated USING (vendor_id = auth.uid() AND public.has_role(auth.uid(), 'vendor'));

-- Orders: customers see own, vendors see related
CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT TO authenticated USING (customer_id = auth.uid());
CREATE POLICY "Customers create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Customers update pending orders" ON public.orders FOR UPDATE TO authenticated USING (customer_id = auth.uid() AND status IN ('pending', 'processing'));

-- Order items
CREATE POLICY "View own order items" ON public.order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND customer_id = auth.uid()));
CREATE POLICY "Insert own order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND customer_id = auth.uid()));

-- Commissions: participants can view
CREATE POLICY "View own commissions" ON public.commissions FOR SELECT TO authenticated USING (customer_id = auth.uid() OR artist_id = auth.uid());
CREATE POLICY "Customers create commissions" ON public.commissions FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Participants update commissions" ON public.commissions FOR UPDATE TO authenticated USING (customer_id = auth.uid() OR artist_id = auth.uid());

-- Workshops: public read, vendors manage
CREATE POLICY "Anyone can view workshops" ON public.workshops FOR SELECT USING (status = 'published');
CREATE POLICY "Vendors view own workshops" ON public.workshops FOR SELECT TO authenticated USING (vendor_id = auth.uid());
CREATE POLICY "Vendors create workshops" ON public.workshops FOR INSERT TO authenticated WITH CHECK (vendor_id = auth.uid() AND public.has_role(auth.uid(), 'vendor'));
CREATE POLICY "Vendors update own workshops" ON public.workshops FOR UPDATE TO authenticated USING (vendor_id = auth.uid());
CREATE POLICY "Vendors delete own workshops" ON public.workshops FOR DELETE TO authenticated USING (vendor_id = auth.uid());

-- Workshop bookings
CREATE POLICY "View own bookings" ON public.workshop_bookings FOR SELECT TO authenticated USING (customer_id = auth.uid());
CREATE POLICY "Vendors view workshop bookings" ON public.workshop_bookings FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.workshops WHERE id = workshop_id AND vendor_id = auth.uid()));
CREATE POLICY "Customers book workshops" ON public.workshop_bookings FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());

-- Carts: own only
CREATE POLICY "Users view own cart" ON public.carts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users manage own cart" ON public.carts FOR ALL TO authenticated USING (user_id = auth.uid());

-- Cart items: own cart only
CREATE POLICY "View own cart items" ON public.cart_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND user_id = auth.uid()));
CREATE POLICY "Manage own cart items" ON public.cart_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND user_id = auth.uid()));
CREATE POLICY "Update own cart items" ON public.cart_items FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND user_id = auth.uid()));
CREATE POLICY "Delete own cart items" ON public.cart_items FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND user_id = auth.uid()));

-- Wishlists: own only
CREATE POLICY "Users view own wishlist" ON public.wishlists FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users manage own wishlist" ON public.wishlists FOR ALL TO authenticated USING (user_id = auth.uid());

-- Wishlist items: own wishlist only
CREATE POLICY "View own wishlist items" ON public.wishlist_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.wishlists WHERE id = wishlist_id AND user_id = auth.uid()));
CREATE POLICY "Add to own wishlist" ON public.wishlist_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.wishlists WHERE id = wishlist_id AND user_id = auth.uid()));
CREATE POLICY "Remove from own wishlist" ON public.wishlist_items FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.wishlists WHERE id = wishlist_id AND user_id = auth.uid()));
