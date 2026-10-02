import type { Metadata } from "next";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <main className="grid min-h-dvh place-items-center bg-cream px-6">
        <div className="max-w-lg rounded-2xl border border-line bg-white p-8 shadow-sm">
          <h1 className="font-display text-3xl font-semibold text-maroon-deep">Connect Supabase to use the dashboard</h1>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-ink">
            <li>Create a Supabase project and run <code>supabase/migrations/0001_init.sql</code> and <code>supabase/seed.sql</code>.</li>
            <li>Copy <code>.env.example</code> to <code>.env.local</code> and fill in the Supabase URL and keys.</li>
            <li>Create your user in Supabase Auth and add it to the <code>staff</code> table as <code>admin</code>.</li>
            <li>Restart the server and sign in at <code>/admin/login</code>.</li>
          </ol>
          <p className="mt-5 text-xs text-muted">Full instructions are in README.md.</p>
        </div>
      </main>
    );
  }
  return <div className="min-h-dvh bg-cream/60">{children}</div>;
}
