"use client";

import React from "react";
import styles from "../admin-maintenance.module.css";

interface MaintenanceHeaderProps {
  isGlobalMaintenanceActive: boolean;
  onOpenLockAllExcept: () => void;
  onOpenGlobalToggleModal: () => void;
}

export default function MaintenanceHeader({
  isGlobalMaintenanceActive,
  onOpenLockAllExcept,
  onOpenGlobalToggleModal,
}: MaintenanceHeaderProps) {
  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerInfo}>
        <div className={styles.headerIconBox}>
          <i className="bx bx-wrench" />
        </div>
        <div>
          <h1 className={styles.title}>إدارة وضع الصيانة وحظر الصفحات</h1>
          <p className={styles.subtitle}>
            التحكم في قفل أي صفحة بالموقع وعرض شاشة الصيانة للزوار، بينما يظل بإمكان المسؤولين
            تصفحها وتجربتها بشكل كامل.
          </p>
        </div>
      </div>

      <div className={styles.headerActions}>
        {/* Lock All Except Button */}
        <button
          type="button"
          onClick={onOpenLockAllExcept}
          className={styles.batchLockBtn}
          title="قفل جميع صفحات الموقع للصيانة ما عدا صفحات محددة تختارها"
        >
          <i className="bx bx-shield-quarter text-lg" />
          <span>قفل كل الصفحات ما عدا...</span>
        </button>

        {/* Global Emergency Toggle Button */}
        <button
          type="button"
          onClick={onOpenGlobalToggleModal}
          className={`${styles.globalLockBtn} ${
            isGlobalMaintenanceActive
              ? styles.globalLockBtnActive
              : styles.globalLockBtnInactive
          }`}
          title={
            isGlobalMaintenanceActive
              ? "إلغاء الصيانة العامة وفتح الموقع للزوار"
              : "تفعيل وضع الطوارئ وقفل كامل الموقع"
          }
        >
          <i
            className={`bx ${isGlobalMaintenanceActive ? "bx-lock-open" : "bx-lock-alt"} text-lg`}
          />
          <span>
            {isGlobalMaintenanceActive
              ? "إلغاء قفل كامل الموقع (فتح للكل)"
              : "قفل كامل الموقع للصيانة الطارئة"}
          </span>
        </button>
      </div>
    </header>
  );
}
