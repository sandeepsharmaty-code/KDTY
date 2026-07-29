import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/patterns/Breadcrumb";
import { ProductListingGrid } from "@/components/sections/ProductListingGrid";
import { MOCK_COLLECTIONS, MOCK_PRODUCTS } from "@/services/mock/products";

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const collection = MOCK_COLLECTIONS.find((c) => c.slug === params.slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.tagline,
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}

export default function CollectionPage({ params }: Props) {
  const collection = MOCK_COLLECTIONS.find((c) => c.slug === params.slug);
  if (!collection) notFound();

  return (
    <div className="py-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/shop" }, { label: collection.name }]} />
      <h1 className="mt-4 font-display text-[32px] leading-10 font-semibold text-ink">{collection.name}</h1>
      <p className="mt-2 max-w-xl text-base text-stone">{collection.tagline}</p>
      <div className="mt-6">
        {/* Sprint 2 mock: collection membership not modeled — showing full
            catalog as a stand-in listing. Real collection→product mapping
            is a Sprint 3+/data concern. */}
        <ProductListingGrid products={MOCK_PRODUCTS} />
      </div>
    </div>
  );
}
