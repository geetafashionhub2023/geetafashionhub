import Image from "next/image";
import { Play } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import type { InstagramPost, SiteSettings } from "@/lib/types";

function handleFrom(url: string) {
  const m = url.match(/instagram\.com\/([^/?#]+)/);
  return m ? `@${m[1]}` : "@instagram";
}

export function InstagramGrid({ posts, settings, limit }: { posts: InstagramPost[]; settings: SiteSettings; limit?: number }) {
  const list = limit ? posts.slice(0, limit) : posts;
  const handle = handleFrom(settings.instagram_url);

  if (!list.length) {
    // Graceful fallback when Instagram isn't configured or is temporarily unavailable.
    return (
      <a
        href={settings.instagram_url}
        target="_blank"
        rel="noopener noreferrer"
        className="reveal group mx-auto flex max-w-xl flex-col items-center gap-4 rounded-[1.5rem] bg-ivory px-8 py-12 text-center shadow-soft ring-1 ring-line"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-tr from-saffron via-burgundy to-maroon text-ivory">
          <InstagramIcon className="h-8 w-8" />
        </span>
        <p className="font-display text-2xl text-maroon-deep">{handle}</p>
        <p className="text-sm text-muted">New arrivals, custom work and behind-the-scenes from our boutique — on Instagram.</p>
        <span className="btn btn-primary mt-2">Follow Us on Instagram</span>
      </a>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
      {list.map((post, i) => (
        <li key={post.id} className="reveal">
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden rounded-xl bg-cream"
            aria-label={post.caption ? `Instagram post: ${post.caption.slice(0, 80)}` : "View post on Instagram"}
          >
            <Image
              src={post.image_url}
              alt={post.caption?.slice(0, 120) || `${settings.business_name} on Instagram`}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading={i < 4 ? "eager" : "lazy"}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-maroon-deep/0 transition-colors duration-300 group-hover:bg-maroon-deep/45">
              <InstagramIcon className="h-8 w-8 text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            {post.is_video && (
              <span className="absolute top-2.5 right-2.5 grid h-7 w-7 place-items-center rounded-full bg-maroon-deep/60 text-ivory">
                <Play className="h-3.5 w-3.5 fill-current" />
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
