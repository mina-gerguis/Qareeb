"use client";

import React from "react";
import CustomModal from "@/components/common/Modals";
import { DeleteModalState } from "../types";

interface AdminDirectoryDeleteModalProps {
  deleteModal: DeleteModalState;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminDirectoryDeleteModal({
  deleteModal,
  isDeleting,
  onConfirm,
  onCancel,
}: AdminDirectoryDeleteModalProps) {
  if (!deleteModal) return null;

  let title = "تأكيد الحذف";
  let message = "هل أنت متأكد من حذف هذا السجل نهائياً؟";
  let itemName = "";

  if (deleteModal.type === "phone") {
    title = "تأكيد حذف الرقم الخدمي";
    message = "هل أنت متأكد من حذف هذا الرقم الخدمي نهائياً من قاعدة البيانات؟";
    itemName = deleteModal.item.name;
  } else if (deleteModal.type === "code") {
    title = "تأكيد حذف كود الخدمة";
    message = "هل أنت متأكد من حذف كود هذه الخدمة نهائياً من قاعدة البيانات؟";
    itemName = deleteModal.item.title;
  } else if (deleteModal.type === "bulk-phones") {
    title = "تأكيد الحذف الجماعي للأرقام الخدمية";
    message = `هل أنت متأكد من حذف (${deleteModal.ids.length}) من الأرقام الخدمية المحددة نهائياً؟`;
  } else if (deleteModal.type === "bulk-codes") {
    title = "تأكيد الحذف الجماعي لأكواد الاتصالات";
    message = `هل أنت متأكد من حذف (${deleteModal.ids.length}) من أكواد الاتصالات المحددة نهائياً؟`;
  }

  return (
    <CustomModal
      isOpen={Boolean(deleteModal)}
      onClose={() => !isDeleting && onCancel()}
      title={title}
      titleColor="#ff3b30"
      borderColor="rgba(255, 59, 48, 0.25)"
      message={message}
      primaryButton={{
        label: isDeleting ? "جاري الحذف..." : "نعم، احذف",
        onClick: onConfirm,
        bgColor: "#ff3b30",
        disabled: isDeleting,
        icon: <i className="bx bx-trash" style={{ fontSize: "1.2rem" }} />,
      }}
      secondaryButton={{
        label: "إلغاء",
        onClick: onCancel,
        bgColor: "var(--btn-cancel)",
        disabled: isDeleting,
        icon: <i className="bx bx-x" style={{ fontSize: "1.2rem" }} />,
      }}
    >
      {itemName && (
        <p
          style={{
            margin: "0",
            color: "#ff4d4d",
            fontSize: "1.05rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          « {itemName} »
        </p>
      )}
    </CustomModal>
  );
}
