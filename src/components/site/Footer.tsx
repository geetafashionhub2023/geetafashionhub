import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Wordmark } from "@/components/site/Wordmark";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/icons";
import { mainNav, secondaryNav } from "@/components/site/nav";
import { BusinessHoursList } from "@/components/site/BusinessHours";
import { fullAddress, telHref } from "@/lib/format";
import { messages, whatsappHref } from "@/lib/whatsapp";
import type { Category, SiteSettings } from "@/lib/types";

export function Footer({ settings, categories }: { settings: SiteSettings; categories: Category[] }) {
  const address = fullAddress(settings);
  const tel = telHref(settings.phone);
  const social = [
    { href: settings.instagram_url, label: "Instagram", Icon: InstagramIcon },
    settings.facebook_url && { href: settings.facebook_url, label: "Facebook", Icon: FacebookIcon },
    settings.youtube_url && { href: settings.youtube_url, label: "YouTube", Icon: YouTubeIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof InstagramIcon }[];

  return (
    <footer className="bg-palace pb-24 text-ivory/85 md:pb-0">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
        <div>
          <Wordmark name={settings.business_name} light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/70">
            Traditional Indian clothing, custom blouses and expert stitching for women, girls and children.
          </p>
          <div className="mt-6 flex gap-3">
            {social.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-gold-soft/40 transition-colors hover:bg-gold-soft hover:text-maroon-deep">
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
            <a href={whatsappHref(settings, messages.general(settings))} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
              className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-gold-soft/40 transition-colors hover:bg-gold-soft hover:text-maroon-deep">
              <WhatsAppIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="eyebrow !text-gold-soft">Explore</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[...mainNav, ...secondaryNav].map((i) => (
              <li key={i.href}><Link href={i.href} className="hover:text-champagne">{i.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow !text-gold-soft">Shop</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {categories.slice(0, 8).map((c) => (
              <li key={c.id}><Link href={`/shop/${c.slug}`} className="hover:text-champagne">{c.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow !text-gold-soft">Permanent Store</h2>
          <address className="mt-5 space-y-3 text-sm not-italic">
            <p className="font-display text-xl text-ivory">{settings.business_name}</p>
            <p className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
              <span>
                {address && (
                  <>
                    {address}
                    <br />
                  </>
                )}
                <a href={settings.maps_url} target="_blank" rel="noopener noreferrer" className="text-champagne underline decoration-gold-soft/50 underline-offset-4 hover:decoration-champagne">
                  Open in Google Maps
                </a>
              </span>
            </p>
            {tel && (
              <p className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" /><a href={tel} className="hover:text-champagne">{settings.phone}</a></p>
            )}
            {settings.email && (
              <p className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" /><a href={`mailto:${settings.email}`} className="hover:text-champagne">{settings.email}</a></p>
            )}
          </address>
          <div className="mt-5 text-sm">
            <BusinessHoursList settings={settings} light />
          </div>
        </div>
      </div>
      <div className="border-t border-gold-soft/20">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-ivory/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.business_name}. Made with care in India.</p>
          <p>Traditional wear · Custom stitching · Alterations</p>
        </div>
      </div>
    </footer>
  );
}
