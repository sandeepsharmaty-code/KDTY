import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/patterns/Breadcrumb";
import { ProductDetailSummary } from "@/components/sections/ProductDetailSummary";
import { ReviewCard } from "@/components/composite/ReviewCard";
import { Tabs } from "@/components/composite/Tabs";
import { RelatedCarousel } from "@/components/patterns/RelatedCarousel";
import { TrustSignalStrip } from "@/components/patterns/TrustSignalStrip";
import { getProductBySlug, MOCK_PRODUCTS, MOCK_REVIEWS } from "@/services/mock/products";

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description ?? product.name,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { images: [{ url: product.imageUrl }] },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = MOCK_PRODUCTS.filter((p) => p.id !== product.id);

  return (
    <div className="py-6">
      {/* Sprint 2.9 — structured data placeholder (Product). Values map
          1:1 from the mock Product type today; will map from the real
          API response in the sprint that adds backend integration. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.imageUrl,
            description: product.description,
            offers: {
              "@type": "Offer",
              price: product.salePrice ?? product.price,
              priceCurrency: product.currency,
              availability:
                product.availability === "in-stock"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            },
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]}
      />
      <div className="mt-4">
        <ProductDetailSummary product={product} />
      </div>

      <div className="mt-12">
        <Tabs
          items={[
            {
              id: "description",
              label: "Description",
              content: <p className="prose-copy text-base text-charcoal">{product.description}</p>,
            },
            {
              id: "reviews",
              label: `Reviews (${MOCK_REVIEWS.length})`,
              content: (
                <div>
                  {MOCK_REVIEWS.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>

      <RelatedCarousel title="You May Also Like" products={related} />
      <TrustSignalStrip />
    </div>
  );
}
