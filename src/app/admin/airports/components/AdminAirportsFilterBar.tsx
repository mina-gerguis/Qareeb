import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import airportsStyles from "../admin-airports.module.css";
import { AIRPORT_FILTER_TYPES } from "../constants";

interface AdminAirportsFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalAirports: number;
  filteredCount: number;
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function AdminAirportsFilterBar({
  searchQuery,
  onSearchChange,
  totalAirports,
  filteredCount,
  selectedType,
  onTypeChange,
}: AdminAirportsFilterBarProps) {
  return (
    <div className={airportsStyles.filterCard}>
      {/* Search Input bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalAirports}
        filteredLocationsCount={filteredCount}
        placeholder="ابحث باسم المطار، كود IATA/ICAO، المدينة، أو المحافظة..."
      />

      {/* Type Selection Tabs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={airportsStyles.lineFilterLabel}>
          <i className="bx bx-filter-alt" style={{ fontSize: "0.95rem" }} />
          تصفية حسب نوع وتصنيف المطار:
        </span>
        <div className={airportsStyles.lineFilterScroll}>
          {AIRPORT_FILTER_TYPES.map((opt) => {
            const isActive = selectedType === opt.id;
            const color =
              opt.id === "all"
                ? "#6366f1"
                : opt.id === "international"
                ? "#3b82f6"
                : "#10b981";

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onTypeChange(opt.id)}
                className={clsx(
                  airportsStyles.linePill,
                  isActive && airportsStyles.linePillActive
                )}
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
