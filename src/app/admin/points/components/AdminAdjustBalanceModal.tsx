"use client";

import React from "react";
import styles from "../admin-points.module.css";
import { UserProfile, ActionType, AssetType, PromoExpiryOption, StatusMessage } from "../types";

interface AdminAdjustBalanceModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionType;
  onActionTypeChange: (type: ActionType) => void;
  assetType: AssetType;
  onAssetTypeChange: (type: AssetType) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  promoExpiryOption: PromoExpiryOption;
  onPromoExpiryOptionChange: (option: PromoExpiryOption) => void;
  promoCustomExpiryDate: string;
  onPromoCustomExpiryDateChange: (date: string) => void;
  promoReason: string;
  onPromoReasonChange: (reason: string) => void;
  updating: boolean;
  statusMessage: StatusMessage | null;
  onSave: () => void;
}

export function AdminAdjustBalanceModal({
  user,
  isOpen,
  onClose,
  actionType,
  onActionTypeChange,
  assetType,
  onAssetTypeChange,
  amount,
  onAmountChange,
  promoExpiryOption,
  onPromoExpiryOptionChange,
  promoCustomExpiryDate,
  onPromoCustomExpiryDateChange,
  promoReason,
  onPromoReasonChange,
  updating,
  statusMessage,
  onSave,
}: AdminAdjustBalanceModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "520px" }}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>تحديث النقاط والأرصدة</h3>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            disabled={updating}
          >
            <i className="bx bx-x" />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* User Profile Card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "rgba(255, 255, 255, 0.03)",
              padding: "12px 16px",
              borderRadius: "14px",
              border: "1px solid var(--border-glass)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(99, 102, 241, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--color-primary)",
                fontSize: "1.3rem",
                color: "var(--color-primary)",
                flexShrink: 0,
              }}
            >
              <i className="bx bx-user" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4
                style={{
                  margin: 0,
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "var(--color-fg)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.full_name || "بدون اسم"}
              </h4>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  direction: "ltr",
                  textAlign: "right",
                }}
              >
                @{user.username || "بدون_يوزر"}
              </div>
            </div>
          </div>

          {/* Current Values Indicators (3 columns) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
            }}
          >
            <div
              style={{
                background: "rgba(251, 191, 36, 0.06)",
                border: "1px solid rgba(251, 191, 36, 0.2)",
                borderRadius: "12px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "#fbbf24",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  marginBottom: "4px",
                  fontWeight: 700,
                }}
              >
                <i className="bx bxs-coin" /> النقاط
              </span>
              <strong
                style={{
                  fontSize: "1.05rem",
                  color: "#fbbf24",
                  fontWeight: 800,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {user.points || 0}
              </strong>
            </div>

            <div
              style={{
                background: "rgba(16, 185, 129, 0.06)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "12px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  marginBottom: "4px",
                  fontWeight: 700,
                }}
              >
                <i className="bx bx-wallet" /> الأساسي
              </span>
              <strong
                style={{
                  fontSize: "1.05rem",
                  color: "#10b981",
                  fontWeight: 800,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {(user.balance || 0).toFixed(2)}
              </strong>
            </div>

            <div
              style={{
                background: "rgba(99, 102, 241, 0.08)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                borderRadius: "12px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "#818cf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  marginBottom: "4px",
                  fontWeight: 700,
                }}
              >
                <i className="bx bx-gift" /> الترويجي
              </span>
              <strong
                style={{
                  fontSize: "1.05rem",
                  color: "#818cf8",
                  fontWeight: 800,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {(user.promo_balance || 0).toFixed(2)}
              </strong>
            </div>
          </div>

          {/* Row 1: Action Type */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.84rem",
                color: "var(--text-secondary)",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              نوع العملية:
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => onActionTypeChange("deposit")}
                className="btn"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  background: actionType === "deposit" ? "#10b981" : "transparent",
                  borderColor: actionType === "deposit" ? "#10b981" : "var(--border-glass)",
                  color: actionType === "deposit" ? "#fff" : "var(--text-secondary)",
                  fontWeight: 700,
                  padding: "10px",
                  gap: "6px",
                  borderRadius: "10px",
                }}
              >
                <i className="bx bx-down-arrow-circle" /> إيداع / إضافة
              </button>
              <button
                type="button"
                onClick={() => onActionTypeChange("withdraw")}
                className="btn"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  background: actionType === "withdraw" ? "#ef4444" : "transparent",
                  borderColor: actionType === "withdraw" ? "#ef4444" : "var(--border-glass)",
                  color: actionType === "withdraw" ? "#fff" : "var(--text-secondary)",
                  fontWeight: 700,
                  padding: "10px",
                  gap: "6px",
                  borderRadius: "10px",
                }}
              >
                <i className="bx bx-up-arrow-circle" /> سحب / خصم
              </button>
            </div>
          </div>

          {/* Row 2: Target Asset */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.84rem",
                color: "var(--text-secondary)",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              الرصيد المستهدف:
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => onAssetTypeChange("points")}
                className="btn"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  background: assetType === "points" ? "rgba(251, 191, 36, 0.16)" : "transparent",
                  borderColor: assetType === "points" ? "#fbbf24" : "var(--border-glass)",
                  color: assetType === "points" ? "#fbbf24" : "var(--text-secondary)",
                  fontWeight: 700,
                  padding: "9px",
                  fontSize: "0.82rem",
                  gap: "5px",
                  borderRadius: "10px",
                }}
              >
                <i className="bx bxs-coin" /> النقاط
              </button>
              <button
                type="button"
                onClick={() => onAssetTypeChange("balance")}
                className="btn"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  background: assetType === "balance" ? "rgba(16, 185, 129, 0.16)" : "transparent",
                  borderColor: assetType === "balance" ? "#10b981" : "var(--border-glass)",
                  color: assetType === "balance" ? "#10b981" : "var(--text-secondary)",
                  fontWeight: 700,
                  padding: "9px",
                  fontSize: "0.82rem",
                  gap: "5px",
                  borderRadius: "10px",
                }}
              >
                <i className="bx bx-wallet" /> أساسي
              </button>
              <button
                type="button"
                onClick={() => onAssetTypeChange("promo_balance")}
                className="btn"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  background:
                    assetType === "promo_balance" ? "rgba(99, 102, 241, 0.18)" : "transparent",
                  borderColor: assetType === "promo_balance" ? "#818cf8" : "var(--border-glass)",
                  color: assetType === "promo_balance" ? "#818cf8" : "var(--text-secondary)",
                  fontWeight: 700,
                  padding: "9px",
                  fontSize: "0.82rem",
                  gap: "5px",
                  borderRadius: "10px",
                }}
              >
                <i className="bx bx-gift" /> ترويجي
              </button>
            </div>
          </div>

          {/* Promotional Balance Extra Fields */}
          {assetType === "promo_balance" && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                background: "rgba(99, 102, 241, 0.08)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "#818cf8", fontWeight: 700, lineHeight: 1.5 }}>
                الرصيد الترويجي منفصل عن المحفظة الأساسية ويُستخدم للشراء داخل الموقع فقط (غير قابل للسحب أو التحويل).
              </div>

              {actionType === "deposit" && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.76rem",
                      color: "var(--text-secondary)",
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}
                  >
                    صلاحية الرصيد الترويجي:
                  </label>
                  <select
                    className="input-fields"
                    value={promoExpiryOption}
                    onChange={(e) => onPromoExpiryOptionChange(e.target.value as PromoExpiryOption)}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "0.82rem" }}
                  >
                    <option value="30d">صالح لمدة 30 يوماً</option>
                    <option value="90d">صالح لمدة 90 يوماً</option>
                    <option value="custom">تاريخ انتهاء مخصص</option>
                    <option value="unlimited">غير محدد المدة</option>
                  </select>

                  {promoExpiryOption === "custom" && (
                    <input
                      type="date"
                      className="input-fields"
                      value={promoCustomExpiryDate}
                      onChange={(e) => onPromoCustomExpiryDateChange(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        fontSize: "0.82rem",
                        marginTop: "8px",
                      }}
                    />
                  )}
                </div>
              )}

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.76rem",
                    color: "var(--text-secondary)",
                    fontWeight: 700,
                    marginBottom: "4px",
                  }}
                >
                  السبب / الملاحظة (اختياري):
                </label>
                <input
                  type="text"
                  className="input-fields"
                  placeholder="مثال: مكافأة ترويجية للترحيب أو تعويض"
                  value={promoReason}
                  onChange={(e) => onPromoReasonChange(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", fontSize: "0.82rem" }}
                />
              </div>
            </div>
          )}

          {/* Row 3: Amount Input */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.84rem",
                color: "var(--text-secondary)",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              القيمة / الكمية المراد {actionType === "deposit" ? "إضافتها" : "خصمها"}:
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="number"
                min="0.01"
                step={assetType === "points" ? "1" : "0.01"}
                className="input-fields"
                placeholder={assetType === "points" ? "مثال: 500 نقطة" : "مثال: 150.50 ج.م"}
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                style={{
                  width: "100%",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              />
              {assetType !== "points" && (
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    fontWeight: 700,
                  }}
                >
                  ج.م
                </span>
              )}
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "0.84rem",
                fontWeight: 700,
                textAlign: "center",
                background:
                  statusMessage.type === "success"
                    ? "rgba(16, 185, 129, 0.15)"
                    : "rgba(239, 68, 68, 0.15)",
                color: statusMessage.type === "success" ? "#10b981" : "#f87171",
                border:
                  statusMessage.type === "success"
                    ? "1px solid rgba(16, 185, 129, 0.3)"
                    : "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              {statusMessage.text}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            onClick={onClose}
            disabled={updating}
            className="btn"
            style={{ padding: "10px 20px", fontSize: "0.9rem" }}
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={updating}
            className="btn btn-primary"
            style={{ padding: "10px 24px", fontSize: "0.9rem", fontWeight: 700 }}
          >
            {updating ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </div>
    </div>
  );
}
