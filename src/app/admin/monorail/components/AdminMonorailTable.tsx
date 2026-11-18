import React from "react";
import clsx from "clsx";
import { MonorailStation, VisibleColumns, ActionMenuState } from "../types";
import { getLineLabel, getLineColor, getStationKey } from "../utils";
import monorailStyles from "../admin-monorail.module.css";
import {
  IconCurrentLocationFilled,
  IconDotsFilled,
  IconGripVertical,
  IconSquareRoundedChevronDownFilled,
  IconSquareRoundedChevronUpFilled,
} from "@tabler/icons-react";

interface AdminMonorailTableProps {
  monorailStations: MonorailStation[];
  paginatedRows: MonorailStation[];
  selectedStationKeys?: string[];
  visibleColumns: VisibleColumns;
  draggedStationId: string | null;
  dragOverStationId: string | null;
  isReordering: boolean;
  actionMenuState: ActionMenuState | null;
  onToggleSelectAll?: () => void;
  onToggleSelectRow?: (stationKey: string) => void;
  onDragStart: (station: MonorailStation, stationKey: string, e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (stationKey: string, e: React.DragEvent) => void;
  onDrop: (targetStation: MonorailStation, e: React.DragEvent) => void;
  onDragEnd: () => void;
  onMoveStation: (station: MonorailStation, direction: "up" | "down") => void;
  onToggleActionMenu: (station: MonorailStation, stationKey: string, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function AdminMonorailTable({
  monorailStations,
  paginatedRows,
  selectedStationKeys = [],
  visibleColumns,
  draggedStationId,
  dragOverStationId,
  isReordering,
  actionMenuState,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDrop,
  onDragEnd,
  onMoveStation,
  onToggleActionMenu,
}: AdminMonorailTableProps) {
  return (
    <div className={monorailStyles.table05Container}>
      <div className={monorailStyles.table05Scroll}>
        <table className={monorailStyles.table05}>
          <thead>
            <tr>
              {visibleColumns.order && (
                <th className={monorailStyles.table05Th} style={{ width: "130px", textAlign: "center" }}>
                  الترتيب
                </th>
              )}
              {visibleColumns.name && (
                <th className={monorailStyles.table05Th} style={{ minWidth: "140px" }}>
                  اسم المحطة
                </th>
              )}
              {visibleColumns.line && (
                <th className={monorailStyles.table05Th} style={{ minWidth: "160px" }}>
                  المسار / الخط
                </th>
              )}
              {visibleColumns.landmarks && (
                <th className={monorailStyles.table05Th} style={{ minWidth: "220px" }}>
                  المعالم والأماكن القريبة
                </th>
              )}
              {visibleColumns.status && (
                <th className={monorailStyles.table05Th} style={{ width: "130px" }}>
                  حالة المحطة
                </th>
              )}
              <th className={monorailStyles.table05Th} style={{ textAlign: "center", width: "100px" }}>
                خيارات
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((station) => {
              const lineColor = getLineColor(station.line_type);
              const lineLabel = getLineLabel(station.line_type);
              const stationKey = getStationKey(station);
              const isSelected = selectedStationKeys.includes(stationKey);
              const isDragging = draggedStationId === stationKey;
              const isDragOver = dragOverStationId === stationKey;

              const sameLineStations = monorailStations
                .filter(s => s.line_type === station.line_type)
                .sort((a, b) => (Number(a.station_order) || 0) - (Number(b.station_order) || 0));
              const lineIdx = sameLineStations.findIndex(s => getStationKey(s) === stationKey);
              const canMoveUp = lineIdx > 0;
              const canMoveDown = lineIdx >= 0 && lineIdx < sameLineStations.length - 1;

              return (
                <tr
                  key={stationKey}
                  draggable
                  onDragStart={e => onDragStart(station, stationKey, e)}
                  onDragOver={onDragOver}
                  onDragEnter={e => onDragEnter(stationKey, e)}
                  onDrop={e => onDrop(station, e)}
                  onDragEnd={onDragEnd}
                  className={clsx(
                    monorailStyles.table05Tr,
                    isSelected && monorailStyles.table05TrSelected,
                    isDragging && monorailStyles.isDragging,
                    isDragOver && monorailStyles.isDragOver
                  )}
                  style={{ cursor: "grab" }}
                >
                  {visibleColumns.order && (
                    <td className={monorailStyles.table05Td} style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span className={monorailStyles.dragHandle} title="اسحب لإعادة الترتيب">
                          <IconGripVertical stroke={2} size={20} />
                        </span>
                        <div className={monorailStyles.orderControlsGroup}>
                          <button
                            type="button"
                            disabled={!canMoveUp || isReordering}
                            onClick={() => onMoveStation(station, "up")}
                            className={monorailStyles.orderArrowBtn}
                            title="تقديم المحطة لأعلى"
                          >
                            <IconSquareRoundedChevronUpFilled />
                          </button>
                          <button
                            type="button"
                            disabled={!canMoveDown || isReordering}
                            onClick={() => onMoveStation(station, "down")}
                            className={monorailStyles.orderArrowBtn}
                            title="تأخير المحطة لأسفل"
                          >
                            <IconSquareRoundedChevronDownFilled />
                          </button>
                        </div>
                        <span
                          className={monorailStyles.orderBadge}
                          style={{
                            background: "var(--color-fg)",
                            color: "var(--color-bg)",
                          }}
                        >
                          {station.station_order}
                        </span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.name && (
                    <td className={monorailStyles.table05Td} style={{ fontWeight: "700", color: "var(--color-fg)" }}>
                      {station.name}
                    </td>
                  )}
                  {visibleColumns.line && (
                    <td className={monorailStyles.table05Td}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          background: lineColor,
                          color: "#fff",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          display: "inline-block",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {lineLabel}
                      </span>
                    </td>
                  )}
                  {visibleColumns.landmarks && (
                    <td className={monorailStyles.table05Td}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {station.landmarks && Array.isArray(station.landmarks) && station.landmarks.length > 0 ? (
                          station.landmarks.map((landmark: string, lIdx: number) => (
                            <span
                              key={lIdx}
                              style={{
                                fontSize: "0.73rem",
                                background: "var(--bg-glass)",
                                color: "var(--color-fg)",
                                padding: "2px 6px",
                                borderRadius: "6px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                border: "1px solid var(--border-glass)",
                              }}
                            >
                              <IconCurrentLocationFilled size={16} />
                              {landmark}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground italic-font">
                            لم يتم تحديد معالم قريبة
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className={monorailStyles.table05Td}>
                      {station.status === "تحت الإنشاء" ? (
                        <span className={monorailStyles.statusBadgeCancelled}>تحت الإنشاء</span>
                      ) : station.status === "تشغيل تجريبي" ? (
                        <span className={monorailStyles.statusBadgePending}>تشغيل تجريبي</span>
                      ) : (
                        <span className={monorailStyles.statusBadgeCompleted}>{station.status || "يعمل"}</span>
                      )}
                    </td>
                  )}
                  <td className={monorailStyles.table05Td} style={{ textAlign: "center" }}>
                    <div className={monorailStyles.actionMenuWrapper}>
                      <button
                        type="button"
                        onClick={(e) => onToggleActionMenu(station, stationKey, e)}
                        className={clsx(
                          monorailStyles.moreMenuBtn,
                          actionMenuState?.key === stationKey && monorailStyles.moreMenuBtnActive
                        )}
                        aria-label="Open menu"
                        aria-expanded={actionMenuState?.key === stationKey}
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
