import React from "react";
import clsx from "clsx";
import { RailwayRoute, VisibleLineColumns, ActionMenuState } from "../types";
import { getRouteColor } from "../utils";
import railwaysStyles from "../admin-railways.module.css";
import { IconDotsFilled, IconEye, IconTrain } from "@tabler/icons-react";

interface AdminRailwaysLinesTableProps {
  routes: RailwayRoute[];
  paginatedRoutes: RailwayRoute[];
  visibleColumns: VisibleLineColumns;
  actionMenuState: ActionMenuState | null;
  onViewLine: (route: RailwayRoute) => void;
  onSelectRouteStations: (routeId: string) => void;
  onToggleActionMenu: (route: RailwayRoute, key: string, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function AdminRailwaysLinesTable({
  paginatedRoutes,
  visibleColumns,
  actionMenuState,
  onViewLine,
  onSelectRouteStations,
  onToggleActionMenu,
}: AdminRailwaysLinesTableProps) {
  return (
    <div className={railwaysStyles.table05Container}>
      <div className={railwaysStyles.table05Scroll}>
        <table className={railwaysStyles.table05}>
          <thead>
            <tr>
              {visibleColumns.id && (
                <th className={railwaysStyles.table05Th} style={{ width: "130px", textAlign: "center" }}>
                  كود المسار
                </th>
              )}
              {visibleColumns.name && (
                <th className={railwaysStyles.table05Th} style={{ minWidth: "180px" }}>
                  اسم الخط / المسار
                </th>
              )}
              {visibleColumns.from && (
                <th className={railwaysStyles.table05Th} style={{ minWidth: "140px" }}>
                  من
                </th>
              )}
              {visibleColumns.to && (
                <th className={railwaysStyles.table05Th} style={{ minWidth: "140px" }}>
                  إلى
                </th>
              )}
              {visibleColumns.duration && (
                <th className={railwaysStyles.table05Th} style={{ width: "130px" }}>
                  مدة الرحلة
                </th>
              )}
              {visibleColumns.stopsCount && (
                <th className={railwaysStyles.table05Th} style={{ width: "130px", textAlign: "center" }}>
                  محطات التوقف
                </th>
              )}
              <th className={railwaysStyles.table05Th} style={{ textAlign: "center", width: "100px" }}>
                خيارات
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRoutes.map((route) => {
              const routeColor = getRouteColor(route.id);
              const isActionOpen = actionMenuState?.key === `line-${route.id}`;

              return (
                <tr key={route.id} className={railwaysStyles.table05Tr}>
                  {visibleColumns.id && (
                    <td className={railwaysStyles.table05Td} style={{ textAlign: "center" }}>
                      <span
                        className={railwaysStyles.orderBadge}
                        style={{
                          background: "var(--color-fg)",
                          color: "var(--color-bg)",
                          fontSize: "0.78rem",
                          padding: "2px 8px",
                        }}
                      >
                        {route.id}
                      </span>
                    </td>
                  )}

                  {visibleColumns.name && (
                    <td className={railwaysStyles.table05Td} style={{ fontWeight: "700", color: "var(--color-fg)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: routeColor,
                            boxShadow: `0 0 8px ${routeColor}80`,
                            flexShrink: 0,
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => onViewLine(route)}
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
                          title="عرض تفاصيل المسار"
                        >
                          {route.name}
                        </button>
                      </div>
                    </td>
                  )}

                  {visibleColumns.from && (
                    <td className={railwaysStyles.table05Td} style={{ color: "var(--color-fg)" }}>
                      {route.from}
                    </td>
                  )}

                  {visibleColumns.to && (
                    <td className={railwaysStyles.table05Td} style={{ color: "var(--color-fg)" }}>
                      {route.to}
                    </td>
                  )}

                  {visibleColumns.duration && (
                    <td className={railwaysStyles.table05Td}>
                      <span
                        className={`${railwaysStyles.statusBadgeCompleted}`}
                      >
                        {route.duration || "غير محدد"}
                      </span>
                    </td>
                  )}

                  {visibleColumns.stopsCount && (
                    <td className={railwaysStyles.table05Td} style={{ textAlign: "center" }}>
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
                        title="انقر لإدارة محطات هذا المسار"
                      >
                        <IconTrain size={16} />
                        <span>{route.stops?.length || 0} محطة</span>
                      </button>
                    </td>
                  )}

                  <td className={railwaysStyles.table05Td} style={{ textAlign: "center" }}>
                    <div className={railwaysStyles.actionMenuWrapper}>
                      <button
                        type="button"
                        onClick={(e) => onToggleActionMenu(route, `line-${route.id}`, e)}
                        className={clsx(
                          railwaysStyles.moreMenuBtn,
                          isActionOpen && railwaysStyles.moreMenuBtnActive
                        )}
                        aria-label="خيارات المسار"
                        title="خيارات المسار"
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
