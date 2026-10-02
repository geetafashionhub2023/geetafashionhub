import Image from "next/image";
import { Motif } from "@/components/site/Motif";

export function ProductImage({
  src,
  alt,
  seed,
  sizes,
  priority = false,
  className = "",
}: {
  src: string | null;
  alt: string;
  seed: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) return <Motif seed={seed} label={alt} className={className} />;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover object-[50%_22%] ${className}`}
    />
  );
}
