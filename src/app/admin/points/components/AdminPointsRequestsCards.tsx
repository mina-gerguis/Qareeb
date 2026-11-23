"use client";

import React from "react";
import {
  IconDotsFilled,
  IconCheck,
  IconX,
  IconPhoto,
  IconCreditCard,
  IconArrowDownCircle,
  IconArrowUpCircle,
} from "@tabler/icons-react";
import { BalanceTransaction } from "../types";
import styles from "../admin-points.module.css";

interface AdminPointsRequestsCardsProps {
  requests: BalanceTransaction[];
  onApproveRequest: (req: BalanceTransaction) => void;
  onOpenRejectModal: (req: BalanceTransaction) => void;
  onPreviewReceipt: (imageUrl: string) => void;
  onOpenActionMenu: (req: BalanceTransaction, rect: DOMRect) => void;
}

export function AdminPointsRequestsCards({
  requests,
  onApproveRequest,
  onOpenRejectModal,
  onPreviewReceipt,
  onOpenActionMenu,
}: AdminPointsRequestsCardsProps) {
  if (requests.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <i
          className="bx bx-receipt"
          style={{ fontSize: "3.5rem", color: "var(--text-muted)", marginBottom: "16px" }}
        />
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          لا توجد طلبات معاملات تطابق الفلاتر المحددة.
        </p>
      </div>
    );
  }

  const getMethodName = (method: string) => {
    switch (method) {
      case "instapay":
        return "انستا باي";
      case "vodafone_cash":
        return "محفظة كاش";
      default:
        return "تحويل بنكي";
    }
  };

  return (
    <div className={styles.cardsGrid}>
      {requests.map((req) => (
        <div key={req.id} className={styles.dataCard}>
          {/* Header */}
          <div className={styles.dataCardHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span
                className={
                  req.type === "deposit"
                    ? styles.typeBadgeDeposit
                    : styles.typeBadgeWithdrawal
                }
              >
                {req.type === "deposit" ? (
                  <IconArrowDownCircle size={15} />
                ) : (
                  <IconArrowUpCircle size={15} />
                )}
                <span>{req.type === "deposit" ? "إيداع" : "سحب"}</span>
              </span>

              {req.status === "approved" && (
                <span className={styles.statusBadgeCompleted}>
                  <i className="bx bx-check-circle" /> مقبول
                </span>
              )}
              {req.status === "rejected" && (
                <span className={styles.statusBadgeCancelled}>
                  <i className="bx bx-x-circle" /> مرفوض
                </span>
              )}
              {req.status === "pending" && (
                <span className={styles.statusBadgePending}>
                  <i className="bx bx-time" /> معلق
                </span>
              )}
            </div>

            <button
              type="button"
              className={styles.moreMenuBtn}
              onClick={(e) => {
                e.stopPropagation();
                onOpenActionMenu(req, e.currentTarget.getBoundingClientRect());
              }}
              title="خيارات إضافية"
            >
              <IconDotsFilled size={18} />
            </button>
          </div>

          {/* Amount Callout */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "10px 14px",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700 }}>
              قيمة المعاملة:
            </span>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 900,
                color: req.type === "deposit" ? "#10b981" : "#f87171",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {(req.amount || 0).toFixed(2)} ج.م
            </span>
          </div>

          {/* User Details */}
          <div style={{ fontSize: "0.84rem", display: "flex", flexDirection: "column", gap: "3px" }}>
            <div style={{ fontWeight: 800, color: "var(--color-fg)" }}>
              {req.profiles?.full_name || "اسم غير متوفر"}
            </div>
            <div style={{ color: "var(--color-primary)", fontSize: "0.78rem" }}>
              @{req.profiles?.username || "بدون_يوزر"}
            </div>
            {req.profiles?.phone && (
              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", direction: "ltr", textAlign: "right" }}>
                {req.profiles.phone}
              </div>
            )}
          </div>

          {/* Transfer Info */}
          <div
            style={{
              fontSize: "0.78rem",
              lineHeight: 1.6,
              background: "rgba(255, 255, 255, 0.015)",
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            <div>
              الوسيلة: <strong>{getMethodName(req.method)}</strong>
            </div>
            <div>
              رقم/حساب:{" "}
              <span style={{ direction: "ltr", display: "inline-block", fontWeight: 700 }}>
                {req.provider_number}
              </span>
            </div>
            {req.recipient_name && <div>الاسم: <strong>{req.recipient_name}</strong></div>}
            {req.transaction_id && (
              <div>العملية: <span style={{ color: "#fbbf24", fontWeight: 700 }}>{req.transaction_id}</span></div>
            )}
            <div style={{ color: "var(--text-muted)", fontSize: "0.72rem", marginTop: "4px" }}>
              {new Date(req.created_at).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Rejection Note if rejected */}
          {req.status === "rejected" && req.admin_notes && (
            <div
              style={{
                fontSize: "0.78rem",
                color: "#f87171",
                background: "rgba(239, 68, 68, 0.08)",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(239, 68, 68, 0.15)",
              }}
            >
              <strong>سبب الرفض:</strong> {req.admin_notes}
            </div>
          )}

          {/* Footer Actions */}
          <div className={styles.dataCardFooter}>
            {req.image_url && (
              <button
                type="button"
                onClick={() => onPreviewReceipt(req.image_url!)}
                className="btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 12px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--color-primary)",
                }}
              >
                <IconPhoto size={16} />
                <span>الإيصال</span>
              </button>
            )}

            {req.status === "pending" ? (
              <div style={{ display: "flex", gap: "8px", flex: 1, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => onApproveRequest(req)}
                  className="btn"
                  style={{
                    padding: "6px 12px",
                    fontSize: "0.78rem",
                    background: "#10b981",
                    color: "#fff",
                    borderColor: "#10b981",
                    fontWeight: 700,
                    gap: "4px",
                  }}
                >
                  <IconCheck size={16} />
                  <span>موافقة</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenRejectModal(req)}
                  className="btn"
                  style={{
                    padding: "6px 12px",
                    fontSize: "0.78rem",
                    background: "#ef4444",
                    color: "#fff",
                    borderColor: "#ef4444",
                    fontWeight: 700,
                    gap: "4px",
                  }}
                >
                  <IconX size={16} />
                  <span>رفض</span>
                </button>
              </div>
            ) : (
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginRight: "auto" }}>
                {req.status === "approved" ? "تمت الموافقة" : "تم الرفض"}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
