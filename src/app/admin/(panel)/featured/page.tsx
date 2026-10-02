import type { Metadata } from "next";
import { FeaturedForm } from "@/components/admin/FeaturedForm";
import { adminProducts } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Featured products" };

export default async function FeaturedPage() {
  const products = await adminProducts();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-maroon-deep">Featured Products</h1>
        <p className="mt-1 text-sm text-muted">Tick the products to show in “Loved at the Boutique” on the homepage (up to 8 are shown). Lower order numbers appear first.</p>
      </div>
      {products.length ? <FeaturedForm products={products} /> : <p className="text-sm text-muted">Add products first.</p>}
    </div>
  );
}
