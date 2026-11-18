"use client";

import React from "react";
import railwaysStyles from "../admin-railways.module.css";

export const AdminRailwaysLoading: React.FC = () => {
  return (
    <div className={railwaysStyles.loadingContainer}>
      <div className={railwaysStyles.spinner} />
      <span className={railwaysStyles.loadingText}>جاري تحميل بيانات سكك حديد مصر...</span>
    </div>
  );
};
