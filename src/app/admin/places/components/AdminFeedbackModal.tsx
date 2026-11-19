"use client";

import React from "react";
import CustomModal from "@/components/common/Modals";
import { DeleteAlertModalState } from "../types";

interface Props {
  alertState: DeleteAlertModalState | null;
  onClose: () => void;
}

export const AdminFeedbackModal: React.FC<Props> = ({ alertState, onClose }) => {
  if (!alertState || !alertState.isOpen) return null;

  const isSuccess = alertState.type === "success";

  return (
    <CustomModal
      isOpen={alertState.isOpen}
      onClose={onClose}
      title={alertState.title}
      titleColor={isSuccess ? "var(--color-primary)" : "var(--color-danger, #ff3b30)"}
      borderColor={isSuccess ? "var(--color-primary)" : "var(--color-danger, #ff3b30)"}
      iconNode={
        isSuccess ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.4rem",
            }}
          >
            <i className="bx bx-check-circle" style={{ color: "var(--color-primary)", fontSize: "3.2rem" }} />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(255, 59, 48, 0.25) 0%, rgba(220, 38, 38, 0.1) 100%)",
              border: "2px solid rgba(255, 59, 48, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ff3b30",
              fontSize: "2.4rem",
              boxShadow: "0 0 25px rgba(255, 59, 48, 0.35)",
            }}
          >
            <i className="bx bx-error-circle" />
          </div>
        )
      }
      message={alertState.message}
      primaryButton={{
        label: "حسناً",
        onClick: onClose,
        bgColor: isSuccess ? "var(--color-primary)" : "var(--color-danger, #ff3b30)",
        icon: <i className={isSuccess ? "bx bx-check" : "bx bx-x"} style={{ fontSize: "1.2rem" }} />,
      }}
    >
      {alertState.placeName && (
        <p style={{ margin: "-8px 0 16px 0", color: "var(--color-primary)", fontSize: "1.05rem", fontWeight: "bold", textAlign: "center" }}>
          « {alertState.placeName} »
        </p>
      )}
    </CustomModal>
  );
};
