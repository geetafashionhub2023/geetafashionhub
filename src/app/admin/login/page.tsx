import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/site/Wordmark";
import { LoginForm } from "@/components/admin/LoginForm";
import { getStaff } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getStaff()) redirect("/admin");
  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center"><Wordmark name="Geeta Fashion Hub" /></div>
        <div className="mt-8 rounded-2xl border border-line bg-white p-7 shadow-sm">
          <h1 className="font-display text-3xl font-semibold text-maroon-deep">Dashboard sign in</h1>
          <p className="mt-1 text-sm text-muted">For shop staff only.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
