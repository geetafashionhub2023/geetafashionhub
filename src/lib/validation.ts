import { z } from "zod";
import { SUPABASE_URL } from "@/lib/env";

// ---------------------------------------------------------------------------
// FormData helpers
// ---------------------------------------------------------------------------

export const fd = {
  str: (f: FormData, k: string) => {
    const v = f.get(k);
    if (typeof v !== "string") return null;
    const t = v.trim();
    return t === "" ? null : t;
  },
  bool: (f: FormData, k: string) => f.get(k) === "on" || f.get(k) === "true",
  list: (f: FormData, k: string) =>
    (fd.str(f, k) ?? "")
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean),
  all: (f: FormData, k: string) =>
    f
      .getAll(k)
      .filter((v): v is string => typeof v === "string")
      .map((v) => v.trim())
      .filter(Boolean),
  num: (f: FormData, k: string) => {
    const v = fd.str(f, k);
    if (v == null) return null;
    const n = Number(v.replace(/[,₹\s]/g, ""));
    return Number.isFinite(n) ? n : NaN;
  },
};

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

const text = (max: number) => z.string().trim().max(max);
const optText = (max: number) => text(max).nullable();

const httpsUrl = z
  .url({ message: "Enter a full link starting with https://" })
  .refine((u) => u.startsWith("https://"), "Link must start with https://");

/** Images must come from our own Supabase Storage bucket (uploaded via the dashboard). */
const storageImage = z
  .string()
  .refine(
    (u) =>
      /^\/images\/lookbook\/[a-z0-9-]+\.jpg$/.test(u) ||
      (Boolean(SUPABASE_URL) && u.startsWith(`${SUPABASE_URL}/storage/v1/object/public/media/`)),
    "Images must be uploaded through the dashboard",
  );

const slug = z
  .string()
  .trim()
  .min(2, "Slug is too short")
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, "Use HH:MM")
  .nullable();

const shortList = z.array(text(30)).max(30);

// ---------------------------------------------------------------------------
// Entities
// ---------------------------------------------------------------------------

export const productSchema = z.object({
  name: text(120).min(2, "Name is required"),
  slug,
  category_id: z.uuid().nullable(),
  subcategory: optText(60),
  short_description: optText(300),
  description: optText(5000),
  images: z.array(storageImage).max(12, "Up to 12 images"),
  image_alt: optText(160),
  sizes: shortList,
  colors: shortList,
  fabric: optText(80),
  price: z.number({ message: "Enter a number" }).min(0).max(10_000_000).nullable(),
  is_customizable: z.boolean(),
  customization_notes: optText(1000),
  stitching_available: z.boolean(),
  availability: z.enum(["in_stock", "made_to_order", "out_of_stock"]),
  is_featured: z.boolean(),
  featured_order: z.number().int().min(0).max(999),
  is_visible: z.boolean(),
  seo_title: optText(70),
  seo_description: optText(170),
  og_image_url: storageImage.nullable(),
});

export const categorySchema = z.object({
  name: text(60).min(2, "Name is required"),
  slug,
  description: optText(300),
  intro: optText(2000),
  image_url: storageImage.nullable(),
  is_active: z.boolean(),
  seo_title: optText(70),
  seo_description: optText(170),
});

export const dailyLocationSchema = z
  .object({
    date: z.iso.date({ message: "Pick a date" }),
    location_name: text(120).min(2, "Location name is required"),
    address: optText(300),
    maps_url: httpsUrl.nullable(),
    open_time: time,
    close_time: time,
    is_open: z.boolean(),
    announcement: optText(500),
  })
  .refine((v) => !v.is_open || !v.open_time || !v.close_time || v.open_time < v.close_time, {
    message: "Closing time must be after opening time",
    path: ["close_time"],
  });

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export { DAYS };

export const settingsSchema = z.object({
  business_name: text(80).min(2),
  tagline: optText(140),
  whatsapp_number: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 15, "Enter the number with country code, e.g. 91 98xxxxxxxx")
    .nullable(),
  phone: optText(30),
  email: z.email({ message: "Enter a valid email" }).nullable(),
  address_line: optText(200),
  locality: optText(100),
  city: optText(80),
  state: optText(80),
  postal_code: z
    .string()
    .regex(/^\d{6}$/, "Indian PIN codes have 6 digits")
    .nullable(),
  maps_url: httpsUrl,
  maps_embed_url: z
    .string()
    .refine((u) => u.startsWith("https://www.google.com/maps/embed"), "Paste the src from Google Maps → Share → Embed a map")
    .nullable(),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  instagram_url: httpsUrl.refine((u) => /^https:\/\/(www\.)?instagram\.com\//.test(u), "Must be an instagram.com link"),
  facebook_url: httpsUrl.nullable(),
  youtube_url: httpsUrl.nullable(),
  business_hours: z.array(
    z.object({ day: z.enum(DAYS), open: time, close: time, closed: z.boolean() }),
  ),
  hours_note: optText(200),
  service_areas: z.array(text(60)).max(30),
  about_text: optText(5000),
  hero_image_url: storageImage.nullable(),
  hero_video_url: httpsUrl.nullable(),
  default_whatsapp_message: optText(300),
});

export const instagramSettingsSchema = z.object({
  instagram_mode: z.enum(["api", "manual", "off"]),
  instagram_post_limit: z.number().int().min(3).max(24),
});

export const instagramPostSchema = z.object({
  permalink: httpsUrl.refine((u) => /^https:\/\/(www\.)?instagram\.com\//.test(u), "Must be an instagram.com post link"),
  image_url: storageImage,
  caption: optText(300),
  is_video: z.boolean(),
});

export const testimonialSchema = z.object({
  name: text(80).min(2, "Name is required"),
  quote: text(600).min(5, "Quote is required"),
  context: optText(80),
});

export type FieldErrors = Record<string, string[] | undefined>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  return z.flattenError(error).fieldErrors as FieldErrors;
}
