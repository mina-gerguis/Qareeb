"use client";

import React from "react";
import styles from "../vouchers.module.css";

interface AdminVouchersHeaderProps {
  loading: boolean;
  redemptionLogsCount: number;
  onRefresh: () => void;
  onOpenLogsModal: () => void;
  onOpenCreateModal: () => void;
}

export function AdminVouchersHeader({
  loading,
  redemptionLogsCount,
  onRefresh,
  onOpenLogsModal,
  onOpenCreateModal,
}: AdminVouchersHeaderProps) {
  return (
    <div className={styles.headerRow}>
      <div className={styles.headerText}>
        <h1>إدارة القسائم والأكواد الترويجية</h1>
        <p>
          إنشاء وإدارة أكواد الشحن، الرصيد الترويجي، وفتح المميزات والأقسام المؤقتة
        </p>
      </div>

      <div className={styles.headerActions}>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={onRefresh}
          disabled={loading}
        >
          <i
            className={`bx bx-refresh ${loading ? "bx-spin" : ""}`}
            style={{ fontSize: "1.15rem" }}
          />
          <span>تحديث</span>
        </button>

        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={onOpenLogsModal}
        >
          <i className="bx bx-history" style={{ fontSize: "1.15rem" }} />
          <span>سجل الاستردادات ({redemptionLogsCount})</span>
        </button>

        <button
          type="button"
          className={styles.primaryBtn}
          onClick={onOpenCreateModal}
        >
          <i className="bx bx-plus-circle" style={{ fontSize: "1.15rem" }} />
          <span>إنشاء كود جديد</span>
        </button>
      </div>
    </div>
  );
}
