import React from "react";
import clsx from "clsx";
import { MetroStation, MetroStationFormData } from "../types";
import { getNextStationOrder } from "../utils";
import metroStyles from "../admin-metro.module.css";
import { IconArchiveFilled, IconSquareRoundedXFilled } from "@tabler/icons-react";

interface AdminMetroStationModalProps {
  isOpen: boolean;
  editingStation: MetroStation | null;
  formData: MetroStationFormData;
  metroStations: MetroStation[];
  onClose: () => void;
  onChange: (data: MetroStationFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminMetroStationModal({
  isOpen,
  editingStation,
  formData,
  metroStations,
  onClose,
  onChange,
  onSubmit,
}: AdminMetroStationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={metroStyles.modalOverlay}>
      <div className={metroStyles.modalContent}>
        {/* Header */}
        <div className={metroStyles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
            {editingStation ? "تعديل محطة مترو" : "إضافة محطة مترو جديدة"}
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

        <form onSubmit={onSubmit} className={metroStyles.modalBody}>
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
              الخط المترو *
            </label>
            <select
              value={formData.line_type || "line1"}
              onChange={e => {
                const newLine = e.target.value;
                onChange({
                  ...formData,
                  line_type: newLine,
                  station_order: !editingStation ? getNextStationOrder(newLine, metroStations) : formData.station_order,
                });
              }}
              className="input-fields"
              style={{ width: "100%" }}
            >
              <option value="line1">الخط الأول (حلوان - المرج)</option>
              <option value="line2">الخط الثاني (شبرا - المنيب)</option>
              <option value="line3">الخط الثالث (عدلي منصور - الكيت كات)</option>
              <option value="line3_branch_a">الخط الثالث (روض الفرج)</option>
              <option value="line3_branch_b">الخط الثالث (جامعة القاهرة)</option>
              <option value="line4">الخط الرابع (تحت الإنشاء)</option>
              <option value="line5">الخط الخامس (تحت الإنشاء)</option>
              <option value="line6">الخط السادس (تحت الإنشاء)</option>
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label className={clsx("help-label")}>ترتيب المحطة في الخط *</label>
              {!editingStation && (
                <span style={{ fontSize: "0.75rem", color: "var(--color-primary, #818cf8)", fontWeight: "700" }}>
                  (المحطة الأخيرة حالياً رقم {Math.max(0, getNextStationOrder(formData.line_type, metroStations) - 1)})
                </span>
              )}
            </div>
            <input
              type="number"
              required
              min={1}
              placeholder="أدخل ترتيب المحطة في الخط"
              value={formData.station_order || 1}
              onChange={e => onChange({ ...formData, station_order: parseInt(e.target.value) || 1 })}
              className="input-fields"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              المعالم والأماكن القريبة (مفصولة بفاصلة)
            </label>
            <input
              type="text"
              placeholder="مثال: جامعة القاهرة، حديقة الأورمان"
              value={formData.landmarks || ""}
              onChange={e => onChange({ ...formData, landmarks: e.target.value })}
              className="input-fields"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              حالة المحطة *
            </label>
            <select
              value={formData.status || "يعمل"}
              onChange={e => onChange({ ...formData, status: e.target.value })}
              className="input-fields"
              style={{ width: "100%" }}
            >
              <option value="يعمل">يعمل (في الخدمة)</option>
              <option value="تشغيل تجريبي">تشغيل تجريبي (تجريبي)</option>
              <option value="تحت الإنشاء">تحت الإنشاء (ليست في الخدمة)</option>
            </select>
          </div>

          <div className={`${metroStyles.modalFooter} gap-3`}>
            <button
              type="submit"
              className="btn btn-blue w-full"
            >
              <IconArchiveFilled size={20}/>
              {editingStation ? "حفظ التغييرات" : "إضافة المحطة"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel w-full"
            >
              <IconSquareRoundedXFilled size={20}/>
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

