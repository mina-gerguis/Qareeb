import React from "react";
import clsx from "clsx";
import { BusStation, VisibleColumns, ActionMenuState } from "../types";
import { getGovernorateColor, getStationKey } from "../utils";
import busStyles from "../admin-bus-stations.module.css";
import { IconBuildingSkyscraper, IconDotsFilled, IconMapPin } from "@tabler/icons-react";

interface AdminBusStationsTableProps {
  stations: BusStation[];
  visibleColumns: VisibleColumns;
  actionMenuState: ActionMenuState | null;
  onViewStation: (station: BusStation) => void;
  onToggleActionMenu: (station: BusStation, stationKey: string, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function AdminBusStationsTable({
  stations,
  visibleColumns,
  actionMenuState,
  onViewStation,
  onToggleActionMenu,
}: AdminBusStationsTableProps) {
  return (
    <div className={busStyles.table05Container}>
      <div className={busStyles.table05Scroll}>
        <table className={busStyles.table05}>
          <thead>
            <tr>
              {visibleColumns.name && (
                <th className={busStyles.table05Th} style={{ minWidth: "200px" }}>
                  اسم الموقف
                </th>
              )}
              {visibleColumns.governorate && (
                <th className={busStyles.table05Th} style={{ minWidth: "120px" }}>
                  المحافظة
                </th>
              )}
              {visibleColumns.location && (
                <th className={busStyles.table05Th} style={{ minWidth: "180px" }}>
                  العنوان بالتفصيل
                </th>
              )}
              {visibleColumns.companiesCount && (
                <th className={busStyles.table05Th} style={{ width: "130px", textAlign: "center" }}>
                  الشركات المشغلة
                </th>
              )}
              {visibleColumns.destinations && (
                <th className={busStyles.table05Th} style={{ minWidth: "220px" }}>
                  الوجهات المتاحة
                </th>
              )}
              {visibleColumns.description && (
                <th className={busStyles.table05Th} style={{ minWidth: "200px" }}>
                  الوصف والملاحظات
                </th>
              )}
              <th className={busStyles.table05Th} style={{ textAlign: "center", width: "90px" }}>
                خيارات
              </th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => {
              const stationKey = getStationKey(station);
              const govColor = getGovernorateColor(station.governorate);
              const isActionOpen = actionMenuState?.stationKey === stationKey;

              return (
                <tr key={stationKey} className={busStyles.table05Tr}>
                  {visibleColumns.name && (
                    <td className={busStyles.table05Td}>
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
                        title="عرض تفاصيل الموقف"
                      >
                        {station.name}
                      </button>
                    </td>
                  )}

                  {visibleColumns.governorate && (
                    <td className={busStyles.table05Td}>
                      <span
                        className={busStyles.lineBadge}
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
                    <td className={busStyles.table05Td} style={{ color: "var(--color-fg)" }}>
                      <span style={{ fontSize: "0.88rem" }}>{station.location}</span>
                    </td>
                  )}

                  {visibleColumns.companiesCount && (
                    <td className={busStyles.table05Td} style={{ textAlign: "center" }}>
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
                        <IconBuildingSkyscraper size={15} />
                        <span>{station.companies?.length || 0} شركات</span>
                      </span>
                    </td>
                  )}

                  {visibleColumns.destinations && (
                    <td className={busStyles.table05Td}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", maxWidth: "340px" }}>
                        {station.destinations && Array.isArray(station.destinations) && station.destinations.length > 0 ? (
                          station.destinations.slice(0, 4).map((dest, idx) => (
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
                            لم تحدد وجهات
                          </span>
                        )}
                        {station.destinations && station.destinations.length > 4 && (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--text-muted)",
                              padding: "2px 4px",
                            }}
                          >
                            +{station.destinations.length - 4} أخرى
                          </span>
                        )}
                      </div>
                    </td>
                  )}

                  {visibleColumns.description && (
                    <td className={busStyles.table05Td} style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                      <span
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {station.description || "-"}
                      </span>
                    </td>
                  )}

                  <td className={busStyles.table05Td} style={{ textAlign: "center" }}>
                    <div className={busStyles.actionMenuWrapper}>
                      <button
                        type="button"
                        onClick={(e) => onToggleActionMenu(station, stationKey, e)}
                        className={clsx(
                          busStyles.moreMenuBtn,
                          isActionOpen && busStyles.moreMenuBtnActive
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
