import Image from "next/image";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { Motif } from "@/components/site/Motif";
import type { Category } from "@/lib/types";

/**
 * Visual category navigator: round photo medallions with labels.
 * One scrollable row on every screen size (snap scrolling, edge fades),
 * with enough padding that rings and labels are never clipped.
 */
export function CategoryChips({ categories, active }: { categories: Category[]; active?: string }) {
  const item = "group flex w-[5.5rem] shrink-0 snap-start flex-col items-center gap-2.5 text-center sm:w-24";
  const ring = (isActive: boolean) =>
    `relative grid h-[4.5rem] w-[4.5rem] place-items-center overflow-hidden rounded-full ring-2 ring-offset-[3px] ring-offset-ivory transition sm:h-20 sm:w-20 ${
      isActive ? "ring-maroon" : "ring-gold-soft/60 group-hover:ring-gold"
    }`;
  const label = (isActive: boolean) =>
    `block text-[0.72rem] leading-tight font-semibold ${isActive ? "text-maroon" : "text-ink/80 group-hover:text-maroon"}`;

  return (
    <nav aria-label="Categories" className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-ivory to-transparent md:w-10" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-ivory to-transparent md:w-10" aria-hidden />
      <ul className="-mx-5 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pt-2 pb-3 [scrollbar-width:none] sm:gap-5 md:mx-0 md:px-6 [&::-webkit-scrollbar]:hidden">
        <li>
          <Link href="/shop" className={item} aria-current={!active ? "page" : undefined}>
            <span className={`${ring(!active)} bg-maroon text-champagne`}>
              <LayoutGrid className="h-6 w-6" />
            </span>
            <span className={label(!active)}>All Pieces</span>
          </Link>
        </li>
        {categories.map((c) => {
          const isActive = active === c.slug;
          return (
            <li key={c.id}>
              <Link href={`/shop/${c.slug}`} className={item} aria-current={isActive ? "page" : undefined}>
                <span className={`${ring(isActive)} bg-cream`}>
                  {c.image_url ? (
                    <Image src={c.image_url} alt="" fill sizes="80px" className="object-cover object-[50%_25%] transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <Motif seed={c.slug} />
                  )}
                </span>
                <span className={label(isActive)}>{c.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
