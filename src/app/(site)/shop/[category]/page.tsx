import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CategoryChips } from "@/components/site/CategoryChips";
import { ProductGrid } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/Ornament";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { EmptyCatalog } from "@/components/site/EmptyCatalog";
import { getCategories, getCategory, getProductsByCategory, getSettings } from "@/lib/data";
import { categoryCopy } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { messages } from "@/lib/whatsapp";
import type { Category, SiteSettings } from "@/lib/types";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

function copyFor(category: Category, settings: SiteSettings) {
  const defaults = categoryCopy[category.slug]?.(settings);
  return {
    heading: defaults?.heading ?? category.name,
    intro: category.intro || defaults?.intro || category.description || "",
  };
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const [category, settings] = await Promise.all([getCategory(slug), getSettings()]);
  if (!category) return {};
  const copy = copyFor(category, settings);
  return pageMetadata(settings, {
    title: category.seo_title || copy.heading,
    description: category.seo_description || category.description || copy.intro.slice(0, 160),
    path: `/shop/${category.slug}`,
    image: category.image_url,
  });
}

export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const { category: slug } = await params;
  const [category, categories, settings] = await Promise.all([getCategory(slug), getCategories(), getSettings()]);
  if (!category) notFound();
  const products = await getProductsByCategory(category.id);
  const copy = copyFor(category, settings);

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs items={[{ name: "Shop", path: "/shop" }, { name: category.name, path: `/shop/${category.slug}` }]} />
      <div className="mt-8">
        <SectionHeading as="h1" eyebrow={category.name} title={copy.heading} intro={copy.intro} />
      </div>
      <div className="mt-8 flex justify-center">
        <WhatsAppButton settings={settings} message={messages.category(settings, category.name)} variant="outline">
          Ask About {category.name}
        </WhatsAppButton>
      </div>
      <div className="mt-10">
        <CategoryChips categories={categories} active={category.slug} />
      </div>
      <div className="mt-12">
        {products.length ? (
          <ProductGrid products={products} priorityCount={4} />
        ) : (
          <EmptyCatalog settings={settings} label={category.name.toLowerCase()} />
        )}
      </div>
      <aside className="mt-20 rounded-[1.5rem] bg-paper p-8 text-center ring-1 ring-line sm:p-10">
        <h2 className="text-3xl font-medium text-maroon-deep">Want it made just for you?</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
          Most of our pieces can be customised or stitched to your measurements. Visit the boutique or tell us what you
          have in mind.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/custom-stitching" className="btn btn-primary">Custom Stitching</Link>
          <Link href="/location" className="btn btn-outline">Visit the Store</Link>
        </div>
      </aside>
    </div>
  );
}
