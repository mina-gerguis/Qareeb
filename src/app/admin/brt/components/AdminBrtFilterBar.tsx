import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import { BRT_SECTOR_FILTERS } from "../constants";
import brtStyles from "../admin-brt.module.css";

interface AdminBrtFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalStations: number;
  filteredCount: number;
  selectedSector: string;
  onSectorChange: (sector: string) => void;
}

export function AdminBrtFilterBar({
  searchQuery,
  onSearchChange,
  totalStations,
  filteredCount,
  selectedSector,
  onSectorChange,
}: AdminBrtFilterBarProps) {
  return (
    <div className={brtStyles.filterCard}>
      {/* Search Input bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalStations}
        filteredLocationsCount={filteredCount}
        placeholder="ابحث باسم المحطة، الموقع، القطاع، أو المعالم القريبة..."
      />

      {/* Sector Selection Tabs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={brtStyles.lineFilterLabel}>
          <i className="bx bx-filter-alt" style={{ fontSize: "0.95rem" }} />
          تصفية حسب القطاع:
        </span>
        <div className={brtStyles.lineFilterScroll}>
          {BRT_SECTOR_FILTERS.map(opt => {
            const isActive = selectedSector === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSectorChange(opt.id)}
                className={clsx(brtStyles.linePill, isActive && brtStyles.linePillActive)}
                style={!isActive ? { borderColor: `${opt.color}40`, color: "var(--color-fg)" } : {}}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: opt.color,
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
