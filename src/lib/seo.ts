import type { Metadata } from "next";
import { SITE_URL } from "@/lib/env";
import { fullAddress, hasHours, productMainImage } from "@/lib/format";
import type { Product, SiteSettings } from "@/lib/types";

export const absoluteUrl = (path = "/") => (path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

/**
 * Social crawlers (WhatsApp especially) want small JPEGs. Bundled photos have pre-made
 * 1200px JPEG copies in /images/og. Uploaded photos (WebP in Supabase Storage) are
 * converted on the fly: Netlify Image CDN with an explicit JPEG format, or the Next.js
 * image optimiser elsewhere.
 */
export function socialImageUrl(src: string): string {
  if (src.startsWith("/api/")) return absoluteUrl(src);
  const bundled = src.match(/^\/images\/lookbook\/([a-z0-9-]+\.jpg)$/);
  if (bundled) return absoluteUrl(`/images/og/${bundled[1]}`);
  if (src.startsWith("/")) return absoluteUrl(src);
  if (process.env.NETLIFY) return `${SITE_URL}/.netlify/images?url=${encodeURIComponent(src)}&w=1200&fm=jpg&q=75`;
  return `${SITE_URL}/_next/image?url=${encodeURIComponent(src)}&w=1200&q=75`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function pageMetadata(settings: SiteSettings, input: PageMetaInput): Metadata {
  const image = input.image ? socialImageUrl(input.image) : absoluteUrl("/api/og/site");
  const alt = input.imageAlt ?? input.title;
  // Generated cards are exactly 1200×630; uploaded photos keep their own aspect ratio.
  const images = image.includes("/api/og/")
    ? [{ url: image, width: 1200, height: 630, alt }]
    : [{ url: image, width: 1200, alt }];
  // The <title> template adds the brand; social titles need it explicitly.
  const socialTitle = input.title.includes(settings.business_name)
    ? input.title
    : `${input.title} | ${settings.business_name}`;
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: absoluteUrl(input.path) },
    openGraph: {
      title: socialTitle,
      description: input.description,
      url: absoluteUrl(input.path),
      siteName: settings.business_name,
      locale: "en_IN",
      type: input.type ?? "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: input.description,
      images: [image],
    },
    robots: input.noIndex ? { index: false, follow: false } : undefined,
  };
}

/** OG image for a product: explicit OG image → main photo → generated branded card. */
export function productOgImage(p: Product): string {
  return p.og_image_url || productMainImage(p) || `/api/og/product/${p.slug}`;
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

const dayMap: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function localBusinessJsonLd(s: SiteSettings) {
  const sameAs = [s.instagram_url, s.facebook_url, s.youtube_url].filter(Boolean);
  const hasAddress = Boolean(fullAddress(s));
  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${SITE_URL}/#store`,
    name: s.business_name,
    url: SITE_URL,
    logo: absoluteUrl("/brand/logo.jpg"),
    image: absoluteUrl("/brand/logo.jpg"),
    description:
      "Traditional Indian fashion boutique offering blouses, chaniya choli, salwar kameez, bridal and kids' ethnic wear, with custom stitching and alterations.",
    hasMap: s.maps_url,
    sameAs,
    priceRange: "₹₹",
    makesOffer: ["Custom blouse stitching", "Bridal blouse stitching", "Alterations", "Custom designs"].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  };
  if (s.phone) json.telephone = s.phone;
  if (s.email) json.email = s.email;
  // Only publish an address that the owner has entered — never inferred.
  if (hasAddress) {
    json.address = {
      "@type": "PostalAddress",
      streetAddress: [s.address_line, s.locality].filter(Boolean).join(", ") || undefined,
      addressLocality: s.city ?? undefined,
      addressRegion: s.state ?? undefined,
      postalCode: s.postal_code ?? undefined,
      addressCountry: s.country,
    };
  }
  if (s.latitude != null && s.longitude != null) {
    json.geo = { "@type": "GeoCoordinates", latitude: s.latitude, longitude: s.longitude };
  }
  if (s.service_areas.length) {
    json.areaServed = s.service_areas.map((name) => ({ "@type": "Place", name }));
  }
  if (hasHours(s.business_hours)) {
    json.openingHoursSpecification = s.business_hours
      .filter((h) => !h.closed && h.open && h.close)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayMap[h.day.toLowerCase()] ?? h.day,
        opens: h.open,
        closes: h.close,
      }));
  }
  return json;
}

export function productJsonLd(p: Product, s: SiteSettings) {
  const images = p.images.length ? p.images : [absoluteUrl(`/api/og/product/${p.slug}`)];
  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.seo_description || p.short_description || p.description || p.name,
    image: images,
    url: absoluteUrl(`/product/${p.slug}`),
    sku: p.id,
    brand: { "@type": "Brand", name: s.business_name },
    category: p.category?.name,
  };
  if (p.colors.length) json.color = p.colors.join(", ");
  if (p.fabric) json.material = p.fabric;
  // Offers only when a real price is set; "Contact for Price" items carry no offer.
  if (p.price != null) {
    json.offers = {
      "@type": "Offer",
      price: p.price.toFixed(2),
      priceCurrency: "INR",
      url: absoluteUrl(`/product/${p.slug}`),
      availability:
        p.availability === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : p.availability === "made_to_order"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/InStoreOnly",
      seller: { "@id": `${SITE_URL}/#store` },
    };
  }
  return json;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function websiteJsonLd(s: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: s.business_name,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#store` },
    inLanguage: "en-IN",
  };
}
