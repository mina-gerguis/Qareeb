import React from "react";
import { BusStation, VisibleColumns } from "../types";
import { getGovernorateColor, getStationKey } from "../utils";
import busStyles from "../admin-bus-stations.module.css";
import {
  IconBuildingSkyscraper,
  IconListDetailsFilled,
  IconMapPin,
  IconTrashFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminBusStationsCardsProps {
  stations: BusStation[];
  visibleColumns: VisibleColumns;
  onViewStation: (station: BusStation) => void;
  onEditStation: (station: BusStation) => void;
  onDeleteStation: (station: BusStation) => void;
}

export function AdminBusStationsCards({
  stations,
  visibleColumns,
  onViewStation,
  onEditStation,
  onDeleteStation,
}: AdminBusStationsCardsProps) {
  return (
    <div className={busStyles.stationCardsList}>
      {stations.map((station) => {
        const stationKey = getStationKey(station);
        const govColor = getGovernorateColor(station.governorate);

        return (
          <div key={stationKey} className={busStyles.stationCard}>
            {/* Header: Name + Governorate */}
            <div className={busStyles.stationCardHeader}>
              <div className={busStyles.stationCardMain}>
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
                  <h3 className={busStyles.stationCardName}>{station.name}</h3>
                )}
              </div>

              {visibleColumns.governorate && (
                <span
                  className={busStyles.lineBadge}
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

            {/* Location & Companies */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
              {visibleColumns.location && (
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <IconMapPin size={16} />
                  <span>{station.location}</span>
                </div>
              )}

              {visibleColumns.companiesCount && (
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
                  <IconBuildingSkyscraper size={14} />
                  <span>{station.companies?.length || 0} شركات</span>
                </span>
              )}
            </div>

            {/* Destinations */}
            {visibleColumns.destinations && station.destinations && station.destinations.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {station.destinations.slice(0, 5).map((dest, idx) => (
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
                {station.destinations.length > 5 && (
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", padding: "2px 4px" }}>
                    +{station.destinations.length - 5} أخرى
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className={busStyles.stationCardActions}>
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
