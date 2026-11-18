import React from "react";
import { PortItem, VisibleColumns } from "../types";
import { isMedSea } from "../utils";
import portsStyles from "../admin-ports.module.css";
import {
  IconAnchor,
  IconBuildingCommunity,
  IconExternalLink,
  IconListDetailsFilled,
  IconMapPin,
  IconTrashFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";
import { Waves } from "lucide-react";

interface AdminPortsCardsProps {
  ports: PortItem[];
  visibleColumns: VisibleColumns;
  onViewPort: (port: PortItem) => void;
  onEditPort: (port: PortItem) => void;
  onDeletePort: (port: PortItem) => void;
}

export function AdminPortsCards({
  ports,
  visibleColumns,
  onViewPort,
  onEditPort,
  onDeletePort,
}: AdminPortsCardsProps) {
  return (
    <div className={portsStyles.stationCardsList}>
      {ports.map((port) => {
        const portKey = String(port.id || port.name);
        const isMed = isMedSea(port.sea);
        const themeColor = isMed ? "#3b82f6" : "#ef4444";

        return (
          <div key={portKey} className={portsStyles.stationCard}>
            {/* Header: Name + Badges */}
            <div className={portsStyles.stationCardHeader}>
              <div className={portsStyles.stationCardMain}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: themeColor,
                    boxShadow: `0 0 8px ${themeColor}80`,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <h3 className={portsStyles.stationCardName}>
                    {port.name}
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted, #94a3b8)", display: "block" }}>
                    {port.governorate}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                <span className={isMed ? portsStyles.seaMedBadge : portsStyles.seaRedBadge}>
                  <Waves className="h-3.5 w-3.5" />
                  <span>{port.sea}</span>
                </span>
                <span className={portsStyles.portTypeBadge}>
                  {port.type}
                </span>
              </div>
            </div>

            {/* Operator and Capacity Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {visibleColumns.operator && port.operator && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
                  <IconBuildingCommunity size={15} style={{ color: "var(--text-muted)" }} />
                  <span>المشغل: {port.operator}</span>
                </div>
              )}

              {visibleColumns.capacity && port.capacity && (
                <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  <span style={{ fontWeight: 600, color: "var(--color-fg)" }}>السعة: </span>
                  <span>{port.capacity}</span>
                </div>
              )}
            </div>

            {/* Berths count and Status */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
              {port.berths_count && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: "rgba(99, 102, 241, 0.12)",
                    color: "#818cf8",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                  }}
                >
                  {port.berths_count}
                </span>
              )}

              {visibleColumns.status && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#10b981",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                  }}
                >
                  {port.status || "تشغيل فعلي"}
                </span>
              )}
            </div>

            {/* Short Description */}
            {port.description && (
              <p
                style={{
                  fontSize: "0.83rem",
                  color: "var(--text-secondary, #cbd5e1)",
                  margin: "4px 0 0 0",
                  lineHeight: 1.5,
                  borderTop: "1px dashed rgba(255, 255, 255, 0.08)",
                  paddingTop: "8px",
                }}
              >
                {port.description}
              </p>
            )}

            {/* Action Buttons matching Parking and Metro */}
            <div className={portsStyles.stationCardActions}>
              <button
                type="button"
                onClick={() => onViewPort(port)}
                className="btn btn-cancel w-full"
                title="عرض تفاصيل الميناء"
              >
                <IconListDetailsFilled size={18} />
                <span>تفاصيل</span>
              </button>

              <button
                type="button"
                onClick={() => onEditPort(port)}
                className="btn btn-blue w-full"
                title="تعديل الميناء"
              >
                <IconWritingSignFilled size={18} />
                <span>تعديل</span>
              </button>

              {port.map_url && visibleColumns.mapUrl && (
                <a
                  href={port.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: "0 12px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                  title="فتح في خرائط جوجل"
                >
                  <IconExternalLink size={18} />
                </a>
              )}

              <button
                type="button"
                onClick={() => onDeletePort(port)}
                className="btn btn-error"
                style={{ padding: "0 12px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                title="حذف الميناء"
              >
                <IconTrashFilled size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
