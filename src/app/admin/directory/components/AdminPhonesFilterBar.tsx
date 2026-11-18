import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import directoryStyles from "../admin-directory.module.css";
import { formatBoxIcon } from "@/data/places";
import { IconFilter, IconGridDots, IconPackage } from "@tabler/icons-react";

interface AdminPhonesFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalPhones: number;
  filteredCount: number;
  selectedSpecialtyTab: string;
  onSpecialtyChange: (spec: string) => void;
  existingSpecialties: string[];
  specialtyCounts: Record<string, number>;
  specialtyIcons: Record<string, string>;
  hasOtherEntries: boolean;
}

export function AdminPhonesFilterBar({
  searchQuery,
  onSearchChange,
  totalPhones,
  filteredCount,
  selectedSpecialtyTab,
  onSpecialtyChange,
  existingSpecialties,
  specialtyCounts,
  specialtyIcons,
  hasOtherEntries,
}: AdminPhonesFilterBarProps) {
  return (
    <div className={directoryStyles.filterCard}>
      {/* Search Input bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalPhones}
        filteredLocationsCount={filteredCount}
        placeholder={
          selectedSpecialtyTab === "all"
            ? "البحث عن جهة خدمية باسمها، تخصصها، أو رقمها..."
            : `البحث في جهات ${
                selectedSpecialtyTab === "__other__"
                  ? "أخرى"
                  : selectedSpecialtyTab
              } (الاسم، الرقم أو الوصف)...`
        }
      />

      {/* Specialty Filter Pills */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={directoryStyles.lineFilterLabel}>
          <IconFilter size={16} />
          <span>تصفية حسب التخصص الخدمي:</span>
        </span>

        <div className={directoryStyles.lineFilterScroll}>
          {/* All Specialties */}
          <button
            type="button"
            onClick={() => onSpecialtyChange("all")}
            className={clsx(
              directoryStyles.linePill,
              selectedSpecialtyTab === "all" && directoryStyles.linePillActive
            )}
          >
            <IconGridDots size={16} />
            <span>جميع التخصصات</span>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "2px 7px",
                borderRadius: "10px",
                background:
                  selectedSpecialtyTab === "all"
                    ? "rgba(0, 0, 0, 0.2)"
                    : "rgba(255, 255, 255, 0.08)",
                color: selectedSpecialtyTab === "all" ? "inherit" : "var(--text-muted)",
                fontWeight: "700",
              }}
            >
              {totalPhones}
            </span>
          </button>

          {/* Dynamic Specialties */}
          {existingSpecialties.map((spec) => {
            const isSelected = selectedSpecialtyTab === spec;
            const count = specialtyCounts[spec] || 0;
            const icon = specialtyIcons[spec] || "bx-building";

            return (
              <button
                key={spec}
                type="button"
                onClick={() => onSpecialtyChange(spec)}
                className={clsx(
                  directoryStyles.linePill,
                  isSelected && directoryStyles.linePillActive
                )}
              >
                <i className={formatBoxIcon(icon)} style={{ fontSize: "1rem" }} />
                <span>{spec}</span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "2px 7px",
                    borderRadius: "10px",
                    background: isSelected
                      ? "rgba(0, 0, 0, 0.2)"
                      : "rgba(255, 255, 255, 0.08)",
                    color: isSelected ? "inherit" : "var(--text-muted)",
                    fontWeight: "700",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* Other / Unclassified */}
          {hasOtherEntries && (
            <button
              type="button"
              onClick={() => onSpecialtyChange("__other__")}
              className={clsx(
                directoryStyles.linePill,
                selectedSpecialtyTab === "__other__" && directoryStyles.linePillActive
              )}
            >
              <IconPackage size={16} />
              <span>أخرى بدون تخصص</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "2px 7px",
                  borderRadius: "10px",
                  background:
                    selectedSpecialtyTab === "__other__"
                      ? "rgba(0, 0, 0, 0.2)"
                      : "rgba(255, 255, 255, 0.08)",
                  color:
                    selectedSpecialtyTab === "__other__"
                      ? "inherit"
                      : "var(--text-muted)",
                  fontWeight: "700",
                }}
              >
                {specialtyCounts["__other__"] || 0}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
