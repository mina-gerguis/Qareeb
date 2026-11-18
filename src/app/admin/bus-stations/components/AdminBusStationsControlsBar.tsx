import React from "react";
import clsx from "clsx";
import { Columns } from "lucide-react";
import busStyles from "../admin-bus-stations.module.css";
import { IconColumns3Filled, IconLayoutListFilled } from "@tabler/icons-react";

interface AdminBusStationsControlsBarProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  columnsMenuOpen: boolean;
  onToggleColumnsMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
}

export function AdminBusStationsControlsBar({
  pageSize,
  onPageSizeChange,
  columnsMenuOpen,
  onToggleColumnsMenu,
  viewMode,
  onViewModeChange,
}: AdminBusStationsControlsBarProps) {
  return (
    <div className={busStyles.table05ControlsBar}>
      <div className={busStyles.table05PageSizeGroup}>
        <span>عرض</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className={busStyles.table05Select}
        >
          {[5, 10, 20, 50].map((sz) => (
            <option key={sz} value={sz}>{sz}</option>
          ))}
        </select>
        <span>مواقف</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Columns Visibility Toggle Button */}
        <button
          type="button"
          onClick={onToggleColumnsMenu}
          className={clsx(
            busStyles.columnsToggleBtn,
            columnsMenuOpen && busStyles.columnsToggleBtnActive
          )}
          title="تحديد الأعمدة الظاهرة"
        >
          <Columns className="h-4 w-4" />
          <span>الأعمدة</span>
        </button>

        {/* View Mode Toggle Buttons */}
        <div className={busStyles.viewToggleButtons}>
          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            className={clsx(
              busStyles.viewToggleBtn,
              viewMode === "cards" && busStyles.viewToggleBtnActive
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
              busStyles.viewToggleBtn,
              viewMode === "table" && busStyles.viewToggleBtnActive
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
