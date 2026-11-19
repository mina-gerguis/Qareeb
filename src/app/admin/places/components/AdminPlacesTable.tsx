import React, { useState } from "react";
import clsx from "clsx";
import { DBPlace, VisibleColumns } from "../types";
import styles from "../admin-places.module.css";
import { CATEGORY_MAP, getCategoryColor } from "../utils";
import { IconDotsFilled, IconMapPin, IconBuildingStore } from "@tabler/icons-react";

interface Props {
  places: DBPlace[];
  visibleColumns: VisibleColumns;
  selectedIds: string[];
  dbDuplicatesList: { originalId: string; duplicateId: string; place: DBPlace }[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewPlace: (place: DBPlace) => void;
  onOpenActionMenu: (place: DBPlace, rect: DOMRect) => void;
  activeActionPlaceId?: string;
}

function ImageWithSkeleton({ src, alt }: { src?: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "rgba(108, 99, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-primary)",
          fontSize: "1.2rem",
          flexShrink: 0
        }}
      >
        <IconBuildingStore size={20} />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        overflow: "hidden",
        flexShrink: 0,
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid var(--border-glass)"
      }}
    >
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
            animation: "pulse 1.5s infinite"
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
          transition: "opacity 0.25s ease"
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export const AdminPlacesTable: React.FC<Props> = ({
  places,
  visibleColumns,
  selectedIds,
  dbDuplicatesList,
  onToggleSelect,
  onToggleSelectAll,
  onViewPlace,
  onOpenActionMenu,
  activeActionPlaceId,
}) => {
  const allSelected =
    places.length > 0 && places.every(p => selectedIds.includes(p.id));

  return (
    <div className={styles.table05Container}>
      <div className={styles.table05Scroll}>
        <table className={styles.table05}>
          <thead>
            <tr>
              <th className={clsx(styles.table05Th, styles.checkboxCell)}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className={styles.checkboxInput}
                  title={allSelected ? "إلغاء تحديد الكل" : "تحديد الكل"}
                />
              </th>

              {visibleColumns.image && (
                <th
                  className={styles.table05Th}
                  style={{ width: "60px", textAlign: "center" }}
                >
                  الصورة
                </th>
              )}

              {visibleColumns.name && (
                <th
                  className={styles.table05Th}
                  style={{ minWidth: "200px" }}
                >
                  اسم المكان
                </th>
              )}

              {visibleColumns.category && (
                <th
                  className={styles.table05Th}
                  style={{ minWidth: "150px" }}
                >
                  القسم والتصنيف
                </th>
              )}

              {visibleColumns.location && (
                <th
                  className={styles.table05Th}
                  style={{ minWidth: "160px" }}
                >
                  المنطقة والفروع
                </th>
              )}

              {visibleColumns.features && (
                <th
                  className={styles.table05Th}
                  style={{ minWidth: "140px" }}
                >
                  المميزات والخدمات
                </th>
              )}

              {visibleColumns.workingHours && (
                <th
                  className={styles.table05Th}
                  style={{ minWidth: "120px" }}
                >
                  مواعيد العمل
                </th>
              )}

              {visibleColumns.actions && (
                <th
                  className={styles.table05Th}
                  style={{ width: "60px", textAlign: "center" }}
                >
                  خيارات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {places.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className={styles.table05Td}
                  style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}
                >
                  لا توجد أماكن مسجلة تطابق البحث أو التصفية
                </td>
              </tr>
            ) : (
              places.map(place => {
                const isSelected = selectedIds.includes(place.id);
                const isDbDuplicate = dbDuplicatesList.some(d => d.duplicateId === place.id);
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
                } catch { }

                return (
                  <tr
                    key={place.id}
                    className={clsx(
                      styles.table05Tr,
                      isSelected && styles.table05TrSelected
                    )}
                    style={{
                      background: isSelected
                        ? "rgba(108, 99, 255, 0.12)"
                        : isDbDuplicate
                          ? "rgba(255, 149, 0, 0.05)"
                          : undefined
                    }}
                  >
                    {/* Checkbox */}
                    <td className={clsx(styles.table05Td, styles.checkboxCell)}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(place.id)}
                        className={styles.checkboxInput}
                        title="تحديد المكان"
                      />
                    </td>

                    {/* Image */}
                    {visibleColumns.image && (
                      <td
                        className={styles.table05Td}
                        style={{ textAlign: "center", width: "60px" }}
                      >
                        <div
                          onClick={() => onViewPlace(place)}
                          style={{ cursor: "pointer", display: "inline-block" }}
                        >
                          <ImageWithSkeleton src={mainImg} alt={place.name} />
                        </div>
                      </td>
                    )}

                    {/* Name */}
                    {visibleColumns.name && (
                      <td className={styles.table05Td}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <button
                            type="button"
                            onClick={() => onViewPlace(place)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              font: "inherit",
                              textAlign: "right",
                              cursor: "pointer",
                              fontWeight: 800,
                              color: "var(--color-fg)",
                              fontSize: "0.95rem"
                            }}
                          >
                            {place.name}
                          </button>

                          {place.name_en && (
                            <div
                              style={{
                                fontSize: "0.78rem",
                                color: "var(--text-muted)",
                                direction: "ltr",
                                textAlign: "right"
                              }}
                            >
                              {place.name_en}
                            </div>
                          )}

                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                            <span
                              style={{
                                fontFamily: "monospace",
                                fontSize: "0.7rem",
                                background: "rgba(255, 255, 255, 0.06)",
                                padding: "1px 6px",
                                borderRadius: "4px",
                                color: "var(--text-secondary)",
                                userSelect: "all"
                              }}
                            >
                              {place.id}
                            </span>

                            {isDbDuplicate && (
                              <span
                                style={{
                                  fontSize: "0.68rem",
                                  color: "#ff9500",
                                  background: "rgba(255, 149, 0, 0.15)",
                                  padding: "1px 6px",
                                  borderRadius: "4px",
                                  fontWeight: "bold"
                                }}
                              >
                                ⚠️ مكرر
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Category */}
                    {visibleColumns.category && (
                      <td className={styles.table05Td}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span
                            className={styles.lineBadge}
                            style={{
                              background: `${catColor}20`,
                              color: catColor,
                              border: `1px solid ${catColor}50`,
                              alignSelf: "flex-start"
                            }}
                          >
                            {place.category_label || CATEGORY_MAP[place.category] || place.category}
                          </span>

                          {place.sub_categories && place.sub_categories.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                              {place.sub_categories.slice(0, 2).map(sc => (
                                <span
                                  key={sc}
                                  className={styles.landmarkChip}
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  {CATEGORY_MAP[sc] || sc}
                                </span>
                              ))}
                              {place.sub_categories.length > 2 && (
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    color: "var(--text-muted)"
                                  }}
                                >
                                  +{place.sub_categories.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Location & Branches */}
                    {visibleColumns.location && (
                      <td className={styles.table05Td}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", color: "var(--color-fg)" }}>
                            <IconMapPin size={15} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                            <span>
                              {place.city ? `${place.city}، ` : ""}
                              {place.governorate || "غير محدد"}
                            </span>
                          </div>

                          <span
                            className={styles.statusPill}
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--color-primary)",
                              background: "rgba(108, 99, 255, 0.12)",
                              border: "1px solid rgba(108, 99, 255, 0.25)",
                              alignSelf: "flex-start"
                            }}
                          >
                            <i className="bx bx-buildings" style={{ marginLeft: "4px" }} />
                            {branchesCount} {branchesCount === 1 ? "فرع" : "فروع"}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* Features & Services */}
                    {visibleColumns.features && (
                      <td className={styles.table05Td}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "160px" }}>
                          {(place.features || []).slice(0, 2).map((feat, idx) => (
                            <span
                              key={idx}
                              className={styles.landmarkChip}
                              style={{
                                fontSize: "0.7rem",
                                background: "rgba(46, 204, 113, 0.1)",
                                color: "#2ecc71",
                                borderColor: "rgba(46, 204, 113, 0.25)"
                              }}
                            >
                              ✓ {feat}
                            </span>
                          ))}
                          {((place.features?.length || 0) > 2) && (
                            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                              +{(place.features?.length || 0) - 2}
                            </span>
                          )}
                          {(place.features?.length === 0 || !place.features) && (
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>-</span>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Working Hours */}
                    {visibleColumns.workingHours && (
                      <td className={styles.table05Td}>
                        {is24_7 ? (
                          <span
                            className={styles.statusBadgeCompleted}
                            style={{ fontSize: "0.75rem", fontWeight: 700 }}
                          >
                            24/7 مفتوح
                          </span>
                        ) : (
                          <span
                            className={styles.statusBadgePending}
                            style={{ fontSize: "0.75rem" }}
                          >
                            مواعيد محددة
                          </span>
                        )}
                      </td>
                    )}

                    {/* Actions 3-dots */}
                    {visibleColumns.actions && (
                      <td className={styles.table05Td} style={{ textAlign: "center", width: "60px" }}>
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
};
