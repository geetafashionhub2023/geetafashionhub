import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { Card, ConfirmButton } from "@/components/admin/form";
import { LocationForm } from "@/components/admin/LocationForm";
import { deleteDailyLocation } from "@/app/admin/_actions/location";
import { adminLocations, adminRecentLocations } from "@/lib/admin-data";
import { formatDate, formatTimeRange, todayInStore } from "@/lib/format";

export const metadata: Metadata = { title: "Today's Location" };

export default async function LocationAdminPage({ searchParams }: PageProps<"/admin/location">) {
  const today = todayInStore();
  const { date } = await searchParams;
  const [upcoming, recent] = await Promise.all([adminLocations(today), adminRecentLocations(today)]);
  const initialDate = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= today ? date : today;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-maroon-deep">Today&apos;s Location</h1>
        <p className="mt-1 text-sm text-muted">Shown on the homepage, the Visit Us page and the Directions button. Entered manually — never from GPS.</p>
      </div>
      <Card>
        <LocationForm key={initialDate} entries={[...upcoming, ...recent]} today={today} initialDate={initialDate} />
      </Card>
      <Card title="Scheduled" description="Today and upcoming dates.">
        {upcoming.length ? (
          <ul className="divide-y divide-line">
            {upcoming.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <Link href={`/admin/location?date=${l.date}`} className="min-w-0 hover:text-maroon">
                  <span className="block font-semibold">{formatDate(l.date)}{l.date === today && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">Today</span>}</span>
                  <span className="block truncate text-muted">{l.is_open ? `${l.location_name} · ${formatTimeRange(l.open_time, l.close_time) ?? "no timings"}` : "Closed"}</span>
                </Link>
                <form action={deleteDailyLocation}>
                  <input type="hidden" name="id" value={l.id} />
                  <ConfirmButton message="Delete this entry?" className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span></ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Nothing scheduled yet.</p>
        )}
      </Card>
    </div>
  );
}
