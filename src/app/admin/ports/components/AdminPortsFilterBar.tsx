import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import portsStyles from "../admin-ports.module.css";
import { PORT_FILTER_SEAS } from "../constants";

interface AdminPortsFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalPorts: number;
  filteredCount: number;
  selectedSea: string;
  onSeaChange: (sea: string) => void;
}

export function AdminPortsFilterBar({
  searchQuery,
  onSearchChange,
  totalPorts,
  filteredCount,
  selectedSea,
  onSeaChange,
}: AdminPortsFilterBarProps) {
  return (
    <div className={portsStyles.filterCard}>
      {/* Search Input bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalPorts}
        filteredLocationsCount={filteredCount}
        placeholder="ابحث باسم الميناء، المحافظة، المسطح المائي، أو التخصص اللوجستي..."
      />

      {/* Sea Selection Tabs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={portsStyles.lineFilterLabel}>
          <i className="bx bx-filter-alt" style={{ fontSize: "0.95rem" }} />
          تصفية حسب المسطح المائي والموقع:
        </span>
        <div className={portsStyles.lineFilterScroll}>
          {PORT_FILTER_SEAS.map((opt) => {
            const isActive = selectedSea === opt.id;
            const color =
              opt.id === "all"
                ? "#6366f1"
                : opt.id === "mediterranean"
                ? "#3b82f6"
                : opt.id === "red_sea"
                ? "#ef4444"
                : "#10b981";

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSeaChange(opt.id)}
                className={clsx(
                  portsStyles.linePill,
                  isActive && portsStyles.linePillActive
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
