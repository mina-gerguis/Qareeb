"use client";

import React from "react";
import microStyles from "../admin-microbus-stations.module.css";

export const AdminMicrobusStationsLoading: React.FC = () => {
  return (
    <div className={microStyles.loadingContainer}>
      <div className={microStyles.spinner} />
      <span className={microStyles.loadingText}>جاري تحميل بيانات مواقف السرفيس والميكروباص...</span>
    </div>
  );
};
