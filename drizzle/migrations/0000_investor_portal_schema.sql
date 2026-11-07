-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.investor_status AS ENUM ('registered', 'verified', 'premium', 'admin');

-- Shared updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  title text,
  organisation text,
  phone text,
  aum text,
  investment_focus text,
  investor_status public.investor_status NOT NULL DEFAULT 'registered',
  avatar_url text,
  portfolio_value numeric,
  verification_notes text,
  verified_at timestamptz,
  verified_by uuid,
  last_login timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin')) WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Investors cannot change their own tier or verification fields
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.investor_status := 'registered';
    NEW.verification_notes := NULL;
    NEW.verified_at := NULL;
    NEW.verified_by := NULL;
    NEW.portfolio_value := NULL;
  ELSE
    NEW.investor_status := OLD.investor_status;
    NEW.verification_notes := OLD.verification_notes;
    NEW.verified_at := OLD.verified_at;
    NEW.verified_by := OLD.verified_by;
    NEW.portfolio_value := OLD.portfolio_value;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER profiles_protect_fields BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create a profile for every new account from sign-up details
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, title, organisation, phone, aum, investment_focus)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'title', ''),
    NULLIF(NEW.raw_user_meta_data->>'organisation', ''),
    NULLIF(NEW.raw_user_meta_data->>'phone', ''),
    NULLIF(NEW.raw_user_meta_data->>'aum', ''),
    NULLIF(NEW.raw_user_meta_data->>'investment_focus', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Current caller's investor tier (used by policies)
CREATE OR REPLACE FUNCTION public.current_investor_status()
RETURNS public.investor_status LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT investor_status FROM public.profiles WHERE id = auth.uid()
$$;

-- Mapping from original platform user IDs to new accounts (team/server only)
CREATE TABLE public.legacy_user_ids (
  legacy_id text PRIMARY KEY,
  user_id uuid NOT NULL,
  email text NOT NULL,
  imported_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.legacy_user_ids TO service_role;
ALTER TABLE public.legacy_user_ids ENABLE ROW LEVEL SECURITY;

-- Publications
CREATE TABLE public.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  title text NOT NULL,
  subtitle text,
  summary text,
  category text NOT NULL DEFAULT 'Research',
  methodology text,
  fliphtml_url text,
  file_url text,
  access_level text NOT NULL DEFAULT 'registered',
  is_portal_visible boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.publications TO authenticated;
GRANT ALL ON public.publications TO service_role;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in investors read visible publications" ON public.publications FOR SELECT TO authenticated USING (is_portal_visible OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage publications" ON public.publications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
GRANT INSERT, UPDATE, DELETE ON public.publications TO authenticated;
CREATE TRIGGER publications_updated_at BEFORE UPDATE ON public.publications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Asset briefs (listing)
CREATE TABLE public.asset_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  asset_class text,
  location text,
  location_detail text,
  teaser text,
  price_kes numeric,
  price_usd numeric,
  requires_order boolean NOT NULL DEFAULT false,
  access_level text NOT NULL DEFAULT 'registered',
  status text NOT NULL DEFAULT 'active',
  confidentiality text,
  metrics jsonb,
  highlights text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.asset_briefs TO authenticated;
GRANT ALL ON public.asset_briefs TO service_role;
ALTER TABLE public.asset_briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in investors read asset briefs" ON public.asset_briefs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage asset briefs" ON public.asset_briefs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Investment briefs (detail memoranda)
CREATE TABLE public.investment_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  asset_class text,
  investment_type text,
  location text,
  location_detail text,
  status text NOT NULL DEFAULT 'active',
  access_level text NOT NULL DEFAULT 'registered',
  summary text,
  teaser text,
  target_irr text,
  target_yield text,
  price_kes numeric,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.investment_briefs TO authenticated;
GRANT ALL ON public.investment_briefs TO service_role;
ALTER TABLE public.investment_briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in investors read investment briefs" ON public.investment_briefs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage investment briefs" ON public.investment_briefs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Off-market deals (verified+ only)
CREATE TABLE public.off_market_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  asset_class text,
  location text,
  location_detail text,
  indicative_price text,
  price_kes numeric,
  "minimumTicket" numeric,
  teaser text,
  status text NOT NULL DEFAULT 'active',
  access_level text NOT NULL DEFAULT 'verified',
  confidentiality text,
  metrics jsonb,
  highlights text[],
  is_visible_to_verified boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.off_market_deals TO authenticated;
GRANT ALL ON public.off_market_deals TO service_role;
ALTER TABLE public.off_market_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Verified investors read off-market deals" ON public.off_market_deals FOR SELECT TO authenticated
  USING (is_visible_to_verified AND public.current_investor_status() IN ('verified', 'premium', 'admin'));
CREATE POLICY "Admins manage off-market deals" ON public.off_market_deals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Brief orders (created and cancelled through the server only)
CREATE TABLE public.brief_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_type text NOT NULL CHECK (order_type IN ('digital', 'hard_copy')),
  amount_kes numeric NOT NULL DEFAULT 0,
  amount_usd numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  contact_name text,
  contact_email text,
  contact_phone text,
  organisation text,
  shipping_address text,
  brief_title text,
  delivery_method text,
  tracking_number text,
  payment_method text,
  transaction_id text,
  cancellation_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX brief_orders_user_idx ON public.brief_orders (user_id, created_at DESC);
GRANT SELECT ON public.brief_orders TO authenticated;
GRANT ALL ON public.brief_orders TO service_role;
ALTER TABLE public.brief_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors read own orders" ON public.brief_orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER brief_orders_updated_at BEFORE UPDATE ON public.brief_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- M-Pesa payment confirmations (submitted through the server only)
CREATE TABLE public.payment_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_id uuid REFERENCES public.brief_orders(id) ON DELETE SET NULL,
  payment_method text NOT NULL DEFAULT 'M-Pesa',
  mpesa_message text NOT NULL,
  review_status text NOT NULL DEFAULT 'submitted',
  amount_kes numeric,
  amount_usd numeric,
  transaction_id text,
  order_type text,
  brief_title text,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX payment_confirmations_user_idx ON public.payment_confirmations (user_id, created_at DESC);
GRANT SELECT ON public.payment_confirmations TO authenticated;
GRANT ALL ON public.payment_confirmations TO service_role;
ALTER TABLE public.payment_confirmations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors read own payments" ON public.payment_confirmations FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Documents shared with individual investors
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text,
  file_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.document_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  granted_at timestamptz NOT NULL DEFAULT now(),
  viewed_at timestamptz,
  UNIQUE (user_id, document_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_access TO authenticated;
GRANT ALL ON public.document_access TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors read own document access" ON public.document_access FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage document access" ON public.document_access FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Investors read shared documents" ON public.documents FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.document_access da WHERE da.document_id = documents.id AND da.user_id = auth.uid()));
CREATE POLICY "Admins manage documents" ON public.documents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enquiries
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors read own enquiries" ON public.enquiries FOR SELECT TO authenticated USING (investor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Investors create own enquiries" ON public.enquiries FOR INSERT TO authenticated WITH CHECK (investor_id = auth.uid() AND status = 'open');
CREATE POLICY "Admins update enquiries" ON public.enquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Acquisition criteria
CREATE TABLE public.acquisition_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL,
  markets text[] NOT NULL DEFAULT '{}',
  asset_types text[] NOT NULL DEFAULT '{}',
  min_price numeric,
  max_price numeric,
  min_yield numeric,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.acquisition_criteria TO authenticated;
GRANT ALL ON public.acquisition_criteria TO service_role;
ALTER TABLE public.acquisition_criteria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors read own criteria" ON public.acquisition_criteria FOR SELECT TO authenticated USING (investor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Investors add own criteria" ON public.acquisition_criteria FOR INSERT TO authenticated WITH CHECK (investor_id = auth.uid());
CREATE POLICY "Investors update own criteria" ON public.acquisition_criteria FOR UPDATE TO authenticated USING (investor_id = auth.uid()) WITH CHECK (investor_id = auth.uid());
CREATE POLICY "Investors delete own criteria" ON public.acquisition_criteria FOR DELETE TO authenticated USING (investor_id = auth.uid());

-- Notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text,
  type text NOT NULL DEFAULT 'general',
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications (user_id, created_at DESC);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors read own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Investors mark own notifications read" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Notify investors when order status changes
CREATE OR REPLACE FUNCTION public.notify_order_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (NEW.user_id, 'Order received', COALESCE(NEW.brief_title, 'Investment brief') || ' — ' || replace(NEW.order_type, '_', ' ') || ' order created.', 'order', '/portal/orders');
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (NEW.user_id, 'Order update', 'Your order is now ' || replace(NEW.status, '_', ' ') || '.', 'order', '/portal/orders');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER brief_orders_notify AFTER INSERT OR UPDATE OF status ON public.brief_orders FOR EACH ROW EXECUTE FUNCTION public.notify_order_status();
