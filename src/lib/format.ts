import { STORE_TIMEZONE } from "@/lib/env";
import type { Availability, BusinessHour, Product, SiteSettings } from "@/lib/types";

/** Today's date in the store's timezone as YYYY-MM-DD. */
export function todayInStore(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: STORE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function formatDate(date: string): string {
  // Parse as a calendar date (no timezone shift).
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** "18:30" | "18:30:00" → "6:30 PM" */
export function formatTime(time: string | null | undefined): string | null {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return null;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m || 0).padStart(2, "0")} ${period}`;
}

export function formatTimeRange(open: string | null, close: string | null): string | null {
  const o = formatTime(open);
  const c = formatTime(close);
  if (o && c) return `${o} – ${c}`;
  return o ?? c;
}

export function formatPrice(price: number | null): string {
  if (price == null) return "Contact for Price";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

export const availabilityLabel: Record<Availability, string> = {
  in_stock: "Available",
  made_to_order: "Made to Order",
  out_of_stock: "Currently Unavailable",
};

export function fullAddress(s: SiteSettings): string | null {
  const parts = [s.address_line, s.locality, s.city, s.state, s.postal_code].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

export function telHref(phone: string | null): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : null;
}

export function hasHours(hours: BusinessHour[]): boolean {
  return hours.some((h) => h.closed || (h.open && h.close));
}

export function productMainImage(p: Pick<Product, "images">): string | null {
  return p.images[0] ?? null;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}
