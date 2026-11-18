import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import { getAreaColor } from "../utils";
import parkingStyles from "../admin-parking.module.css";

interface AdminParkingFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalSpots: number;
  filteredCount: number;
  selectedArea: string;
  onAreaChange: (area: string) => void;
  availableAreas: string[];
}

export function AdminParkingFilterBar({
  searchQuery,
  onSearchChange,
  totalSpots,
  filteredCount,
  selectedArea,
  onAreaChange,
  availableAreas,
}: AdminParkingFilterBarProps) {
  const filterOptions = [
    { id: "all", label: "جميع المناطق" },
    ...availableAreas.map((area) => ({ id: area, label: area })),
  ];

  return (
    <div className={parkingStyles.filterCard}>
      {/* Search Input bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalSpots}
        filteredLocationsCount={filteredCount}
        placeholder="ابحث باسم الجراج، المنطقة، العنوان، أقرب محطة مترو، أو الخدمات..."
      />

      {/* Area Selection Tabs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={parkingStyles.lineFilterLabel}>
          <i className="bx bx-filter-alt" style={{ fontSize: "0.95rem" }} />
          تصفية حسب المنطقة:
        </span>
        <div className={parkingStyles.lineFilterScroll}>
          {filterOptions.map((opt) => {
            const isActive = selectedArea === opt.id;
            const color = opt.id === "all" ? "#6366f1" : getAreaColor(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onAreaChange(opt.id)}
                className={clsx(parkingStyles.linePill, isActive && parkingStyles.linePillActive)}
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
