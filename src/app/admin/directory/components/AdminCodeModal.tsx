"use client";

import React from "react";
import clsx from "clsx";
import { TelecomCodeEntry, TelecomCodeFormData, CompanyKey } from "../types";
import { COMPANY_META, COMPANY_LABELS } from "../constants";
import directoryStyles from "../admin-directory.module.css";
import {
  IconDeviceMobile,
  IconArchiveFilled,
  IconSquareRoundedXFilled,
} from "@tabler/icons-react";

interface AdminCodeModalProps {
  isOpen: boolean;
  editingItem: TelecomCodeEntry | null;
  formData: TelecomCodeFormData;
  isSubmitting?: boolean;
  existingSections: string[];
  onClose: () => void;
  onFormFieldChange: (field: keyof TelecomCodeFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminCodeModal({
  isOpen,
  editingItem,
  formData,
  isSubmitting = false,
  existingSections,
  onClose,
  onFormFieldChange,
  onSubmit,
}: AdminCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div className={directoryStyles.modalOverlay}>
      <div className={directoryStyles.modalContent} style={{ maxWidth: "620px" }}>
        {/* Modal Header */}
        <div className={directoryStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(59, 130, 246, 0.15)",
                color: "#3b82f6",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconDeviceMobile size={18} />
            </span>
            <h3
              style={{
                margin: 0,
                fontSize: "1.2rem",
                fontWeight: "900",
                color: "var(--color-fg)",
              }}
            >
              {editingItem
                ? `تعديل كود: ${editingItem.title}`
                : "إضافة كود خدمة جديد"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={directoryStyles.modalCloseBtn}
            aria-label="إغلاق"
            type="button"
          >
            <IconSquareRoundedXFilled size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit}>
          <div
            className={directoryStyles.modalBody}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "20px",
            }}
          >
            {/* Company & Section */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "14px",
              }}
            >
              {/* Company Selection */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  الشركة <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  required
                  className="input-fields help-select"
                  value={formData.company}
                  onChange={(e) => onFormFieldChange("company", e.target.value)}
                  style={{ width: "100%" }}
                >
                  {(Object.keys(COMPANY_META) as CompanyKey[]).map((k) => (
                    <option key={k} value={k}>
                      {COMPANY_LABELS[k]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Selection */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  اسم القسم <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  required
                  className="input-fields help-select"
                  value={formData.sectionSelect}
                  onChange={(e) =>
                    onFormFieldChange("sectionSelect", e.target.value)
                  }
                  style={{ width: "100%" }}
                >
                  <option value="">اختر القسم...</option>
                  {existingSections.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                  <option value="__custom__">+ إضافة قسم جديد...</option>
                </select>
              </div>
            </div>

            {/* Custom Section Inputs */}
            {formData.sectionSelect === "__custom__" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div>
                  <input
                    required
                    className="input-fields"
                    placeholder="اسم القسم الجديد (مثال: الشحن والرصيد)"
                    value={formData.customSection}
                    onChange={(e) =>
                      onFormFieldChange("customSection", e.target.value)
                    }
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <input
                    className="input-fields"
                    style={{ direction: "ltr", textAlign: "right", width: "100%" }}
                    placeholder="كود الأيقونة (bx-wallet أو fa-solid fa-bolt)"
                    value={formData.customSectionIcon}
                    onChange={(e) =>
                      onFormFieldChange("customSectionIcon", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* Service Title */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "6px",
                }}
              >
                نوع الخدمة / عنوان الكود <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                required
                type="text"
                placeholder="مثال: الاستعلام عن الرصيد، كود تجديد باقة فليكس"
                className="input-fields"
                value={formData.title}
                onChange={(e) => onFormFieldChange("title", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Code Value & Note */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "14px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  الكود الرقمي <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="*858# أو *100#"
                  className="input-fields"
                  style={{ direction: "ltr", textAlign: "right", width: "100%" }}
                  value={formData.code}
                  onChange={(e) => onFormFieldChange("code", e.target.value)}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  ملاحظة للمستخدم (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: اتبع التعليمات الصوتية، متاح مجاناً"
                  className="input-fields"
                  value={formData.note}
                  onChange={(e) => onFormFieldChange("note", e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className={directoryStyles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-cancel"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={clsx("btn btn-primary", isSubmitting && "opacity-50")}
            >
              <IconArchiveFilled size={18} />
              <span>{isSubmitting ? "جاري الحفظ..." : editingItem ? "حفظ التعديلات" : "إضافة الكود"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
