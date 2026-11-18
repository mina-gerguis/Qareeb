import React from "react";
import clsx from "clsx";
import styles from "../admin-directions.module.css";
import {
  IconSquareRoundedPlusFilled,
  IconRoute,
  IconDownload,
  IconFileSpreadsheet,
  IconBook2,
  IconX,
} from "@tabler/icons-react";

interface AdminDirectionsHeaderProps {
  showAddForm: boolean;
  onToggleForm: () => void;
  onOpenExcelModal: () => void;
  onExportExcel: () => void;
  onOpenCheatsheet: () => void;
}

export function AdminDirectionsHeader({
  showAddForm,
  onToggleForm,
  onOpenExcelModal,
  onExportExcel,
  onOpenCheatsheet,
}: AdminDirectionsHeaderProps) {
  return (
    <div className={`pt-3 ${styles.headerBar}`}>
      <div className={styles.headerTextGroup}>
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
            <IconRoute size={22} />
          </span>
          <h2 className="fs-3xl fw-900 color-fg" style={{ margin: 0 }}>
            إدارة مسارات المواصلات (ازاي اروح)
          </h2>
        </div>
        <p style={{ color: "var(--text-muted, #94a3b8)", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>
          إضافة وتعديل خطوط مواصلات الانتقال بين المدن والمحطات، حساب الأجرة والمراحل والخطوات التفصيلية
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {/* Transit Types Cheatsheet */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onOpenCheatsheet}
          title="دليل كتابة أنواع ورموز المواصلات في الإكسل"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <IconBook2 size={18} />
          <span className="hide-mobile">دليل الأنواع</span>
        </button>

        {/* Export to Excel */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onExportExcel}
          title="تصدير جميع المسارات إلى ملف Excel"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <IconDownload size={18} />
          <span className="hide-mobile">تصدير إكسل</span>
        </button>

        {/* Import from Excel */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onOpenExcelModal}
          title="استيراد مسارات وخطوات من ملف Excel"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <IconFileSpreadsheet size={18} />
          <span className="hide-mobile">استيراد إكسل</span>
        </button>

        {/* Add Route Button */}
        <button
          type="button"
          onClick={onToggleForm}
          className={clsx("btn btn-primary", styles.addStationBtn, showAddForm && "btn-cancel")}
        >
          {showAddForm ? <IconX size={20} /> : <IconSquareRoundedPlusFilled size={20} />}
          <span>{showAddForm ? "إلغاء الإضافة" : "إضافة طريق جديد"}</span>
        </button>
      </div>
    </div>
  );
}
