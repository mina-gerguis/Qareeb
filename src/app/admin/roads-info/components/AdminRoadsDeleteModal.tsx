"use client";

import React from "react";
import CustomModal from "@/components/common/Modals";

interface AdminRoadsDeleteModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminRoadsDeleteModal({
  isOpen,
  title = "تأكيد الحذف",
  message = "هل أنت متأكد من حذف هذا العنصر نهائياً من قاعدة البيانات؟",
  itemName,
  isDeleting,
  onConfirm,
  onCancel,
}: AdminRoadsDeleteModalProps) {
  return (
    <CustomModal
      isOpen={isOpen}
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
        <p style={{ margin: "0", color: "#ff4d4d", fontSize: "1.05rem", fontWeight: "bold", textAlign: "center" }}>
          « {itemName} »
        </p>
      )}
    </CustomModal>
  );
}
