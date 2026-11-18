import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import { getGovernorateColor } from "../utils";
import busStyles from "../admin-bus-stations.module.css";

interface AdminBusStationsFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalStations: number;
  filteredCount: number;
  selectedGovernorate: string;
  onGovernorateChange: (gov: string) => void;
  availableGovernorates: string[];
}

export function AdminBusStationsFilterBar({
  searchQuery,
  onSearchChange,
  totalStations,
  filteredCount,
  selectedGovernorate,
  onGovernorateChange,
  availableGovernorates,
}: AdminBusStationsFilterBarProps) {
  const filterOptions = [
    { id: "all", label: "جميع المحافظات" },
    ...availableGovernorates.map((gov) => ({ id: gov, label: gov })),
  ];

  return (
    <div className={busStyles.filterCard}>
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
        <span className={busStyles.lineFilterLabel}>
          <i className="bx bx-filter-alt" style={{ fontSize: "0.95rem" }} />
          تصفية حسب المحافظة:
        </span>
        <div className={busStyles.lineFilterScroll}>
          {filterOptions.map((opt) => {
            const isActive = selectedGovernorate === opt.id;
            const color = opt.id === "all" ? "#6366f1" : getGovernorateColor(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onGovernorateChange(opt.id)}
                className={clsx(busStyles.linePill, isActive && busStyles.linePillActive)}
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
