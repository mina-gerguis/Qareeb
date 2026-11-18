import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import { getGovernorateColor } from "../utils";
import microStyles from "../admin-microbus-stations.module.css";

interface AdminMicrobusStationsFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalStations: number;
  filteredCount: number;
  selectedGovernorate: string;
  onGovernorateChange: (gov: string) => void;
  availableGovernorates: string[];
}

export function AdminMicrobusStationsFilterBar({
  searchQuery,
  onSearchChange,
  totalStations,
  filteredCount,
  selectedGovernorate,
  onGovernorateChange,
  availableGovernorates,
}: AdminMicrobusStationsFilterBarProps) {
  const filterOptions = [
    { id: "all", label: "جميع المحافظات" },
    ...availableGovernorates.map((gov) => ({ id: gov, label: gov })),
  ];

  return (
    <div className={microStyles.filterCard}>
      {/* Search Input bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalStations}
        filteredLocationsCount={filteredCount}
        placeholder="ابحث باسم الموقف، الوجهات، العنوان، أو المحافظة..."
      />

      {/* Governorate Selection Tabs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={microStyles.lineFilterLabel}>
          <i className="bx bx-filter-alt" style={{ fontSize: "0.95rem" }} />
          تصفية حسب المحافظة:
        </span>
        <div className={microStyles.lineFilterScroll}>
          {filterOptions.map((opt) => {
            const isActive = selectedGovernorate === opt.id;
            const color = opt.id === "all" ? "#6366f1" : getGovernorateColor(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onGovernorateChange(opt.id)}
                className={clsx(microStyles.linePill, isActive && microStyles.linePillActive)}
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
