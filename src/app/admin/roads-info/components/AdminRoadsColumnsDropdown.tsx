import React from "react";
import { Check } from "lucide-react";
import { ColumnsMenuPosition, VisibleColumnsRoads, VisibleColumnsNews } from "../types";
import roadsStyles from "../admin-roads-info.module.css";

interface AdminRoadsColumnsDropdownProps {
  isOpen: boolean;
  position: ColumnsMenuPosition | null;
  visibleColumns: VisibleColumnsRoads;
  onToggleColumn: (key: keyof VisibleColumnsRoads) => void;
}

export function AdminRoadsColumnsDropdown({
  isOpen,
  position,
  visibleColumns,
  onToggleColumn,
}: AdminRoadsColumnsDropdownProps) {
  if (!isOpen || !position) return null;

  const columnsList: { key: keyof VisibleColumnsRoads; label: string }[] = [
    { key: "name", label: "اسم الطريق / المحور" },
    { key: "type", label: "نوع الطريق" },
    { key: "length", label: "الطول (كم)" },
    { key: "endpoints", label: "البداية والنهاية" },
    { key: "speeds", label: "السرعات المقررة" },
    { key: "lanes", label: "عدد الحارات" },
    { key: "status", label: "حالة الطريق" },
    { key: "emergency", label: "رقم الطوارئ" },
    { key: "mapUrl", label: "رابط الخريطة" },
  ];

  return (
    <div
      className={roadsStyles.columnsDropdownMenu}
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
      <div className={roadsStyles.columnsDropdownHeader}>إظهار / إخفاء الأعمدة</div>

      {columnsList.map(({ key, label }) => {
        const isChecked = visibleColumns[key];
        return (
          <button
            key={key}
            type="button"
            role="menuitemcheckbox"
            aria-checked={isChecked}
            className={roadsStyles.columnsDropdownItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleColumn(key);
            }}
          >
            <span className={roadsStyles.columnsCheckIcon}>
              {isChecked && <Check className="h-4 w-4" />}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

interface AdminNewsColumnsDropdownProps {
  isOpen: boolean;
  position: ColumnsMenuPosition | null;
  visibleColumns: VisibleColumnsNews;
  onToggleColumn: (key: keyof VisibleColumnsNews) => void;
}

export function AdminNewsColumnsDropdown({
  isOpen,
  position,
  visibleColumns,
  onToggleColumn,
}: AdminNewsColumnsDropdownProps) {
  if (!isOpen || !position) return null;

  const columnsList: { key: keyof VisibleColumnsNews; label: string }[] = [
    { key: "title", label: "عنوان التنبيه" },
    { key: "category", label: "التصنيف" },
    { key: "severity", label: "درجة الأهمية" },
    { key: "roadName", label: "الطريق المعني" },
    { key: "source", label: "المصدر" },
    { key: "date", label: "تاريخ النشر" },
    { key: "status", label: "الحالة (نشط/أرشيف)" },
  ];

  return (
    <div
      className={roadsStyles.columnsDropdownMenu}
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
      <div className={roadsStyles.columnsDropdownHeader}>إظهار / إخفاء الأعمدة</div>

      {columnsList.map(({ key, label }) => {
        const isChecked = visibleColumns[key];
        return (
          <button
            key={key}
            type="button"
            role="menuitemcheckbox"
            aria-checked={isChecked}
            className={roadsStyles.columnsDropdownItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleColumn(key);
            }}
          >
            <span className={roadsStyles.columnsCheckIcon}>
              {isChecked && <Check className="h-4 w-4" />}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
