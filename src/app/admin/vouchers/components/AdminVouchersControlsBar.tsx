"use client";

import React from "react";
import { Columns } from "lucide-react";
import { IconColumns3Filled, IconLayoutListFilled } from "@tabler/icons-react";
import styles from "../vouchers.module.css";

interface AdminVouchersControlsBarProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  totalCount: number;
  columnsMenuOpen: boolean;
  onToggleColumnsMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
}

export function AdminVouchersControlsBar({
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  totalCount,
  columnsMenuOpen,
  onToggleColumnsMenu,
  viewMode,
  onViewModeChange,
}: AdminVouchersControlsBarProps) {
  return (
    <div className={styles.table05ControlsBar}>
      {/* Left: Page Size Select */}
      <div className={styles.table05PageSizeGroup}>
        <span>عرض</span>
        <select
          className={styles.table05Select}
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span>قسيمة في الصفحة</span>
        <span style={{ margin: "0 6px", color: "var(--border-glass, rgba(255,255,255,0.1))" }}>|</span>
        <span style={{ fontSize: "0.82rem" }}>
          إجمالي النتائج: <strong>{totalCount}</strong>
        </span>
      </div>

      {/* Right: Columns Toggle & View Mode Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Columns Toggle Button */}
        <button
          type="button"
          onClick={onToggleColumnsMenu}
          className={`${styles.columnsToggleBtn} ${
            columnsMenuOpen ? styles.columnsToggleBtnActive : ""
          }`}
          title="إظهار / إخفاء الأعمدة"
        >
          <Columns className="h-4 w-4" />
          <span>الأعمدة</span>
        </button>

        {/* View Mode Toggle Buttons */}
        <div className={styles.viewToggleButtons}>
          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            className={`${styles.viewToggleBtn} ${
              viewMode === "cards" ? styles.viewToggleBtnActive : ""
            }`}
            title="عرض كبطاقات"
          >
            <IconLayoutListFilled size={16} />
            <span>بطاقات</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`${styles.viewToggleBtn} ${
              viewMode === "table" ? styles.viewToggleBtnActive : ""
            }`}
            title="عرض كجدول"
          >
            <IconColumns3Filled size={16} />
            <span>جدول</span>
          </button>
        </div>
      </div>
    </div>
  );
}
