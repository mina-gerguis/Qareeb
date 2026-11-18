import React from "react";
import clsx from "clsx";
import { Columns } from "lucide-react";
import brtStyles from "../admin-brt.module.css";
import { IconColumns3Filled, IconLayoutListFilled, IconTrash, IconX } from "@tabler/icons-react";

interface AdminBrtControlsBarProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  columnsMenuOpen: boolean;
  onToggleColumnsMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

export function AdminBrtControlsBar({
  pageSize,
  onPageSizeChange,
  columnsMenuOpen,
  onToggleColumnsMenu,
  viewMode,
  onViewModeChange,
  selectedCount,
  onClearSelection,
  onBulkDelete,
}: AdminBrtControlsBarProps) {
  return (
    <>
      <div className={brtStyles.table05ControlsBar}>
        <div className={brtStyles.table05PageSizeGroup}>
          <span>عرض</span>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className={brtStyles.table05Select}
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
              brtStyles.columnsToggleBtn,
              columnsMenuOpen && brtStyles.columnsToggleBtnActive
            )}
            title="تحديد الأعمدة الظاهرة"
          >
            <Columns className="h-4 w-4" />
            <span>الأعمدة</span>
          </button>

          {/* View Mode Toggle Buttons */}
          <div className={brtStyles.viewToggleButtons}>
            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={clsx(
                brtStyles.viewToggleBtn,
                viewMode === "cards" && brtStyles.viewToggleBtnActive
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
                brtStyles.viewToggleBtn,
                viewMode === "table" && brtStyles.viewToggleBtnActive
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
