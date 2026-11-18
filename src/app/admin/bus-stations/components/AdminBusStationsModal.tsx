"use client";

import React from "react";
import clsx from "clsx";
import { BusStation, BusCompany, BusStationFormData } from "../types";
import { GOVERNORATES_LIST, COMPANY_TYPE_OPTIONS } from "../constants";
import busStyles from "../admin-bus-stations.module.css";
import { IconArchiveFilled, IconPlus, IconTrash } from "@tabler/icons-react";

interface AdminBusStationsModalProps {
  isOpen: boolean;
  editingItem: BusStation | null;
  formData: BusStationFormData;
  formCompanies: BusCompany[];
  availableLogos: string[];
  onClose: () => void;
  onFormFieldChange: (field: keyof BusStationFormData, value: string) => void;
  onAddCompany: () => void;
  onRemoveCompany: (index: number) => void;
  onCompanyFieldChange: (index: number, field: keyof BusCompany, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminBusStationsModal({
  isOpen,
  editingItem,
  formData,
  formCompanies,
  availableLogos,
  onClose,
  onFormFieldChange,
  onAddCompany,
  onRemoveCompany,
  onCompanyFieldChange,
  onSubmit,
}: AdminBusStationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className={busStyles.modalOverlay}>
      <div className={busStyles.modalContent} style={{ maxWidth: "680px" }}>
        {/* Modal Header */}
        <div className={busStyles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
            {editingItem ? "تعديل موقف الأتوبيس" : "إضافة موقف أتوبيس جديد"}
          </h3>
          <button
            onClick={onClose}
            className="btn-close"
            type="button"
            aria-label="إغلاق"
          >
            <i className="bx bx-x" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={onSubmit} className={busStyles.modalBody}>
          {/* Row 1: Name & Governorate */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                اسم الموقف *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => onFormFieldChange("name", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="مثال: موقف ألماظة للسوبر جيت"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                المحافظة *
              </label>
              <select
                value={formData.governorate}
                onChange={(e) => onFormFieldChange("governorate", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
              >
                {GOVERNORATES_LIST.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Location */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              العنوان بالتفصيل *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => onFormFieldChange("location", e.target.value)}
              className="input-fields"
              style={{ width: "100%" }}
              placeholder="مثال: مصر الجديدة - بجوار طريق السويس ومطار القاهرة"
            />
          </div>

          {/* Row 3: Destinations */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              الوجهات والمدن المتاحة (افصل بينها بفاصلة أو سطر جديد) *
            </label>
            <textarea
              rows={2}
              required
              value={formData.destinationsText}
              onChange={(e) => onFormFieldChange("destinationsText", e.target.value)}
              className="input-fields"
              style={{ width: "100%", resize: "vertical" }}
              placeholder="الإسكندرية, شرم الشيخ, الغردقة, المنيا, أسيوط..."
            />
          </div>

          {/* Row 4: Google Maps URL */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              رابط الموقع على Google Maps
            </label>
            <input
              type="url"
              value={formData.map_url}
              onChange={(e) => onFormFieldChange("map_url", e.target.value)}
              className="input-fields"
              style={{ width: "100%" }}
              placeholder="https://maps.google.com/?q=..."
            />
          </div>

          {/* Section: Companies Visual Editor */}
          <div style={{ marginTop: "6px", borderTop: "1px solid var(--border-glass, rgba(255,255,255,0.08))", paddingTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--color-fg)", display: "block" }}>
                  الشركات المشغلة وخطوط النقل *
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  حدد الشركات المتواجدة في هذا الموقف وأرقام هواتفها
                </span>
              </div>

              <button
                type="button"
                onClick={onAddCompany}
                className="btn btn-blue"
                style={{ padding: "6px 12px", fontSize: "0.82rem" }}
              >
                <IconPlus size={16} />
                <span>إضافة شركة</span>
              </button>
            </div>

            {formCompanies.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  border: "1px dashed var(--border-glass, rgba(255,255,255,0.15))",
                  borderRadius: "10px",
                }}
              >
                لم يتم إضافة شركات بعد. اضغط على "إضافة شركة" للبدء.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {formCompanies.map((company, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      border: "1px solid var(--border-glass, rgba(255,255,255,0.08))",
                      borderRadius: "10px",
                      padding: "14px",
                      background: "rgba(0, 0, 0, 0.2)",
                      position: "relative",
                    }}
                  >
                    {/* Delete Company Button */}
                    <button
                      type="button"
                      onClick={() => onRemoveCompany(cIdx)}
                      className="btn btn-error"
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                      }}
                      title="حذف الشركة"
                    >
                      <IconTrash size={14} />
                      <span>حذف</span>
                    </button>

                    <span style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#818cf8", display: "block", marginBottom: "8px" }}>
                      شركة رقم {cIdx + 1}
                    </span>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                          اسم الشركة *
                        </label>
                        <input
                          type="text"
                          required
                          value={company.name}
                          onChange={(e) => onCompanyFieldChange(cIdx, "name", e.target.value)}
                          className="input-fields"
                          style={{ width: "100%", padding: "6px 10px", fontSize: "0.85rem" }}
                          placeholder="مثال: السوبر جيت (Super Jet)"
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                          رقم الهاتف / الخط الساخن *
                        </label>
                        <input
                          type="text"
                          required
                          value={company.phone}
                          onChange={(e) => onCompanyFieldChange(cIdx, "phone", e.target.value)}
                          className="input-fields"
                          style={{ width: "100%", padding: "6px 10px", fontSize: "0.85rem" }}
                          placeholder="مثال: 19142"
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                      <div>
                        <label style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                          نوع الخدمة *
                        </label>
                        <select
                          value={company.type}
                          onChange={(e) => onCompanyFieldChange(cIdx, "type", e.target.value)}
                          className="input-fields"
                          style={{ width: "100%", padding: "6px 10px", fontSize: "0.85rem" }}
                        >
                          {COMPANY_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                          شعار الشركة (Logo)
                        </label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <select
                            value={company.logo || ""}
                            onChange={(e) => onCompanyFieldChange(cIdx, "logo", e.target.value)}
                            className="input-fields"
                            style={{ width: "100%", padding: "6px 10px", fontSize: "0.85rem" }}
                          >
                            <option value="">بدون شعار</option>
                            {availableLogos.map((lg) => (
                              <option key={lg} value={lg}>
                                {lg}
                              </option>
                            ))}
                          </select>
                          {company.logo && (
                            <img
                              src={`/images/busStations/${company.logo}`}
                              alt={company.name}
                              style={{
                                width: "28px",
                                height: "28px",
                                objectFit: "contain",
                                borderRadius: "4px",
                                background: "white",
                                padding: "2px",
                              }}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row: Description */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              الوصف وملاحظات السفر
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => onFormFieldChange("description", e.target.value)}
              className="input-fields"
              style={{ width: "100%", resize: "vertical" }}
              placeholder="معلومات إضافية عن صالات الانتظار والخدمات والمواعيد..."
            />
          </div>

          {/* Modal Footer */}
          <div className={busStyles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <IconArchiveFilled size={18} />
              <span>{editingItem ? "حفظ التعديلات" : "إضافة الموقف"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
