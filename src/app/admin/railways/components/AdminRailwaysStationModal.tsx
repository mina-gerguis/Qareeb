import React from "react";
import clsx from "clsx";
import { RailwayRoute, RailwayStationFormData } from "../types";
import railwaysStyles from "../admin-railways.module.css";
import { IconArchiveFilled } from "@tabler/icons-react";

interface AdminRailwaysStationModalProps {
  isOpen: boolean;
  editingStation: { id?: string; index: number; name: string; status: "تعمل" | "تشغيل فعلي" | "تحت الإنشاء" } | null;
  formData: RailwayStationFormData;
  activeRoute?: RailwayRoute;
  onClose: () => void;
  onChange: (data: RailwayStationFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminRailwaysStationModal({
  isOpen,
  editingStation,
  formData,
  activeRoute,
  onClose,
  onChange,
  onSubmit,
}: AdminRailwaysStationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={railwaysStyles.modalOverlay}>
      <div className={railwaysStyles.modalContent}>
        {/* Header */}
        <div className={railwaysStyles.modalHeader}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
              {editingStation ? "تعديل محطة توقف" : "إضافة محطة توقف جديدة"}
            </h3>
            {activeRoute && (
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px", display: "block" }}>
                لخط: {activeRoute.name}
              </span>
            )}
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

        <form onSubmit={onSubmit} className={railwaysStyles.modalBody}>
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              اسم المحطة *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: محطة طنطا"
              value={formData.name || ""}
              onChange={e => onChange({ ...formData, name: e.target.value })}
              className="input-fields"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              الحالة التشغيلية *
            </label>
            <select
              value={formData.status}
              onChange={e => onChange({ ...formData, status: e.target.value as "تشغيل فعلي" | "تحت الإنشاء" })}
              className="input-fields"
              style={{ width: "100%" }}
            >
              <option value="تشغيل فعلي">تشغيل فعلي</option>
              <option value="تحت الإنشاء">تحت الإنشاء</option>
            </select>
          </div>

          {/* Modal Footer */}
          <div className={railwaysStyles.modalFooter}>
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
              <span>{editingStation ? "حفظ التعديلات" : "إضافة المحطة"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
