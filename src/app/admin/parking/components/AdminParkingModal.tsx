"use client";

import React from "react";
import clsx from "clsx";
import { ParkingSpot, ParkingFormData } from "../types";
import { POPULAR_PARKING_AREAS, GARAGE_TYPE_OPTIONS } from "../constants";
import parkingStyles from "../admin-parking.module.css";
import { IconArchiveFilled } from "@tabler/icons-react";

interface AdminParkingModalProps {
  isOpen: boolean;
  editingItem: ParkingSpot | null;
  formData: ParkingFormData;
  onClose: () => void;
  onFormFieldChange: (field: keyof ParkingFormData, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminParkingModal({
  isOpen,
  editingItem,
  formData,
  onClose,
  onFormFieldChange,
  onSubmit,
}: AdminParkingModalProps) {
  if (!isOpen) return null;

  return (
    <div className={parkingStyles.modalOverlay}>
      <div className={parkingStyles.modalContent} style={{ maxWidth: "660px" }}>
        {/* Modal Header */}
        <div className={parkingStyles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
            {editingItem ? "تعديل بيانات الجراج" : "إضافة جراج جديد"}
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
        <form onSubmit={onSubmit} className={parkingStyles.modalBody}>
          {/* Row 1: Name & Area */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                اسم الجراج *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => onFormFieldChange("name", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="مثال: جراج التحرير متعدد الطوابق"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                المنطقة *
              </label>
              <input
                type="text"
                list="parking-areas-list"
                required
                value={formData.area}
                onChange={(e) => onFormFieldChange("area", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="اختر أو اكتب المنطقة..."
              />
              <datalist id="parking-areas-list">
                {POPULAR_PARKING_AREAS.map((ar) => (
                  <option key={ar} value={ar} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Row 2: Address */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              العنوان بالتفصيل *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => onFormFieldChange("address", e.target.value)}
              className="input-fields"
              style={{ width: "100%" }}
              placeholder="مثال: ميدان التحرير - أمام المتحف المصري مباشرة"
            />
          </div>

          {/* Row 3: Nearest Metro & Type */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                أقرب محطة مترو (اختياري)
              </label>
              <input
                type="text"
                value={formData.nearestMetro}
                onChange={(e) => onFormFieldChange("nearestMetro", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="مثال: أنور السادات (الخط 1 و 2)"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                نوع الجراج
              </label>
              <select
                value={formData.type}
                onChange={(e) => onFormFieldChange("type", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
              >
                {GARAGE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Pricing & Capacity */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                سعر الساعة (ج.م) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formData.hourlyRate}
                onChange={(e) => onFormFieldChange("hourlyRate", Number(e.target.value))}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="15"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                أقصى سعر يومي (اختياري)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.maxDailyRate}
                onChange={(e) => onFormFieldChange("maxDailyRate", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="120"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                السعة (سيارة) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formData.capacity}
                onChange={(e) => onFormFieldChange("capacity", Number(e.target.value))}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="500"
              />
            </div>
          </div>

          {/* Row 5: Working Hours */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              ساعات العمل
            </label>
            <input
              type="text"
              value={formData.hours}
              onChange={(e) => onFormFieldChange("hours", e.target.value)}
              className="input-fields"
              style={{ width: "100%" }}
              placeholder="مثال: 24 ساعة طوال الأسبوع أو من 7:00 ص إلى 12:00 م"
            />
          </div>

          {/* Row 6: Features */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              المميزات والخدمات (مفصولة بفاصلة)
            </label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => onFormFieldChange("features", e.target.value)}
              className="input-fields"
              style={{ width: "100%" }}
              placeholder="مثال: أمن وحراسة، كاميرات مراقبة، مصاعد، دفع فيزا"
            />
          </div>

          {/* Row 7: Google Maps Link */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              رابط موقع الجراج على خرائط Google (اختياري)
            </label>
            <input
              type="url"
              value={formData.mapLocationLink}
              onChange={(e) => onFormFieldChange("mapLocationLink", e.target.value)}
              className="input-fields"
              style={{ width: "100%", direction: "ltr", textAlign: "left" }}
              placeholder="https://maps.google.com/?q=..."
            />
          </div>

          {/* Modal Footer */}
          <div className={parkingStyles.modalFooter} style={{ padding: "16px 0 0 0", marginTop: "10px" }}>
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
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <IconArchiveFilled size={18} />
              <span>{editingItem ? "حفظ التعديلات" : "إضافة الجراج"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
