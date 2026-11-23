import React, { RefObject } from "react";
import { PlaceProposal } from "../types";
import styles from "../propose-place.module.css";
import { IconCalendarEventFilled, IconFolderOpenFilled, IconGpsFilled, IconWritingFilled } from "@tabler/icons-react";

interface ProposePlaceHistoryProps {
  historyRef?: RefObject<HTMLDivElement | null>;
  proposals: PlaceProposal[];
  loading: boolean;
  editId: string | null;
  onRefresh: () => void;
  onSelectEdit: (id: string) => void;
}

export default function ProposePlaceHistory({
  historyRef,
  proposals,
  loading,
  editId,
  onRefresh,
  onSelectEdit,
}: ProposePlaceHistoryProps) {
  return (
    <div ref={historyRef} className={styles.historySection}>
      {/* Header */}
      <div className={styles.historyHeader}>
        <h2 className={styles.historyTitle}>
          <span>أماكني المقترحة</span>
          {proposals.length > 0 && (
            <span className={styles.historyCount}>{proposals.length}</span>
          )}
        </h2>
      </div>

      {/* Content states */}
      {loading ? (
        <div className={styles.emptyCard}>
          <div className="spinner" style={{ width: "32px", height: "32px", margin: "0 auto 12px" }} />
          <span>جاري تحميل أماكنك المقترحة...</span>
        </div>
      ) : proposals.length === 0 ? (
        <div className={styles.emptyCard}>
          <i
            className="bx bx-map-pin"
            style={{ fontSize: "2.6rem", color: "var(--text-muted)", marginBottom: "12px", display: "block" }}
          />
          <p style={{ margin: 0, fontWeight: "600" }}>لم تقم باقتراح أي أماكن حتى الآن.</p>
        </div>
      ) : (
        <div className={styles.proposalsList}>
          {proposals.map((prop) => {
            const isCurrentEditing = editId === prop.id;
            const isApproved = prop.status === "approved";
            const isRejected = prop.status === "rejected";
            const isPending = prop.status === "pending" || !prop.status;
            const displayImage = prop.image_url || (prop.images && prop.images[0]);

            return (
              <div
                key={prop.id}
                className={`${styles.proposalCard} ${
                  isCurrentEditing ? styles.proposalCardEditing : ""
                }`}
              >
                {/* Details */}
                <div className={styles.proposalBody}>
                  <div className={styles.proposalHeaderRow}>
                    <h3 className={styles.proposalName}>{prop.name}</h3>

                    {/* Status Badges */}
                    {isPending && (
                      <span className={styles.statusBadgePending}>
                        <i className="bx bx-time-five" /> قيد المراجعة
                      </span>
                    )}
                    {isRejected && (
                      <span className={styles.statusBadgeRejected}>
                        <i className="bx bx-x-circle" /> مرفوض  
                      </span>
                    )}
                    {isApproved && (
                      <span className={styles.statusBadgeApproved}>
                        <i className="bx bx-check-circle" /> مقبول  
                      </span>
                    )}

                  </div>
                  {/* Metadata */}
                  <div className={styles.proposalMeta}>
                    <span className="flex gap-1">
                      <IconFolderOpenFilled size={18}/>{" "}
                      {prop.category_label || prop.category}
                    </span>
                    {prop.governorate && (
                      <span className="flex gap-1">
                       <IconGpsFilled size={18}/>{" "}
                        {prop.governorate} - {prop.city}
                      </span>
                    )}
                    {prop.created_at && (
                      <span className="flex gap-1">
                       <IconCalendarEventFilled size={18}/>{" "}
                        {new Date(prop.created_at).toLocaleDateString("ar-EG")}
                      </span>
                    )}
                  </div>

                  {/* Rejection Note */}
                  {isRejected && prop.rejection_reason && (
                    <div className="alert-error py-1 px-2 rounded fs-sm">
                      <strong>تم الرفض لأن </strong> 
                      {prop.rejection_reason}
                    </div>
                  )}
                </div>

                {/* Edit Action Button */}
                {!isApproved && (
                  <button
                    type="button"
                    onClick={() => onSelectEdit(prop.id)}
                    className={`btn min-h-min btn-primary  ${
                      isCurrentEditing ? "btn-blue" : ""
                    }`}
                  >
                   <IconWritingFilled size={18}/>
                    <span>{isCurrentEditing ? "يتم التعديل..." : "تعديل وإعادة إرسال"}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
