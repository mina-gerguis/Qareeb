import React from "react";
import clsx from "clsx";
import { AdminBrtStation } from "../types";
import { getSectorColor } from "../utils";
import brtStyles from "../admin-brt.module.css";
import {
  IconBus,
  IconClock,
  IconCoin,
  IconCurrentLocationFilled,
  IconExternalLink,
  IconMapPin,
  IconSquareRoundedXFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminBrtDetailsModalProps {
  station: AdminBrtStation | null;
  onClose: () => void;
  onEdit: (station: AdminBrtStation) => void;
}

export function AdminBrtDetailsModal({
  station,
  onClose,
  onEdit,
}: AdminBrtDetailsModalProps) {
  if (!station) return null;

  const sectorColor = getSectorColor(station.sector);
  const routes = station.routes || [];

  return (
    <div className={brtStyles.modalOverlay}>
      <div className={brtStyles.modalContent} style={{ maxWidth: "600px" }}>
        {/* Modal Header */}
        <div className={brtStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: sectorColor,
                boxShadow: `0 0 10px ${sectorColor}80`,
                display: "inline-block",
              }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "900", color: "var(--color-fg)" }}>
                {station.name}
              </h3>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                {station.sector} • {station.governorate}
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
        <div className={brtStyles.modalBody}>
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
                <IconMapPin size={16} />
                <span>الموقع</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--color-fg)" }}>
                {station.location}
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
                <IconBus size={16} />
                <span>الحالة ونوع المحطة</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                {station.status === "تحت الإنشاء" ? (
                  <span className={brtStyles.statusBadgeCancelled}>تحت الإنشاء</span>
                ) : station.status === "مخطط" ? (
                  <span className={brtStyles.statusBadgePending}>مخطط</span>
                ) : (
                  <span className={brtStyles.statusBadgeCompleted}>
                    {station.status || "يعمل بانتظام"}
                  </span>
                )}
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {station.type || "سطحية قياسية"}
                </span>
              </div>
            </div>
          </div>

          {/* Landmarks */}
          {station.landmarks && station.landmarks.length > 0 && (
            <div>
              <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--color-fg)", display: "block", marginBottom: "6px" }}>
                المعالم والأماكن المجاورة:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {station.landmarks.map((lm, idx) => (
                  <span key={idx} className={brtStyles.landmarkChip}>
                    <IconCurrentLocationFilled size={14} />
                    {lm}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Map Link */}
          {station.map_url && (
            <div>
              <a
                href={station.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-blue w-full"
              >
                <IconExternalLink size={16} />
                <span>عرض الموقع على خرائط Google Maps</span>
              </a>
            </div>
          )}

          {/* Routes & Fares */}
          <div>
            <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--color-fg)", display: "block", marginBottom: "8px" }}>
              مسارات الأتوبيس والأسعار ({routes.length})
            </span>

            <div
              style={{
                maxHeight: "220px",
                overflowY: "auto",
                border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.08))",
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {routes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  لا توجد مسارات مضافة لهذه المحطة
                </div>
              ) : (
                routes.map((rt, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.05))",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--color-fg)" }}>
                          إلى: {rt.destination}
                        </span>
                        {rt.via && (
                          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            (عبر {rt.via})
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                        {rt.vehicleType || "أتوبيس ترددي كهربائي سريع"}
                        {rt.duration ? ` • المدة: ${rt.duration}` : ""}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span 
                      className="alert-success"
                        style={{
                          padding: "3px 10px",
                          borderRadius: "16px",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <IconCoin size={15} />
                        <span>{rt.fare} جنيه</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className={brtStyles.modalFooter}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(station);
              }}
              className="btn btn-primary w-full"
            >
              <IconWritingSignFilled size={18} />
              <span>تعديل بيانات المحطة</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel w-full"
            >
              <IconSquareRoundedXFilled size={18}/>
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
