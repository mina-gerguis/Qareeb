import React from "react";
import { HighwayItem, VisibleColumnsRoads } from "../types";
import { getRoadTypeColor, getRoadStatusBadge } from "../utils";
import roadsStyles from "../admin-roads-info.module.css";
import {
  IconExternalLink,
  IconGauge,
  IconListDetailsFilled,
  IconMapPin,
  IconRoad,
  IconTrashFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminRoadsCardsProps {
  roads: HighwayItem[];
  visibleColumns: VisibleColumnsRoads;
  onViewRoad: (road: HighwayItem) => void;
  onEditRoad: (road: HighwayItem) => void;
  onDeleteRoad: (road: HighwayItem) => void;
}

export function AdminRoadsCards({
  roads,
  visibleColumns,
  onViewRoad,
  onEditRoad,
  onDeleteRoad,
}: AdminRoadsCardsProps) {
  return (
    <div className={roadsStyles.stationCardsList}>
      {roads.map((road) => {
        const roadKey = road.id || road.name;
        const typeColor = getRoadTypeColor(road.type);
        const statusBadge = getRoadStatusBadge(road.status);

        return (
          <div key={roadKey} className={roadsStyles.stationCard}>
            {/* Header: Name + Type */}
            <div className={roadsStyles.stationCardHeader}>
              <div className={roadsStyles.stationCardMain}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: typeColor,
                    boxShadow: `0 0 8px ${typeColor}80`,
                    flexShrink: 0,
                  }}
                />
                {visibleColumns.name && (
                  <h3 className={roadsStyles.stationCardName}>
                    {road.name}
                    {road.code && (
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginRight: "6px" }}>
                        ({road.code})
                      </span>
                    )}
                  </h3>
                )}
              </div>

              {visibleColumns.type && (
                <span
                  className={roadsStyles.lineBadge}
                  style={{
                    background: `${typeColor}25`,
                    color: typeColor,
                    border: `1px solid ${typeColor}50`,
                  }}
                >
                  {road.type}
                </span>
              )}
            </div>

            {/* Endpoints & Governorates */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {visibleColumns.endpoints && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <IconMapPin size={16} />
                  <span>{road.startPoint} ← {road.endPoint}</span>
                </div>
              )}

              {road.governorates && road.governorates.length > 0 && (
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  يمر بـ: {road.governorates.join("، ")}
                </div>
              )}
            </div>

            {/* Speeds, Lanes & Length */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
              {visibleColumns.length && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border-glass)",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  <IconRoad size={14} />
                  <span>{road.lengthKm} كم</span>
                </span>
              )}

              {visibleColumns.speeds && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: "rgba(59, 130, 246, 0.1)",
                    color: "#3b82f6",
                    border: "1px solid rgba(59, 130, 246, 0.25)",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  <IconGauge size={14} />
                  <span>السرعة: {road.speeds?.privateCar || 120} كم/س</span>
                </span>
              )}

              {visibleColumns.status && (
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: statusBadge.bg,
                    color: statusBadge.color,
                    fontSize: "0.78rem",
                    fontWeight: "bold",
                  }}
                >
                  {statusBadge.label}
                </span>
              )}

              {visibleColumns.mapUrl && road.mapUrl && (
                <a
                  href={road.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px",
                    fontSize: "0.76rem",
                    color: "#38bdf8",
                    textDecoration: "none",
                  }}
                >
                  <IconExternalLink size={13} />
                  <span>الخريطة</span>
                </a>
              )}
            </div>

            {/* Actions */}
            <div className={roadsStyles.stationCardActions}>
              <button
                type="button"
                onClick={() => onViewRoad(road)}
                className="btn btn-cancel w-full"
                title="عرض تفاصيل الطريق"
              >
                <IconListDetailsFilled size={18} />
                <span>تفاصيل</span>
              </button>
              <button
                type="button"
                onClick={() => onEditRoad(road)}
                className="btn btn-blue w-full"
              >
                <IconWritingSignFilled size={18} />
                <span>تعديل</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteRoad(road)}
                className="btn btn-error w-full"
              >
                <IconTrashFilled size={18} />
                <span>حذف</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
