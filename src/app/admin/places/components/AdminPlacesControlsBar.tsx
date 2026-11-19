import React from "react";
import clsx from "clsx";
import { Columns, Trash2 } from "lucide-react";
import { IconColumns3Filled, IconLayoutListFilled } from "@tabler/icons-react";
import styles from "../admin-places.module.css";
import { PAGE_SIZE_OPTIONS } from "../constants";

interface Props {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  columnsMenuOpen: boolean;
  onToggleColumnsMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
  totalFiltered: number;
  selectedCount?: number;
  onClearSelection?: () => void;
  onBulkDelete?: () => void;
}

export const AdminPlacesControlsBar: React.FC<Props> = ({
  pageSize,
  onPageSizeChange,
  columnsMenuOpen,
  onToggleColumnsMenu,
  viewMode,
  onViewModeChange,
  totalFiltered,
  selectedCount = 0,
  onClearSelection,
  onBulkDelete,
}) => {
  return (
    <>
      {/* Bulk Delete Ribbon */}
      {selectedCount > 0 && (
        <div className={styles.bulkSelectionRibbon}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 700, color: "var(--color-fg)" }}>
              تم تحديد ({selectedCount}) {selectedCount === 1 ? "مكان" : "أماكن"}
            </span>
            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                className="btn btn-cancel"
                style={{ padding: "4px 10px", minHeight: "32px", fontSize: "0.8rem", cursor: "pointer" }}
              >
                إلغاء التحديد
              </button>
            )}
          </div>

          {onBulkDelete && (
            <button
              type="button"
              onClick={onBulkDelete}
              className="btn btn-error"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                minHeight: "32px",
                fontSize: "0.85rem",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              <Trash2 size={15} />
              <span>حذف المحدد ({selectedCount})</span>
            </button>
          )}
        </div>
      )}

      {/* Main Table05 Controls Bar */}
      <div className={styles.table05ControlsBar}>
        {/* Page Size & Results Count */}
        <div className={styles.table05PageSizeGroup}>
          <span>عرض</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={styles.table05Select}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>أماكن</span>
          <span style={{ margin: "0 6px", color: "var(--border-glass, #64748b)" }}>|</span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            إجمالي النتائج: <strong>{totalFiltered}</strong>
          </span>
        </div>

        {/* Action Controls: Columns & View Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {/* Columns Visibility Toggle Button */}
          {viewMode === "table" && (
            <button
              type="button"
              onClick={onToggleColumnsMenu}
              className={clsx(
                styles.columnsToggleBtn,
                columnsMenuOpen && styles.columnsToggleBtnActive
              )}
              title="تحديد الأعمدة الظاهرة"
            >
              <Columns className="h-4 w-4" />
              <span>الأعمدة</span>
            </button>
          )}

          {/* View Mode Toggle Buttons */}
          <div className={styles.viewToggleButtons}>
            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={clsx(
                styles.viewToggleBtn,
                viewMode === "cards" && styles.viewToggleBtnActive
              )}
              title="عرض كبطاقات"
            >
              <IconColumns3Filled size={18} />
              <span>بطاقات</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={clsx(
                styles.viewToggleBtn,
                viewMode === "table" && styles.viewToggleBtnActive
              )}
              title="عرض كجدول"
            >
              <IconLayoutListFilled size={18} />
              <span>جدول</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
