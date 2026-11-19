import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import suggestionsStyles from "../admin-suggestions.module.css";
import { CATEGORIES_STRUCTURE } from "@/data/places";
import { IconFilter, IconGridDots } from "@tabler/icons-react";

interface AdminSuggestionsFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalProposals: number;
  filteredCount: number;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categoryCounts: Record<string, number>;
}

export function AdminSuggestionsFilterBar({
  searchQuery,
  onSearchChange,
  totalProposals,
  filteredCount,
  selectedCategory,
  onCategoryChange,
  categoryCounts,
}: AdminSuggestionsFilterBarProps) {
  return (
    <div className={suggestionsStyles.filterCard}>
      {/* Search Input bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalProposals}
        filteredLocationsCount={filteredCount}
        placeholder="ابحث باسم المكان، المحافظة، المدينة، القسم، أو اسم صاحب الاقتراح..."
      />

      {/* Category Filter Pills */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={suggestionsStyles.lineFilterLabel}>
          <IconFilter size={16} />
          <span>تصفية حسب النشاط والتصنيف:</span>
        </span>

        <div className={suggestionsStyles.lineFilterScroll}>
          {/* All Categories */}
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={clsx(
              suggestionsStyles.linePill,
              selectedCategory === "all" && suggestionsStyles.linePillActive
            )}
          >
            <IconGridDots size={16} />
            <span>جميع الأقسام</span>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "2px 7px",
                borderRadius: "10px",
                background:
                  selectedCategory === "all"
                    ? "rgba(0, 0, 0, 0.2)"
                    : "rgba(255, 255, 255, 0.08)",
                color: selectedCategory === "all" ? "inherit" : "var(--text-muted)",
                fontWeight: "700",
              }}
            >
              {totalProposals}
            </span>
          </button>

          {/* Dynamic Categories */}
          {CATEGORIES_STRUCTURE.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const count = categoryCounts[cat.name] || 0;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onCategoryChange(cat.name)}
                className={clsx(
                  suggestionsStyles.linePill,
                  isSelected && suggestionsStyles.linePillActive
                )}
                style={
                  !isSelected && count > 0
                    ? {
                        borderColor: `${cat.color || "#3b82f6"}40`,
                      }
                    : {}
                }
              >
                <i className={`bx ${cat.icon || "bx-category"}`} style={{ fontSize: "1rem" }} />
                <span>{cat.label}</span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "2px 7px",
                    borderRadius: "10px",
                    background: isSelected
                      ? "rgba(0, 0, 0, 0.2)"
                      : "rgba(255, 255, 255, 0.08)",
                    color: isSelected ? "inherit" : "var(--text-muted)",
                    fontWeight: "700",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
