import React from "react";
import clsx from "clsx";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { MetroStation, VisibleColumns } from "../types";
import { getLineLabel, getLineColor, getStationKey } from "../utils";
import metroStyles from "../admin-metro.module.css";
import { IconCircleCaretUpFilled, IconCurrentLocationFilled, IconGripVertical, IconListDetailsFilled, IconSquareRoundedChevronDownFilled, IconSquareRoundedChevronUpFilled, IconTrainFilled, IconTrashFilled, IconWritingSignFilled } from "@tabler/icons-react";

interface AdminMetroCardsProps {
  metroStations: MetroStation[];
  paginatedRows: MetroStation[];
  selectedStationKeys: string[];
  visibleColumns: VisibleColumns;
  draggedStationId: string | null;
  dragOverStationId: string | null;
  isReordering: boolean;
  onToggleSelectRow: (stationKey: string) => void;
  onDragStart: (station: MetroStation, stationKey: string, e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (stationKey: string, e: React.DragEvent) => void;
  onDrop: (targetStation: MetroStation, e: React.DragEvent) => void;
  onDragEnd: () => void;
  onMoveStation: (station: MetroStation, direction: "up" | "down") => void;
  onViewStation: (station: MetroStation) => void;
  onEditStation: (station: MetroStation) => void;
  onDeleteStation: (station: MetroStation) => void;
}

export function AdminMetroCards({
  metroStations,
  paginatedRows,
  selectedStationKeys,
  visibleColumns,
  draggedStationId,
  dragOverStationId,
  isReordering,
  onToggleSelectRow,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDrop,
  onDragEnd,
  onMoveStation,
  onViewStation,
  onEditStation,
  onDeleteStation,
}: AdminMetroCardsProps) {
  return (
    <div className={metroStyles.stationCardsList}>
      {paginatedRows.map((station) => {
        const lineColor = getLineColor(station.line_type);
        const lineLabel = getLineLabel(station.line_type);
        const stationKey = getStationKey(station);
        const isSelected = selectedStationKeys.includes(stationKey);
        const isDragging = draggedStationId === stationKey;
        const isDragOver = dragOverStationId === stationKey;

        const sameLineStations = metroStations
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
              metroStyles.stationCard,
              metroStyles.draggableCard,
              isSelected && metroStyles.table05TrSelected,
              isDragging && metroStyles.isDragging,
              isDragOver && metroStyles.isDragOver
            )}
          >
            {/* Header: Drag Handle + Order Arrows + Order Badge + Name + Status */}
            {(visibleColumns.order || visibleColumns.name || visibleColumns.status) && (
              <div className={metroStyles.stationCardHeader}>
                {(visibleColumns.order || visibleColumns.name) && (
                  <div className={metroStyles.stationCardMain}>
                    {visibleColumns.order && (
                      <>
                        {/* Drag Handle & Arrow buttons */}
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span className={metroStyles.dragHandle} title="اسحب لإعادة الترتيب">
                            <IconGripVertical stroke={2} size={20} />
                          </span>
                          <div className={metroStyles.orderControlsGroup}>
                            <button
                              type="button"
                              disabled={!canMoveUp || isReordering}
                              onClick={() => onMoveStation(station, "up")}
                              className={metroStyles.orderArrowBtn}
                              title="تقديم المحطة لأعلى"
                            >
                              <IconSquareRoundedChevronUpFilled />
                            </button>
                            <button
                              type="button"
                              disabled={!canMoveDown || isReordering}
                              onClick={() => onMoveStation(station, "down")}
                              className={metroStyles.orderArrowBtn}
                              title="تأخير المحطة لأسفل"
                            >
                              <IconSquareRoundedChevronDownFilled />
                            </button>
                          </div>
                        </div>

                        <span
                          className={metroStyles.orderBadge}
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
                      <h3 className={metroStyles.stationCardName}>{station.name}</h3>
                    )}
                  </div>
                )}

                {visibleColumns.status && (
                  <div>
                    {station.status === "تحت الإنشاء" ? (
                      <span className={metroStyles.statusBadgeCancelled}>تحت الإنشاء</span>
                    ) : station.status === "تشغيل تجريبي" ? (
                      <span className={metroStyles.statusBadgePending}>تشغيل تجريبي</span>
                    ) : (
                      <span className={metroStyles.statusBadgeCompleted}>يعمل</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Line badge */}
            {visibleColumns.line && (
              <div className={metroStyles.stationCardLineRow}>
                <span
                  className={metroStyles.lineBadge}
                  style={{
                    background: lineColor,
                    color: "#ffffffff",
                  }}
                >
                  <IconTrainFilled size={18} />
                  {lineLabel}
                </span>
              </div>
            )}

            {/* Landmarks */}
            {visibleColumns.landmarks && (
              <div className={metroStyles.stationCardLandmarks}>
                {station.landmarks && Array.isArray(station.landmarks) && station.landmarks.length > 0 ? (
                  station.landmarks.map((landmark: string, lIdx: number) => (
                    <span key={lIdx} className={metroStyles.landmarkChip}>
                      <IconCurrentLocationFilled size={16} />
                      {landmark}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic-font" >
                    لم يتم تحديد معالم قريبة
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className={metroStyles.stationCardActions}>
              <button
                type="button"
                onClick={() => onViewStation(station)}
                className="btn btn-cancel w-full"
                title="عرض تفاصيل المحطة"
              >
               <IconListDetailsFilled size={18}/>
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

