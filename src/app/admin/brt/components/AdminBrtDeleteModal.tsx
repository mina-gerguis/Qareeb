"use client";

import React from "react";
import CustomModal from "@/components/common/Modals";
import { AdminBrtStation } from "../types";

interface AdminBrtDeleteModalProps {
  itemToDelete?: AdminBrtStation | null;
  bulkDeleteCount?: number;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminBrtDeleteModal({
  itemToDelete,
  bulkDeleteCount = 0,
  isDeleting,
  onConfirm,
  onCancel,
}: AdminBrtDeleteModalProps) {
  const isBulk = bulkDeleteCount > 0;
  const isOpen = Boolean(itemToDelete || isBulk);

  const title = isBulk ? "تأكيد الحذف الجماعي" : "تأكيد حذف المحطة";
  const message = isBulk
    ? `هل أنت متأكد من رغبتك في حذف (${bulkDeleteCount}) محطة محددة مع جميع مساراتها؟ لا يمكن التراجع عن هذا الإجراء.`
    : `هل أنت متأكد من حذف محطة « ${itemToDelete?.name || ""} » مع كافة مساراتها وتفاصيلها؟`;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => !isDeleting && onCancel()}
      title={title}
      titleColor="#ff3b30"
      borderColor="rgba(255, 59, 48, 0.25)"
      message={message}
      primaryButton={{
        label: isDeleting ? "جاري ..." : "نعم، احذف",
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
    />
  );
}
