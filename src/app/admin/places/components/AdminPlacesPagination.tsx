import React from "react";
import clsx from "clsx";
import { ChevronRight, ChevronLeft } from "lucide-react";
import styles from "../admin-places.module.css";

interface Props {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export const AdminPlacesPagination: React.FC<Props> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  itemLabel = "مكان",
}) => {
  if (totalItems === 0) return null;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems <= pageSize) {
    return (
      <div className={styles.table05PaginationFooter}>
        <span className={styles.table05PaginationInfo}>
          إجمالي النتائج: {totalItems} {itemLabel}
        </span>
      </div>
    );
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className={styles.table05PaginationFooter}>
      <span className={styles.table05PaginationInfo}>
        عرض {startItem} - {endItem} من {totalItems} {itemLabel}
      </span>

      <div className={styles.table05PaginationNav}>
        {/* Next in RTL = Right Chevron */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.table05PageBtn}
          title="الصفحة السابقة"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`dots-${idx}`} className={styles.table05PaginationEllipsis}>
                ...
              </span>
            );
          }

          const pageNum = p as number;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={clsx(
                styles.table05PageBtn,
                currentPage === pageNum && styles.table05PageBtnActive
              )}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Prev in RTL = Left Chevron */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.table05PageBtn}
          title="الصفحة التالية"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
