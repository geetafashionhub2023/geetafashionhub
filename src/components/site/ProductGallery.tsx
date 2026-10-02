"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Motif } from "@/components/site/Motif";

/** Swipeable (CSS scroll-snap) gallery with thumbnail navigation. */
export function ProductGallery({ images, alt, seed }: { images: string[]; alt: string; seed: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="arch-royal relative aspect-[4/5] overflow-hidden">
        <Motif seed={seed} label={alt} />
      </div>
    );
  }

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={track}
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="arch-royal flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overflow-y-hidden bg-cream [scrollbar-width:none]"
        aria-label="Product images"
        tabIndex={0}
      >
        {images.map((src, i) => (
          <div key={src} className="relative h-full w-full shrink-0 snap-center">
            <Image
              src={src}
              alt={images.length > 1 ? `${alt} — view ${i + 1} of ${images.length}` : alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-3" role="tablist" aria-label="Choose image">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Show image ${i + 1}`}
              onClick={() => go(i)}
              className={`relative h-16 w-14 overflow-hidden rounded-lg ring-2 transition ${active === i ? "ring-gold" : "ring-transparent opacity-70 hover:opacity-100"}`}
            >
              <Image src={src} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
