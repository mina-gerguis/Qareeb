import React from "react";
import clsx from "clsx";
import { LrtStation, VisibleColumns } from "../types";
import { getLineLabel, getLineColor, getStationKey } from "../utils";
import lrtStyles from "../admin-lrt.module.css";
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

interface AdminLrtCardsProps {
  lrtStations: LrtStation[];
  paginatedRows: LrtStation[];
  selectedStationKeys: string[];
  visibleColumns: VisibleColumns;
  draggedStationId: string | null;
  dragOverStationId: string | null;
  isReordering: boolean;
  onToggleSelectRow: (stationKey: string) => void;
  onDragStart: (station: LrtStation, stationKey: string, e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (stationKey: string, e: React.DragEvent) => void;
  onDrop: (targetStation: LrtStation, e: React.DragEvent) => void;
  onDragEnd: () => void;
  onMoveStation: (station: LrtStation, direction: "up" | "down") => void;
  onViewStation: (station: LrtStation) => void;
  onEditStation: (station: LrtStation) => void;
  onDeleteStation: (station: LrtStation) => void;
}

export function AdminLrtCards({
  lrtStations,
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
}: AdminLrtCardsProps) {
  return (
    <div className={lrtStyles.stationCardsList}>
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
          <div
            key={stationKey}
            draggable
            onDragStart={e => onDragStart(station, stationKey, e)}
            onDragOver={onDragOver}
            onDragEnter={e => onDragEnter(stationKey, e)}
            onDrop={e => onDrop(station, e)}
            onDragEnd={onDragEnd}
            className={clsx(
              lrtStyles.stationCard,
              lrtStyles.draggableCard,
              isSelected && lrtStyles.table05TrSelected,
              isDragging && lrtStyles.isDragging,
              isDragOver && lrtStyles.isDragOver
            )}
          >
            {/* Header: Drag Handle + Order Arrows + Order Badge + Name + Status */}
            {(visibleColumns.order || visibleColumns.name || visibleColumns.status) && (
              <div className={lrtStyles.stationCardHeader}>
                {(visibleColumns.order || visibleColumns.name) && (
                  <div className={lrtStyles.stationCardMain}>
                    {visibleColumns.order && (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
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
                        </div>

                        <span
                          className={lrtStyles.orderBadge}
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
                      <h3 className={lrtStyles.stationCardName}>{station.name}</h3>
                    )}
                  </div>
                )}

                {visibleColumns.status && (
                  <div>
                    {station.status === "تحت الإنشاء" ? (
                      <span className={lrtStyles.statusBadgeCancelled}>تحت الإنشاء</span>
                    ) : station.status === "تشغيل تجريبي" ? (
                      <span className={lrtStyles.statusBadgePending}>تشغيل تجريبي</span>
                    ) : (
                      <span className={lrtStyles.statusBadgeCompleted}>{station.status || "تشغيل فعلي"}</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Line badge */}
            {visibleColumns.line && (
              <div className={lrtStyles.stationCardLineRow}>
                <span
                  className={lrtStyles.lineBadge}
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
              <div className={lrtStyles.stationCardLandmarks}>
                {station.landmarks && Array.isArray(station.landmarks) && station.landmarks.length > 0 ? (
                  station.landmarks.map((landmark: string, lIdx: number) => (
                    <span key={lIdx} className={lrtStyles.landmarkChip}>
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
            <div className={lrtStyles.stationCardActions}>
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
