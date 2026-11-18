import React from "react";
import clsx from "clsx";
import SearchBox from "@/components/searchBox";
import directoryStyles from "../admin-directory.module.css";
import { COMPANY_META } from "../constants";
import { CompanyKey } from "../types";
import { IconFilter, IconGridDots } from "@tabler/icons-react";

interface AdminCodesFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalCodes: number;
  filteredCount: number;
  selectedCompanyTab: string;
  onCompanyChange: (company: string) => void;
  companyCounts: Record<string, number>;
}

export function AdminCodesFilterBar({
  searchQuery,
  onSearchChange,
  totalCodes,
  filteredCount,
  selectedCompanyTab,
  onCompanyChange,
  companyCounts,
}: AdminCodesFilterBarProps) {
  return (
    <div className={directoryStyles.filterCard}>
      {/* Search Input bar */}
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={onSearchChange}
        totalLocations={totalCodes}
        filteredLocationsCount={filteredCount}
        placeholder={
          selectedCompanyTab === "all"
            ? "البحث عن كود باسم الخدمة، القسم، الكود، أو الشركة..."
            : `البحث في أكواد ${
                COMPANY_META[selectedCompanyTab as CompanyKey]?.label || "الشركة"
              } (الخدمة، القسم، الكود)...`
        }
      />

      {/* Company Filter Pills */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className={directoryStyles.lineFilterLabel}>
          <IconFilter size={16} />
          <span>تصفية حسب شركة الاتصالات:</span>
        </span>

        <div className={directoryStyles.lineFilterScroll}>
          {/* All Companies */}
          <button
            type="button"
            onClick={() => onCompanyChange("all")}
            className={clsx(
              directoryStyles.linePill,
              selectedCompanyTab === "all" && directoryStyles.linePillActive
            )}
            style={{
              borderColor: selectedCompanyTab === "all" ? "var(--color-primary)" : undefined,
              background:
                selectedCompanyTab === "all"
                  ? "rgba(59, 130, 246, 0.15)"
                  : undefined,
              color: selectedCompanyTab === "all" ? "#3b82f6" : undefined,
            }}
          >
            <IconGridDots size={16} />
            <span>جميع الشركات</span>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "1px 6px",
                borderRadius: "10px",
                background:
                  selectedCompanyTab === "all"
                    ? "#3b82f6"
                    : "rgba(255, 255, 255, 0.08)",
                color: selectedCompanyTab === "all" ? "#fff" : "var(--text-muted)",
                fontWeight: "700",
              }}
            >
              {totalCodes}
            </span>
          </button>

          {/* Telecom Companies */}
          {(Object.keys(COMPANY_META) as CompanyKey[]).map((compKey) => {
            const meta = COMPANY_META[compKey];
            const isSelected = selectedCompanyTab === compKey;
            const count = companyCounts[compKey] || 0;

            return (
              <button
                key={compKey}
                type="button"
                onClick={() => onCompanyChange(compKey)}
                className={clsx(
                  directoryStyles.linePill,
                  isSelected && directoryStyles.linePillActive
                )}
                style={{
                  borderColor: isSelected ? meta.activeBorder : undefined,
                  background: isSelected ? meta.activeBg : undefined,
                  color: isSelected ? meta.color : undefined,
                }}
              >
                <img
                  src={meta.logo}
                  alt={meta.label}
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    objectFit: "contain",
                  }}
                />
                <span>{meta.label}</span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "1px 6px",
                    borderRadius: "10px",
                    background: isSelected
                      ? meta.badgeBg
                      : "rgba(255, 255, 255, 0.08)",
                    color: isSelected ? meta.color : "var(--text-muted)",
                    fontWeight: "700",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
