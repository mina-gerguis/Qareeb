import React from "react";
import { RoadNewsItem, VisibleColumnsNews } from "../types";
import { getNewsSeverityBadge, getNewsCategoryLabel } from "../utils";
import roadsStyles from "../admin-roads-info.module.css";
import {
  IconAlertTriangle,
  IconCalendar,
  IconTrashFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminNewsCardsProps {
  news: RoadNewsItem[];
  visibleColumns: VisibleColumnsNews;
  onEditNews: (news: RoadNewsItem) => void;
  onDeleteNews: (news: RoadNewsItem) => void;
}

export function AdminNewsCards({
  news,
  visibleColumns,
  onEditNews,
  onDeleteNews,
}: AdminNewsCardsProps) {
  return (
    <div className={roadsStyles.stationCardsList}>
      {news.map((item) => {
        const newsKey = item.id;
        const sevBadge = getNewsSeverityBadge(item.severity);
        const catLabel = getNewsCategoryLabel(item.category);

        return (
          <div key={newsKey} className={roadsStyles.stationCard}>
            {/* Header: Title + Severity */}
            <div className={roadsStyles.stationCardHeader}>
              <div className={roadsStyles.stationCardMain}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: sevBadge.color,
                    boxShadow: `0 0 8px ${sevBadge.color}80`,
                    flexShrink: 0,
                  }}
                />
                {visibleColumns.title && (
                  <h3 className={roadsStyles.stationCardName}>{item.title}</h3>
                )}
              </div>

              {visibleColumns.severity && (
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
              )}
            </div>

            {/* Summary */}
            <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {item.summary}
            </p>

            {/* Road, Category & Source Meta */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
              {visibleColumns.roadName && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border-glass)",
                    fontSize: "0.78rem",
                    fontWeight: "bold",
                  }}
                >
                  <IconAlertTriangle size={14} color="#f59e0b" />
                  <span>{item.roadName || "كافة الطرق"}</span>
                </span>
              )}

              {visibleColumns.category && (
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  {catLabel}
                </span>
              )}

              {visibleColumns.source && (
                <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                  • {item.source}
                </span>
              )}

              {visibleColumns.date && item.publishedAt && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.76rem", color: "var(--text-muted)" }}>
                  <IconCalendar size={13} />
                  <span>{new Date(item.publishedAt).toLocaleDateString("ar-EG")}</span>
                </span>
              )}
            </div>

            {/* Actions */}
            <div className={roadsStyles.stationCardActions}>
              <button
                type="button"
                onClick={() => onEditNews(item)}
                className="btn btn-blue w-full"
              >
                <IconWritingSignFilled size={18} />
                <span>تعديل</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteNews(item)}
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
