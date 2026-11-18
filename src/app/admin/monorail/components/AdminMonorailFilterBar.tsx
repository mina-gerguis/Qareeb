import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import { MONORAIL_LINES } from "../constants";
import monorailStyles from "../admin-monorail.module.css";

interface AdminMonorailFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalStations: number;
  filteredCount: number;
  activeLine: string;
  onLineChange: (line: string) => void;
}

export function AdminMonorailFilterBar({
  searchQuery,
  onSearchChange,
  totalStations,
  filteredCount,
  activeLine,
  onLineChange,
}: AdminMonorailFilterBarProps) {
  return (
    <div className={monorailStyles.filterCard}>
      {/* Search Input bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalStations}
        filteredLocationsCount={filteredCount}
        placeholder="ابحث باسم المحطة أو المعلم القريب..."
      />

      {/* Line Selection Tabs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={monorailStyles.lineFilterLabel}>
          <i className="bx bx-filter-alt" style={{ fontSize: "0.95rem" }} />
          تصفية حسب المسار:
        </span>
        <div className={monorailStyles.lineFilterScroll}>
          {MONORAIL_LINES.map(opt => {
            const isActive = activeLine === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onLineChange(opt.id)}
                className={clsx(monorailStyles.linePill, isActive && monorailStyles.linePillActive)}
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
