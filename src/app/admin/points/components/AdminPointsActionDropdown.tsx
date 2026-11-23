"use client";

import React from "react";
import {
  IconWritingSignFilled,
  IconCopy,
  IconCheck,
  IconX,
  IconPhoto,
} from "@tabler/icons-react";
import {
  ActionMenuState,
  UserProfile,
  BalanceTransaction,
  AdminPromoLedgerEntry,
} from "../types";
import styles from "../admin-points.module.css";

interface AdminPointsActionDropdownProps {
  actionMenu: ActionMenuState | null;
  onClose: () => void;
  onEditUser: (user: UserProfile) => void;
  onApproveRequest: (req: BalanceTransaction) => void;
  onRejectRequest: (req: BalanceTransaction) => void;
  onPreviewReceipt: (imageUrl: string) => void;
}

export function AdminPointsActionDropdown({
  actionMenu,
  onClose,
  onEditUser,
  onApproveRequest,
  onRejectRequest,
  onPreviewReceipt,
}: AdminPointsActionDropdownProps) {
  if (!actionMenu) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`تم نسخ ${label} بنجاح!`);
    onClose();
  };

  return (
    <div
      className={styles.actionDropdownMenu}
      style={{
        position: "fixed",
        top: `${actionMenu.top}px`,
        left: `${actionMenu.left}px`,
        zIndex: 99999,
      }}
      role="menu"
      dir="rtl"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* USER ACTIONS */}
      {actionMenu.type === "user" && (
        <>
          {(() => {
            const user = actionMenu.item as UserProfile;
            return (
              <>
                <button
                  type="button"
                  className={styles.actionDropdownItem}
                  onClick={() => {
                    onClose();
                    onEditUser(user);
                  }}
                >
                  <IconWritingSignFilled size={18} style={{ color: "var(--color-primary)" }} />
                  <span>تعديل النقاط والأرصدة</span>
                </button>

                <div className={styles.actionDropdownSeparator} />

                {user.username && (
                  <button
                    type="button"
                    className={styles.actionDropdownItem}
                    onClick={() => copyToClipboard(`@${user.username}`, "اسم المستخدم")}
                  >
                    <IconCopy size={16} />
                    <span>نسخ اسم المستخدم</span>
                  </button>
                )}

                {user.email && (
                  <button
                    type="button"
                    className={styles.actionDropdownItem}
                    onClick={() => copyToClipboard(user.email!, "البريد الإلكتروني")}
                  >
                    <IconCopy size={16} />
                    <span>نسخ البريد</span>
                  </button>
                )}

                {user.phone && (
                  <button
                    type="button"
                    className={styles.actionDropdownItem}
                    onClick={() => copyToClipboard(user.phone!, "رقم الهاتف")}
                  >
                    <IconCopy size={16} />
                    <span>نسخ رقم الهاتف</span>
                  </button>
                )}
              </>
            );
          })()}
        </>
      )}

      {/* REQUEST ACTIONS */}
      {actionMenu.type === "request" && (
        <>
          {(() => {
            const req = actionMenu.item as BalanceTransaction;
            return (
              <>
                {req.status === "pending" && (
                  <>
                    <button
                      type="button"
                      className={`${styles.actionDropdownItem} ${styles.actionDropdownItemSuccess}`}
                      onClick={() => {
                        onClose();
                        onApproveRequest(req);
                      }}
                    >
                      <IconCheck size={18} />
                      <span>موافقة على الطلب</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.actionDropdownItem} ${styles.actionDropdownItemDanger}`}
                      onClick={() => {
                        onClose();
                        onRejectRequest(req);
                      }}
                    >
                      <IconX size={18} />
                      <span>رفض الطلب</span>
                    </button>

                    <div className={styles.actionDropdownSeparator} />
                  </>
                )}

                {req.image_url && (
                  <button
                    type="button"
                    className={styles.actionDropdownItem}
                    onClick={() => {
                      onClose();
                      onPreviewReceipt(req.image_url!);
                    }}
                  >
                    <IconPhoto size={18} style={{ color: "var(--color-primary)" }} />
                    <span>معاينة الإيصال</span>
                  </button>
                )}

                {req.provider_number && (
                  <button
                    type="button"
                    className={styles.actionDropdownItem}
                    onClick={() => copyToClipboard(req.provider_number, "رقم التحويل")}
                  >
                    <IconCopy size={16} />
                    <span>نسخ رقم الحساب</span>
                  </button>
                )}

                {req.transaction_id && (
                  <button
                    type="button"
                    className={styles.actionDropdownItem}
                    onClick={() => copyToClipboard(req.transaction_id!, "رقم العملية")}
                  >
                    <IconCopy size={16} />
                    <span>نسخ رقم العملية</span>
                  </button>
                )}
              </>
            );
          })()}
        </>
      )}

      {/* PROMO ACTIONS */}
      {actionMenu.type === "promo" && (
        <>
          {(() => {
            const item = actionMenu.item as AdminPromoLedgerEntry;
            return (
              <>
                {item.sourceCode && (
                  <button
                    type="button"
                    className={styles.actionDropdownItem}
                    onClick={() => copyToClipboard(item.sourceCode!, "الكود المرجعي")}
                  >
                    <IconCopy size={16} />
                    <span>نسخ الكود المرجعي</span>
                  </button>
                )}
                {item.userUsername && (
                  <button
                    type="button"
                    className={styles.actionDropdownItem}
                    onClick={() => copyToClipboard(`@${item.userUsername}`, "اسم المستخدم")}
                  >
                    <IconCopy size={16} />
                    <span>نسخ يوزر المستخدم</span>
                  </button>
                )}
              </>
            );
          })()}
        </>
      )}
    </div>
  );
}
