"use client";

import React from "react";
import styles from "../admin-maintenance.module.css";
import MaintenancePageCard from "./MaintenancePageCard";
import { CATEGORY_OPTIONS } from "../constants";
import {
  MaintenancePageItem,
  MaintenanceItem,
  MaintenanceFilterTab,
  MaintenanceCategory,
} from "../types";

interface MaintenancePagesListProps {
  filteredPages: MaintenancePageItem[];
  fetchLoading: boolean;
  activeCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterTab: MaintenanceFilterTab;
  setFilterTab: (tab: MaintenanceFilterTab) => void;
  selectedCategory: MaintenanceCategory;
  setSelectedCategory: (cat: MaintenanceCategory) => void;
  onQuickToggle: (page: MaintenancePageItem) => void;
  onLockAllExceptThis: (path: string) => void;
  onEdit: (record: MaintenanceItem) => void;
  onPreview: (item: MaintenanceItem) => void;
  onDelete: (id: string) => void;
}

export default function MaintenancePagesList({
  filteredPages,
  fetchLoading,
  activeCount,
  searchQuery,
  setSearchQuery,
  filterTab,
  setFilterTab,
  selectedCategory,
  setSelectedCategory,
  onQuickToggle,
  onLockAllExceptThis,
  onEdit,
  onPreview,
  onDelete,
}: MaintenancePagesListProps) {
  const tabs: { id: MaintenanceFilterTab; label: string }[] = [
    { id: "all", label: "الكل" },
    { id: "active", label: `مغلقة للصيانة (${activeCount})` },
    { id: "inactive", label: "مفتوحة للزوار" },
  ];

  return (
    <div className={styles.sectionCard}>
      <div className={styles.cardHeader}>
        <div
          className={styles.cardIcon}
          style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}
        >
          <i className="bx bx-list-check" />
        </div>
        <div>
          <h2 className={styles.cardTitle}>قائمة الصفحات وحالة الوصول</h2>
          <p className={styles.cardSubtitle}>
            التحكم الفوري في فتح وقفل أي صفحة بضغطة زر وتعديل بياناتها.
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className={styles.listToolbar}>
        {/* Search Input */}
        <div className={styles.searchBox}>
          <i className={`bx bx-search ${styles.searchIcon}`} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="ابحث باسم الصفحة أو المسار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className={styles.clearSearchBtn}
              title="مسح البحث"
            >
              <i className="bx bx-x" />
            </button>
          )}
        </div>

        {/* Status Tabs & Category Selector */}
        <div className={styles.filtersRow}>
          <div className={styles.statusTabs}>
            {tabs.map((tab) => {
              const isActive = filterTab === tab.id;
              let activeClass = "";
              if (isActive) {
                activeClass =
                  tab.id === "active"
                    ? styles.tabBtnActiveOrange
                    : styles.tabBtnActive;
              }

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterTab(tab.id)}
                  className={`${styles.tabBtn} ${activeClass}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <select
            className={styles.categorySelect}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as MaintenanceCategory)}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pages List Container */}
      <div className={styles.pagesListContainer}>
        {fetchLoading ? (
          <div className={styles.emptyState}>
            <i className={`bx bx-loader-alt animate-spin ${styles.emptyStateIcon}`} />
            <p className="text-sm text-[var(--text-secondary)]">جاري تحميل الصفحات...</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className={styles.emptyState}>
            <i className={`bx bx-search-alt ${styles.emptyStateIcon}`} />
            <p className="text-sm font-semibold">لا توجد صفحات مطابقة للبحث أو الفلتر المختار.</p>
          </div>
        ) : (
          filteredPages.map((page) => (
            <MaintenancePageCard
              key={page.path}
              page={page}
              onQuickToggle={onQuickToggle}
              onLockAllExceptThis={onLockAllExceptThis}
              onEdit={onEdit}
              onPreview={onPreview}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
