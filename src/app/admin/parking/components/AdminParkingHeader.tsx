import React from "react";
import clsx from "clsx";
import parkingStyles from "../admin-parking.module.css";
import { IconSquareRoundedPlusFilled, IconParking } from "@tabler/icons-react";

interface AdminParkingHeaderProps {
  onAddClick: () => void;
}

export function AdminParkingHeader({ onAddClick }: AdminParkingHeaderProps) {
  return (
    <div className={`pt-3 ${parkingStyles.headerBar}`}>
      <div className={parkingStyles.headerTextGroup}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(59, 130, 246, 0.15)",
              color: "#3b82f6",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconParking size={22} />
          </span>
          <h2 className="fs-3xl fw-900 color-fg" style={{ margin: 0 }}>
            إدارة الجراجات وأماكن الانتظار
          </h2>
        </div>
        <p style={{ color: "var(--text-muted, #94a3b8)", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>
          تحرير وتحديث الجراجات العامة والذكية، رسوم الانتظار بالساعة واليوم، السعة، والميزات
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={onAddClick}
          className={clsx("btn btn-primary", parkingStyles.addStationBtn)}
        >
          <IconSquareRoundedPlusFilled size={20} />
          <span>إضافة جراج جديد</span>
        </button>
      </div>
    </div>
  );
}
