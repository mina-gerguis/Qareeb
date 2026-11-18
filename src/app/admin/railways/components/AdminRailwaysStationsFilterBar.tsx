import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import railwaysStyles from "../admin-railways.module.css";
import { RailwayRoute } from "../types";
import { getRouteColor } from "../utils";

interface AdminRailwaysStationsFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalStations: number;
  filteredCount: number;
  routes: RailwayRoute[];
  selectedRouteId: string;
  onRouteChange: (routeId: string) => void;
}

export function AdminRailwaysStationsFilterBar({
  searchQuery,
  onSearchChange,
  totalStations,
  filteredCount,
  routes,
  selectedRouteId,
  onRouteChange,
}: AdminRailwaysStationsFilterBarProps) {
  return (
    <div className={railwaysStyles.filterCard}>
      {/* Search Input bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalStations}
        filteredLocationsCount={filteredCount}
        placeholder="ابحث باسم المحطة في المسار المحدد..."
      />

      {/* Route Selection Tabs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={railwaysStyles.lineFilterLabel}>
          <i className="bx bx-git-branch" style={{ fontSize: "0.95rem" }} />
          اختر مسار القطار لعرض محطاته:
        </span>
        <div className={railwaysStyles.lineFilterScroll}>
          {routes.map(route => {
            const isActive = selectedRouteId === route.id;
            const color = getRouteColor(route.id);
            return (
              <button
                key={route.id}
                type="button"
                onClick={() => onRouteChange(route.id)}
                className={clsx(railwaysStyles.linePill, isActive && railwaysStyles.linePillActive)}
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
                {route.name} ({route.stops?.length || 0})
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
