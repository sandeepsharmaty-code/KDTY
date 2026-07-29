// Main navigation + footer structure — sourced from the frozen Phase 1
// Information Architecture (§4 Category Architecture, §12 Footer
// Architecture). Five main categories, fixed, per Phase 0 scope.

export const MAIN_CATEGORIES = [
  { id: "nail-collection", slug: "nail-collection", name: "Nail Collection" },
  { id: "color-cosmetics", slug: "color-cosmetics", name: "Color Cosmetics" },
  { id: "skincare", slug: "skincare", name: "Skincare" },
  { id: "hair-care", slug: "hair-care", name: "Hair Care" },
  { id: "beauty-accessories", slug: "beauty-accessories", name: "Beauty Accessories" },
] as const;

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Shop",
    links: [
      { label: "Nail Collection", href: "/shop/nail-collection" },
      { label: "Color Cosmetics", href: "/shop/color-cosmetics" },
      { label: "Skincare", href: "/shop/skincare" },
      { label: "Hair Care", href: "/shop/hair-care" },
      { label: "Beauty Accessories", href: "/shop/beauty-accessories" },
      { label: "Collections", href: "/collections" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { label: "Buying Guides", href: "/pages/guides" },
      { label: "Shade & Finish Finder", href: "/pages/shade-finder" },
      { label: "Editorial / Journal", href: "/pages/journal" },
      { label: "Gifting Guides", href: "/pages/gifting" },
      { label: "FAQs", href: "/pages/faqs" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Login / Register", href: "/account/login" },
      { label: "Order Tracking", href: "/account/orders" },
      { label: "Wishlist", href: "/account/wishlist" },
      { label: "Account Settings", href: "/account/settings" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Hue Muse Beauty", href: "/pages/about" },
      { label: "Brand Story", href: "/pages/brand-story" },
      { label: "Sustainability", href: "/pages/sustainability" },
      { label: "Press", href: "/pages/press" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact Us", href: "/pages/contact" },
      { label: "Shipping & Returns", href: "/pages/shipping-returns" },
      { label: "Order Help", href: "/pages/order-help" },
      { label: "Accessibility Statement", href: "/pages/accessibility" },
      { label: "Privacy Policy", href: "/pages/privacy" },
      { label: "Terms of Service", href: "/pages/terms" },
    ],
  },
];
