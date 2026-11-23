"use client";

import React from "react";
import { Check } from "lucide-react";
import { ColumnsMenuPosition, VouchersVisibleColumns } from "../types";
import styles from "../vouchers.module.css";

interface AdminVouchersColumnsDropdownProps {
  isOpen: boolean;
  position: ColumnsMenuPosition | null;
  visibleColumns: VouchersVisibleColumns;
  onToggleColumn: (key: keyof VouchersVisibleColumns) => void;
}

export function AdminVouchersColumnsDropdown({
  isOpen,
  position,
  visibleColumns,
  onToggleColumn,
}: AdminVouchersColumnsDropdownProps) {
  if (!isOpen || !position) return null;

  const columnsList: { key: keyof VouchersVisibleColumns; label: string }[] = [
    { key: "code", label: "الكود" },
    { key: "title", label: "العنوان والدفعة" },
    { key: "reward", label: "نوع المكافأة والنتيجة" },
    { key: "usage", label: "الاستخدامات" },
    { key: "expiresAt", label: "صلاحية الكود" },
    { key: "status", label: "الحالة" },
    { key: "actions", label: "الإجراءات" },
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
}
