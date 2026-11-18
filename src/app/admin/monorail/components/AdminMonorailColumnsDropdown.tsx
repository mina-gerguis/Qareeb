import React from "react";
import { Check } from "lucide-react";
import { ColumnsMenuPosition, VisibleColumns } from "../types";
import monorailStyles from "../admin-monorail.module.css";

interface AdminMonorailColumnsDropdownProps {
  isOpen: boolean;
  position: ColumnsMenuPosition | null;
  visibleColumns: VisibleColumns;
  onToggleColumn: (key: keyof VisibleColumns) => void;
}

export function AdminMonorailColumnsDropdown({
  isOpen,
  position,
  visibleColumns,
  onToggleColumn,
}: AdminMonorailColumnsDropdownProps) {
  if (!isOpen || !position) return null;

  const columnsList: { key: keyof VisibleColumns; label: string }[] = [
    { key: "name", label: "اسم المحطة" },
    { key: "line", label: "مسار المونوريل" },
    { key: "order", label: "الترتيب" },
    { key: "landmarks", label: "المعالم القريبة" },
    { key: "status", label: "الحالة" },
  ];

  return (
    <div
      className={monorailStyles.columnsDropdownMenu}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      role="menu"
      dir="rtl"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={monorailStyles.columnsDropdownHeader}>إظهار / إخفاء الأعمدة</div>

      {columnsList.map(({ key, label }) => {
        const isChecked = visibleColumns[key];
        return (
          <button
            key={key}
            type="button"
            role="menuitemcheckbox"
            aria-checked={isChecked}
            className={monorailStyles.columnsDropdownItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleColumn(key);
            }}
          >
            <span className={monorailStyles.columnsCheckIcon}>
              {isChecked && <Check className="h-4 w-4" />}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
