import React from "react";
import { PortItem } from "../types";
import { isMedSea, parseConnections } from "../utils";
import portsStyles from "../admin-ports.module.css";
import {
  IconAnchor,
  IconBuildingCommunity,
  IconExternalLink,
  IconMapPin,
  IconRoute,
  IconShip,
  IconWritingSignFilled,
} from "@tabler/icons-react";
import { Waves } from "lucide-react";

interface AdminPortDetailsModalProps {
  port: PortItem | null;
  onClose: () => void;
  onEdit: (port: PortItem) => void;
}

export function AdminPortDetailsModal({
  port,
  onClose,
  onEdit,
}: AdminPortDetailsModalProps) {
  if (!port) return null;

  const isMed = isMedSea(port.sea);
  const connections = parseConnections(port.connections);

  return (
    <div className={portsStyles.modalOverlay} onClick={onClose}>
      <div
        className={portsStyles.modalContent}
        style={{ maxWidth: "660px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={portsStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: isMed ? "rgba(59, 130, 246, 0.15)" : "rgba(239, 68, 68, 0.15)",
                color: isMed ? "#3b82f6" : "#ef4444",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconAnchor size={20} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
                {port.name}
              </h3>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted, #94a3b8)" }}>
                محافظة {port.governorate}
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

        {/* Body */}
        <div className={portsStyles.modalBody} style={{ maxHeight: "70vh" }}>
          {/* Top badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <span className={isMed ? portsStyles.seaMedBadge : portsStyles.seaRedBadge}>
              <Waves className="h-3.5 w-3.5" />
              <span>{port.sea}</span>
            </span>

            <span className={portsStyles.portTypeBadge}>
              {port.type}
            </span>

            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
                border: "1px solid rgba(16, 185, 129, 0.25)",
              }}
            >
              {port.status || "تشغيل فعلي"}
            </span>
          </div>

          {/* Strategic Capacity Card */}
          {port.capacity && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border-glass)",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "0.88rem",
                lineHeight: 1.5,
                color: "var(--color-fg)",
              }}
            >
              <strong style={{ color: "var(--color-primary, #60a5fa)" }}>السعة والأهمية التجارية: </strong>
              {port.capacity}
            </div>
          )}

          {/* Full Description */}
          {port.description && (
            <div style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {port.description}
            </div>
          )}

          {/* Infrastructure Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-glass)",
              borderRadius: "10px",
              padding: "14px",
            }}
          >
            <div>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>عدد الأرصفة:</span>
              <p style={{ margin: "2px 0 0 0", fontWeight: 700, fontSize: "0.88rem" }}>
                {port.berths_count || "غير محدد"}
              </p>
            </div>

            <div>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>الهيئة المشغلة:</span>
              <p style={{ margin: "2px 0 0 0", fontWeight: 700, fontSize: "0.88rem" }}>
                {port.operator || "غير محدد"}
              </p>
            </div>
          </div>

          {/* Connected Logistics Corridors */}
          {connections.length > 0 && (
            <div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-fg)", display: "block", marginBottom: "6px" }}>
                المحاور والطرق والربط القومي:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {connections.map((conn, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "rgba(99, 102, 241, 0.08)",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                      color: "#818cf8",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <IconRoute size={13} />
                    <span>{conn}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Map Link */}
          {port.map_url && (
            <div style={{ paddingTop: "8px", borderTop: "1px solid var(--border-glass)" }}>
              <a
                href={port.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-cancel"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  fontSize: "0.85rem",
                }}
              >
                <IconMapPin size={16} />
                <span>فتح موقع الميناء في خرائط جوجل</span>
                <IconExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`${portsStyles.modalFooter} gap-3`}>
          <button
            type="button"
            onClick={() => onEdit(port)}
            className="btn btn-blue w-full"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <IconWritingSignFilled size={18} />
            <span>تعديل الميناء</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-cancel w-full"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
