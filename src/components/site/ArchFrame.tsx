/** Photo framed in a Mughal pointed arch with a gold hairline edge. */
export function ArchFrame({
  children,
  className = "",
  innerClassName = "",
  shadow = true,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  shadow?: boolean;
}) {
  return (
    <div className={`${shadow ? "drop-shadow-[0_18px_24px_rgb(63_9_20/0.22)]" : ""} ${className}`}>
      <div className="arch-royal arch-frame h-full w-full">
        <div className={`arch-royal relative h-full w-full overflow-hidden bg-cream ${innerClassName}`}>{children}</div>
      </div>
    </div>
  );
}
