"use client";

import React, { useEffect } from "react";
import styles from "../admin-maintenance.module.css";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import { MaintenanceItem } from "../types";

interface MaintenancePreviewModalProps {
  previewItem: MaintenanceItem | null;
  onClose: () => void;
}

export default function MaintenancePreviewModal({
  previewItem,
  onClose,
}: MaintenancePreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (previewItem) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewItem, onClose]);

  if (!previewItem) return null;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.previewModalWrapper}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className={styles.previewHeaderBar}>
          <div className={styles.previewTitle}>
            <i className="bx bx-show text-amber-500 text-lg" />
            <span>معاينة حية: كيف تظهر شاشة الصيانة للزوار</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.modalCloseBtn}
            aria-label="إغلاق المعاينة"
          >
            <i className="bx bx-x text-2xl" />
          </button>
        </div>

        {/* Maintenance Screen Simulator */}
        <div className={styles.previewScreenContainer}>
          <MaintenanceScreen maintenance={previewItem} />
        </div>
      </div>
    </div>
  );
}
