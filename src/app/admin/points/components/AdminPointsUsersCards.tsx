"use client";

import React from "react";
import { IconDotsFilled, IconUser, IconEdit, IconPhone, IconMail } from "@tabler/icons-react";
import { UserProfile } from "../types";
import styles from "../admin-points.module.css";

interface AdminPointsUsersCardsProps {
  users: UserProfile[];
  onOpenEditModal: (user: UserProfile) => void;
  onOpenActionMenu: (user: UserProfile, rect: DOMRect) => void;
}

export function AdminPointsUsersCards({
  users,
  onOpenEditModal,
  onOpenActionMenu,
}: AdminPointsUsersCardsProps) {
  if (users.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <i
          className="bx bx-ghost"
          style={{ fontSize: "3.5rem", color: "var(--text-muted)", marginBottom: "16px" }}
        />
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          لم يتم العثور على مستخدمين يطابقون البحث.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.cardsGrid}>
      {users.map((u) => (
        <div key={u.id} className={styles.dataCard}>
          {/* Header */}
          <div className={styles.dataCardHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
              <div className={styles.dataCardAvatar}>
                <IconUser size={22} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h4
                  className={styles.dataCardTitle}
                  style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {u.full_name || "بدون اسم"}
                </h4>
                <div className={styles.dataCardSubtitle}>
                  @{u.username || "بدون_يوزر"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {u.is_admin && (
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 7px",
                    borderRadius: "6px",
                    background: "rgba(99, 102, 241, 0.15)",
                    color: "#818cf8",
                    fontWeight: 800,
                  }}
                >
                  مسؤول
                </span>
              )}
              <button
                type="button"
                className={styles.moreMenuBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenActionMenu(u, e.currentTarget.getBoundingClientRect());
                }}
                title="خيارات إضافية"
              >
                <IconDotsFilled size={18} />
              </button>
            </div>
          </div>

          {/* User Contact Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            {u.email && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", direction: "ltr", justifyContent: "flex-end" }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</span>
                <IconMail size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              </div>
            )}
            {u.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", direction: "ltr", justifyContent: "flex-end" }}>
                <span>{u.phone}</span>
                <IconPhone size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              </div>
            )}
          </div>

          {/* 3 Balances Grid */}
          <div className={styles.dataCardBalancesGrid}>
            <div className={styles.dataCardBalanceItem}>
              <span className={styles.dataCardBalanceLabel}>الأساسي</span>
              <strong className={styles.dataCardBalanceValue} style={{ color: "#10b981" }}>
                {(u.balance || 0).toFixed(2)}
              </strong>
            </div>
            <div className={styles.dataCardBalanceItem}>
              <span className={styles.dataCardBalanceLabel}>الترويجي</span>
              <strong className={styles.dataCardBalanceValue} style={{ color: "#818cf8" }}>
                {(u.promo_balance || 0).toFixed(2)}
              </strong>
            </div>
            <div className={styles.dataCardBalanceItem}>
              <span className={styles.dataCardBalanceLabel}>النقاط</span>
              <strong className={styles.dataCardBalanceValue} style={{ color: "#fbbf24" }}>
                {u.points || 0}
              </strong>
            </div>
          </div>

          {/* Footer Actions */}
          <div className={styles.dataCardFooter}>
            <button
              type="button"
              onClick={() => onOpenEditModal(u)}
              className="btn btn-primary"
              style={{
                flex: 1,
                padding: "8px 12px",
                fontSize: "0.82rem",
                justifyContent: "center",
                gap: "6px",
                fontWeight: 700,
              }}
            >
              <IconEdit size={16} />
              <span>تعديل الأرصدة والنقاط</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
