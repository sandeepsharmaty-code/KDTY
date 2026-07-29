import type { Metadata } from "next";
import { ProductListingGrid } from "@/components/sections/ProductListingGrid";
import { MOCK_PRODUCTS } from "@/services/mock/products";

export const metadata: Metadata = {
  title: "Search Results",
  robots: { index: false }, // search result pages excluded per Phase 7 AI/SEO readiness norms
};

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q ?? "";
  const results = query
    ? MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="py-6">
      <h1 className="font-display text-[32px] leading-10 font-semibold text-ink">
        {query ? `Results for "${query}"` : "Search"}
      </h1>
      <p className="mt-1 text-[13px] leading-[18px] text-stone">{results.length} results</p>
      <div className="mt-6">
        <ProductListingGrid products={results} />
      </div>
    </div>
  );
}
