// Public values only. Secrets (service role key, Instagram token, cron secret)
// are read where they are used, in server-only modules.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when Supabase is configured. Without it the site runs on demo data and /admin is disabled. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Public site URL for canonical links, sitemap and Open Graph. Set NEXT_PUBLIC_SITE_URL to
 * your custom domain; otherwise Netlify's built-in URL (production) or DEPLOY_PRIME_URL
 * (deploy previews) is used.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.CONTEXT && process.env.CONTEXT !== "production" ? process.env.DEPLOY_PRIME_URL : process.env.URL) ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const STORE_TIMEZONE = "Asia/Kolkata";
