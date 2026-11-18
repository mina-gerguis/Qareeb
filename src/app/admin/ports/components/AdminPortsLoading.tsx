import React from "react";
import portsStyles from "../admin-ports.module.css";

export function AdminPortsLoading() {
  return (
    <div
      className={portsStyles.portsContainer}
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={portsStyles.loadingSpinner} />
      <p style={{ marginTop: "16px", color: "var(--text-secondary)", fontSize: "1.05rem" }}>
        جاري تحميل إدارة الموانئ البحرية...
      </p>
    </div>
  );
}
