"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { uploadImage } from "@/app/admin/_actions/media";
import type { UploadFolder } from "@/lib/upload";

const MAX_EDGE = 2400;

/**
 * Shrink large phone photos in the browser before upload: faster on mobile data, and
 * keeps requests under the hosting platform's body limit (6 MB on Netlify Functions).
 * The server still validates and re-encodes everything.
 */
async function prepareForUpload(file: File): Promise<File> {
  if (file.size < 1.5 * 1024 * 1024 || typeof createImageBitmap !== "function") return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file; // the browser can't decode it (e.g. some HEIC files) — let the server decide
  }
}

async function uploadFiles(files: FileList, folder: UploadFolder, onUrl: (url: string) => void, onError: (m: string) => void) {
  for (const original of Array.from(files)) {
    const file = await prepareForUpload(original);
    const body = new FormData();
    body.set("folder", folder);
    body.set("file", file);
    const res = await uploadImage(body);
    if (res.ok) onUrl(res.url);
    else onError(`${file.name}: ${res.message}`);
  }
}

/** Multiple images, first = main image. Submits as repeated hidden "images" inputs. */
export function ImageManager({ name, initial, folder, max = 12 }: { name: string; initial: string[]; folder: UploadFolder; max?: number }) {
  const [urls, setUrls] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  const move = (i: number, d: number) =>
    setUrls((u) => {
      const next = [...u];
      const j = i + d;
      if (j < 0 || j >= next.length) return u;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div>
      {urls.map((u) => <input key={u} type="hidden" name={name} value={u} />)}
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {urls.map((u, i) => (
          <li key={u} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-line bg-cream">
            <Image src={u} alt="" fill sizes="160px" className="object-cover" />
            {i === 0 && <span className="absolute top-1.5 left-1.5 rounded-full bg-maroon px-2 py-0.5 text-[10px] font-bold text-ivory">MAIN</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/70 to-transparent p-1.5 text-white">
              <button type="button" onClick={() => move(i, -1)} aria-label="Move left" className="rounded p-1 hover:bg-white/20"><ArrowLeft className="h-4 w-4" /></button>
              {i !== 0 && <button type="button" onClick={() => setUrls((x) => [u, ...x.filter((y) => y !== u)])} aria-label="Make main image" className="rounded p-1 hover:bg-white/20"><Star className="h-4 w-4" /></button>}
              <button type="button" onClick={() => setUrls((x) => x.filter((y) => y !== u))} aria-label="Remove image" className="rounded p-1 hover:bg-white/20"><Trash2 className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(i, 1)} aria-label="Move right" className="rounded p-1 hover:bg-white/20"><ArrowRight className="h-4 w-4" /></button>
            </div>
          </li>
        ))}
        {urls.length < max && (
          <li>
            <button
              type="button"
              disabled={pending}
              onClick={() => input.current?.click()}
              className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line text-sm text-muted hover:border-gold hover:text-maroon"
            >
              {pending ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
              {pending ? "Uploading…" : "Add photos"}
            </button>
          </li>
        )}
      </ul>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={(e) => {
          const files = e.target.files;
          if (!files?.length) return;
          setError(null);
          start(() =>
            uploadFiles(files, folder, (url) => setUrls((x) => (x.length < max ? [...x, url] : x)), setError).finally(() => {
              if (input.current) input.current.value = "";
            }),
          );
        }}
      />
      <p className="mt-2 text-xs text-muted">JPEG, PNG, WebP or AVIF. Large phone photos are shrunk automatically and converted to WebP; location data is removed.</p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

/** One optional image (category image, OG image, hero image…). */
export function SingleImageField({ name, initial, folder, aspect = "aspect-[4/3]" }: { name: string; initial: string | null; folder: UploadFolder; aspect?: string }) {
  const [url, setUrl] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-start gap-4">
      <input type="hidden" name={name} value={url ?? ""} />
      <div className={`relative w-32 shrink-0 overflow-hidden rounded-xl border border-line bg-cream ${aspect}`}>
        {url ? <Image src={url} alt="" fill sizes="128px" className="object-cover" /> : <span className="absolute inset-0 grid place-items-center text-xs text-muted">No image</span>}
      </div>
      <div className="flex flex-col gap-2">
        <button type="button" disabled={pending} onClick={() => input.current?.click()} className="btn btn-outline !min-h-9 !px-4 !py-1.5 text-xs">
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
          {url ? "Replace" : "Upload"}
        </button>
        {url && <button type="button" onClick={() => setUrl(null)} className="text-left text-xs text-red-600 hover:underline">Remove</button>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        onChange={(e) => {
          const files = e.target.files;
          if (!files?.length) return;
          setError(null);
          start(() => uploadFiles(files, folder, setUrl, setError));
        }}
      />
    </div>
  );
}
