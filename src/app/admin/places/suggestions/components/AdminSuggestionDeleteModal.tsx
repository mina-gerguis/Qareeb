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
      message={message}
      primaryButton={{
        label: isProcessing ? "جاري ..." : " احذف",
        onClick: onConfirm,
        disabled: isProcessing,
      }}
      secondaryButton={{
        label: "إلغاء",
        onClick: onCancel,
        disabled: isProcessing,
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
