import React from "react";
import styles from "../admin-places.module.css";

export const AdminPlacesLoading: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner} />
      <p className={styles.loadingText}>جاري تحميل بيانات الأماكن...</p>
    </div>
  );
};
