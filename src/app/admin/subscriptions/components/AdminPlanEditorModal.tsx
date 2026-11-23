"use client";

import React from "react";
import styles from "../subscriptions.module.css";
import { PlanFormState, SubscriptionPlan } from "../types";

interface AdminPlanEditorModalProps {
  isOpen: boolean;
  plan: SubscriptionPlan | null;
  form: PlanFormState;
  setForm: React.Dispatch<React.SetStateAction<PlanFormState>>;
  updating: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminPlanEditorModal({
  isOpen,
  plan,
  form,
  setForm,
  updating,
  onClose,
  onSubmit,
}: AdminPlanEditorModalProps) {
  if (!isOpen || !plan) return null;

  return (
    <div
      className={styles.modalOverlay}
      data-modal-overlay="true"
      onClick={onClose}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>⚙️ تعديل باقة: {plan.name}</h3>
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
              <label className={styles.formLabel}>اسم الباقة</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>السعر الشهري (ج.م)</label>
                <input
                  type="number"
                  required
                  min="0"
                  disabled={plan.id === "free"}
                  value={form.price_monthly}
                  onChange={(e) =>
                    setForm({ ...form, price_monthly: Number(e.target.value) })
                  }
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>السعر السنوي (ج.م)</label>
                <input
                  type="number"
                  required
                  min="0"
                  disabled={plan.id === "free"}
                  value={form.price_yearly}
                  onChange={(e) =>
                    setForm({ ...form, price_yearly: Number(e.target.value) })
                  }
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>المميزات (ميزة واحدة في كل سطر)</label>
              <textarea
                rows={5}
                value={form.featuresText}
                onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                className={styles.formTextarea}
                placeholder="ميزة 1&#10;ميزة 2&#10;ميزة 3"
              />
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
              <span>{updating ? "جاري التحديث..." : "حفظ التغييرات"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
