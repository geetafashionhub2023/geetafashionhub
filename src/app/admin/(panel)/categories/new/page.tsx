import type { Metadata } from "next";
import Link from "next/link";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata: Metadata = { title: "New category" };

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/categories" className="text-sm text-muted hover:text-maroon">← Categories</Link>
        <h1 className="font-display mt-1 text-4xl font-semibold text-maroon-deep">New category</h1>
      </div>
      <CategoryForm />
    </div>
  );
}
