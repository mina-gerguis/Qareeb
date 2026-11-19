"use client";

import React from "react";
import Link from "next/link";
import styles from "../admin-maintenance.module.css";
import { MaintenancePageItem, MaintenanceItem } from "../types";

interface MaintenancePageCardProps {
  page: MaintenancePageItem;
  onQuickToggle: (page: MaintenancePageItem) => void;
  onLockAllExceptThis: (path: string) => void;
  onEdit: (record: MaintenanceItem) => void;
  onPreview: (item: MaintenanceItem) => void;
  onDelete: (id: string) => void;
}

export default function MaintenancePageCard({
  page,
  onQuickToggle,
  onLockAllExceptThis,
  onEdit,
  onPreview,
  onDelete,
}: MaintenancePageCardProps) {
  const isUnder = page.isUnderMaintenance;
  const record = page.record;

  const handlePreviewClick = () => {
    onPreview(
      record || {
        id: "preview",
        page_path: page.path,
        title: `صفحة ${page.label} قيد الصيانة والتحديث`,
        message: `نعمل حالياً على تطوير وتحديث صفحة ${page.label} لتقديم تجربة أفضل.`,
        is_active: true,
        estimated_end: null,
      }
    );
  };

  return (
    <div
      className={`${styles.pageItemCard} ${
        isUnder ? styles.pageItemCardActive : ""
      }`}
    >
      {/* Page Info */}
      <div className={styles.pageItemDetails}>
        <div
          className={styles.pageItemIconBox}
          style={{
            background: isUnder
              ? "rgba(234, 88, 12, 0.18)"
              : "var(--bg-glass-active, rgba(255, 255, 255, 0.05))",
            color: isUnder ? "#ea580c" : "var(--text-secondary, #94a3b8)",
          }}
        >
          <i className={page.icon} />
        </div>

        <div className={styles.pageItemInfo}>
          <div className={styles.pageItemTitleRow}>
            <span className={styles.pageItemLabel}>{page.label}</span>
            <span
              className={`${styles.statusBadge} ${
                isUnder ? styles.statusBadgeActive : styles.statusBadgeInactive
              }`}
            >
              {isUnder ? "🔴 مغلقة للصيانة" : "🟢 مفتوحة للزوار"}
            </span>
          </div>

          <div className={styles.pageItemMetaRow}>
            <span className={styles.pathCode}>{page.path}</span>
            <span>•</span>
            <span className={styles.categoryTag}>{page.category}</span>
            {record?.estimated_end && (
              <>
                <span>•</span>
                <span className={styles.countdownTag}>
                  <i className="bx bx-time-five" />
                  <span>
                    حتى:{" "}
                    {new Date(record.estimated_end).toLocaleString("ar-EG", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </span>
              </>
            )}
          </div>

          {record && isUnder && (
            <div className={styles.messagePreviewBox}>
              <strong>{record.title}:</strong> {record.message}
            </div>
          )}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className={styles.pageItemActions}>
        {/* Fast Toggle Button */}
        <button
          type="button"
          onClick={() => onQuickToggle(page)}
          className={`${styles.quickToggleBtn} ${
            isUnder ? styles.quickToggleUnlock : styles.quickToggleLock
          }`}
          title={isUnder ? "فتح الصفحة للزوار" : "قفل الصفحة للصيانة"}
        >
          <i className={`bx ${isUnder ? "bx-lock-open" : "bx-lock-alt"}`} />
          <span>{isUnder ? "فتح الصفحة" : "قفل للصيانة"}</span>
        </button>

        {/* Lock All Except This Page */}
        <button
          type="button"
          onClick={() => onLockAllExceptThis(page.path)}
          className={styles.iconActionBtn}
          title={`قفل جميع صفحات الموقع وإبقاء صفحة (${page.label}) فقط مفتوحة للزوار`}
          style={{ color: "#818cf8" }}
        >
          <i className="bx bx-shield-quarter" />
        </button>

        {/* Edit Details */}
        {record && (
          <button
            type="button"
            onClick={() => onEdit({ ...record })}
            className={styles.iconActionBtn}
            title="تعديل تفاصيل الصيانة"
          >
            <i className="bx bx-edit" />
          </button>
        )}

        {/* Live Preview Modal */}
        <button
          type="button"
          onClick={handlePreviewClick}
          className={styles.iconActionBtn}
          title="معاينة شاشة الصيانة"
        >
          <i className="bx bx-show" />
        </button>

        {/* Visit Page in New Tab */}
        {page.path !== "all" && (
          <Link
            href={page.path}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconActionBtn}
            title="زيارة الصفحة"
          >
            <i className="bx bx-link-external" />
          </Link>
        )}

        {/* Delete Record */}
        {record && (
          <button
            type="button"
            onClick={() => onDelete(record.id)}
            className={styles.deleteActionBtn}
            title="حذف إعداد الصيانة نهائياً"
          >
            <i className="bx bx-trash" />
          </button>
        )}
      </div>
    </div>
  );
}
