"use client";

import React from "react";
import clsx from "clsx";
import { PortItem, PortFormData } from "../types";
import { PORT_SEA_OPTIONS, PORT_STATUS_OPTIONS } from "../constants";
import portsStyles from "../admin-ports.module.css";
import {
  IconAnchor,
  IconArchiveFilled,
  IconSquareRoundedXFilled,
} from "@tabler/icons-react";

interface AdminPortModalProps {
  isOpen: boolean;
  editingItem: PortItem | null;
  formData: PortFormData;
  isSubmitting?: boolean;
  onClose: () => void;
  onFormFieldChange: (field: keyof PortFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminPortModal({
  isOpen,
  editingItem,
  formData,
  isSubmitting = false,
  onClose,
  onFormFieldChange,
  onSubmit,
}: AdminPortModalProps) {
  if (!isOpen) return null;

  return (
    <div className={portsStyles.modalOverlay}>
      <div className={portsStyles.modalContent} style={{ maxWidth: "660px" }}>
        {/* Modal Header */}
        <div className={portsStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(59, 130, 246, 0.15)",
                color: "#3b82f6",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconAnchor size={18} />
            </span>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
              {editingItem ? "تعديل بيانات الميناء البحري" : "إضافة ميناء بحري جديد"}
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

        {/* Modal Body Form */}
        <form onSubmit={onSubmit} className={portsStyles.modalBody} style={{ maxHeight: "70vh" }}>
          {/* Row 1: Name & Governorate */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                اسم الميناء البحري *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => onFormFieldChange("name", e.target.value)}
                placeholder="مثال: ميناء الإسكندرية البحري"
                className="input-fields"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                المحافظة التابع لها *
              </label>
              <input
                type="text"
                required
                value={formData.governorate}
                onChange={(e) => onFormFieldChange("governorate", e.target.value)}
                placeholder="مثال: الإسكندرية"
                className="input-fields"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Row 2: Sea & Type */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                المسطح المائي (البحر) *
              </label>
              <select
                value={formData.sea}
                onChange={(e) => onFormFieldChange("sea", e.target.value)}
                className="input-fields"
                style={{ width: "100%", padding: "8px" }}
              >
                {PORT_SEA_OPTIONS.map((sea) => (
                  <option key={sea} value={sea}>
                    {sea}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                نوع وتخصص الميناء *
              </label>
              <input
                type="text"
                required
                value={formData.type}
                onChange={(e) => onFormFieldChange("type", e.target.value)}
                placeholder="مثال: تجاري / حاويات / ركاب / تعدين"
                className="input-fields"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Row 3: Capacity & Importance */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              السعة والأهمية الاستراتيجية *
            </label>
            <input
              type="text"
              required
              value={formData.capacity}
              onChange={(e) => onFormFieldChange("capacity", e.target.value)}
              placeholder="مثال: يستقبل أكثر من 60% من تجارة مصر الخارجية..."
              className="input-fields"
              style={{ width: "100%" }}
            />
          </div>

          {/* Row 4: Description */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              الوصف التفصيلي والخدمات المتاحة
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormFieldChange("description", e.target.value)}
              placeholder="تفاصيل تاريخية، محطات الصب الجاف والسائل، والترسانات..."
              className="input-fields"
              style={{ width: "100%", height: "80px", resize: "vertical" }}
            />
          </div>

          {/* Row 5: Operator & Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                الهيئة أو الجهة المشغلة
              </label>
              <input
                type="text"
                value={formData.operator}
                onChange={(e) => onFormFieldChange("operator", e.target.value)}
                placeholder="مثال: هيئة ميناء الإسكندرية / هيئة موانئ البحر الأحمر"
                className="input-fields"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                الحالة التشغيلية
              </label>
              <select
                value={formData.status}
                onChange={(e) => onFormFieldChange("status", e.target.value)}
                className="input-fields"
                style={{ width: "100%", padding: "8px" }}
              >
                {PORT_STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 6: Berths count & Connections */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                عدد ومواصفات الأرصفة
              </label>
              <input
                type="text"
                value={formData.berths_count}
                onChange={(e) => onFormFieldChange("berths_count", e.target.value)}
                placeholder="مثال: أكثر من 80 رصيفاً بأعماق تصل إلى 15م"
                className="input-fields"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                الربط والمحاور (افصل بفاصلة)
              </label>
              <input
                type="text"
                value={formData.connections}
                onChange={(e) => onFormFieldChange("connections", e.target.value)}
                placeholder="الطريق الدولي الساحلي, شبكة السكك الحديدية..."
                className="input-fields"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Row 7: Map URL */}
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              رابط موقع خرائط جوجل (Google Maps) *
            </label>
            <input
              type="url"
              required
              value={formData.map_url}
              onChange={(e) => onFormFieldChange("map_url", e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="input-fields"
              style={{ width: "100%", direction: "ltr" }}
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className={`${portsStyles.modalFooter} gap-3`}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-blue w-full"
            >
              <IconArchiveFilled size={20} />
              <span>{isSubmitting ? "جاري الحفظ..." : editingItem ? "حفظ التغييرات" : "إضافة الميناء"}</span>
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
