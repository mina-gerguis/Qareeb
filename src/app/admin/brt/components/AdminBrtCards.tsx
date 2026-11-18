import React from "react";
import clsx from "clsx";
import { AdminBrtStation, VisibleColumns } from "../types";
import { getSectorColor, getStationKey } from "../utils";
import brtStyles from "../admin-brt.module.css";
import {
  IconBus,
  IconCurrentLocationFilled,
  IconListDetailsFilled,
  IconMapPin,
  IconTrashFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminBrtCardsProps {
  stations: AdminBrtStation[];
  selectedStationKeys: Record<string, boolean>;
  visibleColumns: VisibleColumns;
  onToggleSelectRow: (stationKey: string) => void;
  onViewStation: (station: AdminBrtStation) => void;
  onEditStation: (station: AdminBrtStation) => void;
  onDeleteStation: (station: AdminBrtStation) => void;
}

export function AdminBrtCards({
  stations,
  selectedStationKeys,
  visibleColumns,
  onToggleSelectRow,
  onViewStation,
  onEditStation,
  onDeleteStation,
}: AdminBrtCardsProps) {
  return (
    <div className={brtStyles.stationCardsList}>
      {stations.map((station) => {
        const stationKey = getStationKey(station);
        const isSelected = Boolean(selectedStationKeys[stationKey]);
        const sectorColor = getSectorColor(station.sector);

        return (
          <div
            key={stationKey}
            className={clsx(
              brtStyles.stationCard,
              isSelected && brtStyles.table05TrSelected
            )}
          >
            {/* Header: Checkbox + Name + Status */}
            <div className={brtStyles.stationCardHeader}>
              <div className={brtStyles.stationCardMain}>
                {visibleColumns.name && (
                  <h3 className={brtStyles.stationCardName}>{station.name}</h3>
                )}
              </div>

              {visibleColumns.status && (
                <div>
                  {station.status === "تحت الإنشاء" ? (
                    <span className={brtStyles.statusBadgeCancelled}>تحت الإنشاء</span>
                  ) : station.status === "مخطط" ? (
                    <span className={brtStyles.statusBadgePending}>مخطط</span>
                  ) : (
                    <span className={brtStyles.statusBadgeCompleted}>
                      {station.status || "يعمل بانتظام"}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Sector & Location Row */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
              {visibleColumns.sector && (
                <span
                  className={brtStyles.lineBadge}
                  style={{
                    background: `${sectorColor}25`,
                    color: sectorColor,
                    border: `1px solid ${sectorColor}50`,
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: sectorColor,
                      display: "inline-block",
                    }}
                  />
                  {station.sector}
                </span>
              )}

              {visibleColumns.location && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
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
                    background: "var(--color-primary)",
                    color: "#fff",
                    border: "1px solid var(--border-glass)",
                    fontSize: "0.78rem",
                    fontWeight: "bold",
                  }}
                >
                  <IconBus size={14} />
                  <span>{station.routes?.length || 0} مسار</span>
                </span>
              )}
            </div>

            {/* Landmarks */}
            {visibleColumns.landmarks && (
              <div className={brtStyles.stationCardLandmarks}>
                {station.landmarks && Array.isArray(station.landmarks) && station.landmarks.length > 0 ? (
                  station.landmarks.map((landmark: string, lIdx: number) => (
                    <span key={lIdx} className={brtStyles.landmarkChip}>
                      <IconCurrentLocationFilled size={14} />
                      {landmark}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                    لم يتم تحديد معالم قريبة
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className={brtStyles.stationCardActions}>
              <button
                type="button"
                onClick={() => onViewStation(station)}
                className="btn btn-cancel w-full"
                title="عرض تفاصيل المحطة"
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
