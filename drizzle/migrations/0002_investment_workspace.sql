-- Investor workspace: preferences, opportunity catalogue, saved work, mandates, portfolio, activity.

-- 1. Investor profile preferences (all editable by the investor; tier fields stay protected)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS investor_type text CHECK (investor_type IN ('retail', 'hnwi', 'institutional')),
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS investment_experience text,
  ADD COLUMN IF NOT EXISTS investment_objectives text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS available_capital_kes numeric CHECK (available_capital_kes IS NULL OR available_capital_kes >= 0),
  ADD COLUMN IF NOT EXISTS preferred_currency text NOT NULL DEFAULT 'KES',
  ADD COLUMN IF NOT EXISTS preferred_markets text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS preferred_asset_classes text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS target_yield_pct numeric,
  ADD COLUMN IF NOT EXISTS investment_horizon_years integer,
  ADD COLUMN IF NOT EXISTS financing_preference text CHECK (financing_preference IS NULL OR financing_preference IN ('cash', 'financed', 'combination', 'undecided')),
  ADD COLUMN IF NOT EXISTS risk_preference text CHECK (risk_preference IS NULL OR risk_preference IN ('conservative', 'balanced', 'growth')),
  ADD COLUMN IF NOT EXISTS communication_preferences jsonb NOT NULL DEFAULT '{"email": true, "opportunities": true, "orders": true}'::jsonb,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

-- Capture the investor type chosen at registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _type text := NULLIF(NEW.raw_user_meta_data->>'investor_type', '');
BEGIN
  IF _type IS NOT NULL AND _type NOT IN ('retail', 'hnwi', 'institutional') THEN
    _type := NULL;
  END IF;
  INSERT INTO public.profiles (id, email, full_name, title, organisation, phone, aum, investment_focus, investor_type)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'title', ''),
    NULLIF(NEW.raw_user_meta_data->>'organisation', ''),
    NULLIF(NEW.raw_user_meta_data->>'phone', ''),
    NULLIF(NEW.raw_user_meta_data->>'aum', ''),
    NULLIF(NEW.raw_user_meta_data->>'investment_focus', ''),
    _type
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 2. Opportunity catalogue: extend the existing deals table with structured financials
ALTER TABLE public.off_market_deals
  ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT 'Kenya',
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS gross_annual_income_kes numeric,
  ADD COLUMN IF NOT EXISTS operating_expenses_kes numeric,
  ADD COLUMN IF NOT EXISTS occupancy_pct numeric CHECK (occupancy_pct IS NULL OR (occupancy_pct >= 0 AND occupancy_pct <= 100)),
  ADD COLUMN IF NOT EXISTS lease_summary text,
  ADD COLUMN IF NOT EXISTS investment_rationale text,
  ADD COLUMN IF NOT EXISTS risks text,
  ADD COLUMN IF NOT EXISTS acquisition_costs_pct numeric,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS figures_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS off_market_deals_updated_at ON public.off_market_deals;
CREATE TRIGGER off_market_deals_updated_at BEFORE UPDATE ON public.off_market_deals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Opportunities marked for all registered investors are visible to every signed-in investor;
-- confidential ones keep the existing verified-only rule.
CREATE POLICY "Registered investors read open opportunities" ON public.off_market_deals FOR SELECT TO authenticated
  USING (is_visible_to_verified AND access_level = 'registered' AND public.current_investor_status() IS NOT NULL);

-- 3. Saved opportunities
CREATE TABLE public.saved_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  deal_id uuid NOT NULL REFERENCES public.off_market_deals(id) ON DELETE CASCADE,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, deal_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_opportunities TO authenticated;
GRANT ALL ON public.saved_opportunities TO service_role;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors manage own saved opportunities" ON public.saved_opportunities FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 4. Recently viewed opportunities
CREATE TABLE public.opportunity_views (
  user_id uuid NOT NULL,
  deal_id uuid NOT NULL REFERENCES public.off_market_deals(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, deal_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunity_views TO authenticated;
GRANT ALL ON public.opportunity_views TO service_role;
ALTER TABLE public.opportunity_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors manage own views" ON public.opportunity_views FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 5. Saved investment scenarios (Investment Studio)
CREATE TABLE public.investment_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  deal_id uuid REFERENCES public.off_market_deals(id) ON DELETE SET NULL,
  inputs jsonb NOT NULL,
  results jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX investment_scenarios_user_idx ON public.investment_scenarios (user_id, updated_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.investment_scenarios TO authenticated;
GRANT ALL ON public.investment_scenarios TO service_role;
ALTER TABLE public.investment_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors manage own scenarios" ON public.investment_scenarios FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER investment_scenarios_updated_at BEFORE UPDATE ON public.investment_scenarios FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. Saved comparisons
CREATE TABLE public.opportunity_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  deal_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunity_comparisons TO authenticated;
GRANT ALL ON public.opportunity_comparisons TO service_role;
ALTER TABLE public.opportunity_comparisons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors manage own comparisons" ON public.opportunity_comparisons FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER opportunity_comparisons_updated_at BEFORE UPDATE ON public.opportunity_comparisons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. Mandates: extend the existing acquisition criteria
ALTER TABLE public.acquisition_criteria
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'in_review', 'active', 'on_hold', 'fulfilled', 'closed')),
  ADD COLUMN IF NOT EXISTS budget_currency text NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS target_income_kes numeric,
  ADD COLUMN IF NOT EXISTS holding_period_years integer,
  ADD COLUMN IF NOT EXISTS financing_preference text,
  ADD COLUMN IF NOT EXISTS transaction_structure text,
  ADD COLUMN IF NOT EXISTS advisor_notes text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.protect_mandate_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'submitted';
    NEW.advisor_notes := NULL;
  ELSE
    NEW.status := OLD.status;
    NEW.advisor_notes := OLD.advisor_notes;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER acquisition_criteria_protect BEFORE INSERT OR UPDATE ON public.acquisition_criteria FOR EACH ROW EXECUTE FUNCTION public.protect_mandate_fields();
CREATE TRIGGER acquisition_criteria_updated_at BEFORE UPDATE ON public.acquisition_criteria FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "Admins manage criteria" ON public.acquisition_criteria FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.notify_mandate_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (NEW.investor_id, 'Mandate update',
      COALESCE(NEW.title, 'Your mandate') || ' is now ' || replace(NEW.status, '_', ' ') || '.',
      'mandate', '/portal/criteria');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER acquisition_criteria_notify AFTER UPDATE OF status ON public.acquisition_criteria FOR EACH ROW EXECUTE FUNCTION public.notify_mandate_status();

-- 8. Portfolio holdings (actual investments, recorded by the Murivest team)
CREATE TABLE public.portfolio_holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  asset_name text NOT NULL,
  asset_class text,
  location text,
  acquired_on date,
  purchase_price_kes numeric,
  capital_invested_kes numeric,
  debt_outstanding_kes numeric,
  annual_rental_income_kes numeric,
  annual_operating_expenses_kes numeric,
  current_valuation_kes numeric,
  valuation_date date,
  status text NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'under_offer', 'exited')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_holdings TO authenticated;
GRANT ALL ON public.portfolio_holdings TO service_role;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors read own holdings" ON public.portfolio_holdings FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage holdings" ON public.portfolio_holdings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER portfolio_holdings_updated_at BEFORE UPDATE ON public.portfolio_holdings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 9. Activity / audit log (append-only for investors)
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL CHECK (char_length(action) BETWEEN 1 AND 80),
  entity_type text,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX activity_log_user_idx ON public.activity_log (user_id, created_at DESC);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors read own activity" ON public.activity_log FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Investors record own activity" ON public.activity_log FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 10. New opportunity alerts for investors whose saved preferences match
CREATE OR REPLACE FUNCTION public.notify_matching_opportunity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT NEW.is_visible_to_verified THEN
    RETURN NEW;
  END IF;
  INSERT INTO public.notifications (user_id, title, message, type, link)
  SELECT p.id, 'New opportunity', NEW.title || ' matches your stated preferences.', 'opportunity',
         '/portal/discover/' || NEW.id
  FROM public.profiles p
  WHERE COALESCE((p.communication_preferences->>'opportunities')::boolean, true)
    AND (NEW.access_level = 'registered' OR p.investor_status IN ('verified', 'premium', 'admin'))
    AND (
      (NEW.asset_class IS NOT NULL AND lower(NEW.asset_class) = ANY (SELECT lower(x) FROM unnest(p.preferred_asset_classes) x))
      OR (NEW.city IS NOT NULL AND lower(NEW.city) = ANY (SELECT lower(x) FROM unnest(p.preferred_markets) x))
    );
  RETURN NEW;
END;
$$;
CREATE TRIGGER off_market_deals_notify_match AFTER INSERT ON public.off_market_deals FOR EACH ROW EXECUTE FUNCTION public.notify_matching_opportunity();