import React from "react";
import clsx from "clsx";
import { AdminMicrobusStation, VisibleColumns, ActionMenuState } from "../types";
import { getGovernorateColor, getStationKey } from "../utils";
import microStyles from "../admin-microbus-stations.module.css";
import { IconDotsFilled, IconRoute, IconMapPin, IconExternalLink } from "@tabler/icons-react";

interface AdminMicrobusStationsTableProps {
  stations: AdminMicrobusStation[];
  visibleColumns: VisibleColumns;
  actionMenuState: ActionMenuState | null;
  selectedStationKeys?: Record<string, boolean>;
  onToggleSelect?: (stationKey: string) => void;
  onToggleSelectAll?: (stations: AdminMicrobusStation[]) => void;
  onViewStation: (station: AdminMicrobusStation) => void;
  onToggleActionMenu: (
    station: AdminMicrobusStation,
    stationKey: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

export function AdminMicrobusStationsTable({
  stations,
  visibleColumns,
  actionMenuState,
  selectedStationKeys = {},
  onToggleSelect,
  onToggleSelectAll,
  onViewStation,
  onToggleActionMenu,
}: AdminMicrobusStationsTableProps) {
  const allSelected =
    stations.length > 0 &&
    stations.every((s) => selectedStationKeys[getStationKey(s)]);

  return (
    <div className={microStyles.table05Container}>
      <div className={microStyles.table05Scroll}>
        <table className={microStyles.table05}>
          <thead>
            <tr>
              {onToggleSelect && (
                <th className={microStyles.table05Th} style={{ width: "40px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => onToggleSelectAll && onToggleSelectAll(stations)}
                    style={{ cursor: "pointer", width: "16px", height: "16px" }}
                    title="تحديد الكل"
                  />
                </th>
              )}
              {visibleColumns.name && (
                <th className={microStyles.table05Th} style={{ minWidth: "200px" }}>
                  اسم موقف السرفيس
                </th>
              )}
              {visibleColumns.governorate && (
                <th className={microStyles.table05Th} style={{ minWidth: "120px" }}>
                  المحافظة
                </th>
              )}
              {visibleColumns.location && (
                <th className={microStyles.table05Th} style={{ minWidth: "180px" }}>
                  العنوان والموقع بالتفصيل
                </th>
              )}
              {visibleColumns.routesCount && (
                <th className={microStyles.table05Th} style={{ width: "130px", textAlign: "center" }}>
                  الخطوط والمسارات
                </th>
              )}
              {visibleColumns.destinations && (
                <th className={microStyles.table05Th} style={{ minWidth: "220px" }}>
                  أبرز الوجهات
                </th>
              )}
              {visibleColumns.mapUrl && (
                <th className={microStyles.table05Th} style={{ width: "100px", textAlign: "center" }}>
                  الخريطة
                </th>
              )}
              <th className={microStyles.table05Th} style={{ textAlign: "center", width: "90px" }}>
                خيارات
              </th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => {
              const stationKey = getStationKey(station);
              const govColor = getGovernorateColor(station.governorate);
              const isActionOpen = actionMenuState?.stationKey === stationKey;
              const isSelected = !!selectedStationKeys[stationKey];

              // Extract destinations from routes
              const destinations = Array.isArray(station.routes)
                ? Array.from(new Set(station.routes.map((r) => r.destination).filter(Boolean)))
                : [];

              return (
                <tr
                  key={stationKey}
                  className={clsx(microStyles.table05Tr, isSelected && microStyles.table05TrSelected)}
                >
                  {onToggleSelect && (
                    <td className={microStyles.table05Td} style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(stationKey)}
                        style={{ cursor: "pointer", width: "16px", height: "16px" }}
                      />
                    </td>
                  )}

                  {visibleColumns.name && (
                    <td className={microStyles.table05Td}>
                      <button
                        type="button"
                        onClick={() => onViewStation(station)}
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
                        title="عرض تفاصيل الموقف والخطوط"
                      >
                        {station.name}
                      </button>
                    </td>
                  )}

                  {visibleColumns.governorate && (
                    <td className={microStyles.table05Td}>
                      <span
                        className={microStyles.lineBadge}
                        style={{
                          background: `${govColor}25`,
                          color: govColor,
                          border: `1px solid ${govColor}50`,
                        }}
                      >
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: govColor,
                            display: "inline-block",
                          }}
                        />
                        {station.governorate}
                      </span>
                    </td>
                  )}

                  {visibleColumns.location && (
                    <td className={microStyles.table05Td} style={{ color: "var(--color-fg)" }}>
                      <span style={{ fontSize: "0.88rem" }}>{station.location}</span>
                    </td>
                  )}

                  {visibleColumns.routesCount && (
                    <td className={microStyles.table05Td} style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          background: "var(--bg-glass)",
                          border: "1px solid var(--border-glass)",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        <IconRoute size={15} />
                        <span>{station.routes?.length || 0} مسار</span>
                      </span>
                    </td>
                  )}

                  {visibleColumns.destinations && (
                    <td className={microStyles.table05Td}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", maxWidth: "340px" }}>
                        {destinations.length > 0 ? (
                          destinations.slice(0, 4).map((dest, idx) => (
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
                          ))
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                            لم تحدد خطوط
                          </span>
                        )}
                        {destinations.length > 4 && (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--text-muted)",
                              padding: "2px 4px",
                            }}
                          >
                            +{destinations.length - 4} أخرى
                          </span>
                        )}
                      </div>
                    </td>
                  )}

                  {visibleColumns.mapUrl && (
                    <td className={microStyles.table05Td} style={{ textAlign: "center" }}>
                      {station.map_url ? (
                        <a
                          href={station.map_url}
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

                  <td className={microStyles.table05Td} style={{ textAlign: "center" }}>
                    <div className={microStyles.actionMenuWrapper}>
                      <button
                        type="button"
                        onClick={(e) => onToggleActionMenu(station, stationKey, e)}
                        className={clsx(
                          microStyles.moreMenuBtn,
                          isActionOpen && microStyles.moreMenuBtnActive
                        )}
                        aria-label="خيارات الموقف"
                        title="خيارات الموقف"
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
