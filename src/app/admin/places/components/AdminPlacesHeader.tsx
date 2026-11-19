import React from "react";
import styles from "../admin-places.module.css";

interface Props {
  totalPlaces: number;
  dbDuplicatesCount: number;
  showExcelImport: boolean;
  onToggleExcelImport: () => void;
  onStartAddPlace: () => void;
  onCleanDbDuplicates: () => void;
  onSeedData: () => void;
  isDeletingDuplicates: boolean;
  isSubmitting: boolean;
}

export const AdminPlacesHeader: React.FC<Props> = ({
  totalPlaces,
  dbDuplicatesCount,
  showExcelImport,
  onToggleExcelImport,
  onStartAddPlace,
  onCleanDbDuplicates,
  onSeedData,
  isDeletingDuplicates,
  isSubmitting,
}) => {
  return (
    <div className={styles.headerBar}>
      <div className={styles.headerTextGroup}>
        <h1 className={styles.headerTitle}>إدارة الأماكن</h1>
        <p className={styles.headerSubtitle}>
          إضافة وتعديل وحذف الأماكن والفروع ومواعيد العمل واستيراد البيانات من Excel.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
        {totalPlaces === 0 && (
          <button
            type="button"
            className="btn"
            onClick={onSeedData}
            disabled={isSubmitting}
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "0.9rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: isSubmitting ? "not-allowed" : "pointer"
            }}
          >
            <i className="bx bx-data" />
            تفعيل بيانات تجريبية
          </button>
        )}

        {dbDuplicatesCount > 0 && (
          <button
            type="button"
            className="btn"
            onClick={onCleanDbDuplicates}
            disabled={isDeletingDuplicates}
            style={{
              background: "rgba(255, 149, 0, 0.15)",
              color: "#ff9500",
              border: "1px solid rgba(255, 149, 0, 0.3)",
              padding: "10px 16px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "0.88rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: isDeletingDuplicates ? "not-allowed" : "pointer"
            }}
          >
            <i className="bx bx-broom" />
            تنظيف المكررات ({dbDuplicatesCount})
          </button>
        )}

        <button
          type="button"
          className="btn btn-cancel"
          onClick={onToggleExcelImport}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          <i className={showExcelImport ? "bx bx-x" : "bx bx-download"} />
          {showExcelImport ? "إلغاء الاستيراد" : "استيراد من Excel"}
        </button>

        <button
          type="button"
          className={`btn btn-primary ${styles.addStationBtn}`}
          onClick={onStartAddPlace}
        >
          <i className="bx bx-plus-circle" style={{ fontSize: "1.1rem" }} />
          إضافة مكان جديد
        </button>
      </div>
    </div>
  );
};
