"use client";

import React from "react";
import busStyles from "../admin-bus-stations.module.css";

export const AdminBusStationsLoading: React.FC = () => {
  return (
    <div className={busStyles.loadingContainer}>
      <div className={busStyles.spinner} />
      <span className={busStyles.loadingText}>جاري تحميل بيانات مواقف الأتوبيسات وسوبرجيت...</span>
    </div>
  );
};
