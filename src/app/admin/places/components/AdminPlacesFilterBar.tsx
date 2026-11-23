import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import styles from "../admin-places.module.css";
import { CATEGORIES_STRUCTURE } from "@/data/places";
import { governoratesList } from "@/data/egypt_locations";
import { IconFilter, IconGridDots, IconMapPin } from "@tabler/icons-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

interface Props {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalPlaces: number;
  filteredCount: number;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categoryCounts: Record<string, number>;
  selectedGovernorate: string;
  onGovernorateChange: (gov: string) => void;
  governorateCounts: Record<string, number>;
}

export const AdminPlacesFilterBar: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  totalPlaces,
  filteredCount,
  selectedCategory,
  onCategoryChange,
  categoryCounts,
  selectedGovernorate,
  onGovernorateChange,
  governorateCounts,
}) => {
  return (
    <div className={styles.filterCard}>
      {/* Search Bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalPlaces}
        filteredLocationsCount={filteredCount}
        placeholder="البحث بالاسم (عربي/إنجليزي)، الكود، المدينة، العنوان، أو رقم الهاتف..."
      />

      {/* Category Filter Pills */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={styles.lineFilterLabel}>
          <IconFilter size={16} />
          <span>تصفية حسب القسم الرئيسي:</span>
        </span>

        <div className={styles.lineFilterScroll}>
          {/* All */}
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={clsx(
              styles.linePill,
              selectedCategory === "all" && styles.linePillActive
            )}
          >
            <IconGridDots size={16} />
            <span>جميع الأقسام</span>
            <span className={styles.linePillCount}>
              {categoryCounts["all"] ?? totalPlaces}
            </span>
          </button>

          {/* Each Category */}
          {CATEGORIES_STRUCTURE.map(mainCat => {
            const count = categoryCounts[mainCat.name] || 0;
            const isSelected = selectedCategory === mainCat.name;
            return (
              <button
                key={mainCat.name}
                type="button"
                onClick={() => onCategoryChange(mainCat.name)}
                className={clsx(
                  styles.linePill,
                  isSelected && styles.linePillActive
                )}
              >
                <CategoryIcon icon={mainCat.icon} size={16} />
                <span>{mainCat.label}</span>
                {count > 0 && (
                  <span className={styles.linePillCount}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Governorate Selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "4px" }}>
        <span className={styles.lineFilterLabel} style={{ minWidth: "120px" }}>
          <IconMapPin size={16} />
          <span>تصفية المحافظة:</span>
        </span>
        <select
          value={selectedGovernorate}
          onChange={(e) => onGovernorateChange(e.target.value)}
          className={styles.filterSelect}
          style={{
            minWidth: "180px",
            maxWidth: "260px",
            padding: "8px 14px",
            borderRadius: "10px",
            background: "var(--bg-secondary, rgba(255, 255, 255, 0.04))",
            color: "var(--color-fg)",
            border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.1))",
            fontSize: "0.85rem",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          <option value="all">جميع المحافظات ({totalPlaces})</option>
          {governoratesList.map(gov => {
            const count = governorateCounts[gov] || 0;
            return (
              <option key={gov} value={gov}>
                {gov} ({count})
              </option>
            );
          })}
        </select>

        {selectedGovernorate !== "all" && (
          <button
            type="button"
            onClick={() => onGovernorateChange("all")}
            className="btn btn-cancel"
            style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "8px", cursor: "pointer" }}
          >
            إلغاء تصفية المحافظة
          </button>
        )}
      </div>
    </div>
  );
};
