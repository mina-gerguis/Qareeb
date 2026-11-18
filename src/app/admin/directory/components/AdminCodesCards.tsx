import React, { useState } from "react";
import { TelecomCodeEntry, VisibleColumnsCodes, CompanyKey } from "../types";
import { COMPANY_META, COMPANY_LABELS } from "../constants";
import directoryStyles from "../admin-directory.module.css";
import { formatBoxIcon } from "@/data/places";
import {
  IconListDetailsFilled,
  IconWritingSignFilled,
  IconTrashFilled,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";

interface AdminCodesCardsProps {
  codes: TelecomCodeEntry[];
  visibleColumns: VisibleColumnsCodes;
  onViewCode: (code: TelecomCodeEntry) => void;
  onEditCode: (code: TelecomCodeEntry) => void;
  onDeleteCode: (code: TelecomCodeEntry) => void;
}

export function AdminCodesCards({
  codes,
  visibleColumns,
  onViewCode,
  onEditCode,
  onDeleteCode,
}: AdminCodesCardsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (id: string, codeStr: string) => {
    const raw = codeStr.split(" | ")[0] || codeStr;
    navigator.clipboard.writeText(raw);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  if (codes.length === 0) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "var(--text-muted, #94a3b8)",
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--border-glass)",
        }}
      >
        لا توجد أكواد مسجلة تطابق البحث أو التصفية
      </div>
    );
  }

  return (
    <div className={directoryStyles.stationCardsList}>
      {codes.map((item) => {
        const meta = COMPANY_META[item.company as CompanyKey];
        const parts = (item.code || "").split(" | ");
        const rawCode = parts[0] || item.code;
        const note = parts[1];

        return (
          <div key={item.id} className={directoryStyles.stationCard}>
            {/* Header: Company + Section */}
            <div className={directoryStyles.stationCardHeader}>
              <div className={directoryStyles.stationCardMain}>
                {visibleColumns.company && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      background: meta?.activeBg || "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${
                        meta?.activeBorder || "var(--border-glass)"
                      }`,
                      color: meta?.color || "var(--color-fg)",
                    }}
                  >
                    {meta?.logo && (
                      <img
                        src={meta.logo}
                        alt={meta.label}
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          objectFit: "contain",
                        }}
                      />
                    )}
                    <span>
                      {meta?.label || COMPANY_LABELS[item.company] || item.company}
                    </span>
                  </span>
                )}

                {visibleColumns.section && (
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted, #94a3b8)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {item.icon && (
                      <i
                        className={formatBoxIcon(item.icon)}
                        style={{ color: "#818cf8" }}
                      />
                    )}
                    <span>{item.section_name}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Service Title */}
            {visibleColumns.title && (
              <h3 className={directoryStyles.stationCardName} style={{ margin: "4px 0" }}>
                {item.title}
              </h3>
            )}

            {/* Code Value Box */}
            {visibleColumns.code && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(255, 255, 255, 0.03)",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-glass)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: "var(--color-secondary, #38bdf8)",
                      direction: "ltr",
                      textAlign: "right",
                    }}
                  >
                    {rawCode}
                  </span>
                  {note && (
                    <span
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text-muted, #94a3b8)",
                      }}
                    >
                      {note}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(item.id, item.code)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background:
                      copiedId === item.id
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(255, 255, 255, 0.06)",
                    border: `1px solid ${
                      copiedId === item.id
                        ? "rgba(16, 185, 129, 0.3)"
                        : "var(--border-glass)"
                    }`,
                    color: copiedId === item.id ? "#10b981" : "var(--color-fg)",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                  }}
                  title="نسخ الكود"
                >
                  {copiedId === item.id ? (
                    <>
                      <IconCheck size={16} />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <IconCopy size={16} />
                      <span>نسخ</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {visibleColumns.actions && (
              <div className={directoryStyles.stationCardActions}>
                <button
                  type="button"
                  onClick={() => onViewCode(item)}
                  className="btn btn-cancel w-full"
                  title="عرض التفاصيل"
                >
                  <IconListDetailsFilled size={18} />
                  <span>تفاصيل</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEditCode(item)}
                  className="btn btn-blue w-full"
                  title="تعديل"
                >
                  <IconWritingSignFilled size={18} />
                  <span>تعديل</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteCode(item)}
                  className="btn btn-error"
                  style={{
                    padding: "0 12px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="حذف الكود"
                >
                  <IconTrashFilled size={18} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
