import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import { ROAD_TYPE_OPTIONS } from "../constants";
import { getRoadTypeColor } from "../utils";
import roadsStyles from "../admin-roads-info.module.css";

interface AdminRoadsFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalRoads: number;
  filteredCount: number;
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function AdminRoadsFilterBar({
  searchQuery,
  onSearchChange,
  totalRoads,
  filteredCount,
  selectedType,
  onTypeChange,
}: AdminRoadsFilterBarProps) {
  const typeFilterOptions = [
    { value: "all", label: "جميع الأنواع" },
    ...ROAD_TYPE_OPTIONS,
  ];

  return (
    <div className={roadsStyles.filterCard}>
      {/* Search Input bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalRoads}
        filteredLocationsCount={filteredCount}
        placeholder="ابحث باسم الطريق، الكود، المحافظات، أو نقاط البداية والنهاية..."
      />

      {/* Road Type Pills */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={roadsStyles.lineFilterLabel}>
          <i className="bx bx-filter-alt" style={{ fontSize: "0.95rem" }} />
          تصفية حسب تصنيف الطريق:
        </span>
        <div className={roadsStyles.lineFilterScroll}>
          {typeFilterOptions.map((opt) => {
            const isActive = selectedType === opt.value;
            const color = opt.value === "all" ? "#6366f1" : getRoadTypeColor(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onTypeChange(opt.value)}
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
