import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp, MobileActionBar } from "@/components/site/MobileActionBar";
import { JsonLd } from "@/components/site/JsonLd";
import { directionsForToday } from "@/components/site/TodayLocationCard";
import { getCategories, getSettings, getTodayLocation } from "@/lib/data";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";
import { messages, whatsappHref } from "@/lib/whatsapp";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, today] = await Promise.all([getSettings(), getCategories(), getTodayLocation()]);
  const chat = whatsappHref(settings, messages.general(settings));

  return (
    <>
      <JsonLd data={[localBusinessJsonLd(settings), websiteJsonLd(settings)]} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-maroon focus:px-4 focus:py-2 focus:text-ivory">
        Skip to content
      </a>
      <Header settings={settings} />
      <main id="main">{children}</main>
      <Footer settings={settings} categories={categories} />
      <MobileActionBar settings={settings} whatsappHref={chat} directionsHref={directionsForToday(today, settings)} />
      <FloatingWhatsApp href={chat} />
    </>
  );
}
