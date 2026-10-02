# Geeta Fashion Hub — website

Catalogue, WhatsApp enquiries, daily store location, Instagram showcase and local SEO for Geeta Fashion Hub, a boutique for traditional Indian wear and custom stitching.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Supabase (Postgres, Auth, Storage), deployed on Netlify.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Without Supabase credentials the site runs in **preview mode**. It shows a sample catalogue, and `/admin` displays setup instructions.

## Connect Supabase

1. Create a Supabase project.
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql`. This creates the tables, row-level security, the `media` storage bucket and the default categories.
3. Copy `.env.example` to `.env.local` and fill it in:
   - `NEXT_PUBLIC_SITE_URL`: the live domain, e.g. `https://geetafashionhub.in`. Canonical URLs, the sitemap and Open Graph images depend on it.
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`: server-only. It is used only to store and read the Instagram token.
   - `CRON_SECRET`: any long random string.
4. Create the owner's login under **Authentication → Users → Add user**. Then grant dashboard access:
   ```sql
   insert into public.staff (user_id, role)
   select id, 'admin' from auth.users where email = 'owner@example.com';
   ```
   Use the role `editor` for staff who should manage products and the daily location but not business settings.
5. Turn off public sign-ups under **Authentication → Providers → Email**.
6. Sign in at `/admin/login`.

## First things to fill in (/admin)

The dashboard checklist tracks these:

- **Business Info:** the WhatsApp number (with country code), phone, the exact permanent address as it appears on Google Maps, opening hours, and optionally the Google Maps *embed* URL and coordinates.
- **Today's Location:** the location for each day. Entries can be scheduled ahead of time.
- **Products** (with photos) and **Featured** products for the homepage.

No phone number, address, hours, prices or testimonials are invented anywhere. Where data is missing, the site shows neutral fallback text.

## How things work

| Feature | Where |
| --- | --- |
| WhatsApp links (one place, number read from settings) | `src/lib/whatsapp.ts` |
| Today's location card (admin-entered only, no GPS; the "open now" hint is computed in the browser in IST) | `src/components/site/TodayLocationCard.tsx` |
| Per-product Open Graph and Twitter tags, canonical URLs | `src/lib/seo.ts`, `src/app/(site)/product/[slug]/page.tsx` |
| JSON-LD: ClothingStore, Product, BreadcrumbList, Service, WebSite | `src/lib/seo.ts` |
| Local-intent category landing copy (owner can override per category) | `src/lib/content.ts` |
| Sitemap, robots, manifest | `src/app/sitemap.ts`, `robots.ts`, `manifest.ts` |
| Instagram (official API → curated posts → "Follow us" fallback) | `src/lib/instagram.ts` |
| Admin auth (proxy session refresh, then role check in the layout and in every action, then database RLS) | `src/proxy.ts`, `src/lib/auth.ts`, migration |
| Image uploads (magic-byte check, 8 MB cap, re-encoded to WebP ≤ 2000px, EXIF/GPS stripped) | `src/lib/upload.ts` |

**Social share images.** Each product uses its own uploaded OG image if one is set, otherwise its main photo. Photos are served through the Next image optimiser at 1200px so WhatsApp and Facebook previews stay small. A product with no photo gets a generated branded card from `/api/og/product/[slug]`.

**Caching.** Public pages use ISR, regenerated every 5 minutes. Any save in the dashboard refreshes them immediately.

## Instagram

Under **/admin/instagram**, choose one of three modes:

- **Curated:** paste a post link and upload its image. This works with no Meta setup.
- **Instagram API:** requires an Instagram *Business* or *Creator* account and a Meta app using "Instagram API with Instagram Login". Paste a long-lived token. It is stored server-side and never sent to the browser. A daily Netlify scheduled function (`netlify/functions/instagram-refresh.mts`) calls `/api/cron/instagram-refresh` to keep the token from expiring. If the API fails, curated posts are shown instead.
- **Off:** shows only a "Follow us" button.

## Deploy on Netlify

The site works on Netlify as-is. Without Supabase it runs on the built-in catalogue.

1. Push this repo to GitHub, GitLab or Bitbucket.
2. In Netlify, choose **Add new site → Import an existing project** and pick the repo. The build settings come from `netlify.toml` (`npm run build`, Node 22), and Netlify's Next.js adapter is applied automatically.
3. Under **Site configuration → Environment variables**, add:
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`, e.g. `919876543210`, and `NEXT_PUBLIC_PHONE`. These are used until Supabase is connected.
   - Optional, once you have a database: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`, then run `supabase/seed-catalog.sql` so the database starts with the full catalogue.
   - Optional: `CRON_SECRET`, any long random string, for the daily Instagram token refresh.
   - `NEXT_PUBLIC_SITE_URL` only after you add a custom domain. Until then, Netlify's own URL is used for canonical links and share previews.
4. Deploy. Any change to a `NEXT_PUBLIC_*` variable needs a new deploy, because those values are built into the site.

After going live:
- Test a product link in the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and by sending it in WhatsApp. Link previews use small JPEGs from `/images/og` (bundled photos) or Netlify Image CDN (uploaded photos).
- Submit `https://<domain>/sitemap.xml` in Google Search Console.
- Keep the Google Business Profile's address and hours identical to the site.

**How it maps to Netlify:** pages are cached with ISR and refreshed when you save in `/admin`. Image optimisation goes through Netlify Image CDN, the session refresh in `src/proxy.ts` runs as Netlify middleware, and server actions run as Netlify Functions. Photo uploads are shrunk in the browser first to stay under Netlify's 6 MB request limit.

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run lint`
