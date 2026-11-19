"use client";

import React, { useState } from "react";
import { PlaceProposal, UserProfile } from "../types";
import { STATUS_META } from "../constants";
import suggestionsStyles from "../admin-suggestions.module.css";
import {
  IconSquareRoundedXFilled,
  IconMapPin,
  IconPhoneCall,
  IconCheck,
  IconX,
  IconTrashFilled,
  IconExternalLink,
  IconUser,
  IconChecklist,
} from "@tabler/icons-react";

interface AdminSuggestionDetailsModalProps {
  proposal: PlaceProposal | null;
  onClose: () => void;
  onViewProposer: (userProfile: UserProfile | null, userId: string) => void;
  onApprove: (proposal: PlaceProposal) => void;
  onReject: (proposal: PlaceProposal) => void;
  onDelete: (proposal: PlaceProposal) => void;
  isProcessing?: boolean;
}

export function AdminSuggestionDetailsModal({
  proposal,
  onClose,
  onViewProposer,
  onApprove,
  onReject,
  onDelete,
  isProcessing = false,
}: AdminSuggestionDetailsModalProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  if (!proposal) return null;

  const statusInfo = STATUS_META[proposal.status];
  const images =
    proposal.images && proposal.images.length > 0
      ? proposal.images
      : proposal.image_url
      ? [proposal.image_url]
      : [];

  return (
    <div className={suggestionsStyles.modalOverlay} onClick={onClose}>
      <div
        className={suggestionsStyles.modalContent}
        style={{ maxWidth: "720px", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={suggestionsStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "0.78rem",
                padding: "4px 10px",
                borderRadius: "10px",
                background: statusInfo?.bg || "rgba(255, 255, 255, 0.08)",
                color: statusInfo?.color || "var(--color-fg)",
                border: `1px solid ${statusInfo?.border || "transparent"}`,
                fontWeight: 700,
              }}
            >
              {statusInfo?.label || proposal.status}
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
                {proposal.name}
              </h3>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {proposal.category_label || proposal.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={suggestionsStyles.modalCloseBtn}
            aria-label="إغلاق"
            type="button"
          >
            <IconSquareRoundedXFilled size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className={suggestionsStyles.modalBody}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          {/* Images Gallery */}
          {images.length > 0 ? (
            <div>
              <div
                style={{
                  width: "100%",
                  height: "260px",
                  borderRadius: "14px",
                  overflow: "hidden",
                  position: "relative",
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid var(--border-glass)",
                }}
              >
                <img
                  src={images[activeImgIdx] || images[0]}
                  alt={proposal.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e: any) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80";
                  }}
                />
              </div>

              {/* Thumbnails if multiple */}
              {images.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    overflowX: "auto",
                    marginTop: "8px",
                    paddingBottom: "4px",
                  }}
                >
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImgIdx(i)}
                      style={{
                        width: "60px",
                        height: "46px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border:
                          activeImgIdx === i
                            ? "2px solid var(--color-primary, #3b82f6)"
                            : "1px solid var(--border-glass)",
                        padding: 0,
                        cursor: "pointer",
                        background: "none",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={img}
                        alt="thumb"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "140px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.02)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed var(--border-glass)",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              لا توجد صور مرفقة مع هذا المقترح
            </div>
          )}

          {/* Quick Actions Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                proposal.status === "pending"
                  ? "repeat(auto-fit, minmax(110px, 1fr))"
                  : "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "10px",
            }}
          >
            {/* Directions Link */}
            <a
              href={
                proposal.location_url ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  proposal.name + " " + proposal.city
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 8px",
                borderRadius: "12px",
                gap: "4px",
                textDecoration: "none",
              }}
            >
              <IconMapPin size={20} style={{ color: "#3b82f6" }} />
              <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>الاتجاهات</span>
            </a>

            {/* Direct Phone Call */}
            {proposal.phone ? (
              <a
                href={`tel:${proposal.phone}`}
                className="btn btn-secondary"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 8px",
                  borderRadius: "12px",
                  gap: "4px",
                  textDecoration: "none",
                }}
              >
                <IconPhoneCall size={20} style={{ color: "#10b981" }} />
                <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>اتصال</span>
              </a>
            ) : (
              <div
                className="btn btn-secondary"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 8px",
                  borderRadius: "12px",
                  gap: "4px",
                  opacity: 0.5,
                }}
              >
                <IconPhoneCall size={20} />
                <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>بلا هاتف</span>
              </div>
            )}

            {/* Pending actions: Approve & Reject */}
            {proposal.status === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => onApprove(proposal)}
                  disabled={isProcessing}
                  className="btn btn-primary"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 8px",
                    borderRadius: "12px",
                    gap: "4px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    borderColor: "#10b981",
                  }}
                >
                  <IconCheck size={20} />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>موافقة ونشر</span>
                </button>

                <button
                  type="button"
                  onClick={() => onReject(proposal)}
                  disabled={isProcessing}
                  className="btn btn-error"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 8px",
                    borderRadius: "12px",
                    gap: "4px",
                  }}
                >
                  <IconX size={20} />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>رفض</span>
                </button>
              </>
            )}

            {/* Delete Proposal */}
            <button
              type="button"
              onClick={() => onDelete(proposal)}
              disabled={isProcessing}
              className="btn btn-error"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 8px",
                borderRadius: "12px",
                gap: "4px",
              }}
            >
              <IconTrashFilled size={20} />
              <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>حذف</span>
            </button>
          </div>

          {/* Proposer Info Card */}
          <div>
            <span
              style={{
                display: "block",
                fontSize: "0.86rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
                marginBottom: "8px",
              }}
            >
              صاحب الاقتراح:
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(59, 130, 246, 0.08)",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                borderRadius: "14px",
                padding: "12px 16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={
                    proposal.user_profile?.avatar_url ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80"
                  }
                  alt="Proposer"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--color-primary, #3b82f6)",
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-fg)" }}>
                    {proposal.user_profile?.full_name ||
                      proposal.user_profile?.username ||
                      "مستخدم قريب"}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    تاريخ التقديم:{" "}
                    {proposal.created_at
                      ? new Date(proposal.created_at).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onViewProposer(proposal.user_profile || null, proposal.user_id)
                }
                className="btn btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                }}
              >
                <IconUser size={16} />
                <span>البروفايل الكامل</span>
              </button>
            </div>
          </div>

          {/* Description */}
          {proposal.description && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                الوصف والملاحظات:
              </span>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                  color: "var(--color-fg)",
                }}
              >
                {proposal.description}
              </div>
            </div>
          )}

          {/* Services */}
          {proposal.services && proposal.services.length > 0 && (
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                الخدمات والميزات المتوفرة:
              </span>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                }}
              >
                {proposal.services.map((srv, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(59, 130, 246, 0.25)",
                      color: "var(--color-primary, #3b82f6)",
                    }}
                  >
                    <IconChecklist size={15} />
                    <span>{srv}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Address and Location */}
          <div>
            <span
              style={{
                display: "block",
                fontSize: "0.86rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
                marginBottom: "8px",
              }}
            >
              العنوان والبيانات الجغرافية:
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border-glass)",
                borderRadius: "12px",
                overflow: "hidden",
                fontSize: "0.88rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border-glass)",
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>المحافظة / المدينة:</span>
                <span style={{ fontWeight: 700, color: "var(--color-fg)" }}>
                  {proposal.governorate} - {proposal.city}
                </span>
              </div>

              {proposal.address && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border-glass)",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>العنوان التفصيلي:</span>
                  <span style={{ fontWeight: 600, color: "var(--color-fg)" }}>
                    {proposal.address}
                  </span>
                </div>
              )}

              {proposal.location_url && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>رابط الخريطة:</span>
                  <a
                    href={proposal.location_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#3b82f6",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    <span>فتح في خرائط جوجل</span>
                    <IconExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Reason if Rejected */}
          {proposal.status === "rejected" && proposal.rejection_reason && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "12px",
                padding: "14px 18px",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#ef4444",
                  marginBottom: "4px",
                }}
              >
                سبب الرفض:
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  color: "var(--color-fg)",
                  lineHeight: 1.5,
                }}
              >
                {proposal.rejection_reason}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={suggestionsStyles.modalFooter}>
          <button type="button" onClick={onClose} className="btn btn-cancel">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
