import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/Ornament";
import { ProductImage } from "@/components/site/ProductImage";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { collections } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata(s, {
    title: "Collections — Bridal, Festive, Blouses & Kids",
    description: "Explore curated collections: bridal & wedding, the blouse edit, festive & Navratri, suits & kurtas, girls & kids, and made-for-you custom designs.",
    path: "/collections",
  });
}

export default async function CollectionsPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const groups = collections
    .map((col) => {
      const cats = col.categories.map((slug) => categories.find((c) => c.slug === slug)).filter((c) => c != null);
      const ids = new Set(cats.map((c) => c.id));
      const cover = products.find((p) => p.category_id && ids.has(p.category_id) && p.images[0]);
      return { ...col, cats, cover: cover?.images[0] ?? cats.find((c) => c.image_url)?.image_url ?? null };
    })
    .filter((g) => g.cats.length);

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs items={[{ name: "Collections", path: "/collections" }]} />
      <div className="mt-8">
        <SectionHeading as="h1" eyebrow="Curated for You" title="Collections" intro="Find the right outfit for the occasion — or the person you're shopping for." />
      </div>
      <ul className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <li key={g.slug} className="reveal">
            <div className="group relative overflow-hidden rounded-[1.5rem] ring-1 ring-line">
              <div className="relative aspect-[4/5]">
                <ProductImage src={g.cover} alt={g.title} seed={g.slug} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" priority={i < 2}
                  className="transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/90 via-maroon-deep/30 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7 text-ivory">
                <h2 className="text-3xl font-medium">{g.title}</h2>
                <p className="mt-1 text-sm text-ivory/80">{g.blurb}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.cats.map((c) => (
                    <li key={c.id}>
                      <Link href={`/shop/${c.slug}`} className="inline-flex items-center gap-1 rounded-full bg-ivory/15 px-3 py-1.5 text-xs font-semibold backdrop-blur hover:bg-ivory hover:text-maroon">
                        {c.name} <ArrowRight className="h-3 w-3" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
