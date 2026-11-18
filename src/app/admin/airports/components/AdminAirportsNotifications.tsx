import React from "react";
import { AlertTriangle } from "lucide-react";

interface AdminAirportsNotificationsProps {
  error?: string;
  success?: string;
  dbConnected: boolean;
}

export function AdminAirportsNotifications({
  error,
  success,
  dbConnected,
}: AdminAirportsNotificationsProps) {
  return (
    <>
      {/* DB Connection Notice */}
      {!dbConnected && (
        <div
          style={{
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.25)",
            padding: "14px 18px",
            borderRadius: "12px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <div style={{ fontSize: "0.88rem", color: "#d97706", lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, marginLeft: "4px" }}>
              وضع الحفظ المحلي (LocalStorage):
            </span>
            لم يتم العثور على اتصال نشط بجدول المطارات في Supabase. التغييرات والإضافات تحفظ في متصفحك مؤقتاً كنسخة احتياطية.
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            color: "#ef4444",
            padding: "12px 18px",
            borderRadius: "10px",
            marginBottom: "16px",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {/* Global Success Banner */}
      {success && (
        <div
          style={{
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.25)",
            color: "#22c55e",
            padding: "12px 18px",
            borderRadius: "10px",
            marginBottom: "16px",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          {success}
        </div>
      )}
    </>
  );
}
