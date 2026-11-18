"use client";

import React from "react";
import CustomModal from "@/components/common/Modals";
import { BusStation } from "../types";

interface AdminBusStationsDeleteModalProps {
  station: BusStation | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminBusStationsDeleteModal({
  station,
  isDeleting,
  onConfirm,
  onCancel,
}: AdminBusStationsDeleteModalProps) {
  return (
    <CustomModal
      isOpen={Boolean(station)}
      onClose={() => !isDeleting && onCancel()}
      title="تأكيد الحذف"
      titleColor="#ff3b30"
      borderColor="rgba(255, 59, 48, 0.25)"
      message="هل أنت متأكد من حذف موقف الأتوبيس هذا مع كافة الشركات والوجهات التابعة له؟"
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
      {station && (
        <p style={{ margin: "0", color: "#ff4d4d", fontSize: "1.05rem", fontWeight: "bold", textAlign: "center" }}>
          « {station.name} »
        </p>
      )}
    </CustomModal>
  );
}
