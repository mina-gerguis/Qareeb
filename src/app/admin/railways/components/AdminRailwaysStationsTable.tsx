import React from "react";
import clsx from "clsx";
import { RailwayStop, VisibleStationColumns, ActionMenuState } from "../types";
import railwaysStyles from "../admin-railways.module.css";
import {
  IconDotsFilled,
  IconGripVertical,
  IconSquareRoundedChevronDownFilled,
  IconSquareRoundedChevronUpFilled,
} from "@tabler/icons-react";

interface AdminRailwaysStationsTableProps {
  allStops: RailwayStop[];
  paginatedStops: RailwayStop[];
  visibleColumns: VisibleStationColumns;
  draggedStopIdx: number | null;
  dragOverStopIdx: number | null;
  isReordering: boolean;
  actionMenuState: ActionMenuState | null;
  onDragStart: (idx: number, e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (idx: number, e: React.DragEvent) => void;
  onDrop: (targetIdx: number, e: React.DragEvent) => void;
  onDragEnd: () => void;
  onMoveStop: (fromIdx: number, direction: "up" | "down") => void;
  onToggleActionMenu: (stop: RailwayStop, idx: number, key: string, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function AdminRailwaysStationsTable({
  allStops,
  paginatedStops,
  visibleColumns,
  draggedStopIdx,
  dragOverStopIdx,
  isReordering,
  actionMenuState,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDrop,
  onDragEnd,
  onMoveStop,
  onToggleActionMenu,
}: AdminRailwaysStationsTableProps) {
  return (
    <div className={railwaysStyles.table05Container}>
      <div className={railwaysStyles.table05Scroll}>
        <table className={railwaysStyles.table05}>
          <thead>
            <tr>
              {visibleColumns.order && (
                <th className={railwaysStyles.table05Th} style={{ width: "140px", textAlign: "center" }}>
                  الترتيب
                </th>
              )}
              {visibleColumns.name && (
                <th className={railwaysStyles.table05Th} style={{ minWidth: "180px" }}>
                  اسم المحطة
                </th>
              )}
              {visibleColumns.status && (
                <th className={railwaysStyles.table05Th} style={{ width: "160px" }}>
                  الحالة التشغيلية
                </th>
              )}
              <th className={railwaysStyles.table05Th} style={{ textAlign: "center", width: "100px" }}>
                خيارات
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedStops.map((stop) => {
              const originalIdx = allStops.findIndex(
                (s, i) => (s.id && stop.id ? s.id === stop.id : s.name === stop.name && i === (stop.station_order ? stop.station_order - 1 : i))
              );
              const actualIdx = originalIdx >= 0 ? originalIdx : 0;
              const isDragging = draggedStopIdx === actualIdx;
              const isDragOver = dragOverStopIdx === actualIdx;
              const canMoveUp = actualIdx > 0;
              const canMoveDown = actualIdx < allStops.length - 1;
              const stopKey = `station-${stop.id || stop.name}-${actualIdx}`;
              const isActionOpen = actionMenuState?.key === stopKey;

              return (
                <tr
                  key={stopKey}
                  draggable
                  onDragStart={(e) => onDragStart(actualIdx, e)}
                  onDragOver={onDragOver}
                  onDragEnter={(e) => onDragEnter(actualIdx, e)}
                  onDrop={(e) => onDrop(actualIdx, e)}
                  onDragEnd={onDragEnd}
                  className={clsx(
                    railwaysStyles.table05Tr,
                    isDragging && railwaysStyles.isDragging,
                    isDragOver && railwaysStyles.isDragOver
                  )}
                  style={{ cursor: "grab" }}
                >
                  {visibleColumns.order && (
                    <td className={railwaysStyles.table05Td} style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span
                          className={railwaysStyles.dragHandle}
                          title="اسحب لإعادة الترتيب"
                        >
                          <IconGripVertical stroke={2} size={20} />
                        </span>

                        <div className={railwaysStyles.orderControlsGroup}>
                          <button
                            type="button"
                            disabled={!canMoveUp || isReordering}
                            onClick={() => onMoveStop(actualIdx, "up")}
                            className={railwaysStyles.orderArrowBtn}
                            title="تقديم المحطة لأعلى"
                          >
                            <IconSquareRoundedChevronUpFilled />
                          </button>
                          <button
                            type="button"
                            disabled={!canMoveDown || isReordering}
                            onClick={() => onMoveStop(actualIdx, "down")}
                            className={railwaysStyles.orderArrowBtn}
                            title="تأخير المحطة لأسفل"
                          >
                            <IconSquareRoundedChevronDownFilled />
                          </button>
                        </div>

                        <span
                          className={railwaysStyles.orderBadge}
                          style={{
                            background: "var(--color-fg)",
                            color: "var(--color-bg)",
                          }}
                        >
                          {actualIdx + 1}
                        </span>
                      </div>
                    </td>
                  )}

                  {visibleColumns.name && (
                    <td className={railwaysStyles.table05Td} style={{ fontWeight: "700", color: "var(--color-fg)" }}>
                      {stop.name}
                    </td>
                  )}

                  {visibleColumns.status && (
                    <td className={railwaysStyles.table05Td}>
                      {stop.status === "تحت الإنشاء" ? (
                        <span className={railwaysStyles.statusBadgeCancelled}>تحت الإنشاء</span>
                      ) : (
                        <span className={railwaysStyles.statusBadgeCompleted}>تشغيل فعلي</span>
                      )}
                    </td>
                  )}

                  <td className={railwaysStyles.table05Td} style={{ textAlign: "center" }}>
                    <div className={railwaysStyles.actionMenuWrapper}>
                      <button
                        type="button"
                        onClick={(e) => onToggleActionMenu(stop, actualIdx, stopKey, e)}
                        className={clsx(
                          railwaysStyles.moreMenuBtn,
                          isActionOpen && railwaysStyles.moreMenuBtnActive
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
