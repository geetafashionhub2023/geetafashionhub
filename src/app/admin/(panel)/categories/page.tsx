import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { moveCategory, toggleCategory } from "@/app/admin/_actions/categories";
import { adminCategories, adminProducts } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesAdminPage({ searchParams }: PageProps<"/admin/categories">) {
  const { created, deleted } = await searchParams;
  const [categories, products] = await Promise.all([adminCategories(), adminProducts()]);
  const count = (id: string) => products.filter((p) => p.category_id === id).length;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-maroon-deep">Categories</h1>
          <p className="text-sm text-muted">Use the arrows to change the order shown on the website.</p>
        </div>
        <Link href="/admin/categories/new" className="btn btn-primary !min-h-11"><Plus className="h-4 w-4" /> Add category</Link>
      </div>
      {(created || deleted) && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Category {created ? "created" : "deleted"}.</p>}
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {categories.map((c, i) => (
          <li key={c.id} className="flex items-center gap-3 p-3 sm:p-4">
            <div className="flex flex-col">
              {(["up", "down"] as const).map((dir) => (
                <form key={dir} action={moveCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="dir" value={dir} />
                  <button disabled={dir === "up" ? i === 0 : i === categories.length - 1} className="rounded p-0.5 text-muted hover:bg-cream hover:text-maroon disabled:opacity-25" aria-label={`Move ${c.name} ${dir}`}>
                    {dir === "up" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </form>
              ))}
            </div>
            <Link href={`/admin/categories/${c.id}`} className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">{c.name}</p>
              <p className="truncate text-xs text-muted">/shop/{c.slug} · {count(c.id)} products</p>
            </Link>
            <form action={toggleCategory}>
              <input type="hidden" name="id" value={c.id} />
              <input type="hidden" name="active" value={String(!c.is_active)} />
              <button className={`rounded-full px-3 py-1.5 text-xs font-semibold ${c.is_active ? "bg-emerald-50 text-emerald-800" : "bg-sand text-muted"}`}>
                {c.is_active ? "Enabled" : "Disabled"}
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
