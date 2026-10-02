/** Small gold lotus-and-diamond divider used between headings and copy. */
export function Ornament({ className = "", light = false }: { className?: string; light?: boolean }) {
  const c = light ? "#e6cf9c" : "#b0843a";
  return (
    <svg viewBox="0 0 160 16" className={`h-4 w-40 ${className}`} aria-hidden="true">
      <path d="M0 8h58" stroke={c} strokeWidth="0.75" />
      <path d="M102 8h58" stroke={c} strokeWidth="0.75" />
      <path d="M62 8l4-3 4 3-4 3z" fill={c} />
      <path d="M90 8l4-3 4 3-4 3z" fill={c} />
      <path d="M80 1c3 3 5 5 5 7s-2 4-5 7c-3-3-5-5-5-7s2-4 5-7z" fill="none" stroke={c} strokeWidth="0.9" />
      <circle cx="80" cy="8" r="1.4" fill={c} />
    </svg>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  light = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "center" | "left";
  light?: boolean;
  as?: "h1" | "h2";
}) {
  const center = align === "center";
  return (
    <div className={`reveal ${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && <p className={`eyebrow ${light ? "!text-gold-soft" : ""}`}>{eyebrow}</p>}
      <Tag
        className={`mt-3 text-[2.1rem] leading-[1.08] font-medium sm:text-5xl ${light ? "text-ivory" : "text-maroon-deep"}`}
      >
        {title}
      </Tag>
      <Ornament light={light} className={`mt-4 ${center ? "mx-auto" : ""}`} />
      {intro && (
        <p className={`mt-4 text-[0.98rem] leading-relaxed ${light ? "text-ivory/80" : "text-muted"}`}>{intro}</p>
      )}
    </div>
  );
}
