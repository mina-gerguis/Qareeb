"use client";

import React from "react";
import clsx from "clsx";
import { PhoneEntry, PhoneFormData } from "../types";
import directoryStyles from "../admin-directory.module.css";
import {
  IconPhoneCall,
  IconArchiveFilled,
  IconSquareRoundedXFilled,
} from "@tabler/icons-react";

interface AdminPhoneModalProps {
  isOpen: boolean;
  editingItem: PhoneEntry | null;
  formData: PhoneFormData;
  isSubmitting?: boolean;
  existingSpecialties: string[];
  onClose: () => void;
  onFormFieldChange: (field: keyof PhoneFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminPhoneModal({
  isOpen,
  editingItem,
  formData,
  isSubmitting = false,
  existingSpecialties,
  onClose,
  onFormFieldChange,
  onSubmit,
}: AdminPhoneModalProps) {
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
              <IconPhoneCall size={18} />
            </span>
            <h3
              style={{
                margin: 0,
                fontSize: "1.2rem",
                fontWeight: "900",
                color: "var(--color-fg)",
              }}
            >
              {editingItem ? `تعديل جهة: ${editingItem.name}` : "إضافة رقم خدمي جديد"}
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
            {/* Name */}
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
                الاسم والجهة <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                required
                type="text"
                placeholder="مثال: الإسعاف المصري، طوارئ الكهرباء، المصرية للاتصالات"
                className="input-fields"
                value={formData.name}
                onChange={(e) => onFormFieldChange("name", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Specialty Selection & Custom */}
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
                التخصص الخدمي <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                required
                className="input-fields help-select"
                value={formData.specialtySelect}
                onChange={(e) => onFormFieldChange("specialtySelect", e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">اختر التخصص...</option>
                {existingSpecialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
                <option value="__custom__">+ إضافة تخصص جديد...</option>
              </select>

              {formData.specialtySelect === "__custom__" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <div>
                    <input
                      required
                      className="input-fields"
                      placeholder="اسم التخصص الجديد (مثال: مستشفيات)"
                      value={formData.customSpecialty}
                      onChange={(e) =>
                        onFormFieldChange("customSpecialty", e.target.value)
                      }
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <input
                      className="input-fields"
                      style={{ direction: "ltr", textAlign: "right", width: "100%" }}
                      placeholder="كود الأيقونة (bx-plus-medical)"
                      value={formData.customIcon}
                      onChange={(e) =>
                        onFormFieldChange("customIcon", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Phone Number & Logo URL */}
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
                  رقم الهاتف أو الخط الساخن <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="123 أو 19xxx أو 02xxxxxxx"
                  className="input-fields"
                  style={{ direction: "ltr", textAlign: "right", width: "100%" }}
                  value={formData.phone_number}
                  onChange={(e) =>
                    onFormFieldChange("phone_number", e.target.value)
                  }
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
                  رابط اللوجو (اختياري)
                </label>
                <input
                  type="url"
                  placeholder="https://... أو /images/..."
                  className="input-fields"
                  style={{ direction: "ltr", textAlign: "right", width: "100%" }}
                  value={formData.logo_url}
                  onChange={(e) => onFormFieldChange("logo_url", e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
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
                الوصف والملاحظات (اختياري)
              </label>
              <textarea
                rows={3}
                placeholder="تفاصيل ساعات العمل أو مناطق الخدمة أو أرقام إضافية..."
                className="input-fields"
                style={{
                  width: "100%",
                  resize: "vertical",
                  padding: "10px 12px",
                  height: "auto",
                }}
                value={formData.description}
                onChange={(e) => onFormFieldChange("description", e.target.value)}
              />
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
              <span>{isSubmitting ? "جاري الحفظ..." : editingItem ? "حفظ التعديلات" : "إضافة الرقم"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
