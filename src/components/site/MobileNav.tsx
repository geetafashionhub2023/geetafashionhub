"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";

export function MobileNav({
  items,
  chatHref,
  instagramUrl,
}: {
  items: { href: string; label: string }[];
  chatHref: string;
  instagramUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-11 w-11 place-items-center rounded-full text-maroon hover:bg-cream"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-[4.75rem] h-[calc(100dvh-4.75rem)] z-40 overflow-y-auto bg-ivory"
      >
        <nav aria-label="Mobile" className="container-page py-8">
          <ul className="divide-y divide-line/70 border-y border-line/70">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`font-display flex items-center justify-between py-4 text-2xl ${pathname.startsWith(item.href) ? "text-burgundy" : "text-maroon-deep"}`}
                >
                  {item.label}
                  <span className="text-gold" aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <a href={chatHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
              <WhatsAppIcon className="h-5 w-5" /> Chat with Us on WhatsApp
            </a>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">
              <InstagramIcon className="h-5 w-5" /> Follow on Instagram
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
