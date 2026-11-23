"use client";

import React from "react";
import { IconDotsFilled } from "@tabler/icons-react";
import styles from "../admin-points.module.css";
import { UserProfile, UsersVisibleColumns } from "../types";

interface AdminPointsUsersTableProps {
  users: UserProfile[];
  paginatedUsers: UserProfile[];
  loading: boolean;
  visibleColumns: UsersVisibleColumns;
  onOpenEditModal: (user: UserProfile) => void;
  onOpenActionMenu: (user: UserProfile, rect: DOMRect) => void;
}

export function AdminPointsUsersTable({
  users,
  paginatedUsers,
  loading,
  visibleColumns,
  onOpenEditModal,
  onOpenActionMenu,
}: AdminPointsUsersTableProps) {
  return (
    <div className={styles.table05Container}>
      {loading ? (
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
            جاري تحميل حسابات المستخدمين...
          </p>
        </div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <i
            className="bx bx-ghost"
            style={{ fontSize: "3.5rem", color: "var(--text-muted)", marginBottom: "16px" }}
          />
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            لم يتم العثور على مستخدمين يطابقون البحث.
          </p>
        </div>
      ) : (
        <div className={styles.table05Scroll}>
          <table className={styles.table05}>
            <thead>
              <tr>
                {visibleColumns.username && (
                  <th className={styles.table05Th} style={{ minWidth: "160px" }}>
                    اسم المستخدم
                  </th>
                )}
                {visibleColumns.full_name && (
                  <th className={styles.table05Th} style={{ minWidth: "150px" }}>
                    الاسم الكامل
                  </th>
                )}
                {visibleColumns.email && (
                  <th className={styles.table05Th} style={{ minWidth: "180px" }}>
                    البريد الإلكتروني
                  </th>
                )}
                {visibleColumns.phone && (
                  <th className={styles.table05Th} style={{ minWidth: "130px" }}>
                    رقم الهاتف
                  </th>
                )}
                {visibleColumns.balance && (
                  <th className={styles.table05Th} style={{ minWidth: "120px" }}>
                    الرصيد الأساسي
                  </th>
                )}
                {visibleColumns.promo_balance && (
                  <th className={styles.table05Th} style={{ minWidth: "120px" }}>
                    الرصيد الترويجي
                  </th>
                )}
                {visibleColumns.points && (
                  <th className={styles.table05Th} style={{ minWidth: "100px" }}>
                    النقاط
                  </th>
                )}
                {visibleColumns.actions && (
                  <th
                    className={styles.table05Th}
                    style={{ width: "90px", textAlign: "center" }}
                  >
                    خيارات
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr
                  key={u.id}
                  className={styles.table05Tr}
                  onClick={() => onOpenEditModal(u)}
                  style={{ cursor: "pointer" }}
                >
                  {visibleColumns.username && (
                    <td
                      className={styles.table05Td}
                      style={{ fontWeight: 700, color: "var(--color-primary)" }}
                    >
                      <span>@{u.username || "بدون_يوزر"}</span>
                      {u.is_admin && (
                        <span
                          style={{
                            marginRight: "8px",
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
                    </td>
                  )}

                  {visibleColumns.full_name && (
                    <td className={styles.table05Td} style={{ fontWeight: 600 }}>
                      {u.full_name || "—"}
                    </td>
                  )}

                  {visibleColumns.email && (
                    <td
                      className={styles.table05Td}
                      style={{
                        direction: "ltr",
                        textAlign: "right",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {u.email || "—"}
                    </td>
                  )}

                  {visibleColumns.phone && (
                    <td
                      className={styles.table05Td}
                      style={{
                        direction: "ltr",
                        textAlign: "right",
                        color: "var(--text-secondary)",
                        fontSize: "0.82rem",
                      }}
                    >
                      {u.phone || "—"}
                    </td>
                  )}

                  {visibleColumns.balance && (
                    <td
                      className={styles.table05Td}
                      style={{
                        fontWeight: 800,
                        color: "#10b981",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {(u.balance || 0).toFixed(2)} ج.م
                    </td>
                  )}

                  {visibleColumns.promo_balance && (
                    <td
                      className={styles.table05Td}
                      style={{
                        fontWeight: 800,
                        color: "#818cf8",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {(u.promo_balance || 0).toFixed(2)} ج.م
                    </td>
                  )}

                  {visibleColumns.points && (
                    <td className={styles.table05Td} style={{ fontWeight: 800, color: "#fbbf24" }}>
                      <i className="bx bxs-coin" style={{ color: "#fbbf24", marginLeft: "4px" }} />
                      <span style={{ fontVariantNumeric: "tabular-nums" }}>{u.points || 0}</span>
                    </td>
                  )}

                  {visibleColumns.actions && (
                    <td
                      className={styles.table05Td}
                      style={{ textAlign: "center" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(u)}
                          className="btn"
                          style={{
                            padding: "4px 10px",
                            fontSize: "0.78rem",
                            gap: "4px",
                            background: "rgba(99, 102, 241, 0.12)",
                            borderColor: "rgba(99, 102, 241, 0.25)",
                            color: "#818cf8",
                            fontWeight: 700,
                          }}
                        >
                          <i className="bx bx-edit-alt" />
                          <span>تعديل</span>
                        </button>

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
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
