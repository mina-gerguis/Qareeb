"use client";

import React from "react";
import parkingStyles from "../admin-parking.module.css";

export const AdminParkingLoading: React.FC = () => {
  return (
    <div className={parkingStyles.loadingContainer}>
      <div className={parkingStyles.spinner} />
      <span className={parkingStyles.loadingText}>جاري تحميل بيانات الجراجات وأماكن الانتظار...</span>
    </div>
  );
};
