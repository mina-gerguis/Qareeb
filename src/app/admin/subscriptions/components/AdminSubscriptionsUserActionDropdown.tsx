"use client";

import React from "react";
import {
  IconEdit,
  IconCalendarPlus,
} from "@tabler/icons-react";
import { UserActionMenuState, UserProfile } from "../types";
import styles from "../subscriptions.module.css";

interface AdminSubscriptionsUserActionDropdownProps {
  actionMenu: UserActionMenuState | null;
  onClose: () => void;
  onEdit: (user: UserProfile) => void;
  onQuickExtend: (user: UserProfile, days: number) => void;
}

export function AdminSubscriptionsUserActionDropdown({
  actionMenu,
  onClose,
  onEdit,
  onQuickExtend,
}: AdminSubscriptionsUserActionDropdownProps) {
  if (!actionMenu) return null;
  const { user } = actionMenu;

  return (
    <div
      className={styles.actionDropdownMenu}
      style={{
        position: "fixed",
        top: `${actionMenu.top}px`,
        left: `${actionMenu.left}px`,
        zIndex: 99999,
      }}
      role="menu"
      dir="rtl"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className={styles.actionDropdownItem}
        onClick={() => {
          onClose();
          onEdit(user);
        }}
      >
        <IconEdit size={16} style={{ color: "var(--color-primary, #6366f1)" }} />
        <span>تعديل بيانات الاشتراك</span>
      </button>

      <div className={styles.actionDropdownSeparator} />

      <button
        type="button"
        className={styles.actionDropdownItem}
        onClick={() => {
          onClose();
          onQuickExtend(user, 7);
        }}
      >
        <IconCalendarPlus size={16} style={{ color: "#38bdf8" }} />
        <span>تمديد سريع + 7 أيام</span>
      </button>

      <button
        type="button"
        className={styles.actionDropdownItem}
        onClick={() => {
          onClose();
          onQuickExtend(user, 30);
        }}
      >
        <IconCalendarPlus size={16} style={{ color: "#34d399" }} />
        <span>تمديد سريع + شهر (30 يوم)</span>
      </button>

      <button
        type="button"
        className={styles.actionDropdownItem}
        onClick={() => {
          onClose();
          onQuickExtend(user, 90);
        }}
      >
        <IconCalendarPlus size={16} style={{ color: "#fbbf24" }} />
        <span>تمديد سريع + 3 شهور (90 يوم)</span>
      </button>
    </div>
  );
}
