import React from "react";
import clsx from "clsx";
import { MonorailStation, MonorailStationFormData } from "../types";
import { getNextStationOrder } from "../utils";
import monorailStyles from "../admin-monorail.module.css";
import { IconArchiveFilled, IconSquareRoundedXFilled } from "@tabler/icons-react";

interface AdminMonorailStationModalProps {
  isOpen: boolean;
  editingStation: MonorailStation | null;
  formData: MonorailStationFormData;
  monorailStations: MonorailStation[];
  onClose: () => void;
  onChange: (data: MonorailStationFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminMonorailStationModal({
  isOpen,
  editingStation,
  formData,
  monorailStations,
  onClose,
  onChange,
  onSubmit,
}: AdminMonorailStationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={monorailStyles.modalOverlay}>
      <div className={monorailStyles.modalContent}>
        {/* Header */}
        <div className={monorailStyles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
            {editingStation ? "تعديل محطة مونوريل" : "إضافة محطة مونوريل جديدة"}
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

        <form onSubmit={onSubmit} className={monorailStyles.modalBody}>
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              اسم المحطة *
            </label>
            <input
              type="text"
              required
              placeholder="أدخل اسم المحطة"
              value={formData.name || ""}
              onChange={e => onChange({ ...formData, name: e.target.value })}
              className="input-fields"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              المسار / الخط *
            </label>
            <select
              value={formData.line_type || "east"}
              onChange={e => {
                const newLine = e.target.value;
                onChange({
                  ...formData,
                  line_type: newLine,
                  station_order: !editingStation ? getNextStationOrder(newLine, monorailStations) : formData.station_order,
                });
              }}
              className="input-fields"
              style={{ width: "100%" }}
            >
              <option value="east">مونوريل شرق النيل (الاستاد - العاصمة الإدارية)</option>
              <option value="west">مونوريل غرب النيل (وادي النيل - 6 أكتوبر)</option>
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label className={clsx("help-label")}>ترتيب المحطة في المسار *</label>
              {!editingStation && (
                <span style={{ fontSize: "0.75rem", color: "var(--color-primary, #818cf8)", fontWeight: "700" }}>
                  (المحطة الأخيرة حالياً رقم {Math.max(0, getNextStationOrder(formData.line_type, monorailStations) - 1)})
                </span>
              )}
            </div>
            <input
              type="number"
              required
              min={1}
              value={formData.station_order || 1}
              onChange={e => onChange({ ...formData, station_order: parseInt(e.target.value) || 1 })}
              className="input-fields"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              حالة تشغيل المحطة *
            </label>
            <select
              value={formData.status || "تحت الإنشاء"}
              onChange={e => onChange({ ...formData, status: e.target.value })}
              className="input-fields"
              style={{ width: "100%" }}
            >
              <option value="تشغيل فعلي">تشغيل فعلي</option>
              <option value="تشغيل تجريبي">تشغيل تجريبي</option>
              <option value="تحت الإنشاء">تحت الإنشاء</option>
            </select>
          </div>

          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              المعالم والأماكن القريبة (مفصولة بفاصلة ,)
            </label>
            <textarea
              placeholder="مثال: ستاد القاهرة، الجامعة الأمريكية، مسجد الفتاح العليم..."
              rows={3}
              value={formData.landmarks || ""}
              onChange={e => onChange({ ...formData, landmarks: e.target.value })}
              className="input-fields"
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          <div className={monorailStyles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel w-full"
            >
              <IconSquareRoundedXFilled size={18} />
              إلغاء
            </button>
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              <IconArchiveFilled size={18} />
              {editingStation ? "حفظ التعديلات" : "إضافة المحطة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
