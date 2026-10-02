import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Plus, Star } from "lucide-react";
import { toggleProductVisibility } from "@/app/admin/_actions/products";
import { adminProducts } from "@/lib/admin-data";
import { availabilityLabel, formatPrice } from "@/lib/format";
import { Motif } from "@/components/site/Motif";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsAdminPage({ searchParams }: PageProps<"/admin/products">) {
  const { q, deleted } = await searchParams;
  const query = typeof q === "string" ? q.trim().toLowerCase() : "";
  const all = await adminProducts();
  const products = query ? all.filter((p) => `${p.name} ${p.category?.name ?? ""}`.toLowerCase().includes(query)) : all;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-maroon-deep">Products</h1>
          <p className="text-sm text-muted">{all.length} total</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary !min-h-11"><Plus className="h-4 w-4" /> Add product</Link>
      </div>
      {deleted && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Product deleted.</p>}
      <form className="flex gap-2">
        <input name="q" defaultValue={query} placeholder="Search products…" className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm" />
        <button className="btn btn-outline !min-h-10">Search</button>
      </form>

      {products.length ? (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-4 p-3 sm:p-4">
              <Link href={`/admin/products/${p.id}`} className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                {p.images[0] ? <Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" /> : <Motif seed={p.slug} />}
              </Link>
              <Link href={`/admin/products/${p.id}`} className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate font-semibold text-ink">
                  {p.is_featured && <Star className="h-3.5 w-3.5 shrink-0 fill-gold text-gold" aria-label="Featured" />}
                  {p.name}
                </p>
                <p className="truncate text-xs text-muted">
                  {p.category?.name ?? "No category"} · {formatPrice(p.price)} · {availabilityLabel[p.availability]}
                </p>
              </Link>
              <form action={toggleProductVisibility}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="visible" value={String(!p.is_visible)} />
                <button className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${p.is_visible ? "bg-emerald-50 text-emerald-800" : "bg-sand text-muted"}`}
                  title={p.is_visible ? "Click to hide" : "Click to show"}>
                  {p.is_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{p.is_visible ? "Visible" : "Hidden"}</span>
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">
          {query ? "No products match your search." : "No products yet — add your first one."}
        </p>
      )}
    </div>
  );
}
