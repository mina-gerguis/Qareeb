import React from "react";
import clsx from "clsx";
import { ParkingSpot, VisibleColumns, ActionMenuState } from "../types";
import { getAreaColor, getParkingKey } from "../utils";
import parkingStyles from "../admin-parking.module.css";
import { IconDotsFilled, IconExternalLink, IconParking, IconCar, IconTrainFilled } from "@tabler/icons-react";

interface AdminParkingTableProps {
  spots: ParkingSpot[];
  visibleColumns: VisibleColumns;
  actionMenuState: ActionMenuState | null;
  selectedSpotKeys?: Record<string, boolean>;
  onToggleSelect?: (spotKey: string) => void;
  onToggleSelectAll?: (spots: ParkingSpot[]) => void;
  onViewSpot: (spot: ParkingSpot) => void;
  onToggleActionMenu: (
    spot: ParkingSpot,
    spotKey: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

export function AdminParkingTable({
  spots,
  visibleColumns,
  actionMenuState,
  selectedSpotKeys = {},
  onToggleSelect,
  onToggleSelectAll,
  onViewSpot,
  onToggleActionMenu,
}: AdminParkingTableProps) {
  const allSelected =
    spots.length > 0 &&
    spots.every((s) => selectedSpotKeys[getParkingKey(s)]);

  return (
    <div className={parkingStyles.table05Container}>
      <div className={parkingStyles.table05Scroll}>
        <table className={parkingStyles.table05}>
          <thead>
            <tr>
              {onToggleSelect && (
                <th className={parkingStyles.table05Th} style={{ width: "40px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => onToggleSelectAll && onToggleSelectAll(spots)}
                    style={{ cursor: "pointer", width: "16px", height: "16px" }}
                    title="تحديد الكل"
                  />
                </th>
              )}
              {visibleColumns.name && (
                <th className={parkingStyles.table05Th} style={{ minWidth: "190px" }}>
                  اسم الجراج
                </th>
              )}
              {visibleColumns.area && (
                <th className={parkingStyles.table05Th} style={{ minWidth: "110px" }}>
                  المنطقة
                </th>
              )}
              {visibleColumns.address && (
                <th className={parkingStyles.table05Th} style={{ minWidth: "180px" }}>
                  العنوان بالتفصيل
                </th>
              )}
              {visibleColumns.nearestMetro && (
                <th className={parkingStyles.table05Th} style={{ minWidth: "150px" }}>
                  أقرب محطة مترو
                </th>
              )}
              {visibleColumns.rates && (
                <th className={parkingStyles.table05Th} style={{ minWidth: "150px", textAlign: "center" }}>
                  التعريفة والرسوم
                </th>
              )}
              {visibleColumns.capacity && (
                <th className={parkingStyles.table05Th} style={{ width: "110px", textAlign: "center" }}>
                  السعة الإجمالية
                </th>
              )}
              {visibleColumns.type && (
                <th className={parkingStyles.table05Th} style={{ minWidth: "150px" }}>
                  نوع الجراج
                </th>
              )}
              {visibleColumns.hours && (
                <th className={parkingStyles.table05Th} style={{ minWidth: "140px" }}>
                  ساعات العمل
                </th>
              )}
              {visibleColumns.mapLocation && (
                <th className={parkingStyles.table05Th} style={{ width: "90px", textAlign: "center" }}>
                  الخريطة
                </th>
              )}
              <th className={parkingStyles.table05Th} style={{ textAlign: "center", width: "80px" }}>
                خيارات
              </th>
            </tr>
          </thead>
          <tbody>
            {spots.map((spot) => {
              const spotKey = getParkingKey(spot);
              const areaColor = getAreaColor(spot.area);
              const isActionOpen = actionMenuState?.spotKey === spotKey;
              const isSelected = !!selectedSpotKeys[spotKey];

              return (
                <tr
                  key={spotKey}
                  className={clsx(parkingStyles.table05Tr, isSelected && parkingStyles.table05TrSelected)}
                >
                  {onToggleSelect && (
                    <td className={parkingStyles.table05Td} style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(spotKey)}
                        style={{ cursor: "pointer", width: "16px", height: "16px" }}
                      />
                    </td>
                  )}

                  {visibleColumns.name && (
                    <td className={parkingStyles.table05Td}>
                      <button
                        type="button"
                        onClick={() => onViewSpot(spot)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--color-fg)",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          cursor: "pointer",
                          padding: 0,
                          textAlign: "right",
                        }}
                        title="عرض تفاصيل الجراج"
                      >
                        {spot.name}
                      </button>
                    </td>
                  )}

                  {visibleColumns.area && (
                    <td className={parkingStyles.table05Td}>
                      <span
                        className={parkingStyles.lineBadge}
                        style={{
                          background: `${areaColor}25`,
                          color: areaColor,
                          border: `1px solid ${areaColor}50`,
                        }}
                      >
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: areaColor,
                            display: "inline-block",
                          }}
                        />
                        {spot.area}
                      </span>
                    </td>
                  )}

                  {visibleColumns.address && (
                    <td className={parkingStyles.table05Td} style={{ color: "var(--color-fg)" }}>
                      <span style={{ fontSize: "0.86rem" }}>{spot.address}</span>
                    </td>
                  )}

                  {visibleColumns.nearestMetro && (
                    <td className={parkingStyles.table05Td}>
                      {spot.nearestMetro ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "0.82rem",
                            background: "rgba(239, 68, 68, 0.12)",
                            color: "#f87171",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            border: "1px solid rgba(239, 68, 68, 0.25)",
                          }}
                        >
                          <IconTrainFilled size={14} />
                          <span>{spot.nearestMetro}</span>
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>-</span>
                      )}
                    </td>
                  )}

                  {visibleColumns.rates && (
                    <td className={parkingStyles.table05Td} style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: "center" }}>
                        <span
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 800,
                            color: "#10b981",
                            background: "rgba(16, 185, 129, 0.1)",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            border: "1px solid rgba(16, 185, 129, 0.25)",
                          }}
                        >
                          {spot.hourlyRate} ج.م / ساعة
                        </span>
                        {spot.maxDailyRate && (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            اليومي: {spot.maxDailyRate} ج.م
                          </span>
                        )}
                      </div>
                    </td>
                  )}

                  {visibleColumns.capacity && (
                    <td className={parkingStyles.table05Td} style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          background: "var(--bg-glass)",
                          border: "1px solid var(--border-glass)",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        <IconCar size={14} />
                        <span>{spot.capacity?.toLocaleString() || 0}</span>
                      </span>
                    </td>
                  )}

                  {visibleColumns.type && (
                    <td className={parkingStyles.table05Td} style={{ fontSize: "0.82rem" }}>
                      <span>{spot.type}</span>
                    </td>
                  )}

                  {visibleColumns.hours && (
                    <td className={parkingStyles.table05Td} style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                      <span>{spot.hours}</span>
                    </td>
                  )}

                  {visibleColumns.mapLocation && (
                    <td className={parkingStyles.table05Td} style={{ textAlign: "center" }}>
                      {spot.mapLocationLink ? (
                        <a
                          href={spot.mapLocationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: "4px 8px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.78rem",
                          }}
                          title="فتح في خرائط جوجل"
                        >
                          <IconExternalLink size={14} />
                          <span>الخريطة</span>
                        </a>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>-</span>
                      )}
                    </td>
                  )}

                  <td className={parkingStyles.table05Td} style={{ textAlign: "center" }}>
                    <div className={parkingStyles.actionMenuWrapper}>
                      <button
                        type="button"
                        onClick={(e) => onToggleActionMenu(spot, spotKey, e)}
                        className={clsx(
                          parkingStyles.moreMenuBtn,
                          isActionOpen && parkingStyles.moreMenuBtnActive
                        )}
                        aria-label="خيارات الجراج"
                        title="خيارات الجراج"
                      >
                        <IconDotsFilled size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
