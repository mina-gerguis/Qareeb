"use client";

import React from "react";
import CustomModal from "@/components/common/Modals";
import { PlaceProposal } from "../types";

interface AdminSuggestionRejectModalProps {
  proposal: PlaceProposal | null;
  rejectionReason: string;
  onReasonChange: (val: string) => void;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminSuggestionRejectModal({
  proposal,
  rejectionReason,
  onReasonChange,
  isProcessing,
  onConfirm,
  onCancel,
}: AdminSuggestionRejectModalProps) {
  if (!proposal) return null;

  return (
    <CustomModal
      isOpen={Boolean(proposal)}
      onClose={() => !isProcessing && onCancel()}
      title="تأكيد رفض الاقتراح"
      titleColor="#ff3b30"
      iconSrc="/images/threeD/alert.webp"
      borderColor="rgba(255, 59, 48, 0.25)"
      message={`سبب رفض المكان: « ${proposal.name} »`}
      primaryButton={{
        label: isProcessing ? "جاري الحفظ..." : "تأكيد الرفض",
        onClick: onConfirm,
        bgColor: "#ff3b30",
        disabled: isProcessing || !rejectionReason.trim(),
        icon: <i className="bx bx-x-circle" style={{ fontSize: "1.2rem" }} />,
      }}
      secondaryButton={{
        label: "إلغاء",
        onClick: onCancel,
        bgColor: "var(--btn-cancel)",
        disabled: isProcessing,
        icon: <i className="bx bx-x" style={{ fontSize: "1.2rem" }} />,
      }}
    >
      <div style={{ textAlign: "right" }}>
        <p
          style={{
            fontSize: "0.88rem",
            color: "var(--text-secondary)",
            marginBottom: "12px",
            lineHeight: "1.5",
          }}
        >
          يرجى توضيح سبب الرفض بالتفصيل للمستخدم. سيتم إرسال إشعار له يوضح السبب مع
          إمكانية تعديل الاقتراح وإعادة إرساله.
        </p>
        <textarea
          rows={4}
          required
          placeholder="اكتب سبب الرفض هنا بالتفصيل..."
          className="input-fields"
          value={rejectionReason}
          onChange={(e) => onReasonChange(e.target.value)}
          style={{
            width: "100%",
            resize: "vertical",
            direction: "rtl",
            fontFamily: "var(--font-cairo)",
          }}
        />
      </div>
    </CustomModal>
  );
}
