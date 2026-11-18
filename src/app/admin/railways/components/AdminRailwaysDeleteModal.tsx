import React from "react";
import CustomModal from "@/components/common/Modals";

interface AdminRailwaysDeleteModalProps {
  itemToDelete: { type: "line" | "station"; item: any; index?: number } | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminRailwaysDeleteModal({
  itemToDelete,
  isDeleting,
  onConfirm,
  onCancel,
}: AdminRailwaysDeleteModalProps) {
  if (!itemToDelete) return null;

  const isLine = itemToDelete.type === "line";
  const name = isLine ? itemToDelete.item?.name : itemToDelete.item?.name;

  return (
    <CustomModal
      isOpen={Boolean(itemToDelete)}
      onClose={() => !isDeleting && onCancel()}
      title="تأكيد الحذف"
      titleColor="#ff3b30"
      borderColor="rgba(255, 59, 48, 0.25)"
      message={
        isLine
          ? "هل أنت متأكد من حذف هذا المسار وجميع محطاته التابعة؟ لا يمكن التراجع عن هذا الإجراء."
          : "هل أنت متأكد من حذف هذه المحطة من المسار؟"
      }
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
      {name && (
        <p style={{ margin: "0", color: "#ff4d4d", fontSize: "1.05rem", fontWeight: "bold", textAlign: "center" }}>
          « {name} »
        </p>
      )}
    </CustomModal>
  );
}
