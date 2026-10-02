import "server-only";
import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";
import { serviceClient } from "@/lib/supabase/service";
import { getSettings } from "@/lib/data";
import { demoLookbook } from "@/lib/demo-data";
import type { InstagramPost } from "@/lib/types";

/**
 * Instagram integration — authorised sources only, no scraping:
 *
 *  - "api":    Instagram API with Instagram Login (graph.instagram.com/me/media) using a
 *              long-lived token for the shop's own Business/Creator account. The token lives
 *              server-side only (DB row readable by the service role, or INSTAGRAM_ACCESS_TOKEN).
 *  - "manual": Posts curated in /admin (permalink + the shop's own uploaded image).
 *  - "off":    Section shows only the "Follow us" call to action.
 *
 * Any failure falls back to curated posts, then to an empty list (the UI then shows the
 * profile CTA), so Instagram outages never break the page.
 */

const GRAPH = "https://graph.instagram.com";

type GraphMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
};

export async function getInstagramToken(): Promise<string | null> {
  const db = serviceClient();
  if (db) {
    const { data } = await db.from("instagram_credentials").select("access_token").eq("id", 1).maybeSingle();
    if (data?.access_token) return data.access_token as string;
  }
  return process.env.INSTAGRAM_ACCESS_TOKEN || null;
}

async function fetchFromApi(limit: number): Promise<InstagramPost[] | null> {
  const token = await getInstagramToken();
  if (!token) return null;
  const url = new URL(`${GRAPH}/me/media`);
  url.searchParams.set("fields", "id,caption,media_type,media_url,thumbnail_url,permalink");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("access_token", token);
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600, tags: ["instagram"] },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error("[instagram] API responded", res.status);
      return null;
    }
    const json = (await res.json()) as { data?: GraphMedia[] };
    return (json.data ?? [])
      .map((m) => ({
        id: m.id,
        permalink: m.permalink,
        image_url: (m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url) ?? "",
        caption: m.caption ?? null,
        is_video: m.media_type === "VIDEO",
      }))
      .filter((p) => p.image_url);
  } catch (error) {
    console.error("[instagram] API request failed", error);
    return null;
  }
}

async function fetchCurated(limit: number): Promise<InstagramPost[]> {
  const db = publicClient();
  if (!db) return demoLookbook.slice(0, limit);
  const { data, error } = await db
    .from("instagram_posts")
    .select("id, permalink, image_url, caption, is_video")
    .eq("is_visible", true)
    .order("sort_order")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) console.error("[instagram] curated posts", error);
  return (data ?? []) as InstagramPost[];
}

export const getInstagramPosts = cache(async (): Promise<InstagramPost[]> => {
  const settings = await getSettings();
  const limit = settings.instagram_post_limit;
  if (settings.instagram_mode === "off") return [];
  if (settings.instagram_mode === "api") {
    const posts = await fetchFromApi(limit);
    if (posts && posts.length) return posts;
  }
  return fetchCurated(limit);
});

/** Long-lived tokens last 60 days; refreshing extends them. Called by the cron route. */
export async function refreshInstagramToken(): Promise<{ ok: boolean; message: string }> {
  const db = serviceClient();
  const token = await getInstagramToken();
  if (!db || !token) return { ok: false, message: "No token or service role configured" };
  const url = new URL(`${GRAPH}/refresh_access_token`);
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", token);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return { ok: false, message: `Refresh failed (${res.status})` };
  const json = (await res.json()) as { access_token: string; expires_in: number };
  await db.from("instagram_credentials").upsert({
    id: 1,
    access_token: json.access_token,
    expires_at: new Date(Date.now() + json.expires_in * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  });
  return { ok: true, message: "Token refreshed" };
}
