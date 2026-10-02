"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/admin/_actions/settings";
import { Card, Field, FormMessage, SubmitButton, inputCls } from "@/components/admin/form";
import { SingleImageField } from "@/components/admin/ImageFields";
import type { SiteSettings } from "@/lib/types";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const hhmm = (t: string | null | undefined) => (t ? t.slice(0, 5) : "");

export function SettingsForm({ settings: s }: { settings: SiteSettings }) {
  const [state, action] = useActionState(saveSettings, null);
  const hours = (day: string) => s.business_hours.find((h) => h.day === day);
  const v = (x: string | number | null | undefined) => (x == null ? "" : String(x));

  return (
    <form action={action} className="space-y-6">
      <Card title="Business & contact" description="Used across the website, in WhatsApp links and in Google's business information.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business name" name="business_name" state={state}>
            <input name="business_name" defaultValue={s.business_name} required className={inputCls} />
          </Field>
          <Field label="Tagline" name="tagline" state={state}>
            <input name="tagline" defaultValue={v(s.tagline)} className={inputCls} />
          </Field>
          <Field label="WhatsApp number" name="whatsapp_number" state={state} hint="With country code, e.g. 91 98XXXXXXXX. All WhatsApp buttons use this.">
            <input name="whatsapp_number" inputMode="tel" defaultValue={v(s.whatsapp_number)} className={inputCls} />
          </Field>
          <Field label="Phone number" name="phone" state={state} hint="Used for the Call button.">
            <input name="phone" inputMode="tel" defaultValue={v(s.phone)} placeholder="+91 …" className={inputCls} />
          </Field>
          <Field label="Email" name="email" state={state}>
            <input name="email" type="email" defaultValue={v(s.email)} className={inputCls} />
          </Field>
          <Field label="Default WhatsApp message" name="default_whatsapp_message" state={state} hint="Pre-filled text for general “Chat with us” buttons.">
            <input name="default_whatsapp_message" defaultValue={v(s.default_whatsapp_message)} className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card title="Permanent store location" description="Enter the exact address exactly as it appears on Google Maps — keep it identical everywhere for local SEO.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Street address / shop no." name="address_line" state={state} className="sm:col-span-2">
            <input name="address_line" defaultValue={v(s.address_line)} className={inputCls} />
          </Field>
          <Field label="Area / locality" name="locality" state={state}>
            <input name="locality" defaultValue={v(s.locality)} className={inputCls} />
          </Field>
          <Field label="City" name="city" state={state}>
            <input name="city" defaultValue={v(s.city)} className={inputCls} />
          </Field>
          <Field label="State" name="state" state={state}>
            <input name="state" defaultValue={v(s.state)} className={inputCls} />
          </Field>
          <Field label="PIN code" name="postal_code" state={state}>
            <input name="postal_code" inputMode="numeric" defaultValue={v(s.postal_code)} className={inputCls} />
          </Field>
          <Field label="Google Maps link" name="maps_url" state={state} className="sm:col-span-2">
            <input name="maps_url" type="url" defaultValue={s.maps_url} required className={inputCls} />
          </Field>
          <Field label="Google Maps embed URL (optional)" name="maps_embed_url" state={state} className="sm:col-span-2"
            hint="Google Maps → Share → Embed a map → copy only the src=&quot;…&quot; value. Shows an interactive map on the website.">
            <input name="maps_embed_url" defaultValue={v(s.maps_embed_url)} placeholder="https://www.google.com/maps/embed?pb=…" className={inputCls} />
          </Field>
          <Field label="Latitude (optional)" name="latitude" state={state} hint="Right-click the shop pin in Google Maps to copy coordinates.">
            <input name="latitude" inputMode="decimal" defaultValue={v(s.latitude)} className={inputCls} />
          </Field>
          <Field label="Longitude (optional)" name="longitude" state={state}>
            <input name="longitude" inputMode="decimal" defaultValue={v(s.longitude)} className={inputCls} />
          </Field>
          <Field label="Nearby areas you serve" name="service_areas" state={state} className="sm:col-span-2" hint="Comma separated neighbourhoods — shown on the Visit Us page.">
            <input name="service_areas" defaultValue={s.service_areas.join(", ")} className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card title="Business hours" description="Leave a day empty if you don't want to show it. Tick Closed for weekly holidays.">
        <div className="space-y-2">
          {DAYS.map((day) => {
            const h = hours(day);
            return (
              <div key={day} className="grid grid-cols-[90px_1fr_1fr_auto] items-center gap-2 text-sm sm:grid-cols-[120px_160px_160px_auto]">
                <span className="font-semibold">{day.slice(0, 3)}<span className="hidden sm:inline">{day.slice(3)}</span></span>
                <input type="time" name={`open_${day}`} defaultValue={hhmm(h?.open)} aria-label={`${day} opening time`} className={inputCls} />
                <input type="time" name={`close_${day}`} defaultValue={hhmm(h?.close)} aria-label={`${day} closing time`} className={inputCls} />
                <label className="flex items-center gap-1.5 text-xs"><input type="checkbox" name={`closed_${day}`} defaultChecked={h?.closed} className="accent-maroon" /> Closed</label>
              </div>
            );
          })}
        </div>
        <Field label="Hours note (optional)" name="hours_note" state={state} className="mt-4" hint="e.g. Timings may vary on festivals — check today's location.">
          <input name="hours_note" defaultValue={v(s.hours_note)} className={inputCls} />
        </Field>
      </Card>

      <Card title="Social media">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Instagram URL" name="instagram_url" state={state}>
            <input name="instagram_url" type="url" defaultValue={s.instagram_url} required className={inputCls} />
          </Field>
          <Field label="Facebook URL" name="facebook_url" state={state}>
            <input name="facebook_url" type="url" defaultValue={v(s.facebook_url)} className={inputCls} />
          </Field>
          <Field label="YouTube URL" name="youtube_url" state={state}>
            <input name="youtube_url" type="url" defaultValue={v(s.youtube_url)} className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card title="Homepage & About">
        <div className="grid gap-4">
          <Field label="Hero image" name="hero_image_url" state={state} hint="A tall, high-quality photo for the top of the homepage. Without one, the logo illustration is shown.">
            <SingleImageField name="hero_image_url" initial={s.hero_image_url} folder="site" aspect="aspect-[4/5]" />
          </Field>
          <Field label="Hero background video URL (optional)" name="hero_video_url" state={state} hint="A short, muted MP4 (under ~5 MB) hosted over https.">
            <input name="hero_video_url" type="url" defaultValue={v(s.hero_video_url)} className={inputCls} />
          </Field>
          <Field label="About us text" name="about_text" state={state} hint="Your story, in your words. Leave a blank line between paragraphs. If empty, a general description is shown.">
            <textarea name="about_text" defaultValue={v(s.about_text)} rows={6} className={inputCls} />
          </Field>
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-4 flex flex-col gap-3 border-t border-line bg-cream/95 px-4 py-4 backdrop-blur sm:mx-0 sm:flex-row sm:items-center sm:rounded-2xl sm:border">
        <SubmitButton>Save business information</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
