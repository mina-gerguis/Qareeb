"use client";

import React from "react";
import styles from "../admin-points.module.css";
import { BalanceTransaction } from "../types";

interface AdminRejectRequestModalProps {
  request: BalanceTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  rejectNotes: string;
  onRejectNotesChange: (notes: string) => void;
  savedReasons: string[];
  onSelectReason: (reason: string) => void;
  onDeleteReason: (reason: string) => void;
  onConfirm: () => void;
}

export function AdminRejectRequestModal({
  request,
  isOpen,
  onClose,
  rejectNotes,
  onRejectNotesChange,
  savedReasons,
  onSelectReason,
  onDeleteReason,
  onConfirm,
}: AdminRejectRequestModalProps) {
  if (!isOpen || !request) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "500px" }}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>تحديد سبب رفض العملية</h3>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose}>
            <i className="bx bx-x" />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Warning Banner */}
          <div
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "0.85rem",
              lineHeight: 1.6,
            }}
          >
            <span>
              أنت بصدد رفض طلب{" "}
              <strong>{request.type === "deposit" ? "الإيداع" : "السحب"}</strong> بقيمة{" "}
              <strong>{(request.amount || 0).toFixed(2)} ج.م</strong> للمستخدم{" "}
              <strong>@{request.profiles?.username || "بدون_يوزر"}</strong>.
            </span>
            {request.type === "withdrawal" && (
              <p
                style={{
                  margin: "6px 0 0 0",
                  color: "#f87171",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                * سيتم إعادة الرصيد المحجوز بالكامل لمحفظة المستخدم فور الحفظ.
              </p>
            )}
          </div>

          {/* Reason Input */}
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
              سبب الرفض (سيظهر للمستخدم في كشف الحساب والإشعارات):
            </label>
            <textarea
              className="input-fields"
              rows={4}
              required
              placeholder="مثال: إيصال التحويل غير واضح، أو لم نتوصل بالمبلغ على حساباتنا، يرجى إعادة المحاولة."
              value={rejectNotes}
              onChange={(e) => onRejectNotesChange(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "0.88rem",
                fontFamily: "inherit",
                resize: "none",
                borderRadius: "10px",
              }}
            />
          </div>

          {/* Quick Reasons Chips */}
          {savedReasons.length > 0 && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                أسباب رفض سابقة (اضغط للاختيار السريع):
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  maxHeight: "120px",
                  overflowY: "auto",
                  padding: "4px",
                }}
              >
                {savedReasons.map((reason, index) => (
                  <div
                    key={index}
                    onClick={() => onSelectReason(reason)}
                    className={styles.reasonTag}
                  >
                    <span>{reason}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteReason(reason);
                      }}
                      className={styles.reasonTagDelete}
                      title="حذف من الاقتراحات"
                    >
                      <i className="bx bx-x" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            onClick={onClose}
            className="btn"
            style={{ padding: "10px 20px", fontSize: "0.9rem" }}
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn"
            style={{
              padding: "10px 24px",
              fontSize: "0.9rem",
              background: "#ef4444",
              color: "#fff",
              borderColor: "#ef4444",
              fontWeight: 700,
            }}
          >
            تأكيد الرفض وإعادة الرصيد
          </button>
        </div>
      </div>
    </div>
  );
}
