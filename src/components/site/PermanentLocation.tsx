import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { MapEmbed } from "@/components/site/MapEmbed";
import { BusinessHoursList } from "@/components/site/BusinessHours";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { fullAddress, telHref } from "@/lib/format";
import { messages } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/types";

export function PermanentLocation({ settings, headingLevel = "h3" }: { settings: SiteSettings; headingLevel?: "h2" | "h3" }) {
  const address = fullAddress(settings);
  const tel = telHref(settings.phone);
  const H = headingLevel;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
      <div className="reveal rounded-[1.5rem] bg-ivory p-7 shadow-soft ring-1 ring-line sm:p-9">
        <p className="eyebrow">Permanent Store Location</p>
        <H className="mt-3 text-3xl font-medium text-maroon-deep">{settings.business_name}</H>
        <address className="mt-6 space-y-4 not-italic">
          <p className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span className="text-ink">{address ?? "Our boutique is on Google Maps. Tap Get Directions for the route."}</span>
          </p>
          {tel && (
            <p className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><a href={tel} className="hover:text-maroon">{settings.phone}</a></p>
          )}
          {settings.email && (
            <p className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><a href={`mailto:${settings.email}`} className="hover:text-maroon">{settings.email}</a></p>
          )}
        </address>
        <div className="gold-rule my-7" />
        <p className="eyebrow mb-3">Store Hours</p>
        <div className="text-sm"><BusinessHoursList settings={settings} /></div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={settings.maps_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <Navigation className="h-4 w-4" /> Get Directions
          </a>
          <WhatsAppButton settings={settings} message={messages.visit(settings)} variant="outline">
            WhatsApp Us
          </WhatsAppButton>
        </div>
      </div>
      <MapEmbed settings={settings} className="reveal min-h-[340px]" />
    </div>
  );
}
