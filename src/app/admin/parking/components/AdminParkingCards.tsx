import React from "react";
import { ParkingSpot, VisibleColumns } from "../types";
import { getAreaColor, getParkingKey } from "../utils";
import parkingStyles from "../admin-parking.module.css";
import {
  IconCar,
  IconClock,
  IconExternalLink,
  IconListDetailsFilled,
  IconMapPin,
  IconTrainFilled,
  IconTrashFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminParkingCardsProps {
  spots: ParkingSpot[];
  visibleColumns: VisibleColumns;
  onViewSpot: (spot: ParkingSpot) => void;
  onEditSpot: (spot: ParkingSpot) => void;
  onDeleteSpot: (spot: ParkingSpot) => void;
}

export function AdminParkingCards({
  spots,
  visibleColumns,
  onViewSpot,
  onEditSpot,
  onDeleteSpot,
}: AdminParkingCardsProps) {
  return (
    <div className={parkingStyles.stationCardsList}>
      {spots.map((spot) => {
        const spotKey = getParkingKey(spot);
        const areaColor = getAreaColor(spot.area);

        return (
          <div key={spotKey} className={parkingStyles.stationCard}>
            {/* Header: Name + Area */}
            <div className={parkingStyles.stationCardHeader}>
              <div className={parkingStyles.stationCardMain}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: areaColor,
                    boxShadow: `0 0 8px ${areaColor}80`,
                    flexShrink: 0,
                  }}
                />
                {visibleColumns.name && (
                  <h3 className={parkingStyles.stationCardName}>{spot.name}</h3>
                )}
              </div>

              {visibleColumns.area && (
                <span
                  className={parkingStyles.lineBadge}
                  style={{
                    background: `${areaColor}25`,
                    color: areaColor,
                    border: `1px solid ${areaColor}50`,
                  }}
                >
                  {spot.area}
                </span>
              )}
            </div>

            {/* Address & Nearest Metro */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {visibleColumns.address && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <IconMapPin size={16} />
                  <span>{spot.address}</span>
                </div>
              )}

              {visibleColumns.nearestMetro && spot.nearestMetro && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#f87171" }}>
                  <IconTrainFilled size={15} />
                  <span>مترو: {spot.nearestMetro}</span>
                </div>
              )}
            </div>

            {/* Rates & Capacity Stats */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
              {visibleColumns.rates && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#10b981",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    fontSize: "0.82rem",
                    fontWeight: "bold",
                  }}
                >
                  <span>{spot.hourlyRate} ج.م / س</span>
                  {spot.maxDailyRate && (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      ({spot.maxDailyRate} ج/يوم)
                    </span>
                  )}
                </span>
              )}

              {visibleColumns.capacity && (
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
                  <IconCar size={15} />
                  <span>{spot.capacity?.toLocaleString() || 0} سيارة</span>
                </span>
              )}

              {visibleColumns.hours && spot.hours && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  <IconClock size={14} />
                  <span>{spot.hours}</span>
                </span>
              )}

              {visibleColumns.mapLocation && spot.mapLocationLink && (
                <a
                  href={spot.mapLocationLink}
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

            {/* Features Preview */}
            {spot.features && spot.features.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {spot.features.slice(0, 4).map((feat, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "0.72rem",
                      background: "rgba(255, 255, 255, 0.04)",
                      color: "var(--color-fg)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-glass)",
                    }}
                  >
                    {feat}
                  </span>
                ))}
                {spot.features.length > 4 && (
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", padding: "2px 4px" }}>
                    +{spot.features.length - 4} أخرى
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className={parkingStyles.stationCardActions}>
              <button
                type="button"
                onClick={() => onViewSpot(spot)}
                className="btn btn-cancel w-full"
                title="عرض تفاصيل الجراج"
              >
                <IconListDetailsFilled size={18} />
                <span>تفاصيل</span>
              </button>
              <button
                type="button"
                onClick={() => onEditSpot(spot)}
                className="btn btn-blue w-full"
              >
                <IconWritingSignFilled size={18} />
                <span>تعديل</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteSpot(spot)}
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
