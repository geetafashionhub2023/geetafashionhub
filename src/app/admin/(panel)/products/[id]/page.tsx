import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { ConfirmButton } from "@/components/admin/form";
import { deleteProduct } from "@/app/admin/_actions/products";
import { adminCategories, adminProduct } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const { created } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [product, categories] = await Promise.all([adminProduct(id), adminCategories()]);
  if (!product) notFound();
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Link href="/admin/products" className="text-sm text-muted hover:text-maroon">← Products</Link>
          <h1 className="font-display mt-1 text-4xl font-semibold text-maroon-deep">{product.name}</h1>
        </div>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <ConfirmButton message={`Delete "${product.name}"? This cannot be undone.`} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" /> Delete
          </ConfirmButton>
        </form>
      </div>
      {created && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Product created.</p>}
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
