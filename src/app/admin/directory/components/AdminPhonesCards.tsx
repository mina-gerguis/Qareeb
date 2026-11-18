import React from "react";
import { PhoneEntry, VisibleColumnsPhones } from "../types";
import directoryStyles from "../admin-directory.module.css";
import { formatBoxIcon } from "@/data/places";
import {
  IconListDetailsFilled,
  IconWritingSignFilled,
  IconTrashFilled,
  IconPhoneCall,
} from "@tabler/icons-react";

interface AdminPhonesCardsProps {
  phones: PhoneEntry[];
  visibleColumns: VisibleColumnsPhones;
  onViewPhone: (phone: PhoneEntry) => void;
  onEditPhone: (phone: PhoneEntry) => void;
  onDeletePhone: (phone: PhoneEntry) => void;
}

export function AdminPhonesCards({
  phones,
  visibleColumns,
  onViewPhone,
  onEditPhone,
  onDeletePhone,
}: AdminPhonesCardsProps) {
  if (phones.length === 0) {
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
        لا توجد جهات خدمية مسجلة تطابق البحث أو التصفية
      </div>
    );
  }

  return (
    <div className={directoryStyles.stationCardsList}>
      {phones.map((phone) => {
        return (
          <div key={phone.id} className={directoryStyles.stationCard}>
            {/* Header: Logo + Name + Specialty */}
            <div className={directoryStyles.stationCardHeader}>
              <div className={directoryStyles.stationCardMain}>
                {visibleColumns.logo && (
                  phone.logo_url ? (
                    <img
                      src={phone.logo_url}
                      alt={phone.name}
                      loading="lazy"
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        objectFit: "cover",
                        border: "1px solid var(--border-glass)",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background: "rgba(59, 130, 246, 0.12)",
                        color: "#3b82f6",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        flexShrink: 0,
                      }}
                    >
                      <i className={formatBoxIcon(phone.icon || "bx-building")} />
                    </div>
                  )
                )}

                <div>
                  <h3 className={directoryStyles.stationCardName}>
                    {phone.name}
                  </h3>
                  {visibleColumns.specialty && (
                    <span
                      style={{
                        fontSize: "0.8rem",
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
                  )}
                </div>
              </div>
            </div>

            {/* Phone Number Display */}
            {visibleColumns.phone && (
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
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-muted, #94a3b8)",
                  }}
                >
                  الرقم الخدمي:
                </span>
                <a
                  href={`tel:${phone.phone_number}`}
                  style={{
                    direction: "ltr",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#10b981",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                  }}
                >
                  <IconPhoneCall size={16} />
                  <span>{phone.phone_number}</span>
                </a>
              </div>
            )}

            {/* Description Snippet */}
            {phone.description && (
              <p
                style={{
                  fontSize: "0.83rem",
                  color: "var(--text-secondary, #cbd5e1)",
                  margin: "4px 0 0 0",
                  lineHeight: 1.5,
                  borderTop: "1px dashed rgba(255, 255, 255, 0.08)",
                  paddingTop: "8px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {phone.description}
              </p>
            )}

            {/* Action Buttons */}
            {visibleColumns.actions && (
              <div className={directoryStyles.stationCardActions}>
                <button
                  type="button"
                  onClick={() => onViewPhone(phone)}
                  className="btn btn-cancel w-full"
                  title="عرض التفاصيل"
                >
                  <IconListDetailsFilled size={18} />
                  <span>تفاصيل</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEditPhone(phone)}
                  className="btn btn-blue w-full"
                  title="تعديل"
                >
                  <IconWritingSignFilled size={18} />
                  <span>تعديل</span>
                </button>

                <a
                  href={`tel:${phone.phone_number}`}
                  className="btn btn-secondary"
                  style={{
                    padding: "0 12px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#10b981",
                  }}
                  title="اتصال مباشر"
                >
                  <IconPhoneCall size={18} />
                </a>

                <button
                  type="button"
                  onClick={() => onDeletePhone(phone)}
                  className="btn btn-error"
                  style={{
                    padding: "0 12px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="حذف الرقم"
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
