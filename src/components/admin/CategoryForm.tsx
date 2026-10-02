"use client";

import { useActionState, useState } from "react";
import { saveCategory } from "@/app/admin/_actions/categories";
import { Card, Field, FormMessage, SubmitButton, Toggle, inputCls } from "@/components/admin/form";
import { SingleImageField } from "@/components/admin/ImageFields";
import { slugify } from "@/lib/format";
import type { Category } from "@/lib/types";

export function CategoryForm({ category }: { category?: Category | null }) {
  const [state, action] = useActionState(saveCategory, null);
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [touched, setTouched] = useState(Boolean(category));
  return (
    <form action={action} className="space-y-6">
      {category && <input type="hidden" name="id" value={category.id} />}
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" name="name" state={state}>
            <input name="name" defaultValue={category?.name ?? ""} required maxLength={60} className={inputCls}
              onChange={(e) => !touched && setSlug(slugify(e.target.value))} />
          </Field>
          <Field label="URL slug" name="slug" state={state} hint={`/shop/${slug || "…"}${category ? " — changing this breaks old links" : ""}`}>
            <input name="slug" value={slug} required className={inputCls}
              onChange={(e) => { setTouched(true); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")); }} />
          </Field>
          <Field label="Short description" name="description" state={state} className="sm:col-span-2">
            <textarea name="description" defaultValue={category?.description ?? ""} rows={2} maxLength={300} className={inputCls} />
          </Field>
          <Field label="Landing page introduction" name="intro" state={state} className="sm:col-span-2"
            hint="Optional. Shown at the top of the category page and helps local search. Leave empty to use the default text.">
            <textarea name="intro" defaultValue={category?.intro ?? ""} rows={4} maxLength={2000} className={inputCls} />
          </Field>
          <Field label="Category image" name="image_url" state={state}>
            <SingleImageField name="image_url" initial={category?.image_url ?? null} folder="categories" aspect="aspect-[3/4]" />
          </Field>
          <div className="self-start"><Toggle name="is_active" label="Enabled (shown on website)" defaultChecked={category?.is_active ?? true} /></div>
          <Field label="SEO title" name="seo_title" state={state}>
            <input name="seo_title" defaultValue={category?.seo_title ?? ""} maxLength={70} className={inputCls} />
          </Field>
          <Field label="SEO description" name="seo_description" state={state}>
            <input name="seo_description" defaultValue={category?.seo_description ?? ""} maxLength={170} className={inputCls} />
          </Field>
        </div>
      </Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton>{category ? "Save category" : "Create category"}</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
