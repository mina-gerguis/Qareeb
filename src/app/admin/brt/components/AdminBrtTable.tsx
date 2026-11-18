import React from "react";
import clsx from "clsx";
import { AdminBrtStation, VisibleColumns, ActionMenuState } from "../types";
import { getSectorColor, getStationKey } from "../utils";
import brtStyles from "../admin-brt.module.css";
import { IconBus, IconCurrentLocationFilled, IconDotsFilled } from "@tabler/icons-react";

interface AdminBrtTableProps {
  stations: AdminBrtStation[];
  selectedStationKeys: Record<string, boolean>;
  visibleColumns: VisibleColumns;
  actionMenuState: ActionMenuState | null;
  onToggleSelectRow: (stationKey: string) => void;
  onToggleSelectAll: (stations: AdminBrtStation[]) => void;
  onViewStation: (station: AdminBrtStation) => void;
  onToggleActionMenu: (station: AdminBrtStation, stationKey: string, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function AdminBrtTable({
  stations,
  selectedStationKeys,
  visibleColumns,
  actionMenuState,
  onToggleSelectRow,
  onToggleSelectAll,
  onViewStation,
  onToggleActionMenu,
}: AdminBrtTableProps) {
  const isAllSelected =
    stations.length > 0 &&
    stations.every((s) => selectedStationKeys[getStationKey(s)]);

  return (
    <div className={brtStyles.table05Container}>
      <div className={brtStyles.table05Scroll}>
        <table className={brtStyles.table05}>
          <thead>
            <tr>
              {visibleColumns.name && (
                <th className={brtStyles.table05Th} style={{ minWidth: "160px" }}>
                  اسم المحطة
                </th>
              )}
              {visibleColumns.sector && (
                <th className={brtStyles.table05Th} style={{ minWidth: "130px" }}>
                  القطاع
                </th>
              )}
              {visibleColumns.location && (
                <th className={brtStyles.table05Th} style={{ minWidth: "150px" }}>
                  الموقع الجغرافي
                </th>
              )}
              {visibleColumns.routesCount && (
                <th className={brtStyles.table05Th} style={{ width: "120px", textAlign: "center" }}>
                  المسارات
                </th>
              )}
              {visibleColumns.landmarks && (
                <th className={brtStyles.table05Th} style={{ minWidth: "200px" }}>
                  المعالم القريبة
                </th>
              )}
              {visibleColumns.type && (
                <th className={brtStyles.table05Th} style={{ minWidth: "140px" }}>
                  نوع المحطة
                </th>
              )}
              {visibleColumns.status && (
                <th className={brtStyles.table05Th} style={{ width: "130px" }}>
                  الحالة
                </th>
              )}
              <th className={brtStyles.table05Th} style={{ textAlign: "center", width: "90px" }}>
                خيارات
              </th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => {
              const stationKey = getStationKey(station);
              const isSelected = Boolean(selectedStationKeys[stationKey]);
              const sectorColor = getSectorColor(station.sector);
              const isActionOpen = actionMenuState?.stationKey === stationKey;

              return (
                <tr
                  key={stationKey}
                  className={clsx(
                    brtStyles.table05Tr,
                    isSelected && brtStyles.table05TrSelected
                  )}
                >
                  {visibleColumns.name && (
                    <td className={brtStyles.table05Td}>
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
                        title="عرض تفاصيل المحطة"
                      >
                        {station.name}
                      </button>
                    </td>
                  )}

                  {visibleColumns.sector && (
                    <td className={brtStyles.table05Td}>
                      <span
                        className={brtStyles.lineBadge}
                        style={{
                          background: `${sectorColor}`,
                          color: "#fff",
                          border: `1px solid ${sectorColor}50`,
                          width: "120px"
                        }}
                      >
                        {station.sector}
                      </span>
                    </td>
                  )}

                  {visibleColumns.location && (
                    <td className={brtStyles.table05Td} style={{ color: "var(--color-fg)" }}>
                      <span style={{ fontSize: "0.88rem" }}>{station.location}</span>
                    </td>
                  )}

                  {visibleColumns.routesCount && (
                    <td className={brtStyles.table05Td} style={{ textAlign: "center" }}>
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
                        <span>{station.routes?.length || 0} مسار</span>
                      </span>
                    </td>
                  )}

                  {visibleColumns.landmarks && (
                    <td className={brtStyles.table05Td}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {station.landmarks && Array.isArray(station.landmarks) && station.landmarks.length > 0 ? (
                          station.landmarks.map((lm, idx) => (
                            <span key={idx} className={brtStyles.landmarkChip}>
                              <IconCurrentLocationFilled size={14} />
                              {lm}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                            لا توجد معالم مسجلة
                          </span>
                        )}
                      </div>
                    </td>
                  )}

                  {visibleColumns.type && (
                    <td className={brtStyles.table05Td}>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        {station.type || "قياسية"}
                      </span>
                    </td>
                  )}

                  {visibleColumns.status && (
                    <td className={brtStyles.table05Td}>
                      {station.status === "تحت الإنشاء" ? (
                        <span className={brtStyles.statusBadgeCancelled}>تحت الإنشاء</span>
                      ) : station.status === "مخطط" ? (
                        <span className={brtStyles.statusBadgePending}>مخطط</span>
                      ) : (
                        <span className={brtStyles.statusBadgeCompleted}>
                          {station.status || "يعمل بانتظام"}
                        </span>
                      )}
                    </td>
                  )}

                  <td className={brtStyles.table05Td} style={{ textAlign: "center" }}>
                    <div className={brtStyles.actionMenuWrapper}>
                      <button
                        type="button"
                        onClick={(e) => onToggleActionMenu(station, stationKey, e)}
                        className={clsx(
                          brtStyles.moreMenuBtn,
                          isActionOpen && brtStyles.moreMenuBtnActive
                        )}
                        aria-label="خيارات المحطة"
                        title="خيارات المحطة"
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
