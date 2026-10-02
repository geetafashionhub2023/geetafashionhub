"use client";

import Image from "next/image";
import { useActionState } from "react";
import { saveFeatured } from "@/app/admin/_actions/products";
import { FormMessage, SubmitButton } from "@/components/admin/form";
import { Motif } from "@/components/site/Motif";
import type { Product } from "@/lib/types";

export function FeaturedForm({ products }: { products: Product[] }) {
  const [state, action] = useActionState(saveFeatured, null);
  const sorted = [...products].sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.featured_order - b.featured_order);
  return (
    <form action={action} className="space-y-5">
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {sorted.map((p) => (
          <li key={p.id} className="flex items-center gap-4 p-3">
            <input type="hidden" name="product_ids" value={p.id} />
            <input type="checkbox" name={`featured_${p.id}`} defaultChecked={p.is_featured} className="h-5 w-5 accent-maroon" aria-label={`Feature ${p.name}`} />
            <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-cream">
              {p.images[0] ? <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" /> : <Motif seed={p.slug} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.name}{!p.is_visible && <span className="ml-2 text-xs font-normal text-muted">(hidden)</span>}</p>
              <p className="truncate text-xs text-muted">{p.category?.name ?? "No category"}</p>
            </div>
            <label className="flex items-center gap-2 text-xs text-muted">
              Order
              <input type="number" name={`order_${p.id}`} defaultValue={p.featured_order} min={0} max={999} className="w-16 rounded-lg border border-line px-2 py-1.5 text-sm" />
            </label>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton>Save featured products</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
