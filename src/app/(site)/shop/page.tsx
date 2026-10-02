import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CategoryChips } from "@/components/site/CategoryChips";
import { ProductGrid } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/Ornament";
import { EmptyCatalog } from "@/components/site/EmptyCatalog";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { inCity } from "@/lib/content";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, {
    title: `Shop Traditional Indian Wear${inCity(settings)}`,
    description:
      "Browse designer and antique blouses, chaniya choli, salwar kameez, bridal, festive and kids' traditional wear. Ask about any piece on WhatsApp.",
    path: "/shop",
  });
}

export default async function ShopPage() {
  const [settings, categories, products] = await Promise.all([getSettings(), getCategories(), getProducts()]);
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs items={[{ name: "Shop", path: "/shop" }]} />
      <div className="mt-8">
        <SectionHeading as="h1" eyebrow="The Collection" title="Shop All" intro="Every piece can be enquired about on WhatsApp — we'll share price, sizes and customisation options." />
      </div>
      <div className="mt-10">
        <CategoryChips categories={categories} />
      </div>
      <div className="mt-12">
        {products.length ? (
          <ProductGrid products={products} priorityCount={4} />
        ) : (
          <EmptyCatalog settings={settings} />
        )}
      </div>
    </div>
  );
}
