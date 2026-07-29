import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { CategoryDiscoveryGrid } from "@/components/sections/CategoryDiscoveryGrid";
import { RelatedCarousel } from "@/components/patterns/RelatedCarousel";
import { CollectionCard } from "@/components/composite/CollectionCard";
import { TrustSignalStrip } from "@/components/patterns/TrustSignalStrip";
import { MOCK_CATEGORIES, MOCK_COLLECTIONS, MOCK_PRODUCTS } from "@/services/mock/products";

export const metadata: Metadata = {
  title: "Premium Nail Polish & Color Cosmetics",
  description:
    "Discover Hue Muse Beauty — luxury nail lacquers, color cosmetics, and skincare crafted for every shade story.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* Sprint 2.9 — structured data placeholder (Organization). Real
          values (logo URL, social profiles) are finalized when brand
          assets land; the shape is wired now so no later page rewrite
          is needed. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Hue Muse Beauty",
            url: "https://www.huemusebeauty.com",
          }),
        }}
      />
      <Hero
        headline="Color that tells your story"
        subhead="Luxury nail lacquer and color cosmetics, crafted for every shade."
        ctaLabel="Shop New Arrivals"
        ctaHref="/shop"
        imageUrl="/mock/hero-home.jpg"
        imageAlt="Hue Muse Beauty product lineup on a marble surface"
      />
      <CategoryDiscoveryGrid categories={MOCK_CATEGORIES} />
      <section aria-label="Collections" className="py-8">
        <h2 className="mb-6 font-display text-[32px] leading-10 font-semibold text-ink">Featured Collections</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {MOCK_COLLECTIONS.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </div>
      </section>
      <RelatedCarousel title="Best Sellers" products={MOCK_PRODUCTS} />
      <TrustSignalStrip />
    </>
  );
}
