"use client";

import React from "react";
import styles from "../vouchers.module.css";
import { VouchersKpiData } from "../types";

interface AdminVouchersKpisProps {
  kpis: VouchersKpiData;
}

export function AdminVouchersKpis({ kpis }: AdminVouchersKpisProps) {
  return (
    <div className={styles.kpiGrid}>
      <div className={styles.kpiCard}>
        <div className={styles.kpiTop}>
          <span className={styles.kpiLabel}>إجمالي الأكواد المسجلة</span>
          <span
            className={styles.kpiIcon}
            style={{ background: "rgba(59, 130, 246, 0.14)", color: "#3b82f6" }}
          >
            <i className="bx bxs-coupon" />
          </span>
        </div>
        <div className={styles.kpiValue}>{kpis.total}</div>
        <span className={styles.kpiHint}>تشمل الأكواد الفردية والدفعات</span>
      </div>

      <div className={styles.kpiCard}>
        <div className={styles.kpiTop}>
          <span className={styles.kpiLabel}>الأكواد النشطة حالياً</span>
          <span
            className={styles.kpiIcon}
            style={{ background: "rgba(16, 185, 129, 0.14)", color: "#10b981" }}
          >
            <i className="bx bx-check-shield" />
          </span>
        </div>
        <div className={styles.kpiValue}>{kpis.active}</div>
        <span className={styles.kpiHint}>متاحة للاسترداد من صفحة الملف الشخصي</span>
      </div>

      <div className={styles.kpiCard}>
        <div className={styles.kpiTop}>
          <span className={styles.kpiLabel}>إجمالي عمليات الاسترداد</span>
          <span
            className={styles.kpiIcon}
            style={{ background: "rgba(245, 158, 11, 0.14)", color: "#f59e0b" }}
          >
            <i className="bx bx-transfer-alt" />
          </span>
        </div>
        <div className={styles.kpiValue}>{kpis.totalRedemptions.toLocaleString("ar-EG")}</div>
        <span className={styles.kpiHint}>عبر كل أنواع المكافآت</span>
      </div>

      <div className={styles.kpiCard}>
        <div className={styles.kpiTop}>
          <span className={styles.kpiLabel}>الرصيد الترويجي الممنوح</span>
          <span
            className={styles.kpiIcon}
            style={{ background: "rgba(99, 102, 241, 0.14)", color: "#818cf8" }}
          >
            <i className="bx bx-gift" />
          </span>
        </div>
        <div className={styles.kpiValue}>
          {kpis.promoValueGranted.toLocaleString("ar-EG")}{" "}
          <small style={{ fontSize: "0.85rem", fontWeight: 700 }}>ج.م</small>
        </div>
        <span className={styles.kpiHint}>رصيد تشجيعي للاستخدام داخل الموقع</span>
      </div>
    </div>
  );
}
