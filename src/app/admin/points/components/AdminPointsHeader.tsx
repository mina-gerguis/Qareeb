"use client";

import React from "react";
import styles from "../admin-points.module.css";
import { AdminPointsTab } from "../types";

interface AdminPointsHeaderProps {
  activeTab: AdminPointsTab;
  pendingRequestsCount: number;
}

export function AdminPointsHeader({
  activeTab,
  pendingRequestsCount,
}: AdminPointsHeaderProps) {
  const getHeaderInfo = () => {
    switch (activeTab) {
      case "requests":
        return {
          title: "طلبات الإيداع والسحب المعلقة",
          subtitle: "مراجعة واعتماد أو رفض طلبات شحن المحفظة وسحب الرصيد الخاصة بالمستخدمين",
          badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} معلق` : null,
        };
      case "promo_ledger":
        return {
          title: "سجل حركات الرصيد الترويجي",
          subtitle: "متابعة إضافات وخصومات الرصيد الترويجي ومواعيد انتهاء الصلاحية والأكواد الترويجية",
          badge: null,
        };
      default:
        return {
          title: "إدارة حسابات المستخدمين والأرصدة",
          subtitle: "عرض وتعديل النقاط والأرصدة الأساسية والترويجية لكافة حسابات المستخدمين",
          badge: null,
        };
    }
  };

  const { title, subtitle, badge } = getHeaderInfo();

  return (
    <div className={styles.headerBar}>
      <div className={styles.headerTextGroup}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <h1 className={styles.headerTitle}>{title}</h1>
          {badge && <span className={styles.navBadge}>{badge}</span>}
        </div>
        <p className={styles.headerSubtitle}>{subtitle}</p>
      </div>
    </div>
  );
}
