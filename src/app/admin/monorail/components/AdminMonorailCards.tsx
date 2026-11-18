import React from "react";
import clsx from "clsx";
import { MonorailStation, VisibleColumns } from "../types";
import { getLineLabel, getLineColor, getStationKey } from "../utils";
import monorailStyles from "../admin-monorail.module.css";
import {
  IconCurrentLocationFilled,
  IconGripVertical,
  IconListDetailsFilled,
  IconSquareRoundedChevronDownFilled,
  IconSquareRoundedChevronUpFilled,
  IconTrainFilled,
  IconTrashFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminMonorailCardsProps {
  monorailStations: MonorailStation[];
  paginatedRows: MonorailStation[];
  selectedStationKeys: string[];
  visibleColumns: VisibleColumns;
  draggedStationId: string | null;
  dragOverStationId: string | null;
  isReordering: boolean;
  onToggleSelectRow: (stationKey: string) => void;
  onDragStart: (station: MonorailStation, stationKey: string, e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (stationKey: string, e: React.DragEvent) => void;
  onDrop: (targetStation: MonorailStation, e: React.DragEvent) => void;
  onDragEnd: () => void;
  onMoveStation: (station: MonorailStation, direction: "up" | "down") => void;
  onViewStation: (station: MonorailStation) => void;
  onEditStation: (station: MonorailStation) => void;
  onDeleteStation: (station: MonorailStation) => void;
}

export function AdminMonorailCards({
  monorailStations,
  paginatedRows,
  selectedStationKeys,
  visibleColumns,
  draggedStationId,
  dragOverStationId,
  isReordering,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDrop,
  onDragEnd,
  onMoveStation,
  onViewStation,
  onEditStation,
  onDeleteStation,
}: AdminMonorailCardsProps) {
  return (
    <div className={monorailStyles.stationCardsList}>
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
          <div
            key={stationKey}
            draggable
            onDragStart={e => onDragStart(station, stationKey, e)}
            onDragOver={onDragOver}
            onDragEnter={e => onDragEnter(stationKey, e)}
            onDrop={e => onDrop(station, e)}
            onDragEnd={onDragEnd}
            className={clsx(
              monorailStyles.stationCard,
              monorailStyles.draggableCard,
              isSelected && monorailStyles.table05TrSelected,
              isDragging && monorailStyles.isDragging,
              isDragOver && monorailStyles.isDragOver
            )}
          >
            {/* Header: Drag Handle + Order Arrows + Order Badge + Name + Status */}
            {(visibleColumns.order || visibleColumns.name || visibleColumns.status) && (
              <div className={monorailStyles.stationCardHeader}>
                {(visibleColumns.order || visibleColumns.name) && (
                  <div className={monorailStyles.stationCardMain}>
                    {visibleColumns.order && (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
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
                        </div>

                        <span
                          className={monorailStyles.orderBadge}
                          style={{
                            background: "var(--color-fg)",
                            color: "var(--color-bg)",
                          }}
                        >
                          #{station.station_order}
                        </span>
                      </>
                    )}

                    {visibleColumns.name && (
                      <h3 className={monorailStyles.stationCardName}>{station.name}</h3>
                    )}
                  </div>
                )}

                {visibleColumns.status && (
                  <div>
                    {station.status === "تحت الإنشاء" ? (
                      <span className={monorailStyles.statusBadgeCancelled}>تحت الإنشاء</span>
                    ) : station.status === "تشغيل تجريبي" ? (
                      <span className={monorailStyles.statusBadgePending}>تشغيل تجريبي</span>
                    ) : (
                      <span className={monorailStyles.statusBadgeCompleted}>{station.status || "يعمل"}</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Line badge */}
            {visibleColumns.line && (
              <div className={monorailStyles.stationCardLineRow}>
                <span
                  className={monorailStyles.lineBadge}
                  style={{
                    background: lineColor,
                    color: "#ffffff",
                  }}
                >
                  <IconTrainFilled size={18} />
                  {lineLabel}
                </span>
              </div>
            )}

            {/* Landmarks */}
            {visibleColumns.landmarks && (
              <div className={monorailStyles.stationCardLandmarks}>
                {station.landmarks && Array.isArray(station.landmarks) && station.landmarks.length > 0 ? (
                  station.landmarks.map((landmark: string, lIdx: number) => (
                    <span key={lIdx} className={monorailStyles.landmarkChip}>
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
            )}

            {/* Actions */}
            <div className={monorailStyles.stationCardActions}>
              <button
                type="button"
                onClick={() => onViewStation(station)}
                className="btn btn-cancel w-full"
                title="عرض تفاصيل المحطة"
              >
                <IconListDetailsFilled size={18} />
                <span>تفاصيل</span>
              </button>
              <button
                type="button"
                onClick={() => onEditStation(station)}
                className="btn btn-blue w-full"
              >
                <IconWritingSignFilled size={18} />
                <span>تعديل</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteStation(station)}
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
