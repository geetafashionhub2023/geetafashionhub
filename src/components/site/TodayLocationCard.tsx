import { CalendarDays, Clock, MapPin, Navigation, Store } from "lucide-react";
import { OpenNowBadge } from "@/components/site/OpenNowBadge";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { formatDate, formatTimeRange, todayInStore } from "@/lib/format";
import { messages } from "@/lib/whatsapp";
import type { DailyLocation, SiteSettings } from "@/lib/types";

export function directionsForToday(today: DailyLocation | null, settings: SiteSettings): string {
  if (today?.is_open) {
    if (today.maps_url) return today.maps_url;
    const q = [today.location_name, today.address].filter(Boolean).join(", ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  }
  return settings.maps_url;
}

/** "Today at Geeta Fashion Hub" — driven entirely by the admin-entered daily location. */
export function TodayLocationCard({ today, settings }: { today: DailyLocation | null; settings: SiteSettings }) {
  const dateLabel = formatDate(today?.date ?? todayInStore());
  const hours = today ? formatTimeRange(today.open_time, today.close_time) : null;

  return (
    <div className="bg-palace relative overflow-hidden rounded-[2rem] p-1.5 text-ivory shadow-lift ring-1 ring-gold-soft/40">
      <div className="relative rounded-[1.6rem] border border-gold-soft/35 px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow !text-gold-soft">Today at {settings.business_name}</p>
          {today && (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${today.is_open ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-300/40" : "bg-ivory/10 text-ivory/80 ring-1 ring-ivory/30"}`}>
              {today.is_open ? "Open Today" : "Closed Today"}
            </span>
          )}
        </div>

        <h2 className="mt-4 text-4xl font-medium sm:text-5xl">Find Us <em className="text-gold-foil">Today</em></h2>
        <p className="mt-2 flex items-center gap-2 text-sm text-ivory/70">
          <CalendarDays className="h-4 w-4 text-gold-soft" /> {dateLabel}
        </p>

        {today ? (
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold-soft" />
              <div>
                <p className="text-xs tracking-widest text-ivory/60 uppercase">{today.is_open ? "Today we are at" : "Usual spot"}</p>
                <p className="font-display mt-1 text-[1.75rem] leading-tight text-champagne">{today.location_name}</p>
                {today.address && <p className="mt-1 text-sm text-ivory/75">{today.address}</p>}
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-gold-soft" />
              <div>
                <p className="text-xs tracking-widest text-ivory/60 uppercase">Today&apos;s hours</p>
                <p className="font-display mt-1 text-[1.75rem] leading-tight text-champagne">
                  {today.is_open ? (hours ?? "Timings on WhatsApp") : "Closed today"}
                </p>
                {today.is_open && (
                  <div className="mt-1.5"><OpenNowBadge open={today.open_time} close={today.close_time} /></div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-7 flex gap-3">
            <Store className="mt-1 h-5 w-5 shrink-0 text-gold-soft" />
            <p className="max-w-lg text-ivory/80">
              Today&apos;s location hasn&apos;t been posted yet. You can always visit our permanent store, or message us on
              WhatsApp to ask where we are today.
            </p>
          </div>
        )}

        {today?.announcement && (
          <p className="mt-6 rounded-2xl bg-ivory/10 px-5 py-4 text-sm leading-relaxed text-ivory/90 ring-1 ring-gold-soft/25">
            {today.announcement}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={directionsForToday(today, settings)} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
            <Navigation className="h-4 w-4" />
            {today?.is_open ? "Get Directions" : "Directions to Our Store"}
          </a>
          <WhatsAppButton settings={settings} message={messages.visit(settings)} variant="ghost-light">
            Ask on WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
