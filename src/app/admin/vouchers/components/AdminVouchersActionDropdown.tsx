"use client";

import React from "react";
import {
  IconCopy,
  IconEdit,
  IconHistory,
  IconPlayerPause,
  IconPlayerPlay,
  IconTrash,
} from "@tabler/icons-react";
import { ActionMenuState, VoucherItem } from "../types";
import styles from "../vouchers.module.css";

interface AdminVouchersActionDropdownProps {
  actionMenu: ActionMenuState | null;
  onClose: () => void;
  onCopyCode: (voucher: VoucherItem) => void;
  onOpenEditModal: (voucher: VoucherItem) => void;
  onToggleStatus: (voucher: VoucherItem) => void;
  onOpenLogsModal: (voucher: VoucherItem) => void;
  onDeleteVoucher: (id: string) => void;
}

export function AdminVouchersActionDropdown({
  actionMenu,
  onClose,
  onCopyCode,
  onOpenEditModal,
  onToggleStatus,
  onOpenLogsModal,
  onDeleteVoucher,
}: AdminVouchersActionDropdownProps) {
  if (!actionMenu) return null;
  const { voucher } = actionMenu;

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
          onCopyCode(voucher);
        }}
      >
        <IconCopy size={16} />
        <span>نسخ الكود</span>
      </button>

      <button
        type="button"
        className={styles.actionDropdownItem}
        onClick={() => {
          onClose();
          onOpenEditModal(voucher);
        }}
      >
        <IconEdit size={16} />
        <span>تعديل الخصائص</span>
      </button>

      <button
        type="button"
        className={styles.actionDropdownItem}
        onClick={() => {
          onClose();
          onOpenLogsModal(voucher);
        }}
      >
        <IconHistory size={16} />
        <span>سجل الاسترداد</span>
      </button>

      {(voucher.status === "active" || voucher.status === "paused") && (
        <button
          type="button"
          className={styles.actionDropdownItem}
          onClick={() => {
            onClose();
            onToggleStatus(voucher);
          }}
        >
          {voucher.status === "active" ? (
            <>
              <IconPlayerPause size={16} />
              <span>إيقاف مؤقت</span>
            </>
          ) : (
            <>
              <IconPlayerPlay size={16} />
              <span>تفعيل الكود</span>
            </>
          )}
        </button>
      )}

      <div className={styles.actionDropdownSeparator} />

      <button
        type="button"
        className={`${styles.actionDropdownItem} ${styles.actionDropdownItemDanger}`}
        onClick={() => {
          onClose();
          onDeleteVoucher(voucher.id);
        }}
      >
        <IconTrash size={16} />
        <span>حذف القسيمة</span>
      </button>
    </div>
  );
}
