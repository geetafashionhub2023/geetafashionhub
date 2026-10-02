import { SITE_URL } from "@/lib/env";
import type { SiteSettings } from "@/lib/types";

/**
 * All WhatsApp links are built here from the number stored in site settings —
 * never hard-code the number in components.
 */
export function whatsappHref(settings: Pick<SiteSettings, "whatsapp_number">, message: string): string {
  const digits = (settings.whatsapp_number ?? "").replace(/\D/g, "");
  const text = encodeURIComponent(message);
  // Without a configured number, wa.me opens WhatsApp's contact picker with the text pre-filled.
  return digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
}

export const messages = {
  general: (s: Pick<SiteSettings, "business_name" | "default_whatsapp_message">) =>
    s.default_whatsapp_message?.trim() ||
    `Hi ${s.business_name}, I'd like to know more about your collection and services.`,

  product: (s: Pick<SiteSettings, "business_name">, productName: string, slug: string) =>
    `Hi ${s.business_name}, I'm interested in the ${productName}. Could you please share the price, availability and customization options?\n\n${SITE_URL}/product/${slug}`,

  stitching: () => "Hi, I'm interested in custom stitching. I would like to discuss my design and requirements.",

  stitchingService: (service: string) =>
    `Hi, I'm interested in ${service.toLowerCase()}. I would like to discuss my design and requirements.`,

  visit: (s: Pick<SiteSettings, "business_name">) =>
    `Hi ${s.business_name}, I'd like to visit the store. Where will you be today and what are the timings?`,

  category: (s: Pick<SiteSettings, "business_name">, category: string) =>
    `Hi ${s.business_name}, I'm looking for ${category.toLowerCase()}. Could you share what's available?`,
};
