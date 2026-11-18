import React from "react";
import clsx from "clsx";
import busStyles from "../admin-bus-stations.module.css";
import { IconSquareRoundedPlusFilled, IconBus } from "@tabler/icons-react";

interface AdminBusStationsHeaderProps {
  onAddClick: () => void;
}

export function AdminBusStationsHeader({ onAddClick }: AdminBusStationsHeaderProps) {
  return (
    <div className={`pt-3 ${busStyles.headerBar}`}>
      <div className={busStyles.headerTextGroup}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(99, 102, 241, 0.15)",
              color: "#818cf8",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconBus size={22} />
          </span>
          <h2 className="fs-3xl fw-900 color-fg" style={{ margin: 0 }}>
            إدارة مواقف الأتوبيسات (سوبرجيت)
          </h2>
        </div>
        <p style={{ color: "var(--text-muted, #94a3b8)", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>
          تحرير وتحديث مواقف وحافلات سوبرجيت وشركات النقل البري والسياحي بين المحافظات
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={onAddClick}
          className={clsx("btn btn-primary", busStyles.addStationBtn)}
        >
          <IconSquareRoundedPlusFilled size={20} />
          <span>إضافة موقف أتوبيس جديد</span>
        </button>
      </div>
    </div>
  );
}
