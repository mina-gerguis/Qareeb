import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import { MONORAIL_LINES } from "../constants";
import monorailStyles from "../admin-monorail.module.css";
import { IconFilter2 } from "@tabler/icons-react";

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

        <div className={monorailStyles.lineFilterScroll}>
          <span className={monorailStyles.lineFilterLabel}>
            <IconFilter2 stroke={2} size={16}/>
            تصفية حسب :
          </span>
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
