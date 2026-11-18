import React from "react";
import clsx from "clsx";
import { RailwayRoute, RailwayLineFormData } from "../types";
import railwaysStyles from "../admin-railways.module.css";
import { IconArchiveFilled } from "@tabler/icons-react";

interface AdminRailwaysLineModalProps {
  isOpen: boolean;
  editingLine: RailwayRoute | null;
  formData: RailwayLineFormData;
  onClose: () => void;
  onChange: (data: RailwayLineFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminRailwaysLineModal({
  isOpen,
  editingLine,
  formData,
  onClose,
  onChange,
  onSubmit,
}: AdminRailwaysLineModalProps) {
  if (!isOpen) return null;

  return (
    <div className={railwaysStyles.modalOverlay}>
      <div className={railwaysStyles.modalContent}>
        {/* Header */}
        <div className={railwaysStyles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
            {editingLine ? "تعديل بيانات المسار" : "إضافة مسار قطار جديد"}
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

        <form onSubmit={onSubmit} className={railwaysStyles.modalBody}>
          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              معرف المسار (ID بالإنجليزية) *
            </label>
            <input
              type="text"
              required
              disabled={Boolean(editingLine)}
              placeholder="مثال: cairo-mansoura"
              value={formData.id}
              onChange={e => onChange({ ...formData, id: e.target.value })}
              className="input-fields"
              style={{ width: "100%", opacity: editingLine ? 0.6 : 1 }}
            />
            {editingLine && (
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                لا يمكن تغيير معرف المسار بعد إنشائه
              </span>
            )}
          </div>

          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              اسم الخط / المسار *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: القاهرة - المنصورة"
              value={formData.name}
              onChange={e => onChange({ ...formData, name: e.target.value })}
              className="input-fields"
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                محطة البداية *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: محطة مصر (رمسيس)"
                value={formData.from}
                onChange={e => onChange({ ...formData, from: e.target.value })}
                className="input-fields"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
                محطة الوصول *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: محطة المنصورة"
                value={formData.to}
                onChange={e => onChange({ ...formData, to: e.target.value })}
                className="input-fields"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              مدة الرحلة المتوقعة
            </label>
            <input
              type="text"
              placeholder="مثال: ساعتان ونصف"
              value={formData.duration}
              onChange={e => onChange({ ...formData, duration: e.target.value })}
              className="input-fields"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className={clsx("help-label")} style={{ display: "block", marginBottom: "6px" }}>
              إرشادات وملاحظات إضافية (اختياري)
            </label>
            <textarea
              rows={3}
              placeholder="نصائح هامة للمسافرين أو مواعيد الحجز..."
              value={formData.tips}
              onChange={e => onChange({ ...formData, tips: e.target.value })}
              className="input-fields"
              style={{ width: "100%", resize: "vertical" }}
            />
          </div>

          {/* Modal Footer */}
          <div className={railwaysStyles.modalFooter}>
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              <IconArchiveFilled size={18} />
              <span>{editingLine ? "حفظ التعديلات" : "إضافة المسار"}</span>
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
