import React from "react";
import { ExcelParsedPlace } from "../types";
import styles from "../admin-places.module.css";
import { CATEGORIES_STRUCTURE } from "@/data/places";
import { IconFileSpreadsheet, IconCloudUpload, IconTrash, IconSend, IconX, IconAlertTriangle } from "@tabler/icons-react";

interface Props {
  isOpen: boolean;
  importing: boolean;
  parsedPlaces: ExcelParsedPlace[];
  selectedIndices: Set<number>;
  searchQuery: string;
  importError: string;
  importSuccess: string;
  duplicates: any[];
  onClose: () => void;
  onDownloadTemplate: () => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchChange: (q: string) => void;
  onRemoveDuplicates: () => void;
  onDeleteParsedPlace: (idx: number) => void;
  onDeleteSelectedParsedPlaces: () => void;
  onToggleSelectParsed: (idx: number) => void;
  onToggleSelectAllParsed: (indices: number[]) => void;
  onSubmitImport: () => void;
}

export const AdminExcelImportModal: React.FC<Props> = ({
  isOpen,
  importing,
  parsedPlaces,
  selectedIndices,
  searchQuery,
  importError,
  importSuccess,
  duplicates,
  onClose,
  onDownloadTemplate,
  onUploadFile,
  onSearchChange,
  onRemoveDuplicates,
  onDeleteParsedPlace,
  onDeleteSelectedParsedPlaces,
  onToggleSelectParsed,
  onToggleSelectAllParsed,
  onSubmitImport,
}) => {
  if (!isOpen) return null;

  const q = searchQuery.trim().toLowerCase();
  const visiblePlacesWithIdx = parsedPlaces
    .map((p, originalIdx) => ({ p, originalIdx }))
    .filter(({ p }) => {
      if (!q) return true;
      return (
        (p.name || "").toLowerCase().includes(q) ||
        (p.name_en || "").toLowerCase().includes(q) ||
        (p.category_label || "").toLowerCase().includes(q) ||
        (p.city || "").toLowerCase().includes(q) ||
        (p.full_address || "").toLowerCase().includes(q) ||
        (p.phones || []).some(ph => ph.includes(q))
      );
    });

  const visibleIndices = visiblePlacesWithIdx.map(item => item.originalIdx);
  const allVisibleSelected = visibleIndices.length > 0 && visibleIndices.every(i => selectedIndices.has(i));

  const newPlacesCount = parsedPlaces.filter(p => !p.isUpdate && p.duplicateType === null).length;
  const updatePlacesCount = parsedPlaces.filter(p => p.isUpdate).length;
  const duplicatePlacesCount = duplicates.length;

  return (
    <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(52, 199, 89, 0.3)", marginBottom: "30px", animation: "slide-in-section 0.3s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--color-fg)", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
          <IconFileSpreadsheet size={24} style={{ color: "#34c759" }} />
          <span>استيراد وتحديث الأماكن من ملف Excel / CSV</span>
        </h3>

        <button
          type="button"
          onClick={onClose}
          className="btn btn-cancel"
          style={{ padding: "6px 12px", fontSize: "0.85rem", cursor: "pointer" }}
        >
          إغلاق نافذة الاستيراد
        </button>
      </div>

      {/* Guide & Template download */}
      <details style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "12px", border: "1px solid var(--border-glass)", padding: "12px 16px", marginBottom: "18px" }}>
        <summary style={{ cursor: "pointer", fontWeight: "700", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>📖 إرشادات تنسيق ملف Excel وتحميل القالب النموذجي</span>
        </summary>

        <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onDownloadTemplate}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "10px", fontWeight: 700, fontSize: "0.85rem" }}
            >
              <i className="bx bx-download" />
              تحميل نموذج ملف Excel الجاهز (.xlsx)
            </button>
          </div>

          <div style={{ fontSize: "0.85rem", lineHeight: "1.6", color: "var(--text-secondary)" }}>
            <p style={{ margin: "0 0 6px 0", fontWeight: 700, color: "var(--color-fg)" }}>
              طرق كتابة مواعيد العمل في ملف الإكسيل:
            </p>
            <ul style={{ margin: 0, paddingRight: "20px" }}>
              <li><strong>24 ساعة:</strong> اكتب <code>24/7</code> أو <code>24 ساعة</code>.</li>
              <li><strong>مواعيد متغيرة لكل يوم في عمود واحد:</strong> اكتب <code>السبت - الأربعاء: 09:00 ص - 11:00 م | الخميس: 09:00 ص - 12:00 م | الجمعة: إجازة</code></li>
              <li><strong>أعمدة يومية مستقلة:</strong> أضف أعمدة باسم <code>مواعيد الأحد</code>، <code>مواعيد الإثنين</code>... إلخ.</li>
            </ul>
          </div>
        </div>
      </details>

      {/* Dropzone */}
      <div className={styles.excelDropzone}>
        <IconCloudUpload className={styles.excelDropzoneIcon} />
        <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--color-fg)" }}>
          اختر ملف Excel أو اسحبه إلى هنا
        </span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          يدعم الملفات بصيغة .xlsx, .xls, .csv
        </span>
        <input
          id="excel-file-input"
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={onUploadFile}
          className={styles.excelFileInput}
        />
      </div>

      {/* Alert Messages */}
      {importError && (
        <div style={{ background: "rgba(255, 59, 48, 0.12)", border: "1px solid rgba(255, 59, 48, 0.25)", padding: "12px 16px", borderRadius: "10px", color: "#ff3b30", marginBottom: "16px", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <IconAlertTriangle size={18} />
          <div>{importError}</div>
        </div>
      )}

      {importSuccess && (
        <div style={{ background: "rgba(52, 199, 89, 0.12)", border: "1px solid rgba(52, 199, 89, 0.25)", padding: "12px 16px", borderRadius: "10px", color: "#34c759", marginBottom: "16px", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="bx bx-check-circle" style={{ fontSize: "1.2rem" }} />
          <div>{importSuccess}</div>
        </div>
      )}

      {/* Preview Section */}
      {parsedPlaces.length > 0 && (
        <div>
          {/* Controls Bar for Preview */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h5 style={{ fontSize: "0.95rem", fontWeight: "700", margin: 0 }}>
                معاينة الأماكن المستخرجة ({parsedPlaces.length}):
              </h5>
              {newPlacesCount > 0 && (
                <span className={styles.tagBadge} style={{ background: "rgba(52, 199, 89, 0.12)", color: "#34c759", fontWeight: 700 }}>
                  ✨ {newPlacesCount} جديد
                </span>
              )}
              {updatePlacesCount > 0 && (
                <span className={styles.tagBadge} style={{ background: "rgba(0, 122, 255, 0.12)", color: "#007aff", fontWeight: 700 }}>
                  🔄 {updatePlacesCount} تحديث بيانات
                </span>
              )}
              {duplicatePlacesCount > 0 && (
                <span className={styles.tagBadge} style={{ background: "rgba(255, 59, 48, 0.12)", color: "#ff3b30", fontWeight: 700 }}>
                  ⚠️ {duplicatePlacesCount} مكرر
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {selectedIndices.size > 0 && (
                <button
                  type="button"
                  onClick={onDeleteSelectedParsedPlaces}
                  className="btn btn-error"
                  style={{ fontSize: "0.82rem", padding: "6px 12px", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <IconTrash size={14} />
                  حذف المحدد ({selectedIndices.size})
                </button>
              )}

              <button
                type="button"
                disabled={importing}
                onClick={onSubmitImport}
                className="btn btn-primary"
                style={{
                  background: "#34c759",
                  borderColor: "#34c759",
                  color: "#fff",
                  padding: "6px 14px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: importing ? "not-allowed" : "pointer"
                }}
              >
                {importing ? <i className="bx bx-loader-alt bx-spin" /> : <IconSend size={15} />}
                <span>حفظ في قاعدة البيانات</span>
              </button>
            </div>
          </div>

          {/* Search inside preview */}
          <div style={{ marginBottom: "12px" }}>
            <input
              type="text"
              className={styles.formInput}
              placeholder="البحث في الأماكن المستخرجة (الاسم، التصنيف، المدينة، الهاتف)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ fontSize: "0.85rem", padding: "8px 12px" }}
            />
          </div>

          {/* Duplicates Warning Ribbon */}
          {duplicates.length > 0 && (
            <div style={{ background: "rgba(255, 149, 0, 0.12)", border: "1px solid rgba(255, 149, 0, 0.25)", padding: "12px 16px", borderRadius: "10px", color: "#ff9500", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ fontSize: "0.85rem" }}>
                <strong>تنبيه: تم اكتشاف {duplicates.length} مكان مكرر تماماً بدون أي تعديلات.</strong>
              </div>
              <button
                type="button"
                className="btn"
                onClick={onRemoveDuplicates}
                style={{ background: "#ff9500", color: "#fff", border: "none", fontSize: "0.8rem", padding: "6px 12px", borderRadius: "8px", fontWeight: "700" }}
              >
                🧹 حذف المتكرر ({duplicates.length})
              </button>
            </div>
          )}

          {/* Preview Table */}
          <div style={{ overflowX: "auto", borderRadius: "10px", border: "1px solid var(--border-glass)", maxHeight: "450px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "right" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid var(--border-glass)", position: "sticky", top: 0, zIndex: 2 }}>
                  <th style={{ padding: "10px", width: "40px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={() => onToggleSelectAllParsed(visibleIndices)}
                      style={{ cursor: "pointer", width: "16px", height: "16px", accentColor: "var(--color-primary)" }}
                    />
                  </th>
                  <th style={{ padding: "10px 12px" }}>الاسم</th>
                  <th style={{ padding: "10px 12px" }}>القسم</th>
                  <th style={{ padding: "10px 12px" }}>المدينة</th>
                  <th style={{ padding: "10px 12px" }}>الهواتف</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", width: "50px" }}>حذف</th>
                </tr>
              </thead>
              <tbody>
                {visiblePlacesWithIdx.map(({ p, originalIdx }) => {
                  const isSelected = selectedIndices.has(originalIdx);
                  return (
                    <tr
                      key={originalIdx}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        background: isSelected
                          ? "rgba(108, 99, 255, 0.12)"
                          : p.duplicateType === "db"
                            ? "rgba(255, 59, 48, 0.08)"
                            : p.duplicateType === "internal"
                              ? "rgba(255, 149, 0, 0.08)"
                              : p.isUpdate
                                ? "rgba(0, 122, 255, 0.08)"
                                : "transparent"
                      }}
                    >
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelectParsed(originalIdx)}
                          style={{ cursor: "pointer", width: "16px", height: "16px", accentColor: "var(--color-primary)" }}
                        />
                      </td>

                      <td style={{ padding: "8px 12px" }}>
                        <div style={{ fontWeight: 700, color: "var(--color-fg)" }}>
                          {p.name}
                        </div>
                        {p.isUpdate && (
                          <span style={{ fontSize: "0.7rem", color: "#007aff", fontWeight: 700 }}>
                            🔄 سيتم تحديث البيانات ({p.changedFields.join("، ")})
                          </span>
                        )}
                        {p.duplicateType === "db" && (
                          <span style={{ fontSize: "0.68rem", color: "#ff3b30", background: "rgba(255, 59, 48, 0.15)", padding: "1px 6px", borderRadius: "4px" }}>
                            ⚠️ مسجل مسبقاً
                          </span>
                        )}
                        {p.duplicateType === "internal" && (
                          <span style={{ fontSize: "0.68rem", color: "#ff9500", background: "rgba(255, 149, 0, 0.15)", padding: "1px 6px", borderRadius: "4px" }}>
                            ⚠️ مكرر بالملف (سطر {p.rowNum})
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "8px 12px" }}>
                        <span className={styles.tagBadge}>
                          {p.category_label}
                        </span>
                      </td>

                      <td style={{ padding: "8px 12px" }}>{p.city}</td>

                      <td style={{ padding: "8px 12px", direction: "ltr", textAlign: "right" }}>
                        {p.phones.join(", ") || "-"}
                      </td>

                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => onDeleteParsedPlace(originalIdx)}
                          className="btn btn-error"
                          style={{ padding: "4px 8px", fontSize: "0.8rem", borderRadius: "6px" }}
                          title="حذف هذا المكان"
                        >
                          <IconTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
