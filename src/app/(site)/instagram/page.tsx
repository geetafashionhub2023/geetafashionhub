import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/Ornament";
import { InstagramGrid } from "@/components/site/InstagramGrid";
import { InstagramIcon } from "@/components/icons";
import { getSettings } from "@/lib/data";
import { getInstagramPosts } from "@/lib/instagram";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 900;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata(s, {
    title: "Instagram — Latest from the Boutique",
    description: `New arrivals, custom stitching work and festive looks from ${s.business_name} on Instagram.`,
    path: "/instagram",
  });
}

export default async function InstagramPage() {
  const [s, posts] = await Promise.all([getSettings(), getInstagramPosts()]);
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs items={[{ name: "Instagram", path: "/instagram" }]} />
      <div className="mt-8">
        <SectionHeading as="h1" eyebrow="As Seen on Instagram" title="Fresh From the Boutique" intro="New arrivals, custom work and celebrations — follow along for the latest." />
      </div>
      <div className="mt-8 flex justify-center">
        <a href={s.instagram_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          <InstagramIcon className="h-5 w-5" /> Follow Us on Instagram
        </a>
      </div>
      <div className="mt-12">
        <InstagramGrid posts={posts} settings={s} />
      </div>
    </div>
  );
}
