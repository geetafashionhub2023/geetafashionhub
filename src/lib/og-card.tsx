import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/env";

let logoData: string | null = null;

/**
 * Serverless platforms (e.g. Netlify Functions) don't always ship /public inside the
 * function bundle, so fall back to fetching the logo from the deployed site.
 */
async function logo(): Promise<string | null> {
  if (logoData) return logoData;
  let buf: Buffer | null = null;
  try {
    buf = await readFile(path.join(process.cwd(), "public/brand/logo.jpg"));
  } catch {
    try {
      const res = await fetch(`${SITE_URL}/brand/logo.jpg`);
      if (res.ok) buf = Buffer.from(await res.arrayBuffer());
    } catch {
      /* render without logo */
    }
  }
  if (buf) logoData = `data:image/jpeg;base64,${buf.toString("base64")}`;
  return logoData;
}

/** Branded 1200×630 card, used when a page or product has no photo of its own. */
export async function ogCard({ title, subtitle, eyebrow }: { title: string; subtitle: string; eyebrow: string }) {
  const src = await logo();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#5e1020", color: "#fbf7f0" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", flex: 1, border: "2px solid rgba(214,185,126,0.45)", margin: 24 }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#d6b97e", textTransform: "uppercase" }}>{eyebrow}</div>
          <div style={{ fontSize: title.length > 40 ? 58 : 72, lineHeight: 1.05, marginTop: 24, fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 28, color: "rgba(251,247,240,0.78)", marginTop: 28 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", width: 430, height: "100%", alignItems: "flex-end", justifyContent: "center", paddingRight: 48 }}>
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" width={380} height={520} style={{ objectFit: "cover", borderTopLeftRadius: 190, borderTopRightRadius: 190 }} />
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" } },
  );
}
