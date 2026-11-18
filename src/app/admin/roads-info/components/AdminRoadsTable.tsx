import React from "react";
import clsx from "clsx";
import { HighwayItem, VisibleColumnsRoads, ActionMenuStateRoad } from "../types";
import { getRoadTypeColor, getRoadStatusBadge } from "../utils";
import roadsStyles from "../admin-roads-info.module.css";
import { IconDotsFilled, IconExternalLink, IconRoad, IconGauge } from "@tabler/icons-react";

interface AdminRoadsTableProps {
  roads: HighwayItem[];
  visibleColumns: VisibleColumnsRoads;
  actionMenuState: ActionMenuStateRoad | null;
  selectedRoadKeys?: Record<string, boolean>;
  onToggleSelect?: (roadId: string) => void;
  onToggleSelectAll?: (roads: HighwayItem[]) => void;
  onViewRoad: (road: HighwayItem) => void;
  onToggleActionMenu: (
    road: HighwayItem,
    roadKey: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

export function AdminRoadsTable({
  roads,
  visibleColumns,
  actionMenuState,
  selectedRoadKeys = {},
  onToggleSelect,
  onToggleSelectAll,
  onViewRoad,
  onToggleActionMenu,
}: AdminRoadsTableProps) {
  const allSelected =
    roads.length > 0 &&
    roads.every((r) => selectedRoadKeys[r.id || r.name]);

  return (
    <div className={roadsStyles.table05Container}>
      <div className={roadsStyles.table05Scroll}>
        <table className={roadsStyles.table05}>
          <thead>
            <tr>
              {onToggleSelect && (
                <th className={roadsStyles.table05Th} style={{ width: "40px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => onToggleSelectAll && onToggleSelectAll(roads)}
                    style={{ cursor: "pointer", width: "16px", height: "16px" }}
                    title="تحديد الكل"
                  />
                </th>
              )}
              {visibleColumns.name && (
                <th className={roadsStyles.table05Th} style={{ minWidth: "190px" }}>
                  اسم الطريق / المحور
                </th>
              )}
              {visibleColumns.type && (
                <th className={roadsStyles.table05Th} style={{ minWidth: "100px" }}>
                  التصنيف
                </th>
              )}
              {visibleColumns.length && (
                <th className={roadsStyles.table05Th} style={{ width: "100px", textAlign: "center" }}>
                  الطول
                </th>
              )}
              {visibleColumns.endpoints && (
                <th className={roadsStyles.table05Th} style={{ minWidth: "180px" }}>
                  مسار الطريق (البداية ← النهاية)
                </th>
              )}
              {visibleColumns.speeds && (
                <th className={roadsStyles.table05Th} style={{ minWidth: "140px", textAlign: "center" }}>
                  السرعة المقررة
                </th>
              )}
              {visibleColumns.lanes && (
                <th className={roadsStyles.table05Th} style={{ width: "90px", textAlign: "center" }}>
                  الحارات
                </th>
              )}
              {visibleColumns.status && (
                <th className={roadsStyles.table05Th} style={{ width: "130px", textAlign: "center" }}>
                  حالة الطريق
                </th>
              )}
              {visibleColumns.emergency && (
                <th className={roadsStyles.table05Th} style={{ minWidth: "120px" }}>
                  طوارئ المرور
                </th>
              )}
              {visibleColumns.mapUrl && (
                <th className={roadsStyles.table05Th} style={{ width: "90px", textAlign: "center" }}>
                  الخريطة
                </th>
              )}
              <th className={roadsStyles.table05Th} style={{ textAlign: "center", width: "80px" }}>
                خيارات
              </th>
            </tr>
          </thead>
          <tbody>
            {roads.map((road) => {
              const roadKey = road.id || road.name;
              const typeColor = getRoadTypeColor(road.type);
              const statusBadge = getRoadStatusBadge(road.status);
              const isActionOpen = actionMenuState?.roadKey === roadKey;
              const isSelected = !!selectedRoadKeys[roadKey];

              return (
                <tr
                  key={roadKey}
                  className={clsx(roadsStyles.table05Tr, isSelected && roadsStyles.table05TrSelected)}
                >
                  {onToggleSelect && (
                    <td className={roadsStyles.table05Td} style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(roadKey)}
                        style={{ cursor: "pointer", width: "16px", height: "16px" }}
                      />
                    </td>
                  )}

                  {visibleColumns.name && (
                    <td className={roadsStyles.table05Td}>
                      <button
                        type="button"
                        onClick={() => onViewRoad(road)}
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
                        title="عرض تفاصيل الطريق"
                      >
                        {road.name}
                        {road.code && (
                          <span style={{ marginRight: "6px", fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 500 }}>
                            ({road.code})
                          </span>
                        )}
                      </button>
                    </td>
                  )}

                  {visibleColumns.type && (
                    <td className={roadsStyles.table05Td}>
                      <span
                        className={roadsStyles.lineBadge}
                        style={{
                          background: `${typeColor}25`,
                          color: typeColor,
                          border: `1px solid ${typeColor}50`,
                        }}
                      >
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: typeColor,
                            display: "inline-block",
                          }}
                        />
                        {road.type}
                      </span>
                    </td>
                  )}

                  {visibleColumns.length && (
                    <td className={roadsStyles.table05Td} style={{ textAlign: "center", fontWeight: "bold" }}>
                      <span>{road.lengthKm} كم</span>
                    </td>
                  )}

                  {visibleColumns.endpoints && (
                    <td className={roadsStyles.table05Td} style={{ fontSize: "0.85rem", color: "var(--color-fg)" }}>
                      <span>{road.startPoint} ← {road.endPoint}</span>
                    </td>
                  )}

                  {visibleColumns.speeds && (
                    <td className={roadsStyles.table05Td} style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          background: "rgba(59, 130, 246, 0.1)",
                          color: "#3b82f6",
                          border: "1px solid rgba(59, 130, 246, 0.25)",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        <IconGauge size={14} />
                        <span>{road.speeds?.privateCar || 120} كم/س</span>
                      </span>
                    </td>
                  )}

                  {visibleColumns.lanes && (
                    <td className={roadsStyles.table05Td} style={{ textAlign: "center", fontSize: "0.85rem" }}>
                      <span>{road.lanesCount} حارات</span>
                    </td>
                  )}

                  {visibleColumns.status && (
                    <td className={roadsStyles.table05Td} style={{ textAlign: "center" }}>
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
                    </td>
                  )}

                  {visibleColumns.emergency && (
                    <td className={roadsStyles.table05Td} style={{ fontSize: "0.82rem", direction: "ltr", textAlign: "right" }}>
                      <span>{road.emergencyPhone || "-"}</span>
                    </td>
                  )}

                  {visibleColumns.mapUrl && (
                    <td className={roadsStyles.table05Td} style={{ textAlign: "center" }}>
                      {road.mapUrl ? (
                        <a
                          href={road.mapUrl}
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

                  <td className={roadsStyles.table05Td} style={{ textAlign: "center" }}>
                    <div className={roadsStyles.actionMenuWrapper}>
                      <button
                        type="button"
                        onClick={(e) => onToggleActionMenu(road, roadKey, e)}
                        className={clsx(
                          roadsStyles.moreMenuBtn,
                          isActionOpen && roadsStyles.moreMenuBtnActive
                        )}
                        aria-label="خيارات الطريق"
                        title="خيارات الطريق"
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
