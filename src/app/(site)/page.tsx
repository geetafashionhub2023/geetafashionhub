import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Crown, Gem, HeartHandshake, Ruler, Scissors, Sparkles, Store, Users } from "lucide-react";
import { SectionHeading, Ornament } from "@/components/site/Ornament";
import { TodayLocationCard } from "@/components/site/TodayLocationCard";
import { ProductGrid } from "@/components/site/ProductCard";
import { ProductImage } from "@/components/site/ProductImage";
import { ArchFrame } from "@/components/site/ArchFrame";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { InstagramGrid } from "@/components/site/InstagramGrid";
import { PermanentLocation } from "@/components/site/PermanentLocation";
import { InstagramIcon } from "@/components/icons";
import { getCategories, getFeaturedProducts, getProducts, getSettings, getTestimonials, getTodayLocation } from "@/lib/data";
import { getInstagramPosts } from "@/lib/instagram";
import { BRAND_IMAGES } from "@/lib/brand-images";
import { pageMetadata } from "@/lib/seo";
import { messages } from "@/lib/whatsapp";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.business_name} | Bridal, Festive & Traditional Indian Wear`;
  return {
    ...pageMetadata(settings, {
      title,
      description:
        "Bridal lehengas, antique and designer blouses, chaniya choli, salwar suits and kids' ethnic wear, with bespoke stitching. Chat with us on WhatsApp or visit the boutique.",
      path: "/",
      image: settings.hero_image_url || BRAND_IMAGES.hero,
    }),
    title: { absolute: title },
  };
}

const FEATURED_CATEGORY_SLUGS = [
  "bridal-wear",
  "antique-blouses",
  "chaniya-choli",
  "wedding-collection",
  "custom-blouses",
  "salwar-kameez",
  "girls-wear",
  "festive-wear",
];

export default async function HomePage() {
  const [settings, today, categories, featured, products, testimonials, posts] = await Promise.all([
    getSettings(),
    getTodayLocation(),
    getCategories(),
    getFeaturedProducts(8),
    getProducts(),
    getTestimonials(),
    getInstagramPosts(),
  ]);

  const featuredCats = [
    ...FEATURED_CATEGORY_SLUGS.map((s) => categories.find((c) => c.slug === s)).filter((c) => c != null),
    ...categories.filter((c) => !FEATURED_CATEGORY_SLUGS.includes(c.slug)),
  ].slice(0, 8);

  const bridalIds = new Set(categories.filter((c) => ["bridal-wear", "wedding-collection"].includes(c.slug)).map((c) => c.id));
  const bridal = products.filter((p) => p.category_id && bridalIds.has(p.category_id));
  const bridalHero = bridal.find((p) => p.images[0]);
  const bridalRest = bridal.filter((p) => p !== bridalHero).slice(0, 3);
  const heroImage = settings.hero_image_url || BRAND_IMAGES.hero;

  return (
    <>
      {/* HERO — clean studio portrait; text sits on the plain backdrop */}
      <section className="relative isolate overflow-hidden bg-[#f1e7da]">
        {/* Mobile / tablet: photo on top, copy below on ivory */}
        <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:hidden">
          <Image src={heroImage} alt={`Brides in ${settings.business_name} bridal couture`} fill priority sizes="100vw" className="object-cover object-[72%_20%] sm:object-[60%_25%]" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f1e7da] to-transparent" />
        </div>
        {/* Desktop: full-bleed photo */}
        <div className="absolute inset-y-0 right-0 left-[40%] -z-10 hidden lg:block">
          {settings.hero_video_url ? (
            <video className="h-full w-full object-cover" src={settings.hero_video_url} autoPlay muted loop playsInline preload="metadata" poster={heroImage} />
          ) : (
            <Image src={heroImage} alt="" fill priority sizes="60vw" className="object-cover object-[62%_22%]" />
          )}
          {/* Narrow blend into the champagne panel; the photo itself stays crisp */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#f1e7da] to-transparent" />
        </div>

        <div className="bg-[#f1e7da] lg:bg-transparent">
          <div className="container-page flex flex-col pt-2 pb-40 lg:min-h-[46rem] lg:justify-center lg:pt-20 lg:pb-48">
            <div className="hero-in max-w-xl">
              <p className="eyebrow">Bridal · Festive · Bespoke Couture</p>
              <h1 className="mt-4 text-[2.75rem] leading-[1.03] font-medium text-maroon-deep sm:text-6xl lg:text-[4.5rem]">
                Traditional Elegance, <em className="text-burgundy lg:block">Made Just for You.</em>
              </h1>
              <Ornament className="mt-6" />
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink/80 sm:text-lg">
                Discover beautiful Indian ethnic wear, custom designs and expert stitching for every celebration.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/shop" className="btn btn-primary">
                  Explore Collection <ArrowRight className="h-4 w-4" />
                </Link>
                <WhatsAppButton settings={settings} message={messages.general(settings)} variant="outline">
                  Chat on WhatsApp
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TODAY'S LOCATION */}
      <section aria-label="Today's store location" className="container-page relative z-10 -mt-28">
        <TodayLocationCard today={today} settings={settings} />
      </section>

      {/* COLLECTIONS */}
      <section className="container-page py-20 md:py-28">
        <SectionHeading eyebrow="The Royal Collections" title="Crafted for Every Occasion" intro="From heirloom antique blouses to bridal lehengas and little ones' festive wear." />
        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 lg:gap-x-8">
          {featuredCats.map((c, i) => (
            <li key={c.id} className="reveal">
              <Link href={`/shop/${c.slug}`} className="group block text-center">
                <ArchFrame className="relative aspect-[3/4]">
                  <div className="absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-[1.06]">
                    <ProductImage src={c.image_url} alt={c.name} seed={c.slug} sizes="(min-width: 640px) 25vw, 50vw" priority={i < 2} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-oxblood/70 via-transparent to-transparent" />
                  <span className="font-royal absolute inset-x-0 bottom-4 text-[0.62rem] tracking-[0.25em] text-champagne uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    Explore
                  </span>
                </ArchFrame>
                <h3 className="mt-4 text-xl font-medium text-maroon-deep sm:text-[1.4rem]">{c.name}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="bg-paper py-20 md:py-28">
          <div className="container-page">
            <SectionHeading eyebrow="Most Loved" title="Loved at the Boutique" intro="Pieces our customers ask about most. Tap any outfit for details, then ask about it on WhatsApp." />
            <div className="mt-14">
              <ProductGrid products={featured} />
            </div>
            <div className="mt-14 text-center">
              <Link href="/shop" className="btn btn-outline">
                View the Full Collection <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* BRIDAL ATELIER */}
      <section className="bg-palace royal-inset py-24 text-ivory md:py-32">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="reveal relative mx-auto w-full max-w-md">
            <ArchFrame className="relative aspect-[3/4]" shadow={false}>
              <Image src={bridalHero?.images[0] ?? BRAND_IMAGES.bridal} alt={bridalHero?.image_alt ?? "Bride in a maroon velvet lehenga"} fill sizes="(min-width: 1024px) 28rem, 90vw" className="object-cover" />
            </ArchFrame>
            <Crown className="absolute -top-7 left-1/2 h-7 w-7 -translate-x-1/2 text-gold-soft" aria-hidden />
          </div>
          <div>
            <p className="eyebrow !text-gold-soft">The Bridal Atelier</p>
            <h2 className="mt-4 text-[2.4rem] leading-[1.05] font-medium sm:text-6xl">
              For the Days You&apos;ll <em className="text-gold-foil">Always Remember</em>
            </h2>
            <Ornament light className="mt-5" />
            <p className="mt-6 max-w-lg leading-relaxed text-ivory/80">
              Bridal lehengas, couture blouses and coordinated looks for the whole family, each designed with you and
              stitched to your measurements over personal fittings.
            </p>
            {bridalRest.length > 0 && (
              <ul className="mt-10 grid grid-cols-3 gap-4">
                {bridalRest.map((p) => (
                  <li key={p.id}>
                    <Link href={`/product/${p.slug}`} className="group block">
                      <ArchFrame className="relative aspect-[3/4]" shadow={false}>
                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                          <ProductImage src={p.images[0] ?? null} alt={p.image_alt || p.name} seed={p.slug} sizes="10rem" />
                        </div>
                      </ArchFrame>
                      <p className="mt-2.5 text-center text-sm leading-snug text-champagne">{p.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop/bridal-wear" className="btn btn-gold">Explore Bridal Couture</Link>
              <WhatsAppButton settings={settings} message={messages.category(settings, "a bridal fitting appointment")} variant="ghost-light">
                Book a Bridal Fitting
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM STITCHING */}
      <section className="container-page grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
        <div className="reveal">
          <p className="eyebrow">Bespoke Stitching</p>
          <h2 className="mt-3 text-[2.2rem] leading-[1.06] font-medium text-maroon-deep sm:text-5xl">
            Your Design, <em>Stitched to Fit You</em>
          </h2>
          <Ornament className="mt-4" />
          <p className="mt-5 leading-relaxed text-muted">
            Bring your fabric, a photo or just an idea. We stitch blouses, chaniya cholis, suits and kids&apos; outfits to
            your measurements, and offer alterations that make every piece fit beautifully.
          </p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { Icon: Sparkles, t: "Share your idea", d: "A photo, sketch or reference on WhatsApp." },
              { Icon: Ruler, t: "Measurements", d: "At the boutique, or share yours." },
              { Icon: Scissors, t: "Expert stitching", d: "Cut and finished with care." },
              { Icon: HeartHandshake, t: "Fitting & finish", d: "Adjusted until it's just right." },
            ].map(({ Icon, t, d }, i) => (
              <li key={t} className="flex gap-3 rounded-2xl bg-ivory p-4 ring-1 ring-line">
                <span className="font-royal grid h-9 w-9 shrink-0 place-items-center rounded-full bg-maroon text-xs text-champagne">{i + 1}</span>
                <span>
                  <span className="flex items-center gap-1.5 font-semibold text-maroon-deep"><Icon className="h-4 w-4 text-gold" /> {t}</span>
                  <span className="mt-0.5 block text-sm text-muted">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton settings={settings} message={messages.stitching()}>Discuss Your Design on WhatsApp</WhatsAppButton>
            <Link href="/custom-stitching" className="btn btn-outline">Learn More</Link>
          </div>
        </div>
        <div className="reveal relative mx-auto grid w-full max-w-lg grid-cols-2 gap-4">
          <ArchFrame className="relative mt-12 aspect-[3/4]">
            <Image src={BRAND_IMAGES.blouseBack} alt="Back of a red designer blouse with a tie-up" fill sizes="(min-width: 1024px) 15rem, 45vw" className="object-cover" />
          </ArchFrame>
          <ArchFrame className="relative aspect-[3/4]">
            <Image src={BRAND_IMAGES.zari} alt="Close-up of hand-done zari embroidery" fill sizes="(min-width: 1024px) 15rem, 45vw" className="object-cover" />
          </ArchFrame>
        </div>
      </section>

      {/* CRAFT BAND */}
      <section className="bg-oxblood text-ivory">
        <ul className="grid sm:grid-cols-3">
          {[
            { src: BRAND_IMAGES.zari, t: "Zari & Zardozi", d: "Metallic thread work for bridal grandeur" },
            { src: BRAND_IMAGES.zari2, t: "Heirloom Borders", d: "Motifs inspired by royal textiles" },
            { src: BRAND_IMAGES.zari3, t: "Finished by Hand", d: "Every edge, lining and hook done with care" },
          ].map((c) => (
            <li key={c.t} className="group relative aspect-[4/3] overflow-hidden sm:aspect-[3/4] lg:aspect-[4/5]">
              <Image src={c.src} alt={c.d} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover opacity-80 transition duration-[1.2s] group-hover:scale-105 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-oxblood via-oxblood/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-center">
                <p className="text-3xl text-gold-foil">{c.t}</p>
                <p className="mt-1 text-sm text-ivory/75">{c.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* LOOKBOOK / INSTAGRAM */}
      {settings.instagram_mode !== "off" && (
        <section className="container-page py-20 md:py-28">
          <SectionHeading eyebrow="The Lookbook" title="Follow Our Story on Instagram" intro="New arrivals, bridal moments and our latest custom work." />
          <div className="mt-12">
            <InstagramGrid posts={posts} settings={settings} limit={8} />
          </div>
          {posts.length > 0 && (
            <div className="mt-10 text-center">
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <InstagramIcon className="h-5 w-5" /> Follow Us on Instagram
              </a>
            </div>
          )}
        </section>
      )}

      {/* WHY CHOOSE US */}
      <section className="bg-paper py-20 md:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="The Geeta Promise" title="A Boutique That Knows You" />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Ruler, t: "Made to your measure", d: "Custom stitching and alterations so every outfit fits you, not a size chart." },
              { Icon: Gem, t: "Traditional craft", d: "Antique finishes, zari, mirror and embroidery work rooted in Indian tradition." },
              { Icon: Users, t: "For the whole family", d: "Bridal, women's, girls' and children's ethnic wear under one roof." },
              { Icon: Store, t: "Visit or WhatsApp", d: "See fabrics in person, or ask about any piece directly on WhatsApp." },
            ].map(({ Icon, t, d }) => (
              <li key={t} className="reveal rounded-t-[10rem] rounded-b-2xl bg-ivory px-7 pt-10 pb-8 text-center ring-1 ring-gold-soft/40">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-maroon text-champagne ring-4 ring-champagne/40">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-[1.4rem] font-medium text-maroon-deep">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TESTIMONIALS (only real, owner-entered) */}
      {testimonials.length > 0 && (
        <section className="container-page py-20 md:py-28">
          <SectionHeading eyebrow="Kind Words" title="From Our Customers" />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <li key={t.id} className="reveal flex flex-col rounded-[1.5rem] bg-ivory p-8 shadow-soft ring-1 ring-line">
                <span className="font-display text-6xl leading-none text-gold-soft" aria-hidden>&ldquo;</span>
                <blockquote className="font-display -mt-4 flex-1 text-xl leading-relaxed text-ink italic">{t.quote}</blockquote>
                <p className="mt-6 text-sm font-semibold text-maroon">{t.name}</p>
                {t.context && <p className="text-xs text-muted">{t.context}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* PERMANENT STORE */}
      <section className={testimonials.length > 0 ? "bg-paper py-20 md:py-28" : "py-20 md:py-28"}>
        <div className="container-page">
          <SectionHeading eyebrow="Visit the Boutique" title="Our Permanent Store" intro="See fabrics, try on outfits and get measured in person." />
          <div className="mt-12">
            <PermanentLocation settings={settings} />
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="container-page pb-20 md:pb-28">
        <div className="reveal bg-palace royal-inset relative overflow-hidden rounded-[2rem] px-6 py-16 text-center text-ivory sm:px-12">
          <Crown className="mx-auto h-8 w-8 text-gold-soft" aria-hidden />
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl leading-tight font-medium sm:text-5xl">
            Seen something you love? <em className="text-gold-foil">Ask us on WhatsApp.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ivory/75">Prices, sizes, colours, customisation or where we are today. Just send us a message.</p>
          <div className="mt-8 flex justify-center">
            <WhatsAppButton settings={settings} message={messages.general(settings)} />
          </div>
        </div>
      </section>
    </>
  );
}
