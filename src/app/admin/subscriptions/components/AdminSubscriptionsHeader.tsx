"use client";

import React from "react";
import styles from "../subscriptions.module.css";
import { SubscriptionsTab } from "../types";

interface AdminSubscriptionsHeaderProps {
  activeTab: SubscriptionsTab;
  onTabChange: (tab: SubscriptionsTab) => void;
  loading: boolean;
  onRefresh: () => void;
  usersCount: number;
  plansCount: number;
  isTrialActive: boolean;
  activeOffersCount: number;
}

export function AdminSubscriptionsHeader({
  activeTab,
  onTabChange,
  loading,
  onRefresh,
  usersCount,
  plansCount,
  isTrialActive,
  activeOffersCount,
}: AdminSubscriptionsHeaderProps) {
  return (
    <>
      {/* Top Header Row */}
      <div className={styles.headerBar}>
        <div className={styles.headerTextGroup}>
          <h1 className={styles.headerTitle}>👑 إدارة الباقات والاشتراكات</h1>
          <p className={styles.headerSubtitle}>
            إدارة أسعار ومزايا الباقات، متابعة اشتراكات الأعضاء، وتفعيل العروض والخصومات والوصول المجاني
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
            <span>تحديث البيانات</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation (Segmented Control) */}
      <div className={styles.mainNavTabs}>
        <button
          type="button"
          onClick={() => onTabChange("users")}
          className={`${styles.mainNavBtn} ${
            activeTab === "users" ? styles.mainNavBtnActive : styles.mainNavBtnInactive
          }`}
        >
          <i className="bx bx-user-check" style={{ fontSize: "1.2rem" }} />
          <span>اشتراكات الأعضاء ({usersCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("plans")}
          className={`${styles.mainNavBtn} ${
            activeTab === "plans" ? styles.mainNavBtnActive : styles.mainNavBtnInactive
          }`}
        >
          <i className="bx bx-layer" style={{ fontSize: "1.2rem" }} />
          <span>تحرير أسعار ومميزات الباقات ({plansCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("promotions")}
          className={`${styles.mainNavBtn} ${
            activeTab === "promotions" ? styles.mainNavBtnActive : styles.mainNavBtnInactive
          }`}
        >
          <i className="bx bx-gift" style={{ fontSize: "1.2rem", color: "#f59e0b" }} />
          <span>العروض والخصومات 🎁</span>
          {(isTrialActive || activeOffersCount > 0) && (
            <span className={styles.navBadge}>نشط</span>
          )}
        </button>
      </div>
    </>
  );
}
