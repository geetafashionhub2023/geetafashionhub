import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { Card, ConfirmButton } from "@/components/admin/form";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { deleteTestimonial, toggleTestimonial } from "@/app/admin/_actions/testimonials";
import { adminTestimonials } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  const items = await adminTestimonials();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-maroon-deep">Testimonials</h1>
        <p className="mt-1 text-sm text-muted">Only real customer feedback. Until you add some, the homepage invites customers to tag you on Instagram.</p>
      </div>
      <Card title="Add testimonial"><TestimonialForm /></Card>
      {items.length > 0 && (
        <ul className="space-y-3">
          {items.map((t) => (
            <li key={t.id} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm italic">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-1 text-xs text-muted">— {t.name}{t.context ? `, ${t.context}` : ""}</p>
              </div>
              <form action={toggleTestimonial}>
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="visible" value={String(!t.is_visible)} />
                <button className={`rounded-full px-3 py-1.5 text-xs font-semibold ${t.is_visible ? "bg-emerald-50 text-emerald-800" : "bg-sand text-muted"}`}>{t.is_visible ? "Visible" : "Hidden"}</button>
              </form>
              <form action={deleteTestimonial}>
                <input type="hidden" name="id" value={t.id} />
                <ConfirmButton message="Delete this testimonial?" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span></ConfirmButton>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
