"use client";

import React from "react";
import { IconDotsFilled } from "@tabler/icons-react";
import styles from "../admin-points.module.css";
import { BalanceTransaction, RequestsVisibleColumns } from "../types";

interface AdminPointsRequestsTableProps {
  requests: BalanceTransaction[];
  paginatedRequests: BalanceTransaction[];
  loading: boolean;
  visibleColumns: RequestsVisibleColumns;
  onApproveRequest: (req: BalanceTransaction) => void;
  onOpenRejectModal: (req: BalanceTransaction) => void;
  onPreviewReceipt: (imageUrl: string) => void;
  onOpenActionMenu: (req: BalanceTransaction, rect: DOMRect) => void;
}

export function AdminPointsRequestsTable({
  requests,
  paginatedRequests,
  loading,
  visibleColumns,
  onApproveRequest,
  onOpenRejectModal,
  onPreviewReceipt,
  onOpenActionMenu,
}: AdminPointsRequestsTableProps) {
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
            جاري تحميل طلبات المعاملات...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <i
            className="bx bx-receipt"
            style={{ fontSize: "3.5rem", color: "var(--text-muted)", marginBottom: "16px" }}
          />
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            لا توجد طلبات معاملات تطابق الفلاتر المحددة.
          </p>
        </div>
      ) : (
        <div className={styles.table05Scroll}>
          <table className={styles.table05}>
            <thead>
              <tr>
                {visibleColumns.user && (
                  <th className={styles.table05Th} style={{ minWidth: "160px" }}>
                    المستخدم
                  </th>
                )}
                {visibleColumns.type && (
                  <th className={styles.table05Th} style={{ minWidth: "90px" }}>
                    النوع
                  </th>
                )}
                {visibleColumns.amount && (
                  <th className={styles.table05Th} style={{ minWidth: "110px" }}>
                    المبلغ
                  </th>
                )}
                {visibleColumns.method && (
                  <th className={styles.table05Th} style={{ minWidth: "170px" }}>
                    بيانات التحويل
                  </th>
                )}
                {visibleColumns.receipt && (
                  <th className={styles.table05Th} style={{ minWidth: "90px" }}>
                    الإيصال
                  </th>
                )}
                {visibleColumns.created_at && (
                  <th className={styles.table05Th} style={{ minWidth: "120px" }}>
                    التاريخ
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
                    style={{ minWidth: "140px", textAlign: "center" }}
                  >
                    خيارات الإدارة
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((req) => (
                <tr key={req.id} className={styles.table05Tr}>
                  {visibleColumns.user && (
                    <td className={styles.table05Td}>
                      <div style={{ fontWeight: 700, color: "var(--color-fg)" }}>
                        {req.profiles?.full_name || "اسم غير متوفر"}
                      </div>
                      <span
                        style={{
                          fontSize: "0.76rem",
                          color: "var(--color-primary)",
                          display: "block",
                          marginTop: "2px",
                        }}
                      >
                        @{req.profiles?.username || "بدون_يوزر"}
                      </span>
                      {req.profiles?.phone && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-muted)",
                            display: "block",
                          }}
                        >
                          {req.profiles?.phone}
                        </span>
                      )}
                    </td>
                  )}

                  {visibleColumns.type && (
                    <td className={styles.table05Td}>
                      <span
                        className={
                          req.type === "deposit"
                            ? styles.typeBadgeDeposit
                            : styles.typeBadgeWithdrawal
                        }
                      >
                        <i
                          className={`bx ${
                            req.type === "deposit"
                              ? "bx-down-arrow-circle"
                              : "bx-up-arrow-circle"
                          }`}
                        />
                        <span>{req.type === "deposit" ? "إيداع" : "سحب"}</span>
                      </span>
                    </td>
                  )}

                  {visibleColumns.amount && (
                    <td
                      className={styles.table05Td}
                      style={{
                        fontWeight: 900,
                        color: "var(--color-fg)",
                        fontSize: "0.95rem",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {(req.amount || 0).toFixed(2)} ج.م
                    </td>
                  )}

                  {visibleColumns.method && (
                    <td className={styles.table05Td} style={{ fontSize: "0.78rem", lineHeight: "1.6" }}>
                      <div>
                        الوسيلة: <strong>{getMethodName(req.method)}</strong>
                      </div>
                      <div>
                        رقم/حساب:{" "}
                        <span style={{ direction: "ltr", display: "inline-block", fontWeight: 700 }}>
                          {req.provider_number}
                        </span>
                      </div>
                      {req.recipient_name && (
                        <div>
                          الاسم: <strong>{req.recipient_name}</strong>
                        </div>
                      )}
                      {req.transaction_id && (
                        <div>
                          العملية:{" "}
                          <span style={{ color: "#fbbf24", fontWeight: 700 }}>
                            {req.transaction_id}
                          </span>
                        </div>
                      )}
                    </td>
                  )}

                  {visibleColumns.receipt && (
                    <td className={styles.table05Td}>
                      {req.image_url ? (
                        <button
                          type="button"
                          onClick={() => onPreviewReceipt(req.image_url!)}
                          className="btn"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "4px 10px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "var(--color-primary)",
                            borderColor: "var(--border-glass)",
                          }}
                        >
                          <i className="bx bx-image-alt" style={{ fontSize: "1rem" }} />
                          <span>معاينة</span>
                        </button>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                          لا يوجد
                        </span>
                      )}
                    </td>
                  )}

                  {visibleColumns.created_at && (
                    <td
                      className={styles.table05Td}
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {new Date(req.created_at).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  )}

                  {visibleColumns.status && (
                    <td className={styles.table05Td}>
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
                    </td>
                  )}

                  {visibleColumns.actions && (
                    <td className={styles.table05Td} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          justifyContent: "center",
                        }}
                      >
                        {req.status === "pending" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onApproveRequest(req)}
                              className="btn"
                              style={{
                                padding: "4px 10px",
                                fontSize: "0.76rem",
                                background: "#10b981",
                                color: "#fff",
                                borderColor: "#10b981",
                                fontWeight: 700,
                                gap: "4px",
                              }}
                            >
                              <i className="bx bx-check" />
                              <span>موافقة</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenRejectModal(req)}
                              className="btn"
                              style={{
                                padding: "4px 10px",
                                fontSize: "0.76rem",
                                background: "#ef4444",
                                color: "#fff",
                                borderColor: "#ef4444",
                                fontWeight: 700,
                                gap: "4px",
                              }}
                            >
                              <i className="bx bx-x" />
                              <span>رفض</span>
                            </button>
                          </>
                        ) : (
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {req.status === "approved" && "تمت الموافقة"}
                            {req.status === "rejected" && (
                              <div style={{ maxWidth: "150px", wordBreak: "break-word" }}>
                                {req.admin_notes || "مرفوض"}
                              </div>
                            )}
                          </div>
                        )}

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
