import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/patterns/Breadcrumb";
import { FilterPanel } from "@/components/patterns/FilterPanel";
import { ProductListingGrid } from "@/components/sections/ProductListingGrid";
import { getCategoryBySlug, getProductsByCategory } from "@/services/api/products";

interface Props {
  params: { category: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
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

export default async function CategoryPage({ params }: Props) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();

  const products = await getProductsByCategory(category);

  return (
    <div className="py-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category.name }]} />
      <h1 className="mt-4 font-display text-[32px] leading-10 font-semibold text-ink">{category.name}</h1>

      {category.subcategories && category.subcategories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/shop/${sub.slug}`}
              className="rounded-full border border-fog px-3 py-1.5 text-[13px] leading-[18px] text-charcoal hover:border-primary-rose hover:text-primary-rose"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-8 sm:flex-row">
        <FilterPanel groups={FILTER_GROUPS} />
        <div className="flex-1">
          <ProductListingGrid products={products} />
        </div>
      </div>
    </div>
  );
}
