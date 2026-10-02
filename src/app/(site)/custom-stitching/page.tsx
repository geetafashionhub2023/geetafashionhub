import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BRAND_IMAGES } from "@/lib/brand-images";
import { HeartHandshake, MessageCircle, Ruler, Scissors } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/Ornament";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { JsonLd } from "@/components/site/JsonLd";
import { getSettings } from "@/lib/data";
import { inCity, stitchingServices } from "@/lib/content";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { messages, whatsappHref } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/env";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata(s, {
    title: `Custom Blouse Stitching & Tailoring${inCity(s)}`,
    description:
      "Custom blouse and bridal blouse stitching, chaniya choli customisation, salwar and kurta stitching, kids' clothing and alterations — made to your measurements.",
    path: "/custom-stitching",
  });
}

export default async function CustomStitchingPage() {
  const s = await getSettings();
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Custom tailoring and stitching",
    provider: { "@id": `${SITE_URL}/#store` },
    url: absoluteUrl("/custom-stitching"),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Stitching services",
      itemListElement: stitchingServices.map((x) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: x.title, description: x.body } })),
    },
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      <section className="relative isolate overflow-hidden bg-oxblood text-ivory">
        <div className="absolute inset-0 -z-10 lg:left-1/2">
          <Image src={BRAND_IMAGES.stitching} alt="" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-top opacity-45 lg:opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-oxblood via-oxblood/60 to-oxblood/20 lg:bg-gradient-to-r lg:from-oxblood lg:via-oxblood/30 lg:to-transparent" />
        </div>
        <div className="container-page py-14 md:py-24">
          <Breadcrumbs light items={[{ name: "Custom Stitching", path: "/custom-stitching" }]} />
          <div className="hero-in mt-10 max-w-2xl">
            <p className="eyebrow !text-gold-soft">Custom Stitching & Alterations</p>
            <h1 className="mt-4 text-5xl leading-[1.04] font-medium sm:text-6xl">
              Made to Your Measure, <em className="text-gold-foil">Designed with You</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/80">
              From everyday blouses to bridal pieces, chaniya cholis, suits and kids&apos; outfits — tell us what you
              have in mind and we&apos;ll stitch it to fit you beautifully.
            </p>
            <div className="mt-9">
              <WhatsAppButton settings={s} message={messages.stitching()} variant="gold">
                Discuss Your Design on WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <SectionHeading eyebrow="Our Services" title="What We Stitch" />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stitchingServices.map((svc) => (
            <li key={svc.title} className="reveal flex flex-col rounded-[1.25rem] bg-ivory p-6 shadow-soft ring-1 ring-line">
              <Scissors className="h-6 w-6 text-gold" />
              <h2 className="mt-4 text-2xl leading-tight font-medium text-maroon-deep">{svc.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{svc.body}</p>
              <a href={whatsappHref(s, messages.stitchingService(svc.title))} target="_blank" rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:text-burgundy">
                <MessageCircle className="h-4 w-4" /> Ask about this
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="How It Works" title="From Idea to Perfect Fit" />
          <ol className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-4">
            {[
              { Icon: MessageCircle, t: "Message us", d: "Send your idea, reference photos or fabric details on WhatsApp." },
              { Icon: Ruler, t: "Measurements", d: "Visit to get measured, or share your measurements with us." },
              { Icon: Scissors, t: "Stitching", d: "We confirm the design, timeline and price before we begin." },
              { Icon: HeartHandshake, t: "Fitting", d: "Try it on and we'll make any adjustments needed." },
            ].map(({ Icon, t, d }, i) => (
              <li key={t} className="reveal text-center">
                <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-maroon text-ivory">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-gold text-xs font-bold text-ivory">{i + 1}</span>
                </span>
                <h3 className="mt-5 text-2xl font-medium text-maroon-deep">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Good to Know" title="Before You Message Us" />
          <dl className="mt-12 divide-y divide-line border-y border-line">
            {[
              { q: "What should I send on WhatsApp?", a: "A photo or screenshot of the design you like, your fabric (if you have one), the occasion and the date you need it by." },
              { q: "Can I bring my own fabric?", a: "Yes — bring your saree blouse piece, dress material or fabric and we'll advise on the design that suits it." },
              { q: "Do you do alterations?", a: "Yes. We alter blouses, suits, kurtas, cholis and kids' wear — including resizing and length changes." },
              { q: "How much does stitching cost and how long does it take?", a: "It depends on the design and work involved. Message us with your requirements and we'll confirm the price and timeline before starting." },
            ].map(({ q, a }) => (
              <div key={q} className="py-6">
                <dt className="font-display text-xl text-maroon-deep">{q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <WhatsAppButton settings={s} message={messages.stitching()}>Discuss Your Design on WhatsApp</WhatsAppButton>
            <Link href="/location" className="btn btn-outline">Visit for Measurements</Link>
          </div>
        </div>
      </section>
    </>
  );
}
