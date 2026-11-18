import React from "react";
import styles from "../admin-directions.module.css";
import { TRANSIT_VEHICLE_CONFIG } from "../constants";
import SearchBox from "@/components/searchBox";

interface AdminDirectionsFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filterType: string;
  onFilterTypeChange: (val: string) => void;
  totalLocations?: number;
  filteredLocationsCount?: number;
}

export function AdminDirectionsFilters({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  totalLocations = 0,
  filteredLocationsCount = 0,
}: AdminDirectionsFiltersProps) {
  return (
    <div className={styles.filterCard} style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={onSearchChange}
            totalLocations={totalLocations}
            filteredLocationsCount={filteredLocationsCount}
            placeholder="ابحث باسم نقطة البداية، الوجهة، أو الكلمات البديلة..."
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
            وسيلة المواصلات:
          </span>
          <select
            className="input-fields"
            style={{ width: "auto", minWidth: "160px", padding: "8px 12px", fontSize: "0.85rem" }}
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
          >
            <option value="all">جميع الوسائل</option>
            {Object.entries(TRANSIT_VEHICLE_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
