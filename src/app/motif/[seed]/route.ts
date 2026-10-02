import { motifSvg } from "@/lib/motif";

export async function GET(_req: Request, ctx: RouteContext<"/motif/[seed]">) {
  const { seed } = await ctx.params;
  const clean = seed.replace(/\.svg$/, "").slice(0, 100);
  return new Response(motifSvg(clean), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
    },
  });
}
