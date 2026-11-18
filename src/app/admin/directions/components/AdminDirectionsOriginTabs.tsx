import React from "react";
import clsx from "clsx";
import styles from "../admin-directions.module.css";
import { OriginTabItem } from "../types";

interface AdminDirectionsOriginTabsProps {
  selectedOrigin: string;
  onSelectOrigin: (origin: string) => void;
  totalRoutesCount: number;
  uniqueOrigins: OriginTabItem[];
}

export function AdminDirectionsOriginTabs({
  selectedOrigin,
  onSelectOrigin,
  totalRoutesCount,
  uniqueOrigins,
}: AdminDirectionsOriginTabsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <span className={styles.lineFilterLabel}>
        <i className="bx bx-filter-alt" style={{ fontSize: "0.95rem" }} />
        تصفية حسب نقطة الانطلاق:
      </span>
      <div className={styles.lineFilterScroll}>
        <button
          type="button"
          onClick={() => onSelectOrigin("all")}
          className={clsx(styles.linePill, selectedOrigin === "all" && styles.linePillActive)}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#6366f1",
              display: "inline-block",
            }}
          />
          جميع المناطق ({totalRoutesCount})
        </button>

        {uniqueOrigins.map((orig, i) => {
          const isActive = selectedOrigin === orig.name;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectOrigin(orig.name)}
              className={clsx(styles.linePill, isActive && styles.linePillActive)}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "inline-block",
                }}
              />
              {orig.name} ({orig.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}
