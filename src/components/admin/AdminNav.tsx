"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Camera, FolderTree, LayoutDashboard, MapPin, MessageSquareQuote, Shirt, Star } from "lucide-react";

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = [
    { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/admin/location", label: "Today's Location", Icon: MapPin },
    { href: "/admin/products", label: "Products", Icon: Shirt },
    { href: "/admin/categories", label: "Categories", Icon: FolderTree },
    { href: "/admin/featured", label: "Featured", Icon: Star },
    { href: "/admin/instagram", label: "Instagram", Icon: Camera },
    { href: "/admin/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
    ...(isAdmin ? [{ href: "/admin/settings", label: "Business Info", Icon: Building2 }] : []),
  ];
  return (
    <nav aria-label="Admin" className="overflow-x-auto px-3 pb-3 [scrollbar-width:none] lg:pb-0">
      <ul className="flex gap-1 lg:flex-col">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap ${active ? "bg-white/15 text-ivory" : "text-ivory/75 hover:bg-white/10"}`}>
                <Icon className="h-4 w-4" /> {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
