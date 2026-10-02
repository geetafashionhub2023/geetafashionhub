import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ConfirmButton } from "@/components/admin/form";
import { deleteCategory } from "@/app/admin/_actions/categories";
import { adminCategory } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Edit category" };

export default async function EditCategoryPage({ params }: PageProps<"/admin/categories/[id]">) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const category = await adminCategory(id);
  if (!category) notFound();
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Link href="/admin/categories" className="text-sm text-muted hover:text-maroon">← Categories</Link>
          <h1 className="font-display mt-1 text-4xl font-semibold text-maroon-deep">{category.name}</h1>
        </div>
        <form action={deleteCategory}>
          <input type="hidden" name="id" value={category.id} />
          <ConfirmButton message={`Delete "${category.name}"? Its products will stay but have no category.`} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" /> Delete
          </ConfirmButton>
        </form>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
