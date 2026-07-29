"use client";
import { useState } from "react";
import { Checkbox } from "@/components/basic/Checkbox";
import { Label } from "@/components/basic/Label";

// Filter Panel — Phase 4 §17 Reusable Patterns. Sidebar on desktop
// (Phase 4 §9), collapsible sections on mobile. Sprint 2 scope: UI +
// local state against mock facets; wired to real filtering in a later
// sprint.
export interface FilterGroup {
  id: string;
  label: string;
  options: { id: string; label: string }[];
}

export function FilterPanel({ groups }: { groups: FilterGroup[] }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  return (
    <aside aria-label="Filter products" className="w-full border-fog sm:w-64 sm:border-r sm:pr-6">
      {groups.map((group) => (
        <div key={group.id} className="mb-6">
          <Label as="label">{group.label}</Label>
          <div className="mt-2 flex flex-col gap-2">
            {group.options.map((opt) => (
              <Checkbox
                key={opt.id}
                label={opt.label}
                checked={Boolean(selected[opt.id])}
                onChange={(e) =>
                  setSelected((s) => ({ ...s, [opt.id]: e.target.checked }))
                }
              />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
