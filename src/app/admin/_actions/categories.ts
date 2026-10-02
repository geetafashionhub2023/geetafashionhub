"use server";

import { redirect } from "next/navigation";
import { requireStaffAction } from "@/lib/auth";
import { sessionClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import { categorySchema, fd } from "@/lib/validation";
import { fromError, revalidateSite, type ActionState } from "./shared";

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let created = false;
  try {
    await requireStaffAction();
    const id = fd.str(formData, "id");
    const name = fd.str(formData, "name") ?? "";
    const input = categorySchema.parse({
      name,
      slug: fd.str(formData, "slug") ?? slugify(name),
      description: fd.str(formData, "description"),
      intro: fd.str(formData, "intro"),
      image_url: fd.str(formData, "image_url"),
      is_active: fd.bool(formData, "is_active"),
      seo_title: fd.str(formData, "seo_title"),
      seo_description: fd.str(formData, "seo_description"),
    });
    const supabase = await sessionClient();
    if (id) {
      const { error } = await supabase.from("categories").update(input).eq("id", id);
      if (error) throw error;
    } else {
      const { data: last } = await supabase.from("categories").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
      const { error } = await supabase.from("categories").insert({ ...input, sort_order: (last?.sort_order ?? 0) + 10 });
      if (error) throw error;
      created = true;
    }
    revalidateSite();
  } catch (error) {
    return fromError(error);
  }
  if (created) redirect("/admin/categories?created=1");
  return { ok: true, message: "Category saved." };
}

export async function deleteCategory(formData: FormData) {
  await requireStaffAction();
  const id = fd.str(formData, "id");
  if (!id) return;
  const supabase = await sessionClient();
  // Products keep existing; their category is cleared (ON DELETE SET NULL).
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  revalidateSite();
  redirect("/admin/categories?deleted=1");
}

export async function toggleCategory(formData: FormData) {
  await requireStaffAction();
  const id = fd.str(formData, "id");
  if (!id) return;
  const supabase = await sessionClient();
  const { error } = await supabase.from("categories").update({ is_active: fd.bool(formData, "active") }).eq("id", id);
  if (error) throw error;
  revalidateSite();
}

/** Move a category up or down by swapping sort_order with its neighbour. */
export async function moveCategory(formData: FormData) {
  await requireStaffAction();
  const id = fd.str(formData, "id");
  const dir = fd.str(formData, "dir");
  const supabase = await sessionClient();
  const { data: all, error } = await supabase.from("categories").select("id, sort_order").order("sort_order").order("name");
  if (error || !all) throw error;
  const i = all.findIndex((c) => c.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= all.length) return;
  // Normalise to spaced values, then swap the pair.
  const order = all.map((c, k) => ({ id: c.id, sort_order: (k + 1) * 10 }));
  [order[i].sort_order, order[j].sort_order] = [order[j].sort_order, order[i].sort_order];
  await Promise.all(order.map((c) => supabase.from("categories").update({ sort_order: c.sort_order }).eq("id", c.id)));
  revalidateSite();
}
