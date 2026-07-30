import type { Metadata } from "next";
import { Breadcrumb } from "@/components/patterns/Breadcrumb";
import { FilterPanel } from "@/components/patterns/FilterPanel";
import { ProductListingGrid } from "@/components/sections/ProductListingGrid";
import { getAllProducts } from "@/services/api/products";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the full Hue Muse Beauty catalog — nail lacquer, color cosmetics, and skincare.",
  alternates: { canonical: "/shop" },
};

const FILTER_GROUPS = [
  { id: "price", label: "Price", options: [{ id: "under-500", label: "Under Rs 500" }, { id: "500-800", label: "Rs 500 to Rs 800" }, { id: "over-800", label: "Over Rs 800" }] },
  { id: "finish", label: "Finish", options: [{ id: "matte", label: "Matte" }, { id: "glossy", label: "Glossy" }] },
];

export default async function ShopPage() {
  const products = await getAllProducts();
  return (
    <div className="py-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <h1 className="mt-4 font-display text-[32px] leading-10 font-semibold text-ink">Shop All</h1>
      <div className="mt-6 flex flex-col gap-8 sm:flex-row">
        <FilterPanel groups={FILTER_GROUPS} />
        <div className="flex-1">
          <ProductListingGrid products={products} />
        </div>
      </div>
    </div>
  );
}
