import React from "react";
import clsx from "clsx";
import { ChevronRight, ChevronLeft } from "lucide-react";
import suggestionsStyles from "../admin-suggestions.module.css";

interface AdminSuggestionsPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function AdminSuggestionsPagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}: AdminSuggestionsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems <= pageSize) {
    return (
      <div className={suggestionsStyles.table05PaginationFooter}>
        <span className={suggestionsStyles.table05PaginationInfo}>
          إجمالي النتائج: {totalItems} اقتراح
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
    <div className={suggestionsStyles.table05PaginationFooter}>
      <span className={suggestionsStyles.table05PaginationInfo}>
        عرض {startItem} - {endItem} من {totalItems} اقتراح
      </span>

      <div className={suggestionsStyles.table05PaginationNav}>
        {/* Next in RTL = Right Chevron */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={suggestionsStyles.table05PageBtn}
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

          const pageNum = p as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={clsx(
                suggestionsStyles.table05PageBtn,
                isActive && suggestionsStyles.table05PageBtnActive
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
          className={suggestionsStyles.table05PageBtn}
          title="الصفحة التالية"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
