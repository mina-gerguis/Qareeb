"use client";

import React from "react";
import CustomModal from "@/components/common/Modals";
import { Airport } from "../types";

interface AdminAirportsDeleteModalProps {
  airport?: Airport | null;
  isBulk?: boolean;
  bulkCount?: number;
  isOpen?: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminAirportsDeleteModal({
  airport,
  isBulk = false,
  bulkCount = 0,
  isOpen = false,
  isDeleting,
  onConfirm,
  onCancel,
}: AdminAirportsDeleteModalProps) {
  const show = isOpen || Boolean(airport);

  const title = isBulk ? "تأكيد الحذف الجماعي للمطارات" : "تأكيد حذف المطار";
  const message = isBulk
    ? `هل أنت متأكد من حذف (${bulkCount}) من المطارات المحددة نهائياً؟ لا يمكن التراجع عن هذه الخطوة.`
    : "هل أنت متأكد من حذف هذا المطار نهائياً من قاعدة البيانات؟";

  return (
    <CustomModal
      isOpen={show}
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
      {!isBulk && airport && (
        <p style={{ margin: "0", color: "#ff4d4d", fontSize: "1.05rem", fontWeight: "bold", textAlign: "center" }}>
          « {airport.name_ar || (airport as any).name} »
        </p>
      )}
    </CustomModal>
  );
}
