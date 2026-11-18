import React from "react";
import clsx from "clsx";
import lrtStyles from "../admin-lrt.module.css";
import { IconSquareRoundedChevronLeftFilled, IconSquareRoundedChevronRightFilled } from "@tabler/icons-react";

interface AdminLrtPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function AdminLrtPagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}: AdminLrtPaginationProps) {
  if (totalItems <= 0) return null;

  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => {
      if (totalPages <= 7) return true;
      if (p === 1 || p === totalPages) return true;
      return Math.abs(p - currentPage) <= 1;
    })
    .reduce<(number | string)[]>((acc, p, idx, arr) => {
      if (idx > 0 && typeof p === "number" && typeof arr[idx - 1] === "number" && (p as number) - (arr[idx - 1] as number) > 1) {
        acc.push("...");
      }
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className={lrtStyles.table05PaginationFooter}>
      <p className={lrtStyles.table05PaginationInfo}>
        عرض <strong>{startItem}</strong> إلى <strong>{endItem}</strong> من أصل <strong>{totalItems}</strong> محطة
      </p>

      <div className={lrtStyles.table05PaginationNav}>
        <button
          type="button"
          aria-label="الصفحة السابقة"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className={`border-0 ${lrtStyles.table05PageBtn}`}
          title="الصفحة السابقة"
        >
          <IconSquareRoundedChevronRightFilled />
        </button>

        {pageNumbers.map((item, idx) => {
          if (item === "...") {
            return (
              <span key={`dots-${idx}`} style={{ padding: "0 4px", color: "var(--text-muted)" }}>
                ...
              </span>
            );
          }
          const pageNum = Number(item);
          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              type="button"
              aria-label={`الانتقال للصفحة ${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={clsx(
                lrtStyles.table05PageBtn,
                isActive && lrtStyles.table05PageBtnActive
              )}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          aria-label="الصفحة التالية"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className={lrtStyles.table05PageBtn}
          title="الصفحة التالية"
        >
          <IconSquareRoundedChevronLeftFilled />
        </button>
      </div>
    </div>
  );
}
