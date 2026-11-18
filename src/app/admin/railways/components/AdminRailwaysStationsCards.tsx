import React from "react";
import clsx from "clsx";
import { RailwayStop, VisibleStationColumns } from "../types";
import railwaysStyles from "../admin-railways.module.css";
import {
  IconGripVertical,
  IconSquareRoundedChevronDownFilled,
  IconSquareRoundedChevronUpFilled,
  IconTrashFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminRailwaysStationsCardsProps {
  allStops: RailwayStop[];
  paginatedStops: RailwayStop[];
  visibleColumns: VisibleStationColumns;
  draggedStopIdx: number | null;
  dragOverStopIdx: number | null;
  isReordering: boolean;
  onDragStart: (idx: number, e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (idx: number, e: React.DragEvent) => void;
  onDrop: (targetIdx: number, e: React.DragEvent) => void;
  onDragEnd: () => void;
  onMoveStop: (fromIdx: number, direction: "up" | "down") => void;
  onEditStation: (stop: RailwayStop, idx: number) => void;
  onDeleteStation: (stop: RailwayStop, idx: number) => void;
}

export function AdminRailwaysStationsCards({
  allStops,
  paginatedStops,
  visibleColumns,
  draggedStopIdx,
  dragOverStopIdx,
  isReordering,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDrop,
  onDragEnd,
  onMoveStop,
  onEditStation,
  onDeleteStation,
}: AdminRailwaysStationsCardsProps) {
  return (
    <div className={railwaysStyles.stationCardsList}>
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

        return (
          <div
            key={stopKey}
            draggable
            onDragStart={(e) => onDragStart(actualIdx, e)}
            onDragOver={onDragOver}
            onDragEnter={(e) => onDragEnter(actualIdx, e)}
            onDrop={(e) => onDrop(actualIdx, e)}
            onDragEnd={onDragEnd}
            className={clsx(
              railwaysStyles.stationCard,
              railwaysStyles.draggableCard,
              isDragging && railwaysStyles.isDragging,
              isDragOver && railwaysStyles.isDragOver
            )}
          >
            {/* Header: Drag handle + order arrows + order badge + name + status */}
            {(visibleColumns.order || visibleColumns.name || visibleColumns.status) && (
              <div className={railwaysStyles.stationCardHeader}>
                {(visibleColumns.order || visibleColumns.name) && (
                  <div className={railwaysStyles.stationCardMain}>
                    {visibleColumns.order && (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span className={railwaysStyles.dragHandle} title="اسحب لإعادة الترتيب">
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
                        </div>

                        <span
                          className={railwaysStyles.orderBadge}
                          style={{
                            background: "var(--color-fg)",
                            color: "var(--color-bg)",
                          }}
                        >
                          #{actualIdx + 1}
                        </span>
                      </>
                    )}

                    {visibleColumns.name && (
                      <h3 className={railwaysStyles.stationCardName}>{stop.name}</h3>
                    )}
                  </div>
                )}

                {visibleColumns.status && (
                  <div>
                    {stop.status === "تحت الإنشاء" ? (
                      <span className={railwaysStyles.statusBadgeCancelled}>تحت الإنشاء</span>
                    ) : (
                      <span className={railwaysStyles.statusBadgeCompleted}>تشغيل فعلي</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className={railwaysStyles.stationCardActions}>
              <button
                type="button"
                onClick={() => onEditStation(stop, actualIdx)}
                className="btn btn-blue w-full"
              >
                <IconWritingSignFilled size={18} />
                <span>تعديل</span>
              </button>

              <button
                type="button"
                onClick={() => onDeleteStation(stop, actualIdx)}
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
