"use client";

import React from "react";
import styles from "../subscriptions.module.css";
import { UserFormState, UserProfile } from "../types";

interface AdminUserSubscriptionModalProps {
  isOpen: boolean;
  user: UserProfile | null;
  form: UserFormState;
  setForm: React.Dispatch<React.SetStateAction<UserFormState>>;
  updating: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onAddPresetDays: (days: number) => void;
}

export function AdminUserSubscriptionModal({
  isOpen,
  user,
  form,
  setForm,
  updating,
  onClose,
  onSubmit,
  onAddPresetDays,
}: AdminUserSubscriptionModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div
      className={styles.modalOverlay}
      data-modal-overlay="true"
      onClick={onClose}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            ⚙️ تعديل اشتراك: {user.full_name || user.username || "مستخدم"}
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
            {/* User Meta Card */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "0.85rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div>
                اسم المستخدم: <strong>@{user.username || "بدون_يوزر"}</strong>
              </div>
              <div>
                الهاتف: <strong>{user.phone || "غير متوفر"}</strong>
              </div>
              <div>
                البريد: <strong>{user.email || "غير متوفر"}</strong>
              </div>
            </div>

            {/* Tier Select */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>باقة الاشتراك</label>
              <select
                value={form.subscription_tier}
                onChange={(e) => {
                  const tier = e.target.value;
                  setForm({
                    ...form,
                    subscription_tier: tier,
                    subscription_period:
                      tier === "free"
                        ? ""
                        : tier === "mishwar"
                        ? "daily"
                        : form.subscription_period === "daily"
                        ? "monthly"
                        : form.subscription_period || "monthly",
                  });
                }}
                className={styles.formSelect}
              >
                <option value="free">المجانية</option>
                <option value="mishwar">باقة المشوار (9 ج.م)</option>
                <option value="silver">الباقة الفضية (40 ج.م)</option>
                <option value="gold">الباقة الذهبية (60 ج.م)</option>
              </select>
            </div>

            {/* Period Select */}
            {form.subscription_tier !== "free" && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>فترة الاشتراك</label>
                <select
                  value={form.subscription_period || ""}
                  onChange={(e) => setForm({ ...form, subscription_period: e.target.value })}
                  className={styles.formSelect}
                >
                  <option value="daily">يومياً (24 ساعة)</option>
                  <option value="monthly">شهرياً</option>
                  <option value="yearly">سنوياً</option>
                </select>
              </div>
            )}

            {/* Status Select */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>حالة الاشتراك</label>
              <select
                value={form.subscription_status}
                onChange={(e) => setForm({ ...form, subscription_status: e.target.value })}
                className={styles.formSelect}
              >
                <option value="active">نشط (فعال)</option>
                <option value="expired">منتهي الصلاحية</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>

            {/* Quick Presets */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>اختصارات تمديد المدة السريعة</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => onAddPresetDays(7)}
                  className={styles.quickDurationBtn}
                >
                  + 7 أيام
                </button>
                <button
                  type="button"
                  onClick={() => onAddPresetDays(30)}
                  className={styles.quickDurationBtn}
                >
                  + شهر (30 يوم)
                </button>
                <button
                  type="button"
                  onClick={() => onAddPresetDays(365)}
                  className={styles.quickDurationBtn}
                >
                  + سنة (365 يوم)
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, subscription_status: "expired" })}
                  className={styles.quickDurationBtn}
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "#f87171",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                  }}
                >
                  تعيين كمنتهي
                </button>
              </div>
            </div>

            {/* Start and End Dates */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>تاريخ البدء</label>
                <input
                  type="date"
                  value={form.subscription_start}
                  onChange={(e) => setForm({ ...form, subscription_start: e.target.value })}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>تاريخ الانتهاء</label>
                <input
                  type="date"
                  required={form.subscription_tier !== "free"}
                  value={form.subscription_end}
                  onChange={(e) => setForm({ ...form, subscription_end: e.target.value })}
                  className={styles.formInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onClose}
              disabled={updating}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={updating}
            >
              <i className="bx bx-save" />
              <span>{updating ? "جاري التحديث..." : "حفظ التعديلات والترقية"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
