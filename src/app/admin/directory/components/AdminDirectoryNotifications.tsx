import React from "react";
import { IconCheck, IconAlertTriangle } from "@tabler/icons-react";

interface AdminDirectoryNotificationsProps {
  notification: {
    type: "success" | "error";
    text: string;
  } | null;
}

export function AdminDirectoryNotifications({
  notification,
}: AdminDirectoryNotificationsProps) {
  if (!notification) return null;

  const isSuccess = notification.type === "success";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 18px",
        borderRadius: "12px",
        marginBottom: "20px",
        fontSize: "0.92rem",
        fontWeight: "600",
        animation: "slide-in-section 0.3s ease",
        background: isSuccess
          ? "rgba(34, 197, 94, 0.15)"
          : "rgba(239, 68, 68, 0.15)",
        border: `1px solid ${
          isSuccess ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"
        }`,
        color: isSuccess ? "#22c55e" : "#ef4444",
      }}
    >
      {isSuccess ? <IconCheck size={20} /> : <IconAlertTriangle size={20} />}
      <span>{notification.text}</span>
    </div>
  );
}
