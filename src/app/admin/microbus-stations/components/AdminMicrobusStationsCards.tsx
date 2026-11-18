import React from "react";
import { AdminMicrobusStation, VisibleColumns } from "../types";
import { getGovernorateColor, getStationKey } from "../utils";
import microStyles from "../admin-microbus-stations.module.css";
import {
  IconRoute,
  IconListDetailsFilled,
  IconMapPin,
  IconTrashFilled,
  IconWritingSignFilled,
  IconExternalLink
} from "@tabler/icons-react";

interface AdminMicrobusStationsCardsProps {
  stations: AdminMicrobusStation[];
  visibleColumns: VisibleColumns;
  onViewStation: (station: AdminMicrobusStation) => void;
  onEditStation: (station: AdminMicrobusStation) => void;
  onDeleteStation: (station: AdminMicrobusStation) => void;
}

export function AdminMicrobusStationsCards({
  stations,
  visibleColumns,
  onViewStation,
  onEditStation,
  onDeleteStation,
}: AdminMicrobusStationsCardsProps) {
  return (
    <div className={microStyles.stationCardsList}>
      {stations.map((station) => {
        const stationKey = getStationKey(station);
        const govColor = getGovernorateColor(station.governorate);

        const destinations = Array.isArray(station.routes)
          ? Array.from(new Set(station.routes.map((r) => r.destination).filter(Boolean)))
          : [];

        return (
          <div key={stationKey} className={microStyles.stationCard}>
            {/* Header: Name + Governorate */}
            <div className={microStyles.stationCardHeader}>
              <div className={microStyles.stationCardMain}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: govColor,
                    boxShadow: `0 0 8px ${govColor}80`,
                    flexShrink: 0,
                  }}
                />
                {visibleColumns.name && (
                  <h3 className={microStyles.stationCardName}>{station.name}</h3>
                )}
              </div>

              {visibleColumns.governorate && (
                <span
                  className={microStyles.lineBadge}
                  style={{
                    background: `${govColor}25`,
                    color: govColor,
                    border: `1px solid ${govColor}50`,
                  }}
                >
                  {station.governorate}
                </span>
              )}
            </div>

            {/* Location & Routes count */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
              {visibleColumns.location && (
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <IconMapPin size={16} />
                  <span>{station.location}</span>
                </div>
              )}

              {visibleColumns.routesCount && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border-glass)",
                    fontSize: "0.78rem",
                    fontWeight: "bold",
                  }}
                >
                  <IconRoute size={14} />
                  <span>{station.routes?.length || 0} خط سير</span>
                </span>
              )}

              {visibleColumns.mapUrl && station.map_url && (
                <a
                  href={station.map_url}
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

            {/* Destinations */}
            {visibleColumns.destinations && destinations.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {destinations.slice(0, 5).map((dest, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "0.74rem",
                      background: "rgba(255, 255, 255, 0.04)",
                      color: "var(--color-fg)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-glass)",
                    }}
                  >
                    {dest}
                  </span>
                ))}
                {destinations.length > 5 && (
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", padding: "2px 4px" }}>
                    +{destinations.length - 5} أخرى
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className={microStyles.stationCardActions}>
              <button
                type="button"
                onClick={() => onViewStation(station)}
                className="btn btn-cancel w-full"
                title="عرض تفاصيل الموقف"
              >
                <IconListDetailsFilled size={18} />
                <span>تفاصيل</span>
              </button>
              <button
                type="button"
                onClick={() => onEditStation(station)}
                className="btn btn-blue w-full"
              >
                <IconWritingSignFilled size={18} />
                <span>تعديل</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteStation(station)}
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
