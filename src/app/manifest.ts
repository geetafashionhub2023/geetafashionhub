import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Geeta Fashion Hub",
    short_name: "Geeta Fashion",
    description: "Traditional Indian wear, custom blouses and stitching.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7f0",
    theme_color: "#5e1020",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
