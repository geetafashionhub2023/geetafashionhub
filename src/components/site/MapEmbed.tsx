import { MapPin } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

/**
 * Shows the owner-supplied Google Maps embed (Share → Embed a map → src) if set.
 * Short maps.app.goo.gl links can't be embedded, so otherwise show a styled card.
 */
export function MapEmbed({ settings, className = "" }: { settings: SiteSettings; className?: string }) {
  const embed = settings.maps_embed_url?.startsWith("https://www.google.com/maps/embed") ? settings.maps_embed_url : null;
  if (embed) {
    return (
      <div className={`overflow-hidden rounded-[1.5rem] ring-1 ring-line ${className}`}>
        <iframe
          src={embed}
          title={`Map showing ${settings.business_name}`}
          className="h-full min-h-[320px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <a
      href={settings.maps_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative grid min-h-[320px] place-items-center overflow-hidden rounded-[1.5rem] bg-paper ring-1 ring-line ${className}`}
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden>
        <defs>
          <pattern id="streets" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
            <path d="M0 40h80M40 0v80" stroke="#d6b97e" strokeWidth="6" />
            <path d="M0 40h80M40 0v80" stroke="#fbf7f0" strokeWidth="3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#streets)" />
      </svg>
      <div className="relative text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-maroon text-ivory shadow-lift transition-transform group-hover:-translate-y-1">
          <MapPin className="h-6 w-6" />
        </span>
        <p className="font-display mt-4 text-2xl text-maroon-deep">{settings.business_name}</p>
        <p className="mt-1 text-sm font-semibold text-gold underline underline-offset-4">Open in Google Maps</p>
      </div>
    </a>
  );
}
