import React from "react";
import clsx from "clsx";
import { Columns } from "lucide-react";
import metroStyles from "../admin-metro.module.css";
import { IconColumns3Filled, IconLayoutListFilled } from "@tabler/icons-react";

interface AdminMetroControlsBarProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  columnsMenuOpen: boolean;
  onToggleColumnsMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
  selectedCount: number;
  onClearSelection: () => void;
}

export function AdminMetroControlsBar({
  pageSize,
  onPageSizeChange,
  columnsMenuOpen,
  onToggleColumnsMenu,
  viewMode,
  onViewModeChange,
  selectedCount,
  onClearSelection,
}: AdminMetroControlsBarProps) {
  return (
    <>
      <div className={metroStyles.table05ControlsBar}>
        <div className={metroStyles.table05PageSizeGroup}>
          <span>عرض</span>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className={metroStyles.table05Select}
          >
            {[5, 10, 20, 50].map(sz => (
              <option key={sz} value={sz}>{sz}</option>
            ))}
          </select>
          <span>محطات </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Columns Visibility Toggle Button */}
          <button
            type="button"
            onClick={onToggleColumnsMenu}
            className={clsx(
              metroStyles.columnsToggleBtn,
              columnsMenuOpen && metroStyles.columnsToggleBtnActive
            )}
            title="تحديد الأعمدة الظاهرة"
          >
            <Columns className="h-4 w-4" />
            <span>الأعمدة</span>
          </button>

          {/* View Mode Toggle Buttons */}
          <div className={metroStyles.viewToggleButtons}>
            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={clsx(
                metroStyles.viewToggleBtn,
                viewMode === "cards" && metroStyles.viewToggleBtnActive
              )}
              title="عرض كبطاقات"
            >
              <IconLayoutListFilled size={16}/>
              <span>بطاقات</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={clsx(
                metroStyles.viewToggleBtn,
                viewMode === "table" && metroStyles.viewToggleBtnActive
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

