import React from "react";
import { DBPlace } from "../types";
import styles from "../admin-places.module.css";
import { CATEGORY_MAP, getCategoryColor } from "../utils";
import {
  IconX,
  IconMapPin,
  IconPhoneCall,
  IconClock,
  IconBuildingStore,
  IconWorld,
  IconCheck
} from "@tabler/icons-react";

interface Props {
  place: DBPlace | null;
  onClose: () => void;
  onEdit: (place: DBPlace) => void;
  onOpenBranches: (place: DBPlace) => void;
}

export const AdminPlaceDetailsModal: React.FC<Props> = ({
  place,
  onClose,
  onEdit,
  onOpenBranches,
}) => {
  if (!place) return null;

  const catColor = getCategoryColor(place.category);
  const branchesCount = place.branches ? place.branches.length : 1;

  let scheduleObj: any = null;
  let is24_7 = false;
  try {
    if (place.working_hours === "24/7") {
      is24_7 = true;
    } else if (place.working_hours?.startsWith("{")) {
      scheduleObj = JSON.parse(place.working_hours);
      if (scheduleObj.type === "24/7") is24_7 = true;
    }
  } catch { }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{ maxWidth: "780px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: `${catColor}20`,
                color: catColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem"
              }}
            >
              <IconBuildingStore size={22} />
            </div>
            <div>
              <h3 className={styles.modalTitle} style={{ margin: 0 }}>
                {place.name}
              </h3>
              {place.name_en && (
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", direction: "ltr", textAlign: "right" }}>
                  {place.name_en}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.modalCloseBtn}
            aria-label="إغلاق"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* Images preview if available */}
          {place.images && place.images.length > 0 && (
            <div style={{ marginBottom: "16px", borderRadius: "12px", overflow: "hidden", maxHeight: "240px" }}>
              <img
                src={place.images[0]}
                alt={place.name}
                style={{ width: "100%", height: "240px", objectFit: "cover" }}
              />
            </div>
          )}

          {/* Quick Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            <span
              className={styles.tagBadge}
              style={{
                background: `${catColor}20`,
                color: catColor,
                borderColor: `${catColor}40`,
                fontWeight: 700
              }}
            >
              {place.category_label || CATEGORY_MAP[place.category] || place.category}
            </span>

            {place.place_type && (
              <span className={styles.tagBadge} style={{ color: "var(--color-primary)" }}>
                {place.place_type_icon && <i className={place.place_type_icon} />}
                {place.place_type}
              </span>
            )}

            {(place.sub_categories || []).map(sc => (
              <span key={sc} className={styles.tagBadge}>
                {CATEGORY_MAP[sc] || sc}
              </span>
            ))}

            <span
              className={styles.tagBadge}
              style={{ color: "var(--color-primary)", background: "rgba(108, 99, 255, 0.1)" }}
            >
              <i className="bx bx-buildings" />
              {branchesCount} {branchesCount === 1 ? "فرع" : "فروع"}
            </span>

            <span
              className={styles.tagBadge}
              style={{
                fontFamily: "monospace",
                color: "var(--text-muted)",
                background: "rgba(255, 255, 255, 0.05)"
              }}
            >
              ID: {place.id}
            </span>
          </div>

          {/* Short description */}
          {place.short_description && (
            <div style={{ marginBottom: "14px", fontStyle: "italic", color: "var(--text-secondary)", fontSize: "0.92rem" }}>
              "{place.short_description}"
            </div>
          )}

          {/* Full description */}
          {place.description && (
            <div style={{ marginBottom: "18px", lineHeight: "1.6", color: "var(--color-fg)", fontSize: "0.9rem", background: "rgba(255,255,255,0.02)", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
              {place.description}
            </div>
          )}

          {/* Grid Info */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "18px" }}>
            {/* Location */}
            <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--color-primary)", marginBottom: "4px", fontSize: "0.85rem" }}>
                <IconMapPin size={16} />
                العنوان والموقع
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-fg)" }}>
                {place.city ? `${place.city}، ` : ""}{place.governorate}
              </div>
              {place.full_address && (
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {place.full_address}
                </div>
              )}
              {place.google_maps_url && (
                <a
                  href={place.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.78rem", color: "var(--color-primary)", display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "6px" }}
                >
                  فتح الموقع على الخريطة ↗
                </a>
              )}
            </div>

            {/* Phones & Contact */}
            <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--color-primary)", marginBottom: "4px", fontSize: "0.85rem" }}>
                <IconPhoneCall size={16} />
                أرقام التواصل
              </div>
              {place.phones && place.phones.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem" }}>
                  {place.phones.map((ph, idx) => (
                    <span key={idx} style={{ direction: "ltr", textAlign: "right" }}>{ph}</span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>لا توجد أرقام مسجلة</span>
              )}
              {place.website_url && (
                <div style={{ marginTop: "6px" }}>
                  <a
                    href={place.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "0.78rem", color: "var(--color-primary)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <IconWorld size={14} />
                    زيارة الموقع الإلكتروني
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Working Hours */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-glass)", marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--color-primary)", marginBottom: "8px", fontSize: "0.85rem" }}>
              <IconClock size={16} />
              مواعيد العمل
            </div>
            {is24_7 ? (
              <span style={{ color: "#34c759", fontWeight: 700, fontSize: "0.9rem" }}>
                المكان يعمل 24 ساعة يومياً (24/7)
              </span>
            ) : scheduleObj?.schedule ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "6px", fontSize: "0.8rem" }}>
                {scheduleObj.schedule.map((dayItem: any) => (
                  <div key={dayItem.day} style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "4px 8px", borderRadius: "6px" }}>
                    <span style={{ fontWeight: 600 }}>{dayItem.day}:</span>
                    {dayItem.isWorking ? (
                      <span style={{ color: "var(--text-secondary)" }}>
                        {dayItem.openTime} {dayItem.openPeriod} - {dayItem.closeTime} {dayItem.closePeriod}
                      </span>
                    ) : (
                      <span style={{ color: "#ff3b30", fontWeight: 600 }}>إجازة</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {place.working_hours || "غير محددة"}
              </span>
            )}
          </div>

          {/* Features and Services */}
          {(place.features && place.features.length > 0 || place.services && place.services.length > 0) && (
            <div style={{ marginBottom: "18px" }}>
              <div style={{ fontWeight: 700, color: "var(--color-fg)", marginBottom: "8px", fontSize: "0.88rem" }}>
                المميزات والخدمات المتاحة:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {(place.features || []).map((feat, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.78rem",
                      background: "rgba(46, 204, 113, 0.1)",
                      color: "#2ecc71",
                      border: "1px solid rgba(46, 204, 113, 0.25)",
                      padding: "4px 10px",
                      borderRadius: "20px"
                    }}
                  >
                    <IconCheck size={14} />
                    {feat}
                  </span>
                ))}
                {(place.services || []).map((serv, idx) => (
                  <span
                    key={`serv-${idx}`}
                    style={{
                      fontSize: "0.78rem",
                      background: "rgba(108, 99, 255, 0.1)",
                      color: "var(--color-primary)",
                      border: "1px solid rgba(108, 99, 255, 0.25)",
                      padding: "4px 10px",
                      borderRadius: "20px"
                    }}
                  >
                    {serv}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBranches(place);
            }}
            className="btn btn-cancel"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <i className="bx bx-buildings" />
            إدارة الفروع ({branchesCount})
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(place);
            }}
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <i className="bx bx-edit" />
            تعديل البيانات
          </button>
        </div>
      </div>
    </div>
  );
};
