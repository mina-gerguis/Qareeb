import React from "react";
import { Check } from "lucide-react";
import { ColumnsMenuPosition, VisibleLineColumns, VisibleStationColumns } from "../types";
import railwaysStyles from "../admin-railways.module.css";

interface AdminRailwaysColumnsDropdownProps {
  isOpen: boolean;
  position: ColumnsMenuPosition | null;
  section: "lines" | "stations";
  visibleLineColumns?: VisibleLineColumns;
  visibleStationColumns?: VisibleStationColumns;
  onToggleLineColumn?: (key: keyof VisibleLineColumns) => void;
  onToggleStationColumn?: (key: keyof VisibleStationColumns) => void;
}

export function AdminRailwaysColumnsDropdown({
  isOpen,
  position,
  section,
  visibleLineColumns,
  visibleStationColumns,
  onToggleLineColumn,
  onToggleStationColumn,
}: AdminRailwaysColumnsDropdownProps) {
  if (!isOpen || !position) return null;

  const lineColumnsList: { key: keyof VisibleLineColumns; label: string }[] = [
    { key: "id", label: "معرف المسار" },
    { key: "name", label: "اسم الخط / المسار" },
    { key: "from", label: "محطة البداية" },
    { key: "to", label: "محطة الوصول" },
    { key: "duration", label: "مدة الرحلة" },
    { key: "stopsCount", label: "عدد المحطات" },
  ];

  const stationColumnsList: { key: keyof VisibleStationColumns; label: string }[] = [
    { key: "order", label: "الترتيب" },
    { key: "name", label: "اسم المحطة" },
    { key: "status", label: "الحالة التشغيلية" },
  ];

  return (
    <div
      className={railwaysStyles.columnsDropdownMenu}
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
      <div className={railwaysStyles.columnsDropdownHeader}>إظهار / إخفاء الأعمدة</div>

      {section === "lines" &&
        visibleLineColumns &&
        lineColumnsList.map(({ key, label }) => {
          const isChecked = visibleLineColumns[key];
          return (
            <button
              key={key}
              type="button"
              role="menuitemcheckbox"
              aria-checked={isChecked}
              className={railwaysStyles.columnsDropdownItem}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleLineColumn?.(key);
              }}
            >
              <span className={railwaysStyles.columnsCheckIcon}>
                {isChecked && <Check className="h-4 w-4" />}
              </span>
              <span>{label}</span>
            </button>
          );
        })}

      {section === "stations" &&
        visibleStationColumns &&
        stationColumnsList.map(({ key, label }) => {
          const isChecked = visibleStationColumns[key];
          return (
            <button
              key={key}
              type="button"
              role="menuitemcheckbox"
              aria-checked={isChecked}
              className={railwaysStyles.columnsDropdownItem}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleStationColumn?.(key);
              }}
            >
              <span className={railwaysStyles.columnsCheckIcon}>
                {isChecked && <Check className="h-4 w-4" />}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
    </div>
  );
}
