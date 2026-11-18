import React from "react";
import clsx from "clsx";
import { Columns, Trash2 } from "lucide-react";
import directoryStyles from "../admin-directory.module.css";
import { IconColumns3Filled, IconLayoutListFilled } from "@tabler/icons-react";
import { DirectoryTab, ViewMode } from "../types";
import { PAGE_SIZE_OPTIONS } from "../constants";

interface AdminDirectoryControlsBarProps {
  activeTab: DirectoryTab;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  columnsMenuOpen: boolean;
  onToggleColumnsMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedCount?: number;
  onClearSelection?: () => void;
  onBulkDelete?: () => void;
}

export function AdminDirectoryControlsBar({
  activeTab,
  pageSize,
  onPageSizeChange,
  columnsMenuOpen,
  onToggleColumnsMenu,
  viewMode,
  onViewModeChange,
  selectedCount = 0,
  onClearSelection,
  onBulkDelete,
}: AdminDirectoryControlsBarProps) {
  const itemLabel = activeTab === "phones" ? "رقم خدمي" : "كود خدمة";
  const itemLabelPlural = activeTab === "phones" ? "جهات" : "أكواد";

  return (
    <>
      {/* Bulk Delete Selection Bar */}
      {selectedCount > 0 && (
        <div className={directoryStyles.bulkSelectionRibbon}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 700, color: "var(--color-fg)" }}>
              تم تحديد ({selectedCount}) {itemLabel}
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                minHeight: "32px",
                fontSize: "0.85rem",
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>حذف المحدد ({selectedCount})</span>
            </button>
          )}
        </div>
      )}

      {/* Controls Bar */}
      <div className={directoryStyles.table05ControlsBar}>
        <div className={directoryStyles.table05PageSizeGroup}>
          <span>عرض</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={directoryStyles.table05Select}
          >
            {PAGE_SIZE_OPTIONS.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>
          <span>{itemLabelPlural}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Columns Visibility Toggle Button */}
          <button
            type="button"
            onClick={onToggleColumnsMenu}
            className={clsx(
              directoryStyles.columnsToggleBtn,
              columnsMenuOpen && directoryStyles.columnsToggleBtnActive
            )}
            title="تحديد الأعمدة الظاهرة"
          >
            <Columns className="h-4 w-4" />
            <span>الأعمدة</span>
          </button>

          {/* View Mode Toggle Buttons */}
          <div className={directoryStyles.viewToggleButtons}>
            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={clsx(
                directoryStyles.viewToggleBtn,
                viewMode === "cards" && directoryStyles.viewToggleBtnActive
              )}
              title="عرض الكروت"
            >
              <IconColumns3Filled size={18} />
              <span>كروت</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={clsx(
                directoryStyles.viewToggleBtn,
                viewMode === "table" && directoryStyles.viewToggleBtnActive
              )}
              title="عرض الجدول"
            >
              <IconLayoutListFilled size={18} />
              <span>جدول</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
