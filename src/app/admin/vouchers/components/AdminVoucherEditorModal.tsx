"use client";

import React from "react";
import styles from "../vouchers.module.css";
import {
  VoucherFormState,
  VoucherItem,
  VoucherRewardType,
  VoucherAudience,
  PromoExpiryMode,
  VOUCHER_REWARD_META,
} from "../types";
import { VOUCHER_FEATURE_OPTIONS, VOUCHER_PAGE_OPTIONS } from "@/lib/vouchers";
import { generateRandomCode } from "../hooks/useAdminVouchers";

interface AdminVoucherEditorModalProps {
  isOpen: boolean;
  editingVoucher: VoucherItem | null;
  form: VoucherFormState;
  setForm: React.Dispatch<React.SetStateAction<VoucherFormState>>;
  formError: string | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminVoucherEditorModal({
  isOpen,
  editingVoucher,
  form,
  setForm,
  formError,
  saving,
  onClose,
  onSubmit,
}: AdminVoucherEditorModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      data-modal-overlay="true"
      onClick={onClose}
    >
      <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{editingVoucher ? "تعديل خصائص القسيمة" : "إنشاء قسيمة / أكواد جديدة"}</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="إغلاق"
            disabled={saving}
          >
            <i className="bx bx-x" />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px 24px", overflowY: "auto", maxHeight: "calc(90vh - 80px)" }}>
          {/* Single vs Batch Mode (Create only) */}
          {!editingVoucher && (
            <div>
              <span className={styles.fieldLabel}>طريقة الإصدار</span>
              <div className={styles.formGrid2}>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, mode: "single" }))}
                  className={styles.rewardTypeCard}
                  style={{
                    borderColor: form.mode === "single" ? "#3b82f6" : undefined,
                    background: form.mode === "single" ? "rgba(59, 130, 246, 0.1)" : undefined,
                  }}
                >
                  <strong style={{ fontSize: "0.86rem" }}>كود واحد (فردي أو متعدد الاستخدام)</strong>
                  <span style={{ fontSize: "0.74rem", color: "var(--text-muted, #94a3b8)" }}>
                    مثالي للحملات العامة أو كود مخصص
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, mode: "batch" }))}
                  className={styles.rewardTypeCard}
                  style={{
                    borderColor: form.mode === "batch" ? "#3b82f6" : undefined,
                    background: form.mode === "batch" ? "rgba(59, 130, 246, 0.1)" : undefined,
                  }}
                >
                  <strong style={{ fontSize: "0.86rem" }}>توليد دفعة أكواد عشوائية (Batch)</strong>
                  <span style={{ fontSize: "0.74rem", color: "var(--text-muted, #94a3b8)" }}>
                    توليد عدة أكواد فريدة بنفس الخصائص دفعة واحدة
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Code / Batch Inputs */}
          {form.mode === "single" ? (
            <div className={styles.formGrid2}>
              <div>
                <label className={styles.fieldLabel}>الكود (حروف وأرقام)</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    dir="ltr"
                    className={styles.inputControl}
                    style={{ fontFamily: "monospace", fontWeight: 700 }}
                    value={form.code}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        code: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""),
                      }))
                    }
                    placeholder="QRB-XXXX"
                  />
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    style={{ padding: "0 12px", flexShrink: 0 }}
                    onClick={() => setForm((f) => ({ ...f, code: generateRandomCode("QRB-") }))}
                    title="توليد كود عشوائي"
                  >
                    <i className="bx bx-refresh" />
                  </button>
                </div>
              </div>
              <div>
                <label className={styles.fieldLabel}>اسم الحملة / الدفعة (اختياري)</label>
                <input
                  type="text"
                  className={styles.inputControl}
                  value={form.batchName}
                  onChange={(e) => setForm((f) => ({ ...f, batchName: e.target.value }))}
                  placeholder="مثال: حملة الشتاء"
                />
              </div>
            </div>
          ) : (
            <div className={styles.formGrid2}>
              <div>
                <label className={styles.fieldLabel}>بادئة الأكواد</label>
                <input
                  type="text"
                  dir="ltr"
                  className={styles.inputControl}
                  style={{ fontFamily: "monospace", fontWeight: 700 }}
                  value={form.batchPrefix}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      batchPrefix: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""),
                    }))
                  }
                />
              </div>
              <div>
                <label className={styles.fieldLabel}>عدد الأكواد المطلوب توليدها</label>
                <input
                  type="number"
                  min={2}
                  max={25}
                  className={styles.inputControl}
                  value={form.batchCount}
                  onChange={(e) => setForm((f) => ({ ...f, batchCount: Number(e.target.value) || 2 }))}
                />
              </div>
            </div>
          )}

          {/* Title & Description */}
          <div>
            <label className={styles.fieldLabel}>عنوان القسيمة</label>
            <input
              type="text"
              className={styles.inputControl}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="مثال: رصيد ترويجي ترحيبي 50 ج.م"
            />
          </div>

          <div>
            <label className={styles.fieldLabel}>وصف توضيحي (اختياري)</label>
            <input
              type="text"
              className={styles.inputControl}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="مثال: يُمنح لجميع المشتركين الجدد بمناسبة التحديث"
            />
          </div>

          {/* Reward Type Selector */}
          <div>
            <span className={styles.fieldLabel}>نوع المكافأة / النتيجة عند الاسترداد</span>
            <div className={styles.rewardTypeGrid}>
              {(Object.keys(VOUCHER_REWARD_META) as VoucherRewardType[]).map((type) => {
                const meta = VOUCHER_REWARD_META[type];
                const selected = form.rewardType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rewardType: type }))}
                    className={styles.rewardTypeCard}
                    style={{
                      borderColor: selected ? meta.accentColor : undefined,
                      background: selected ? meta.accentBg : undefined,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <i
                        className={`bx ${meta.bxIcon}`}
                        style={{ color: meta.accentColor, fontSize: "1.15rem" }}
                      />
                      <strong style={{ fontSize: "0.84rem" }}>{meta.label}</strong>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted, #94a3b8)", lineHeight: 1.45 }}>
                      {meta.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Reward Fields */}
          <div
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(255, 255, 255, 0.02)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {form.rewardType === "main_balance" && (
              <div>
                <label className={styles.fieldLabel}>المبلغ المضاف إلى المحفظة الأساسية (ج.م)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  className={styles.inputControl}
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                />
              </div>
            )}

            {form.rewardType === "promo_balance" && (
              <>
                <div className={styles.formGrid2}>
                  <div>
                    <label className={styles.fieldLabel}>قيمة الرصيد الترويجي (ج.م)</label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      className={styles.inputControl}
                      value={form.amount}
                      onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel}>صلاحية الرصيد الترويجي بعد الاسترداد</label>
                    <select
                      className={styles.inputControl}
                      value={form.promoExpiryMode}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          promoExpiryMode: e.target.value as PromoExpiryMode,
                        }))
                      }
                    >
                      <option value="days_after_redeem">مدة محددة بالأيام</option>
                      <option value="fixed_date">تاريخ انتهاء ثابت</option>
                      <option value="unlimited">غير محدد المدة</option>
                    </select>
                  </div>
                </div>

                {form.promoExpiryMode === "days_after_redeem" && (
                  <div>
                    <label className={styles.fieldLabel}>عدد أيام صلاحية الرصيد بعد التفعيل</label>
                    <input
                      type="number"
                      min={1}
                      className={styles.inputControl}
                      value={form.promoExpiryDays}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, promoExpiryDays: Number(e.target.value) || 1 }))
                      }
                    />
                  </div>
                )}

                {form.promoExpiryMode === "fixed_date" && (
                  <div>
                    <label className={styles.fieldLabel}>تاريخ انتهاء الرصيد الترويجي</label>
                    <input
                      type="date"
                      className={styles.inputControl}
                      value={form.promoExpiryDate}
                      onChange={(e) => setForm((f) => ({ ...f, promoExpiryDate: e.target.value }))}
                    />
                  </div>
                )}
              </>
            )}

            {form.rewardType === "feature_unlock" && (
              <div>
                <label className={styles.fieldLabel}>اختر الميزة أو الخدمة المراد فتحها</label>
                <select
                  className={styles.inputControl}
                  value={form.featureKey}
                  onChange={(e) => setForm((f) => ({ ...f, featureKey: e.target.value }))}
                >
                  {VOUCHER_FEATURE_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {form.rewardType === "page_access" && (
              <>
                <div>
                  <label className={styles.fieldLabel}>الصفحة أو القسم المستهدف</label>
                  <select
                    className={styles.inputControl}
                    value={form.targetPage}
                    onChange={(e) => setForm((f) => ({ ...f, targetPage: e.target.value }))}
                  >
                    {VOUCHER_PAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGrid2}>
                  <div>
                    <label className={styles.fieldLabel}>مدة فتح القسم</label>
                    <input
                      type="number"
                      min={1}
                      className={styles.inputControl}
                      value={form.accessDurationValue}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          accessDurationValue: Number(e.target.value) || 1,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel}>وحدة المدة</label>
                    <select
                      className={styles.inputControl}
                      value={form.accessDurationUnit}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          accessDurationUnit: e.target.value as "hours" | "days",
                        }))
                      }
                    >
                      <option value="days">أيام</option>
                      <option value="hours">ساعات</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Usage & Validity Limits */}
          <div className={styles.formGrid2}>
            <div>
              <label className={styles.fieldLabel}>الحد الأقصى للاستخدام الكلي</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="number"
                  min={1}
                  disabled={form.unlimitedUses}
                  className={styles.inputControl}
                  value={form.maxUses}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, maxUses: Number(e.target.value) || 1 }))
                  }
                />
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "0.78rem",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.unlimitedUses}
                    onChange={(e) => setForm((f) => ({ ...f, unlimitedUses: e.target.checked }))}
                  />
                  غير محدود
                </label>
              </div>
            </div>

            <div>
              <label className={styles.fieldLabel}>تاريخ انتهاء صلاحية الكود</label>
              <input
                type="date"
                className={styles.inputControl}
                value={form.expiresAt}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              />
            </div>
          </div>

          <div className={styles.formGrid2}>
            <div>
              <label className={styles.fieldLabel}>الفئة المستهدفة</label>
              <select
                className={styles.inputControl}
                value={form.audience}
                onChange={(e) =>
                  setForm((f) => ({ ...f, audience: e.target.value as VoucherAudience }))
                }
              >
                <option value="all">جميع المستخدمين</option>
                <option value="new_users">المستخدمون الجدد فقط</option>
                <option value="free_tier">أصحاب الباقة المجانية</option>
                <option value="specific_users">مستخدمون محددون</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "8px" }}>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                تفعيل القسيمة مباشرة بعد الحفظ
              </label>
            </div>
          </div>

          {formError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                fontSize: "0.84rem",
                fontWeight: 700,
              }}
            >
              {formError}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onClose}
              disabled={saving}
            >
              إلغاء
            </button>
            <button type="submit" disabled={saving} className={styles.primaryBtn}>
              <i className="bx bx-save" />
              <span>{saving ? "جاري الحفظ..." : editingVoucher ? "حفظ التعديلات" : "إصدار القسيمة"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
