import "server-only";
import { sessionClient } from "@/lib/supabase/server";
import { defaultSettings } from "@/lib/demo-data";
import type { Category, DailyLocation, Product, SiteSettings, Testimonial } from "@/lib/types";

// Admin reads go through the signed-in session so hidden/disabled rows are visible to staff (RLS).

export async function adminSettings(): Promise<SiteSettings> {
  const db = await sessionClient();
  const { data } = await db.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return { ...defaultSettings, ...(data ?? {}) } as SiteSettings;
}

export async function adminCategories(): Promise<Category[]> {
  const db = await sessionClient();
  const { data } = await db.from("categories").select("*").order("sort_order").order("name");
  return (data ?? []) as Category[];
}

export async function adminProducts(): Promise<Product[]> {
  const db = await sessionClient();
  const { data } = await db
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .order("updated_at", { ascending: false });
  return (data ?? []) as Product[];
}

export async function adminProduct(id: string): Promise<Product | null> {
  const db = await sessionClient();
  const { data } = await db.from("products").select("*").eq("id", id).maybeSingle();
  return (data as Product) ?? null;
}

export async function adminCategory(id: string): Promise<Category | null> {
  const db = await sessionClient();
  const { data } = await db.from("categories").select("*").eq("id", id).maybeSingle();
  return (data as Category) ?? null;
}

export async function adminLocations(fromDate: string): Promise<DailyLocation[]> {
  const db = await sessionClient();
  const { data } = await db.from("daily_locations").select("*").gte("date", fromDate).order("date").limit(60);
  return (data ?? []) as DailyLocation[];
}

export async function adminRecentLocations(beforeDate: string): Promise<DailyLocation[]> {
  const db = await sessionClient();
  const { data } = await db.from("daily_locations").select("*").lt("date", beforeDate).order("date", { ascending: false }).limit(10);
  return (data ?? []) as DailyLocation[];
}

export async function adminTestimonials(): Promise<Testimonial[]> {
  const db = await sessionClient();
  const { data } = await db.from("testimonials").select("*").order("sort_order").order("created_at", { ascending: false });
  return (data ?? []) as Testimonial[];
}

export async function adminInstagramPosts() {
  const db = await sessionClient();
  const { data } = await db.from("instagram_posts").select("*").order("sort_order").order("created_at", { ascending: false });
  return (data ?? []) as { id: string; permalink: string; image_url: string; caption: string | null; is_video: boolean; is_visible: boolean }[];
}
