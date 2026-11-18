"use client";

import React from "react";
import clsx from "clsx";
import { AdminBrtStation, AdminBrtRoute, BrtStationFormData } from "../types";
import { BrtRouteItemEditor } from "./BrtRouteItemEditor";
import { BRT_SECTORS, BRT_STATUS_OPTIONS, BRT_TYPE_OPTIONS } from "../constants";
import brtStyles from "../admin-brt.module.css";
import { IconArchiveFilled, IconPlus, IconXFilled } from "@tabler/icons-react";

interface AdminBrtStationModalProps {
  isOpen: boolean;
  editingItem: AdminBrtStation | null;
  formData: BrtStationFormData;
  visualRoutes: AdminBrtRoute[];
  onClose: () => void;
  onFormFieldChange: (field: keyof BrtStationFormData, value: string) => void;
  onRouteFieldChange: (index: number, field: keyof AdminBrtRoute, value: string) => void;
  onAddRoute: () => void;
  onRemoveRoute: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminBrtStationModal({
  isOpen,
  editingItem,
  formData,
  visualRoutes,
  onClose,
  onFormFieldChange,
  onRouteFieldChange,
  onAddRoute,
  onRemoveRoute,
  onSubmit,
}: AdminBrtStationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={brtStyles.modalOverlay}>
      <div className={brtStyles.modalContent} style={{ maxWidth: "680px" }}>
        {/* Modal Header */}
        <div className={brtStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
              {editingItem ? "تعديل محطة الأتوبيس الترددي" : "إضافة محطة جديدة"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn-close"
            type="button"
            aria-label="إغلاق"
          >
            <IconXFilled size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className={brtStyles.modalBody}>
          {/* Row 1: Name & Sector */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                اسم المحطة *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => onFormFieldChange("name", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="مثال: محطة أكاديمية الشرطة"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                القطاع على الدائري *
              </label>
              <select
                value={formData.sector}
                onChange={(e) => onFormFieldChange("sector", e.target.value as any)}
                className="input-fields"
                style={{ width: "100%" }}
              >
                {BRT_SECTORS.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Location & Governorate */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                الموقع / الكيلو على الدائري *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => onFormFieldChange("location", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="مثال: التجمع الخامس، بالقرب من محور طه حسين"
              />
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                المحافظة
              </label>
              <input
                type="text"
                value={formData.governorate}
                onChange={(e) => onFormFieldChange("governorate", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
                placeholder="مثال: القاهرة أو الجيزة"
              />
            </div>
          </div>

          {/* Row 3: Status & Type */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                الحالة التشغيلية
              </label>
              <select
                value={formData.status}
                onChange={(e) => onFormFieldChange("status", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
              >
                {BRT_STATUS_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                نوع المحطة
              </label>
              <select
                value={formData.type}
                onChange={(e) => onFormFieldChange("type", e.target.value)}
                className="input-fields"
                style={{ width: "100%" }}
              >
                {BRT_TYPE_OPTIONS.map((tp) => (
                  <option key={tp.value} value={tp.value}>
                    {tp.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Google Maps URL */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              رابط الموقع على Google Maps (اختياري)
            </label>
            <input
              type="url"
              value={formData.map_url}
              onChange={(e) => onFormFieldChange("map_url", e.target.value)}
              className="input-fields"
              style={{ width: "100%" }}
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>

          {/* Row 5: Landmarks */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              المعالم والأماكن القريبة (افصل بينها بفواصل أو سطر جديد)
            </label>
            <textarea
              rows={2}
              value={formData.landmarksText}
              onChange={(e) => onFormFieldChange("landmarksText", e.target.value)}
              className="input-fields"
              style={{ width: "100%", resize: "vertical" }}
              placeholder="مثال: كايرو فستيفال سيتي، الجامعة الأمريكية، المستشفى الجوي"
            />
          </div>

          {/* Section: Bus Routes & Fares */}
          <div style={{ marginTop: "8px", borderTop: "1px solid var(--border-glass, rgba(255,255,255,0.08))", paddingTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--color-fg)", display: "block" }}>
                  مسارات الأتوبيس الترددي وأسعار التذاكر
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  حدد الوجهات التي ينطلق إليها الأتوبيس من هذه المحطة وسعر التذكرة
                </span>
              </div>

              <button
                type="button"
                onClick={onAddRoute}
                className="btn btn-blue min-h-min fs-sm p-2"
              >
                <IconPlus size={16} />
                <span>إضافة مسار</span>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {visualRoutes.map((route, rIdx) => (
                <BrtRouteItemEditor
                  key={rIdx}
                  route={route}
                  index={rIdx}
                  totalRoutes={visualRoutes.length}
                  onFieldChange={(field, val) => onRouteFieldChange(rIdx, field, val)}
                  onRemove={() => onRemoveRoute(rIdx)}
                />
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className={brtStyles.modalFooter}>
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              <IconArchiveFilled size={18} />
              <span>{editingItem ? "حفظ التعديلات" : "إضافة المحطة"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel w-full"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
