import React from "react";
import clsx from "clsx";
import portsStyles from "../admin-ports.module.css";
import { IconSquareRoundedPlusFilled, IconAnchor } from "@tabler/icons-react";

interface AdminPortsHeaderProps {
  onAddClick: () => void;
}

export function AdminPortsHeader({ onAddClick }: AdminPortsHeaderProps) {
  return (
    <div className={`pt-3 ${portsStyles.headerBar}`}>
      <div className={portsStyles.headerTextGroup}>
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
            <IconAnchor size={22} />
          </span>
          <h2 className="fs-3xl fw-900 color-fg" style={{ margin: 0 }}>
            إدارة الموانئ البحرية والمناطق اللوجستية
          </h2>
        </div>
        <p style={{ color: "var(--text-muted, #94a3b8)", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>
          إضافة وتعديل بيانات الموانئ المصرية على البحرين المتوسط والأحمر، الطاقة الاستيعابية، الأرصفة والجهات المشغلة
        </p>
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className={clsx("btn btn-primary", portsStyles.addStationBtn)}
      >
        <IconSquareRoundedPlusFilled size={20} />
        <span>إضافة ميناء جديد</span>
      </button>
    </div>
  );
}
