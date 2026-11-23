"use client";

import React from "react";
import { IconDotsFilled } from "@tabler/icons-react";
import styles from "../vouchers.module.css";
import {
  VoucherItem,
  VouchersVisibleColumns,
  VOUCHER_REWARD_META,
  VOUCHER_STATUS_META,
} from "../types";
import { formatRewardSummary } from "@/lib/vouchers";

interface AdminVouchersTableProps {
  vouchers: VoucherItem[];
  paginatedVouchers: VoucherItem[];
  loading: boolean;
  visibleColumns: VouchersVisibleColumns;
  copiedId: string | null;
  onCopyCode: (voucher: VoucherItem) => void;
  onOpenEditModal: (voucher: VoucherItem) => void;
  onToggleStatus: (voucher: VoucherItem) => void;
  onDeleteVoucher: (id: string) => void;
  onOpenLogsModal: (voucher: VoucherItem) => void;
  onOpenActionMenu: (voucher: VoucherItem, rect: DOMRect) => void;
}

export function AdminVouchersTable({
  vouchers,
  paginatedVouchers,
  loading,
  visibleColumns,
  copiedId,
  onCopyCode,
  onOpenEditModal,
  onToggleStatus,
  onDeleteVoucher,
  onOpenLogsModal,
  onOpenActionMenu,
}: AdminVouchersTableProps) {
  return (
    <div className={styles.table05Container}>
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "2.5px solid var(--border-glass, rgba(255,255,255,0.1))",
              borderTop: "2.5px solid var(--color-primary, #3b82f6)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ margin: 0, fontSize: "0.9rem" }}>جاري تحميل القسائم...</p>
        </div>
      ) : vouchers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <i className="bx bxs-coupon" style={{ fontSize: "3rem", opacity: 0.4 }} />
          <p style={{ margin: "12px 0 0", fontSize: "0.92rem" }}>
            لا توجد قسائم مطابقة لمعايير البحث الحالية.
          </p>
        </div>
      ) : (
        <div className={styles.table05Scroll}>
          <table className={styles.table05}>
            <thead>
              <tr>
                {visibleColumns.code && (
                  <th className={styles.table05Th} style={{ minWidth: "160px" }}>
                    الكود
                  </th>
                )}
                {visibleColumns.title && (
                  <th className={styles.table05Th} style={{ minWidth: "170px" }}>
                    العنوان والدفعة
                  </th>
                )}
                {visibleColumns.reward && (
                  <th className={styles.table05Th} style={{ minWidth: "190px" }}>
                    نوع المكافأة والنتيجة
                  </th>
                )}
                {visibleColumns.usage && (
                  <th className={styles.table05Th} style={{ minWidth: "140px" }}>
                    الاستخدامات
                  </th>
                )}
                {visibleColumns.expiresAt && (
                  <th className={styles.table05Th} style={{ minWidth: "120px" }}>
                    صلاحية الكود
                  </th>
                )}
                {visibleColumns.status && (
                  <th className={styles.table05Th} style={{ minWidth: "100px" }}>
                    الحالة
                  </th>
                )}
                {visibleColumns.actions && (
                  <th
                    className={styles.table05Th}
                    style={{ minWidth: "160px", textAlign: "center" }}
                  >
                    الإجراءات
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedVouchers.map((item) => {
                const rewardMeta = VOUCHER_REWARD_META[item.rewardType];
                const statusMeta = VOUCHER_STATUS_META[item.status];
                const pct =
                  item.maxUses && item.maxUses > 0
                    ? Math.min(100, Math.round((item.usageCount / item.maxUses) * 100))
                    : 0;

                return (
                  <tr key={item.id} className={styles.table05Tr}>
                    {/* Code */}
                    {visibleColumns.code && (
                      <td className={styles.table05Td}>
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
                      </td>
                    )}

                    {/* Title & Campaign */}
                    {visibleColumns.title && (
                      <td className={styles.table05Td}>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--color-fg)" }}>
                          {item.title}
                        </div>
                        {item.batchName && (
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "3px",
                              fontSize: "0.74rem",
                              color: "var(--text-muted, #94a3b8)",
                            }}
                          >
                            الحملة: {item.batchName}
                          </span>
                        )}
                      </td>
                    )}

                    {/* Reward & Summary */}
                    {visibleColumns.reward && (
                      <td className={styles.table05Td}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "3px 10px",
                              borderRadius: "999px",
                              fontSize: "0.74rem",
                              fontWeight: 700,
                              background: rewardMeta.accentBg,
                              color: rewardMeta.accentColor,
                              border: `1px solid ${rewardMeta.accentBorder}`,
                            }}
                          >
                            <i className={`bx ${rewardMeta.bxIcon}`} />
                            {rewardMeta.shortLabel}
                          </span>
                          <span style={{ fontSize: "0.78rem", color: "var(--text-muted, #94a3b8)" }}>
                            {formatRewardSummary(item)}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* Usage Progress */}
                    {visibleColumns.usage && (
                      <td className={styles.table05Td}>
                        <div className={styles.usageCell}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 700 }}>
                            <span>
                              {item.usageCount} / {item.maxUses ?? "∞"}
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
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted, #94a3b8)" }}>
                              مفتوح الاستخدام
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Expiry */}
                    {visibleColumns.expiresAt && (
                      <td className={styles.table05Td} style={{ fontSize: "0.8rem", fontVariantNumeric: "tabular-nums" }}>
                        {item.expiresAt
                          ? new Date(item.expiresAt).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "غير محدد المدة"}
                      </td>
                    )}

                    {/* Status */}
                    {visibleColumns.status && (
                      <td className={styles.table05Td}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontSize: "0.74rem",
                            fontWeight: 700,
                            background: statusMeta.bg,
                            color: statusMeta.color,
                            border: `1px solid ${statusMeta.border}`,
                          }}
                        >
                          {statusMeta.label}
                        </span>
                      </td>
                    )}

                    {/* Actions */}
                    {visibleColumns.actions && (
                      <td className={styles.table05Td} style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
                          <button
                            type="button"
                            onClick={() => onOpenLogsModal(item)}
                            className="btn"
                            style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                            title="سجل استرداد هذا الكود"
                          >
                            <i className="bx bx-history" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenEditModal(item)}
                            className="btn"
                            style={{
                              padding: "4px 8px",
                              fontSize: "0.8rem",
                              background: "rgba(99, 102, 241, 0.12)",
                              borderColor: "rgba(99, 102, 241, 0.25)",
                              color: "#818cf8",
                            }}
                            title="تعديل خصائص الكود"
                          >
                            <i className="bx bx-edit-alt" />
                          </button>

                          {(item.status === "active" || item.status === "paused") && (
                            <button
                              type="button"
                              onClick={() => onToggleStatus(item)}
                              className="btn"
                              style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                              title={item.status === "active" ? "إيقاف الكود مؤقتاً" : "تفعيل الكود"}
                            >
                              <i
                                className={`bx ${item.status === "active" ? "bx-pause-circle" : "bx-play-circle"}`}
                              />
                            </button>
                          )}

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
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
