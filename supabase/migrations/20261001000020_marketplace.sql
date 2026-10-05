-- 0020 · Gear marketplace catalogue (#46, #56).
--
-- Catalogue only — deliberately no carts, orders or payments. The spec's Neutrality pillar says we hold
-- no stock and fulfil nothing: every product links out (external_url) to the seller, who owns price,
-- delivery and returns. If the owner later decides on in-site checkout, that is a separate migration
-- with a payment-provider decision behind it (pending item).
--
-- Requires 0012 (follow_entity 'seller') and 0013 (is_staff_session). Idempotent and transactional.

BEGIN;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $upd$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$upd$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. Sellers. A user applies (status 'pending'); staff activate and verify.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sellers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text,
  logo_url      text,
  website_url   text,
  contact_email text,
  city          text,
  state         text,
  owner_id      uuid NOT NULL REFERENCES profiles (id) ON DELETE RESTRICT,
  is_verified   boolean NOT NULL DEFAULT false,
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sellers_owner ON sellers (owner_id);

DROP TRIGGER IF EXISTS update_sellers_modtime ON sellers;
CREATE TRIGGER update_sellers_modtime
  BEFORE UPDATE ON sellers FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Sellers cannot activate or verify themselves, and new applications always start pending.
CREATE OR REPLACE FUNCTION guard_seller_status()
RETURNS trigger AS $$
BEGIN
  IF NOT is_staff_session() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.status := 'pending';
      NEW.is_verified := false;
    ELSE
      NEW.status := OLD.status;
      NEW.is_verified := OLD.is_verified;
      NEW.owner_id := OLD.owner_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_seller_status_trg ON sellers;
CREATE TRIGGER guard_seller_status_trg
  BEFORE INSERT OR UPDATE ON sellers FOR EACH ROW EXECUTE FUNCTION guard_seller_status();

CREATE OR REPLACE FUNCTION is_seller_owner(target_seller uuid, target_user uuid)
RETURNS boolean AS $$
  SELECT has_role(target_user, 'admin')
      OR EXISTS (SELECT 1 FROM sellers WHERE id = target_seller AND owner_id = target_user);
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active sellers are publicly readable" ON sellers;
CREATE POLICY "Active sellers are publicly readable"
  ON sellers FOR SELECT USING (status = 'active' OR auth.uid() = owner_id OR has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users apply to sell" ON sellers;
CREATE POLICY "Users apply to sell"
  ON sellers FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Sellers update their own store" ON sellers;
CREATE POLICY "Sellers update their own store"
  ON sellers FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- 2. Products — tagged with the same taxonomy athletes filter events by, so "21.1K in 3 weeks"
--    can be matched to shoes, gels and a race belt.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS products (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id        uuid NOT NULL REFERENCES sellers (id) ON DELETE CASCADE,
  slug             text NOT NULL,
  title            text NOT NULL,
  description      text,
  brand            text,
  category         text NOT NULL CHECK (category IN (
                     'shoes', 'spikes', 'apparel', 'nutrition', 'hydration', 'recovery',
                     'wearables', 'protective', 'equipment', 'accessories', 'other')),
  sport_types      sport_category[] NOT NULL DEFAULT '{}',
  discipline_slugs text[]           NOT NULL DEFAULT '{}',
  age_categories   age_category[]   NOT NULL DEFAULT '{}',
  price_inr        integer NOT NULL CHECK (price_inr >= 0),
  mrp_inr          integer CHECK (mrp_inr >= 0),
  image_urls       text[] NOT NULL DEFAULT '{}',
  external_url     text NOT NULL,                       -- the seller's own product page
  stock_status     text NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low', 'out_of_stock')),
  is_active        boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (seller_id, slug),
  CHECK (mrp_inr IS NULL OR mrp_inr >= price_inr)
);

CREATE INDEX IF NOT EXISTS idx_products_sports      ON products USING GIN (sport_types)      WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_products_disciplines ON products USING GIN (discipline_slugs) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_products_category    ON products (category, price_inr)       WHERE is_active;

DROP TRIGGER IF EXISTS update_products_modtime ON products;
CREATE TRIGGER update_products_modtime
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_modified_column();

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active products of active sellers are publicly readable" ON products;
CREATE POLICY "Active products of active sellers are publicly readable"
  ON products FOR SELECT
  USING ((is_active AND EXISTS (SELECT 1 FROM sellers s WHERE s.id = products.seller_id AND s.status = 'active'))
         OR is_seller_owner(seller_id, auth.uid()));

DROP POLICY IF EXISTS "Sellers manage their products" ON products;
CREATE POLICY "Sellers manage their products"
  ON products FOR ALL
  USING (is_seller_owner(seller_id, auth.uid()))
  WITH CHECK (is_seller_owner(seller_id, auth.uid()));

-- ---------------------------------------------------------------------------
-- 3. Product analytics — impressions and outbound clicks, private to the seller.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS product_daily_stats (
  product_id  uuid    NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  day         date    NOT NULL DEFAULT current_date,
  impressions integer NOT NULL DEFAULT 0,
  clicks      integer NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, day)
);

ALTER TABLE product_daily_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sellers read their product stats" ON product_daily_stats;
CREATE POLICY "Sellers read their product stats"
  ON product_daily_stats FOR SELECT
  USING (EXISTS (SELECT 1 FROM products p
                 WHERE p.id = product_daily_stats.product_id AND is_seller_owner(p.seller_id, auth.uid())));

CREATE OR REPLACE FUNCTION record_product_stat(p_product_id uuid, p_metric text, p_amount integer DEFAULT 1)
RETURNS void AS $$
BEGIN
  IF p_metric NOT IN ('impressions', 'clicks') THEN
    RAISE EXCEPTION 'record_product_stat: unknown metric %', p_metric;
  END IF;
  IF p_amount IS NULL OR p_amount < 1 OR p_amount > 10000 THEN
    RAISE EXCEPTION 'record_product_stat: amount out of range';
  END IF;
  INSERT INTO product_daily_stats AS s (product_id, day, impressions, clicks)
  VALUES (p_product_id, current_date,
          CASE WHEN p_metric = 'impressions' THEN p_amount ELSE 0 END,
          CASE WHEN p_metric = 'clicks'      THEN p_amount ELSE 0 END)
  ON CONFLICT (product_id, day) DO UPDATE SET
    impressions = s.impressions + EXCLUDED.impressions,
    clicks      = s.clicks      + EXCLUDED.clicks;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION record_product_stat(uuid, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION record_product_stat(uuid, text, integer) TO service_role;

COMMIT;
