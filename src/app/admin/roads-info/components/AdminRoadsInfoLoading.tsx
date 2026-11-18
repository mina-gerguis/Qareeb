"use client";

import React from "react";
import roadsStyles from "../admin-roads-info.module.css";

export const AdminRoadsInfoLoading: React.FC = () => {
  return (
    <div className={roadsStyles.loadingContainer}>
      <div className={roadsStyles.spinner} />
      <span className={roadsStyles.loadingText}>جاري تحميل بيانات الطرق والمحاور والنشرات المرورية...</span>
    </div>
  );
};
