"use server";

import { redirect } from "next/navigation";
import { requireStaffAction } from "@/lib/auth";
import { sessionClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import { fd, productSchema } from "@/lib/validation";
import { fromError, revalidateSite, type ActionState } from "./shared";

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let createdId: string | null = null;
  try {
    await requireStaffAction();
    const id = fd.str(formData, "id");
    const name = fd.str(formData, "name") ?? "";
    const input = productSchema.parse({
      name,
      slug: fd.str(formData, "slug") ?? slugify(name),
      category_id: fd.str(formData, "category_id"),
      subcategory: fd.str(formData, "subcategory"),
      short_description: fd.str(formData, "short_description"),
      description: fd.str(formData, "description"),
      images: fd.all(formData, "images"),
      image_alt: fd.str(formData, "image_alt"),
      sizes: fd.list(formData, "sizes"),
      colors: fd.list(formData, "colors"),
      fabric: fd.str(formData, "fabric"),
      price: fd.num(formData, "price"),
      is_customizable: fd.bool(formData, "is_customizable"),
      customization_notes: fd.str(formData, "customization_notes"),
      stitching_available: fd.bool(formData, "stitching_available"),
      availability: fd.str(formData, "availability") ?? "in_stock",
      is_featured: fd.bool(formData, "is_featured"),
      featured_order: fd.num(formData, "featured_order") ?? 0,
      is_visible: fd.bool(formData, "is_visible"),
      seo_title: fd.str(formData, "seo_title"),
      seo_description: fd.str(formData, "seo_description"),
      og_image_url: fd.str(formData, "og_image_url"),
    });

    const supabase = await sessionClient();
    if (id) {
      const { error } = await supabase.from("products").update(input).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("products").insert(input).select("id").single();
      if (error) throw error;
      createdId = data.id;
    }
    revalidateSite();
  } catch (error) {
    return fromError(error);
  }
  if (createdId) redirect(`/admin/products/${createdId}?created=1`);
  return { ok: true, message: "Product saved." };
}

export async function deleteProduct(formData: FormData) {
  await requireStaffAction();
  const id = fd.str(formData, "id");
  if (!id) return;
  const supabase = await sessionClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  revalidateSite();
  redirect("/admin/products?deleted=1");
}

export async function toggleProductVisibility(formData: FormData) {
  await requireStaffAction();
  const id = fd.str(formData, "id");
  if (!id) return;
  const supabase = await sessionClient();
  const { error } = await supabase.from("products").update({ is_visible: fd.bool(formData, "visible") }).eq("id", id);
  if (error) throw error;
  revalidateSite();
}

/** Bulk update of homepage featured products and their order. */
export async function saveFeatured(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireStaffAction();
    const ids = fd.all(formData, "product_ids");
    const supabase = await sessionClient();
    const results = await Promise.all(
      ids.map((id) => {
        const order = fd.num(formData, `order_${id}`);
        return supabase
          .from("products")
          .update({
            is_featured: fd.bool(formData, `featured_${id}`),
            featured_order: Number.isFinite(order) && order != null ? Math.max(0, Math.min(999, Math.round(order))) : 0,
          })
          .eq("id", id);
      }),
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) throw failed.error;
    revalidateSite();
    return { ok: true, message: "Featured products updated." };
  } catch (error) {
    return fromError(error);
  }
}
