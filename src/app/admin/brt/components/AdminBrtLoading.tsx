"use client";

import React from "react";
import brtStyles from "../admin-brt.module.css";

export const AdminBrtLoading: React.FC = () => {
  return (
    <div className={brtStyles.loadingContainer}>
      <div className={brtStyles.spinner} />
      <span className={brtStyles.loadingText}>جاري تحميل بيانات الأتوبيس الترددي (BRT)...</span>
    </div>
  );
};
