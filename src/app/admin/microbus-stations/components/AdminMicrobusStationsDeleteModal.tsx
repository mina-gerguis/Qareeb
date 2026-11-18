"use client";

import React from "react";
import CustomModal from "@/components/common/Modals";
import { AdminMicrobusStation } from "../types";

interface AdminMicrobusStationsDeleteModalProps {
  station?: AdminMicrobusStation | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isBulk?: boolean;
  bulkCount?: number;
}

export function AdminMicrobusStationsDeleteModal({
  station,
  isDeleting,
  onConfirm,
  onCancel,
  isBulk = false,
  bulkCount = 0,
}: AdminMicrobusStationsDeleteModalProps) {
  const isOpen = isBulk ? bulkCount > 0 : Boolean(station);

  const title = isBulk ? "تأكيد الحذف الجماعي" : "تأكيد الحذف";
  const message = isBulk
    ? `هل أنت متأكد من رغبتك في حذف (${bulkCount}) موقف سرفيس محدد نهائياً مع كافة خطوط السير الخاصة بهم؟`
    : "هل أنت متأكد من حذف موقف السرفيس هذا مع كافة الخطوط والمسارات المسجلة به؟";

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
      {!isBulk && station && (
        <p style={{ margin: "0", color: "#ff4d4d", fontSize: "1.05rem", fontWeight: "bold", textAlign: "center" }}>
          « {station.name} »
        </p>
      )}
    </CustomModal>
  );
}
