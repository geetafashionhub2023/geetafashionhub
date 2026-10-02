/** Placeholder artwork for items without a photo (see lib/motif.ts). Served as a cached SVG file. */
export function Motif({ seed, label, className = "" }: { seed: string; label?: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/motif/${encodeURIComponent(seed)}.svg`}
      alt={label ?? ""}
      loading="lazy"
      decoding="async"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}
