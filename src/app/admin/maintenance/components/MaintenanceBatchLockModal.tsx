"use client";

import React, { useEffect } from "react";
import styles from "../admin-maintenance.module.css";
import { SITE_PAGES_LIST } from "@/lib/maintenance";

interface MaintenanceBatchLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  excludedPaths: string[];
  setExcludedPaths: (paths: string[]) => void;
  exceptSearchTerm: string;
  setExceptSearchTerm: (term: string) => void;
  exceptTitle: string;
  setExceptTitle: (title: string) => void;
  exceptMessage: string;
  setExceptMessage: (msg: string) => void;
  exceptIsIndefinite: boolean;
  setExceptIsIndefinite: (val: boolean) => void;
  exceptEstimatedEnd: string;
  setExceptEstimatedEnd: (date: string) => void;
  onToggleExcludePath: (path: string) => void;
  onSelectAllExceptions: () => void;
  onClearAllExceptions: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

export default function MaintenanceBatchLockModal({
  isOpen,
  onClose,
  excludedPaths,
  setExcludedPaths,
  exceptSearchTerm,
  setExceptSearchTerm,
  exceptTitle,
  setExceptTitle,
  exceptMessage,
  setExceptMessage,
  exceptIsIndefinite,
  setExceptIsIndefinite,
  exceptEstimatedEnd,
  setExceptEstimatedEnd,
  onToggleExcludePath,
  onSelectAllExceptions,
  onClearAllExceptions,
  onSubmit,
  isSaving,
}: MaintenanceBatchLockModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validPages = SITE_PAGES_LIST.filter((p) => p.path !== "all");
  const filteredModalPages = validPages.filter((p) => {
    if (!exceptSearchTerm.trim()) return true;
    const q = exceptSearchTerm.toLowerCase();
    return (
      p.label.toLowerCase().includes(q) ||
      p.path.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const lockedCount = validPages.length - excludedPaths.length;
  const openCount = excludedPaths.length;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.modalBox}
        style={{ maxWidth: "680px", maxHeight: "92vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderTitleGroup}>
            <div className={styles.modalHeaderIcon}>
              <i className="bx bx-shield-quarter" />
            </div>
            <div>
              <h3 className={styles.modalTitle}>
                قفل جميع الصفحات ما عدا صفحات محددة
              </h3>
              <p className={styles.modalSubtitle}>
                حدد الصفحة أو الصفحات التي تريد استثناءها وإبقائها مفتوحة للزوار.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.modalCloseBtn}
            aria-label="إغلاق"
          >
            <i className="bx bx-x text-2xl" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Exceptions Selection Toolbar */}
          <div>
            <div className={styles.exceptToolbar}>
              <label className={styles.formLabel} style={{ margin: 0 }}>
                اختر الصفحات المستثناة (التي ستظل مفتوحة للزوار):
              </label>
              <div className={styles.exceptQuickActions}>
                <button
                  type="button"
                  onClick={() => setExcludedPaths(["/"])}
                  className={styles.quickPillBtn}
                >
                  الرئيسية فقط
                </button>
                <button
                  type="button"
                  onClick={onSelectAllExceptions}
                  className={styles.quickPillBtn}
                >
                  تحديد الكل
                </button>
                <button
                  type="button"
                  onClick={onClearAllExceptions}
                  className={styles.quickPillBtn}
                >
                  إلغاء التحديد
                </button>
              </div>
            </div>

            {/* Filter Search for pages inside modal */}
            <div className="relative mb-2">
              <i className={`bx bx-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm`} />
              <input
                type="text"
                className={styles.textInput}
                placeholder="ابحث عن صفحة لاستثنائها..."
                value={exceptSearchTerm}
                onChange={(e) => setExceptSearchTerm(e.target.value)}
                style={{ paddingRight: "34px", paddingTop: "7px", paddingBottom: "7px", fontSize: "0.82rem" }}
              />
            </div>

            {/* Exception Items Grid */}
            <div className={styles.exceptionsGrid}>
              {filteredModalPages.map((page) => {
                const isSelected = excludedPaths.includes(page.path);
                return (
                  <div
                    key={page.path}
                    onClick={() => onToggleExcludePath(page.path)}
                    className={`${styles.exceptionItem} ${
                      isSelected ? styles.exceptionItemActive : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by parent onClick
                      style={{ accentColor: "#10b981", cursor: "pointer" }}
                    />
                    <i className={`${page.icon} text-base`} />
                    <span className="truncate flex-1">{page.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Pill Badge */}
          <div className={styles.summaryPillBadge}>
            <div className="flex items-center gap-3">
              <span className="text-red-500 font-bold">
                🔴 سيتم قفل: {lockedCount} صفحة
              </span>
              <span>|</span>
              <span className="text-emerald-500 font-bold">
                🟢 ستبقى مفتوحة: {openCount} صفحة
              </span>
            </div>
          </div>

          {/* Maintenance Title */}
          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label className={styles.formLabel}>
              عنوان رسالة الصيانة للصفحات المقفولة
            </label>
            <input
              type="text"
              className={styles.textInput}
              required
              value={exceptTitle}
              onChange={(e) => setExceptTitle(e.target.value)}
            />
          </div>

          {/* Maintenance Message */}
          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label className={styles.formLabel}>
              تفاصيل الرسالة التي ستظهر للزوار على الصفحات المقفولة
            </label>
            <textarea
              className={styles.textArea}
              required
              value={exceptMessage}
              onChange={(e) => setExceptMessage(e.target.value)}
              style={{ minHeight: "80px" }}
            />
          </div>

          {/* Countdown timer toggle */}
          <div className="border-t border-[var(--border-glass)] pt-3 flex flex-col gap-2.5">
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={exceptIsIndefinite}
                onChange={(e) => setExceptIsIndefinite(e.target.checked)}
              />
              <span>صيانة مفتوحة (دون عد تنازلي محدد)</span>
            </label>

            {!exceptIsIndefinite && (
              <div>
                <label className="text-xs font-bold text-amber-500 mb-1.5 block">
                  تاريخ ووقت الانتهاء المتوقع:
                </label>
                <input
                  type="datetime-local"
                  className={styles.textInput}
                  required={!exceptIsIndefinite}
                  value={exceptEstimatedEnd}
                  onChange={(e) => setExceptEstimatedEnd(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.modalCancelBtn}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving || excludedPaths.length === 0}
              className={styles.modalSubmitBtn}
            >
              {isSaving ? (
                <>
                  <i className="bx bx-loader-alt animate-spin text-lg" />
                  <span>جاري تطبيق القفل...</span>
                </>
              ) : (
                <>
                  <i className="bx bx-lock-alt text-lg" />
                  <span>
                    قفل باقي الصفحات ({lockedCount}) وتفعيل الاستثناء
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
