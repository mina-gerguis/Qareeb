"use client";

import React from "react";
import CustomModal from "@/components/common/Modals";
import { DeleteModalState } from "../types";

interface AdminSuggestionDeleteModalProps {
  deleteModal: DeleteModalState;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminSuggestionDeleteModal({
  deleteModal,
  isProcessing,
  onConfirm,
  onCancel,
}: AdminSuggestionDeleteModalProps) {
  if (!deleteModal) return null;

  const isBulk = deleteModal.type === "bulk";
  const title = isBulk ? "تأكيد الحذف الجماعي" : "تأكيد حذف الاقتراح";
  const message = isBulk
    ? `هل أنت متأكد من حذف (${deleteModal.ids.length}) من الاقتراحات المحددة نهائياً؟`
    : "هل أنت متأكد من رغبتك في حذف هذا الاقتراح نهائياً من قاعدة البيانات؟";

  return (
    <CustomModal
      isOpen={Boolean(deleteModal)}
      onClose={() => !isProcessing && onCancel()}
      title={title}
      titleColor="#ff3b30"
      iconSrc="/images/threeD/trash.webp"
      borderColor="rgba(255, 59, 48, 0.25)"
      message={message}
      primaryButton={{
        label: isProcessing ? "جاري الحذف..." : "نعم، احذف",
        onClick: onConfirm,
        bgColor: "#ff3b30",
        disabled: isProcessing,
        icon: <i className="bx bx-trash" style={{ fontSize: "1.2rem" }} />,
      }}
      secondaryButton={{
        label: "إلغاء",
        onClick: onCancel,
        bgColor: "var(--btn-cancel)",
        disabled: isProcessing,
        icon: <i className="bx bx-x" style={{ fontSize: "1.2rem" }} />,
      }}
    >
      {!isBulk && deleteModal.proposal && (
        <p
          style={{
            margin: "0",
            color: "#ff4d4d",
            fontSize: "1.05rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          « {deleteModal.proposal.name} »
        </p>
      )}
    </CustomModal>
  );
}
