import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireStaffPage } from "@/lib/auth";
import { signOut } from "@/app/admin/_actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaffPage();
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-line bg-maroon-deep text-ivory lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-6">
          <Link href="/admin" className="font-display text-2xl italic">Geeta <span className="text-sm not-italic tracking-[0.25em] text-gold-soft uppercase">Admin</span></Link>
          <p className="hidden text-xs text-ivory/60 lg:mt-1 lg:block">{staff.email} · {staff.role}</p>
        </div>
        <AdminNav isAdmin={staff.role === "admin"} />
        <div className="hidden gap-1 px-3 pb-6 lg:absolute lg:bottom-0 lg:flex lg:w-full lg:flex-col">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ivory/75 hover:bg-white/10"><ExternalLink className="h-4 w-4" /> View website</Link>
          <form action={signOut}>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ivory/75 hover:bg-white/10"><LogOut className="h-4 w-4" /> Sign out</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10">{children}</div>
        <form action={signOut} className="px-4 pb-10 text-center lg:hidden">
          <button className="text-sm text-muted underline">Sign out</button>
        </form>
      </div>
    </div>
  );
}
