import React from "react";
import clsx from "clsx";
import { Columns } from "lucide-react";
import railwaysStyles from "../admin-railways.module.css";
import { IconColumns3Filled, IconLayoutListFilled } from "@tabler/icons-react";

interface AdminRailwaysStationsControlsBarProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  columnsMenuOpen: boolean;
  onToggleColumnsMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
}

export function AdminRailwaysStationsControlsBar({
  pageSize,
  onPageSizeChange,
  columnsMenuOpen,
  onToggleColumnsMenu,
  viewMode,
  onViewModeChange,
}: AdminRailwaysStationsControlsBarProps) {
  return (
    <div className={railwaysStyles.table05ControlsBar}>
      <div className={railwaysStyles.table05PageSizeGroup}>
        <span>عرض</span>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          className={railwaysStyles.table05Select}
        >
          {[5, 10, 20, 50].map(sz => (
            <option key={sz} value={sz}>{sz}</option>
          ))}
        </select>
        <span>محطات</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          type="button"
          onClick={onToggleColumnsMenu}
          className={clsx(
            railwaysStyles.columnsToggleBtn,
            columnsMenuOpen && railwaysStyles.columnsToggleBtnActive
          )}
          title="تحديد الأعمدة الظاهرة"
        >
          <Columns className="h-4 w-4" />
          <span>الأعمدة</span>
        </button>

        <div className={railwaysStyles.viewToggleButtons}>
          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            className={clsx(
              railwaysStyles.viewToggleBtn,
              viewMode === "cards" && railwaysStyles.viewToggleBtnActive
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
              railwaysStyles.viewToggleBtn,
              viewMode === "table" && railwaysStyles.viewToggleBtnActive
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
