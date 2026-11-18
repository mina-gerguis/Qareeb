import React from "react";
import clsx from "clsx";
import microStyles from "../admin-microbus-stations.module.css";
import {
  IconSquareRoundedPlusFilled,
  IconBus,
  IconFileSpreadsheet,
  IconDownload
} from "@tabler/icons-react";

interface AdminMicrobusStationsHeaderProps {
  onAddClick: () => void;
  onOpenExcelModal?: () => void;
  onExportExcel?: () => void;
}

export function AdminMicrobusStationsHeader({
  onAddClick,
  onOpenExcelModal,
  onExportExcel,
}: AdminMicrobusStationsHeaderProps) {
  return (
    <div className={`pt-3 ${microStyles.headerBar}`}>
      <div className={microStyles.headerTextGroup}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(245, 158, 11, 0.15)",
              color: "#f59e0b",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconBus size={22} />
          </span>
          <h2 className="fs-3xl fw-900 color-fg" style={{ margin: 0 }}>
            إدارة مواقف الميكروباص والسرفيس
          </h2>
        </div>
        <p style={{ color: "var(--text-muted, #94a3b8)", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>
          تحرير وتحديث مواقف الميكروباص وخطوط السير والتعريفة المحدثة للمواقف الرسمية ونقاط التحميل
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {onExportExcel && (
          <button
            type="button"
            onClick={onExportExcel}
            className="btn btn-secondary"
            title="تصدير بيانات المواقف إلى ملف إكسل"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <IconDownload size={18} />
            <span className="hide-mobile">تصدير إكسل</span>
          </button>
        )}

        {onOpenExcelModal && (
          <button
            type="button"
            onClick={onOpenExcelModal}
            className="btn btn-secondary"
            title="استيراد وتحديث المواقف من ملف إكسل"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <IconFileSpreadsheet size={18} />
            <span className="hide-mobile">استيراد إكسل</span>
          </button>
        )}

        <button
          type="button"
          onClick={onAddClick}
          className={clsx("btn btn-primary", microStyles.addStationBtn)}
        >
          <IconSquareRoundedPlusFilled size={20} />
          <span>إضافة موقف سرفيس جديد</span>
        </button>
      </div>
    </div>
  );
}
