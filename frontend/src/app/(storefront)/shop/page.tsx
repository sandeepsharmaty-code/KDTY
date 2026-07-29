import type { Metadata } from "next";
import { Breadcrumb } from "@/components/patterns/Breadcrumb";
import { FilterPanel } from "@/components/patterns/FilterPanel";
import { ProductListingGrid } from "@/components/sections/ProductListingGrid";
import { MOCK_PRODUCTS } from "@/services/mock/products";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the full Hue Muse Beauty catalog — nail lacquer, color cosmetics, and skincare.",
  alternates: { canonical: "/shop" },
};

const FILTER_GROUPS = [
  { id: "price", label: "Price", options: [{ id: "under-20", label: "Under $20" }, { id: "20-40", label: "$20–$40" }] },
  { id: "finish", label: "Finish", options: [{ id: "matte", label: "Matte" }, { id: "glossy", label: "Glossy" }] },
];

export default function ShopPage() {
  return (
    <div className="py-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <h1 className="mt-4 font-display text-[32px] leading-10 font-semibold text-ink">Shop All</h1>
      <div className="mt-6 flex flex-col gap-8 sm:flex-row">
        <FilterPanel groups={FILTER_GROUPS} />
        <div className="flex-1">
          <ProductListingGrid products={MOCK_PRODUCTS} />
        </div>
      </div>
    </div>
  );
}
