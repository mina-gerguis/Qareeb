"use client";

import React from "react";
import { IconDotsFilled, IconGift, IconArrowDownCircle, IconArrowUpCircle, IconClock } from "@tabler/icons-react";
import { AdminPromoLedgerEntry } from "../types";
import styles from "../admin-points.module.css";

interface AdminPointsPromoLedgerCardsProps {
  items: AdminPromoLedgerEntry[];
  onOpenActionMenu: (item: AdminPromoLedgerEntry, rect: DOMRect) => void;
}

export function AdminPointsPromoLedgerCards({
  items,
  onOpenActionMenu,
}: AdminPointsPromoLedgerCardsProps) {
  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <i
          className="bx bx-gift"
          style={{ fontSize: "3.5rem", color: "var(--text-muted)", marginBottom: "16px" }}
        />
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          لا توجد حركات مسجلة للرصيد الترويجي حتى الآن.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.cardsGrid}>
      {items.map((item) => {
        const isCredit = item.type === "credit";
        const isExpired = item.type === "expired";
        const color = isCredit ? "#10b981" : isExpired ? "#f59e0b" : "#818cf8";

        return (
          <div key={item.id} className={styles.dataCard}>
            {/* Header */}
            <div className={styles.dataCardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "rgba(99, 102, 241, 0.12)",
                    color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  {isCredit ? (
                    <IconArrowDownCircle size={20} />
                  ) : isExpired ? (
                    <IconClock size={20} />
                  ) : (
                    <IconArrowUpCircle size={20} />
                  )}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4 className={styles.dataCardTitle} style={{ color }}>
                    {item.title}
                  </h4>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {item.userName || "مستخدم"}{" "}
                    {item.userUsername && (
                      <span style={{ color: "var(--color-primary)" }}>@{item.userUsername}</span>
                    )}
                  </div>
                </div>
              </div>

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

            {/* Amount Callout */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "8px 12px",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
                قيمة الحركة:
              </span>
              <span
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 900,
                  color,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {isCredit ? "+" : "-"} {item.amount.toFixed(2)} ج.م
              </span>
            </div>

            {/* Description & Reference Code */}
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              <div>{item.description || "—"}</div>
              {item.sourceCode && (
                <div style={{ marginTop: "6px" }}>
                  كود:{" "}
                  <code
                    dir="ltr"
                    style={{
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: "rgba(99, 102, 241, 0.12)",
                      color: "#818cf8",
                      fontWeight: 700,
                    }}
                  >
                    {item.sourceCode}
                  </code>
                </div>
              )}
            </div>

            {/* Footer Dates */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                paddingTop: "10px",
                borderTop: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div>
                انتهاء:{" "}
                <span style={{ fontWeight: 700, color: "var(--color-fg)" }}>
                  {item.expiresAt
                    ? new Date(item.expiresAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "غير محدد"}
                </span>
              </div>
              <div>
                {new Date(item.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
