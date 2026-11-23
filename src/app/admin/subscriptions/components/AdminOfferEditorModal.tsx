"use client";

import React from "react";
import styles from "../subscriptions.module.css";
import { OfferFormState, OpenPageAccessOffer, PROTECTED_PAGE_OPTIONS } from "../types";

interface AdminOfferEditorModalProps {
  isOpen: boolean;
  offer: OpenPageAccessOffer | null;
  form: OfferFormState;
  setForm: React.Dispatch<React.SetStateAction<OfferFormState>>;
  saving: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminOfferEditorModal({
  isOpen,
  offer,
  form,
  setForm,
  saving,
  onClose,
  onSubmit,
}: AdminOfferEditorModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      data-modal-overlay="true"
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {offer
              ? "⚙️ تعديل عرض فتح الصفحة"
              : "🎁 إضافة عرض فتح صفحة مدفوعة مجاناً"}
          </h3>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="إغلاق"
          >
            <i className="bx bx-x" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>عنوان العرض الترويجي</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={styles.formInput}
                placeholder="مثال: إتاحة خدمة ازاي اروح مجاناً بمناسبة التحديث"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>الصفحة أو الخدمة المستهدفة</label>
              <select
                value={form.target_page}
                onChange={(e) => setForm({ ...form, target_page: e.target.value })}
                className={styles.formSelect}
                style={{ fontWeight: 700 }}
              >
                {PROTECTED_PAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration presets */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>مدة الفتح المجاني</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                {[
                  { label: "24 ساعة", days: 1 },
                  { label: "3 أيام", days: 3 },
                  { label: "أسبوع", days: 7 },
                  { label: "أسبوعين", days: 14 },
                  { label: "شهر", days: 30 },
                ].map((preset) => (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        duration_type: "preset",
                        duration_preset_days: preset.days,
                      })
                    }
                    className={`${styles.quickDurationBtn} ${
                      form.duration_type === "preset" &&
                      form.duration_preset_days === preset.days
                        ? styles.quickDurationBtnActive
                        : ""
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, duration_type: "custom" })}
                  className={`${styles.quickDurationBtn} ${
                    form.duration_type === "custom"
                      ? styles.quickDurationBtnActive
                      : ""
                  }`}
                >
                  تاريخ مخصص
                </button>
              </div>

              {form.duration_type === "custom" && (
                <div>
                  <label className={styles.formLabel} style={{ fontSize: "0.8rem" }}>
                    تاريخ انتهاء العرض
                  </label>
                  <input
                    type="date"
                    required
                    value={form.custom_end_date}
                    onChange={(e) =>
                      setForm({ ...form, custom_end_date: e.target.value })
                    }
                    className={styles.formInput}
                  />
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>رسالة البانر الترويجي في أعلى الصفحة</label>
              <textarea
                rows={2}
                value={form.banner_message}
                onChange={(e) => setForm({ ...form, banner_message: e.target.value })}
                className={styles.formTextarea}
                placeholder="🎉 هذه الخدمة مفتوحة الآن مجاناً لجميع المستخدمين والزوار لفترة محدودة!"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                background: "var(--bg-secondary, rgba(255, 255, 255, 0.05))",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.08))",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  style={{ width: "16px", height: "16px", accentColor: "#10b981" }}
                />
                <span>تفعيل العرض فور الحفظ</span>
              </label>

              {!offer && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary, #94a3b8)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.send_broadcast}
                    onChange={(e) =>
                      setForm({ ...form, send_broadcast: e.target.checked })
                    }
                    style={{ width: "16px", height: "16px", accentColor: "#6366f1" }}
                  />
                  <span>إرسال إشعار ترويجي فوري لجميع المستخدمين</span>
                </label>
              )}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onClose}
              disabled={saving}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={saving}
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                borderColor: "transparent",
              }}
            >
              <i className="bx bx-save" />
              <span>{saving ? "جاري الحفظ..." : "حفظ وتفعيل العرض"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
