import React from "react";
import suggestionsStyles from "../admin-suggestions.module.css";

export function AdminSuggestionsLoading() {
  return (
    <div className={suggestionsStyles.suggestionsContainer}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid rgba(59, 130, 246, 0.2)",
            borderTopColor: "var(--color-primary, #3b82f6)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "var(--text-muted, #94a3b8)", fontSize: "0.95rem", margin: 0 }}>
          جاري تحميل اقتراحات الأماكن والمراجعات...
        </p>
      </div>
    </div>
  );
}
