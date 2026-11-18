import React from "react";
import airportsStyles from "../admin-airports.module.css";

export function AdminAirportsLoading() {
  return (
    <div
      className={airportsStyles.airportsContainer}
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={airportsStyles.loadingSpinner} />
      <p style={{ marginTop: "16px", color: "var(--text-secondary)", fontSize: "1.05rem" }}>
        جاري تحميل إدارة المطارات...
      </p>
    </div>
  );
}
