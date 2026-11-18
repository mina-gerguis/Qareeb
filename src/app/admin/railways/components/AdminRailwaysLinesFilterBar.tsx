import React from "react";
import SearchBox from "@/components/searchBox";
import railwaysStyles from "../admin-railways.module.css";

interface AdminRailwaysLinesFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalLines: number;
  filteredCount: number;
}

export function AdminRailwaysLinesFilterBar({
  searchQuery,
  onSearchChange,
  totalLines,
  filteredCount,
}: AdminRailwaysLinesFilterBarProps) {
  return (
    <div className={railwaysStyles.filterCard}>
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalLines}
        filteredLocationsCount={filteredCount}
        placeholder="ابحث باسم المسار أو محطة البداية أو النهاية..."
      />
    </div>
  );
}
