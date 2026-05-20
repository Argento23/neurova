-- ============================================================
-- NEUROVA OS — Multi-Tenant Schema Migration v3
-- Ejecutar en Supabase SQL Editor
-- ============================================================
-- This migration adds multi-tenancy support to transform the
-- single-user Content Factory into a multi-product SaaS platform.
-- ============================================================

-- ══════════════════════════════════════════════════════
-- 1. USERS CONFIG — Per-user platform credentials & settings
-- ══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS users_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity (user_id links to Supabase Auth when available)
  user_id UUID,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  brand_name TEXT DEFAULT 'My Brand',
  brand_tagline TEXT DEFAULT '',
  timezone TEXT DEFAULT 'America/Argentina/Buenos_Aires',
  language TEXT DEFAULT 'es',
  
  -- Subscription
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  plan_status TEXT DEFAULT 'active' CHECK (plan_status IN ('active', 'trial', 'past_due', 'cancelled')),
  paypal_subscription_id TEXT,
  paypal_payer_id TEXT,
  plan_started_at TIMESTAMPTZ DEFAULT now(),
  plan_expires_at TIMESTAMPTZ,
  
  -- Platform Credentials (encrypted at rest by Supabase)
  ig_access_token TEXT,
  ig_user_id TEXT,
  fb_page_id TEXT,
  tiktok_client_key TEXT,
  tiktok_client_secret TEXT,
  tiktok_access_token TEXT,
  tiktok_refresh_token TEXT,
  tiktok_open_id TEXT,
  youtube_client_id TEXT,
  youtube_client_secret TEXT,
  youtube_refresh_token TEXT,
  
  -- WhatsApp (Evolution API instance per user)
  evolution_instance TEXT,
  evolution_api_url TEXT,
  evolution_api_key TEXT,
  
  -- Content Settings
  content_niche TEXT, -- e.g. "Peluquería en Madrid"
  content_topics JSONB DEFAULT '[]',
  post_frequency INTEGER DEFAULT 1, -- posts per day
  platforms_enabled TEXT[] DEFAULT ARRAY['instagram', 'facebook'],
  
  -- Limits
  daily_posts_limit INTEGER DEFAULT 3,
  daily_outreach_limit INTEGER DEFAULT 50,
  monthly_leads_limit INTEGER DEFAULT 500,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for users_config
CREATE INDEX IF NOT EXISTS idx_users_config_user_id ON users_config(user_id);
CREATE INDEX IF NOT EXISTS idx_users_config_email ON users_config(email);
CREATE INDEX IF NOT EXISTS idx_users_config_plan ON users_config(plan);
CREATE INDEX IF NOT EXISTS idx_users_config_paypal ON users_config(paypal_subscription_id);

-- RLS
ALTER TABLE users_config ENABLE ROW LEVEL SECURITY;

-- Users can only see their own config
CREATE POLICY "users_own_config" ON users_config
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role can see all (for backend/scheduler)
CREATE POLICY "service_full_access_users_config" ON users_config
  FOR ALL USING (true) WITH CHECK (true);

-- ══════════════════════════════════════════════════════
-- 2. CALENDAR POSTS — Replaces local calendar.json
-- ══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS calendar_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  owner_id UUID REFERENCES users_config(id) ON DELETE CASCADE,
  
  -- Scheduling
  post_date DATE NOT NULL,
  publish_time TEXT NOT NULL, -- "09:00", "12:00", etc.
  
  -- Content
  post_type TEXT NOT NULL DEFAULT 'educacion',
  topic TEXT NOT NULL,
  language TEXT DEFAULT 'es',
  platforms TEXT[] DEFAULT ARRAY['instagram', 'facebook'],
  
  -- Generated Content
  caption TEXT,
  hashtags TEXT[],
  image_prompt TEXT,
  image_path TEXT,
  image_url TEXT, -- ImgBB hosted URL (reusable)
  video_path TEXT,
  video_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'generating', 'ready', 'publishing', 
    'published', 'partial', 'error', 'cancelled'
  )),
  error TEXT,
  publish_results JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Indexes for calendar_posts
CREATE INDEX IF NOT EXISTS idx_calendar_owner ON calendar_posts(owner_id);
CREATE INDEX IF NOT EXISTS idx_calendar_date ON calendar_posts(post_date);
CREATE INDEX IF NOT EXISTS idx_calendar_status ON calendar_posts(status);
CREATE INDEX IF NOT EXISTS idx_calendar_owner_date ON calendar_posts(owner_id, post_date);

-- RLS
ALTER TABLE calendar_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_full_access_calendar" ON calendar_posts
  FOR ALL USING (true) WITH CHECK (true);

-- ══════════════════════════════════════════════════════
-- 3. ADD owner_id TO EXISTING sales_leads TABLE
-- ══════════════════════════════════════════════════════

ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users_config(id);
ALTER TABLE sales_leads ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Index for owner filtering
CREATE INDEX IF NOT EXISTS idx_sales_leads_owner ON sales_leads(owner_id);

-- ══════════════════════════════════════════════════════
-- 4. LEAD MARKETPLACE — Leads available for purchase
-- ══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS lead_marketplace (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference to the actual lead (data hidden until purchased)
  lead_id UUID REFERENCES sales_leads(id) ON DELETE CASCADE,
  
  -- Anonymized preview info
  industry TEXT NOT NULL,
  city TEXT,
  country TEXT,
  ai_score INTEGER,
  has_phone BOOLEAN DEFAULT false,
  has_email BOOLEAN DEFAULT false,
  has_website BOOLEAN DEFAULT false,
  description TEXT, -- e.g. "Restaurant owner in Miami, 4.5★ Google rating"
  
  -- Pricing
  price_usd NUMERIC(8,2) DEFAULT 25.00,
  
  -- Purchase tracking
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  purchased_by UUID REFERENCES users_config(id),
  purchased_at TIMESTAMPTZ,
  paypal_order_id TEXT,
  
  -- Metadata
  listed_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON lead_marketplace(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_industry ON lead_marketplace(industry);
CREATE INDEX IF NOT EXISTS idx_marketplace_score ON lead_marketplace(ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_buyer ON lead_marketplace(purchased_by);

-- RLS
ALTER TABLE lead_marketplace ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_full_access_marketplace" ON lead_marketplace
  FOR ALL USING (true) WITH CHECK (true);

-- ══════════════════════════════════════════════════════
-- 5. PAYMENT EVENTS LOG — Webhook audit trail (PayPal)
-- ══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT DEFAULT 'paypal', -- 'paypal', 'mercadopago', 'manual'
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  customer_email TEXT,
  subscription_id TEXT,
  amount NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_events_type ON payment_events(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_events_email ON payment_events(customer_email);

ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_full_access_payments" ON payment_events
  FOR ALL USING (true) WITH CHECK (true);

-- ══════════════════════════════════════════════════════
-- 6. USEFUL VIEWS
-- ══════════════════════════════════════════════════════

-- Active subscribers with their usage
CREATE OR REPLACE VIEW active_subscribers AS
SELECT 
  uc.id,
  uc.email,
  uc.display_name,
  uc.brand_name,
  uc.plan,
  uc.plan_status,
  uc.platforms_enabled,
  COUNT(DISTINCT cp.id) FILTER (WHERE cp.post_date = CURRENT_DATE) as posts_today,
  COUNT(DISTINCT cp.id) FILTER (WHERE cp.status = 'published' AND cp.post_date >= CURRENT_DATE - 7) as posts_this_week,
  COUNT(DISTINCT sl.id) as total_leads
FROM users_config uc
LEFT JOIN calendar_posts cp ON cp.owner_id = uc.id
LEFT JOIN sales_leads sl ON sl.owner_id = uc.id
WHERE uc.plan_status IN ('active', 'trial')
GROUP BY uc.id;

-- Marketplace listings (public view, no sensitive data)
CREATE OR REPLACE VIEW marketplace_listings AS
SELECT 
  lm.id,
  lm.industry,
  lm.city,
  lm.country,
  lm.ai_score,
  lm.has_phone,
  lm.has_email,
  lm.has_website,
  lm.description,
  lm.price_usd,
  lm.status,
  lm.listed_at,
  lm.expires_at
FROM lead_marketplace lm
WHERE lm.status = 'available'
  AND lm.expires_at > now()
ORDER BY lm.ai_score DESC;

-- ══════════════════════════════════════════════════════
-- 7. HELPER FUNCTION: Create default config for new user
-- ══════════════════════════════════════════════════════

-- NOTE: This trigger auto-creates user config when someone signs up via Supabase Auth.
-- Uncomment when Supabase Auth is configured for your project.
--
-- CREATE OR REPLACE FUNCTION create_user_config()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO users_config (user_id, email, display_name)
--   VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION create_user_config();

-- ══════════════════════════════════════════════════════
-- 8. SEED: Create "master" user config for existing system
-- ══════════════════════════════════════════════════════

-- This inserts YOUR (Gustavo's) config as the "master" account
-- so the existing Content Factory + Sales Engine keeps working
INSERT INTO users_config (
  email, display_name, brand_name, brand_tagline, 
  plan, plan_status,
  content_niche, platforms_enabled,
  daily_posts_limit, daily_outreach_limit, monthly_leads_limit
) VALUES (
  'agentes.space@gmail.com',
  'Gustavo Dornhofer',
  'GenerArise',
  'Automatización Inteligente con IA',
  'enterprise',
  'active',
  'AI Automation Agency',
  ARRAY['instagram', 'facebook', 'tiktok', 'youtube'],
  10, 200, 50000
) ON CONFLICT (email) DO NOTHING;

-- Link existing leads to master account
-- (Run after insert, uses subquery to get the master user's id)
UPDATE sales_leads 
SET owner_id = (SELECT id FROM users_config WHERE email = 'agentes.space@gmail.com' LIMIT 1)
WHERE owner_id IS NULL;
