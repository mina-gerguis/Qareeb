"use client";

import React from "react";
import CustomModal from "@/components/common/Modals";
import { ParkingSpot } from "../types";

interface AdminParkingDeleteModalProps {
  spot?: ParkingSpot | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isBulk?: boolean;
  bulkCount?: number;
}

export function AdminParkingDeleteModal({
  spot,
  isDeleting,
  onConfirm,
  onCancel,
  isBulk = false,
  bulkCount = 0,
}: AdminParkingDeleteModalProps) {
  const isOpen = isBulk ? bulkCount > 0 : Boolean(spot);

  const title = isBulk ? "تأكيد الحذف الجماعي" : "تأكيد الحذف";
  const message = isBulk
    ? `هل أنت متأكد من رغبتك في حذف (${bulkCount}) جراج محدد نهائياً من قاعدة البيانات؟`
    : "هل أنت متأكد من حذف هذا الجراج مع كافة بيانات الأسعار والسعة والخدمات التابعة له؟";

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
      {!isBulk && spot && (
        <p style={{ margin: "0", color: "#ff4d4d", fontSize: "1.05rem", fontWeight: "bold", textAlign: "center" }}>
          « {spot.name} »
        </p>
      )}
    </CustomModal>
  );
}
