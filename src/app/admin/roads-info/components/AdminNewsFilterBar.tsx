import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import { NEWS_CATEGORY_OPTIONS } from "../constants";
import roadsStyles from "../admin-roads-info.module.css";

interface AdminNewsFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalNews: number;
  filteredCount: number;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export function AdminNewsFilterBar({
  searchQuery,
  onSearchChange,
  totalNews,
  filteredCount,
  selectedCategory,
  onCategoryChange,
}: AdminNewsFilterBarProps) {
  const catFilterOptions = [
    { value: "all", label: "كافة التنبيهات" },
    { value: "critical", label: "عاجل وهام ⚠️" },
    ...NEWS_CATEGORY_OPTIONS,
  ];

  return (
    <div className={roadsStyles.filterCard}>
      {/* Search Input bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalNews}
        filteredLocationsCount={filteredCount}
        placeholder="ابحث في التنبيهات، اسم الطريق، المصدر، أو تفاصيل البلاغ..."
      />

      {/* Category Pills */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={roadsStyles.lineFilterLabel}>
          <i className="bx bx-filter-alt" style={{ fontSize: "0.95rem" }} />
          تصفية حسب نوع التنبيه أو الحالة:
        </span>
        <div className={roadsStyles.lineFilterScroll}>
          {catFilterOptions.map((opt) => {
            const isActive = selectedCategory === opt.value;
            const color =
              opt.value === "all"
                ? "#6366f1"
                : opt.value === "critical"
                ? "#ef4444"
                : "#f59e0b";
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onCategoryChange(opt.value)}
                className={clsx(roadsStyles.linePill, isActive && roadsStyles.linePillActive)}
                style={!isActive ? { borderColor: `${color}40`, color: "var(--color-fg)" } : {}}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: color,
                    display: "inline-block",
                  }}
                />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
