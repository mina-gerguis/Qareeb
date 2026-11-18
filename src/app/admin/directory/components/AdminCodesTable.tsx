import React from "react";
import clsx from "clsx";
import { TelecomCodeEntry, VisibleColumnsCodes, CompanyKey } from "../types";
import { COMPANY_META, COMPANY_LABELS } from "../constants";
import directoryStyles from "../admin-directory.module.css";
import { formatBoxIcon } from "@/data/places";
import { IconDotsFilled, IconCopy, IconCheck } from "@tabler/icons-react";

interface AdminCodesTableProps {
  codes: TelecomCodeEntry[];
  visibleColumns: VisibleColumnsCodes;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewCode: (code: TelecomCodeEntry) => void;
  onToggleActionMenu: (
    code: TelecomCodeEntry,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
  activeActionCodeId?: string;
}

export function AdminCodesTable({
  codes,
  visibleColumns,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewCode,
  onToggleActionMenu,
  activeActionCodeId,
}: AdminCodesTableProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyCode = (id: string, codeStr: string) => {
    const raw = codeStr.split(" | ")[0] || codeStr;
    navigator.clipboard.writeText(raw);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const allSelected =
    codes.length > 0 && codes.every((c) => selectedIds.has(c.id));

  return (
    <div className={directoryStyles.table05Container}>
      <div className={directoryStyles.table05Scroll}>
        <table className={directoryStyles.table05}>
          <thead>
            <tr>
              {visibleColumns.select && (
                <th
                  className={directoryStyles.table05Th}
                  style={{ width: "40px", textAlign: "center" }}
                >
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onToggleSelectAll}
                    style={{ cursor: "pointer", width: "16px", height: "16px" }}
                    title="تحديد الكل"
                  />
                </th>
              )}

              {visibleColumns.company && (
                <th
                  className={directoryStyles.table05Th}
                  style={{ minWidth: "120px" }}
                >
                  الشركة
                </th>
              )}

              {visibleColumns.section && (
                <th
                  className={directoryStyles.table05Th}
                  style={{ minWidth: "140px" }}
                >
                  القسم
                </th>
              )}

              {visibleColumns.title && (
                <th
                  className={directoryStyles.table05Th}
                  style={{ minWidth: "170px" }}
                >
                  اسم الخدمة
                </th>
              )}

              {visibleColumns.code && (
                <th
                  className={directoryStyles.table05Th}
                  style={{ minWidth: "160px", textAlign: "right" }}
                >
                  الكود الرقمي
                </th>
              )}

              {visibleColumns.actions && (
                <th
                  className={directoryStyles.table05Th}
                  style={{ width: "70px", textAlign: "center" }}
                >
                  إجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className={directoryStyles.table05Td}
                  style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}
                >
                  لا توجد أكواد مسجلة تطابق البحث أو التصفية
                </td>
              </tr>
            ) : (
              codes.map((item) => {
                const isSelected = selectedIds.has(item.id);
                const isMenuOpen = activeActionCodeId === item.id;
                const meta = COMPANY_META[item.company as CompanyKey];
                const parts = (item.code || "").split(" | ");
                const rawCode = parts[0] || item.code;
                const note = parts[1];

                return (
                  <tr
                    key={item.id}
                    className={clsx(
                      directoryStyles.table05Tr,
                      isSelected && directoryStyles.table05TrSelected
                    )}
                  >
                    {visibleColumns.select && (
                      <td
                        className={directoryStyles.table05Td}
                        style={{ textAlign: "center" }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(item.id)}
                          style={{
                            cursor: "pointer",
                            width: "16px",
                            height: "16px",
                          }}
                          title="تحديد"
                        />
                      </td>
                    )}

                    {visibleColumns.company && (
                      <td className={directoryStyles.table05Td}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            fontSize: "0.82rem",
                            fontWeight: "700",
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
                      </td>
                    )}

                    {visibleColumns.section && (
                      <td className={directoryStyles.table05Td}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "var(--color-fg)",
                            fontWeight: 600,
                            fontSize: "0.88rem",
                          }}
                        >
                          {item.icon && (
                            <i
                              className={formatBoxIcon(item.icon)}
                              style={{
                                color: "#818cf8",
                                fontSize: "1.05rem",
                              }}
                            />
                          )}
                          <span>{item.section_name}</span>
                        </div>
                      </td>
                    )}

                    {visibleColumns.title && (
                      <td className={directoryStyles.table05Td}>
                        <button
                          type="button"
                          onClick={() => onViewCode(item)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            font: "inherit",
                            textAlign: "right",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: "0.92rem",
                            color: "var(--color-fg)",
                          }}
                          className="hover:underline"
                        >
                          {item.title}
                        </button>
                      </td>
                    )}

                    {visibleColumns.code && (
                      <td
                        className={directoryStyles.table05Td}
                        style={{ textAlign: "right" }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "3px",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              direction: "ltr",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleCopyCode(item.id, item.code)}
                              style={{
                                background: "rgba(255, 255, 255, 0.06)",
                                border: "1px solid var(--border-glass)",
                                borderRadius: "6px",
                                padding: "3px 6px",
                                cursor: "pointer",
                                color:
                                  copiedId === item.id ? "#10b981" : "var(--text-muted)",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              title="نسخ الكود"
                            >
                              {copiedId === item.id ? (
                                <IconCheck size={14} />
                              ) : (
                                <IconCopy size={14} />
                              )}
                            </button>
                            <span
                              style={{
                                fontFamily: "var(--font-mono, monospace)",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                color: "var(--color-secondary, #38bdf8)",
                                background: "rgba(56, 189, 248, 0.1)",
                                padding: "2px 8px",
                                borderRadius: "6px",
                                border: "1px solid rgba(56, 189, 248, 0.25)",
                              }}
                            >
                              {rawCode}
                            </span>
                          </div>
                          {note && (
                            <span
                              style={{
                                fontSize: "0.76rem",
                                color: "var(--text-muted, #94a3b8)",
                                direction: "rtl",
                              }}
                            >
                              ({note})
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {visibleColumns.actions && (
                      <td
                        className={directoryStyles.table05Td}
                        style={{ textAlign: "center" }}
                      >
                        <div className={directoryStyles.actionMenuWrapper}>
                          <button
                            type="button"
                            onClick={(e) => onToggleActionMenu(item, e)}
                            className={clsx(
                              directoryStyles.moreMenuBtn,
                              isMenuOpen && directoryStyles.moreMenuBtnActive
                            )}
                            title="خيارات الكود"
                          >
                            <IconDotsFilled size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
