"use server";

import { requireStaffAction } from "@/lib/auth";
import { sessionClient } from "@/lib/supabase/server";
import { fd, testimonialSchema } from "@/lib/validation";
import { fromError, revalidateSite, type ActionState } from "./shared";

export async function addTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireStaffAction();
    const input = testimonialSchema.parse({
      name: fd.str(formData, "name"),
      quote: fd.str(formData, "quote"),
      context: fd.str(formData, "context"),
    });
    const supabase = await sessionClient();
    const { error } = await supabase.from("testimonials").insert(input);
    if (error) throw error;
    revalidateSite();
    return { ok: true, message: "Testimonial added." };
  } catch (error) {
    return fromError(error);
  }
}

export async function toggleTestimonial(formData: FormData) {
  await requireStaffAction();
  const id = fd.str(formData, "id");
  if (!id) return;
  const supabase = await sessionClient();
  await supabase.from("testimonials").update({ is_visible: fd.bool(formData, "visible") }).eq("id", id);
  revalidateSite();
}

export async function deleteTestimonial(formData: FormData) {
  await requireStaffAction();
  const id = fd.str(formData, "id");
  if (!id) return;
  const supabase = await sessionClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidateSite();
}
