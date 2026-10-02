import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ArchFrame } from "@/components/site/ArchFrame";
import { BRAND_IMAGES } from "@/lib/brand-images";
import { Ornament, SectionHeading } from "@/components/site/Ornament";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { messages } from "@/lib/whatsapp";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata(s, {
    title: `About ${s.business_name}`,
    description: `${s.business_name} is a traditional Indian fashion boutique for women, girls and children, offering ethnic wear, custom stitching and alterations.`,
    path: "/about",
  });
}

export default async function AboutPage() {
  const s = await getSettings();
  const story = s.about_text?.trim();
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
      <div className="mt-10 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="relative mx-auto w-full max-w-sm">
          <ArchFrame className="relative aspect-[3/4]">
            <Image src={BRAND_IMAGES.about} alt="Bride in traditional red and gold attire" fill sizes="24rem" className="object-cover" priority />
          </ArchFrame>
          <span className="absolute -bottom-6 left-1/2 block h-20 w-20 -translate-x-1/2 overflow-hidden rounded-full ring-4 ring-ivory">
            <Image src="/brand/logo.jpg" alt={`${s.business_name} logo`} fill sizes="80px" className="scale-[1.35] object-cover object-[50%_42%]" />
          </span>
        </div>
        <div>
          <p className="eyebrow">Our Boutique</p>
          <h1 className="mt-3 text-5xl leading-[1.05] font-medium text-maroon-deep sm:text-6xl">About {s.business_name}</h1>
          <Ornament className="mt-5" />
          <div className="prose-boutique mt-4 text-[1.02rem]">
            {story ? (
              story.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <>
                <p>
                  {s.business_name} is a traditional Indian fashion boutique for women, girls and children. We bring
                  together ready ethnic wear and made-to-measure stitching, so every outfit can be chosen — or created —
                  for the celebration ahead.
                </p>
                <p>
                  Our collection spans antique and designer blouses, chaniya cholis, salwar kameez and kurtas, bridal and
                  wedding wear, festive outfits and children&apos;s traditional clothing. Alongside it, we offer custom
                  stitching, alterations and custom designs.
                </p>
                <p>
                  We like to keep things personal: visit us to see fabrics and get measured, or simply message us on
                  WhatsApp with a photo of what you love.
                </p>
              </>
            )}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="btn btn-primary">Explore the Collection</Link>
            <WhatsAppButton settings={s} message={messages.general(s)} variant="outline">Say Hello on WhatsApp</WhatsAppButton>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <SectionHeading eyebrow="What We Value" title="Tradition, Fit & Care" />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { t: "Tradition", d: "Designs rooted in Indian textile and embroidery traditions, for every festival and family occasion." },
            { t: "Fit", d: "Clothing that's stitched and altered to fit the person wearing it." },
            { t: "Care", d: "Personal attention — whether you visit the store or message us on WhatsApp." },
          ].map((v) => (
            <li key={v.t} className="reveal rounded-[1.25rem] bg-paper p-8 text-center ring-1 ring-line">
              <h3 className="text-3xl font-medium text-maroon-deep">{v.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{v.d}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
