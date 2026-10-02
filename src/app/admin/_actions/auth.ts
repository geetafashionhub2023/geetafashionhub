"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { sessionClient } from "@/lib/supabase/server";
import type { ActionState } from "./shared";

const loginSchema = z.object({ email: z.email(), password: z.string().min(6).max(200) });

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, message: "Enter your email and password." };

  const supabase = await sessionClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  // Same message for every failure so the form doesn't reveal which accounts exist.
  if (error || !data.user) return { ok: false, message: "Incorrect email or password." };

  const { data: staff } = await supabase.from("staff").select("role").eq("user_id", data.user.id).maybeSingle();
  if (!staff) {
    await supabase.auth.signOut();
    return { ok: false, message: "This account does not have dashboard access." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await sessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
