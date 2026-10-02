"use client";

import { useActionState, useState } from "react";
import { saveDailyLocation } from "@/app/admin/_actions/location";
import { Field, FormMessage, SubmitButton, inputCls } from "@/components/admin/form";
import type { DailyLocation } from "@/lib/types";

const hhmm = (t: string | null | undefined) => (t ? t.slice(0, 5) : "");

export function LocationForm({ entries, today, initialDate }: { entries: DailyLocation[]; today: string; initialDate: string }) {
  const [state, action] = useActionState(saveDailyLocation, null);
  const [date, setDate] = useState(initialDate);
  const [templateId, setTemplateId] = useState("");

  const existing = entries.find((e) => e.date === date);
  const template = entries.find((e) => e.id === templateId);
  const src = existing ?? template;
  // Unique past locations, for "use a previous location"
  const previous = Array.from(new Map(entries.filter((e) => e.is_open).map((e) => [e.location_name, e])).values());

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date" name="date" state={state} hint={date === today ? "Today" : existing ? "Editing the saved entry for this date" : "Plan ahead — it goes live on this date"}>
          <input type="date" name="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} required className={inputCls} />
        </Field>
        {!existing && previous.length > 0 && (
          <Field label="Start from a previous location (optional)">
            <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className={inputCls}>
              <option value="">— New location —</option>
              {previous.map((p) => <option key={p.id} value={p.id}>{p.location_name}</option>)}
            </select>
          </Field>
        )}
      </div>

      {/* Remount fields when the date/template changes so defaults refresh */}
      <div key={`${date}-${src?.id ?? "new"}`} className="space-y-5">
        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold text-ink">Status</legend>
          <div className="flex gap-3">
            {[
              { v: "true", l: "Open" },
              { v: "false", l: "Closed" },
            ].map((o) => (
              <label key={o.v} className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-line bg-white p-3 text-sm has-[:checked]:border-maroon has-[:checked]:bg-maroon/5">
                <input type="radio" name="is_open" value={o.v} defaultChecked={String(src?.is_open ?? true) === o.v} className="accent-maroon" />
                {o.l}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Location name" name="location_name" state={state} hint='e.g. "Maninagar Market"'>
          <input name="location_name" defaultValue={src?.location_name ?? ""} required maxLength={120} className={inputCls} />
        </Field>
        <Field label="Address / area" name="address" state={state}>
          <input name="address" defaultValue={src?.address ?? ""} maxLength={300} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Opening time" name="open_time" state={state}>
            <input type="time" name="open_time" defaultValue={hhmm(src?.open_time)} className={inputCls} />
          </Field>
          <Field label="Closing time" name="close_time" state={state}>
            <input type="time" name="close_time" defaultValue={hhmm(src?.close_time)} className={inputCls} />
          </Field>
        </div>
        <Field label="Google Maps link" name="maps_url" state={state} hint="Open the place in Google Maps → Share → Copy link. If empty, we search the name and address.">
          <input type="url" name="maps_url" defaultValue={src?.maps_url ?? ""} placeholder="https://maps.app.goo.gl/…" className={inputCls} />
        </Field>
        <Field label="Announcement (optional)" name="announcement" state={state} hint="Shown on the homepage card, e.g. new Navratri stock arrived.">
          <textarea name="announcement" defaultValue={existing?.announcement ?? ""} rows={2} maxLength={500} className={inputCls} />
        </Field>
      </div>

      <FormMessage state={state} />
      <SubmitButton className="w-full sm:w-auto">{existing ? "Update location" : "Publish location"}</SubmitButton>
    </form>
  );
}
