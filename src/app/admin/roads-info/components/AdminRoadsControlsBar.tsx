import React from "react";
import clsx from "clsx";
import { Columns, Trash2 } from "lucide-react";
import roadsStyles from "../admin-roads-info.module.css";
import { IconColumns3Filled, IconLayoutListFilled } from "@tabler/icons-react";

interface AdminRoadsControlsBarProps {
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

export function AdminRoadsControlsBar({
  pageSize,
  onPageSizeChange,
  columnsMenuOpen,
  onToggleColumnsMenu,
  viewMode,
  onViewModeChange,
  selectedCount = 0,
  onClearSelection,
  onBulkDelete,
}: AdminRoadsControlsBarProps) {
  return (
    <>
      {selectedCount > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "10px",
            padding: "8px 16px",
            marginBottom: "12px",
            fontSize: "0.88rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 700, color: "var(--color-fg)" }}>
              تم تحديد ({selectedCount}) طريق
            </span>
            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                className="btn btn-secondary btn-sm"
                style={{ padding: "4px 8px", fontSize: "0.8rem" }}
              >
                إلغاء التحديد
              </button>
            )}
          </div>

          {onBulkDelete && (
            <button
              type="button"
              onClick={onBulkDelete}
              className="btn btn-error btn-sm"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Trash2 className="h-4 w-4" />
              <span>حذف المحدد ({selectedCount})</span>
            </button>
          )}
        </div>
      )}

      <div className={roadsStyles.table05ControlsBar}>
        <div className={roadsStyles.table05PageSizeGroup}>
          <span>عرض</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={roadsStyles.table05Select}
          >
            {[5, 10, 20, 50].map((sz) => (
              <option key={sz} value={sz}>{sz}</option>
            ))}
          </select>
          <span>طرق</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Columns Visibility Toggle Button */}
          <button
            type="button"
            onClick={onToggleColumnsMenu}
            className={clsx(
              roadsStyles.columnsToggleBtn,
              columnsMenuOpen && roadsStyles.columnsToggleBtnActive
            )}
            title="تحديد الأعمدة الظاهرة"
          >
            <Columns className="h-4 w-4" />
            <span>الأعمدة</span>
          </button>

          {/* View Mode Toggle Buttons */}
          <div className={roadsStyles.viewToggleButtons}>
            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={clsx(
                roadsStyles.viewToggleBtn,
                viewMode === "cards" && roadsStyles.viewToggleBtnActive
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
                roadsStyles.viewToggleBtn,
                viewMode === "table" && roadsStyles.viewToggleBtnActive
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
