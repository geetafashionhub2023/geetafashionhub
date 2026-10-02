import Link from "next/link";
import { Wordmark } from "@/components/site/Wordmark";
import { MobileNav } from "@/components/site/MobileNav";
import { WhatsAppIcon } from "@/components/icons";
import { mainNav, secondaryNav } from "@/components/site/nav";
import { whatsappHref, messages } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/types";

export function Header({ settings }: { settings: SiteSettings }) {
  const chat = whatsappHref(settings, messages.general(settings));
  return (
    <>
      <div className="bg-oxblood text-center">
        <p className="font-royal container-page truncate py-2 text-[0.62rem] tracking-[0.28em] text-gold-soft uppercase sm:text-[0.68rem]">
          Bridal Couture <span className="mx-2 text-gold/60">◆</span> Festive Wear <span className="mx-2 hidden text-gold/60 sm:inline">◆</span>
          <span className="hidden sm:inline">Custom Stitching</span>
        </p>
      </div>
      <header className="sticky top-0 z-40 border-b border-gold-soft/30 bg-ivory/92 backdrop-blur-md supports-[backdrop-filter]:bg-ivory/80">
        <div className="container-page flex h-[4.75rem] items-center justify-between gap-6">
          <Wordmark name={settings.business_name} />
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="font-royal flex items-center gap-7 text-[0.7rem] tracking-[0.18em] uppercase">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative py-2 text-ink transition-colors hover:text-maroon after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-0 after:bg-gold after:transition-transform hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={chat} target="_blank" rel="noopener noreferrer" className="btn btn-primary hidden !min-h-10 !px-5 !py-2 text-sm md:inline-flex">
              <WhatsAppIcon className="h-4 w-4" />
              Enquire
            </a>
            <MobileNav items={[...mainNav, ...secondaryNav]} chatHref={chat} instagramUrl={settings.instagram_url} />
          </div>
        </div>
      </header>
    </>
  );
}
