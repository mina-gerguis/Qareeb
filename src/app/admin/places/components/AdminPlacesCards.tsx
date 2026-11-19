import React, { useState } from "react";
import clsx from "clsx";
import { DBPlace } from "../types";
import styles from "../admin-places.module.css";
import { CATEGORY_MAP, getCategoryColor } from "../utils";
import {
  IconDotsFilled,
  IconMapPin,
  IconBuildingStore,
  IconPhoneCall,
  IconClock,
  IconEye,
  IconEdit,
  IconTrash,
  IconCheck,
} from "@tabler/icons-react";

interface Props {
  places: DBPlace[];
  selectedIds: string[];
  dbDuplicatesList: { originalId: string; duplicateId: string; place: DBPlace }[];
  onToggleSelect: (id: string) => void;
  onViewPlace: (place: DBPlace) => void;
  onEditPlace: (place: DBPlace) => void;
  onOpenBranches: (place: DBPlace) => void;
  onDeletePlace: (place: DBPlace) => void;
  onOpenActionMenu: (place: DBPlace, rect: DOMRect) => void;
  activeActionPlaceId?: string;
}

function ImageCardThumb({ src, alt }: { src?: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: "rgba(108, 99, 255, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-primary)",
          flexShrink: 0,
        }}
      >
        <IconBuildingStore size={24} />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        overflow: "hidden",
        flexShrink: 0,
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid var(--border-glass)",
      }}
    >
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
            animation: "pulse 1.5s infinite",
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export const AdminPlacesCards: React.FC<Props> = ({
  places,
  selectedIds,
  dbDuplicatesList,
  onToggleSelect,
  onViewPlace,
  onEditPlace,
  onOpenBranches,
  onDeletePlace,
  onOpenActionMenu,
  activeActionPlaceId,
}) => {
  if (places.length === 0) {
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
        لا توجد أماكن مسجلة تطابق البحث أو التصفية
      </div>
    );
  }

  return (
    <div className={styles.stationCardsList}>
      {places.map((place) => {
        const isSelected = selectedIds.includes(place.id);
        const isDbDuplicate = dbDuplicatesList.some((d) => d.duplicateId === place.id);
        const catColor = getCategoryColor(place.category);
        const mainImg = place.images && place.images.length > 0 ? place.images[0] : "";
        const branchesCount = place.branches ? place.branches.length : 1;

        let is24_7 = false;
        try {
          if (place.working_hours === "24/7") is24_7 = true;
          else if (place.working_hours?.startsWith("{")) {
            const parsed = JSON.parse(place.working_hours);
            if (parsed.type === "24/7") is24_7 = true;
          }
        } catch {}

        return (
          <div
            key={place.id}
            className={clsx(
              styles.stationCard,
              isSelected && styles.table05TrSelected
            )}
            style={{
              border: isSelected
                ? "1px solid var(--color-primary, #6c63ff)"
                : undefined,
            }}
          >
            {/* Header: Checkbox + Thumb + Name + MoreMenu */}
            <div className={styles.stationCardHeader}>
              <div className={styles.stationCardMain} style={{ minWidth: 0, flex: 1 }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(place.id)}
                  className={styles.checkboxInput}
                  title="تحديد المكان"
                />

                <div
                  onClick={() => onViewPlace(place)}
                  style={{ cursor: "pointer", flexShrink: 0 }}
                >
                  <ImageCardThumb src={mainImg} alt={place.name} />
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    onClick={() => onViewPlace(place)}
                    className={styles.stationCardName}
                    style={{
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "1rem",
                    }}
                  >
                    {place.name}
                  </div>

                  {place.name_en && (
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                        direction: "ltr",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {place.name_en}
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.68rem",
                        background: "rgba(255, 255, 255, 0.06)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        color: "var(--text-secondary)",
                        userSelect: "all",
                      }}
                    >
                      {place.id}
                    </span>

                    {isDbDuplicate && (
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: "#ff9500",
                          background: "rgba(255, 149, 0, 0.15)",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                        }}
                      >
                        ⚠️ مكرر
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Menu button */}
              <div className={styles.actionMenuWrapper}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    onOpenActionMenu(place, rect);
                  }}
                  className={clsx(
                    styles.moreMenuBtn,
                    activeActionPlaceId === place.id && styles.moreMenuBtnActive
                  )}
                  title="خيارات إضافية"
                  aria-label="خيارات إضافية"
                >
                  <IconDotsFilled size={18} />
                </button>
              </div>
            </div>

            {/* Badges Row */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px" }}>
              <span
                className={styles.lineBadge}
                style={{
                  background: `${catColor}20`,
                  color: catColor,
                  border: `1px solid ${catColor}50`,
                }}
              >
                {place.category_label || CATEGORY_MAP[place.category] || place.category}
              </span>

              {place.place_type && (
                <span
                  className={styles.landmarkChip}
                  style={{ color: "var(--color-primary)" }}
                >
                  {place.place_type_icon && <i className={place.place_type_icon} style={{ marginLeft: "3px" }} />}
                  {place.place_type}
                </span>
              )}

              {(place.sub_categories || []).slice(0, 2).map((sc) => (
                <span key={sc} className={styles.landmarkChip}>
                  {CATEGORY_MAP[sc] || sc}
                </span>
              ))}

              <span
                className={styles.statusPill}
                style={{
                  background: "rgba(108, 99, 255, 0.12)",
                  color: "var(--color-primary)",
                  border: "1px solid rgba(108, 99, 255, 0.25)",
                }}
              >
                <i className="bx bx-buildings" style={{ marginLeft: "4px" }} />
                {branchesCount} {branchesCount === 1 ? "فرع" : "فروع"}
              </span>
            </div>

            {/* Info Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem" }}>
              {/* Location */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-fg)" }}>
                <IconMapPin size={16} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                <span>
                  {place.city ? `${place.city}، ` : ""}
                  {place.governorate || "غير محدد"}
                </span>
              </div>

              {/* Phone */}
              {place.phones && place.phones.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                  <IconPhoneCall size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                  <span style={{ direction: "ltr" }}>{place.phones[0]}</span>
                  {place.phones.length > 1 && (
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      (+{place.phones.length - 1} أخرى)
                    </span>
                  )}
                </div>
              )}

              {/* Working Hours */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                <IconClock size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                {is24_7 ? (
                  <span style={{ color: "#34c759", fontWeight: 700 }}>24/7 مفتوح دائماً</span>
                ) : (
                  <span>مواعيد عمل محددة</span>
                )}
              </div>
            </div>

            {/* Features preview */}
            {place.features && place.features.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {place.features.slice(0, 3).map((feat, idx) => (
                  <span
                    key={idx}
                    className={styles.landmarkChip}
                    style={{ fontSize: "0.72rem", color: "#2ecc71" }}
                  >
                    <IconCheck size={12} />
                    {feat}
                  </span>
                ))}
                {place.features.length > 3 && (
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", padding: "2px 4px" }}>
                    +{place.features.length - 3} أخرى
                  </span>
                )}
              </div>
            )}

            {/* Actions Footer */}
            <div className={styles.stationCardActions}>
              <button
                type="button"
                onClick={() => onViewPlace(place)}
                className="btn btn-cancel w-full"
                title="عرض تفاصيل المكان"
                style={{ flex: 1, padding: "8px 10px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
              >
                <IconEye size={16} />
                <span>عرض</span>
              </button>

              <button
                type="button"
                onClick={() => onEditPlace(place)}
                className="btn btn-blue w-full"
                title="تعديل المكان"
                style={{ flex: 1, padding: "8px 10px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
              >
                <IconEdit size={16} />
                <span>تعديل</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenBranches(place)}
                className="btn btn-cancel w-full"
                title="إدارة الفروع"
                style={{ flex: 1, padding: "8px 10px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
              >
                <i className="bx bx-buildings" />
                <span>الفروع</span>
              </button>

              <button
                type="button"
                onClick={() => onDeletePlace(place)}
                className="btn btn-error w-full"
                title="حذف المكان"
                style={{ padding: "8px 10px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              >
                <IconTrash size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
