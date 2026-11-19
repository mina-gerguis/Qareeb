import React from "react";
import CustomModal from "@/components/common/Modals";
import { MonorailStation } from "../types";
import { IconTrashFilled, IconXFilled } from "@tabler/icons-react";

interface AdminMonorailDeleteModalProps {
  station: MonorailStation | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminMonorailDeleteModal({
  station,
  isDeleting,
  onConfirm,
  onCancel,
}: AdminMonorailDeleteModalProps) {
  return (
    <CustomModal
      isOpen={Boolean(station)}
      onClose={() => !isDeleting && onCancel()}
      title={`تأكيد الحذف محطة ${station?.name}`}
      message="هل أنت متأكد من حذف هذه المحطة من شبكة المونوريل؟"
      primaryButton={{
        label: isDeleting ? "جاري ..." : "احذف",
        onClick: onConfirm,
        disabled: isDeleting,
      }}
      secondaryButton={{
        label: "إلغاء",
        onClick: onCancel,
        disabled: isDeleting,
      }}
    >
      {station && (
        <p style={{ margin: "0", color: "var(--color-fg)", fontSize: "1.05rem", fontWeight: "bold", textAlign: "center" }}>
          « {station.name} »
        </p>
      )}
    </CustomModal>
  );
}
