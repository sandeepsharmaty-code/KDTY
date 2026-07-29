import Link from "next/link";
import { Label } from "@/components/basic/Label";
import { MAIN_CATEGORIES } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";

// Mega Menu — Phase 4 §9. Full-width White panel, Fog bottom border,
// opens directly beneath the header, column headings use Label style.
export function MegaMenu({ categoryId }: { categoryId: string }) {
  const category = MAIN_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return null;

  // Sprint 2 mock subcategory columns — real taxonomy comes from Phase 1
  // §4, wired to live data in a later sprint.
  const columns = [
    { heading: "Shop by Type", links: [`All ${category.name}`, "New Arrivals", "Best Sellers"] },
    { heading: "Shop by Finish", links: ["Matte", "Glossy", "Shimmer"] },
    { heading: "Featured", links: ["Spring Muse Collection", "Gift Sets"] },
  ];

  return (
    <div className="absolute inset-x-0 border-b border-fog bg-white shadow-hover" role="region" aria-label={`${category.name} menu`}>
      <div className="mx-auto grid max-w-content grid-cols-3 gap-8 px-6 py-8">
        {columns.map((col) => (
          <div key={col.heading}>
            <Label>{col.heading}</Label>
            <ul className="mt-3 flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link}>
                  <Link href={ROUTES.category(category.slug)} className="text-base text-charcoal hover:text-primary-rose">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
