"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Airport, AirportFormData } from "../types";
import { AIRPORT_TYPE_OPTIONS, AIRPORT_STATUS_OPTIONS } from "../constants";
import airportsStyles from "../admin-airports.module.css";
import {
  IconArchiveFilled,
  IconBuilding,
  IconCar,
  IconId,
  IconMapPin,
  IconPlaneDeparture,
  IconSquareRoundedXFilled,
} from "@tabler/icons-react";

interface AdminAirportModalProps {
  isOpen: boolean;
  editingItem: Airport | null;
  formData: AirportFormData;
  isSubmitting?: boolean;
  onClose: () => void;
  onFormFieldChange: (field: keyof AirportFormData, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminAirportModal({
  isOpen,
  editingItem,
  formData,
  isSubmitting = false,
  onClose,
  onFormFieldChange,
  onSubmit,
}: AdminAirportModalProps) {
  const [modalTab, setModalTab] = useState<"basic" | "location" | "infrastructure" | "flights" | "services">("basic");

  if (!isOpen) return null;

  return (
    <div className={airportsStyles.modalOverlay}>
      <div className={airportsStyles.modalContent} style={{ maxWidth: "700px" }}>
        {/* Modal Header */}
        <div className={airportsStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(99, 102, 241, 0.15)",
                color: "#818cf8",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconPlaneDeparture size={18} />
            </span>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
              {editingItem ? "تعديل بيانات المطار" : "إضافة مطار جديد"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn-close"
            type="button"
            aria-label="إغلاق"
          >
            <i className="bx bx-x" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            background: "rgba(255, 255, 255, 0.03)",
            padding: "8px 12px",
            borderBottom: "1px solid var(--border-glass, rgba(255, 255, 255, 0.08))",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          <button
            type="button"
            onClick={() => setModalTab("basic")}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              background: modalTab === "basic" ? "rgba(99, 102, 241, 0.2)" : "transparent",
              color: modalTab === "basic" ? "#818cf8" : "var(--text-secondary, #94a3b8)",
            }}
          >
            <IconId size={16} />
            <span>الأساسيات</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab("location")}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              background: modalTab === "location" ? "rgba(59, 130, 246, 0.2)" : "transparent",
              color: modalTab === "location" ? "#60a5fa" : "var(--text-secondary, #94a3b8)",
            }}
          >
            <IconMapPin size={16} />
            <span>الموقع</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab("infrastructure")}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              background: modalTab === "infrastructure" ? "rgba(245, 158, 11, 0.2)" : "transparent",
              color: modalTab === "infrastructure" ? "#fbbf24" : "var(--text-secondary, #94a3b8)",
            }}
          >
            <IconBuilding size={16} />
            <span>البنية والصالات</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab("flights")}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              background: modalTab === "flights" ? "rgba(236, 72, 153, 0.2)" : "transparent",
              color: modalTab === "flights" ? "#f472b6" : "var(--text-secondary, #94a3b8)",
            }}
          >
            <IconPlaneDeparture size={16} />
            <span>الرحلات والخطوط</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab("services")}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              background: modalTab === "services" ? "rgba(16, 185, 129, 0.2)" : "transparent",
              color: modalTab === "services" ? "#34d399" : "var(--text-secondary, #94a3b8)",
            }}
          >
            <IconCar size={16} />
            <span>المواصلات والخدمات</span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={onSubmit} className={airportsStyles.modalBody} style={{ maxHeight: "65vh" }}>
          {/* TAB 1: BASIC INFO */}
          {modalTab === "basic" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    الاسم العربي للمطار *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || formData.name_ar}
                    onChange={(e) => onFormFieldChange("name", e.target.value)}
                    placeholder="مثال: مطار القاهرة الدولي"
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    الاسم الإنجليزي للمطار *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={(e) => onFormFieldChange("name_en", e.target.value)}
                    placeholder="e.g. Cairo International Airport"
                    className="input-fields"
                    style={{ width: "100%", direction: "ltr", textAlign: "right" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: "10px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    كود IATA (3 حروف) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={formData.iata_code || formData.code}
                    onChange={(e) => onFormFieldChange("iata_code", e.target.value.toUpperCase())}
                    placeholder="مثال: CAI"
                    className="input-fields"
                    style={{ width: "100%", fontFamily: "monospace", textTransform: "uppercase" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    كود ICAO (4 حروف)
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={formData.icao_code}
                    onChange={(e) => onFormFieldChange("icao_code", e.target.value.toUpperCase())}
                    placeholder="مثال: HECA"
                    className="input-fields"
                    style={{ width: "100%", fontFamily: "monospace", textTransform: "uppercase" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    تصنيف المطار *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const selected = AIRPORT_TYPE_OPTIONS.find((t) => t.value === e.target.value);
                      onFormFieldChange("type", e.target.value);
                      if (selected) {
                        onFormFieldChange("type_en", selected.type_en);
                      }
                    }}
                    className="input-fields"
                    style={{ width: "100%", padding: "8px" }}
                  >
                    {AIRPORT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    حالة المطار التشغيلية
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => onFormFieldChange("status", e.target.value)}
                    className="input-fields"
                    style={{ width: "100%", padding: "8px" }}
                  >
                    {AIRPORT_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    الوصف القصير *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.short_description}
                    onChange={(e) => onFormFieldChange("short_description", e.target.value)}
                    placeholder="ملخص يظهر ببطاقة المطار..."
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div>
                <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                  الوصف التفصيلي الكامل
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => onFormFieldChange("description", e.target.value)}
                  placeholder="تاريخ المطار، أهميته الاستراتيجية، أو طاقته الاستيعابية..."
                  className="input-fields"
                  style={{ width: "100%", height: "80px", resize: "vertical" }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: LOCATION */}
          {modalTab === "location" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    المحافظة (عربي) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.governorate_ar}
                    onChange={(e) => onFormFieldChange("governorate_ar", e.target.value)}
                    placeholder="مثال: القاهرة"
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    المحافظة (إنجليزي)
                  </label>
                  <input
                    type="text"
                    value={formData.governorate_en}
                    onChange={(e) => onFormFieldChange("governorate_en", e.target.value)}
                    placeholder="e.g. Cairo"
                    className="input-fields"
                    style={{ width: "100%", direction: "ltr", textAlign: "right" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    المدينة (عربي) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city || formData.city_ar}
                    onChange={(e) => onFormFieldChange("city", e.target.value)}
                    placeholder="مثال: القاهرة"
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    المدينة (إنجليزي)
                  </label>
                  <input
                    type="text"
                    value={formData.city_en}
                    onChange={(e) => onFormFieldChange("city_en", e.target.value)}
                    placeholder="e.g. Cairo"
                    className="input-fields"
                    style={{ width: "100%", direction: "ltr", textAlign: "right" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    المنطقة الجغرافية
                  </label>
                  <input
                    type="text"
                    value={formData.area_ar}
                    onChange={(e) => onFormFieldChange("area_ar", e.target.value)}
                    placeholder="مثال: مصر الجديدة / النزهة"
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    العنوان التفصيلي
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => onFormFieldChange("address", e.target.value)}
                    placeholder="مثال: طريق العروبة، مساكن شيراتون"
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    خط العرض (Latitude)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => onFormFieldChange("latitude", e.target.value)}
                    placeholder="مثال: 30.111534"
                    className="input-fields"
                    style={{ width: "100%", direction: "ltr" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    خط الطول (Longitude)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => onFormFieldChange("longitude", e.target.value)}
                    placeholder="مثال: 31.396694"
                    className="input-fields"
                    style={{ width: "100%", direction: "ltr" }}
                  />
                </div>
              </div>

              <div>
                <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                  رابط الموقع على خرائط جوجل (Map URL)
                </label>
                <input
                  type="url"
                  value={formData.map_url}
                  onChange={(e) => onFormFieldChange("map_url", e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="input-fields"
                  style={{ width: "100%", direction: "ltr" }}
                />
              </div>
            </div>
          )}

          {/* TAB 3: INFRASTRUCTURE */}
          {modalTab === "infrastructure" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    عدد مباني الركاب (الصالات)
                  </label>
                  <input
                    type="text"
                    value={formData.terminals_count}
                    onChange={(e) => onFormFieldChange("terminals_count", e.target.value)}
                    placeholder="مثال: 3 مباني ركاب + الصالة الموسمية"
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    الطاقة الاستيعابية السنوية
                  </label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) => onFormFieldChange("capacity", e.target.value)}
                    placeholder="مثال: 30 مليون مسافر سنوياً"
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    عدد مدارج الهبوط والإقلاع
                  </label>
                  <input
                    type="text"
                    value={formData.runways_count}
                    onChange={(e) => onFormFieldChange("runways_count", e.target.value)}
                    placeholder="مثال: 4 مدارج"
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    طول المدارج
                  </label>
                  <input
                    type="text"
                    value={formData.runways_length}
                    onChange={(e) => onFormFieldChange("runways_length", e.target.value)}
                    placeholder="مثال: 4,000 متر"
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div>
                <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                  تفاصيل مباني الركاب والصالات
                </label>
                <textarea
                  value={formData.terminals}
                  onChange={(e) => onFormFieldChange("terminals", e.target.value)}
                  placeholder="مبنى 1 (الصالة القديمة)، مبنى 2، مبنى 3 (الجديد)..."
                  className="input-fields"
                  style={{ width: "100%", height: "80px", resize: "vertical" }}
                />
              </div>
            </div>
          )}

          {/* TAB 4: FLIGHTS & AIRLINES */}
          {modalTab === "flights" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    الرحلات الداخلية
                  </label>
                  <input
                    type="text"
                    value={formData.domestic_flights}
                    onChange={(e) => onFormFieldChange("domestic_flights", e.target.value)}
                    placeholder="مثال: رحلات لشرم الشيخ، الغردقة، الأقصر..."
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    الرحلات الدولية
                  </label>
                  <input
                    type="text"
                    value={formData.international_flights}
                    onChange={(e) => onFormFieldChange("international_flights", e.target.value)}
                    placeholder="مثال: رحلات مباشرة لأوروبا، الخليج، آسيا..."
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div>
                <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                  شركات الطيران العاملة
                </label>
                <textarea
                  value={formData.airlines}
                  onChange={(e) => onFormFieldChange("airlines", e.target.value)}
                  placeholder="مصر للطيران، طيران الإمارات، الخطوط السعودية، لوفتهانزا..."
                  className="input-fields"
                  style={{ width: "100%", height: "70px", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    أبرز الوجهات والخطوط
                  </label>
                  <input
                    type="text"
                    value={formData.destinations}
                    onChange={(e) => onFormFieldChange("destinations", e.target.value)}
                    placeholder="جدة، دبي، لندن، باريس، نيويورك..."
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    المدن المتصلة (افصل بفاصلة)
                  </label>
                  <input
                    type="text"
                    value={formData.connections}
                    onChange={(e) => onFormFieldChange("connections", e.target.value)}
                    placeholder="الإسكندرية, شرم الشيخ, الغردقة..."
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SERVICES & TRANSPORTATION */}
          {modalTab === "services" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    هاتف الاستعلامات الرسمي *
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => onFormFieldChange("phone", e.target.value)}
                    placeholder="مثال: 19934"
                    className="input-fields"
                    style={{ width: "100%", direction: "ltr", textAlign: "right" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    الموقع الرسمي للمطار
                  </label>
                  <input
                    type="url"
                    value={formData.official_website}
                    onChange={(e) => onFormFieldChange("official_website", e.target.value)}
                    placeholder="https://www.cairo-airport.com"
                    className="input-fields"
                    style={{ width: "100%", direction: "ltr" }}
                  />
                </div>
              </div>

              <div>
                <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                  مواقف السيارات وتفاصيلها
                </label>
                <input
                  type="text"
                  value={formData.parking}
                  onChange={(e) => onFormFieldChange("parking", e.target.value)}
                  placeholder="مواقف متعددة الطوابق ومواقف مفتوحة تتسع لأكثر من 5,000 سيارة"
                  className="input-fields"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                  وسائل النقل والمواصلات المتاحة (افصل بفاصلة)
                </label>
                <input
                  type="text"
                  value={formData.transportation}
                  onChange={(e) => onFormFieldChange("transportation", e.target.value)}
                  placeholder="تاكسي المطار, ليموزين المطار, حافلات النقل العام, قطار المطار الداخلي"
                  className="input-fields"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                  الخدمات والمرافق المتوفرة (افصل بفاصلة)
                </label>
                <input
                  type="text"
                  value={formData.services}
                  onChange={(e) => onFormFieldChange("services", e.target.value)}
                  placeholder="سوق حرة (Duty Free), بنوك وصرافة 24 ساعة, تأجير سيارات, صالات VIP"
                  className="input-fields"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                  المعالم المجاورة القريبة (افصل بفاصلة)
                </label>
                <input
                  type="text"
                  value={formData.nearby_landmarks}
                  onChange={(e) => onFormFieldChange("nearby_landmarks", e.target.value)}
                  placeholder="قصر البارون, سيتي ستارز, مصر الجديدة"
                  className="input-fields"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    كلمات بحث عربية (افصل بفاصلة)
                  </label>
                  <input
                    type="text"
                    value={formData.keywords_ar}
                    onChange={(e) => onFormFieldChange("keywords_ar", e.target.value)}
                    placeholder="مطار القاهرة, مطار مصر..."
                    className="input-fields"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    كلمات بحث إنجليزية (افصل بفاصلة)
                  </label>
                  <input
                    type="text"
                    value={formData.keywords_en}
                    onChange={(e) => onFormFieldChange("keywords_en", e.target.value)}
                    placeholder="Cairo Airport, CAI, HECA..."
                    className="input-fields"
                    style={{ width: "100%", direction: "ltr", textAlign: "right" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className={`${airportsStyles.modalFooter} gap-3`}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-blue w-full"
            >
              <IconArchiveFilled size={20} />
              <span>{isSubmitting ? "جاري الحفظ..." : editingItem ? "حفظ التغييرات" : "إضافة المطار"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-cancel w-full"
            >
              <IconSquareRoundedXFilled size={20} />
              <span>إلغاء</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
