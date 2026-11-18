"use client";

import React, { useState } from "react";
import { TelecomCodeEntry, CompanyKey } from "../types";
import { COMPANY_META, COMPANY_LABELS } from "../constants";
import directoryStyles from "../admin-directory.module.css";
import { formatBoxIcon } from "@/data/places";
import {
  IconCopy,
  IconCheck,
  IconWritingSignFilled,
  IconSquareRoundedXFilled,
  IconId,
  IconDeviceMobile,
} from "@tabler/icons-react";

interface AdminCodeDetailsModalProps {
  code: TelecomCodeEntry | null;
  onClose: () => void;
  onEdit: (code: TelecomCodeEntry) => void;
}

export function AdminCodeDetailsModal({
  code,
  onClose,
  onEdit,
}: AdminCodeDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!code) return null;

  const meta = COMPANY_META[code.company as CompanyKey];
  const parts = (code.code || "").split(" | ");
  const rawCode = parts[0] || code.code;
  const note = parts[1];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rawCode);
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
            <span
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: meta?.activeBg || "rgba(59, 130, 246, 0.15)",
                color: meta?.color || "#3b82f6",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
              }}
            >
              {meta?.logo ? (
                <img
                  src={meta.logo}
                  alt={meta.label}
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <IconDeviceMobile size={22} />
              )}
            </span>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.2rem",
                  fontWeight: "900",
                  color: "var(--color-fg)",
                }}
              >
                {code.title}
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "3px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: meta?.color || "var(--color-fg)",
                  }}
                >
                  {meta?.label || COMPANY_LABELS[code.company] || code.company}
                </span>
                <span style={{ color: "var(--text-muted)" }}>•</span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted, #94a3b8)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {code.icon && (
                    <i
                      className={formatBoxIcon(code.icon)}
                      style={{ color: "#818cf8" }}
                    />
                  )}
                  <span>{code.section_name}</span>
                </span>
              </div>
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
          {/* Code Value Box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(56, 189, 248, 0.08)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              padding: "16px 20px",
              borderRadius: "14px",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted, #94a3b8)",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                الكود الرقمي المطلوب طلبه:
              </span>
              <span
                style={{
                  direction: "ltr",
                  display: "block",
                  fontSize: "1.45rem",
                  fontWeight: 800,
                  color: "var(--color-secondary, #38bdf8)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {rawCode}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="btn btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 16px",
                fontSize: "0.9rem",
              }}
              title="نسخ الكود"
            >
              {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
              <span>{copied ? "تم النسخ" : "نسخ الكود"}</span>
            </button>
          </div>

          {/* Note or Instruction */}
          {note && (
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
                ملاحظات وطريقة الاستخدام:
              </span>
              <div
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "var(--color-fg)",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-glass)",
                  padding: "12px 14px",
                  borderRadius: "10px",
                }}
              >
                {note}
              </div>
            </div>
          )}

          {/* Metadata */}
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
                {code.id}
              </span>
            </div>
            {code.created_at && (
              <div>تاريخ الإنشاء: {new Date(code.created_at).toLocaleString("ar-EG")}</div>
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
              onEdit(code);
            }}
            className="btn btn-blue"
          >
            <IconWritingSignFilled size={18} />
            <span>تعديل الكود</span>
          </button>
        </div>
      </div>
    </div>
  );
}
