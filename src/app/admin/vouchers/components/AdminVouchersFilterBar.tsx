"use client";

import React from "react";
import styles from "../vouchers.module.css";
import { VoucherRewardType, VoucherStatus, VOUCHER_REWARD_META } from "../types";

interface AdminVouchersFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "all" | VoucherStatus;
  onStatusFilterChange: (status: "all" | VoucherStatus) => void;
  typeFilter: "all" | VoucherRewardType;
  onTypeFilterChange: (type: "all" | VoucherRewardType) => void;
  totalVouchersCount: number;
  getTypeCount: (type: VoucherRewardType) => number;
}

export function AdminVouchersFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  totalVouchersCount,
  getTypeCount,
}: AdminVouchersFilterBarProps) {
  return (
    <div className={styles.filterCard}>
      <div className={styles.filterTopRow}>
        <div className={styles.searchWrap}>
          <i className={`bx bx-search ${styles.searchIcon}`} />
          <input
            type="text"
            className={`${styles.inputControl} ${styles.searchInput}`}
            placeholder="ابحث بالكود أو اسم الحملة أو الوصف..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div style={{ minWidth: "170px" }}>
          <select
            className={styles.inputControl}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as "all" | VoucherStatus)}
            aria-label="تصفية حسب الحالة"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="paused">موقوف مؤقتاً</option>
            <option value="scheduled">مجدول</option>
            <option value="expired">منتهي الصلاحية</option>
            <option value="exhausted">مكتمل الاستخدام</option>
          </select>
        </div>
      </div>

      <div className={styles.filterChipsRow}>
        <button
          type="button"
          className={`${styles.filterChip} ${typeFilter === "all" ? styles.filterChipActive : ""}`}
          onClick={() => onTypeFilterChange("all")}
        >
          كل الأنواع ({totalVouchersCount})
        </button>

        {(Object.keys(VOUCHER_REWARD_META) as VoucherRewardType[]).map((t) => {
          const meta = VOUCHER_REWARD_META[t];
          const count = getTypeCount(t);
          return (
            <button
              key={t}
              type="button"
              className={`${styles.filterChip} ${typeFilter === t ? styles.filterChipActive : ""}`}
              onClick={() => onTypeFilterChange(t)}
            >
              <i className={`bx ${meta.bxIcon}`} />
              <span>
                {meta.shortLabel} ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
