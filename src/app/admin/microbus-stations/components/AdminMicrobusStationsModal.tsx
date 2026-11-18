"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { AdminMicrobusStation, AdminMicrobusRoute, MicrobusStationFormData } from "../types";
import { GOVERNORATES_LIST } from "../constants";
import { RouteItemEditor } from "./RouteItemEditor";
import microStyles from "../admin-microbus-stations.module.css";
import { IconArchiveFilled, IconPlus, IconRoute, IconMapPin } from "@tabler/icons-react";

interface AdminMicrobusStationsModalProps {
  isOpen: boolean;
  editingItem: AdminMicrobusStation | null;
  formData: MicrobusStationFormData;
  visualRoutes: AdminMicrobusRoute[];
  onClose: () => void;
  onFormFieldChange: (field: keyof MicrobusStationFormData, value: string) => void;
  onRouteFieldChange: (index: number, field: keyof AdminMicrobusRoute, value: string) => void;
  onAddRoute: () => void;
  onRemoveRoute: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminMicrobusStationsModal({
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
}: AdminMicrobusStationsModalProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "routes">("basic");

  if (!isOpen) return null;

  return (
    <div className={microStyles.modalOverlay}>
      <div className={microStyles.modalContent} style={{ maxWidth: "680px" }}>
        {/* Modal Header */}
        <div className={microStyles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
            {editingItem ? "تعديل موقف السرفيس" : "إضافة موقف سرفيس جديد"}
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

        {/* Modal Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "10px 20px 0 20px",
            borderBottom: "1px solid var(--border-glass)",
            background: "var(--bg-secondary)",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "basic" ? "2px solid #f59e0b" : "2px solid transparent",
              color: activeTab === "basic" ? "#f59e0b" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <IconMapPin size={16} />
            <span>بيانات الموقف والموقع</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("routes")}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "routes" ? "2px solid #f59e0b" : "2px solid transparent",
              color: activeTab === "routes" ? "#f59e0b" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <IconRoute size={16} />
            <span>خطوط السير والتعريفة ({visualRoutes.length})</span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={onSubmit} className={microStyles.modalBody}>
          {activeTab === "basic" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Row 1: Name & Governorate */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
                <div>
                  <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                    اسم موقف السرفيس *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => onFormFieldChange("name", e.target.value)}
                    className="input-fields"
                    style={{ width: "100%" }}
                    placeholder="مثال: موقف رمسيس الكبرى (أحمد حلمي)"
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
                  العنوان والموقع بالتفصيل *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => onFormFieldChange("location", e.target.value)}
                  className="input-fields"
                  style={{ width: "100%" }}
                  placeholder="مثال: وسط البلد - بجوار محطة قطارات رمسيس ومترو الشهداء"
                />
              </div>

              {/* Row 3: Google Maps URL */}
              <div>
                <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                  رابط موقع الموقف على خرائط Google (اختياري)
                </label>
                <input
                  type="url"
                  value={formData.map_url}
                  onChange={(e) => onFormFieldChange("map_url", e.target.value)}
                  className="input-fields"
                  style={{ width: "100%", direction: "ltr", textAlign: "left" }}
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>
            </div>
          )}

          {activeTab === "routes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--color-fg)" }}>
                    قائمة خطوط السير والتعريفة المعتمدة
                  </h4>
                  <p style={{ margin: "2px 0 0 0", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    أضف وجهات الخطوط والأجرة الرسمية ونوع المركبة وخط السير
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onAddRoute}
                  className="btn btn-secondary btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
                >
                  <IconPlus size={16} />
                  <span>إضافة مسار جديد</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "380px", overflowY: "auto" }}>
                {visualRoutes.map((route, idx) => (
                  <RouteItemEditor
                    key={idx}
                    index={idx}
                    route={route}
                    totalRoutes={visualRoutes.length}
                    onFieldChange={(field, val) => onRouteFieldChange(idx, field, val)}
                    onRemove={() => onRemoveRoute(idx)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className={microStyles.modalFooter} style={{ padding: "16px 0 0 0", marginTop: "10px" }}>
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
              <span>{editingItem ? "حفظ التعديلات" : "إضافة الموقف"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
