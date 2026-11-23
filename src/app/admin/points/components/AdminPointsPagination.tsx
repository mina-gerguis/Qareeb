"use client";

import React from "react";
import styles from "../admin-points.module.css";

interface AdminPointsPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export function AdminPointsPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  label = "عنصر",
}: AdminPointsPaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (totalItems <= 0) return null;

  return (
    <div className={styles.table05PaginationFooter}>
      <div className={styles.table05PaginationInfo}>
        صفحة {currentPage} من {totalPages} (إجمالي {totalItems} {label})
      </div>

      <div className={styles.table05PaginationNav}>
        <button
          type="button"
          className={styles.table05PageBtn}
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          title="الصفحة الأولى"
        >
          <i className="bx bx-chevrons-right" />
        </button>
        <button
          type="button"
          className={styles.table05PageBtn}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          title="السابق"
        >
          <i className="bx bx-chevron-right" />
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          return (
            <button
              key={pageNum}
              type="button"
              className={`${styles.table05PageBtn} ${
                currentPage === pageNum ? styles.table05PageBtnActive : ""
              }`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          className={styles.table05PageBtn}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="التالي"
        >
          <i className="bx bx-chevron-left" />
        </button>
        <button
          type="button"
          className={styles.table05PageBtn}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          title="الصفحة الأخيرة"
        >
          <i className="bx bx-chevrons-left" />
        </button>
      </div>
    </div>
  );
}
