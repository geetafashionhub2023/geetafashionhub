import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/Ornament";
import { PermanentLocation } from "@/components/site/PermanentLocation";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { getSettings } from "@/lib/data";
import { telHref } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { messages, whatsappHref } from "@/lib/whatsapp";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata(s, {
    title: "Contact Us",
    description: `Contact ${s.business_name} on WhatsApp, phone or Instagram for prices, availability, custom stitching and store directions.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const s = await getSettings();
  const tel = telHref(s.phone);
  const cards = [
    { Icon: WhatsAppIcon, title: "WhatsApp", body: "Fastest way to reach us — prices, availability and custom orders.", cta: "Chat on WhatsApp", href: whatsappHref(s, messages.general(s)), external: true, primary: true },
    tel && { Icon: Phone, title: "Call", body: s.phone!, cta: "Call now", href: tel },
    { Icon: InstagramIcon, title: "Instagram", body: "New arrivals and our latest work.", cta: "Follow us", href: s.instagram_url, external: true },
    s.email && { Icon: Mail, title: "Email", body: s.email, cta: "Send an email", href: `mailto:${s.email}` },
    { Icon: MapPin, title: "Visit", body: "See today's location and our permanent store.", cta: "Get directions", href: s.maps_url, external: true },
  ].filter(Boolean) as { Icon: typeof Phone; title: string; body: string; cta: string; href: string; external?: boolean; primary?: boolean }[];

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <div className="mt-8">
        <SectionHeading as="h1" eyebrow="Get in Touch" title="We'd Love to Hear from You" intro="Ask about any outfit, plan a custom design, or check where we are today." />
      </div>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ Icon, title, body, cta, href, external, primary }) => (
          <li key={title} className="reveal">
            <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`flex h-full flex-col rounded-[1.25rem] p-7 ring-1 transition-shadow hover:shadow-lift ${primary ? "bg-[#1f8f4e] text-white ring-transparent" : "bg-ivory ring-line"}`}>
              <Icon className={`h-7 w-7 ${primary ? "" : "text-gold"}`} />
              <h2 className={`mt-4 text-2xl font-medium ${primary ? "" : "text-maroon-deep"}`}>{title}</h2>
              <p className={`mt-1.5 flex-1 text-sm break-words ${primary ? "text-white/85" : "text-muted"}`}>{body}</p>
              <span className={`mt-5 text-sm font-semibold ${primary ? "" : "text-maroon"}`}>{cta} →</span>
            </a>
          </li>
        ))}
      </ul>
      <section className="mt-20" aria-label="Store location">
        <PermanentLocation settings={s} headingLevel="h2" />
      </section>
    </div>
  );
}
