"use client";

import React from "react";
import styles from "../admin-maintenance.module.css";

interface MaintenanceStatsProps {
  totalCount: number;
  activeCount: number;
  isGlobalMaintenanceActive: boolean;
}

export default function MaintenanceStats({
  totalCount,
  activeCount,
  isGlobalMaintenanceActive,
}: MaintenanceStatsProps) {
  const openCount = totalCount - activeCount;

  return (
    <section className={styles.statsGrid}>
      {/* Total Pages */}
      <div className={styles.statCard}>
        <div
          className={styles.statIconBox}
          style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}
        >
          <i className="bx bx-layer" />
        </div>
        <div className={styles.statContent}>
          <div className={styles.statLabel}>إجمالي الصفحات المتاحة</div>
          <div className={styles.statValue}>{totalCount}</div>
        </div>
      </div>

      {/* Pages Under Maintenance */}
      <div className={`${styles.statCard} ${activeCount > 0 ? styles.statCardWarning : ""}`}>
        <div
          className={styles.statIconBox}
          style={{ background: "rgba(234, 88, 12, 0.15)", color: "#ea580c" }}
        >
          <i className="bx bx-wrench" />
        </div>
        <div className={styles.statContent}>
          <div className={styles.statLabel}>صفحات تحت الصيانة حالياً</div>
          <div className={styles.statValue} style={{ color: "#ea580c" }}>
            {activeCount}
            {activeCount > 0 && <span className={styles.pulseDot} title="نشطة حالياً" />}
          </div>
        </div>
      </div>

      {/* Open Pages */}
      <div className={styles.statCard}>
        <div
          className={styles.statIconBox}
          style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}
        >
          <i className="bx bx-check-double" />
        </div>
        <div className={styles.statContent}>
          <div className={styles.statLabel}>صفحات مفتوحة للزوار</div>
          <div className={styles.statValue} style={{ color: "#10b981" }}>
            {openCount}
          </div>
        </div>
      </div>

      {/* Global Status */}
      <div className={styles.statCard}>
        <div
          className={styles.statIconBox}
          style={{
            background: isGlobalMaintenanceActive
              ? "rgba(239, 68, 68, 0.18)"
              : "rgba(16, 185, 129, 0.18)",
            color: isGlobalMaintenanceActive ? "#ef4444" : "#10b981",
          }}
        >
          <i className={`bx ${isGlobalMaintenanceActive ? "bx-lock" : "bx-globe"}`} />
        </div>
        <div className={styles.statContent}>
          <div className={styles.statLabel}>حالة الموقع العام</div>
          <div
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: isGlobalMaintenanceActive ? "#ef4444" : "#10b981",
            }}
          >
            {isGlobalMaintenanceActive ? "صيانة عامة لكافة الموقع" : "الموقع يعمل بشكل طبيعي"}
          </div>
        </div>
      </div>
    </section>
  );
}
