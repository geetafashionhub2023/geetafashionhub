"use server";

import { requireStaffAction } from "@/lib/auth";
import { sessionClient } from "@/lib/supabase/server";
import { dailyLocationSchema, fd } from "@/lib/validation";
import { fromError, revalidateSite, type ActionState } from "./shared";

/** Create or update the location for a given date (one entry per date). */
export async function saveDailyLocation(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireStaffAction();
    const input = dailyLocationSchema.parse({
      date: fd.str(formData, "date"),
      location_name: fd.str(formData, "location_name"),
      address: fd.str(formData, "address"),
      maps_url: fd.str(formData, "maps_url"),
      open_time: fd.str(formData, "open_time"),
      close_time: fd.str(formData, "close_time"),
      is_open: fd.str(formData, "is_open") !== "false",
      announcement: fd.str(formData, "announcement"),
    });
    const supabase = await sessionClient();
    const { error } = await supabase.from("daily_locations").upsert(input, { onConflict: "date" });
    if (error) throw error;
    revalidateSite();
    return { ok: true, message: `Location for ${input.date} saved — it's live on the website.` };
  } catch (error) {
    return fromError(error);
  }
}

export async function deleteDailyLocation(formData: FormData) {
  await requireStaffAction();
  const id = fd.str(formData, "id");
  if (!id) return;
  const supabase = await sessionClient();
  const { error } = await supabase.from("daily_locations").delete().eq("id", id);
  if (error) throw error;
  revalidateSite();
}
