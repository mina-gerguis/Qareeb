import React from "react";
import { DBPlace, PlaceFormData } from "../types";
import styles from "../admin-places.module.css";
import { CATEGORIES_STRUCTURE, FEATURES_LIST } from "@/data/places";
import { egyptLocations, governoratesList } from "@/data/egypt_locations";
import { ScheduleDay, generateTimeOptions } from "@/lib/workingHours";
import { SERVICES_LIST } from "@/data/services";
import { IconX, IconMapPin, IconClock, IconTag, IconPlus } from "@tabler/icons-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

interface Props {
  isOpen: boolean;
  editingPlace: DBPlace | null;
  formData: PlaceFormData;
  scheduleType: "24/7" | "custom";
  scheduleData: ScheduleDay[];
  isSubmitting: boolean;
  places: DBPlace[];
  onClose: () => void;
  onUpdateForm: (field: keyof PlaceFormData, value: any) => void;
  onSetScheduleType: (type: "24/7" | "custom") => void;
  onSetScheduleData: (data: ScheduleDay[]) => void;
  onSave: (e: React.FormEvent) => void;
  onExtractCoordinates: (url: string) => void;
  onOpenAddCategoryModal: () => void;
}

export const AdminPlaceModal: React.FC<Props> = ({
  isOpen,
  editingPlace,
  formData,
  scheduleType,
  scheduleData,
  isSubmitting,
  places,
  onClose,
  onUpdateForm,
  onSetScheduleType,
  onSetScheduleData,
  onSave,
  onExtractCoordinates,
  onOpenAddCategoryModal,
}) => {
  if (!isOpen) return null;

  const currentMainCat = CATEGORIES_STRUCTURE.find(m => m.name === formData.category);
  const subCategories = currentMainCat?.subCategories || [];

  // Existing custom place types for current subcategory
  const subCat = formData.sub_categories?.[0] || "";
  const existingTypes = Array.from(new Set(
    places
      .filter(p => p.sub_categories?.includes(subCat) && p.place_type?.trim() && (!editingPlace || p.id !== editingPlace.id))
      .map(p => p.place_type!.trim())
  )).filter(Boolean);

  const availableCities = egyptLocations[formData.governorate as keyof typeof egyptLocations] || [];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{ maxWidth: "900px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(108, 99, 255, 0.15)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem"
              }}
            >
              <i className={editingPlace ? "bx bx-edit" : "bx bx-plus-circle"} />
            </div>
            <div>
              <h3 className={styles.modalTitle} style={{ margin: 0 }}>
                {editingPlace ? `تعديل بيانات: ${editingPlace.name}` : "إضافة مكان جديد"}
              </h3>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)" }}>
                أدخل كافة تفاصيل المكان ومواعيد العمل والموقع الجغرافي.
              </p>
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

        {/* Form Body */}
        <form onSubmit={onSave} className={styles.modalBody}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {/* Arabic Name */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>اسم المكان (بالعربية) *</label>
              <input
                required
                className={styles.formInput}
                value={formData.name}
                onChange={(e) => onUpdateForm("name", e.target.value)}
                placeholder="مثال: مطعم البركة"
              />
            </div>

            {/* English Name */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>اسم المكان (بالإنجليزية - للبحث)</label>
              <input
                className={styles.formInput}
                value={formData.name_en}
                onChange={(e) => onUpdateForm("name_en", e.target.value)}
                placeholder="مثال: Al Baraka Restaurant"
                style={{ direction: "ltr", textAlign: "right" }}
              />
            </div>

            {/* Main Category */}
            <div className={styles.formGroup}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className={styles.formLabel}>القسم الرئيسي *</label>
                <button
                  type="button"
                  onClick={onOpenAddCategoryModal}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-primary)",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <IconPlus size={14} />
                  إضافة قسم جديد
                </button>
              </div>
              <select
                required
                className={styles.formSelect}
                value={formData.category}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateForm("category", val);
                  const found = CATEGORIES_STRUCTURE.find(m => m.name === val);
                  onUpdateForm("category_label", found?.label || val);
                  const firstSub = found?.subCategories[0]?.name;
                  onUpdateForm("sub_categories", firstSub ? [firstSub] : []);
                  onUpdateForm("place_type", "");
                  onUpdateForm("place_type_icon", "");
                }}
              >
                {CATEGORIES_STRUCTURE.map(main => (
                  <option key={main.name} value={main.name}>
                    {main.emoji} {main.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Short Description */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>وصف مختصر (سطر واحد)</label>
              <input
                className={styles.formInput}
                value={formData.short_description}
                onChange={(e) => onUpdateForm("short_description", e.target.value)}
                placeholder="مثال: أفضل مطعم مشويات وأجواء عائلية راقية"
              />
            </div>
          </div>

          {/* Subcategories Selector */}
          <div style={{ background: "rgba(108, 99, 255, 0.05)", padding: "14px", borderRadius: "12px", border: "1px solid var(--border-glass)", margin: "14px 0" }}>
            <label className={styles.formLabel} style={{ fontWeight: "700", marginBottom: "8px", display: "block" }}>
              الأقسام الفرعية (اختر واحد أو أكثر لتحديد التصنيفات الدقيقة):
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {subCategories.map(cat => {
                const isSelected = formData.sub_categories?.includes(cat.name);
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => {
                      const current = formData.sub_categories || [];
                      const next = isSelected
                        ? current.filter(s => s !== cat.name)
                        : [...current, cat.name];
                      onUpdateForm("sub_categories", next);
                    }}
                    className={`${styles.subCatPill} ${isSelected ? styles.subCatPillActive : ""}`}
                  >
                    <CategoryIcon icon={cat.icon} size={15} />
                    <span>{cat.label}</span>
                    {isSelected && " ✓"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Place Type Specification */}
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "14px", borderRadius: "12px", border: "1px solid var(--border-glass)", marginBottom: "16px" }}>
            <label className={styles.formLabel} style={{ fontWeight: "700" }}>
              النوع الفرعي المخصص (مثال: صيني، سوري، مشويات، هندي...)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginTop: "8px" }}>
              {existingTypes.length > 0 && (
                <div>
                  <label className={styles.formLabel} style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    اختر من الأنواع المضافة مسبقاً:
                  </label>
                  <select
                    className={styles.formSelect}
                    value={formData.place_type}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "__new__") {
                        onUpdateForm("place_type", "");
                        onUpdateForm("place_type_icon", "bx bx-tag");
                      } else {
                        onUpdateForm("place_type", val);
                        const found = places.find(p => p.place_type === val);
                        onUpdateForm("place_type_icon", found?.place_type_icon || "bx bx-tag");
                      }
                    }}
                  >
                    <option value="">لا يوجد (بدون تحديد نوع مخصص)</option>
                    {existingTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    <option value="__new__">+ كتابة نوع مخصص جديد...</option>
                  </select>
                </div>
              )}

              {(existingTypes.length === 0 || !existingTypes.includes(formData.place_type)) && (
                <>
                  <div>
                    <label className={styles.formLabel} style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      اسم النوع:
                    </label>
                    <input
                      className={styles.formInput}
                      placeholder="مثال: سوري، صيني، إيطالي..."
                      value={formData.place_type}
                      onChange={(e) => onUpdateForm("place_type", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel} style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      أيقونة Boxicon (اختياري):
                    </label>
                    <input
                      className={styles.formInput}
                      placeholder="bx bx-tag أو bx bx-dish"
                      value={formData.place_type_icon}
                      onChange={(e) => onUpdateForm("place_type_icon", e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Location & Coordinates */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px", marginBottom: "16px" }}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>المحافظة *</label>
              <select
                required
                className={styles.formSelect}
                value={formData.governorate}
                onChange={(e) => {
                  onUpdateForm("governorate", e.target.value);
                  onUpdateForm("city", "");
                }}
              >
                {governoratesList.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>المدينة / المنطقة *</label>
              {availableCities.length > 0 ? (
                <select
                  required
                  className={styles.formSelect}
                  value={formData.city}
                  onChange={(e) => onUpdateForm("city", e.target.value)}
                >
                  <option value="">اختر المدينة</option>
                  {availableCities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  className={styles.formInput}
                  value={formData.city}
                  onChange={(e) => onUpdateForm("city", e.target.value)}
                  placeholder="مثال: مدينة نصر"
                />
              )}
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.formLabel}>العنوان بالتفصيل *</label>
              <input
                required
                className={styles.formInput}
                value={formData.full_address}
                onChange={(e) => onUpdateForm("full_address", e.target.value)}
                placeholder="مثال: 15 شارع الثورة، بجوار مسجد جمال"
              />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className={styles.formLabel}>رابط جوجل ماب (Google Maps) *</label>
                {formData.google_maps_url && (
                  <button
                    type="button"
                    onClick={() => onExtractCoordinates(formData.google_maps_url)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-primary)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <IconMapPin size={14} />
                    استخراج الإحداثيات تلقائياً
                  </button>
                )}
              </div>
              <input
                required
                className={styles.formInput}
                value={formData.google_maps_url}
                onChange={(e) => onUpdateForm("google_maps_url", e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                style={{ direction: "ltr", textAlign: "right" }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>خط العرض (Latitude)</label>
              <input
                type="number"
                step="any"
                className={styles.formInput}
                value={formData.latitude}
                onChange={(e) => onUpdateForm("latitude", e.target.value)}
                placeholder="30.0815"
                style={{ direction: "ltr", textAlign: "right" }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>خط الطول (Longitude)</label>
              <input
                type="number"
                step="any"
                className={styles.formInput}
                value={formData.longitude}
                onChange={(e) => onUpdateForm("longitude", e.target.value)}
                placeholder="31.3256"
                style={{ direction: "ltr", textAlign: "right" }}
              />
            </div>
          </div>

          {/* Contact & Media */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px", marginBottom: "16px" }}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>أرقام الهواتف (مفصولة بفواصل)</label>
              <input
                className={styles.formInput}
                value={formData.phones}
                onChange={(e) => onUpdateForm("phones", e.target.value)}
                placeholder="01012345678, 0224150000"
                style={{ direction: "ltr", textAlign: "right" }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>موقع الويب (اختياري)</label>
              <input
                className={styles.formInput}
                value={formData.website_url}
                onChange={(e) => onUpdateForm("website_url", e.target.value)}
                placeholder="https://example.com"
                style={{ direction: "ltr", textAlign: "right" }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>رابط الصورة الرئيسية</label>
              <input
                className={styles.formInput}
                value={formData.image_url}
                onChange={(e) => onUpdateForm("image_url", e.target.value)}
                placeholder="https://images.unsplash.com/..."
                style={{ direction: "ltr", textAlign: "right" }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>روابط صور المنيو (مفصولة بفواصل)</label>
              <input
                className={styles.formInput}
                value={formData.menu_images}
                onChange={(e) => onUpdateForm("menu_images", e.target.value)}
                placeholder="https://..., https://..."
                style={{ direction: "ltr", textAlign: "right" }}
              />
            </div>
          </div>

          {/* Working Hours */}
          <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-glass)", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <label className={styles.formLabel} style={{ fontWeight: "700", margin: 0 }}>
                <IconClock size={16} style={{ display: "inline", verticalAlign: "middle", marginLeft: "6px" }} />
                مواعيد العمل
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => onSetScheduleType("24/7")}
                  className={`btn ${scheduleType === "24/7" ? "btn-primary" : "btn-cancel"}`}
                  style={{ padding: "4px 12px", fontSize: "0.82rem" }}
                >
                  24/7 مفتوح دائماً
                </button>
                <button
                  type="button"
                  onClick={() => onSetScheduleType("custom")}
                  className={`btn ${scheduleType === "custom" ? "btn-primary" : "btn-cancel"}`}
                  style={{ padding: "4px 12px", fontSize: "0.82rem" }}
                >
                  مواعيد مخصصة لكل يوم
                </button>
              </div>
            </div>

            {scheduleType === "custom" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                {scheduleData.map((dayItem, idx) => (
                  <div key={dayItem.day} className={styles.scheduleRow}>
                    <span className={styles.scheduleDayName}>{dayItem.day}</span>
                    <select
                      className={styles.formSelect}
                      style={{ width: "95px", padding: "6px" }}
                      value={dayItem.isWorking ? "working" : "off"}
                      onChange={(e) => {
                        const next = [...scheduleData];
                        next[idx].isWorking = e.target.value === "working";
                        onSetScheduleData(next);
                      }}
                    >
                      <option value="working">شغل</option>
                      <option value="off">إجازة</option>
                    </select>

                    {dayItem.isWorking && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", flex: 1 }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>من:</span>
                        <select
                          className={styles.formSelect}
                          style={{ width: "85px", padding: "6px" }}
                          value={dayItem.openTime}
                          onChange={(e) => {
                            const next = [...scheduleData];
                            next[idx].openTime = e.target.value;
                            onSetScheduleData(next);
                          }}
                        >
                          {generateTimeOptions().map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>

                        <select
                          className={styles.formSelect}
                          style={{ width: "60px", padding: "6px" }}
                          value={dayItem.openPeriod}
                          onChange={(e) => {
                            const next = [...scheduleData];
                            next[idx].openPeriod = e.target.value as "ص" | "م";
                            onSetScheduleData(next);
                          }}
                        >
                          <option value="ص">ص</option>
                          <option value="م">م</option>
                        </select>

                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>إلى:</span>
                        <select
                          className={styles.formSelect}
                          style={{ width: "85px", padding: "6px" }}
                          value={dayItem.closeTime}
                          onChange={(e) => {
                            const next = [...scheduleData];
                            next[idx].closeTime = e.target.value;
                            onSetScheduleData(next);
                          }}
                        >
                          {generateTimeOptions().map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>

                        <select
                          className={styles.formSelect}
                          style={{ width: "60px", padding: "6px" }}
                          value={dayItem.closePeriod}
                          onChange={(e) => {
                            const next = [...scheduleData];
                            next[idx].closePeriod = e.target.value as "ص" | "م";
                            onSetScheduleData(next);
                          }}
                        >
                          <option value="ص">ص</option>
                          <option value="م">م</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features Checkboxes */}
          <div style={{ background: "rgba(46, 204, 113, 0.05)", padding: "14px", borderRadius: "12px", border: "1px solid var(--border-glass)", marginBottom: "16px" }}>
            <label className={styles.formLabel} style={{ fontWeight: "700", marginBottom: "8px", display: "block" }}>
              المميزات المتاحة في المكان:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px" }}>
              {FEATURES_LIST.map(feat => {
                const checked = (formData.features || []).includes(feat.key);
                return (
                  <label
                    key={feat.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      background: checked ? "rgba(46, 204, 113, 0.12)" : "rgba(255, 255, 255, 0.02)"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const current = formData.features || [];
                        const next = checked
                          ? current.filter(k => k !== feat.key)
                          : [...current, feat.key];
                        onUpdateForm("features", next);
                      }}
                      style={{ cursor: "pointer", accentColor: "#2ecc71" }}
                    />
                    <span>{feat.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Detailed Description */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>الوصف والشرح المفصل للمكان</label>
            <textarea
              rows={4}
              className={styles.formTextarea}
              value={formData.description}
              onChange={(e) => onUpdateForm("description", e.target.value)}
              placeholder="اكتب وصفاً جذاباً وشاملاً للمكان والخدمات والأجواء..."
            />
          </div>

          {/* Form Footer */}
          <div className={styles.modalFooter} style={{ padding: "16px 0 0 0" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel"
              disabled={isSubmitting}
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !formData.name.trim()}
              style={{ minWidth: "140px" }}
            >
              {isSubmitting ? (
                <span>جاري الحفظ...</span>
              ) : (
                <span>{editingPlace ? "حفظ التعديلات" : "إضافة المكان"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
