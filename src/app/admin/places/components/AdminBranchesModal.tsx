import React from "react";
import { DBPlace, BranchFormData, BranchItem } from "../types";
import styles from "../admin-places.module.css";
import { egyptLocations, governoratesList } from "@/data/egypt_locations";
import { ScheduleDay, generateTimeOptions } from "@/lib/workingHours";
import { IconX, IconEdit, IconTrash, IconMapPin, IconClock, IconBuildingStore } from "@tabler/icons-react";

interface Props {
  isOpen: boolean;
  place: DBPlace | null;
  editingBranchId: string | null;
  formData: BranchFormData;
  scheduleType: "24/7" | "custom";
  scheduleData: ScheduleDay[];
  isSubmitting: boolean;
  onClose: () => void;
  onEditBranch: (branch: BranchItem) => void;
  onCancelEditBranch: () => void;
  onDeleteBranch: (branchId: string, placeId: string, isMain: boolean) => void;
  onUpdateFormData: (updater: (prev: BranchFormData) => BranchFormData) => void;
  onSetScheduleType: (type: "24/7" | "custom") => void;
  onSetScheduleData: (data: ScheduleDay[]) => void;
  onSaveBranch: (e: React.FormEvent) => void;
  onExtractBranchCoordinates: (url: string) => void;
}

export const AdminBranchesModal: React.FC<Props> = ({
  isOpen,
  place,
  editingBranchId,
  formData,
  scheduleType,
  scheduleData,
  isSubmitting,
  onClose,
  onEditBranch,
  onCancelEditBranch,
  onDeleteBranch,
  onUpdateFormData,
  onSetScheduleType,
  onSetScheduleData,
  onSaveBranch,
  onExtractBranchCoordinates,
}) => {
  if (!isOpen || !place) return null;

  const branches = place.branches || [];
  const availableCities = egyptLocations[formData.governorate as keyof typeof egyptLocations] || [];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{ maxWidth: "840px" }}
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
                fontSize: "1.3rem"
              }}
            >
              <IconBuildingStore size={22} />
            </div>
            <div>
              <h3 className={styles.modalTitle} style={{ margin: 0 }}>
                إدارة فروع: {place.name}
              </h3>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)" }}>
                عرض وتعديل الفروع المسجلة أو إضافة فرع جديد.
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

        <div className={styles.modalBody}>
          {/* Existing Branches List */}
          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-fg)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>الفروع المسجلة حالياً ({branches.length}):</span>
            </h4>

            {branches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)", fontSize: "0.85rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
                لا توجد فروع مسجلة لهذا المكان حتى الآن.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "10px" }}>
                {branches.map((b) => (
                  <div
                    key={b.id || b.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 14px",
                      background: editingBranchId === b.id ? "rgba(108, 99, 255, 0.1)" : "rgba(255, 255, 255, 0.03)",
                      borderRadius: "10px",
                      border: editingBranchId === b.id ? "1px solid var(--color-primary)" : "1px solid var(--border-glass)",
                      flexWrap: "wrap",
                      gap: "10px"
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-fg)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{b.name}</span>
                        {b.is_main && (
                          <span style={{ fontSize: "0.72rem", color: "var(--color-success, #34c759)", background: "rgba(52, 199, 89, 0.12)", padding: "2px 8px", borderRadius: "4px" }}>
                            فرع رئيسي
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        <IconMapPin size={14} style={{ display: "inline", verticalAlign: "middle", marginLeft: "4px" }} />
                        {b.city ? `${b.city}، ` : ""}{b.governorate} {b.full_address ? `- ${b.full_address}` : ""}
                      </div>
                      {b.phones && b.phones.length > 0 && (
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px", direction: "ltr", textAlign: "right" }}>
                          {b.phones.join(", ")}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => onEditBranch(b)}
                        className="btn btn-cancel"
                        style={{ padding: "6px 10px", fontSize: "0.8rem", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <IconEdit size={15} />
                        تعديل
                      </button>

                      {!b.is_main && b.id && (
                        <button
                          type="button"
                          onClick={() => onDeleteBranch(b.id!, place.id, b.is_main)}
                          className="btn btn-error"
                          style={{ padding: "6px 10px", fontSize: "0.8rem", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <IconTrash size={15} />
                          حذف
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add / Edit Branch Form */}
          <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-fg)", margin: 0 }}>
                {editingBranchId ? "تعديل بيانات الفرع" : "إضافة فرع جديد للمكان"}
              </h4>
              {editingBranchId && (
                <button
                  type="button"
                  onClick={onCancelEditBranch}
                  style={{ background: "none", border: "none", color: "#ff3b30", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600 }}
                >
                  إلغاء التعديل
                </button>
              )}
            </div>

            <form onSubmit={onSaveBranch} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>اسم الفرع *</label>
                <input
                  required
                  className={styles.formInput}
                  value={formData.name}
                  onChange={(e) => onUpdateFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="مثال: فرع التجمع الخامس"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>المحافظة *</label>
                <select
                  required
                  className={styles.formSelect}
                  value={formData.governorate}
                  onChange={(e) => onUpdateFormData((p) => ({ ...p, governorate: e.target.value, city: "" }))}
                >
                  {governoratesList.map((g) => (
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
                    onChange={(e) => onUpdateFormData((p) => ({ ...p, city: e.target.value }))}
                  >
                    <option value="">اختر المدينة</option>
                    {availableCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    required
                    className={styles.formInput}
                    value={formData.city}
                    onChange={(e) => onUpdateFormData((p) => ({ ...p, city: e.target.value }))}
                    placeholder="مثال: التجمع الخامس"
                  />
                )}
              </div>

              <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.formLabel}>العنوان بالتفصيل *</label>
                <input
                  required
                  className={styles.formInput}
                  value={formData.full_address}
                  onChange={(e) => onUpdateFormData((p) => ({ ...p, full_address: e.target.value }))}
                  placeholder="شارع التسعين الشمالي، مول داون تاون"
                />
              </div>

              <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className={styles.formLabel}>رابط جوجل ماب للفرع (اختياري)</label>
                  {formData.google_maps_url && (
                    <button
                      type="button"
                      onClick={() => onExtractBranchCoordinates(formData.google_maps_url)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-primary)",
                        fontSize: "0.78rem",
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
                  className={styles.formInput}
                  value={formData.google_maps_url}
                  onChange={(e) => onUpdateFormData((p) => ({ ...p, google_maps_url: e.target.value }))}
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
                  onChange={(e) => onUpdateFormData((p) => ({ ...p, latitude: e.target.value }))}
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
                  onChange={(e) => onUpdateFormData((p) => ({ ...p, longitude: e.target.value }))}
                  placeholder="31.3256"
                  style={{ direction: "ltr", textAlign: "right" }}
                />
              </div>

              <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.formLabel}>أرقام هواتف الفرع (مفصولة بفواصل)</label>
                <input
                  className={styles.formInput}
                  value={formData.phones}
                  onChange={(e) => onUpdateFormData((p) => ({ ...p, phones: e.target.value }))}
                  placeholder="010..., 022..."
                  style={{ direction: "ltr", textAlign: "right" }}
                />
              </div>

              {/* Working Hours */}
              <div style={{ gridColumn: "1 / -1", background: "rgba(255, 255, 255, 0.02)", padding: "14px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <label className={styles.formLabel} style={{ fontWeight: 700, margin: 0 }}>
                    <IconClock size={16} style={{ display: "inline", verticalAlign: "middle", marginLeft: "4px" }} />
                    مواعيد عمل الفرع
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => onSetScheduleType("24/7")}
                      className={`btn ${scheduleType === "24/7" ? "btn-primary" : "btn-cancel"}`}
                      style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                    >
                      24/7 مفتوح
                    </button>
                    <button
                      type="button"
                      onClick={() => onSetScheduleType("custom")}
                      className={`btn ${scheduleType === "custom" ? "btn-primary" : "btn-cancel"}`}
                      style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                    >
                      مواعيد مخصصة
                    </button>
                  </div>
                </div>

                {scheduleType === "custom" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {scheduleData.map((dayItem, idx) => (
                      <div key={dayItem.day} className={styles.scheduleRow} style={{ padding: "8px 10px" }}>
                        <span className={styles.scheduleDayName} style={{ width: "70px", fontSize: "0.82rem" }}>{dayItem.day}</span>
                        <select
                          className={styles.formSelect}
                          style={{ width: "85px", padding: "4px" }}
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
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", flex: 1 }}>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>من:</span>
                            <select
                              className={styles.formSelect}
                              style={{ width: "80px", padding: "4px" }}
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
                              style={{ width: "55px", padding: "4px" }}
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

                            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>إلى:</span>
                            <select
                              className={styles.formSelect}
                              style={{ width: "80px", padding: "4px" }}
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
                              style={{ width: "55px", padding: "4px" }}
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

              <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || !formData.name.trim()}
                  style={{ minWidth: "130px" }}
                >
                  {isSubmitting ? "جاري الحفظ..." : editingBranchId ? "حفظ تعديل الفرع" : "إضافة الفرع"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
