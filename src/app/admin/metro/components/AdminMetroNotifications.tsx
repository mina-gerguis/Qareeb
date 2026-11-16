import React from "react";
import styles from "../../admin.module.css";
import { IconCircleDashedCheck, IconCircleX } from "@tabler/icons-react";

interface AdminMetroNotificationsProps {
  error?: string;
  success?: string;
  dbStatus: boolean;
}

export function AdminMetroNotifications({
  error,
  success,
  dbStatus,
}: AdminMetroNotificationsProps) {
  return (
    <>
      {success && (
        <div
          className="alert-success font-sub flex align-center gap-2 p-2 rounded-md mb-4"
        >
         <IconCircleDashedCheck stroke={2} size={18}/>
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div
          className="alert-error font-sub flex align-center gap-2 p-2 rounded-md mb-4"
        >
          <IconCircleX  stroke={2} size={18} />
          <span style={{ fontSize: "0.85rem", lineHeight: "1.5" }}>{error}</span>
        </div>
      )}

      {!dbStatus && (
        <div
          style={{
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            padding: "16px 20px",
            borderRadius: "14px",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#f59e0b", fontWeight: "bold" }}>
            <i className="bx bx-warning" style={{ fontSize: "1.3rem" }} />
            <span>يعمل في وضع الحفظ المحلي (LocalStorage)</span>
          </div>
        </div>
      )}
    </>
  );
}

