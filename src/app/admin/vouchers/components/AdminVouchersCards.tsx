"use client";

import React from "react";
import { IconDotsFilled, IconEdit, IconHistory, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import styles from "../vouchers.module.css";
import {
  VoucherItem,
  VOUCHER_REWARD_META,
  VOUCHER_STATUS_META,
} from "../types";
import { formatRewardSummary } from "@/lib/vouchers";

interface AdminVouchersCardsProps {
  vouchers: VoucherItem[];
  copiedId: string | null;
  onCopyCode: (voucher: VoucherItem) => void;
  onOpenEditModal: (voucher: VoucherItem) => void;
  onToggleStatus: (voucher: VoucherItem) => void;
  onOpenLogsModal: (voucher: VoucherItem) => void;
  onOpenActionMenu: (voucher: VoucherItem, rect: DOMRect) => void;
}

export function AdminVouchersCards({
  vouchers,
  copiedId,
  onCopyCode,
  onOpenEditModal,
  onToggleStatus,
  onOpenLogsModal,
  onOpenActionMenu,
}: AdminVouchersCardsProps) {
  if (vouchers.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
        <i className="bx bxs-coupon" style={{ fontSize: "3rem", opacity: 0.4 }} />
        <p style={{ margin: "12px 0 0", fontSize: "0.92rem" }}>
          لا توجد قسائم مطابقة لمعايير البحث الحالية.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.cardsGrid}>
      {vouchers.map((item) => {
        const rewardMeta = VOUCHER_REWARD_META[item.rewardType];
        const statusMeta = VOUCHER_STATUS_META[item.status];
        const pct =
          item.maxUses && item.maxUses > 0
            ? Math.min(100, Math.round((item.usageCount / item.maxUses) * 100))
            : 0;

        return (
          <div key={item.id} className={styles.voucherCard}>
            {/* Header: Code + Status + MoreMenu */}
            <div className={styles.voucherCardHeader}>
              <div className={styles.codeBadgeWrap}>
                <code dir="ltr" className={styles.codeMono}>
                  {item.code}
                </code>
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={() => onCopyCode(item)}
                  title="نسخ الكود"
                >
                  <i
                    className={`bx ${copiedId === item.id ? "bx-check" : "bx-copy"}`}
                    style={{
                      color: copiedId === item.id ? "#10b981" : undefined,
                      fontSize: "1rem",
                    }}
                  />
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "3px 9px",
                    borderRadius: "999px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background: statusMeta.bg,
                    color: statusMeta.color,
                    border: `1px solid ${statusMeta.border}`,
                  }}
                >
                  {statusMeta.label}
                </span>

                <button
                  type="button"
                  className={styles.moreMenuBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenActionMenu(item, e.currentTarget.getBoundingClientRect());
                  }}
                  title="خيارات إضافية"
                >
                  <IconDotsFilled size={18} />
                </button>
              </div>
            </div>

            {/* Title & Campaign */}
            <div className={styles.voucherCardBody}>
              <h4 className={styles.voucherCardTitle}>{item.title}</h4>
              {item.batchName && (
                <span
                  style={{
                    fontSize: "0.74rem",
                    color: "var(--text-muted, #94a3b8)",
                    marginTop: "-4px",
                  }}
                >
                  الحملة: {item.batchName}
                </span>
              )}

              {/* Reward Badge & Summary */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  background: "rgba(255, 255, 255, 0.02)",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "3px 9px",
                    borderRadius: "999px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background: rewardMeta.accentBg,
                    color: rewardMeta.accentColor,
                    border: `1px solid ${rewardMeta.accentBorder}`,
                    flexShrink: 0,
                  }}
                >
                  <i className={`bx ${rewardMeta.bxIcon}`} />
                  {rewardMeta.shortLabel}
                </span>

                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-secondary, #94a3b8)",
                    textAlign: "left",
                    direction: "rtl",
                  }}
                >
                  {formatRewardSummary(item)}
                </span>
              </div>

              {/* Usage Progress */}
              <div className={styles.usageCell}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 700 }}>
                  <span>
                    الاستخدام: {item.usageCount} / {item.maxUses ?? "∞"}
                  </span>
                  {item.maxUses && (
                    <span style={{ color: "var(--text-muted, #94a3b8)" }}>{pct}%</span>
                  )}
                </div>
                {item.maxUses ? (
                  <div className={styles.usageTrack}>
                    <div
                      className={styles.usageFill}
                      style={{
                        width: `${pct}%`,
                        background: pct >= 90 ? "#ef4444" : rewardMeta.accentColor,
                      }}
                    />
                  </div>
                ) : (
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted, #94a3b8)" }}>
                    مفتوح الاستخدام
                  </span>
                )}
              </div>

              {/* Expiry Note */}
              <div
                style={{
                  fontSize: "0.74rem",
                  color: "var(--text-muted)",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>انتهاء الصلاحية:</span>
                <span style={{ fontWeight: 700, color: "var(--color-fg)" }}>
                  {item.expiresAt
                    ? new Date(item.expiresAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "غير محدد المدة"}
                </span>
              </div>
            </div>

            {/* Footer Quick Actions */}
            <div className={styles.voucherCardFooter}>
              <button
                type="button"
                onClick={() => onOpenLogsModal(item)}
                className="btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 12px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
              >
                <IconHistory size={16} />
                <span>سجل الاسترداد</span>
              </button>

              <div style={{ display: "flex", gap: "6px" }}>
                {(item.status === "active" || item.status === "paused") && (
                  <button
                    type="button"
                    onClick={() => onToggleStatus(item)}
                    className="btn"
                    style={{ padding: "6px 10px", fontSize: "0.78rem" }}
                    title={item.status === "active" ? "إيقاف مؤقت" : "تفعيل"}
                  >
                    {item.status === "active" ? (
                      <IconPlayerPause size={16} />
                    ) : (
                      <IconPlayerPlay size={16} />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenEditModal(item)}
                  className="btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "6px 12px",
                    fontSize: "0.78rem",
                    background: "rgba(99, 102, 241, 0.12)",
                    borderColor: "rgba(99, 102, 241, 0.25)",
                    color: "#818cf8",
                    fontWeight: 700,
                  }}
                >
                  <IconEdit size={16} />
                  <span>تعديل</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
