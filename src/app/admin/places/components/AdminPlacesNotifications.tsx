import React from "react";
import styles from "../admin-places.module.css";

interface Props {
  error?: string;
  onDismissError?: () => void;
}

export const AdminPlacesNotifications: React.FC<Props> = ({ error, onDismissError }) => {
  if (!error) return null;

  return (
    <div className={styles.notificationAlert} role="alert">
      <div className={styles.notificationAlertContent}>
        <i className="bx bx-error-circle" style={{ fontSize: "1.2rem", flexShrink: 0 }} />
        <span>{error}</span>
      </div>
      {onDismissError && (
        <button
          onClick={onDismissError}
          className={styles.notificationCloseBtn}
          aria-label="إغلاق التنبيه"
        >
          <i className="bx bx-x" />
        </button>
      )}
    </div>
  );
};
