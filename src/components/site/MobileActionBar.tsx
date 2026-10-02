import { MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { telHref } from "@/lib/format";
import type { SiteSettings } from "@/lib/types";

/**
 * Fixed bottom bar on mobile: WhatsApp | Call | Directions.
 * Pages may render their own bar with `data-page-cta` (e.g. product pages); CSS then hides this one.
 */
export function MobileActionBar({
  settings,
  whatsappHref,
  directionsHref,
  primaryLabel = "WhatsApp",
  pageSpecific = false,
}: {
  settings: SiteSettings;
  whatsappHref: string;
  directionsHref: string;
  primaryLabel?: string;
  pageSpecific?: boolean;
}) {
  const tel = telHref(settings.phone);
  const cell = "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[0.7rem] font-semibold tracking-wide";
  return (
    <div
      {...(pageSpecific ? { "data-page-cta": "" } : { "data-site-cta": "" })}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgb(63_9_20/0.25)] backdrop-blur md:hidden"
    >
      <div className="flex h-16 items-stretch">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`${cell} flex-[1.4] bg-[#1f8f4e] text-white`}>
          <WhatsAppIcon className="h-5 w-5" />
          {primaryLabel}
        </a>
        <a href={tel ?? "/contact"} className={`${cell} text-maroon`}>
          <Phone className="h-5 w-5" />
          Call
        </a>
        <a href={directionsHref} target="_blank" rel="noopener noreferrer" className={`${cell} border-l border-line text-maroon`}>
          <MapPin className="h-5 w-5" />
          Directions
        </a>
      </div>
    </div>
  );
}

export function FloatingWhatsApp({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-6 bottom-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#1f8f4e] text-white shadow-lift transition-transform hover:scale-105 md:grid"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
