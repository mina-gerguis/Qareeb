import React from "react";
import clsx from "clsx";
import brtStyles from "../admin-brt.module.css";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";

interface AdminBrtHeaderProps {
  onAddClick: () => void;
  onOpenExcelModal: () => void;
  onExportExcel: () => void;
}

export function AdminBrtHeader({
  onAddClick,
}: AdminBrtHeaderProps) {
  return (
    <div className={`pt-3 ${brtStyles.headerBar}`}>
      <div className={brtStyles.headerTextGroup}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <h2 className="fs-3xl fw-900 color-fg" style={{ margin: 0 }}>
            إدارة الأتوبيس الترددي
          </h2>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        {/* Add Station Button */}
        <button
          type="button"
          onClick={onAddClick}
          className={clsx("btn btn-primary", brtStyles.addStationBtn)}
        >
          <IconSquareRoundedPlusFilled size={20} />
          <span>إضافة محطة جديدة</span>
        </button>
      </div>
    </div>
  );
}
