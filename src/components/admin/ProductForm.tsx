"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProduct } from "@/app/admin/_actions/products";
import { Card, Field, FormMessage, SubmitButton, Toggle, inputCls } from "@/components/admin/form";
import { ImageManager, SingleImageField } from "@/components/admin/ImageFields";
import { slugify } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

export function ProductForm({ product, categories }: { product?: Product | null; categories: Category[] }) {
  const [state, action] = useActionState(saveProduct, null);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [seoTitle, setSeoTitle] = useState(product?.seo_title ?? "");
  const [seoDesc, setSeoDesc] = useState(product?.seo_description ?? "");

  return (
    <form action={action} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <Card title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product name" name="name" state={state} className="sm:col-span-2">
            <input
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              required
              maxLength={120}
              className={inputCls}
            />
          </Field>
          <Field label="URL slug" name="slug" state={state} hint={`/product/${slug || "…"}`}>
            <input
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
              }}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Category" name="category_id" state={state}>
            <select name="category_id" defaultValue={product?.category_id ?? ""} className={inputCls}>
              <option value="">— None —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}{c.is_active ? "" : " (hidden)"}</option>)}
            </select>
          </Field>
          <Field label="Subcategory / style" name="subcategory" state={state} hint="Optional, e.g. Princess cut, Designer">
            <input name="subcategory" defaultValue={product?.subcategory ?? ""} maxLength={60} className={inputCls} />
          </Field>
          <Field label="Price (₹)" name="price" state={state} hint='Leave empty to show "Contact for Price"'>
            <input name="price" inputMode="decimal" defaultValue={product?.price ?? ""} className={inputCls} />
          </Field>
          <Field label="Short description" name="short_description" state={state} className="sm:col-span-2" hint="One or two lines, shown near the top of the product page.">
            <textarea name="short_description" defaultValue={product?.short_description ?? ""} rows={2} maxLength={300} className={inputCls} />
          </Field>
          <Field label="Detailed description" name="description" state={state} className="sm:col-span-2" hint="Leave a blank line between paragraphs.">
            <textarea name="description" defaultValue={product?.description ?? ""} rows={6} maxLength={5000} className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card title="Photos" description="The first photo is the main image. Drag order with the arrows; ★ makes a photo the main one.">
        <ImageManager name="images" initial={product?.images ?? []} folder="products" />
        <Field label="Image description (alt text)" name="image_alt" state={state} className="mt-4" hint="Describe the outfit for screen readers and Google, e.g. “Maroon antique zari blouse with elbow sleeves”.">
          <input name="image_alt" defaultValue={product?.image_alt ?? ""} maxLength={160} className={inputCls} />
        </Field>
      </Card>

      <Card title="Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sizes" name="sizes" state={state} hint="Comma separated, e.g. 32, 34, 36, Custom">
            <input name="sizes" defaultValue={product?.sizes.join(", ") ?? ""} className={inputCls} />
          </Field>
          <Field label="Colours" name="colors" state={state} hint="Comma separated">
            <input name="colors" defaultValue={product?.colors.join(", ") ?? ""} className={inputCls} />
          </Field>
          <Field label="Fabric" name="fabric" state={state}>
            <input name="fabric" defaultValue={product?.fabric ?? ""} maxLength={80} className={inputCls} />
          </Field>
          <Field label="Availability" name="availability" state={state}>
            <select name="availability" defaultValue={product?.availability ?? "in_stock"} className={inputCls}>
              <option value="in_stock">Available</option>
              <option value="made_to_order">Made to order</option>
              <option value="out_of_stock">Currently unavailable</option>
            </select>
          </Field>
          <Toggle name="is_customizable" label="Customisation available" defaultChecked={product?.is_customizable} />
          <Toggle name="stitching_available" label="Stitching to measure available" defaultChecked={product?.stitching_available} />
          <Field label="Customisation notes" name="customization_notes" state={state} className="sm:col-span-2" hint="What can be changed — sleeves, neckline, colour, work…">
            <textarea name="customization_notes" defaultValue={product?.customization_notes ?? ""} rows={2} maxLength={1000} className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card title="Visibility">
        <div className="grid gap-4 sm:grid-cols-3">
          <Toggle name="is_visible" label="Show on website" defaultChecked={product?.is_visible ?? true} />
          <Toggle name="is_featured" label="Feature on homepage" defaultChecked={product?.is_featured} />
          <Field label="Featured order" name="featured_order" state={state} hint="Lower numbers show first">
            <input name="featured_order" type="number" min={0} max={999} defaultValue={product?.featured_order ?? 0} className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card title="Search & social sharing" description="Optional. Used by Google and when the link is shared on WhatsApp, Facebook and others.">
        <div className="grid gap-4">
          <Field label={`SEO title (${seoTitle.length}/70)`} name="seo_title" state={state} hint="Defaults to the product name. “| Geeta Fashion Hub” is added automatically.">
            <input name="seo_title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={70} className={inputCls} />
          </Field>
          <Field label={`SEO description (${seoDesc.length}/170)`} name="seo_description" state={state} hint="Defaults to the short description.">
            <textarea name="seo_description" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={2} maxLength={170} className={inputCls} />
          </Field>
          <Field label="Social share image (Open Graph)" name="og_image_url" state={state} hint="Defaults to the main photo. A landscape image (1200×630) looks best on Facebook/LinkedIn.">
            <SingleImageField name="og_image_url" initial={product?.og_image_url ?? null} folder="products" aspect="aspect-[1.9/1]" />
          </Field>
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-4 flex flex-col gap-3 border-t border-line bg-cream/95 px-4 py-4 backdrop-blur sm:mx-0 sm:flex-row sm:items-center sm:rounded-2xl sm:border">
        <SubmitButton>{product ? "Save changes" : "Create product"}</SubmitButton>
        {product && (
          <Link href={`/product/${product.slug}`} target="_blank" className="btn btn-outline !min-h-11">View on website</Link>
        )}
        <div className="sm:ml-auto"><FormMessage state={state} /></div>
      </div>
    </form>
  );
}
