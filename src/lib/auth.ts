import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { StaffRole } from "@/lib/types";

export type Staff = { userId: string; email: string | null; role: StaffRole };

/** Verifies the session with Supabase Auth (getUser, not getSession) and looks up the staff role. */
export const getStaff = cache(async (): Promise<Staff | null> => {
  if (!isSupabaseConfigured) return null;
  const supabase = await sessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("staff").select("role").eq("user_id", user.id).maybeSingle();
  if (!data) return null;
  return { userId: user.id, email: user.email ?? null, role: data.role as StaffRole };
});

/** For admin pages: redirect to login when not signed in as staff. */
export async function requireStaffPage(role?: StaffRole): Promise<Staff> {
  const staff = await getStaff();
  if (!staff) redirect("/admin/login");
  if (role === "admin" && staff.role !== "admin") redirect("/admin?denied=1");
  return staff;
}

export class AuthError extends Error {}

/** For server actions: throws when the caller is not authorised. */
export async function requireStaffAction(role?: StaffRole): Promise<Staff> {
  const staff = await getStaff();
  if (!staff) throw new AuthError("You are not signed in.");
  if (role === "admin" && staff.role !== "admin") throw new AuthError("Only admins can change this.");
  return staff;
}
