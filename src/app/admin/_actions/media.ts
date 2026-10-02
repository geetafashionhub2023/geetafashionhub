"use server";

import { requireStaffAction } from "@/lib/auth";
import { processAndUploadImage, type UploadFolder } from "@/lib/upload";

const FOLDERS: UploadFolder[] = ["products", "categories", "site", "instagram"];

export async function uploadImage(formData: FormData): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  try {
    await requireStaffAction();
    const folder = String(formData.get("folder")) as UploadFolder;
    if (!FOLDERS.includes(folder)) return { ok: false, message: "Invalid upload destination." };
    const file = formData.get("file");
    if (!(file instanceof File)) return { ok: false, message: "No file received." };
    return { ok: true, url: await processAndUploadImage(file, folder) };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Upload failed." };
  }
}
