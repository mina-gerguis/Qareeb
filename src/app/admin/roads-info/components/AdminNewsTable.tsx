import React from "react";
import clsx from "clsx";
import { RoadNewsItem, VisibleColumnsNews, ActionMenuStateNews } from "../types";
import { getNewsSeverityBadge, getNewsCategoryLabel } from "../utils";
import roadsStyles from "../admin-roads-info.module.css";
import { IconDotsFilled, IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";

interface AdminNewsTableProps {
  news: RoadNewsItem[];
  visibleColumns: VisibleColumnsNews;
  actionMenuState: ActionMenuStateNews | null;
  selectedNewsKeys?: Record<string, boolean>;
  onToggleSelect?: (newsId: string) => void;
  onToggleSelectAll?: (news: RoadNewsItem[]) => void;
  onEditNews: (news: RoadNewsItem) => void;
  onToggleActionMenu: (
    news: RoadNewsItem,
    newsKey: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

export function AdminNewsTable({
  news,
  visibleColumns,
  actionMenuState,
  selectedNewsKeys = {},
  onToggleSelect,
  onToggleSelectAll,
  onEditNews,
  onToggleActionMenu,
}: AdminNewsTableProps) {
  const allSelected =
    news.length > 0 &&
    news.every((n) => selectedNewsKeys[n.id]);

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
                    onChange={() => onToggleSelectAll && onToggleSelectAll(news)}
                    style={{ cursor: "pointer", width: "16px", height: "16px" }}
                    title="تحديد الكل"
                  />
                </th>
              )}
              {visibleColumns.title && (
                <th className={roadsStyles.table05Th} style={{ minWidth: "200px" }}>
                  عنوان التنبيه
                </th>
              )}
              {visibleColumns.category && (
                <th className={roadsStyles.table05Th} style={{ minWidth: "120px" }}>
                  التصنيف
                </th>
              )}
              {visibleColumns.severity && (
                <th className={roadsStyles.table05Th} style={{ width: "120px", textAlign: "center" }}>
                  مستوى الأهمية
                </th>
              )}
              {visibleColumns.roadName && (
                <th className={roadsStyles.table05Th} style={{ minWidth: "150px" }}>
                  الطريق المستهدف
                </th>
              )}
              {visibleColumns.source && (
                <th className={roadsStyles.table05Th} style={{ minWidth: "140px" }}>
                  المصدر
                </th>
              )}
              {visibleColumns.date && (
                <th className={roadsStyles.table05Th} style={{ width: "120px", textAlign: "center" }}>
                  تاريخ النشر
                </th>
              )}
              {visibleColumns.status && (
                <th className={roadsStyles.table05Th} style={{ width: "90px", textAlign: "center" }}>
                  الحالة
                </th>
              )}
              <th className={roadsStyles.table05Th} style={{ textAlign: "center", width: "80px" }}>
                خيارات
              </th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => {
              const newsKey = item.id;
              const sevBadge = getNewsSeverityBadge(item.severity);
              const catLabel = getNewsCategoryLabel(item.category);
              const isActionOpen = actionMenuState?.newsKey === newsKey;
              const isSelected = !!selectedNewsKeys[newsKey];

              return (
                <tr
                  key={newsKey}
                  className={clsx(roadsStyles.table05Tr, isSelected && roadsStyles.table05TrSelected)}
                >
                  {onToggleSelect && (
                    <td className={roadsStyles.table05Td} style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(newsKey)}
                        style={{ cursor: "pointer", width: "16px", height: "16px" }}
                      />
                    </td>
                  )}

                  {visibleColumns.title && (
                    <td className={roadsStyles.table05Td}>
                      <button
                        type="button"
                        onClick={() => onEditNews(item)}
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
                        title="تعديل التنبيه"
                      >
                        {item.title}
                      </button>
                    </td>
                  )}

                  {visibleColumns.category && (
                    <td className={roadsStyles.table05Td} style={{ fontSize: "0.85rem" }}>
                      <span>{catLabel}</span>
                    </td>
                  )}

                  {visibleColumns.severity && (
                    <td className={roadsStyles.table05Td} style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: sevBadge.bg,
                          color: sevBadge.color,
                          fontSize: "0.78rem",
                          fontWeight: "bold",
                        }}
                      >
                        {sevBadge.label}
                      </span>
                    </td>
                  )}

                  {visibleColumns.roadName && (
                    <td className={roadsStyles.table05Td} style={{ fontSize: "0.85rem", color: "var(--color-fg)" }}>
                      <span>{item.roadName || "كافة الطرق"}</span>
                    </td>
                  )}

                  {visibleColumns.source && (
                    <td className={roadsStyles.table05Td} style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      <span>{item.source}</span>
                    </td>
                  )}

                  {visibleColumns.date && (
                    <td className={roadsStyles.table05Td} style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("ar-EG") : "-"}</span>
                    </td>
                  )}

                  {visibleColumns.status && (
                    <td className={roadsStyles.table05Td} style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          background: item.isActive ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 255, 255, 0.05)",
                          color: item.isActive ? "#10b981" : "var(--text-muted)",
                        }}
                      >
                        {item.isActive ? "نشط" : "معطل"}
                      </span>
                    </td>
                  )}

                  <td className={roadsStyles.table05Td} style={{ textAlign: "center" }}>
                    <div className={roadsStyles.actionMenuWrapper}>
                      <button
                        type="button"
                        onClick={(e) => onToggleActionMenu(item, newsKey, e)}
                        className={clsx(
                          roadsStyles.moreMenuBtn,
                          isActionOpen && roadsStyles.moreMenuBtnActive
                        )}
                        aria-label="خيارات التنبيه"
                        title="خيارات التنبيه"
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
