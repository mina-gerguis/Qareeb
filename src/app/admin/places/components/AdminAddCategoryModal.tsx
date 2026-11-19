import React from "react";
import styles from "../admin-places.module.css";
import { PRESET_BOXICONS } from "../constants";
import { IconX, IconCategory, IconPlus } from "@tabler/icons-react";

interface Props {
  isOpen: boolean;
  newCatLabel: string;
  newCatKey: string;
  newCatIcon: string;
  isAdding: boolean;
  onClose: () => void;
  onSetLabel: (val: string) => void;
  onSetKey: (val: string) => void;
  onSetIcon: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AdminAddCategoryModal: React.FC<Props> = ({
  isOpen,
  newCatLabel,
  newCatKey,
  newCatIcon,
  isAdding,
  onClose,
  onSetLabel,
  onSetKey,
  onSetIcon,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{ maxWidth: "520px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(108, 99, 255, 0.15)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem"
              }}
            >
              <IconCategory size={22} />
            </div>
            <h3 className={styles.modalTitle} style={{ margin: 0 }}>
              إضافة تصنيف جديد
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.modalCloseBtn}
            aria-label="إغلاق"
          >
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>اسم التصنيف (بالعربية) *</label>
            <input
              required
              className={styles.formInput}
              value={newCatLabel}
              onChange={(e) => {
                onSetLabel(e.target.value);
                if (!newCatKey) {
                  onSetKey(
                    e.target.value
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, "_")
                      .replace(/[^a-z0-9_]/g, "")
                  );
                }
              }}
              placeholder="مثال: صيانة سيارات، مستلزمات طبية..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>معرّف التصنيف بالإنجليزي (اختياري)</label>
            <input
              className={styles.formInput}
              value={newCatKey}
              onChange={(e) => onSetKey(e.target.value)}
              placeholder="مثال: car_repair, medical_supplies"
              style={{ direction: "ltr", textAlign: "right" }}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>أيقونة التصنيف من Boxicons</label>

            {/* Live Icon Preview */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(108, 99, 255, 0.08)",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(108, 99, 255, 0.2)",
                marginBottom: "12px"
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "1.3rem"
                }}
              >
                <i className={newCatIcon} />
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-fg)" }}>
                  الأيقونة المختارة:
                </div>
                <code style={{ fontSize: "0.8rem", color: "var(--color-primary)", direction: "ltr" }}>
                  {newCatIcon}
                </code>
              </div>
            </div>

            {/* Presets Grid */}
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: 600 }}>
              أيقونات مقترحة للاختيار السريع:
            </div>
            <div className={styles.categoryPresetGrid}>
              {PRESET_BOXICONS.map((item) => (
                <button
                  key={item.icon}
                  type="button"
                  onClick={() => onSetIcon(item.icon)}
                  className={`${styles.presetIconBtn} ${
                    newCatIcon === item.icon ? styles.presetIconBtnActive : ""
                  }`}
                >
                  <i className={item.icon} style={{ fontSize: "1.1rem", color: "var(--color-primary)" }} />
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                  </span>
                </button>
              ))}
            </div>

            <label className={styles.formLabel} style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              أو اكتب كلاس الأيقونة مباشرة:
            </label>
            <input
              className={styles.formInput}
              value={newCatIcon}
              onChange={(e) => onSetIcon(e.target.value)}
              placeholder="bx bx-store"
              style={{ direction: "ltr", textAlign: "right" }}
            />
          </div>

          <div className={styles.modalFooter} style={{ padding: "14px 0 0 0" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel"
              disabled={isAdding}
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isAdding || !newCatLabel.trim()}
            >
              {isAdding ? "جاري الحفظ..." : "حفظ التصنيف"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
