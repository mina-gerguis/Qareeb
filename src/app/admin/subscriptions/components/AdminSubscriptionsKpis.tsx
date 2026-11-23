"use client";

import React from "react";
import styles from "../subscriptions.module.css";
import { SubscriptionsKpiData } from "../types";

interface AdminSubscriptionsKpisProps {
  kpis: SubscriptionsKpiData;
}

export function AdminSubscriptionsKpis({ kpis }: AdminSubscriptionsKpisProps) {
  return (
    <div className={styles.kpiGrid}>
      <div className={styles.kpiCard}>
        <div className={styles.kpiTop}>
          <span className={styles.kpiLabel}>إجمالي المشتركين</span>
          <span
            className={styles.kpiIcon}
            style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}
          >
            <i className="bx bx-group" />
          </span>
        </div>
        <div className={styles.kpiValue}>{kpis.totalSubscribers}</div>
        <span className={styles.kpiHint}>كافة الحسابات المسجلة بالنظام</span>
      </div>

      <div className={styles.kpiCard}>
        <div className={styles.kpiTop}>
          <span className={styles.kpiLabel}>اشتراكات نشطة 🟢</span>
          <span
            className={styles.kpiIcon}
            style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}
          >
            <i className="bx bx-check-circle" />
          </span>
        </div>
        <div className={styles.kpiValue}>{kpis.activeSubscribers}</div>
        <span className={styles.kpiHint}>باقات مدفوعة وسارية المفعول</span>
      </div>

      <div className={styles.kpiCard}>
        <div className={styles.kpiTop}>
          <span className={styles.kpiLabel}>عرض التسجيل الجديد</span>
          <span
            className={styles.kpiIcon}
            style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}
          >
            <i className="bx bx-gift" />
          </span>
        </div>
        <div className={styles.kpiValue} style={{ fontSize: "1.25rem" }}>
          {kpis.isTrialActive ? "مفعّل 🎁" : "معطّل ⚪"}
        </div>
        <span className={styles.kpiHint}>اشتراك مجاني فوري للحسابات الجديدة</span>
      </div>

      <div className={styles.kpiCard}>
        <div className={styles.kpiTop}>
          <span className={styles.kpiLabel}>صفحات مفتوحة مجاناً</span>
          <span
            className={styles.kpiIcon}
            style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}
          >
            <i className="bx bx-lock-open-alt" />
          </span>
        </div>
        <div className={styles.kpiValue}>{kpis.activeOffersCount}</div>
        <span className={styles.kpiHint}>عروض وصول مجاني بدون اشتراك</span>
      </div>
    </div>
  );
}
