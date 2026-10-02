import type { Metadata } from "next";
import Image from "next/image";
import { Play, Trash2 } from "lucide-react";
import { Card, ConfirmButton } from "@/components/admin/form";
import { AddInstagramPostForm, InstagramSettingsForm } from "@/components/admin/InstagramForms";
import { deleteInstagramPost, removeInstagramToken } from "@/app/admin/_actions/instagram";
import { adminInstagramPosts, adminSettings } from "@/lib/admin-data";
import { requireStaffPage } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/service";

export const metadata: Metadata = { title: "Instagram" };

async function tokenStatus() {
  const svc = serviceClient();
  if (!svc) return { hasToken: Boolean(process.env.INSTAGRAM_ACCESS_TOKEN), expiresAt: null as string | null, serviceRole: false };
  const { data } = await svc.from("instagram_credentials").select("expires_at").eq("id", 1).maybeSingle();
  return { hasToken: Boolean(data) || Boolean(process.env.INSTAGRAM_ACCESS_TOKEN), expiresAt: (data?.expires_at as string) ?? null, serviceRole: true };
}

export default async function InstagramAdminPage() {
  const staff = await requireStaffPage();
  const [settings, posts, token] = await Promise.all([adminSettings(), adminInstagramPosts(), tokenStatus()]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-maroon-deep">Instagram</h1>
        <p className="mt-1 text-sm text-muted">
          Profile: <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-maroon underline">{settings.instagram_url}</a> (change it in Business Info)
        </p>
      </div>

      <Card title="Integration" description="Uses Instagram's official API for your own Business/Creator account — no scraping. If the API is unavailable, curated posts are shown, then a Follow button.">
        <InstagramSettingsForm mode={settings.instagram_mode} limit={settings.instagram_post_limit} hasToken={token.hasToken} isAdmin={staff.role === "admin"} />
        {token.hasToken && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-cream px-4 py-3 text-xs text-muted">
            <span>
              Token saved{token.expiresAt ? ` · expires around ${new Date(token.expiresAt).toLocaleDateString("en-IN")}` : ""}. It&apos;s refreshed automatically by the daily cron job.
            </span>
            {staff.role === "admin" && token.serviceRole && (
              <form action={removeInstagramToken}>
                <ConfirmButton message="Remove the saved Instagram token?" className="text-red-600 hover:underline">Remove token</ConfirmButton>
              </form>
            )}
          </div>
        )}
      </Card>

      <Card title="Curated posts" description="Add posts manually — used in Curated mode and as a fallback for API mode.">
        <AddInstagramPostForm />
        {posts.length > 0 && (
          <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {posts.map((p) => (
              <li key={p.id} className="group relative aspect-square overflow-hidden rounded-xl bg-cream">
                <Image src={p.image_url} alt={p.caption ?? ""} fill sizes="150px" className="object-cover" />
                {p.is_video && <Play className="absolute top-2 left-2 h-4 w-4 fill-white text-white" />}
                <form action={deleteInstagramPost} className="absolute top-1.5 right-1.5">
                  <input type="hidden" name="id" value={p.id} />
                  <ConfirmButton message="Remove this post?" className="rounded-full bg-white/90 p-1.5 text-red-600 shadow"><Trash2 className="h-3.5 w-3.5" /><span className="sr-only">Remove</span></ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
