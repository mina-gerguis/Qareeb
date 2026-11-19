import React from "react";
import { Check } from "lucide-react";
import { VisibleColumns, ColumnsMenuPosition } from "../types";
import styles from "../admin-places.module.css";

interface Props {
  isOpen: boolean;
  position: ColumnsMenuPosition | null;
  visibleColumns: VisibleColumns;
  onToggleColumn: (key: keyof VisibleColumns) => void;
}

export const AdminPlacesColumnsDropdown: React.FC<Props> = ({
  isOpen,
  position,
  visibleColumns,
  onToggleColumn,
}) => {
  if (!isOpen || !position) return null;

  const columnsList: { key: keyof VisibleColumns; label: string }[] = [
    { key: "image", label: "الصورة الرئيسية" },
    { key: "name", label: "اسم المكان والكود" },
    { key: "category", label: "القسم والتصنيف" },
    { key: "location", label: "المنطقة والفروع" },
    { key: "features", label: "المميزات والخدمات" },
    { key: "workingHours", label: "مواعيد العمل" },
    { key: "actions", label: "زر الإجراءات" },
  ];

  return (
    <div
      className={styles.columnsDropdownMenu}
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 99999,
      }}
      role="menu"
      dir="rtl"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.columnsDropdownHeader}>إظهار / إخفاء الأعمدة</div>

      {columnsList.map(({ key, label }) => {
        const isChecked = visibleColumns[key];
        return (
          <button
            key={key}
            type="button"
            role="menuitemcheckbox"
            aria-checked={isChecked}
            className={styles.columnsDropdownItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleColumn(key);
            }}
          >
            <span className={styles.columnsCheckIcon}>
              {isChecked && <Check className="h-4 w-4" />}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
