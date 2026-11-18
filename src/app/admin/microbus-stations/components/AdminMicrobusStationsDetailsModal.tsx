import React from "react";
import { AdminMicrobusStation } from "../types";
import { getGovernorateColor } from "../utils";
import microStyles from "../admin-microbus-stations.module.css";
import {
  IconExternalLink,
  IconMapPin,
  IconRoute,
  IconWritingSignFilled,
  IconClock,
  IconRoad
} from "@tabler/icons-react";

interface AdminMicrobusStationsDetailsModalProps {
  station: AdminMicrobusStation | null;
  onClose: () => void;
  onEdit: (station: AdminMicrobusStation) => void;
}

export function AdminMicrobusStationsDetailsModal({
  station,
  onClose,
  onEdit,
}: AdminMicrobusStationsDetailsModalProps) {
  if (!station) return null;

  const govColor = getGovernorateColor(station.governorate);
  const routes = station.routes || [];

  return (
    <div className={microStyles.modalOverlay}>
      <div className={microStyles.modalContent} style={{ maxWidth: "660px" }}>
        {/* Modal Header */}
        <div className={microStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: govColor,
                boxShadow: `0 0 10px ${govColor}80`,
                display: "inline-block",
              }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "900", color: "var(--color-fg)" }}>
                {station.name}
              </h3>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                محافظة {station.governorate}
              </span>
            </div>
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

        {/* Modal Body */}
        <div className={microStyles.modalBody}>
          {/* Key Info: Location & Map */}
          <div
            style={{
              background: "var(--bg-secondary, rgba(255, 255, 255, 0.03))",
              border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.08))",
              borderRadius: "10px",
              padding: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "6px" }}>
              <IconMapPin size={16} />
              <span>العنوان والموقع</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-fg)", lineHeight: 1.5 }}>
              {station.location}
            </div>

            {station.map_url && (
              <div style={{ marginTop: "10px" }}>
                <a
                  href={station.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#60a5fa",
                    fontSize: "0.84rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <IconExternalLink size={15} />
                  <span>فتح في خرائط Google</span>
                </a>
              </div>
            )}
          </div>

          {/* Routes List */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "0.95rem", color: "var(--color-fg)" }}>
                <IconRoute size={18} color="#f59e0b" />
                <span>خطوط السير والتعريفة المعتمدة ({routes.length})</span>
              </div>
            </div>

            {routes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                لا توجد خطوط سير مضافة لهذا الموقف حالياً.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "320px", overflowY: "auto" }}>
                {routes.map((route, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.06))",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--color-fg)" }}>
                          إلى: {route.destination}
                        </span>
                        {route.vehicleType && (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              background: "rgba(245, 158, 11, 0.12)",
                              color: "#f59e0b",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              fontWeight: 600,
                            }}
                          >
                            {route.vehicleType}
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          background: "rgba(16, 185, 129, 0.12)",
                          color: "#10b981",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          padding: "2px 10px",
                          borderRadius: "16px",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                        }}
                      >
                        {route.fare}
                      </div>
                    </div>

                    {(route.via || route.duration || route.description) && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        {route.via && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <IconRoad size={14} />
                            <span>يمر بـ: {route.via}</span>
                          </span>
                        )}
                        {route.duration && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <IconClock size={14} />
                            <span>الزمن التقريبي: {route.duration}</span>
                          </span>
                        )}
                        {route.description && (
                          <span>{route.description}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className={microStyles.modalFooter}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-cancel"
          >
            إغلاق
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(station);
            }}
            className="btn btn-blue"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <IconWritingSignFilled size={18} />
            <span>تعديل الموقف</span>
          </button>
        </div>
      </div>
    </div>
  );
}
