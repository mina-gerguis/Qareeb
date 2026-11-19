"use client";

import React from "react";
import CustomModal from "@/components/common/Modals";
import { DeleteModalState } from "../types";

interface Props {
  deleteModal: DeleteModalState;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AdminPlaceDeleteModal: React.FC<Props> = ({
  deleteModal,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  if (!deleteModal.isOpen) return null;

  const isBulk = deleteModal.isBulk;
  const count = deleteModal.bulkCount || 0;
  const place = deleteModal.place;

  const title = isBulk ? "تأكيد حذف الأماكن المحددة" : "تأكيد حذف المكان";
  const message = isBulk
    ? `هل أنت متأكد من رغبتك في حذف (${count}) مكان محدد نهائياً من قاعدة البيانات مع كافة فروعها وبياناتها؟ لا يمكن التراجع عن هذا الإجراء.`
    : "هل أنت متأكد من رغبتك في حذف هذا المكان نهائياً من قاعدة البيانات مع كافة فروعه وبياناته؟ لا يمكن التراجع عن هذه الخطوة.";

  return (
    <CustomModal
      isOpen={deleteModal.isOpen}
      onClose={() => !isDeleting && onCancel()}
      title={title}
      titleColor="#ff3b30"
      borderColor="rgba(255, 59, 48, 0.25)"
      message={message}
      primaryButton={{
        label: isDeleting ? "جاري الحذف..." : isBulk ? `نعم، احذف (${count})` : "نعم، احذف المكان",
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
      {!isBulk && place && (
        <p
          style={{
            margin: "0",
            color: "#ff4d4d",
            fontSize: "1.05rem",
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          « {place.name} »
        </p>
      )}
    </CustomModal>
  );
};
