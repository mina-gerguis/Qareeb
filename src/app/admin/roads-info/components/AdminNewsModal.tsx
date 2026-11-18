"use client";

import React from "react";
import clsx from "clsx";
import { RoadNewsItem, NewsFormData } from "../types";
import { NEWS_CATEGORY_OPTIONS, NEWS_SEVERITY_OPTIONS } from "../constants";
import roadsStyles from "../admin-roads-info.module.css";
import { IconArchiveFilled } from "@tabler/icons-react";

interface AdminNewsModalProps {
  isOpen: boolean;
  editingNews: RoadNewsItem | null;
  formData: NewsFormData;
  onClose: () => void;
  onFormFieldChange: (field: keyof NewsFormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminNewsModal({
  isOpen,
  editingNews,
  formData,
  onClose,
  onFormFieldChange,
  onSubmit,
}: AdminNewsModalProps) {
  if (!isOpen) return null;

  return (
    <div className={roadsStyles.modalOverlay}>
      <div className={roadsStyles.modalContent} style={{ maxWidth: "620px" }}>
        {/* Modal Header */}
        <div className={roadsStyles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
            {editingNews ? "تعديل التنبيه المروري" : "إضافة خبر أو تنبيه مروري جديد"}
          </h3>
          <button
            onClick={onClose}
            className="btn-close"
            type="button"
            aria-label="إغلاق"
          >
            <i className="bx bx-x" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={onSubmit} className={roadsStyles.modalBody}>
          {/* Row 1: Title */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              عنوان التنبيه أو الخبر المروري *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => onFormFieldChange("title", e.target.value)}
              className="input-fields"
              style={{ width: "100%" }}
              placeholder="مثال: إغلاق كلي لطريق الإسماعيلية الصحراوي لساعات بسبب الشبورة الكثيفة"
            />
          </div>

          {/* Row 2: Category & Severity */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                تصنيف التنبيه *
              </label>
              <select
                value={formData.category}
                onChange={(e) => onFormFieldChange("category", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
              >
                {NEWS_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                مستوى الأهمية *
              </label>
              <select
                value={formData.severity}
                onChange={(e) => onFormFieldChange("severity", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
              >
                {NEWS_SEVERITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Road Name & Source */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                الطريق المستهدف بالتنبيه
              </label>
              <input
                type="text"
                value={formData.roadName}
                onChange={(e) => onFormFieldChange("roadName", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="مثال: الطريق الدائري أو كافة الطرق السريعة"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                مصدر الخبر
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => onFormFieldChange("source", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="مثال: الإدارة العامة للمرور"
              />
            </div>
          </div>

          {/* Row 4: Summary / Details */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              تفاصيل وتوصيات التنبيه المروري *
            </label>
            <textarea
              required
              rows={4}
              value={formData.summary}
              onChange={(e) => onFormFieldChange("summary", e.target.value)}
              className="input-fields"
              style={{ width: "100%", lineHeight: 1.6 }}
              placeholder="اكتب التوصيات الإرشادية للمواطنين، التحويلات البديلة، وأرقام الطوارئ..."
            />
          </div>

          {/* Row 5: Active Status Switch */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => onFormFieldChange("isActive", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--color-fg)" }}>
                تفعيل ونشر هذا التنبيه فوراً للمستخدمين
              </span>
            </label>
          </div>

          {/* Modal Footer */}
          <div className={roadsStyles.modalFooter} style={{ padding: "16px 0 0 0", marginTop: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <IconArchiveFilled size={18} />
              <span>{editingNews ? "حفظ التعديلات" : "نشر التنبيه"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
