import "server-only";
import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";
import { defaultSettings, demoCategories, demoProducts, demoTodayLocation } from "@/lib/demo-data";
import { todayInStore } from "@/lib/format";
import type { Category, DailyLocation, Product, SiteSettings, Testimonial } from "@/lib/types";

const PRODUCT_SELECT = "*, category:categories(id, name, slug)";

function logError(scope: string, error: unknown) {
  console.error(`[data:${scope}]`, error);
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const db = publicClient();
  if (!db) return defaultSettings;
  const { data, error } = await db.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) logError("settings", error);
  const settings = { ...defaultSettings, ...(data ?? {}) } as SiteSettings;
  // Contact numbers fall back to the defaults until they are filled in on the dashboard.
  settings.whatsapp_number ||= defaultSettings.whatsapp_number;
  settings.phone ||= defaultSettings.phone;
  return settings;
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const db = publicClient();
  if (!db) return demoCategories;
  const { data, error } = await db
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .order("name");
  if (error) logError("categories", error);
  return (data ?? []) as Category[];
});

export const getCategory = cache(async (slug: string): Promise<Category | null> => {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
});

export const getProducts = cache(async (): Promise<Product[]> => {
  const db = publicClient();
  if (!db) return demoProducts;
  const { data, error } = await db
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });
  if (error) logError("products", error);
  return (data ?? []) as Product[];
});

export const getProductsByCategory = cache(async (categoryId: string): Promise<Product[]> => {
  const products = await getProducts();
  return products.filter((p) => p.category_id === categoryId);
});

export const getFeaturedProducts = cache(async (limit = 8): Promise<Product[]> => {
  const products = await getProducts();
  return products
    .filter((p) => p.is_featured)
    .sort((a, b) => a.featured_order - b.featured_order)
    .slice(0, limit);
});

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const db = publicClient();
  if (!db) return demoProducts.find((p) => p.slug === slug) ?? null;
  const { data, error } = await db
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();
  if (error) logError("product", error);
  return (data as Product) ?? null;
});

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getProducts();
  const same = products.filter((p) => p.id !== product.id && p.category_id === product.category_id);
  const others = products.filter((p) => p.id !== product.id && p.category_id !== product.category_id);
  return [...same, ...others].slice(0, limit);
}

/** The admin-entered location for today's date (store timezone). Never derived from GPS. */
export const getTodayLocation = cache(async (): Promise<DailyLocation | null> => {
  const db = publicClient();
  if (!db) return demoTodayLocation();
  const { data, error } = await db
    .from("daily_locations")
    .select("*")
    .eq("date", todayInStore())
    .maybeSingle();
  if (error) logError("today", error);
  return (data as DailyLocation) ?? null;
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const db = publicClient();
  if (!db) return [];
  const { data, error } = await db
    .from("testimonials")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order")
    .limit(9);
  if (error) logError("testimonials", error);
  return (data ?? []) as Testimonial[];
});
