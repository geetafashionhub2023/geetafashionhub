import "server-only";
import sharp from "sharp";
import { sessionClient } from "@/lib/supabase/server";

// Netlify Functions cap request bodies at 6 MB; the browser downscales photos before upload.
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 2000;

/** Detect the real file type from magic bytes — never trust the browser-supplied MIME type. */
function sniff(buf: Buffer): "jpeg" | "png" | "webp" | "avif" | "heif" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (buf.toString("ascii", 4, 8) === "ftyp") {
    const brand = buf.toString("ascii", 8, 12);
    if (brand.startsWith("avi")) return "avif";
    if (["heic", "heix", "mif1", "msf1"].includes(brand)) return "heif";
  }
  return null;
}

export type UploadFolder = "products" | "categories" | "site" | "instagram";

/**
 * Validates an uploaded image, re-encodes it as WebP (auto-rotated, resized, with all
 * metadata such as GPS location stripped) and stores it in the public "media" bucket.
 * The upload runs as the signed-in user, so storage RLS also requires a staff role.
 */
export async function processAndUploadImage(file: File, folder: UploadFolder): Promise<string> {
  if (!(file instanceof File) || file.size === 0) throw new Error("No file received.");
  if (file.size > MAX_BYTES) throw new Error("Image is larger than 5 MB after compression. Please use a smaller photo.");

  const input = Buffer.from(await file.arrayBuffer());
  const kind = sniff(input);
  if (!kind) throw new Error("Unsupported file. Please upload a JPEG, PNG, WebP or AVIF image.");

  let output: Buffer;
  try {
    output = await sharp(input, { limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    throw new Error("Could not read this image. Try exporting it as JPEG and uploading again.");
  }

  const now = new Date();
  const path = `${folder}/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.webp`;
  const supabase = await sessionClient();
  const { error } = await supabase.storage.from("media").upload(path, output, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
