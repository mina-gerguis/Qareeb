import React from "react";
import clsx from "clsx";
import { LrtStation, VisibleColumns, ActionMenuState } from "../types";
import { getLineLabel, getLineColor, getStationKey } from "../utils";
import lrtStyles from "../admin-lrt.module.css";
import {
  IconCurrentLocationFilled,
  IconDotsFilled,
  IconGripVertical,
  IconSquareRoundedChevronDownFilled,
  IconSquareRoundedChevronUpFilled,
} from "@tabler/icons-react";

interface AdminLrtTableProps {
  lrtStations: LrtStation[];
  paginatedRows: LrtStation[];
  selectedStationKeys?: string[];
  visibleColumns: VisibleColumns;
  draggedStationId: string | null;
  dragOverStationId: string | null;
  isReordering: boolean;
  actionMenuState: ActionMenuState | null;
  onToggleSelectAll?: () => void;
  onToggleSelectRow?: (stationKey: string) => void;
  onDragStart: (station: LrtStation, stationKey: string, e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (stationKey: string, e: React.DragEvent) => void;
  onDrop: (targetStation: LrtStation, e: React.DragEvent) => void;
  onDragEnd: () => void;
  onMoveStation: (station: LrtStation, direction: "up" | "down") => void;
  onToggleActionMenu: (station: LrtStation, stationKey: string, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function AdminLrtTable({
  lrtStations,
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
}: AdminLrtTableProps) {
  return (
    <div className={lrtStyles.table05Container}>
      <div className={lrtStyles.table05Scroll}>
        <table className={lrtStyles.table05}>
          <thead>
            <tr>
              {visibleColumns.order && (
                <th className={lrtStyles.table05Th} style={{ width: "130px", textAlign: "center" }}>
                  الترتيب
                </th>
              )}
              {visibleColumns.name && (
                <th className={lrtStyles.table05Th} style={{ minWidth: "140px" }}>
                  اسم المحطة
                </th>
              )}
              {visibleColumns.line && (
                <th className={lrtStyles.table05Th} style={{ minWidth: "160px" }}>
                  المسار / الفرعة
                </th>
              )}
              {visibleColumns.landmarks && (
                <th className={lrtStyles.table05Th} style={{ minWidth: "220px" }}>
                  المعالم والأماكن القريبة
                </th>
              )}
              {visibleColumns.status && (
                <th className={lrtStyles.table05Th} style={{ width: "130px" }}>
                  حالة المحطة
                </th>
              )}
              <th className={lrtStyles.table05Th} style={{ textAlign: "center", width: "100px" }}>
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

              const sameLineStations = lrtStations
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
                    lrtStyles.table05Tr,
                    isSelected && lrtStyles.table05TrSelected,
                    isDragging && lrtStyles.isDragging,
                    isDragOver && lrtStyles.isDragOver
                  )}
                  style={{ cursor: "grab" }}
                >
                  {visibleColumns.order && (
                    <td className={lrtStyles.table05Td} style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span className={lrtStyles.dragHandle} title="اسحب لإعادة الترتيب">
                          <IconGripVertical stroke={2} size={20} />
                        </span>
                        <div className={lrtStyles.orderControlsGroup}>
                          <button
                            type="button"
                            disabled={!canMoveUp || isReordering}
                            onClick={() => onMoveStation(station, "up")}
                            className={lrtStyles.orderArrowBtn}
                            title="تقديم المحطة لأعلى"
                          >
                            <IconSquareRoundedChevronUpFilled />
                          </button>
                          <button
                            type="button"
                            disabled={!canMoveDown || isReordering}
                            onClick={() => onMoveStation(station, "down")}
                            className={lrtStyles.orderArrowBtn}
                            title="تأخير المحطة لأسفل"
                          >
                            <IconSquareRoundedChevronDownFilled />
                          </button>
                        </div>
                        <span
                          className={lrtStyles.orderBadge}
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
                    <td className={lrtStyles.table05Td} style={{ fontWeight: "700", color: "var(--color-fg)" }}>
                      {station.name}
                    </td>
                  )}
                  {visibleColumns.line && (
                    <td className={lrtStyles.table05Td}>
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
                    <td className={lrtStyles.table05Td}>
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
                    <td className={lrtStyles.table05Td}>
                      {station.status === "تحت الإنشاء" ? (
                        <span className={lrtStyles.statusBadgeCancelled}>تحت الإنشاء</span>
                      ) : station.status === "تشغيل تجريبي" ? (
                        <span className={lrtStyles.statusBadgePending}>تشغيل تجريبي</span>
                      ) : (
                        <span className={lrtStyles.statusBadgeCompleted}>{station.status || "تشغيل فعلي"}</span>
                      )}
                    </td>
                  )}
                  <td className={lrtStyles.table05Td} style={{ textAlign: "center" }}>
                    <div className={lrtStyles.actionMenuWrapper}>
                      <button
                        type="button"
                        onClick={(e) => onToggleActionMenu(station, stationKey, e)}
                        className={clsx(
                          lrtStyles.moreMenuBtn,
                          actionMenuState?.key === stationKey && lrtStyles.moreMenuBtnActive
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
