"use client";

import React from "react";
import clsx from "clsx";
import { HighwayItem, RoadFormData } from "../types";
import { ROAD_TYPE_OPTIONS, ROAD_STATUS_OPTIONS } from "../constants";
import roadsStyles from "../admin-roads-info.module.css";
import { IconArchiveFilled } from "@tabler/icons-react";

interface AdminRoadModalProps {
  isOpen: boolean;
  editingRoad: HighwayItem | null;
  formData: RoadFormData;
  onClose: () => void;
  onFormFieldChange: (field: keyof RoadFormData, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminRoadModal({
  isOpen,
  editingRoad,
  formData,
  onClose,
  onFormFieldChange,
  onSubmit,
}: AdminRoadModalProps) {
  if (!isOpen) return null;

  return (
    <div className={roadsStyles.modalOverlay}>
      <div className={roadsStyles.modalContent} style={{ maxWidth: "720px" }}>
        {/* Modal Header */}
        <div className={roadsStyles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
            {editingRoad ? "تعديل بيانات الطريق / المحور" : "إضافة طريق أو محور جديد"}
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
        <form onSubmit={onSubmit} className={roadsStyles.modalBody}>
          {/* Row 1: Name, Code & Type */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr 0.8fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                اسم الطريق / المحور *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => onFormFieldChange("name", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="مثال: طريق القاهرة - الإسكندرية الصحراوي"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                كود الطريق
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => onFormFieldChange("code", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="M1"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                التصنيف *
              </label>
              <select
                value={formData.type}
                onChange={(e) => onFormFieldChange("type", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
              >
                {ROAD_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Endpoints & Length */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                نقطة البداية *
              </label>
              <input
                type="text"
                required
                value={formData.startPoint}
                onChange={(e) => onFormFieldChange("startPoint", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="مثال: ميدان الرماية - الجيزة"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                نقطة النهاية *
              </label>
              <input
                type="text"
                required
                value={formData.endPoint}
                onChange={(e) => onFormFieldChange("endPoint", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="مثال: بوابة الإسكندرية"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                الطول الإجمالي (كم) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formData.lengthKm}
                onChange={(e) => onFormFieldChange("lengthKm", Number(e.target.value))}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="220"
              />
            </div>
          </div>

          {/* Row 3: Governorates & Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                المحافظات المخدومة (مفصولة بفاصلة)
              </label>
              <input
                type="text"
                value={formData.governorates}
                onChange={(e) => onFormFieldChange("governorates", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="مثال: الجيزة، البحيرة، الإسكندرية"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                حالة الطريق والسيولة
              </label>
              <select
                value={formData.status}
                onChange={(e) => onFormFieldChange("status", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
              >
                {ROAD_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Speed Limits Grid */}
          <div
            style={{
              background: "var(--bg-secondary, rgba(255, 255, 255, 0.02))",
              border: "1px solid var(--border-glass)",
              borderRadius: "10px",
              padding: "12px",
            }}
          >
            <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px", color: "var(--color-fg)" }}>
              السرعات المقررة قانوناً (كم/س):
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
              <div>
                <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>ملاكي</label>
                <input
                  type="number"
                  value={formData.speed_private_car}
                  onChange={(e) => onFormFieldChange("speed_private_car", Number(e.target.value))}
                  className="input-fields"
                  style={{ width: "100%", padding: "4px 6px", fontSize: "0.82rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>ميني باص</label>
                <input
                  type="number"
                  value={formData.speed_minibus}
                  onChange={(e) => onFormFieldChange("speed_minibus", Number(e.target.value))}
                  className="input-fields"
                  style={{ width: "100%", padding: "4px 6px", fontSize: "0.82rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>ميكروباص</label>
                <input
                  type="number"
                  value={formData.speed_microbus}
                  onChange={(e) => onFormFieldChange("speed_microbus", Number(e.target.value))}
                  className="input-fields"
                  style={{ width: "100%", padding: "4px 6px", fontSize: "0.82rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>ربع نقل</label>
                <input
                  type="number"
                  value={formData.speed_pickup}
                  onChange={(e) => onFormFieldChange("speed_pickup", Number(e.target.value))}
                  className="input-fields"
                  style={{ width: "100%", padding: "4px 6px", fontSize: "0.82rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>أتوبيس</label>
                <input
                  type="number"
                  value={formData.speed_bus}
                  onChange={(e) => onFormFieldChange("speed_bus", Number(e.target.value))}
                  className="input-fields"
                  style={{ width: "100%", padding: "4px 6px", fontSize: "0.82rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>نقل ثقيل</label>
                <input
                  type="number"
                  value={formData.speed_truck}
                  onChange={(e) => onFormFieldChange("speed_truck", Number(e.target.value))}
                  className="input-fields"
                  style={{ width: "100%", padding: "4px 6px", fontSize: "0.82rem" }}
                />
              </div>
            </div>
          </div>

          {/* Row 5: Lanes & Emergency Phone */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                عدد الحارات في كل اتجاه
              </label>
              <input
                type="number"
                min="1"
                value={formData.lanesCount}
                onChange={(e) => onFormFieldChange("lanesCount", Number(e.target.value))}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="4"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                رقم طوارئ المرور والإغاثة
              </label>
              <input
                type="text"
                value={formData.emergencyPhone}
                onChange={(e) => onFormFieldChange("emergencyPhone", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="01221110000"
              />
            </div>
          </div>

          {/* Row 6: Description & Radar Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                وصف ومعلومات الطريق
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => onFormFieldChange("description", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="معلومات إضافية..."
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                أماكن الرادارات والخدمات
              </label>
              <input
                type="text"
                value={formData.radarInfo}
                onChange={(e) => onFormFieldChange("radarInfo", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="رادارات حديثة ثابتة ومتحركة..."
              />
            </div>
          </div>

          {/* Row 7: Google Map URL */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              رابط الطريق على خرائط Google
            </label>
            <input
              type="url"
              value={formData.mapUrl}
              onChange={(e) => onFormFieldChange("mapUrl", e.target.value)}
              className="input-fields"
              style={{ width: "100%", direction: "ltr", textAlign: "left" }}
              placeholder="https://maps.google.com/?q=..."
            />
          </div>

          {/* Modal Footer */}
          <div className={roadsStyles.modalFooter} style={{ padding: "16px 0 0 0", marginTop: "10px" }}>
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
              <span>{editingRoad ? "حفظ التعديلات" : "إضافة الطريق"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
