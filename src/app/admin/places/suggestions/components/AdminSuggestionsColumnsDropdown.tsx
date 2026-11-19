import React from "react";
import { Check } from "lucide-react";
import { VisibleColumns, ColumnsMenuPosition } from "../types";
import suggestionsStyles from "../admin-suggestions.module.css";

interface AdminSuggestionsColumnsDropdownProps {
  isOpen: boolean;
  position: ColumnsMenuPosition | null;
  visibleColumns: VisibleColumns;
  onToggleColumn: (key: keyof VisibleColumns) => void;
}

export function AdminSuggestionsColumnsDropdown({
  isOpen,
  position,
  visibleColumns,
  onToggleColumn,
}: AdminSuggestionsColumnsDropdownProps) {
  if (!isOpen || !position) return null;

  const columnsList: { key: keyof VisibleColumns; label: string }[] = [
    { key: "select", label: "تحديد السجل" },
    { key: "image", label: "صورة المكان" },
    { key: "name", label: "اسم المكان والمدينة" },
    { key: "category", label: "التصنيف" },
    { key: "proposer", label: "صاحب الاقتراح" },
    { key: "date", label: "تاريخ التقديم" },
    { key: "status", label: "حالة الطلب" },
    { key: "actions", label: "زر الإجراءات" },
  ];

  return (
    <div
      className={suggestionsStyles.columnsDropdownMenu}
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
      <div className={suggestionsStyles.columnsDropdownHeader}>
        إظهار / إخفاء الأعمدة
      </div>

      {columnsList.map(({ key, label }) => {
        const isChecked = visibleColumns[key];
        return (
          <button
            key={key}
            type="button"
            role="menuitemcheckbox"
            aria-checked={isChecked}
            className={suggestionsStyles.columnsDropdownItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleColumn(key);
            }}
          >
            <span className={suggestionsStyles.columnsCheckIcon}>
              {isChecked && <Check className="h-4 w-4" />}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
