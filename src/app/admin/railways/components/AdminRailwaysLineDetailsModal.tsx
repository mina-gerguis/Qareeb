import React from "react";
import clsx from "clsx";
import { RailwayRoute } from "../types";
import { getRouteColor } from "../utils";
import railwaysStyles from "../admin-railways.module.css";
import { IconArrowLeft, IconClock, IconMapPin, IconRoute, IconTrain } from "@tabler/icons-react";

interface AdminRailwaysLineDetailsModalProps {
  route: RailwayRoute | null;
  onClose: () => void;
  onManageStations: (routeId: string) => void;
}

export function AdminRailwaysLineDetailsModal({
  route,
  onClose,
  onManageStations,
}: AdminRailwaysLineDetailsModalProps) {
  if (!route) return null;

  const routeColor = getRouteColor(route.id);
  const stops = route.stops || [];

  return (
    <div className={railwaysStyles.modalOverlay}>
      <div className={railwaysStyles.modalContent} style={{ maxWidth: "560px" }}>
        {/* Header */}
        <div className={railwaysStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: routeColor,
                boxShadow: `0 0 10px ${routeColor}70`,
                display: "inline-block",
              }}
            />
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
              {route.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn-close"
            type="button"
            aria-label="إغلاق"
          >
            <i className="bx bx-x" />
          </button>
        </div>

        <div className={railwaysStyles.modalBody}>
          {/* Key Info Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div
              style={{
                background: "var(--bg-secondary, rgba(255, 255, 255, 0.03))",
                border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.08))",
                borderRadius: "10px",
                padding: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "4px" }}>
                <IconRoute size={16} />
                <span>المسار</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "0.95rem" }}>
                <span>{route.from}</span>
                <IconArrowLeft size={14} style={{ color: "var(--text-muted)" }} />
                <span>{route.to}</span>
              </div>
            </div>

            <div
              style={{
                background: "var(--bg-secondary, rgba(255, 255, 255, 0.03))",
                border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.08))",
                borderRadius: "10px",
                padding: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "4px" }}>
                <IconClock size={16} />
                <span>المدة المتوقعة</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-fg)" }}>
                {route.duration || "غير محدد"}
              </div>
            </div>
          </div>

          {/* Tips / Notes */}
          {route.tips && (
            <div
              style={{
                background: "rgba(59, 130, 246, 0.08)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "0.88rem",
                lineHeight: "1.6",
                color: "var(--color-fg)",
              }}
            >
              <strong style={{ color: "#3b82f6", display: "block", marginBottom: "4px" }}>
                معلومات وإرشادات:
              </strong>
              {route.tips}
            </div>
          )}

          {/* Stops List */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--color-fg)" }}>
                محطات التوقف ({stops.length})
              </span>
            </div>

            <div
              style={{
                maxHeight: "220px",
                overflowY: "auto",
                border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.08))",
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {stops.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  لا توجد محطات مسجلة لهذا المسار بعد
                </div>
              ) : (
                stops.map((st, idx) => {
                  const isOperational = st.status !== "تحت الإنشاء";
                  return (
                    <div
                      key={st.id || `${st.name}-${idx}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "8px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span className={railwaysStyles.orderBadge} style={{ minWidth: "24px", height: "24px", fontSize: "0.78rem" }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{st.name}</span>
                      </div>

                      {isOperational ? (
                        <span className={railwaysStyles.statusBadgeCompleted}>تشغيل فعلي</span>
                      ) : (
                        <span className={railwaysStyles.statusBadgeCancelled}>تحت الإنشاء</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className={railwaysStyles.modalFooter}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onManageStations(route.id);
              }}
              className="btn btn-primary w-full"
            >
              <IconTrain size={18} />
              <span>إدارة محطات هذا الخط</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel w-full"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
