"use client";

import React from "react";
import { UserProfile } from "../types";
import { getInterestObj } from "../utils";
import suggestionsStyles from "../admin-suggestions.module.css";
import {
  IconSquareRoundedXFilled,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCake,
  IconCalendar,
  IconTargetArrow,
  IconNotes,
} from "@tabler/icons-react";

interface AdminProposerProfileModalProps {
  userProfile: UserProfile | null;
  onClose: () => void;
}

export function AdminProposerProfileModal({
  userProfile,
  onClose,
}: AdminProposerProfileModalProps) {
  if (!userProfile) return null;

  return (
    <div className={suggestionsStyles.modalOverlay} onClick={onClose}>
      <div
        className={suggestionsStyles.modalContent}
        style={{ maxWidth: "520px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={suggestionsStyles.modalHeader}>
          <h3
            style={{
              margin: 0,
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "var(--color-fg)",
            }}
          >
            الملف التعريفي لصاحب الاقتراح
          </h3>
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
            gap: "16px",
            padding: "20px",
          }}
        >
          {/* Avatar & Name Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              background: "rgba(255, 255, 255, 0.03)",
              padding: "16px",
              borderRadius: "16px",
              border: "1px solid var(--border-glass)",
            }}
          >
            <img
              src={
                userProfile.avatar_url ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"
              }
              alt="Avatar"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--color-primary, #3b82f6)",
              }}
            />
            <div>
              <h4
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "var(--color-fg)",
                }}
              >
                {userProfile.full_name || "مستخدم قريب"}
              </h4>
              {userProfile.username && (
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-primary, #3b82f6)",
                    direction: "ltr",
                    textAlign: "right",
                    fontWeight: 600,
                  }}
                >
                  @{userProfile.username}
                </div>
              )}
            </div>
          </div>

          {/* Details Rows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "0.88rem",
            }}
          >
            {/* Email */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border-glass)",
                borderRadius: "10px",
              }}
            >
              <span
                style={{
                  color: "var(--text-muted)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <IconMail size={16} />
                <span>البريد الإلكتروني:</span>
              </span>
              <strong style={{ color: "var(--color-fg)", direction: "ltr" }}>
                {userProfile.email || "غير متوفر"}
              </strong>
            </div>

            {/* Phone */}
            {userProfile.phone && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    color: "var(--text-muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <IconPhone size={16} />
                  <span>رقم الهاتف:</span>
                </span>
                <a
                  href={`tel:${userProfile.phone}`}
                  style={{
                    color: "#10b981",
                    direction: "ltr",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  {userProfile.phone}
                </a>
              </div>
            )}

            {/* Location */}
            {(userProfile.governorate || userProfile.city) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    color: "var(--text-muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <IconMapPin size={16} />
                  <span>المحافظة / المدينة:</span>
                </span>
                <strong style={{ color: "var(--color-fg)" }}>
                  {userProfile.governorate || ""}{" "}
                  {userProfile.city ? `(${userProfile.city})` : ""}
                </strong>
              </div>
            )}

            {/* Date of Birth */}
            {userProfile.dob && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    color: "var(--text-muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <IconCake size={16} />
                  <span>تاريخ الميلاد:</span>
                </span>
                <strong style={{ color: "var(--color-fg)" }}>
                  {userProfile.dob}
                </strong>
              </div>
            )}

            {/* Join Date */}
            {userProfile.created_at && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    color: "var(--text-muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <IconCalendar size={16} />
                  <span>تاريخ الانضمام:</span>
                </span>
                <strong style={{ color: "var(--color-fg)" }}>
                  {new Date(userProfile.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </strong>
              </div>
            )}

            {/* Bio */}
            {userProfile.bio && (
              <div
                style={{
                  padding: "12px 14px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    marginBottom: "4px",
                    color: "var(--text-muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <IconNotes size={16} />
                  <span>نبذة شخصية:</span>
                </div>
                <div style={{ color: "var(--color-fg)", fontStyle: "italic" }}>
                  "{userProfile.bio}"
                </div>
              </div>
            )}

            {/* Interests */}
            {userProfile.interests && userProfile.interests.length > 0 && (
              <div
                style={{
                  padding: "12px 14px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    marginBottom: "8px",
                    fontWeight: 700,
                    color: "var(--color-fg)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <IconTargetArrow size={16} />
                  <span>الاهتمامات:</span>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {userProfile.interests.map((intKey, idx) => {
                    const item = getInterestObj(intKey);
                    return (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.8rem",
                          background: "rgba(59, 130, 246, 0.1)",
                          color: "var(--color-primary, #3b82f6)",
                          border: "1px solid rgba(59, 130, 246, 0.25)",
                          padding: "4px 10px",
                          borderRadius: "16px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontWeight: 600,
                        }}
                      >
                        <i className={item.icon} />
                        <span>{item.label}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className={suggestionsStyles.modalFooter}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary w-full"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
