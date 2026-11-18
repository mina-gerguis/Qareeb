import React from "react";
import clsx from "clsx";
import { Columns, Trash2 } from "lucide-react";
import airportsStyles from "../admin-airports.module.css";
import { IconColumns3Filled, IconLayoutListFilled } from "@tabler/icons-react";

interface AdminAirportsControlsBarProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  columnsMenuOpen: boolean;
  onToggleColumnsMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
  selectedCount?: number;
  onClearSelection?: () => void;
  onBulkDelete?: () => void;
}

export function AdminAirportsControlsBar({
  pageSize,
  onPageSizeChange,
  columnsMenuOpen,
  onToggleColumnsMenu,
  viewMode,
  onViewModeChange,
  selectedCount = 0,
  onClearSelection,
  onBulkDelete,
}: AdminAirportsControlsBarProps) {
  return (
    <>
      {/* Bulk Delete Selection Bar */}
      {selectedCount > 0 && (
        <div className={airportsStyles.bulkSelectionRibbon}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 700, color: "var(--color-fg)" }}>
              تم تحديد ({selectedCount}) مطار
            </span>
            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                className="btn btn-cancel"
                style={{ padding: "4px 10px", minHeight: "32px", fontSize: "0.8rem" }}
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
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 12px", minHeight: "32px", fontSize: "0.85rem" }}
            >
              <Trash2 className="h-4 w-4" />
              <span>حذف المحدد ({selectedCount})</span>
            </button>
          )}
        </div>
      )}

      {/* Controls Bar */}
      <div className={airportsStyles.table05ControlsBar}>
        <div className={airportsStyles.table05PageSizeGroup}>
          <span>عرض</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={airportsStyles.table05Select}
          >
            {[5, 10, 20, 50].map((sz) => (
              <option key={sz} value={sz}>{sz}</option>
            ))}
          </select>
          <span>مطارات</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Columns Visibility Toggle Button */}
          <button
            type="button"
            onClick={onToggleColumnsMenu}
            className={clsx(
              airportsStyles.columnsToggleBtn,
              columnsMenuOpen && airportsStyles.columnsToggleBtnActive
            )}
            title="تحديد الأعمدة الظاهرة"
          >
            <Columns className="h-4 w-4" />
            <span>الأعمدة</span>
          </button>

          {/* View Mode Toggle Buttons */}
          <div className={airportsStyles.viewToggleButtons}>
            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={clsx(
                airportsStyles.viewToggleBtn,
                viewMode === "cards" && airportsStyles.viewToggleBtnActive
              )}
              title="عرض كبطاقات"
            >
              <IconLayoutListFilled size={16} />
              <span>بطاقات</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={clsx(
                airportsStyles.viewToggleBtn,
                viewMode === "table" && airportsStyles.viewToggleBtnActive
              )}
              title="عرض كجدول"
            >
              <IconColumns3Filled size={16} />
              <span>جدول</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
