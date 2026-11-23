"use client";

import React from "react";
import styles from "../subscriptions.module.css";
import { SubscriptionPlan } from "../types";

interface AdminSubscriptionsPlansTabProps {
  plans: SubscriptionPlan[];
  loading: boolean;
  onEditPlan: (plan: SubscriptionPlan) => void;
}

export function AdminSubscriptionsPlansTab({
  plans,
  loading,
  onEditPlan,
}: AdminSubscriptionsPlansTabProps) {
  if (loading) {
    return (
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
        <p style={{ margin: 0, fontSize: "0.9rem" }}>جاري تحميل تفاصيل الباقات...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className={styles.headerText}>
        <h3 style={{ margin: "0 0 4px", fontSize: "1.2rem", fontWeight: 800 }}>
          باقات الاشتراك المتاحة للنظام
        </h3>
        <p>
          يمكنك التعديل مباشرة على الأسعار والمميزات لتحديثها تلقائياً للمستخدمين وفي صفحة الترقية
        </p>
      </div>

      <div className={styles.planCardGrid}>
        {plans.map((p) => (
          <div key={p.id} className={styles.planCard}>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h4 className={styles.planCardTitle}>{p.name}</h4>
                <span
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "8px",
                    background: "rgba(99, 102, 241, 0.15)",
                    color: "#818cf8",
                  }}
                >
                  ID: {p.id}
                </span>
              </div>

              <div style={{ margin: "16px 0" }}>
                <div
                  style={{
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-muted, #94a3b8)",
                    }}
                  >
                    السعر الشهري:
                  </span>
                  <strong className={styles.planPriceTag}>{p.price_monthly} ج.م</strong>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-muted, #94a3b8)",
                    }}
                  >
                    السعر السنوي:
                  </span>
                  <strong
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 900,
                      color: "#3b82f6",
                      fontFamily: "var(--font-mono, monospace)",
                    }}
                  >
                    {p.price_yearly} ج.م
                  </strong>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border-glass, rgba(255, 255, 255, 0.08))",
                  paddingTop: "14px",
                  marginTop: "14px",
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    color: "var(--color-fg, #ffffff)",
                    fontSize: "0.88rem",
                    marginBottom: "10px",
                  }}
                >
                  المزايا والمواصفات:
                </div>
                {p.features && p.features.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {p.features.map((feat, i) => (
                      <div key={i} className={styles.planFeatureItem}>
                        <i
                          className="bx bx-check-circle"
                          style={{
                            color: "#10b981",
                            fontSize: "1.1rem",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--color-text-muted, #94a3b8)",
                    }}
                  >
                    لا توجد مميزات مسجلة
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onEditPlan(p)}
              className={styles.secondaryBtn}
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "24px",
                padding: "12px",
              }}
            >
              <i className="bx bx-edit" style={{ fontSize: "1.1rem" }} />
              <span>تعديل الباقة والأسعار</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
