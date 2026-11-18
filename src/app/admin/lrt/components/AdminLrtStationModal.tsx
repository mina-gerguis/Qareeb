import React from "react";
import clsx from "clsx";
import { LrtStation, LrtStationFormData } from "../types";
import { getNextStationOrder } from "../utils";
import lrtStyles from "../admin-lrt.module.css";
import { IconArchiveFilled, IconSquareRoundedXFilled } from "@tabler/icons-react";

interface AdminLrtStationModalProps {
  isOpen: boolean;
  editingStation: LrtStation | null;
  formData: LrtStationFormData;
  lrtStations: LrtStation[];
  onClose: () => void;
  onChange: (data: LrtStationFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminLrtStationModal({
  isOpen,
  editingStation,
  formData,
  lrtStations,
  onClose,
  onChange,
  onSubmit,
}: AdminLrtStationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={lrtStyles.modalOverlay}>
      <div className={lrtStyles.modalContent}>
        {/* Header */}
        <div className={lrtStyles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
            {editingStation ? "تعديل محطة قطار كهربائي" : "إضافة محطة قطار جديدة"}
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

        <form onSubmit={onSubmit} className={lrtStyles.modalBody}>
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
              المسار / الفرعة *
            </label>
            <select
              value={formData.line_type || "trunk"}
              onChange={e => {
                const newLine = e.target.value;
                onChange({
                  ...formData,
                  line_type: newLine,
                  station_order: !editingStation ? getNextStationOrder(newLine, lrtStations) : formData.station_order,
                });
              }}
              className="input-fields"
              style={{ width: "100%" }}
            >
              <option value="trunk">الجذع الرئيسي (عدلي منصور - بدر)</option>
              <option value="capital">تفريعة العاصمة (بدر - الفنون والثقافة)</option>
              <option value="ramadan">تفريعة العاشر (بدر - مدينة المعرفة)</option>
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label className={clsx("help-label")}>ترتيب المحطة في المسار *</label>
              {!editingStation && (
                <span style={{ fontSize: "0.75rem", color: "var(--color-primary, #818cf8)", fontWeight: "700" }}>
                  (المحطة الأخيرة حالياً رقم {Math.max(0, getNextStationOrder(formData.line_type, lrtStations) - 1)})
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
              value={formData.status || "تشغيل فعلي"}
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
              placeholder="مثال: محطة عدلي منصور التبادلية، الجامعة البريطانية، مدينة الفنون والثقافة..."
              rows={3}
              value={formData.landmarks || ""}
              onChange={e => onChange({ ...formData, landmarks: e.target.value })}
              className="input-fields"
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          <div className={lrtStyles.modalFooter}>
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
