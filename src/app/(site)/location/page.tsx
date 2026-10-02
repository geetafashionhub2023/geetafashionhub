import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/Ornament";
import { TodayLocationCard } from "@/components/site/TodayLocationCard";
import { PermanentLocation } from "@/components/site/PermanentLocation";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getCategories, getSettings, getTodayLocation } from "@/lib/data";
import { fullAddress, telHref } from "@/lib/format";
import { inCity } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { messages } from "@/lib/whatsapp";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const where = fullAddress(s);
  return pageMetadata(s, {
    title: `Visit ${s.business_name}${inCity(s)} — Store Location & Hours`,
    description: `Find ${s.business_name}${where ? ` at ${where}` : ""}: permanent store location, today's location, opening hours, directions, phone and WhatsApp.`,
    path: "/location",
  });
}

export default async function LocationPage() {
  const [s, today, categories] = await Promise.all([getSettings(), getTodayLocation(), getCategories()]);
  const tel = telHref(s.phone);
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs items={[{ name: "Visit Us", path: "/location" }]} />
      <div className="mt-8">
        <SectionHeading as="h1" eyebrow="Store Location" title={`Visit ${s.business_name}`}
          intro="Come and see our fabrics, try outfits on and get measured in person. Check today's location below before you set out." />
      </div>

      <section aria-labelledby="today" className="mt-12">
        <h2 id="today" className="sr-only">Today&apos;s location</h2>
        <TodayLocationCard today={today} settings={s} />
      </section>

      <section className="mt-16" aria-label="Permanent store location">
        <PermanentLocation settings={s} headingLevel="h2" />
      </section>

      <section className="mt-20 grid gap-8 lg:grid-cols-2">
        <div className="reveal rounded-[1.5rem] bg-paper p-8 ring-1 ring-line">
          <h2 className="text-3xl font-medium text-maroon-deep">What you&apos;ll find at the store</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/shop/${c.slug}`} className="inline-block rounded-full border border-line bg-ivory px-3.5 py-1.5 text-sm hover:border-gold hover:text-maroon">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            Plus <Link href="/custom-stitching" className="font-semibold text-maroon underline underline-offset-4">custom stitching</Link>, measurements and alterations.
          </p>
        </div>
        <div className="reveal rounded-[1.5rem] bg-paper p-8 ring-1 ring-line">
          <h2 className="text-3xl font-medium text-maroon-deep">Nearby & local area</h2>
          {s.service_areas.length > 0 ? (
            <>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                We welcome customers from{inCity(s) ? ` across ${s.city}, including` : ""}:
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {s.service_areas.map((a) => (
                  <li key={a} className="rounded-full bg-ivory px-3.5 py-1.5 text-sm ring-1 ring-line">{a}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Not sure how to reach us? Message us on WhatsApp and we&apos;ll share directions and today&apos;s location.
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton settings={s} message={messages.visit(s)}>Ask for Directions</WhatsAppButton>
            {tel && <a href={tel} className="btn btn-outline"><Phone className="h-4 w-4" /> Call Us</a>}
          </div>
        </div>
      </section>
    </div>
  );
}
