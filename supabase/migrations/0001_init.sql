-- Geeta Fashion Hub — initial schema
-- Run with `supabase db push` or paste into the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Staff / roles
-- ---------------------------------------------------------------------------
-- A user may sign in through Supabase Auth, but only users listed here can use
-- the admin dashboard. "admin" can change everything (including business
-- settings and staff); "editor" can manage catalogue and daily location.
create table public.staff (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  role       text not null check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;

create or replace function public.staff_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.staff where user_id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.staff where user_id = auth.uid())
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and role = 'admin')
$$;

create policy "staff can read own row" on public.staff
  for select using (user_id = auth.uid() or public.is_admin());
create policy "admins manage staff" on public.staff
  for all using (public.is_admin()) with check (public.is_admin());

-- updated_at helper
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Business settings (single row, id = 1)
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id                       smallint primary key default 1 check (id = 1),
  business_name            text not null default 'Geeta Fashion Hub',
  tagline                  text,
  whatsapp_number          text,          -- international format, digits only e.g. 91XXXXXXXXXX
  phone                    text,
  email                    text,
  address_line             text,          -- permanent store street address
  locality                 text,          -- area / neighbourhood
  city                     text,
  state                    text,
  postal_code              text,
  country                  text not null default 'IN',
  maps_url                 text not null default 'https://maps.app.goo.gl/WURcjzB6XdCH1Mtu6',
  maps_embed_url           text,          -- "Embed a map" iframe src from Google Maps
  latitude                 double precision,
  longitude                double precision,
  instagram_url            text not null default 'https://www.instagram.com/geetafashionhub722/',
  facebook_url             text,
  youtube_url              text,
  business_hours           jsonb not null default '[]'::jsonb, -- [{day, open, close, closed}]
  hours_note               text,
  service_areas            text[] not null default '{}',       -- nearby areas served, for local SEO copy
  about_text               text,
  hero_image_url           text,
  hero_video_url           text,
  default_whatsapp_message text,
  instagram_mode           text not null default 'manual' check (instagram_mode in ('api', 'manual', 'off')),
  instagram_post_limit     smallint not null default 8 check (instagram_post_limit between 3 and 24),
  updated_at               timestamptz not null default now()
);

create trigger site_settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select using (true);
create policy "admins update settings" on public.site_settings
  for update using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (id) values (1) on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table public.categories (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description     text,
  intro           text,           -- longer landing-page copy for local SEO
  image_url       text,
  sort_order      integer not null default 0,
  is_active       boolean not null default true,
  seo_title       text,
  seo_description text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger categories_touch before update on public.categories
  for each row execute function public.touch_updated_at();

alter table public.categories enable row level security;
create policy "public read active categories" on public.categories
  for select using (is_active or public.is_staff());
create policy "staff manage categories" on public.categories
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table public.products (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  slug                 text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category_id          uuid references public.categories (id) on delete set null,
  subcategory          text,
  short_description    text,
  description          text,
  images               text[] not null default '{}',   -- first image is the main image
  image_alt            text,
  sizes                text[] not null default '{}',
  colors               text[] not null default '{}',
  fabric               text,
  price                numeric(10, 2) check (price is null or price >= 0), -- null = "Contact for Price"
  is_customizable      boolean not null default false,
  customization_notes  text,
  stitching_available  boolean not null default false,
  availability         text not null default 'in_stock'
                         check (availability in ('in_stock', 'made_to_order', 'out_of_stock')),
  is_featured          boolean not null default false,
  featured_order       integer not null default 0,
  is_visible           boolean not null default true,
  seo_title            text,
  seo_description      text,
  og_image_url         text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index products_category_idx on public.products (category_id) where is_visible;
create index products_featured_idx on public.products (featured_order) where is_featured and is_visible;

create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

alter table public.products enable row level security;
create policy "public read visible products" on public.products
  for select using (is_visible or public.is_staff());
create policy "staff manage products" on public.products
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- Daily location ("Today at Geeta Fashion Hub"), one row per date (IST)
-- ---------------------------------------------------------------------------
create table public.daily_locations (
  id            uuid primary key default gen_random_uuid(),
  date          date not null unique,
  location_name text not null,
  address       text,
  maps_url      text,
  open_time     time,
  close_time    time,
  is_open       boolean not null default true,
  announcement  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger daily_locations_touch before update on public.daily_locations
  for each row execute function public.touch_updated_at();

alter table public.daily_locations enable row level security;
create policy "public read daily locations" on public.daily_locations for select using (true);
create policy "staff manage daily locations" on public.daily_locations
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- Testimonials (only real ones entered by staff)
-- ---------------------------------------------------------------------------
create table public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  quote      text not null,
  context    text,              -- e.g. "Bridal blouse"
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;
create policy "public read visible testimonials" on public.testimonials
  for select using (is_visible or public.is_staff());
create policy "staff manage testimonials" on public.testimonials
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- Instagram: curated posts (manual mode / API fallback)
-- ---------------------------------------------------------------------------
create table public.instagram_posts (
  id         uuid primary key default gen_random_uuid(),
  permalink  text not null check (permalink ~ '^https://(www\.)?instagram\.com/'),
  image_url  text not null,
  caption    text,
  is_video   boolean not null default false,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.instagram_posts enable row level security;
create policy "public read visible instagram posts" on public.instagram_posts
  for select using (is_visible or public.is_staff());
create policy "staff manage instagram posts" on public.instagram_posts
  for all using (public.is_staff()) with check (public.is_staff());

-- Instagram API credentials. No RLS policies => only the service role
-- (server-side) can read or write. Never exposed to the browser.
create table public.instagram_credentials (
  id           smallint primary key default 1 check (id = 1),
  access_token text not null,
  expires_at   timestamptz,
  updated_at   timestamptz not null default now()
);

alter table public.instagram_credentials enable row level security;

-- ---------------------------------------------------------------------------
-- Storage: public "media" bucket, staff-only writes
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/webp', 'image/jpeg', 'image/png', 'image/avif'])
on conflict (id) do nothing;

create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
create policy "staff upload media" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_staff());
create policy "staff update media" on storage.objects
  for update using (bucket_id = 'media' and public.is_staff());
create policy "staff delete media" on storage.objects
  for delete using (bucket_id = 'media' and public.is_staff());
