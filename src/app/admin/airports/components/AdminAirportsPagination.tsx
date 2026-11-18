import React from "react";
import clsx from "clsx";
import { ChevronRight, ChevronLeft } from "lucide-react";
import airportsStyles from "../admin-airports.module.css";

interface AdminAirportsPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function AdminAirportsPagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}: AdminAirportsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems <= pageSize) {
    return (
      <div className={airportsStyles.table05PaginationFooter}>
        <span className={airportsStyles.table05PaginationInfo}>
          إجمالي النتائج: {totalItems} مطار
        </span>
      </div>
    );
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers
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
    <div className={airportsStyles.table05PaginationFooter}>
      <span className={airportsStyles.table05PaginationInfo}>
        عرض {startItem} - {endItem} من {totalItems} مطار
      </span>

      <div className={airportsStyles.table05PaginationNav}>
        {/* Next in RTL = Right Chevron */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={airportsStyles.table05PageBtn}
          title="الصفحة السابقة"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{
                  padding: "0 4px",
                  color: "var(--text-muted, #94a3b8)",
                  fontSize: "0.85rem",
                }}
              >
                ...
              </span>
            );
          }
          const pageNum = Number(p);
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={clsx(
                airportsStyles.table05PageBtn,
                isActive && airportsStyles.table05PageBtnActive
              )}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Previous in RTL = Left Chevron */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={airportsStyles.table05PageBtn}
          title="الصفحة التالية"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
