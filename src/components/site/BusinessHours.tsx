import { formatTimeRange, hasHours } from "@/lib/format";
import type { SiteSettings } from "@/lib/types";

export function BusinessHoursList({ settings, light = false }: { settings: SiteSettings; light?: boolean }) {
  if (!hasHours(settings.business_hours)) {
    return (
      <p className={light ? "text-ivory/70" : "text-muted"}>
        {settings.hours_note || "Opening hours will be updated soon — message us on WhatsApp for today's timings."}
      </p>
    );
  }
  return (
    <div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
        {settings.business_hours.map((h) => (
          <div key={h.day} className="contents">
            <dt className={light ? "text-ivory/70" : "text-muted"}>{h.day}</dt>
            <dd className="text-right tabular-nums">{h.closed ? "Closed" : formatTimeRange(h.open, h.close) ?? "—"}</dd>
          </div>
        ))}
      </dl>
      {settings.hours_note && <p className={`mt-3 text-xs ${light ? "text-ivory/60" : "text-muted"}`}>{settings.hours_note}</p>}
    </div>
  );
}
