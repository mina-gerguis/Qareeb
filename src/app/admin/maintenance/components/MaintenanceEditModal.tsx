"use client";

import React, { useEffect } from "react";
import styles from "../admin-maintenance.module.css";
import { MaintenanceItem } from "../types";
import { getPageInfo } from "@/lib/maintenance";

interface MaintenanceEditModalProps {
  editingItem: MaintenanceItem | null;
  setEditingItem: (item: MaintenanceItem | null) => void;
  isSaving: boolean;
  onSave: () => void;
}

export default function MaintenanceEditModal({
  editingItem,
  setEditingItem,
  isSaving,
  onSave,
}: MaintenanceEditModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditingItem(null);
    };
    if (editingItem) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingItem, setEditingItem]);

  if (!editingItem) return null;

  const pageInfo = getPageInfo(editingItem.page_path);

  return (
    <div
      className={styles.modalBackdrop}
      onClick={() => setEditingItem(null)}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderTitleGroup}>
            <div className={styles.modalHeaderIcon}>
              <i className="bx bx-edit" />
            </div>
            <div>
              <h3 className={styles.modalTitle}>
                تعديل بيانات صيانة: {pageInfo.label}
              </h3>
              <p className={styles.modalSubtitle}>{editingItem.page_path}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditingItem(null)}
            className={styles.modalCloseBtn}
            aria-label="إغلاق"
          >
            <i className="bx bx-x text-2xl" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-4">
          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label className={styles.formLabel}>عنوان الصيانة</label>
            <input
              type="text"
              className={styles.textInput}
              value={editingItem.title}
              onChange={(e) =>
                setEditingItem({ ...editingItem, title: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label className={styles.formLabel}>نص وتفاصيل الرسالة</label>
            <textarea
              className={styles.textArea}
              value={editingItem.message}
              onChange={(e) =>
                setEditingItem({ ...editingItem, message: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label className={styles.formLabel}>تاريخ ووقت الانتهاء (اختياري)</label>
            <input
              type="datetime-local"
              className={styles.textInput}
              value={
                editingItem.estimated_end
                  ? new Date(editingItem.estimated_end).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  estimated_end: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                })
              }
            />
          </div>

          <div>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={editingItem.is_active}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, is_active: e.target.checked })
                }
              />
              <span>تفعيل وضع الصيانة حالياً (قفل الصفحة عن الزوار)</span>
            </label>
          </div>

          {/* Modal Buttons */}
          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className={styles.modalCancelBtn}
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className={styles.modalSubmitBtn}
            >
              {isSaving ? (
                <>
                  <i className="bx bx-loader-alt animate-spin text-lg" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <i className="bx bx-check text-lg" />
                  <span>حفظ التعديلات</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
