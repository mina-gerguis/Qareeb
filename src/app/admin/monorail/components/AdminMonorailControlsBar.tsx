import React from "react";
import clsx from "clsx";
import { Columns } from "lucide-react";
import monorailStyles from "../admin-monorail.module.css";
import { IconColumns3Filled, IconLayoutListFilled } from "@tabler/icons-react";

interface AdminMonorailControlsBarProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  columnsMenuOpen: boolean;
  onToggleColumnsMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
  selectedCount: number;
  onClearSelection: () => void;
}

export function AdminMonorailControlsBar({
  pageSize,
  onPageSizeChange,
  columnsMenuOpen,
  onToggleColumnsMenu,
  viewMode,
  onViewModeChange,
}: AdminMonorailControlsBarProps) {
  return (
    <div className={monorailStyles.table05ControlsBar}>
      <div className={monorailStyles.table05PageSizeGroup}>
        <span>عرض</span>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          className={monorailStyles.table05Select}
        >
          {[5, 10, 20, 50].map(sz => (
            <option key={sz} value={sz}>{sz}</option>
          ))}
        </select>
        <span>محطات</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Columns Visibility Toggle Button */}
        <button
          type="button"
          onClick={onToggleColumnsMenu}
          className={clsx(
            monorailStyles.columnsToggleBtn,
            columnsMenuOpen && monorailStyles.columnsToggleBtnActive
          )}
          title="تحديد الأعمدة الظاهرة"
        >
          <Columns className="h-4 w-4" />
          <span>الأعمدة</span>
        </button>

        {/* View Mode Toggle Buttons */}
        <div className={monorailStyles.viewToggleButtons}>
          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            className={clsx(
              monorailStyles.viewToggleBtn,
              viewMode === "cards" && monorailStyles.viewToggleBtnActive
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
              monorailStyles.viewToggleBtn,
              viewMode === "table" && monorailStyles.viewToggleBtnActive
            )}
            title="عرض كجدول"
          >
            <IconColumns3Filled size={16} />
            <span>جدول</span>
          </button>
        </div>
      </div>
    </div>
  );
}
