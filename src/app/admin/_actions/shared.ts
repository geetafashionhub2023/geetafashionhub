import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AuthError } from "@/lib/auth";
import { fieldErrors, type FieldErrors } from "@/lib/validation";

export type ActionState = { ok: boolean; message: string; errors?: FieldErrors } | null;

/** Re-render every public page (ISR) after content changes. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

export function fromError(error: unknown): ActionState {
  if (error instanceof AuthError) return { ok: false, message: error.message };
  if (error instanceof z.ZodError) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: fieldErrors(error) };
  }
  console.error("[admin action]", error);
  const pg = error as { code?: string; message?: string };
  if (pg?.code === "23505") return { ok: false, message: "That slug is already used. Choose a different one." };
  return { ok: false, message: pg?.message || "Something went wrong. Please try again." };
}
