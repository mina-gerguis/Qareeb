"use client";

import React from "react";
import styles from "../admin-maintenance.module.css";
import { SITE_PAGES_LIST } from "@/lib/maintenance";
import { PRESET_TEMPLATES } from "../constants";
import { PresetType, MaintenanceItem } from "../types";

interface MaintenanceFormProps {
  selectedPath: string;
  setSelectedPath: (path: string) => void;
  customPath: string;
  setCustomPath: (path: string) => void;
  title: string;
  setTitle: (title: string) => void;
  message: string;
  setMessage: (message: string) => void;
  isIndefinite: boolean;
  setIsIndefinite: (isIndefinite: boolean) => void;
  estimatedEnd: string;
  setEstimatedEnd: (date: string) => void;
  isSaving: boolean;
  onApplyPreset: (type: PresetType) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenPreview: (item: MaintenanceItem) => void;
}

export default function MaintenanceForm({
  selectedPath,
  setSelectedPath,
  customPath,
  setCustomPath,
  title,
  setTitle,
  message,
  setMessage,
  isIndefinite,
  setIsIndefinite,
  estimatedEnd,
  setEstimatedEnd,
  isSaving,
  onApplyPreset,
  onSubmit,
  onOpenPreview,
}: MaintenanceFormProps) {
  const handlePreview = () => {
    const targetPath = selectedPath === "custom" ? customPath : selectedPath;
    onOpenPreview({
      id: "preview",
      page_path: targetPath || "/places",
      title,
      message,
      is_active: true,
      estimated_end:
        !isIndefinite && estimatedEnd ? new Date(estimatedEnd).toISOString() : null,
    });
  };

  return (
    <div className={styles.sectionCard}>
      <div className={styles.cardHeader}>
        <div
          className={styles.cardIcon}
          style={{ background: "rgba(234, 88, 12, 0.15)", color: "#ea580c" }}
        >
          <i className="bx bx-plus-circle" />
        </div>
        <div>
          <h2 className={styles.cardTitle}>تفعيل صيانة لصفحة</h2>
          <p className={styles.cardSubtitle}>
            اختر أي صفحة في الموقع وحدد رسالة الصيانة وموعد الإتاحة.
          </p>
        </div>
      </div>

      <div className={styles.cardBody}>
        <form onSubmit={onSubmit}>
          {/* Target Page Select */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span>
                الصفحة المراد قفلها / صيانتها
                <span className={styles.requiredAsterisk}>*</span>
              </span>
            </label>
            <select
              className={styles.selectInput}
              value={selectedPath}
              onChange={(e) => setSelectedPath(e.target.value)}
            >
              <optgroup label="خيارات عامة">
                <option value="all">🌐 كامل الموقع (جميع الصفحات)</option>
                <option value="custom">✏️ مسار مخصص (Custom Route)</option>
              </optgroup>

              <optgroup label="المواصلات وخطوط السير">
                {SITE_PAGES_LIST.filter((p) => p.category === "مواصلات").map((p) => (
                  <option key={p.path} value={p.path}>
                    {p.label} ({p.path})
                  </option>
                ))}
              </optgroup>

              <optgroup label="الخدمات والأماكن">
                {SITE_PAGES_LIST.filter((p) => p.category === "خدمات وأماكن").map((p) => (
                  <option key={p.path} value={p.path}>
                    {p.label} ({p.path})
                  </option>
                ))}
              </optgroup>

              <optgroup label="الصفحات العامة والمعلومات">
                {SITE_PAGES_LIST.filter((p) => p.category === "صفحات عامة").map((p) => (
                  <option key={p.path} value={p.path}>
                    {p.label} ({p.path})
                  </option>
                ))}
              </optgroup>

              <optgroup label="الحسابات والمستخدمين">
                {SITE_PAGES_LIST.filter((p) => p.category === "حسابات ومستخدمين").map((p) => (
                  <option key={p.path} value={p.path}>
                    {p.label} ({p.path})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Custom Path (if selected) */}
          {selectedPath === "custom" && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>
                  أدخل مسار الصفحة المخصصة
                  <span className={styles.requiredAsterisk}>*</span>
                </span>
              </label>
              <input
                type="text"
                className={styles.textInput}
                required
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="مثال: /some-new-service أو /secret-feature"
                dir="ltr"
              />
            </div>
          )}

          {/* Preset Quick Templates */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-[var(--text-secondary)] block mb-2">
              قوالب نصوص سريعة
            </span>
            <div className={styles.presetChipsWrapper}>
              {PRESET_TEMPLATES.map((preset) => {
                let presetClass = styles.presetUpgrade;
                if (preset.id === "db") presetClass = styles.presetDb;
                if (preset.id === "emergency") presetClass = styles.presetEmergency;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onApplyPreset(preset.id)}
                    className={`${styles.presetChip} ${presetClass}`}
                  >
                    <i className={preset.icon} />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span>
                عنوان شاشة الصيانة
                <span className={styles.requiredAsterisk}>*</span>
              </span>
            </label>
            <input
              type="text"
              className={styles.textInput}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: الصفحة قيد الصيانة والتحديث"
            />
          </div>

          {/* Message */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span>
                تفاصيل الرسالة التي ستظهر للمستخدمين
                <span className={styles.requiredAsterisk}>*</span>
              </span>
            </label>
            <textarea
              className={styles.textArea}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب التوضيح الذي يظهر للزائر عند محاولة دخول الصفحة..."
            />
          </div>

          {/* Indefinite / Countdown Toggle */}
          <div className={styles.formDivider} />
          <div className="flex flex-col gap-3 mb-4">
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={isIndefinite}
                onChange={(e) => setIsIndefinite(e.target.checked)}
              />
              <span>صيانة مفتوحة (حتى يقوم الإدمن بإلغائها يدوياً دون عد تنازلي)</span>
            </label>

            {!isIndefinite && (
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label className="text-xs font-bold text-amber-500 mb-1.5 block">
                  تاريخ ووقت الانتهاء المتوقع (سيظهر عد تنازلي حي للزوار):
                </label>
                <input
                  type="datetime-local"
                  className={styles.textInput}
                  required={!isIndefinite}
                  value={estimatedEnd}
                  onChange={(e) => setEstimatedEnd(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handlePreview}
              className={styles.previewBtn}
            >
              <i className="bx bx-show text-lg" />
              <span>معاينة شاشة الزوار</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className={styles.submitBtn}
            >
              {isSaving ? (
                <>
                  <i className="bx bx-loader-alt animate-spin text-lg" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <i className="bx bx-lock-alt text-lg" />
                  <span>قفل الصفحة وتفعيل الصيانة</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
