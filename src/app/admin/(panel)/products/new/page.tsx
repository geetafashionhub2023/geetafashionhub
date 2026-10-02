import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { adminCategories } from "@/lib/admin-data";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  const categories = await adminCategories();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-muted hover:text-maroon">← Products</Link>
        <h1 className="font-display mt-1 text-4xl font-semibold text-maroon-deep">New product</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
