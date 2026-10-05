-- 0021 · Seller commerce — the vendor side of the marketplace.
--
-- Requirements: productContext.md "For Sellers" (vendor dashboard, onboarding + payouts, SKU and
-- inventory, contextual merchandising, order fulfilment with labels and tracking, sales analytics by
-- race), docs/21 §4.3 (affiliate first, then seller onboarding), #46/#56.
--
-- Two fulfilment modes, chosen per seller and per product, so phase 1 and phase 2 coexist:
--   'affiliate'   — product links out (0020's external_url). No orders here. Phase 1.
--   'marketplace' — athlete checks out on GoAthletix; the seller ships. Phase 2.
-- GoAthletix never holds stock in either mode (docs/21 §4.3).
--
-- Money and personal-data rules baked in:
--   · Orders, payments, payouts and refunds are written ONLY by the backend (service role). A buyer can
--     never insert an order — prices come from the server, not the browser.
--   · No card or bank numbers are stored. Payment and payout state is a provider reference
--     (Razorpay / Stripe / Cashfree ids). Stripe Connect is limited for India-registered platforms;
--     Razorpay Route is the usual Indian choice for split settlements — a pending owner decision.
--   · Seller KYC (GSTIN, PAN) and buyer addresses live in restricted tables, never on public rows.
--   · Marketplace operators in India have GST TCS and income-tax TDS (s.194-O) obligations; the payout
--     rows carry both amounts. Confirm current rates with a CA before launch.
--
-- Requires 0013 (has_role, is_staff_session), 0017 (moderation_status, guard_moderation_status),
-- 0020 (sellers, products). Idempotent and transactional.

BEGIN;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $upd$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$upd$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. Seller team, onboarding and store settings
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS seller_members (
  seller_id  uuid              NOT NULL REFERENCES sellers (id)  ON DELETE CASCADE,
  user_id    uuid              NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  role       club_role         NOT NULL DEFAULT 'member',
  status     membership_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (seller_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_seller_members_user ON seller_members (user_id);

DROP TRIGGER IF EXISTS update_seller_members_modtime ON seller_members;
CREATE TRIGGER update_seller_members_modtime
  BEFORE UPDATE ON seller_members FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Replaces 0020's version: the owner OR an active seller admin, plus platform admins.
CREATE OR REPLACE FUNCTION is_seller_owner(target_seller uuid, target_user uuid)
RETURNS boolean AS $$
  SELECT has_role(target_user, 'admin')
      OR EXISTS (SELECT 1 FROM sellers WHERE id = target_seller AND owner_id = target_user)
      OR EXISTS (SELECT 1 FROM seller_members
                 WHERE seller_id = target_seller AND user_id = target_user
                   AND role IN ('owner', 'admin') AND status = 'active');
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

ALTER TABLE seller_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Seller team reads membership" ON seller_members;
CREATE POLICY "Seller team reads membership"
  ON seller_members FOR SELECT USING (auth.uid() = user_id OR is_seller_owner(seller_id, auth.uid()));

DROP POLICY IF EXISTS "Seller admins manage the team" ON seller_members;
CREATE POLICY "Seller admins manage the team"
  ON seller_members FOR ALL
  USING (is_seller_owner(seller_id, auth.uid())) WITH CHECK (is_seller_owner(seller_id, auth.uid()));

DROP POLICY IF EXISTS "Members leave a seller team" ON seller_members;
CREATE POLICY "Members leave a seller team"
  ON seller_members FOR DELETE USING (auth.uid() = user_id);

-- Seller admins (not only the original owner) may see and edit the store page, including while it is
-- still pending: an UPDATE first needs the row to be visible under a SELECT policy.
DROP POLICY IF EXISTS "Seller team reads their store" ON sellers;
CREATE POLICY "Seller team reads their store"
  ON sellers FOR SELECT USING (is_seller_owner(id, auth.uid()));

DROP POLICY IF EXISTS "Seller admins update their store" ON sellers;
CREATE POLICY "Seller admins update their store"
  ON sellers FOR UPDATE USING (is_seller_owner(id, auth.uid())) WITH CHECK (is_seller_owner(id, auth.uid()));

ALTER TABLE sellers
  ADD COLUMN IF NOT EXISTS fulfilment_mode text NOT NULL DEFAULT 'affiliate'
    CHECK (fulfilment_mode IN ('affiliate', 'marketplace')),
  -- Platform take rate for this seller; NULL = the category default the backend applies.
  ADD COLUMN IF NOT EXISTS commission_pct  numeric(5,2) CHECK (commission_pct BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS return_policy   text,
  ADD COLUMN IF NOT EXISTS shipping_policy text,
  ADD COLUMN IF NOT EXISTS ships_from_city  text,
  ADD COLUMN IF NOT EXISTS ships_from_state text,
  ADD COLUMN IF NOT EXISTS follower_count  integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS product_count   integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_avg      numeric(2,1),
  ADD COLUMN IF NOT EXISTS rating_count    integer NOT NULL DEFAULT 0;

-- Extend 0020's guard: sellers also cannot set their own take rate, mode or counters.
CREATE OR REPLACE FUNCTION guard_seller_status()
RETURNS trigger AS $$
BEGIN
  IF NOT is_staff_session() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.status          := 'pending';
      NEW.is_verified     := false;
      NEW.fulfilment_mode := 'affiliate';
      NEW.commission_pct  := NULL;
      NEW.follower_count  := 0;
      NEW.product_count   := 0;
      NEW.rating_avg      := NULL;
      NEW.rating_count    := 0;
    ELSE
      NEW.status          := OLD.status;
      NEW.is_verified     := OLD.is_verified;
      NEW.owner_id        := OLD.owner_id;
      NEW.fulfilment_mode := OLD.fulfilment_mode;
      NEW.commission_pct  := OLD.commission_pct;
      NEW.follower_count  := OLD.follower_count;
      NEW.product_count   := OLD.product_count;
      NEW.rating_avg      := OLD.rating_avg;
      NEW.rating_count    := OLD.rating_count;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- KYC and payout details. Never on the public sellers row.
CREATE TABLE IF NOT EXISTS seller_private (
  seller_id             uuid PRIMARY KEY REFERENCES sellers (id) ON DELETE CASCADE,
  legal_name            text,
  business_type         text CHECK (business_type IN ('individual', 'proprietorship', 'partnership', 'llp', 'private_limited', 'public_limited', 'other')),
  gstin                 text CHECK (gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'),
  pan                   text CHECK (pan   IS NULL OR pan   ~ '^[A-Z]{5}[0-9]{4}[A-Z]$'),
  registered_address    jsonb,
  kyc_status            text NOT NULL DEFAULT 'not_started'
                        CHECK (kyc_status IN ('not_started', 'submitted', 'verified', 'rejected')),
  kyc_verified_at       timestamptz,
  kyc_notes             text,
  -- The payment provider's linked-account id only. Bank details stay with the provider.
  payout_provider       text CHECK (payout_provider IN ('razorpay', 'stripe', 'cashfree', 'manual')),
  payout_account_id     text,
  agreement_version     text,
  agreement_accepted_at timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS update_seller_private_modtime ON seller_private;
CREATE TRIGGER update_seller_private_modtime
  BEFORE UPDATE ON seller_private FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- A seller submits KYC; only staff can mark it verified or attach a payout account.
CREATE OR REPLACE FUNCTION guard_seller_kyc()
RETURNS trigger AS $$
BEGIN
  IF NOT is_staff_session() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.kyc_status        := CASE WHEN NEW.kyc_status = 'submitted' THEN 'submitted' ELSE 'not_started' END;
      NEW.kyc_verified_at   := NULL;
      NEW.kyc_notes         := NULL;
      NEW.payout_account_id := NULL;
    ELSE
      IF NEW.kyc_status NOT IN ('not_started', 'submitted') OR OLD.kyc_status = 'verified' THEN
        NEW.kyc_status := OLD.kyc_status;
      END IF;
      NEW.kyc_verified_at   := OLD.kyc_verified_at;
      NEW.kyc_notes         := OLD.kyc_notes;
      NEW.payout_account_id := OLD.payout_account_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_seller_kyc_trg ON seller_private;
CREATE TRIGGER guard_seller_kyc_trg
  BEFORE INSERT OR UPDATE ON seller_private FOR EACH ROW EXECUTE FUNCTION guard_seller_kyc();

ALTER TABLE seller_private ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Seller admins manage their KYC" ON seller_private;
CREATE POLICY "Seller admins manage their KYC"
  ON seller_private FOR ALL
  USING (is_seller_owner(seller_id, auth.uid())) WITH CHECK (is_seller_owner(seller_id, auth.uid()));

-- ---------------------------------------------------------------------------
-- 2. Products: purchase mode, tax, variants (SKU + stock), merchandising rules
-- ---------------------------------------------------------------------------

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS purchase_mode text NOT NULL DEFAULT 'external_link'
    CHECK (purchase_mode IN ('external_link', 'checkout')),
  ADD COLUMN IF NOT EXISTS hsn_code      text,                                    -- GST classification
  ADD COLUMN IF NOT EXISTS gst_rate      numeric(4,2) CHECK (gst_rate BETWEEN 0 AND 40),
  ADD COLUMN IF NOT EXISTS weight_grams  integer CHECK (weight_grams > 0),
  ADD COLUMN IF NOT EXISTS rating_avg    numeric(2,1),
  ADD COLUMN IF NOT EXISTS rating_count  integer NOT NULL DEFAULT 0;

-- ---- Product moderation: a seller's item is never on sale until GoAthletix approves it. ----
--   draft ──submit──▶ pending_review ──staff──▶ approved      (visible and buyable)
--                         ▲      └──staff──▶ rejected | changes_requested ──edit+resubmit──┘
-- Editing what a shopper sees (title, description, images, category, tags, link) on an approved product
-- sends it back to pending_review, so nothing unreviewed is ever live. Price and stock edits do not.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'draft'
    CHECK (review_status IN ('draft', 'pending_review', 'approved', 'rejected', 'changes_requested')),
  ADD COLUMN IF NOT EXISTS submitted_at  timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_at   timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by   uuid REFERENCES profiles (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS review_notes  text;

CREATE INDEX IF NOT EXISTS idx_products_review_queue ON products (submitted_at) WHERE review_status = 'pending_review';

CREATE OR REPLACE FUNCTION guard_product_review()
RETURNS trigger AS $$
BEGIN
  IF is_staff_session() THEN
    IF NEW.review_status IS DISTINCT FROM OLD.review_status AND NEW.review_status IN ('approved', 'rejected', 'changes_requested') THEN
      NEW.reviewed_at := coalesce(NEW.reviewed_at, now());
      NEW.reviewed_by := coalesce(NEW.reviewed_by, auth.uid());
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    -- A seller may save a draft or submit straight away — never self-approve.
    IF NEW.review_status <> 'pending_review' THEN NEW.review_status := 'draft'; END IF;
    NEW.submitted_at := CASE WHEN NEW.review_status = 'pending_review' THEN now() END;
    NEW.reviewed_at := NULL; NEW.reviewed_by := NULL; NEW.review_notes := NULL;
    RETURN NEW;
  END IF;

  -- Sellers can only submit (draft/rejected/changes_requested -> pending_review) or withdraw (-> draft).
  IF NEW.review_status IS DISTINCT FROM OLD.review_status
     AND NOT (NEW.review_status = 'pending_review' AND OLD.review_status IN ('draft', 'rejected', 'changes_requested'))
     AND NOT (NEW.review_status = 'draft' AND OLD.review_status IN ('pending_review', 'rejected', 'changes_requested')) THEN
    NEW.review_status := OLD.review_status;
  END IF;

  -- Content edits on a live product go back into the queue.
  IF OLD.review_status = 'approved' AND (
       NEW.title IS DISTINCT FROM OLD.title OR NEW.description IS DISTINCT FROM OLD.description
    OR NEW.brand IS DISTINCT FROM OLD.brand OR NEW.category IS DISTINCT FROM OLD.category
    OR NEW.image_urls IS DISTINCT FROM OLD.image_urls OR NEW.sport_types IS DISTINCT FROM OLD.sport_types
    OR NEW.discipline_slugs IS DISTINCT FROM OLD.discipline_slugs OR NEW.age_categories IS DISTINCT FROM OLD.age_categories
    OR NEW.external_url IS DISTINCT FROM OLD.external_url OR NEW.purchase_mode IS DISTINCT FROM OLD.purchase_mode) THEN
    NEW.review_status := 'pending_review';
  END IF;

  IF NEW.review_status = 'pending_review' AND OLD.review_status IS DISTINCT FROM 'pending_review' THEN
    NEW.submitted_at := now();
  END IF;
  NEW.reviewed_at := OLD.reviewed_at; NEW.reviewed_by := OLD.reviewed_by; NEW.review_notes := OLD.review_notes;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_product_review_trg ON products;
CREATE TRIGGER guard_product_review_trg
  BEFORE INSERT OR UPDATE ON products FOR EACH ROW EXECUTE FUNCTION guard_product_review();

-- Audit trail of every review decision, visible to the seller (why was it rejected?) and to staff.
CREATE TABLE IF NOT EXISTS product_moderation_log (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id  uuid NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  actor_id    uuid REFERENCES profiles (id) ON DELETE SET NULL,
  from_status text,
  to_status   text NOT NULL,
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_moderation_log ON product_moderation_log (product_id, created_at DESC);

CREATE OR REPLACE FUNCTION log_product_review()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.review_status IS DISTINCT FROM OLD.review_status THEN
    INSERT INTO product_moderation_log (product_id, actor_id, from_status, to_status, note)
    VALUES (NEW.id, auth.uid(), CASE WHEN TG_OP = 'UPDATE' THEN OLD.review_status END, NEW.review_status,
            CASE WHEN NEW.review_status IN ('rejected', 'changes_requested') THEN NEW.review_notes END);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS log_product_review_trg ON products;
CREATE TRIGGER log_product_review_trg
  AFTER INSERT OR UPDATE OF review_status ON products FOR EACH ROW EXECUTE FUNCTION log_product_review();

ALTER TABLE product_moderation_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sellers and moderators read moderation history" ON product_moderation_log;
CREATE POLICY "Sellers and moderators read moderation history"
  ON product_moderation_log FOR SELECT
  USING (has_role(auth.uid(), 'moderator') OR EXISTS (
    SELECT 1 FROM products p WHERE p.id = product_moderation_log.product_id AND is_seller_owner(p.seller_id, auth.uid())));

-- Replace 0020's public rule: shoppers see a product only when it is approved, active, and its seller is active.
DROP POLICY IF EXISTS "Active products of active sellers are publicly readable" ON products;
DROP POLICY IF EXISTS "Approved products of active sellers are publicly readable" ON products;
CREATE POLICY "Approved products of active sellers are publicly readable"
  ON products FOR SELECT
  USING ((is_active AND review_status = 'approved'
          AND EXISTS (SELECT 1 FROM sellers s WHERE s.id = products.seller_id AND s.status = 'active'))
         OR is_seller_owner(seller_id, auth.uid())
         OR has_role(auth.uid(), 'moderator'));

-- Checkout products have no outbound link, so external_url becomes optional — but only for them.
ALTER TABLE products ALTER COLUMN external_url DROP NOT NULL;
DO $$ BEGIN
  ALTER TABLE products ADD CONSTRAINT products_link_required
    CHECK (purchase_mode <> 'external_link' OR external_url IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS product_variants (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          uuid NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  sku                 text NOT NULL,
  option_size         text,
  option_color        text,
  attributes          jsonb NOT NULL DEFAULT '{}',
  price_inr           integer CHECK (price_inr >= 0),     -- NULL = product price
  mrp_inr             integer CHECK (mrp_inr >= 0),
  stock_qty           integer NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  reserved_qty        integer NOT NULL DEFAULT 0 CHECK (reserved_qty >= 0),
  low_stock_threshold integer NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  is_active           boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, sku),
  CHECK (reserved_qty <= stock_qty)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants (product_id) WHERE is_active;

DROP TRIGGER IF EXISTS update_product_variants_modtime ON product_variants;
CREATE TRIGGER update_product_variants_modtime
  BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_modified_column();

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Variants of visible products are readable" ON product_variants;
CREATE POLICY "Variants of visible products are readable"
  ON product_variants FOR SELECT
  USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_variants.product_id));
DROP POLICY IF EXISTS "Sellers manage their variants" ON product_variants;
CREATE POLICY "Sellers manage their variants"
  ON product_variants FOR ALL
  USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_variants.product_id AND is_seller_owner(p.seller_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM products p WHERE p.id = product_variants.product_id AND is_seller_owner(p.seller_id, auth.uid())));

-- Contextual merchandising: "ultra-vests to athletes who saved an ultramarathon".
-- A sponsored rule is paid placement and must be labelled as such in the UI (spec §10).
CREATE TABLE IF NOT EXISTS merchandising_rules (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id          uuid NOT NULL REFERENCES sellers (id)  ON DELETE CASCADE,
  product_id         uuid NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  sport_types        sport_category[] NOT NULL DEFAULT '{}',
  discipline_slugs   text[]           NOT NULL DEFAULT '{}',
  age_categories     age_category[]   NOT NULL DEFAULT '{}',
  min_distance_km    numeric(7,3) CHECK (min_distance_km >= 0),
  max_distance_km    numeric(7,3) CHECK (max_distance_km >= 0),
  -- Show in the window before the athlete's event, e.g. 21 -> 3 days out.
  days_before_max    integer CHECK (days_before_max >= 0),
  days_before_min    integer CHECK (days_before_min >= 0),
  is_sponsored       boolean NOT NULL DEFAULT false,
  priority           integer NOT NULL DEFAULT 100,
  is_active          boolean NOT NULL DEFAULT true,
  starts_at          timestamptz,
  ends_at            timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CHECK (min_distance_km IS NULL OR max_distance_km IS NULL OR max_distance_km >= min_distance_km),
  CHECK (days_before_min IS NULL OR days_before_max IS NULL OR days_before_max >= days_before_min)
);

CREATE INDEX IF NOT EXISTS idx_merch_rules_sports ON merchandising_rules USING GIN (sport_types) WHERE is_active;

DROP TRIGGER IF EXISTS update_merchandising_rules_modtime ON merchandising_rules;
CREATE TRIGGER update_merchandising_rules_modtime
  BEFORE UPDATE ON merchandising_rules FOR EACH ROW EXECUTE FUNCTION update_modified_column();

ALTER TABLE merchandising_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sellers manage their merchandising rules" ON merchandising_rules;
CREATE POLICY "Sellers manage their merchandising rules"
  ON merchandising_rules FOR ALL
  USING (is_seller_owner(seller_id, auth.uid())) WITH CHECK (is_seller_owner(seller_id, auth.uid()));
-- Matching runs in the backend (service role); rules are not public.

-- Click attribution — answers "which races drive sales of my gear".
CREATE TABLE IF NOT EXISTS product_clicks (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  user_id    uuid REFERENCES profiles (id) ON DELETE SET NULL,
  event_id   uuid REFERENCES events (id)   ON DELETE SET NULL,   -- the event that was in context
  source     text NOT NULL CHECK (source IN ('homepage_rail', 'event_page', 'shop', 'search', 'notification')),
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_clicks_product ON product_clicks (product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_clicks_event   ON product_clicks (event_id) WHERE event_id IS NOT NULL;

ALTER TABLE product_clicks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sellers read clicks on their products" ON product_clicks;
CREATE POLICY "Sellers read clicks on their products"
  ON product_clicks FOR SELECT
  USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_clicks.product_id AND is_seller_owner(p.seller_id, auth.uid())));
-- Inserts: the backend's redirect endpoint (service role) only, so clicks cannot be faked.

-- ---------------------------------------------------------------------------
-- 3. Buyer side: saved addresses, wishlist, cart
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_addresses (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  label      text,                                    -- 'Home', 'Office'
  full_name  text NOT NULL,
  phone      text NOT NULL,
  line1      text NOT NULL,
  line2      text,
  city       text NOT NULL,
  state      text NOT NULL,
  pincode    text NOT NULL CHECK (pincode ~ '^[1-9][0-9]{5}$'),
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS user_addresses_one_default ON user_addresses (user_id) WHERE is_default;

DROP TRIGGER IF EXISTS update_user_addresses_modtime ON user_addresses;
CREATE TRIGGER update_user_addresses_modtime
  BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_modified_column();

ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their addresses" ON user_addresses;
CREATE POLICY "Users manage their addresses"
  ON user_addresses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS product_saves (
  user_id    uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

ALTER TABLE product_saves ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their wishlist" ON product_saves;
CREATE POLICY "Users manage their wishlist"
  ON product_saves FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS carts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL UNIQUE REFERENCES profiles (id) ON DELETE CASCADE,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  cart_id    uuid    NOT NULL REFERENCES carts (id)            ON DELETE CASCADE,
  variant_id uuid    NOT NULL REFERENCES product_variants (id) ON DELETE CASCADE,
  quantity   integer NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  added_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (cart_id, variant_id)
);

ALTER TABLE carts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their cart" ON carts;
CREATE POLICY "Users manage their cart"
  ON carts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users manage their cart items" ON cart_items;
CREATE POLICY "Users manage their cart items"
  ON cart_items FOR ALL
  USING (EXISTS (SELECT 1 FROM carts c WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM carts c WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()));
-- A cart holds intent only. Prices are recomputed server-side at checkout.

-- ---------------------------------------------------------------------------
-- 4. Orders — one buyer order, split into one seller_order per seller (each ships and is paid out
--    on its own). Written by the backend only.
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending_payment', 'paid', 'partially_fulfilled', 'fulfilled',
                                    'cancelled', 'refunded', 'partially_refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE seller_order_status AS ENUM ('pending', 'accepted', 'packed', 'shipped', 'delivered',
                                           'cancelled', 'returned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_txn_status AS ENUM ('created', 'authorized', 'captured', 'failed',
                                          'refunded', 'partially_refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- One checkout record for everything an athlete pays for: gear (seller_orders below) and event tickets
-- (`tickets`, 0022). One order -> one payment, so a race entry and a pair of shoes can be paid together.
CREATE TABLE IF NOT EXISTS orders (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     text NOT NULL UNIQUE
                   DEFAULT 'GA-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 6)),
  user_id          uuid NOT NULL REFERENCES profiles (id) ON DELETE RESTRICT,
  order_kind       text NOT NULL DEFAULT 'merch' CHECK (order_kind IN ('merch', 'tickets', 'mixed')),
  status           order_status NOT NULL DEFAULT 'pending_payment',
  currency         text    NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  subtotal_inr     integer NOT NULL CHECK (subtotal_inr >= 0),
  shipping_inr     integer NOT NULL DEFAULT 0 CHECK (shipping_inr >= 0),
  discount_inr     integer NOT NULL DEFAULT 0 CHECK (discount_inr >= 0),
  tax_inr          integer NOT NULL DEFAULT 0 CHECK (tax_inr >= 0),
  -- Platform / convenience fee charged to the buyer (ticketing), shown as its own line at checkout.
  fee_inr          integer NOT NULL DEFAULT 0 CHECK (fee_inr >= 0),
  total_inr        integer NOT NULL CHECK (total_inr >= 0),
  coupon_code      text,
  -- Snapshots, so a later address edit never rewrites order history. Ticket-only orders ship nothing.
  shipping_address jsonb,
  billing_address  jsonb,
  event_context_id uuid REFERENCES events (id) ON DELETE SET NULL,   -- the race that drove the purchase
  placed_at        timestamptz NOT NULL DEFAULT now(),
  paid_at          timestamptz,
  cancelled_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CHECK (total_inr = subtotal_inr + shipping_inr + tax_inr + fee_inr - discount_inr),
  CHECK (order_kind = 'tickets' OR shipping_address IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders (user_id, placed_at DESC);

CREATE TABLE IF NOT EXISTS seller_orders (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         uuid NOT NULL REFERENCES orders (id)  ON DELETE CASCADE,
  seller_id        uuid NOT NULL REFERENCES sellers (id) ON DELETE RESTRICT,
  status           seller_order_status NOT NULL DEFAULT 'pending',
  subtotal_inr     integer NOT NULL CHECK (subtotal_inr >= 0),
  shipping_inr     integer NOT NULL DEFAULT 0 CHECK (shipping_inr >= 0),
  tax_inr          integer NOT NULL DEFAULT 0 CHECK (tax_inr >= 0),
  total_inr        integer NOT NULL CHECK (total_inr >= 0),
  commission_inr   integer NOT NULL DEFAULT 0 CHECK (commission_inr >= 0),
  -- The seller's own copy of where to ship; sellers never read the buyer's `orders` row.
  shipping_address jsonb NOT NULL,
  accepted_at      timestamptz,
  shipped_at       timestamptz,
  delivered_at     timestamptz,
  cancelled_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id, seller_id),
  CHECK (total_inr = subtotal_inr + shipping_inr + tax_inr)
);

CREATE INDEX IF NOT EXISTS idx_seller_orders_seller ON seller_orders (seller_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_order_id  uuid NOT NULL REFERENCES seller_orders (id) ON DELETE CASCADE,
  product_id       uuid REFERENCES products (id)         ON DELETE SET NULL,
  variant_id       uuid REFERENCES product_variants (id) ON DELETE SET NULL,
  title_snapshot   text NOT NULL,
  sku_snapshot     text,
  quantity         integer NOT NULL CHECK (quantity > 0),
  unit_price_inr   integer NOT NULL CHECK (unit_price_inr >= 0),
  gst_rate         numeric(4,2),
  tax_inr          integer NOT NULL DEFAULT 0 CHECK (tax_inr >= 0),
  line_total_inr   integer NOT NULL CHECK (line_total_inr >= 0),
  event_context_id uuid REFERENCES events (id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_seller_order ON order_items (seller_order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_event ON order_items (event_context_id) WHERE event_context_id IS NOT NULL;

DROP TRIGGER IF EXISTS update_orders_modtime ON orders;
CREATE TRIGGER update_orders_modtime
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_modified_column();
DROP TRIGGER IF EXISTS update_seller_orders_modtime ON seller_orders;
CREATE TRIGGER update_seller_orders_modtime
  BEFORE UPDATE ON seller_orders FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Sellers move their own fulfilment status forward; they can never edit money or the address.
CREATE OR REPLACE FUNCTION guard_seller_order_money()
RETURNS trigger AS $$
BEGIN
  IF NOT is_staff_session() THEN
    NEW.order_id         := OLD.order_id;
    NEW.seller_id        := OLD.seller_id;
    NEW.subtotal_inr     := OLD.subtotal_inr;
    NEW.shipping_inr     := OLD.shipping_inr;
    NEW.tax_inr          := OLD.tax_inr;
    NEW.total_inr        := OLD.total_inr;
    NEW.commission_inr   := OLD.commission_inr;
    NEW.shipping_address := OLD.shipping_address;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_seller_order_money_trg ON seller_orders;
CREATE TRIGGER guard_seller_order_money_trg
  BEFORE UPDATE ON seller_orders FOR EACH ROW EXECUTE FUNCTION guard_seller_order_money();

ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Buyers read their orders" ON orders;
CREATE POLICY "Buyers read their orders" ON orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Buyers and sellers read seller orders" ON seller_orders;
CREATE POLICY "Buyers and sellers read seller orders"
  ON seller_orders FOR SELECT
  USING (is_seller_owner(seller_id, auth.uid())
         OR EXISTS (SELECT 1 FROM orders o WHERE o.id = seller_orders.order_id AND o.user_id = auth.uid()));

DROP POLICY IF EXISTS "Sellers update their fulfilment status" ON seller_orders;
CREATE POLICY "Sellers update their fulfilment status"
  ON seller_orders FOR UPDATE
  USING (is_seller_owner(seller_id, auth.uid())) WITH CHECK (is_seller_owner(seller_id, auth.uid()));

DROP POLICY IF EXISTS "Buyers and sellers read order items" ON order_items;
CREATE POLICY "Buyers and sellers read order items"
  ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM seller_orders so
                 WHERE so.id = order_items.seller_order_id
                   AND (is_seller_owner(so.seller_id, auth.uid())
                        OR EXISTS (SELECT 1 FROM orders o WHERE o.id = so.order_id AND o.user_id = auth.uid()))));

-- ---------------------------------------------------------------------------
-- 5. Payments and refunds — provider references only, written by payment webhooks.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid NOT NULL REFERENCES orders (id) ON DELETE RESTRICT,
  provider            text NOT NULL CHECK (provider IN ('razorpay', 'stripe', 'cashfree')),
  provider_order_id   text,
  provider_payment_id text UNIQUE,
  amount_inr          integer NOT NULL CHECK (amount_inr >= 0),
  status              payment_txn_status NOT NULL DEFAULT 'created',
  method              text,                -- 'upi', 'card', 'netbanking', 'wallet' — never card numbers
  failure_reason      text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON payments (order_id);

DROP TRIGGER IF EXISTS update_payments_modtime ON payments;
CREATE TRIGGER update_payments_modtime
  BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TABLE IF NOT EXISTS refunds (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id         uuid NOT NULL REFERENCES payments (id) ON DELETE RESTRICT,
  order_item_id      uuid REFERENCES order_items (id) ON DELETE SET NULL,
  amount_inr         integer NOT NULL CHECK (amount_inr > 0),
  provider_refund_id text UNIQUE,
  status             text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  reason             text,
  created_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Buyers read their payments" ON payments;
CREATE POLICY "Buyers read their payments"
  ON payments FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders o WHERE o.id = payments.order_id AND o.user_id = auth.uid()));

DROP POLICY IF EXISTS "Buyers read their refunds" ON refunds;
CREATE POLICY "Buyers read their refunds"
  ON refunds FOR SELECT
  USING (EXISTS (SELECT 1 FROM payments p JOIN orders o ON o.id = p.order_id
                 WHERE p.id = refunds.payment_id AND o.user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- 6. Shipping and returns
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS shipments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_order_id uuid NOT NULL REFERENCES seller_orders (id) ON DELETE CASCADE,
  carrier         text,
  tracking_number text,
  tracking_url    text,
  label_url       text,
  status          text NOT NULL DEFAULT 'label_created'
                  CHECK (status IN ('label_created', 'in_transit', 'out_for_delivery', 'delivered', 'returned', 'lost')),
  shipped_at      timestamptz,
  delivered_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shipments_seller_order ON shipments (seller_order_id);

DROP TRIGGER IF EXISTS update_shipments_modtime ON shipments;
CREATE TRIGGER update_shipments_modtime
  BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION update_modified_column();

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Buyers and sellers read shipments" ON shipments;
CREATE POLICY "Buyers and sellers read shipments"
  ON shipments FOR SELECT
  USING (EXISTS (SELECT 1 FROM seller_orders so
                 WHERE so.id = shipments.seller_order_id
                   AND (is_seller_owner(so.seller_id, auth.uid())
                        OR EXISTS (SELECT 1 FROM orders o WHERE o.id = so.order_id AND o.user_id = auth.uid()))));
DROP POLICY IF EXISTS "Sellers manage their shipments" ON shipments;
CREATE POLICY "Sellers manage their shipments"
  ON shipments FOR ALL
  USING (EXISTS (SELECT 1 FROM seller_orders so WHERE so.id = shipments.seller_order_id AND is_seller_owner(so.seller_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM seller_orders so WHERE so.id = shipments.seller_order_id AND is_seller_owner(so.seller_id, auth.uid())));

CREATE TABLE IF NOT EXISTS return_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES order_items (id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES profiles (id)    ON DELETE CASCADE,
  quantity      integer NOT NULL CHECK (quantity > 0),
  reason        text NOT NULL,
  status        text NOT NULL DEFAULT 'requested'
                CHECK (status IN ('requested', 'approved', 'rejected', 'received', 'refunded')),
  seller_note   text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS update_return_requests_modtime ON return_requests;
CREATE TRIGGER update_return_requests_modtime
  BEFORE UPDATE ON return_requests FOR EACH ROW EXECUTE FUNCTION update_modified_column();

ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Buyers request returns on their items" ON return_requests;
CREATE POLICY "Buyers request returns on their items"
  ON return_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'requested' AND EXISTS (
    SELECT 1 FROM order_items oi JOIN seller_orders so ON so.id = oi.seller_order_id
    JOIN orders o ON o.id = so.order_id
    WHERE oi.id = return_requests.order_item_id AND o.user_id = auth.uid()));
DROP POLICY IF EXISTS "Buyers and sellers read returns" ON return_requests;
CREATE POLICY "Buyers and sellers read returns"
  ON return_requests FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM order_items oi JOIN seller_orders so ON so.id = oi.seller_order_id
    WHERE oi.id = return_requests.order_item_id AND is_seller_owner(so.seller_id, auth.uid())));
DROP POLICY IF EXISTS "Sellers respond to returns" ON return_requests;
CREATE POLICY "Sellers respond to returns"
  ON return_requests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM order_items oi JOIN seller_orders so ON so.id = oi.seller_order_id
                 WHERE oi.id = return_requests.order_item_id AND is_seller_owner(so.seller_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM order_items oi JOIN seller_orders so ON so.id = oi.seller_order_id
                      WHERE oi.id = return_requests.order_item_id AND is_seller_owner(so.seller_id, auth.uid())));

-- ---------------------------------------------------------------------------
-- 7. Coupons — validated server-side; never publicly listable (codes would be harvested).
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS coupons (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code             text NOT NULL,
  seller_id        uuid REFERENCES sellers (id) ON DELETE CASCADE,   -- NULL = platform-wide coupon
  discount_type    text NOT NULL CHECK (discount_type IN ('percent', 'flat')),
  discount_value   integer NOT NULL CHECK (discount_value > 0),
  min_order_inr    integer NOT NULL DEFAULT 0 CHECK (min_order_inr >= 0),
  max_discount_inr integer CHECK (max_discount_inr > 0),
  usage_limit      integer CHECK (usage_limit > 0),
  per_user_limit   integer NOT NULL DEFAULT 1 CHECK (per_user_limit > 0),
  used_count       integer NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  starts_at        timestamptz,
  ends_at          timestamptz,
  is_active        boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  CHECK (discount_type <> 'percent' OR discount_value <= 100)
);

CREATE UNIQUE INDEX IF NOT EXISTS coupons_code_key ON coupons (upper(code));

CREATE TABLE IF NOT EXISTS coupon_redemptions (
  coupon_id   uuid NOT NULL REFERENCES coupons (id)  ON DELETE CASCADE,
  order_id    uuid NOT NULL REFERENCES orders (id)   ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  amount_inr  integer NOT NULL CHECK (amount_inr >= 0),
  redeemed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (coupon_id, order_id)
);

ALTER TABLE coupons            ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sellers manage their coupons" ON coupons;
CREATE POLICY "Sellers manage their coupons"
  ON coupons FOR ALL
  USING (seller_id IS NOT NULL AND is_seller_owner(seller_id, auth.uid()))
  WITH CHECK (seller_id IS NOT NULL AND is_seller_owner(seller_id, auth.uid()));
DROP POLICY IF EXISTS "Buyers read their redemptions" ON coupon_redemptions;
CREATE POLICY "Buyers read their redemptions"
  ON coupon_redemptions FOR SELECT USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 8. Payouts — what each seller is owed, net of commission, refunds, GST TCS and TDS.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS seller_payouts (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id            uuid NOT NULL REFERENCES sellers (id) ON DELETE RESTRICT,
  period_start         date NOT NULL,
  period_end           date NOT NULL,
  gross_inr            integer NOT NULL CHECK (gross_inr >= 0),
  commission_inr       integer NOT NULL DEFAULT 0 CHECK (commission_inr >= 0),
  refunds_inr          integer NOT NULL DEFAULT 0 CHECK (refunds_inr >= 0),
  tcs_inr              integer NOT NULL DEFAULT 0 CHECK (tcs_inr >= 0),   -- GST tax collected at source
  tds_inr              integer NOT NULL DEFAULT 0 CHECK (tds_inr >= 0),   -- income-tax TDS (s.194-O)
  net_inr              integer NOT NULL,
  status               text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'processing', 'paid', 'failed', 'on_hold')),
  provider_transfer_id text UNIQUE,
  paid_at              timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  CHECK (period_end >= period_start),
  CHECK (net_inr = gross_inr - commission_inr - refunds_inr - tcs_inr - tds_inr)
);

CREATE TABLE IF NOT EXISTS seller_payout_items (
  payout_id       uuid NOT NULL REFERENCES seller_payouts (id) ON DELETE CASCADE,
  seller_order_id uuid NOT NULL REFERENCES seller_orders (id)  ON DELETE RESTRICT,
  amount_inr      integer NOT NULL,
  PRIMARY KEY (payout_id, seller_order_id)
);

-- A seller order is paid out at most once.
CREATE UNIQUE INDEX IF NOT EXISTS seller_payout_items_once ON seller_payout_items (seller_order_id);

ALTER TABLE seller_payouts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_payout_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sellers read their payouts" ON seller_payouts;
CREATE POLICY "Sellers read their payouts"
  ON seller_payouts FOR SELECT USING (is_seller_owner(seller_id, auth.uid()));
DROP POLICY IF EXISTS "Sellers read their payout items" ON seller_payout_items;
CREATE POLICY "Sellers read their payout items"
  ON seller_payout_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM seller_payouts p WHERE p.id = seller_payout_items.payout_id AND is_seller_owner(p.seller_id, auth.uid())));

-- ---------------------------------------------------------------------------
-- 9. Product reviews — verified purchase only, same moderation guard as event reviews (0017).
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS product_reviews (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid NOT NULL REFERENCES products (id)    ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES profiles (id)    ON DELETE CASCADE,
  order_item_id uuid NOT NULL REFERENCES order_items (id) ON DELETE CASCADE,
  rating        smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body          text CHECK (char_length(body) <= 4000),
  status        moderation_status NOT NULL DEFAULT 'published',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);

DROP TRIGGER IF EXISTS update_product_reviews_modtime ON product_reviews;
CREATE TRIGGER update_product_reviews_modtime
  BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS guard_product_reviews_status ON product_reviews;
CREATE TRIGGER guard_product_reviews_status
  BEFORE INSERT OR UPDATE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION guard_moderation_status('published');

CREATE OR REPLACE FUNCTION refresh_product_rating()
RETURNS trigger AS $$
DECLARE
  prod uuid := COALESCE(NEW.product_id, OLD.product_id);
  sel  uuid;
BEGIN
  UPDATE products p
  SET rating_count = s.n,
      rating_avg   = CASE WHEN s.n = 0 THEN NULL ELSE round(s.avg_rating, 1) END
  FROM (SELECT count(*) AS n, avg(rating)::numeric AS avg_rating
        FROM product_reviews WHERE product_id = prod AND status = 'published') s
  WHERE p.id = prod
  RETURNING p.seller_id INTO sel;

  IF sel IS NOT NULL THEN
    UPDATE sellers sl
    SET rating_count = s.n,
        rating_avg   = CASE WHEN s.n = 0 THEN NULL ELSE round(s.avg_rating, 1) END
    FROM (SELECT count(*) AS n, avg(r.rating)::numeric AS avg_rating
          FROM product_reviews r JOIN products p ON p.id = r.product_id
          WHERE p.seller_id = sel AND r.status = 'published') s
    WHERE sl.id = sel;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS refresh_product_rating_trg ON product_reviews;
CREATE TRIGGER refresh_product_rating_trg
  AFTER INSERT OR DELETE OR UPDATE OF rating, status ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION refresh_product_rating();

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published product reviews are readable" ON product_reviews;
CREATE POLICY "Published product reviews are readable"
  ON product_reviews FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id OR has_role(auth.uid(), 'moderator'));
DROP POLICY IF EXISTS "Verified buyers review what they bought" ON product_reviews;
CREATE POLICY "Verified buyers review what they bought"
  ON product_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM order_items oi JOIN seller_orders so ON so.id = oi.seller_order_id
    JOIN orders o ON o.id = so.order_id
    WHERE oi.id = product_reviews.order_item_id AND oi.product_id = product_reviews.product_id
      AND o.user_id = auth.uid() AND so.status = 'delivered'));
DROP POLICY IF EXISTS "Users edit their product review" ON product_reviews;
CREATE POLICY "Users edit their product review"
  ON product_reviews FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users delete their product review" ON product_reviews;
CREATE POLICY "Users delete their product review"
  ON product_reviews FOR DELETE USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 10. Counters on sellers
-- ---------------------------------------------------------------------------

UPDATE sellers s SET product_count = (SELECT count(*) FROM products p WHERE p.seller_id = s.id AND p.is_active);

CREATE OR REPLACE FUNCTION refresh_seller_product_count()
RETURNS trigger AS $$
DECLARE
  sel uuid := COALESCE(NEW.seller_id, OLD.seller_id);
BEGIN
  UPDATE sellers SET product_count = (SELECT count(*) FROM products WHERE seller_id = sel AND is_active)
  WHERE id = sel;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS refresh_seller_product_count_trg ON products;
CREATE TRIGGER refresh_seller_product_count_trg
  AFTER INSERT OR DELETE OR UPDATE OF is_active, seller_id ON products
  FOR EACH ROW EXECUTE FUNCTION refresh_seller_product_count();

CREATE OR REPLACE FUNCTION refresh_seller_follower_count()
RETURNS trigger AS $$
DECLARE
  target uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.target_type::text <> 'seller' THEN RETURN OLD; END IF;
    target := OLD.target_id;
  ELSE
    IF NEW.target_type::text <> 'seller' THEN RETURN NEW; END IF;
    target := NEW.target_id;
  END IF;
  UPDATE sellers
  SET follower_count = (SELECT count(*) FROM entity_follows
                        WHERE target_type::text = 'seller' AND target_id = target)
  WHERE id = target;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS refresh_seller_follower_count_trg ON entity_follows;
CREATE TRIGGER refresh_seller_follower_count_trg
  AFTER INSERT OR DELETE ON entity_follows
  FOR EACH ROW EXECUTE FUNCTION refresh_seller_follower_count();

COMMIT;
