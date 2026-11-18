import React from "react";
import { HighwayItem } from "../types";
import { getRoadTypeColor, getRoadStatusBadge } from "../utils";
import roadsStyles from "../admin-roads-info.module.css";
import {
  IconExternalLink,
  IconGauge,
  IconMapPin,
  IconPhone,
  IconRoad,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminRoadDetailsModalProps {
  road: HighwayItem | null;
  onClose: () => void;
  onEdit: (road: HighwayItem) => void;
}

export function AdminRoadDetailsModal({
  road,
  onClose,
  onEdit,
}: AdminRoadDetailsModalProps) {
  if (!road) return null;

  const typeColor = getRoadTypeColor(road.type);
  const statusBadge = getRoadStatusBadge(road.status);

  return (
    <div className={roadsStyles.modalOverlay}>
      <div className={roadsStyles.modalContent} style={{ maxWidth: "660px" }}>
        {/* Modal Header */}
        <div className={roadsStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: typeColor,
                boxShadow: `0 0 10px ${typeColor}80`,
                display: "inline-block",
              }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "900", color: "var(--color-fg)" }}>
                {road.name}
              </h3>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                {road.type} • {road.lengthKm} كم {road.code ? `• كود (${road.code})` : ""}
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
        <div className={roadsStyles.modalBody}>
          {/* Status & Quick Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            <div
              style={{
                background: statusBadge.bg,
                border: `1px solid ${statusBadge.color}40`,
                borderRadius: "10px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>الحالة والسيولة</div>
              <div style={{ fontSize: "1rem", fontWeight: 900, color: statusBadge.color }}>
                {statusBadge.label}
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
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>الطول الكلي</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#3b82f6" }}>
                {road.lengthKm} <span style={{ fontSize: "0.78rem" }}>كم</span>
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
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>عدد الحارات</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#f59e0b" }}>
                {road.lanesCount} <span style={{ fontSize: "0.78rem" }}>حارات</span>
              </div>
            </div>
          </div>

          {/* Endpoints & Map */}
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
              <span>مسار ونقاط الاتصال</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-fg)", lineHeight: 1.5 }}>
              من {road.startPoint} ← إلى {road.endPoint}
            </div>

            {road.governorates && road.governorates.length > 0 && (
              <div style={{ marginTop: "6px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                المحافظات: {road.governorates.join("، ")}
              </div>
            )}

            {road.emergencyPhone && (
              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#f87171" }}>
                <IconPhone size={15} />
                <span>رقم طوارئ المرور: <strong style={{ direction: "ltr", display: "inline-block" }}>{road.emergencyPhone}</strong></span>
              </div>
            )}

            {road.mapUrl && (
              <div style={{ marginTop: "10px" }}>
                <a
                  href={road.mapUrl}
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
                  <span>فتح مسار الطريق على خرائط Google</span>
                </a>
              </div>
            )}
          </div>

          {/* Speeds Grid */}
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--color-fg)", marginBottom: "8px" }}>
              السرعات القانونية المعتمدة لكل فئة:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-glass)", borderRadius: "8px", padding: "8px 12px" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>ملاكي: </span>
                <strong style={{ color: "#3b82f6" }}>{road.speeds?.privateCar || 120} كم/س</strong>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-glass)", borderRadius: "8px", padding: "8px 12px" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>ميكروباص: </span>
                <strong style={{ color: "#10b981" }}>{road.speeds?.microbus || 100} كم/س</strong>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-glass)", borderRadius: "8px", padding: "8px 12px" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>أتوبيس: </span>
                <strong style={{ color: "#f59e0b" }}>{road.speeds?.bus || 100} كم/س</strong>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-glass)", borderRadius: "8px", padding: "8px 12px" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>ميني باص: </span>
                <strong>{road.speeds?.minibus || 100} كم/س</strong>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-glass)", borderRadius: "8px", padding: "8px 12px" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>ربع نقل: </span>
                <strong>{road.speeds?.pickup || 90} كم/س</strong>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-glass)", borderRadius: "8px", padding: "8px 12px" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>نقل ثقيل وتريلا: </span>
                <strong style={{ color: "#ef4444" }}>{road.speeds?.truck || 80} كم/س</strong>
              </div>
            </div>
          </div>

          {/* Description & Radar */}
          {(road.description || road.radarInfo) && (
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {road.description && <p style={{ margin: "0 0 6px 0" }}>{road.description}</p>}
              {road.radarInfo && <p style={{ margin: 0, color: "var(--text-muted)" }}>الرادارات: {road.radarInfo}</p>}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={roadsStyles.modalFooter}>
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
              onEdit(road);
            }}
            className="btn btn-blue"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <IconWritingSignFilled size={18} />
            <span>تعديل الطريق</span>
          </button>
        </div>
      </div>
    </div>
  );
}
