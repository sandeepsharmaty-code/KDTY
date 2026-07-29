import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";
import { MOCK_CATEGORIES, MOCK_COLLECTIONS, MOCK_PRODUCTS } from "@/services/mock/products";

// Sprint 2.9 — SEO & AI Search Readiness. Generated from mock data in
// Sprint 2; regenerates from live catalog data once the backend exists.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_CONFIG.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_CONFIG.url}/shop`, changeFrequency: "daily", priority: 0.9 },
  ];
  const categoryRoutes: MetadataRoute.Sitemap = MOCK_CATEGORIES.map((c) => ({
    url: `${SITE_CONFIG.url}/shop/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));
  const collectionRoutes: MetadataRoute.Sitemap = MOCK_COLLECTIONS.map((c) => ({
    url: `${SITE_CONFIG.url}/collections/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const productRoutes: MetadataRoute.Sitemap = MOCK_PRODUCTS.map((p) => ({
    url: `${SITE_CONFIG.url}/products/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...collectionRoutes, ...productRoutes];
}
