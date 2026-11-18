import React from "react";
import clsx from "clsx";
import { RailwayRoute, VisibleLineColumns } from "../types";
import { getRouteColor } from "../utils";
import railwaysStyles from "../admin-railways.module.css";
import {
  IconArrowLeft,
  IconListDetailsFilled,
  IconTrain,
  IconTrashFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminRailwaysLinesCardsProps {
  paginatedRoutes: RailwayRoute[];
  visibleColumns: VisibleLineColumns;
  onViewLine: (route: RailwayRoute) => void;
  onEditLine: (route: RailwayRoute) => void;
  onDeleteLine: (route: RailwayRoute) => void;
  onSelectRouteStations: (routeId: string) => void;
}

export function AdminRailwaysLinesCards({
  paginatedRoutes,
  visibleColumns,
  onViewLine,
  onEditLine,
  onDeleteLine,
  onSelectRouteStations,
}: AdminRailwaysLinesCardsProps) {
  return (
    <div className={railwaysStyles.stationCardsList}>
      {paginatedRoutes.map((route) => {
        const routeColor = getRouteColor(route.id);

        return (
          <div key={route.id} className={railwaysStyles.stationCard}>
            {/* Header: Color + Name + ID + Duration */}
            <div className={railwaysStyles.stationCardHeader}>
              <div className={railwaysStyles.stationCardMain}>
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: routeColor,
                    boxShadow: `0 0 8px ${routeColor}80`,
                    flexShrink: 0,
                  }}
                />
                {visibleColumns.name && (
                  <h3 className={railwaysStyles.stationCardName}>{route.name}</h3>
                )}
                {visibleColumns.id && (
                  <span
                    className={railwaysStyles.orderBadge}
                    style={{
                      background: "var(--color-fg)",
                      color: "var(--color-bg)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {route.id}
                  </span>
                )}
              </div>

              {visibleColumns.duration && (
                <span
                  className={railwaysStyles.statusBadgeCompleted}
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    color: "#60a5fa",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  }}
                >
                  {route.duration || "غير محدد"}
                </span>
              )}
            </div>

            {/* Route path badge */}
            {(visibleColumns.from || visibleColumns.to) && (
              <div className={railwaysStyles.stationCardLineRow}>
                <span
                  className={railwaysStyles.lineBadge}
                  style={{
                    background: routeColor,
                    color: "#ffffff",
                  }}
                >
                  <IconTrain size={16} />
                  <span>{route.from}</span>
                  <IconArrowLeft size={14} />
                  <span>{route.to}</span>
                </span>
              </div>
            )}

            {/* Stops Count pill */}
            {visibleColumns.stopsCount && (
              <div>
                <button
                  type="button"
                  onClick={() => onSelectRouteStations(route.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border-glass)",
                    color: "var(--color-fg)",
                    fontSize: "0.82rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  title="انقر للانتقال لإدارة محطات هذا المسار"
                >
                  <IconTrain size={16} />
                  <span>{route.stops?.length || 0} محطة توقف (انقر للإدارة)</span>
                </button>
              </div>
            )}

            {/* Actions */}
            <div className={railwaysStyles.stationCardActions}>
              <button
                type="button"
                onClick={() => onViewLine(route)}
                className="btn btn-cancel w-full"
                title="عرض تفاصيل المسار"
              >
                <IconListDetailsFilled size={18} />
                <span>تفاصيل</span>
              </button>

              <button
                type="button"
                onClick={() => onEditLine(route)}
                className="btn btn-blue w-full"
              >
                <IconWritingSignFilled size={18} />
                <span>تعديل</span>
              </button>

              <button
                type="button"
                onClick={() => onDeleteLine(route)}
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
