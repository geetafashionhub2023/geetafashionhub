import Link from "next/link";
import { ArchFrame } from "@/components/site/ArchFrame";
import { ProductImage } from "@/components/site/ProductImage";
import { availabilityLabel, formatPrice, productMainImage } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false, light = false }: { product: Product; priority?: boolean; light?: boolean }) {
  const img = productMainImage(product);
  return (
    <article className="group reveal">
      <Link href={`/product/${product.slug}`} className="block">
        <ArchFrame className="relative aspect-[3/4]">
          <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]">
            <ProductImage
              src={img}
              alt={product.image_alt || product.name}
              seed={product.slug}
              sizes="(min-width: 1280px) 300px, (min-width: 768px) 30vw, 50vw"
              priority={priority}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-oxblood/55 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {product.availability !== "in_stock" && (
            <span className="font-royal absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ivory/95 px-3 py-1 text-[0.6rem] tracking-[0.14em] whitespace-nowrap text-maroon uppercase shadow-soft">
              {availabilityLabel[product.availability]}
            </span>
          )}
        </ArchFrame>
        <div className="mt-5 px-1 text-center">
          {product.category && (
            <p className={`eyebrow !text-[0.58rem] ${light ? "!text-gold-soft" : ""}`}>{product.category.name}</p>
          )}
          <h3 className={`mt-1.5 text-lg leading-snug font-medium sm:text-[1.35rem] ${light ? "text-ivory" : "text-maroon-deep"}`}>
            {product.name}
          </h3>
          <p className={`mt-1 text-sm tracking-wide ${light ? "text-champagne" : "text-burgundy"}`}>{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
