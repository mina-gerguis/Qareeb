import React from "react";
import { Check } from "lucide-react";
import { ColumnsMenuPosition, VisibleColumns } from "../types";
import parkingStyles from "../admin-parking.module.css";

interface AdminParkingColumnsDropdownProps {
  isOpen: boolean;
  position: ColumnsMenuPosition | null;
  visibleColumns: VisibleColumns;
  onToggleColumn: (key: keyof VisibleColumns) => void;
}

export function AdminParkingColumnsDropdown({
  isOpen,
  position,
  visibleColumns,
  onToggleColumn,
}: AdminParkingColumnsDropdownProps) {
  if (!isOpen || !position) return null;

  const columnsList: { key: keyof VisibleColumns; label: string }[] = [
    { key: "name", label: "اسم الجراج" },
    { key: "area", label: "المنطقة" },
    { key: "address", label: "العنوان بالتفصيل" },
    { key: "nearestMetro", label: "أقرب محطة مترو" },
    { key: "rates", label: "التعريفة والرسوم" },
    { key: "capacity", label: "السعة الإجمالية" },
    { key: "type", label: "نوع الجراج" },
    { key: "hours", label: "ساعات العمل" },
    { key: "mapLocation", label: "رابط الخريطة" },
  ];

  return (
    <div
      className={parkingStyles.columnsDropdownMenu}
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
      <div className={parkingStyles.columnsDropdownHeader}>إظهار / إخفاء الأعمدة</div>

      {columnsList.map(({ key, label }) => {
        const isChecked = visibleColumns[key];
        return (
          <button
            key={key}
            type="button"
            role="menuitemcheckbox"
            aria-checked={isChecked}
            className={parkingStyles.columnsDropdownItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleColumn(key);
            }}
          >
            <span className={parkingStyles.columnsCheckIcon}>
              {isChecked && <Check className="h-4 w-4" />}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
