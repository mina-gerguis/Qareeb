import React from "react";
import styles from "../admin-directions.module.css";
import { GroupedRoute } from "../types";
import { Trash2 } from "lucide-react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

interface AdminDirectionsToolbarProps {
  totalCount: number;
  visibleRoutes: GroupedRoute[];
  selectedCount: number;
  selectedRouteKeys: Record<string, boolean>;
  onToggleSelectAll: (visibleRoutes: GroupedRoute[]) => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function AdminDirectionsToolbar({
  totalCount,
  visibleRoutes,
  selectedCount,
  selectedRouteKeys,
  onToggleSelectAll,
  onClearSelection,
  onBulkDelete,
  onExpandAll,
  onCollapseAll,
}: AdminDirectionsToolbarProps) {
  const isAllSelected =
    visibleRoutes.length > 0 &&
    visibleRoutes.every((r) => {
      const key = `${r.from_location.trim()}|||${r.to_location.trim()}`;
      return !!selectedRouteKeys[key];
    });

  return (
    <>
      {selectedCount > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "10px",
            padding: "8px 16px",
            marginBottom: "12px",
            fontSize: "0.88rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 700, color: "var(--color-fg)" }}>
              تم تحديد ({selectedCount}) مسار
            </span>
            <button
              type="button"
              onClick={onClearSelection}
              className="btn btn-secondary btn-sm"
              style={{ padding: "4px 8px", fontSize: "0.8rem" }}
            >
              إلغاء التحديد
            </button>
          </div>

          <button
            type="button"
            onClick={onBulkDelete}
            className="btn btn-error btn-sm"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Trash2 className="h-4 w-4" />
            <span>حذف المحدد ({selectedCount})</span>
          </button>
        </div>
      )}

      <div
        className={styles.table05ControlsBar}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        {/* Left: Select all & count */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {visibleRoutes.length > 0 && (
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "0.88rem",
                fontWeight: "700",
                color: "var(--color-fg)",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={() => onToggleSelectAll(visibleRoutes)}
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                }}
              />
              <span>تحديد الكل</span>
            </label>
          )}

          <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "var(--text-secondary)" }}>
            إجمالي المسارات المطابقة ({totalCount})
          </span>
        </div>

        {/* Right: Expand/Collapse All */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onExpandAll}
            title="توسيع كافة بطاقات المسارات"
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <IconChevronDown size={16} />
            <span>توسيع الكل</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onCollapseAll}
            title="طي كافة بطاقات المسارات"
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <IconChevronUp size={16} />
            <span>طي الكل</span>
          </button>
        </div>
      </div>
    </>
  );
}
