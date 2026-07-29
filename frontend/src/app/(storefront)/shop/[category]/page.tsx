import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/patterns/Breadcrumb";
import { FilterPanel } from "@/components/patterns/FilterPanel";
import { ProductListingGrid } from "@/components/sections/ProductListingGrid";
import { getCategoryBySlug, getProductsByCategory } from "@/services/mock/products";

interface Props {
  params: { category: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const category = getCategoryBySlug(params.category);
  if (!category) return {};
  return {
    title: category.name,
    description: `Shop ${category.name} at Hue Muse Beauty.`,
    alternates: { canonical: `/shop/${category.slug}` },
  };
}

const FILTER_GROUPS = [
  { id: "finish", label: "Finish", options: [{ id: "matte", label: "Matte" }, { id: "glossy", label: "Glossy" }] },
];

export default function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  const products = getProductsByCategory(category.id);

  return (
    <div className="py-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category.name }]} />
      <h1 className="mt-4 font-display text-[32px] leading-10 font-semibold text-ink">{category.name}</h1>
      <div className="mt-6 flex flex-col gap-8 sm:flex-row">
        <FilterPanel groups={FILTER_GROUPS} />
        <div className="flex-1">
          <ProductListingGrid products={products} />
        </div>
      </div>
    </div>
  );
}
