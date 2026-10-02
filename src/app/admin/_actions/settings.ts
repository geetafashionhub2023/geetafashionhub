"use server";

import { requireStaffAction } from "@/lib/auth";
import { sessionClient } from "@/lib/supabase/server";
import { DAYS, fd, settingsSchema } from "@/lib/validation";
import { fromError, revalidateSite, type ActionState } from "./shared";

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireStaffAction("admin");
    const input = settingsSchema.parse({
      business_name: fd.str(formData, "business_name"),
      tagline: fd.str(formData, "tagline"),
      whatsapp_number: fd.str(formData, "whatsapp_number"),
      phone: fd.str(formData, "phone"),
      email: fd.str(formData, "email"),
      address_line: fd.str(formData, "address_line"),
      locality: fd.str(formData, "locality"),
      city: fd.str(formData, "city"),
      state: fd.str(formData, "state"),
      postal_code: fd.str(formData, "postal_code"),
      maps_url: fd.str(formData, "maps_url"),
      maps_embed_url: fd.str(formData, "maps_embed_url"),
      latitude: fd.num(formData, "latitude"),
      longitude: fd.num(formData, "longitude"),
      instagram_url: fd.str(formData, "instagram_url"),
      facebook_url: fd.str(formData, "facebook_url"),
      youtube_url: fd.str(formData, "youtube_url"),
      business_hours: DAYS.map((day) => ({
        day,
        open: fd.str(formData, `open_${day}`),
        close: fd.str(formData, `close_${day}`),
        closed: fd.bool(formData, `closed_${day}`),
      })).filter((h) => h.closed || h.open || h.close),
      hours_note: fd.str(formData, "hours_note"),
      service_areas: fd.list(formData, "service_areas"),
      about_text: fd.str(formData, "about_text"),
      hero_image_url: fd.str(formData, "hero_image_url"),
      hero_video_url: fd.str(formData, "hero_video_url"),
      default_whatsapp_message: fd.str(formData, "default_whatsapp_message"),
    });
    const supabase = await sessionClient();
    const { error } = await supabase.from("site_settings").update(input).eq("id", 1);
    if (error) throw error;
    revalidateSite();
    return { ok: true, message: "Business information saved." };
  } catch (error) {
    return fromError(error);
  }
}
