import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export function Breadcrumbs({ items, light = false }: { items: { name: string; path: string }[]; light?: boolean }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <nav aria-label="Breadcrumb" className={`text-xs ${light ? "text-ivory/65" : "text-muted"}`}>
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((item, i) => (
            <li key={item.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />}
              {i < all.length - 1 ? (
                <Link href={item.path} className={light ? "hover:text-champagne" : "hover:text-maroon"}>
                  {item.name}
                </Link>
              ) : (
                <span aria-current="page" className={light ? "text-champagne" : "text-ink"}>
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
