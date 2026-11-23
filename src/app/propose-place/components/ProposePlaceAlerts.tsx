import React from "react";
import styles from "../propose-place.module.css";
import { IconXFilled } from "@tabler/icons-react";

interface ProposePlaceAlertsProps {
  editId: string | null;
  placeName: string;
  onCancelEdit: () => void;
  limitReached: boolean;
  rejectionReason: string | null;
}

export default function ProposePlaceAlerts({
  editId,
  placeName,
  onCancelEdit,
  limitReached,
  rejectionReason,
}: ProposePlaceAlertsProps) {
  return (
    <>
      {/* 1. Pending Limit Reached Notice (only if not editing) */}
      {limitReached && !editId && (
        <div className="alert-warning flex items-center gap-3 py-3 px-5 rounded-lg mb-4">
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", margin: "0 0 4px" }}>
              وصلت للحد الأقصى (5 طلبات معلقة)
            </h3>
            <p style={{ margin: 0, color: "var(--color-fg)", fontSize: "0.88rem", lineHeight: 1.5 }}>
              لا يمكنك تقديم مكان جديد حالياً حتى تتم مراجعة الطلبات السابقة، ولكن يمكنك تعديل وإعادة إرسال أي مكان معلق أو مرفوض من قائمة "أماكني المقترحة" بالأسفل.
            </p>
          </div>
        </div>
      )}

      {/* 2. Active Edit Mode Banner */}
      {editId && (
        <div className={`${styles.alertBox} ${styles.alertEdit}`}>
          <span
            style={{
              fontWeight: "700",
              color: "var(--color-primary, #6c63ff)",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            أنت الآن تقوم بتعديل:{" "}
            <span style={{ color: "var(--color-fg)" }}>{placeName || "المكان المقترح"}</span>
          </span>
          <button
            type="button"
            onClick={onCancelEdit}
            className="btn btn-error min-h-min"
          >
            <IconXFilled size={20}/>
             إلغاء التعديل
          </button>
        </div>
      )}

      {/* 3. Rejection Reason Banner if rejected & in edit mode */}
      {editId && rejectionReason && (
        <div className="alert-error flex items-center gap-3 py-3 px-5 rounded-lg mb-4">
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "800", margin: "0 0 6px" }}>
              سبب رفض الاقتراح السابق :
            </h3>
            <p style={{ margin: 0, color: "var(--color-fg)", fontSize: "0.92rem", lineHeight: 1.6 }}>
              {rejectionReason}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
