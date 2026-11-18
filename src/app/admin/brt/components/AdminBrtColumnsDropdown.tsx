import React from "react";
import { Check } from "lucide-react";
import { ColumnsMenuPosition, VisibleColumns } from "../types";
import brtStyles from "../admin-brt.module.css";

interface AdminBrtColumnsDropdownProps {
  isOpen: boolean;
  position: ColumnsMenuPosition | null;
  visibleColumns: VisibleColumns;
  onToggleColumn: (key: keyof VisibleColumns) => void;
}

export function AdminBrtColumnsDropdown({
  isOpen,
  position,
  visibleColumns,
  onToggleColumn,
}: AdminBrtColumnsDropdownProps) {
  if (!isOpen || !position) return null;

  const columnsList: { key: keyof VisibleColumns; label: string }[] = [
    { key: "name", label: "اسم المحطة" },
    { key: "sector", label: "القطاع الجغرافي" },
    { key: "location", label: "الموقع" },
    { key: "routesCount", label: "عدد المسارات" },
    { key: "landmarks", label: "المعالم القريبة" },
    { key: "type", label: "نوع المحطة" },
    { key: "status", label: "الحالة التشغيلية" },
  ];

  return (
    <div
      className={brtStyles.columnsDropdownMenu}
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
      <div className={brtStyles.columnsDropdownHeader}>إظهار / إخفاء الأعمدة</div>

      {columnsList.map(({ key, label }) => {
        const isChecked = visibleColumns[key];
        return (
          <button
            key={key}
            type="button"
            role="menuitemcheckbox"
            aria-checked={isChecked}
            className={brtStyles.columnsDropdownItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleColumn(key);
            }}
          >
            <span className={brtStyles.columnsCheckIcon}>
              {isChecked && <Check className="h-4 w-4" />}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
