"use server";

import { revalidateTag } from "next/cache";
import { requireStaffAction } from "@/lib/auth";
import { sessionClient } from "@/lib/supabase/server";
import { serviceClient } from "@/lib/supabase/service";
import { fd, instagramPostSchema, instagramSettingsSchema } from "@/lib/validation";
import { fromError, revalidateSite, type ActionState } from "./shared";

export async function saveInstagramSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireStaffAction("admin");
    const input = instagramSettingsSchema.parse({
      instagram_mode: fd.str(formData, "instagram_mode"),
      instagram_post_limit: fd.num(formData, "instagram_post_limit"),
    });
    const supabase = await sessionClient();
    const { error } = await supabase.from("site_settings").update(input).eq("id", 1);
    if (error) throw error;

    // Write-only token field: stored server-side with the service role, never sent back to the browser.
    const token = fd.str(formData, "access_token");
    if (token) {
      if (!/^[A-Za-z0-9_\-|.]{20,1024}$/.test(token)) return { ok: false, message: "That doesn't look like a valid access token." };
      const svc = serviceClient();
      if (!svc) return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY is not set on the server, so the token can't be stored." };
      const { error: tokenError } = await svc.from("instagram_credentials").upsert({
        id: 1,
        access_token: token,
        expires_at: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (tokenError) throw tokenError;
    }
    revalidateTag("instagram", "max");
    revalidateSite();
    return { ok: true, message: "Instagram settings saved." };
  } catch (error) {
    return fromError(error);
  }
}

export async function removeInstagramToken() {
  await requireStaffAction("admin");
  const svc = serviceClient();
  if (svc) await svc.from("instagram_credentials").delete().eq("id", 1);
  revalidateTag("instagram", "max");
  revalidateSite();
}

export async function addInstagramPost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireStaffAction();
    const input = instagramPostSchema.parse({
      permalink: fd.str(formData, "permalink"),
      image_url: fd.str(formData, "image_url"),
      caption: fd.str(formData, "caption"),
      is_video: fd.bool(formData, "is_video"),
    });
    const supabase = await sessionClient();
    const { error } = await supabase.from("instagram_posts").insert(input);
    if (error) throw error;
    revalidateSite();
    return { ok: true, message: "Post added." };
  } catch (error) {
    return fromError(error);
  }
}

export async function deleteInstagramPost(formData: FormData) {
  await requireStaffAction();
  const id = fd.str(formData, "id");
  if (!id) return;
  const supabase = await sessionClient();
  await supabase.from("instagram_posts").delete().eq("id", id);
  revalidateSite();
}
