import React from "react";
import clsx from "clsx";
import { PhoneEntry, VisibleColumnsPhones } from "../types";
import directoryStyles from "../admin-directory.module.css";
import { formatBoxIcon } from "@/data/places";
import { IconDotsFilled, IconPhoneCall } from "@tabler/icons-react";

interface AdminPhonesTableProps {
  phones: PhoneEntry[];
  visibleColumns: VisibleColumnsPhones;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewPhone: (phone: PhoneEntry) => void;
  onToggleActionMenu: (
    phone: PhoneEntry,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
  activeActionPhoneId?: string;
}

export function AdminPhonesTable({
  phones,
  visibleColumns,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewPhone,
  onToggleActionMenu,
  activeActionPhoneId,
}: AdminPhonesTableProps) {
  const allSelected =
    phones.length > 0 && phones.every((p) => selectedIds.has(p.id));

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

              {visibleColumns.logo && (
                <th
                  className={directoryStyles.table05Th}
                  style={{ width: "60px", textAlign: "center" }}
                >
                  اللوجو
                </th>
              )}

              {visibleColumns.name && (
                <th
                  className={directoryStyles.table05Th}
                  style={{ minWidth: "180px" }}
                >
                  الاسم والجهة
                </th>
              )}

              {visibleColumns.specialty && (
                <th
                  className={directoryStyles.table05Th}
                  style={{ minWidth: "130px" }}
                >
                  التخصص
                </th>
              )}

              {visibleColumns.phone && (
                <th
                  className={directoryStyles.table05Th}
                  style={{ minWidth: "140px", textAlign: "right" }}
                >
                  رقم الهاتف / الخط الساخن
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
            {phones.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className={directoryStyles.table05Td}
                  style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}
                >
                  لا توجد أرقام مسجلة تطابق البحث أو التصفية
                </td>
              </tr>
            ) : (
              phones.map((phone) => {
                const isSelected = selectedIds.has(phone.id);
                const isMenuOpen = activeActionPhoneId === phone.id;

                return (
                  <tr
                    key={phone.id}
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
                          onChange={() => onToggleSelect(phone.id)}
                          style={{
                            cursor: "pointer",
                            width: "16px",
                            height: "16px",
                          }}
                          title="تحديد"
                        />
                      </td>
                    )}

                    {visibleColumns.logo && (
                      <td
                        className={directoryStyles.table05Td}
                        style={{ textAlign: "center" }}
                      >
                        {phone.logo_url ? (
                          <img
                            src={phone.logo_url}
                            alt={phone.name}
                            loading="lazy"
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              objectFit: "cover",
                              border: "1px solid var(--border-glass)",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              background: "rgba(59, 130, 246, 0.12)",
                              color: "#3b82f6",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.1rem",
                            }}
                          >
                            <i className={formatBoxIcon(phone.icon || "bx-building")} />
                          </div>
                        )}
                      </td>
                    )}

                    {visibleColumns.name && (
                      <td className={directoryStyles.table05Td}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <button
                            type="button"
                            onClick={() => onViewPhone(phone)}
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
                            {phone.name}
                          </button>
                          {phone.description && (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--text-muted, #94a3b8)",
                                maxWidth: "260px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={phone.description}
                            >
                              {phone.description}
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {visibleColumns.specialty && (
                      <td className={directoryStyles.table05Td}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "var(--color-primary, #3b82f6)",
                            border: "1px solid rgba(59, 130, 246, 0.25)",
                          }}
                        >
                          <i
                            className={formatBoxIcon(phone.icon || "bx-building")}
                            style={{ fontSize: "0.95rem" }}
                          />
                          <span>{phone.specialty || "بدون تخصص"}</span>
                        </span>
                      </td>
                    )}

                    {visibleColumns.phone && (
                      <td
                        className={directoryStyles.table05Td}
                        style={{ textAlign: "right" }}
                      >
                        <a
                          href={`tel:${phone.phone_number}`}
                          style={{
                            direction: "ltr",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#10b981",
                            fontWeight: 700,
                            fontSize: "0.92rem",
                            textDecoration: "none",
                            background: "rgba(16, 185, 129, 0.1)",
                            padding: "3px 10px",
                            borderRadius: "8px",
                            border: "1px solid rgba(16, 185, 129, 0.25)",
                          }}
                        >
                          <IconPhoneCall size={15} />
                          <span>{phone.phone_number}</span>
                        </a>
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
                            onClick={(e) => onToggleActionMenu(phone, e)}
                            className={clsx(
                              directoryStyles.moreMenuBtn,
                              isMenuOpen && directoryStyles.moreMenuBtnActive
                            )}
                            title="خيارات الرقم"
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
