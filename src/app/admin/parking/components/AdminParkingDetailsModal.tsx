import React from "react";
import { ParkingSpot } from "../types";
import { getAreaColor } from "../utils";
import parkingStyles from "../admin-parking.module.css";
import {
  IconCar,
  IconClock,
  IconCurrencyDollar,
  IconExternalLink,
  IconMapPin,
  IconTrainFilled,
  IconWritingSignFilled,
  IconCheck,
} from "@tabler/icons-react";

interface AdminParkingDetailsModalProps {
  spot: ParkingSpot | null;
  onClose: () => void;
  onEdit: (spot: ParkingSpot) => void;
}

export function AdminParkingDetailsModal({
  spot,
  onClose,
  onEdit,
}: AdminParkingDetailsModalProps) {
  if (!spot) return null;

  const areaColor = getAreaColor(spot.area);
  const features = spot.features || [];

  return (
    <div className={parkingStyles.modalOverlay}>
      <div className={parkingStyles.modalContent} style={{ maxWidth: "620px" }}>
        {/* Modal Header */}
        <div className={parkingStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: areaColor,
                boxShadow: `0 0 10px ${areaColor}80`,
                display: "inline-block",
              }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "900", color: "var(--color-fg)" }}>
                {spot.name}
              </h3>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                منطقة {spot.area} • {spot.type}
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
        <div className={parkingStyles.modalBody}>
          {/* Location & Metro Grid */}
          <div
            style={{
              background: "var(--bg-secondary, rgba(255, 255, 255, 0.03))",
              border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.08))",
              borderRadius: "10px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "4px" }}>
                <IconMapPin size={16} />
                <span>العنوان بالتفصيل</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-fg)", lineHeight: 1.5 }}>
                {spot.address}
              </div>
            </div>

            {spot.nearestMetro && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid var(--border-glass)", paddingTop: "8px" }}>
                <IconTrainFilled size={16} color="#f87171" />
                <span style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                  أقرب محطة مترو: <strong style={{ color: "var(--color-fg)" }}>{spot.nearestMetro}</strong>
                </span>
              </div>
            )}

            {spot.mapLocationLink && (
              <div style={{ marginTop: "2px" }}>
                <a
                  href={spot.mapLocationLink}
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

          {/* Pricing & Capacity Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            <div
              style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "10px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>سعر الساعة</div>
              <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#10b981" }}>
                {spot.hourlyRate} <span style={{ fontSize: "0.78rem" }}>ج.م</span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(59, 130, 246, 0.08)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "10px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>الحد اليومي</div>
              <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#3b82f6" }}>
                {spot.maxDailyRate ? (
                  <>
                    {spot.maxDailyRate} <span style={{ fontSize: "0.78rem" }}>ج.م</span>
                  </>
                ) : (
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>غير محدد</span>
                )}
              </div>
            </div>

            <div
              style={{
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                borderRadius: "10px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>سعة الجراج</div>
              <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#f59e0b" }}>
                {spot.capacity?.toLocaleString() || 0} <span style={{ fontSize: "0.78rem" }}>سيارة</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          {spot.hours && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.88rem", color: "var(--color-fg)" }}>
              <IconClock size={18} color="#94a3b8" />
              <span>ساعات العمل: <strong>{spot.hours}</strong></span>
            </div>
          )}

          {/* Features List */}
          {features.length > 0 && (
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--color-fg)", marginBottom: "8px" }}>
                المميزات والخدمات المتوفرة:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {features.map((feat, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "0.8rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "var(--color-fg)",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-glass)",
                    }}
                  >
                    <IconCheck size={14} color="#10b981" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={parkingStyles.modalFooter}>
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
              onEdit(spot);
            }}
            className="btn btn-blue"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <IconWritingSignFilled size={18} />
            <span>تعديل الجراج</span>
          </button>
        </div>
      </div>
    </div>
  );
}
