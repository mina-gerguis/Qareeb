"use client";

import React from "react";
import styles from "../vouchers.module.css";
import { VoucherItem, VoucherRedemptionLog, VOUCHER_REWARD_META } from "../types";

interface AdminVoucherLogsModalProps {
  logsModalVoucher: VoucherItem | null | "all";
  visibleLogs: VoucherRedemptionLog[];
  onClose: () => void;
}

export function AdminVoucherLogsModal({
  logsModalVoucher,
  visibleLogs,
  onClose,
}: AdminVoucherLogsModalProps) {
  if (!logsModalVoucher) return null;

  const isAll = logsModalVoucher === "all";
  const title = isAll
    ? "سجل استرداد القسائم والأكواد"
    : `سجل استرداد الكود: ${logsModalVoucher.code}`;

  return (
    <div
      className={styles.modalOverlay}
      data-modal-overlay="true"
      onClick={onClose}
    >
      <div
        className={styles.modalDialog}
        style={{ maxWidth: "680px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="إغلاق"
          >
            <i className="bx bx-x" />
          </button>
        </div>

        <div className={styles.modalBody} style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {visibleLogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 16px", color: "var(--color-text-muted, #94a3b8)" }}>
              <i className="bx bx-receipt" style={{ fontSize: "2.4rem", opacity: 0.4 }} />
              <p style={{ margin: "10px 0 0", fontSize: "0.88rem" }}>
                لا توجد عمليات استرداد مسجلة لهذا الكود حتى الآن.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {visibleLogs.map((log) => {
                const meta = VOUCHER_REWARD_META[log.rewardType];
                return (
                  <div
                    key={log.id}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
                      background: "var(--card-bg-subtle, rgba(255, 255, 255, 0.02))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                        {log.userName}{" "}
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #94a3b8)", fontWeight: 500 }}>
                          ({log.userEmail})
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: meta?.accentColor || "var(--primary-color, #38bdf8)",
                          marginTop: "3px",
                          fontWeight: 600,
                        }}
                      >
                        {log.rewardSummary}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted, #64748b)", marginTop: "3px" }}>
                        تاريخ الاسترداد:{" "}
                        {new Date(log.redeemedAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <code dir="ltr" className={styles.codeMono}>
                      {log.code}
                    </code>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
