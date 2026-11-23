import React from "react";
import { PlaceProposal, VisibleColumns, UserProfile } from "../types";
import { STATUS_META } from "../constants";
import { getCategoryColor, CATEGORY_ICONS } from "../utils";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import suggestionsStyles from "../admin-suggestions.module.css";
import {
  IconMapPin,
  IconListDetailsFilled,
  IconCheck,
  IconX,
  IconTrashFilled,
  IconCalendar,
  IconPhotoFilled,
} from "@tabler/icons-react";

interface AdminSuggestionsCardsProps {
  proposals: PlaceProposal[];
  visibleColumns: VisibleColumns;
  onViewDetails: (proposal: PlaceProposal) => void;
  onViewProposer: (userProfile: UserProfile | null, userId: string) => void;
  onApprove: (proposal: PlaceProposal) => void;
  onReject: (proposal: PlaceProposal) => void;
  onDelete: (proposal: PlaceProposal) => void;
  isProcessing?: boolean;
}

export function AdminSuggestionsCards({
  proposals,
  visibleColumns,
  onViewDetails,
  onViewProposer,
  onApprove,
  onReject,
  onDelete,
  isProcessing = false,
}: AdminSuggestionsCardsProps) {
  if (proposals.length === 0) {
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
        لا توجد اقتراحات مسجلة تطابق البحث أو القسم المحدد
      </div>
    );
  }

  return (
    <div className={suggestionsStyles.stationCardsList}>
      {proposals.map((prop) => {
        const statusInfo = STATUS_META[prop.status];
        const catColor = getCategoryColor(prop.category);
        const catIcon = CATEGORY_ICONS[prop.category] || "bx-category";
        const firstImg =
          prop.images && prop.images.length > 0
            ? prop.images[0]
            : prop.image_url;

        return (
          <div key={prop.id} className={suggestionsStyles.stationCard}>
            {/* Image Preview Banner with Badges */}
            <div
              style={{
                width: "100%",
                height: "170px",
                position: "relative",
                overflow: "hidden",
                borderRadius: "12px",
                marginBottom: "12px",
                background: "rgba(255, 255, 255, 0.03)",
              }}
            >
              {firstImg ? (
                <img
                  src={firstImg}
                  alt={prop.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e: any) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    fontSize: "2rem",
                  }}
                >
                  <IconPhotoFilled />
                </div>
              )}

              {/* Category Badge (Top Right) */}
              <span
                className="font-sub"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: catColor,
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "8px",
                  backdropFilter: "blur(6px)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                }}
              >
                <CategoryIcon icon={catIcon} size={14} />
                <span>{prop.category_label || prop.category}</span>
              </span>

              {/* Status Badge (Top Left) */}
              <span
                className="font-sub"
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  background: statusInfo?.bg || "rgba(0,0,0,0.6)",
                  color: statusInfo?.color || "#fff",
                  border: `1px solid ${statusInfo?.border || "transparent"}`,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "8px",
                  backdropFilter: "blur(6px)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                }}
              >
                <i className={`bx ${statusInfo?.icon || "bx-info-circle"}`} />
                <span>{statusInfo?.label || prop.status}</span>
              </span>
            </div>

            {/* Header: Title & Location */}
            <div className={suggestionsStyles.stationCardHeader}>
              <div className={suggestionsStyles.stationCardMain}>
                <div>
                  <h3 className={suggestionsStyles.stationCardName}>
                    {prop.name}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted, #94a3b8)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "2px",
                    }}
                  >
                    <IconMapPin size={14} style={{ color: "var(--color-primary)" }} />
                    <span>
                      {prop.city} / {prop.governorate}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Description Snippet */}
            {prop.description && (
              <p
                style={{
                  fontSize: "0.83rem",
                  color: "var(--text-secondary, #cbd5e1)",
                  margin: "6px 0 0 0",
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
                {prop.description}
              </p>
            )}

            {/* Proposer Info Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border-glass)",
                marginTop: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                  src={
                    prop.user_profile?.avatar_url ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"
                  }
                  alt="Avatar"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid var(--border-glass)",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--color-fg)",
                    }}
                  >
                    {prop.user_profile?.full_name ||
                      prop.user_profile?.username ||
                      "مستخدم قريب"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onViewProposer(prop.user_profile || null, prop.user_id)
                }
                className="btn btn-secondary"
                style={{
                  padding: "3px 8px",
                  fontSize: "0.72rem",
                  minHeight: "26px",
                  fontWeight: 700,
                }}
              >
                👤 البروفايل
              </button>
            </div>

            {/* Date Tag */}
            {prop.created_at && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: "6px",
                }}
              >
                <IconCalendar size={13} />
                <span>
                  {new Date(prop.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className={suggestionsStyles.stationCardActions} style={{ marginTop: "12px" }}>
              {prop.status === "pending" ? (
                <>
                  <button
                    type="button"
                    onClick={() => onApprove(prop)}
                    disabled={isProcessing}
                    className="btn btn-primary w-full"
                    title="موافقة ونشر المكان"
                  >
                    <IconCheck size={18} />
                    <span>نشر</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReject(prop)}
                    disabled={isProcessing}
                    className="btn btn-error w-full"
                    title="رفض الاقتراح"
                  >
                    <IconX size={18} />
                    <span>رفض</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewDetails(prop)}
                    className="btn btn-cancel"
                    title="عرض التفاصيل"
                  >
                    <IconListDetailsFilled size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(prop)}
                    disabled={isProcessing}
                    className="btn btn-error"
                    style={{ padding: "0 12px" }}
                    title="حذف الاقتراح"
                  >
                    <IconTrashFilled size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onViewDetails(prop)}
                    className="btn btn-blue  w-full"
                    title="عرض التفاصيل"
                  >
                    <IconListDetailsFilled size={18} />
                    <span>عرض التفاصيل</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(prop)}
                    disabled={isProcessing}
                    className="btn btn-error w-full"
                    title="حذف الاقتراح"
                  >
                    <IconTrashFilled size={18} />
                    حذف
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
