"use client";

import React, { useState } from "react";
import { PhoneEntry } from "../types";
import directoryStyles from "../admin-directory.module.css";
import { formatBoxIcon } from "@/data/places";
import {
  IconPhoneCall,
  IconCopy,
  IconCheck,
  IconWritingSignFilled,
  IconSquareRoundedXFilled,
  IconBuilding,
  IconId,
} from "@tabler/icons-react";

interface AdminPhoneDetailsModalProps {
  phone: PhoneEntry | null;
  onClose: () => void;
  onEdit: (phone: PhoneEntry) => void;
}

export function AdminPhoneDetailsModal({
  phone,
  onClose,
  onEdit,
}: AdminPhoneDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!phone) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone.phone_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={directoryStyles.modalOverlay} onClick={onClose}>
      <div
        className={directoryStyles.modalContent}
        style={{ maxWidth: "580px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={directoryStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {phone.logo_url ? (
              <img
                src={phone.logo_url}
                alt={phone.name}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  border: "1px solid var(--border-glass)",
                }}
              />
            ) : (
              <span
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#3b82f6",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                }}
              >
                <i className={formatBoxIcon(phone.icon || "bx-building")} />
              </span>
            )}
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.2rem",
                  fontWeight: "900",
                  color: "var(--color-fg)",
                }}
              >
                {phone.name}
              </h3>
              <span
                style={{
                  fontSize: "0.82rem",
                  color: "var(--color-primary, #3b82f6)",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "2px",
                }}
              >
                <i className={formatBoxIcon(phone.icon || "bx-building")} />
                <span>{phone.specialty}</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={directoryStyles.modalCloseBtn}
            aria-label="إغلاق"
            type="button"
          >
            <IconSquareRoundedXFilled size={20} />
          </button>
        </div>

        {/* Body */}
        <div
          className={directoryStyles.modalBody}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "20px",
          }}
        >
          {/* Phone Display Card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              padding: "12px 18px",
              borderRadius: "12px",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted, #94a3b8)",
                  display: "block",
                  marginBottom: "2px",
                }}
              >
                رقم الهاتف أو الخط الساخن:
              </span>
              <span
                style={{
                  direction: "ltr",
                  display: "block",
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  color: "#10b981",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {phone.phone_number}
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="btn btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 12px",
                }}
                title="نسخ الرقم"
              >
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                <span>{copied ? "تم النسخ" : "نسخ"}</span>
              </button>

              <a
                href={`tel:${phone.phone_number}`}
                className="btn btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  background: "#10b981",
                  borderColor: "#10b981",
                }}
                title="اتصال الآن"
              >
                <IconPhoneCall size={18} />
                <span>اتصال</span>
              </a>
            </div>
          </div>

          {/* Description */}
          {phone.description && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  marginBottom: "4px",
                }}
              >
                الوصف والملاحظات:
              </span>
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "var(--color-fg)",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-glass)",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  margin: 0,
                }}
              >
                {phone.description}
              </p>
            </div>
          )}

          {/* Metadata / Technical IDs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "8px",
              borderTop: "1px solid var(--border-glass)",
              paddingTop: "12px",
              fontSize: "0.8rem",
              color: "var(--text-muted, #94a3b8)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <IconId size={15} />
              <span>معرّف السجل (ID): </span>
              <span style={{ fontFamily: "monospace", color: "var(--color-fg)" }}>
                {phone.id}
              </span>
            </div>
            {phone.created_at && (
              <div>تاريخ الإنشاء: {new Date(phone.created_at).toLocaleString("ar-EG")}</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={directoryStyles.modalFooter}>
          <button type="button" onClick={onClose} className="btn btn-cancel">
            إغلاق
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(phone);
            }}
            className="btn btn-blue"
          >
            <IconWritingSignFilled size={18} />
            <span>تعديل البيانات</span>
          </button>
        </div>
      </div>
    </div>
  );
}
