"use client";

import React from "react";
import styles from "../admin-maintenance.module.css";
import { StatusMessage } from "../types";

interface MaintenanceStatusToastProps {
  status: StatusMessage | null;
  onClose: () => void;
}

export default function MaintenanceStatusToast({
  status,
  onClose,
}: MaintenanceStatusToastProps) {
  if (!status) return null;

  const isSuccess = status.type === "success";

  return (
    <div
      className={`${styles.statusToast} ${
        isSuccess ? styles.statusToastSuccess : styles.statusToastError
      }`}
      role="alert"
    >
      <div className="flex items-center gap-2.5">
        <i
          className={`bx ${isSuccess ? "bx-check-circle" : "bx-error-circle"} text-xl`}
        />
        <span>{status.text}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className={styles.toastCloseBtn}
        aria-label="إغلاق التنبيه"
      >
        <i className="bx bx-x" />
      </button>
    </div>
  );
}
