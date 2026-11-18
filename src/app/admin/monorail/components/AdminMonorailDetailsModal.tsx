import React from "react";
import { MonorailStation } from "../types";
import { getLineLabel, getLineColor } from "../utils";
import monorailStyles from "../admin-monorail.module.css";
import { IconCurrentLocationFilled, IconSquareRoundedXFilled, IconWritingSignFilled, IconXFilled } from "@tabler/icons-react";

interface AdminMonorailDetailsModalProps {
  station: MonorailStation | null;
  onClose: () => void;
  onEdit: (station: MonorailStation) => void;
}

export function AdminMonorailDetailsModal({
  station,
  onClose,
  onEdit,
}: AdminMonorailDetailsModalProps) {
  if (!station) return null;

  return (
    <div className={monorailStyles.modalOverlay} onClick={onClose}>
      <div
        className={monorailStyles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "520px" }}
      >
        <div className={monorailStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div>
              <h3 className={monorailStyles.modalTitle} style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
                تفاصيل محطة {station.name}
              </h3>
              {station.name_en && (
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  {station.name_en}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-close"
            type="button"
            aria-label="إغلاق"
          >
            <IconXFilled size={16} />
          </button>
        </div>

        <div className={monorailStyles.modalBody} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Meta Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border-glass)",
              }}
            >
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                المسار / الخط
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: getLineColor(station.line_type),
                }}
              >
                {getLineLabel(station.line_type)}
              </span>
            </div>

            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border-glass)",
              }}
            >
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                الترتيب في المسار
              </span>
              <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--color-fg)" }}>
                #{station.station_order}
              </span>
            </div>

            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border-glass)",
              }}
            >
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                الحالة
              </span>
              <div>
                {station.status === "تحت الإنشاء" ? (
                  <span className={monorailStyles.statusBadgeCancelled}>تحت الإنشاء</span>
                ) : station.status === "تشغيل تجريبي" ? (
                  <span className={monorailStyles.statusBadgePending}>تشغيل تجريبي</span>
                ) : (
                  <span className={monorailStyles.statusBadgeCompleted}>{station.status || "يعمل"}</span>
                )}
              </div>
            </div>
          </div>

          {/* Landmarks Section */}
          <div
            style={{
              padding: "14px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border-glass)",
            }}
          >
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: "700",
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: "8px",
              }}
            >
              المعالم والأماكن الحيوية القريبة:
            </span>
            {station.landmarks && Array.isArray(station.landmarks) && station.landmarks.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {station.landmarks.map((landmark, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "0.78rem",
                      background: "rgba(255,255,255,0.05)",
                      color: "var(--color-fg)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      border: "1px solid var(--border-glass)",
                    }}
                  >
                    <IconCurrentLocationFilled size={14} style={{ color: getLineColor(station.line_type) }} />
                    {landmark}
                  </span>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                لم يتم تسجيل أي معالم لهذه المحطة بعد.
              </span>
            )}
          </div>

          {/* Footer Actions */}
          <div className={monorailStyles.modalFooter} style={{ marginTop: "6px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel w-full"
            >
              <IconSquareRoundedXFilled size={18} />
              إغلاق
            </button>
            <button
              type="button"
              onClick={() => onEdit(station)}
              className="btn btn-primary w-full"
            >
              <IconWritingSignFilled size={18} />
              تعديل بيانات المحطة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
