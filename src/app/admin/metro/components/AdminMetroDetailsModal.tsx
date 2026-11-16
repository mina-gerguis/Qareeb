import React from "react";
import { Eye, Pencil } from "lucide-react";
import { MetroStation } from "../types";
import { getLineLabel, getLineColor } from "../utils";
import metroStyles from "../admin-metro.module.css";
import { IconCurrentLocationFilled, IconSquareRoundedXFilled, IconWritingSignFilled, IconXFilled } from "@tabler/icons-react";

interface AdminMetroDetailsModalProps {
  station: MetroStation | null;
  onClose: () => void;
  onEdit: (station: MetroStation) => void;
}

export function AdminMetroDetailsModal({
  station,
  onClose,
  onEdit,
}: AdminMetroDetailsModalProps) {
  if (!station) return null;

  return (
    <div className={metroStyles.modalOverlay} onClick={onClose}>
      <div
        className={metroStyles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "520px" }}
      >
        <div className={metroStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div>
              <h3 className={metroStyles.modalTitle} style={{ margin: 0 }}>
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

        <div className={metroStyles.modalBody} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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
                الخط
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
                الترتيب على الخط
              </span>
              <span style={{ fontSize: "0.88rem", fontWeight: "bold" }}>
                #{station.station_order || 1}
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
                الحالة التشغيلية
              </span>
              <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                {station.status || "يعمل"}
              </span>
            </div>
          </div>

          {/* Interchange details */}
          {station.is_interchange && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <i className="bx bx-transfer-alt" style={{ color: "#f59e0b", fontSize: "1.1rem" }} />
              <span style={{ fontSize: "0.84rem", color: "#f59e0b", fontWeight: "600" }}>
                محطة تبادلية مع خطوط أخرى
              </span>
            </div>
          )}

          {/* Landmarks */}
          <div>
            <label className="help-label" style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
              المعالم والأماكن القريبة:
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {station.landmarks && Array.isArray(station.landmarks) && station.landmarks.length > 0 ? (
                station.landmarks.map((landmark: string, i: number) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "0.78rem",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border-glass)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <IconCurrentLocationFilled size={16} />
                    {landmark}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground italic-font">
                  لا توجد معالم مسجلة لهذه المحطة.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={`mb-2 ${metroStyles.modalFooter}`} style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={() => onEdit(station)}
          >
           <IconWritingSignFilled size={18} />
            تعديل المحطة
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
  );
}

