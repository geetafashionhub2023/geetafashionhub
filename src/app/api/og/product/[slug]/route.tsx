import { getProduct, getSettings } from "@/lib/data";
import { ogCard } from "@/lib/og-card";

export async function GET(_req: Request, ctx: RouteContext<"/api/og/product/[slug]">) {
  const { slug } = await ctx.params;
  const [product, s] = await Promise.all([getProduct(slug), getSettings()]);
  if (!product) return new Response("Not found", { status: 404 });
  return ogCard({
    eyebrow: product.category?.name ?? s.business_name,
    title: product.name,
    subtitle: s.business_name,
  });
}
