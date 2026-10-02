"use client";

import { useEffect, useState } from "react";

const TZ = "Asia/Kolkata";

function minutesNowInStore() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value);
  const m = Number(parts.find((p) => p.type === "minute")?.value);
  return h * 60 + m;
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};

/**
 * Live "open now / opens at / closed for the day" hint, computed in the browser so
 * statically cached pages stay accurate. Renders nothing until mounted.
 */
export function OpenNowBadge({ open, close }: { open: string | null; close: string | null }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(minutesNowInStore());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  if (now == null || !open || !close) return null;

  const o = toMinutes(open);
  const c = toMinutes(close);
  let label: string;
  let live = false;
  if (now < o) label = "Opening later today";
  else if (now >= c) label = "Closed for the day";
  else {
    live = true;
    label = c - now <= 60 ? "Open now · closing soon" : "Open now";
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-ivory/90">
      <span className={`h-2 w-2 rounded-full ${live ? "animate-pulse bg-emerald-400" : "bg-gold-soft"}`} />
      {label}
    </span>
  );
}
