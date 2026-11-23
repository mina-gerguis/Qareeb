"use client";

import React from "react";
import { IconDotsFilled } from "@tabler/icons-react";
import styles from "../admin-points.module.css";
import { AdminPromoLedgerEntry, PromoVisibleColumns } from "../types";

interface AdminPointsPromoLedgerTableProps {
  items: AdminPromoLedgerEntry[];
  paginatedItems: AdminPromoLedgerEntry[];
  loading: boolean;
  schemaReady: boolean;
  visibleColumns: PromoVisibleColumns;
  onOpenActionMenu: (item: AdminPromoLedgerEntry, rect: DOMRect) => void;
}

export function AdminPointsPromoLedgerTable({
  items,
  paginatedItems,
  loading,
  schemaReady,
  visibleColumns,
  onOpenActionMenu,
}: AdminPointsPromoLedgerTableProps) {
  return (
    <div className={styles.table05Container}>
      {!schemaReady ? (
        <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-secondary)" }}>
          <i className="bx bx-data" style={{ fontSize: "2.8rem", color: "#818cf8", marginBottom: "12px" }} />
          <p style={{ margin: "0 0 8px", fontWeight: 800, color: "var(--color-fg)", fontSize: "1rem" }}>
            جداول تتبع الرصيد الترويجي غير مفعّلة في قاعدة البيانات بعد
          </p>
          <p style={{ margin: 0, fontSize: "0.85rem", maxWidth: "600px", marginInline: "auto" }}>
            يرجى تشغيل ملف{" "}
            <code dir="ltr" style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.08)" }}>
              supabase/supabase_promo_balance_schema.sql
            </code>{" "}
            داخل Supabase SQL Editor لتفعيل الدفعات والسجل الكامل.
          </p>
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "2.5px solid var(--border-glass)",
              borderTop: "2.5px solid var(--color-primary)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            جاري تحميل سجل الرصيد الترويجي...
          </p>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <i
            className="bx bx-gift"
            style={{ fontSize: "3.5rem", color: "var(--text-muted)", marginBottom: "16px" }}
          />
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            لا توجد حركات مسجلة للرصيد الترويجي حتى الآن.
          </p>
        </div>
      ) : (
        <div className={styles.table05Scroll}>
          <table className={styles.table05}>
            <thead>
              <tr>
                {visibleColumns.user && (
                  <th className={styles.table05Th} style={{ minWidth: "150px" }}>
                    المستخدم
                  </th>
                )}
                {visibleColumns.type && (
                  <th className={styles.table05Th} style={{ minWidth: "130px" }}>
                    العملية
                  </th>
                )}
                {visibleColumns.description && (
                  <th className={styles.table05Th} style={{ minWidth: "180px" }}>
                    التفاصيل
                  </th>
                )}
                {visibleColumns.amount && (
                  <th className={styles.table05Th} style={{ minWidth: "120px" }}>
                    القيمة
                  </th>
                )}
                {visibleColumns.code && (
                  <th className={styles.table05Th} style={{ minWidth: "110px" }}>
                    الكود المرجعي
                  </th>
                )}
                {visibleColumns.expires_at && (
                  <th className={styles.table05Th} style={{ minWidth: "110px" }}>
                    تاريخ الانتهاء
                  </th>
                )}
                {visibleColumns.created_at && (
                  <th className={styles.table05Th} style={{ minWidth: "110px" }}>
                    التاريخ
                  </th>
                )}
                <th className={styles.table05Th} style={{ width: "50px", textAlign: "center" }}>
                  خيارات
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => {
                const isCredit = item.type === "credit";
                const isExpired = item.type === "expired";
                const color = isCredit ? "#10b981" : isExpired ? "#f59e0b" : "#818cf8";

                return (
                  <tr key={item.id} className={styles.table05Tr}>
                    {visibleColumns.user && (
                      <td className={styles.table05Td}>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--color-fg)" }}>
                          {item.userName || "مستخدم"}
                        </div>
                        {item.userUsername && (
                          <div
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--text-muted)",
                              direction: "ltr",
                              textAlign: "right",
                            }}
                          >
                            @{item.userUsername}
                          </div>
                        )}
                      </td>
                    )}

                    {visibleColumns.type && (
                      <td className={styles.table05Td} style={{ fontWeight: 700, color }}>
                        <i
                          className={`bx ${
                            isCredit
                              ? "bx-down-arrow-circle"
                              : isExpired
                              ? "bx-time"
                              : "bx-up-arrow-circle"
                          }`}
                          style={{ marginLeft: "6px", verticalAlign: "middle" }}
                        />
                        <span>{item.title}</span>
                      </td>
                    )}

                    {visibleColumns.description && (
                      <td className={styles.table05Td}>{item.description || "—"}</td>
                    )}

                    {visibleColumns.amount && (
                      <td
                        className={styles.table05Td}
                        style={{
                          fontWeight: 800,
                          color,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {isCredit ? "+" : "-"} {item.amount.toFixed(2)} ج.م
                      </td>
                    )}

                    {visibleColumns.code && (
                      <td className={styles.table05Td}>
                        {item.sourceCode ? (
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
                        ) : (
                          "—"
                        )}
                      </td>
                    )}

                    {visibleColumns.expires_at && (
                      <td className={styles.table05Td} style={{ fontVariantNumeric: "tabular-nums" }}>
                        {item.expiresAt
                          ? new Date(item.expiresAt).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "غير محدد المدة"}
                      </td>
                    )}

                    {visibleColumns.created_at && (
                      <td className={styles.table05Td} style={{ fontVariantNumeric: "tabular-nums" }}>
                        {new Date(item.createdAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    )}

                    <td className={styles.table05Td} style={{ textAlign: "center" }}>
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
                    </td>
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
