import { getSettings } from "@/lib/data";
import { ogCard } from "@/lib/og-card";

export async function GET() {
  const s = await getSettings();
  return ogCard({
    eyebrow: "Traditional Wear · Custom Stitching",
    title: s.business_name,
    subtitle: "Traditional elegance, made just for you.",
  });
}
