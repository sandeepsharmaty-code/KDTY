import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

// Storefront Layout — Phase 14 §14.2 layouts/ (page-level layout wrapper).
// Wraps every (storefront) route group page.
export function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-content px-4 sm:px-6">
        {children}
      </main>
      <Footer />
    </>
  );
}
