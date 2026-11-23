"use client";

import React from "react";
import { Check } from "lucide-react";
import { ColumnsMenuPosition, UsersVisibleColumns } from "../types";
import styles from "../subscriptions.module.css";

interface AdminSubscriptionsColumnsDropdownProps {
  isOpen: boolean;
  position: ColumnsMenuPosition | null;
  visibleColumns: UsersVisibleColumns;
  onToggleColumn: (key: keyof UsersVisibleColumns) => void;
}

export function AdminSubscriptionsColumnsDropdown({
  isOpen,
  position,
  visibleColumns,
  onToggleColumn,
}: AdminSubscriptionsColumnsDropdownProps) {
  if (!isOpen || !position) return null;

  const columnsList: { key: keyof UsersVisibleColumns; label: string }[] = [
    { key: "user", label: "المستخدم والملف الشخصي" },
    { key: "tier", label: "الباقة الحالية" },
    { key: "period", label: "فترة الاشتراك" },
    { key: "expiry", label: "تاريخ الانتهاء والمهلة" },
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
        const checked = visibleColumns[key];
        return (
          <button
            key={key}
            type="button"
            className={styles.columnsDropdownItem}
            onClick={() => onToggleColumn(key)}
            role="menuitemcheckbox"
            aria-checked={checked}
          >
            <span className={styles.columnsCheckIcon}>
              {checked && <Check size={14} strokeWidth={3} />}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
