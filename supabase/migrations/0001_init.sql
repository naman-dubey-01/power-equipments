-- ============================================================
-- Power Equipments — Initial schema
-- Applies: tables, RLS, storage buckets, seed data.
-- Run this ONCE in the Supabase Dashboard > SQL Editor.
-- (Or: supabase link --project-ref <ref> && supabase db push)
-- ============================================================

-- ---------- EXTENSIONS ----------
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'admin' check (role in ('admin','editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  brand text,
  sku text,
  specifications jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  category text,
  storage_path text not null,
  alt_text text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  description text,
  image_path text,
  document_path text,
  valid_from text,
  valid_until text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_settings (
  id uuid primary key default gen_random_uuid(),
  company_name text not null default 'Power Equipments',
  tagline text,
  email text,
  primary_phone text,
  secondary_phone text,
  whatsapp text,
  office_hours text,
  about_short text,
  about_long text,
  facebook_url text,
  linkedin_url text,
  twitter_url text,
  instagram_url text,
  youtube_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.offices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  state text,
  postal_code text,
  phone text,
  email text,
  latitude double precision,
  longitude double precision,
  map_url text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  company text,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value text,
  updated_at timestamptz not null default now()
);

create table if not exists public.slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  cta_text text,
  cta_link text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- INDEXES ----------
create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_products_active_sort on public.products (is_active, sort_order);
create index if not exists idx_product_images_product on public.product_images (product_id, sort_order);
create index if not exists idx_gallery_active_sort on public.gallery_items (is_active, sort_order);
create index if not exists idx_certificates_active_sort on public.certificates (is_active, sort_order);
create index if not exists idx_categories_active_sort on public.categories (is_active, sort_order);
create index if not exists idx_brands_active_sort on public.brands (is_active, sort_order);
create index if not exists idx_offices_active_sort on public.offices (is_active, sort_order);
create index if not exists idx_contact_status_created on public.contact_submissions (status, created_at desc);
create index if not exists idx_slides_active_sort on public.slides (is_active, sort_order);

-- ============================================================
-- GRANTS
-- ============================================================
grant usage on schema public to anon, authenticated;

-- anon (public): read only
grant select on public.categories to anon;
grant select on public.products to anon;
grant select on public.product_images to anon;
grant select on public.gallery_items to anon;
grant select on public.certificates to anon;
grant select on public.company_settings to anon;
grant select on public.offices to anon;
grant select on public.brands to anon;
-- anon may insert enquiries only
grant insert on public.contact_submissions to anon;

-- authenticated (admin): full CRUD on content tables
grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.product_images to authenticated;
grant select, insert, update, delete on public.gallery_items to authenticated;
grant select, insert, update, delete on public.certificates to authenticated;
grant select, insert, update, delete on public.company_settings to authenticated;
grant select, insert, update, delete on public.offices to authenticated;
grant select, insert, update, delete on public.contact_submissions to authenticated;
grant select, insert, update, delete on public.brands to authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;
grant select, insert, update, delete on public.slides to authenticated;
grant select on public.slides to anon;
grant select, insert, update, delete on public.profiles to authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.gallery_items enable row level security;
alter table public.certificates enable row level security;
alter table public.company_settings enable row level security;
alter table public.offices enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.brands enable row level security;
alter table public.site_settings enable row level security;

-- --- categories: public read active; admin full ---
create policy "categories public read active"
  on public.categories for select
  to anon, authenticated
  using (is_active = true);
create policy "categories admin all"
  on public.categories for all
  to authenticated
  using (true) with check (true);

-- --- products: public read active; admin full ---
create policy "products public read active"
  on public.products for select
  to anon, authenticated
  using (is_active = true);
create policy "products admin all"
  on public.products for all
  to authenticated
  using (true) with check (true);

-- --- product_images: public read; admin full ---
create policy "product_images public read"
  on public.product_images for select
  to anon, authenticated
  using (true);
create policy "product_images admin all"
  on public.product_images for all
  to authenticated
  using (true) with check (true);

-- --- gallery_items: public read active; admin full ---
create policy "gallery_items public read active"
  on public.gallery_items for select
  to anon, authenticated
  using (is_active = true);
create policy "gallery_items admin all"
  on public.gallery_items for all
  to authenticated
  using (true) with check (true);

-- --- certificates: public read active; admin full ---
create policy "certificates public read active"
  on public.certificates for select
  to anon, authenticated
  using (is_active = true);
create policy "certificates admin all"
  on public.certificates for all
  to authenticated
  using (true) with check (true);

-- --- company_settings: public read (it is public info); admin update ---
create policy "company_settings public read"
  on public.company_settings for select
  to anon, authenticated
  using (true);
create policy "company_settings admin update"
  on public.company_settings for update
  to authenticated
  using (true) with check (true);
create policy "company_settings admin insert"
  on public.company_settings for insert
  to authenticated
  with check (true);
create policy "company_settings admin delete"
  on public.company_settings for delete
  to authenticated
  using (true);

-- --- offices: public read active; admin full ---
create policy "offices public read active"
  on public.offices for select
  to anon, authenticated
  using (is_active = true);
create policy "offices admin all"
  on public.offices for all
  to authenticated
  using (true) with check (true);

-- --- contact_submissions: anon insert only; admin read/update ---
create policy "contact_submissions anon insert"
  on public.contact_submissions for insert
  to anon
  with check (true);
create policy "contact_submissions admin read"
  on public.contact_submissions for select
  to authenticated
  using (true);
create policy "contact_submissions admin update"
  on public.contact_submissions for update
  to authenticated
  using (true) with check (true);
create policy "contact_submissions admin delete"
  on public.contact_submissions for delete
  to authenticated
  using (true);

-- --- brands: public read active; admin full ---
create policy "brands public read active"
  on public.brands for select
  to anon, authenticated
  using (is_active = true);
create policy "brands admin all"
  on public.brands for all
  to authenticated
  using (true) with check (true);

-- --- site_settings: admin only ---
create policy "site_settings admin all"
  on public.site_settings for all
  to authenticated
  using (true) with check (true);

-- --- slides: public read active; admin full ---
create policy "slides public read active"
  on public.slides for select
  to anon, authenticated
  using (is_active = true);
create policy "slides admin all"
  on public.slides for all
  to authenticated
  using (true) with check (true);

-- --- profiles: admin read all; owner can update own ---
create policy "profiles admin read"
  on public.profiles for select
  to authenticated
  using (true);
create policy "profiles owner update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- ============================================================
-- AUTO-CREATE PROFILE ON FIRST ADMIN SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.email), 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('gallery-images', 'gallery-images', true),
  ('certificate-files', 'certificate-files', true),
  ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

do $$
declare b text;
begin
  foreach b in array array['product-images','gallery-images','certificate-files','site-assets'] loop
    execute format('create policy if not exists "public read %s" on storage.objects for select using (bucket_id = %L)', b, b);
    execute format('create policy if not exists "admin upload %s" on storage.objects for insert to authenticated with check (bucket_id = %L)', b, b);
    execute format('create policy if not exists "admin update %s" on storage.objects for update to authenticated using (bucket_id = %L)', b, b);
    execute format('create policy if not exists "admin delete %s" on storage.objects for delete to authenticated using (bucket_id = %L)', b, b);
  end loop;
end $$;

-- ============================================================
-- SEED DATA  (interim content; client can edit via /admin)
-- ============================================================

-- --- company_settings (singleton) ---
insert into public.company_settings (id, company_name, tagline, email, primary_phone, secondary_phone, whatsapp, office_hours, about_short, about_long)
values (
  '11111111-1111-1111-1111-111111111111',
  'Power Equipments',
  'Electrical & Industrial Solutions for Central India',
  'contact@powerequipments.in',
  '+91 755 400 0001',
  '+91 98260 12345',
  '+91 755 400 0001',
  'Mon–Sat: 9:30 AM – 6:30 PM',
  'Power Equipments is a trusted supplier of electrical and industrial products in Bhopal, Indore and across Central India — VFDs, motors, LED lighting, wires & cables, switchgear and control panels.',
  'Established in Bhopal, Power Equipments has grown into a dependable partner for industrial and commercial electrical requirements across Central India, with offices in Bhopal and Indore. We supply and support variable frequency drives, AC/DC motors, industrial LED lighting, wires & cables, LT switchgear, and custom motor/control panels. Our team combines product knowledge with hands-on project support — from selection and sizing to commissioning and after-sales service.'
) on conflict (id) do update set
  company_name = excluded.company_name,
  tagline = excluded.tagline,
  email = excluded.email,
  primary_phone = excluded.primary_phone,
  secondary_phone = excluded.secondary_phone,
  whatsapp = excluded.whatsapp,
  office_hours = excluded.office_hours,
  about_short = excluded.about_short,
  about_long = excluded.about_long;

-- --- offices ---
insert into public.offices (name, address, city, state, postal_code, phone, email, sort_order, is_active) values
  ('Head Office — Bhopal', 'MP Nagar, Zone-1', 'Bhopal', 'Madhya Pradesh', '462011', '+91 755 400 0001', 'bhopal@powerequipments.in', 1, true),
  ('Indore Branch', 'Vijay Nagar', 'Indore', 'Madhya Pradesh', '452010', '+91 98260 12345', 'indore@powerequipments.in', 2, true);

-- --- brands ---
insert into public.brands (name, website_url, sort_order, is_active) values
  ('ABB', 'https://global.abb/', 1, true),
  ('Siemens', 'https://www.siemens.com/', 2, true),
  ('Philips', 'https://www.lighting.philips.com/', 3, true),
  ('Polycab', 'https://www.polycab.com/', 4, true),
  ('Schneider Electric', 'https://www.se.com/', 5, true),
  ('Larsen & Toubro', 'https://www.larsentoubro.com/', 6, true);

-- --- categories ---
insert into public.categories (name, slug, description, sort_order, is_active) values
  ('VFDs & Drives', 'vfds-drives', 'Variable frequency drives, soft starters and industrial automation drives.', 1, true),
  ('Electric Motors', 'electric-motors', 'AC/DC industrial motors for pumps, fans, compressors and machinery.', 2, true),
  ('Lighting Solutions', 'lighting-solutions', 'Industrial LED highbays, flameproof fittings and commercial lighting.', 3, true),
  ('Wires & Cables', 'wires-cables', 'FR copper wires, armoured power cables and cable management.', 4, true),
  ('Switchgear & Controls', 'switchgear-controls', 'MCBs, contactors, breakers and LT switchgear for distribution and motor control.', 5, true),
  ('Transformers & Distribution', 'transformers', 'Distribution transformers and power quality equipment.', 6, true);

-- --- products ---
insert into public.products (name, slug, category_id, brand, sku, specifications, short_description, description, featured, is_active, sort_order) values
  ('ABB ACS880 VFD Drive', 'abb-acs880', (select id from public.categories where slug='vfds-drives'), 'ABB', 'ABB-ACS880-45KW',
   '[{"label":"Power Range","value":"0.55 – 200 kW"},{"label":"Control Method","value":"Direct Torque Control (DTC)"},{"label":"Protection","value":"IP21 / IP55 / IP66"},{"label":"Warranty","value":"18 Months"}]',
   'Industrial AC drive for demanding applications.',
   'The ABB ACS880 is a high-performance industrial drive family for demanding applications, offering accurate torque and speed control, energy efficiency and wide power range support. Ideal for pumps, fans, conveyors and process machinery.',
   true, true, 1),
  ('Siemens SIMOTICS Industrial Motor', 'siemens-simotics-motor', (select id from public.categories where slug='electric-motors'), 'Siemens', 'SIE-MOT-15HP',
   '[{"label":"Efficiency Class","value":"IE3 / IE4"},{"label":"Power","value":"0.75 – 375 kW"},{"label":"Frame Size","value":"63 – 355"},{"label":"Mounting","value":"B3 / B5 / B35"}]',
   'High-efficiency IE3 motors for industrial use.',
   'Siemens SIMOTICS IE3 premium efficiency motors deliver dependable operation for continuous industrial duty, with low maintenance and robust construction for harsh environments.',
   true, true, 2),
  ('Philips Highbay LED 150W', 'philips-highbay', (select id from public.categories where slug='lighting-solutions'), 'Philips', 'PHI-LED-150W',
   '[{"label":"Power","value":"150 W"},{"label":"Luminous Efficacy","value":"150 lm/W"},{"label":"IP Rating","value":"IP65"},{"label":"Mounting","value":"Ceiling / Pendant"}]',
   'Energy-efficient LED lighting for warehouses and workshops.',
   'A 150W industrial LED highbay delivering bright, uniform light for warehouses, factories and commercial spaces with long service life and immediate energy savings.',
   false, true, 3),
  ('Polycab 4-Core Armoured Copper Cable', 'polycab-armoured-cable', (select id from public.categories where slug='wires-cables'), 'Polycab', 'POL-ARM-4C',
   '[{"label":"Conductor","value":"Annealed Copper"},{"label":"Size Range","value":"2.5 sq.mm – 630 sq.mm"},{"label":"Voltage Grade","value":"1100 V"},{"label":"Sheath","value":"PVC / FR-LSH"}]',
   'Armoured copper power cable for distribution and sub-mains.',
   'Polycab armoured copper cables provide reliable power transmission and distribution for commercial and industrial installations, with strong mechanical protection and stable performance.',
   true, true, 4),
  ('L&T 63A 4-Pole MCB', 'lt-mcb', (select id from public.categories where slug='switchgear-controls'), 'L&T', 'LT-MCB-63A',
   '[{"label":"Rated Current","value":"63 A"},{"label":"Poles","value":"4 Pole"},{"label":"Breaking Capacity","value":"10 kA"},{"label":"Trip Curve","value":"C / D"}]',
   'Miniature circuit breaker for distribution boards.',
   'L&T miniature circuit breakers offer dependable overcurrent and short-circuit protection for distribution boards and sub-circuits in industrial and commercial buildings.',
   false, true, 5),
  ('Schneider TeSys D Contactor 32A', 'schneider-contactor', (select id from public.categories where slug='switchgear-controls'), 'Schneider Electric', 'SCH-TESYS-32',
   '[{"label":"Coil Voltage","value":"220 V AC"},{"label":"Rated Current","value":"32 A"},{"label":"AC-3 Rating","value":"15 kW / 415 V"},{"label":"Accessories","value":"Auxiliary blocks & interlocks"}]',
   'Industrial contactor for motor control.',
   'Schneider Electric TeSys contactors are engineered for motor control and switching of lighting/heating loads, with compact design and long electrical life.',
   false, true, 6);

-- --- product_images (interim placeholder imagery; replace via admin) ---
insert into public.product_images (product_id, storage_path, alt_text, sort_order, is_primary) values
  ((select id from public.products where slug='abb-acs880'), 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 'ABB ACS880 VFD drive', 1, true),
  ((select id from public.products where slug='siemens-simotics-motor'), 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', 'Siemens SIMOTICS industrial motor', 1, true),
  ((select id from public.products where slug='philips-highbay'), 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80', 'Philips highbay LED lighting', 1, true);

-- --- gallery_items (interim placeholder imagery; replace via admin) ---
insert into public.gallery_items (title, description, category, storage_path, alt_text, sort_order, is_active) values
  ('Industrial VFD & Panel Assembly', 'Custom ABB drive panel installation for a manufacturing plant in the Pithampur industrial area.', 'Automation', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 'Industrial VFD and panel assembly', 1, true),
  ('Warehouse Highbay LED Installation', 'High-efficiency LED highbay lighting retrofit for a logistics facility in Mandideep.', 'Commercial Lighting', 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80', 'Warehouse highbay LED installation', 2, true),
  ('Motor Control Center (MCC) Panel', 'High-capacity motor control panel for a water utility project.', 'Switchgear & MCC', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', 'MCC panel', 3, true),
  ('Heavy Copper Cable Laying & Wiring', 'Armoured cable installation for a commercial building in Bhopal.', 'Power Cables', 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80', 'Copper cable installation', 4, true),
  ('Distribution Warehouse Inventory', 'Central stock repository in MP Nagar, Bhopal carrying ready-to-dispatch units.', 'Warehouse & Inventory', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', 'Distribution warehouse', 5, true),
  ('Substation Control Panel Testing', 'Routine insulation and load testing of switchgear units before dispatch.', 'Testing & Quality', 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80', 'Control panel testing', 6, true);

-- --- certificates ---
insert into public.certificates (title, issuer, description, valid_from, valid_until, document_path, sort_order, is_active) values
  ('ISO 9001:2015 Quality Management', 'International Organization for Standardization', 'Certification covering quality control and technical compliance in electrical distribution and industrial equipment supply.', '2023', '2028',
   'https://www.iso.org/files/live/sites/isoorg/files/store/en/PUB100405.pdf', 1, true),
  ('Channel Partner & Distributor Authorization', 'Manufacturer Partner Program', 'Authorized distribution and service channel for variable frequency drives and low-voltage switchgear brands.', '2024', '2026', null, 2, true),
  ('CPRI Type-Test Compliance', 'Central Power Research Institute (CPRI)', 'Verified type-test compliance for motor control centres and power control panels.', '2022', '2027', null, 3, true);

-- optional placeholder home slides for the slideshow component
insert into public.slides (title, subtitle, image_url, cta_text, cta_link, sort_order, is_active) values
  ('Leading Electrical & Industrial Solutions',
   'Authorized suppliers of VFDs, heavy duty motors, switchgear & power cables across Bhopal, Indore and Central India.',
   'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
   'Explore Product Catalog', '/products', 1, true),
  ('High Performance VFDs & AC Drives',
   'Advanced industrial automation, motor control panels, and energy-saving drive systems for factories.',
   'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
   'View Drives & Automation', '/products?category=vfds-drives', 2, true),
  ('Commercial & Warehouse LED Lighting',
   'Energy efficient highbay lights, flameproof industrial fittings, and distribution switchgear with full manufacturer warranty.',
   'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80',
   'Get Quotation', '/contact', 3, true);

insert into public.site_settings (setting_key, setting_value) values
  ('home_slideshow', 'enabled')
on conflict (setting_key) do nothing;