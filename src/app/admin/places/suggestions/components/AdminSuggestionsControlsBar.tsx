import React from "react";
import clsx from "clsx";
import { Columns, Trash2 } from "lucide-react";
import suggestionsStyles from "../admin-suggestions.module.css";
import { IconColumns3Filled, IconEraser, IconLayoutListFilled, IconTrashFilled } from "@tabler/icons-react";
import { ViewMode } from "../types";
import { PAGE_SIZE_OPTIONS } from "../constants";

interface AdminSuggestionsControlsBarProps {
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

export function AdminSuggestionsControlsBar({
  pageSize,
  onPageSizeChange,
  columnsMenuOpen,
  onToggleColumnsMenu,
  viewMode,
  onViewModeChange,
  selectedCount = 0,
  onClearSelection,
  onBulkDelete,
}: AdminSuggestionsControlsBarProps) {
  return (
    <>
      {/* Bulk Delete Selection Bar */}
      {selectedCount > 0 && (
        <div className={suggestionsStyles.bulkSelectionRibbon}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="font-sub color-fg fw-700">
              تم تحديد ({selectedCount}) اقتراح
            </span>
          </div>
          <div className="flex gap-1">
            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                className="btn btn-cancel min-h-min fs-sm"
              >
                <IconEraser stroke={2} size={16}/>
                إلغاء
              </button>
            )}

            {onBulkDelete && (
              <button
                type="button"
                onClick={onBulkDelete}
                className="btn btn-error min-h-min fs-sm"
              >
               <IconTrashFilled size={16}/>
               حذف {selectedCount} عنصر
              </button>
            )}
          </div>

        </div>
      )}

      {/* Controls Bar */}
      <div className={suggestionsStyles.table05ControlsBar}>
        <div className={suggestionsStyles.table05PageSizeGroup}>
          <span>عرض</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={suggestionsStyles.table05Select}
          >
            {PAGE_SIZE_OPTIONS.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>
          <span>اقتراحات</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Columns Visibility Toggle Button */}
          <button
            type="button"
            onClick={onToggleColumnsMenu}
            className={clsx(
              suggestionsStyles.columnsToggleBtn,
              columnsMenuOpen && suggestionsStyles.columnsToggleBtnActive
            )}
            title="تحديد الأعمدة الظاهرة"
          >
            <Columns className="h-4 w-4" />
            <span>الأعمدة</span>
          </button>

          {/* View Mode Toggle Buttons */}
          <div className={suggestionsStyles.viewToggleButtons}>
            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={clsx(
                suggestionsStyles.viewToggleBtn,
                viewMode === "cards" && suggestionsStyles.viewToggleBtnActive
              )}
              title="عرض الكروت"
            >
              <IconColumns3Filled size={18} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={clsx(
                suggestionsStyles.viewToggleBtn,
                viewMode === "table" && suggestionsStyles.viewToggleBtnActive
              )}
              title="عرض الجدول"
            >
              <IconLayoutListFilled size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
