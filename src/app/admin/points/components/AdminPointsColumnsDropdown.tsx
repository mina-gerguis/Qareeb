"use client";

import React from "react";
import { Check } from "lucide-react";
import {
  AdminPointsTab,
  ColumnsMenuPosition,
  UsersVisibleColumns,
  RequestsVisibleColumns,
  PromoVisibleColumns,
} from "../types";
import styles from "../admin-points.module.css";

interface AdminPointsColumnsDropdownProps {
  isOpen: boolean;
  position: ColumnsMenuPosition | null;
  activeTab: AdminPointsTab;
  usersColumns: UsersVisibleColumns;
  requestsColumns: RequestsVisibleColumns;
  promoColumns: PromoVisibleColumns;
  onToggleUserColumn: (key: keyof UsersVisibleColumns) => void;
  onToggleRequestColumn: (key: keyof RequestsVisibleColumns) => void;
  onTogglePromoColumn: (key: keyof PromoVisibleColumns) => void;
}

export function AdminPointsColumnsDropdown({
  isOpen,
  position,
  activeTab,
  usersColumns,
  requestsColumns,
  promoColumns,
  onToggleUserColumn,
  onToggleRequestColumn,
  onTogglePromoColumn,
}: AdminPointsColumnsDropdownProps) {
  if (!isOpen || !position) return null;

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

      {activeTab === "users" && (
        <>
          {[
            { key: "username", label: "اسم المستخدم" },
            { key: "full_name", label: "الاسم الكامل" },
            { key: "email", label: "البريد الإلكتروني" },
            { key: "phone", label: "رقم الهاتف" },
            { key: "balance", label: "الرصيد الأساسي" },
            { key: "promo_balance", label: "الرصيد الترويجي" },
            { key: "points", label: "النقاط" },
            { key: "actions", label: "زر الإجراءات" },
          ].map(({ key, label }) => {
            const isChecked = usersColumns[key as keyof UsersVisibleColumns];
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
                  onToggleUserColumn(key as keyof UsersVisibleColumns);
                }}
              >
                <span className={styles.columnsCheckIcon}>
                  {isChecked && <Check className="h-4 w-4" />}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </>
      )}

      {activeTab === "requests" && (
        <>
          {[
            { key: "user", label: "بيانات المستخدم" },
            { key: "type", label: "نوع العملية" },
            { key: "amount", label: "المبلغ" },
            { key: "method", label: "بيانات التحويل" },
            { key: "receipt", label: "إيصال التحويل" },
            { key: "created_at", label: "تاريخ الطلب" },
            { key: "status", label: "حالة العملية" },
            { key: "actions", label: "خيارات الإدارة" },
          ].map(({ key, label }) => {
            const isChecked = requestsColumns[key as keyof RequestsVisibleColumns];
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
                  onToggleRequestColumn(key as keyof RequestsVisibleColumns);
                }}
              >
                <span className={styles.columnsCheckIcon}>
                  {isChecked && <Check className="h-4 w-4" />}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </>
      )}

      {activeTab === "promo_ledger" && (
        <>
          {[
            { key: "user", label: "المستخدم" },
            { key: "type", label: "نوع الحركة" },
            { key: "description", label: "التفاصيل" },
            { key: "amount", label: "القيمة" },
            { key: "code", label: "الكود المرجعي" },
            { key: "expires_at", label: "تاريخ الانتهاء" },
            { key: "created_at", label: "تاريخ الحركة" },
          ].map(({ key, label }) => {
            const isChecked = promoColumns[key as keyof PromoVisibleColumns];
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
                  onTogglePromoColumn(key as keyof PromoVisibleColumns);
                }}
              >
                <span className={styles.columnsCheckIcon}>
                  {isChecked && <Check className="h-4 w-4" />}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}
