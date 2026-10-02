import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/env";
import "./globals.css";

// Fonts are self-hosted (latin subset, variable weights) so builds don't depend on
// fetching from Google Fonts at build time.
const cormorant = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin.woff2", weight: "400 700", style: "normal" },
    { path: "./fonts/cormorant-garamond-italic-latin.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const cinzel = localFont({
  src: "./fonts/cinzel-latin.woff2",
  weight: "400 900",
  variable: "--font-cinzel",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Geeta Fashion Hub | Traditional Indian Wear & Custom Stitching",
    template: "%s | Geeta Fashion Hub",
  },
  description:
    "Designer and antique blouses, chaniya choli, salwar kameez, bridal and kids' ethnic wear, with custom stitching and alterations at Geeta Fashion Hub.",
  applicationName: "Geeta Fashion Hub",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#5e1020",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${cinzel.variable} ${manrope.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
