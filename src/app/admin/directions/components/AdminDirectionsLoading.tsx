"use client";

import React from "react";
import styles from "../admin-directions.module.css";

export const AdminDirectionsLoading: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner} />
      <span className={styles.loadingText}>جاري تحميل مسارات وخطوط المواصلات...</span>
    </div>
  );
};
