import Image from "next/image";
import Link from "next/link";

export function Wordmark({ name, light = false }: { name: string; light?: boolean }) {
  const [first, ...rest] = name.split(" ");
  return (
    <Link href="/" className="flex items-center gap-3.5" aria-label={`${name} — home`}>
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-gold-soft ring-offset-2 ring-offset-transparent outline outline-1 outline-offset-[5px] outline-gold-soft/40">
        <Image src="/brand/logo.jpg" alt="" fill sizes="44px" className="scale-[1.35] object-cover object-[50%_42%]" priority />
      </span>
      <span className="leading-none">
        <span className={`font-display block text-[1.6rem] font-semibold italic ${light ? "text-ivory" : "text-maroon"}`}>
          {first}
        </span>
        <span className={`font-royal mt-1 block text-[0.58rem] font-medium tracking-[0.34em] uppercase ${light ? "text-gold-soft" : "text-gold"}`}>
          {rest.join(" ")}
        </span>
      </span>
    </Link>
  );
}
