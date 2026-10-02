import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Card } from "@/components/admin/form";
import { adminCategories, adminLocations, adminProducts, adminSettings } from "@/lib/admin-data";
import { requireStaffPage } from "@/lib/auth";
import { formatDate, formatTimeRange, fullAddress, hasHours, todayInStore } from "@/lib/format";

export default async function DashboardPage({ searchParams }: PageProps<"/admin">) {
  await requireStaffPage();
  const { denied } = await searchParams;
  const today = todayInStore();
  const [settings, products, categories, upcoming] = await Promise.all([adminSettings(), adminProducts(), adminCategories(), adminLocations(today)]);
  const todayLoc = upcoming.find((l) => l.date === today) ?? null;

  const checklist = [
    { done: Boolean(settings.whatsapp_number), label: "WhatsApp number", href: "/admin/settings" },
    { done: Boolean(settings.phone), label: "Phone number", href: "/admin/settings" },
    { done: Boolean(fullAddress(settings)), label: "Permanent store address", href: "/admin/settings" },
    { done: hasHours(settings.business_hours), label: "Opening hours", href: "/admin/settings" },
    { done: products.length > 0, label: "First product", href: "/admin/products/new" },
    { done: products.some((p) => p.is_featured), label: "Featured products for the homepage", href: "/admin/featured" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-maroon-deep">Namaste 🙏</h1>
        <p className="mt-1 text-sm text-muted">{formatDate(today)}</p>
      </div>
      {denied && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">That page is only available to admins.</p>}

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <MapPin className="mt-1 h-6 w-6 shrink-0 text-gold" />
            <div>
              <p className="text-xs font-semibold tracking-widest text-muted uppercase">Today&apos;s location on the website</p>
              {todayLoc ? (
                <>
                  <p className="font-display mt-1 text-2xl text-maroon-deep">{todayLoc.is_open ? todayLoc.location_name : "Closed today"}</p>
                  {todayLoc.is_open && <p className="text-sm text-muted">{formatTimeRange(todayLoc.open_time, todayLoc.close_time) ?? "No timings set"}</p>}
                </>
              ) : (
                <p className="mt-1 text-sm text-amber-700">Not set for today — the website shows your permanent store instead.</p>
              )}
            </div>
          </div>
          <Link href="/admin/location" className="btn btn-primary !min-h-11">{todayLoc ? "Update" : "Set today's location"}</Link>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { n: products.filter((p) => p.is_visible).length, l: "Visible products", href: "/admin/products" },
          { n: products.filter((p) => p.is_featured).length, l: "Featured on homepage", href: "/admin/featured" },
          { n: categories.filter((c) => c.is_active).length, l: "Active categories", href: "/admin/categories" },
        ].map((s) => (
          <Link key={s.l} href={s.href} className="rounded-2xl border border-line bg-white p-5 shadow-sm hover:border-gold">
            <p className="font-display text-4xl text-maroon">{s.n}</p>
            <p className="text-sm text-muted">{s.l}</p>
          </Link>
        ))}
      </div>

      <Card title="Setup checklist" description="Complete these so customers can find and contact you.">
        <ul className="divide-y divide-line">
          {checklist.map((c) => (
            <li key={c.label}>
              <Link href={c.href} className="flex items-center justify-between py-3 text-sm hover:text-maroon">
                <span className="flex items-center gap-2.5">
                  {c.done ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}
                  {c.label}
                </span>
                {!c.done && <ArrowRight className="h-4 w-4 text-muted" />}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
