"use client";

import React from "react";
import styles from "../admin-points.module.css";

interface AdminReceiptPreviewModalProps {
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminReceiptPreviewModal({
  imageUrl,
  isOpen,
  onClose,
}: AdminReceiptPreviewModalProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>معاينة إيصال التحويل</h3>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose}>
            <i className="bx bx-x" />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody} style={{ alignItems: "center", padding: "16px" }}>
          <div
            style={{
              width: "100%",
              maxHeight: "65vh",
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
              borderRadius: "12px",
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid var(--border-glass)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="إيصال التحويل"
              style={{
                maxWidth: "100%",
                maxHeight: "60vh",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter} style={{ justifyContent: "space-between" }}>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--color-primary)",
            }}
          >
            <i className="bx bx-link-external" />
            <span>فتح الصورة في نافذة جديدة</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="btn"
            style={{ padding: "10px 20px", fontSize: "0.85rem" }}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
