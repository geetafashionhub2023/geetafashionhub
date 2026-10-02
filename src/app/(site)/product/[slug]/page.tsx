import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin, Ruler, Scissors } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { ProductGallery } from "@/components/site/ProductGallery";
import { ProductGrid } from "@/components/site/ProductCard";
import { ShareButton } from "@/components/site/ShareButton";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { Ornament } from "@/components/site/Ornament";
import { directionsForToday } from "@/components/site/TodayLocationCard";
import { getProduct, getProducts, getRelatedProducts, getSettings, getTodayLocation } from "@/lib/data";
import { availabilityLabel, formatPrice, formatTimeRange, truncate } from "@/lib/format";
import { absoluteUrl, pageMetadata, productJsonLd, productOgImage } from "@/lib/seo";
import { messages, whatsappHref } from "@/lib/whatsapp";

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()]);
  if (!product) return { title: "Product not found", robots: { index: false } };
  const description =
    product.seo_description ||
    product.short_description ||
    truncate(product.description ?? `Explore the ${product.name} from ${settings.business_name}.`, 160);
  return pageMetadata(settings, {
    title: product.seo_title || product.name,
    description,
    path: `/product/${product.slug}`,
    image: productOgImage(product),
    imageAlt: product.image_alt || product.name,
  });
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const [product, settings, today] = await Promise.all([getProduct(slug), getSettings(), getTodayLocation()]);
  if (!product) notFound();
  const related = await getRelatedProducts(product);

  const inquiry = whatsappHref(settings, messages.product(settings, product.name, product.slug));
  const url = absoluteUrl(`/product/${product.slug}`);
  const crumbs = [
    { name: "Shop", path: "/shop" },
    ...(product.category ? [{ name: product.category.name, path: `/shop/${product.category.slug}` }] : []),
    { name: product.name, path: `/product/${product.slug}` },
  ];

  const details = [
    product.fabric && { label: "Fabric", value: product.fabric },
    product.colors.length > 0 && { label: product.colors.length > 1 ? "Colours" : "Colour", value: product.colors.join(", ") },
    product.subcategory && { label: "Style", value: product.subcategory },
    { label: "Availability", value: availabilityLabel[product.availability] },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <JsonLd data={productJsonLd(product, settings)} />
      <div className="container-page py-8 md:py-12">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery images={product.images} alt={product.image_alt || product.name} seed={product.slug} />
          </div>

          <div>
            {product.category && (
              <Link href={`/shop/${product.category.slug}`} className="eyebrow hover:text-maroon">
                {product.category.name}
              </Link>
            )}
            <h1 className="mt-3 text-4xl leading-[1.08] font-medium text-maroon-deep sm:text-5xl">{product.name}</h1>
            <Ornament className="mt-4" />
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <p className="font-display text-3xl text-burgundy">{formatPrice(product.price)}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.availability === "out_of_stock" ? "bg-sand text-muted" : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"}`}>
                {availabilityLabel[product.availability]}
              </span>
            </div>

            {product.short_description && (
              <p className="mt-6 text-lg leading-relaxed text-ink/85">{product.short_description}</p>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <WhatsAppButton settings={settings} message={messages.product(settings, product.name, product.slug)} className="w-full !min-h-14 text-base">
                Ask About This Product on WhatsApp
              </WhatsAppButton>
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-muted">We reply with price, availability and customisation options.</p>
                <ShareButton url={url} title={product.name} />
              </div>
            </div>

            {(product.is_customizable || product.stitching_available) && (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {product.is_customizable && (
                  <li className="flex items-start gap-3 rounded-2xl bg-paper p-4 ring-1 ring-line">
                    <Scissors className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span><span className="block font-semibold text-maroon-deep">Customisable</span><span className="text-sm text-muted">Design changes on request</span></span>
                  </li>
                )}
                {product.stitching_available && (
                  <li className="flex items-start gap-3 rounded-2xl bg-paper p-4 ring-1 ring-line">
                    <Ruler className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span><span className="block font-semibold text-maroon-deep">Stitched to measure</span><span className="text-sm text-muted">Made to your measurements</span></span>
                  </li>
                )}
              </ul>
            )}

            <dl className="mt-8 divide-y divide-line border-y border-line">
              {details.map((d) => (
                <div key={d.label} className="flex justify-between gap-6 py-3.5 text-sm">
                  <dt className="text-muted">{d.label}</dt>
                  <dd className="text-right font-medium text-ink">{d.value}</dd>
                </div>
              ))}
            </dl>

            {product.sizes.length > 0 && (
              <div className="mt-8">
                <h2 className="eyebrow">Available Sizes</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <li key={s} className="min-w-12 rounded-full border border-line bg-ivory px-4 py-2 text-center text-sm">{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.customization_notes && (
              <div className="mt-8 rounded-2xl bg-blush/50 p-5">
                <h2 className="eyebrow !text-burgundy">Customisation</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/85">{product.customization_notes}</p>
              </div>
            )}

            {product.description && (
              <div className="mt-10">
                <h2 className="text-2xl font-medium text-maroon-deep">Details</h2>
                <div className="prose-boutique mt-2">
                  {product.description.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </div>
            )}

            <div className="mt-10 rounded-2xl border border-gold-soft/50 p-5">
              <p className="flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span>
                  <span className="block font-semibold text-maroon-deep">See it in person</span>
                  {today?.is_open ? (
                    <span className="text-muted">
                      Today we&apos;re at <strong className="text-ink">{today.location_name}</strong>
                      {formatTimeRange(today.open_time, today.close_time) ? `, ${formatTimeRange(today.open_time, today.close_time)}` : ""}.
                    </span>
                  ) : (
                    <span className="text-muted">Visit our permanent store or ask us where we are today.</span>
                  )}{" "}
                  <Link href="/location" className="font-semibold text-maroon underline underline-offset-4">Visit us</Link>
                </span>
              </p>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-muted">
              {["No account or online payment needed", "Ask questions before you decide", "See it in person at the store"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" />{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="text-center text-3xl font-medium text-maroon-deep sm:text-4xl">You May Also Like</h2>
            <Ornament className="mx-auto mt-4" />
            <div className="mt-12"><ProductGrid products={related} /></div>
          </section>
        )}
      </div>

      <MobileActionBar
        settings={settings}
        whatsappHref={inquiry}
        directionsHref={directionsForToday(today, settings)}
        primaryLabel="Ask on WhatsApp"
        pageSpecific
      />
    </>
  );
}
