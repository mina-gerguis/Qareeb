"use client";

import React from "react";
import { Columns } from "lucide-react";
import {
  IconColumns3Filled,
  IconLayoutListFilled,
  IconDotsFilled,
  IconEdit,
  IconUser,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import styles from "../subscriptions.module.css";
import { Blobatar } from "@blobatar/react";
import { UserProfile, UsersVisibleColumns } from "../types";
import { AdminSubscriptionsPagination } from "./AdminSubscriptionsPagination";

interface AdminSubscriptionsUsersTabProps {
  users: UserProfile[];
  filteredUsers: UserProfile[];
  paginatedUsers: UserProfile[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  tierFilter: string;
  onTierFilterChange: (tier: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
  visibleColumns: UsersVisibleColumns;
  columnsMenuOpen: boolean;
  onToggleColumnsMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onEditUser: (user: UserProfile) => void;
  onOpenActionMenu: (user: UserProfile, rect: DOMRect) => void;
}

export function getTierBadge(tier: string) {
  switch (tier) {
    case "gold":
      return <span className={`${styles.tierBadge} ${styles.tierGold}`}>🥇 الذهبية</span>;
    case "silver":
      return <span className={`${styles.tierBadge} ${styles.tierSilver}`}>🥈 الفضية</span>;
    case "mishwar":
      return <span className={`${styles.tierBadge} ${styles.tierMishwar}`}>⚡ المشوار</span>;
    case "free":
    default:
      return <span className={`${styles.tierBadge} ${styles.tierFree}`}>⚪ المجانية</span>;
  }
}

export function getDaysRemainingInfo(endDateStr: string | null, status: string | null) {
  if (!endDateStr) return null;
  const endDate = new Date(endDateStr);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0 || status === "expired") {
    const absDays = Math.abs(diffDays);
    return (
      <span className={`${styles.daysRemainingPill} ${styles.daysRemainingPillExpired}`}>
        منتهي {absDays > 0 ? `منذ ${absDays} يوم` : "اليوم"}
      </span>
    );
  } else if (diffDays <= 5) {
    return (
      <span className={`${styles.daysRemainingPill} ${styles.daysRemainingPillWarning}`}>
        متبقي {diffDays === 0 ? "اليوم فقط" : `${diffDays} أيام`}
      </span>
    );
  } else {
    return (
      <span className={`${styles.daysRemainingPill} ${styles.daysRemainingPillOk}`}>
        متبقي {diffDays} يوم
      </span>
    );
  }
}

export function AdminSubscriptionsUsersTab({
  users,
  filteredUsers,
  paginatedUsers,
  loading,
  searchQuery,
  onSearchChange,
  tierFilter,
  onTierFilterChange,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  viewMode,
  onViewModeChange,
  visibleColumns,
  columnsMenuOpen,
  onToggleColumnsMenu,
  onEditUser,
  onOpenActionMenu,
}: AdminSubscriptionsUsersTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Filters Card */}
      <div className={styles.filterCard}>
        <div className={styles.searchBox}>
          <i className={`bx bx-search ${styles.searchIcon}`} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="ابحث بالاسم، اسم المستخدم، البريد أو الهاتف..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <select
          value={tierFilter}
          onChange={(e) => onTierFilterChange(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">كل الباقات ({users.length})</option>
          <option value="gold">🥇 الباقة الذهبية</option>
          <option value="silver">🥈 الباقة الفضية</option>
          <option value="mishwar">⚡ باقة المشوار</option>
          <option value="free">⚪ المجانية</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">كل الحالات</option>
          <option value="active">نشط 🟢</option>
          <option value="expired">منتهي الصلاحية 🔴</option>
          <option value="cancelled">ملغي 🟡</option>
        </select>
      </div>

      {/* Controls Bar */}
      <div className={styles.table05ControlsBar}>
        {/* Left: Page Size Select */}
        <div className={styles.table05PageSizeGroup}>
          <span>عرض</span>
          <select
            className={styles.table05Select}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span>مشترك في الصفحة</span>
          <span style={{ margin: "0 6px", color: "var(--border-glass, rgba(255,255,255,0.15))" }}>|</span>
          <span style={{ fontSize: "0.84rem" }}>
            إجمالي المطابق: <strong>{filteredUsers.length}</strong> من أصل <strong>{users.length}</strong>
          </span>
        </div>

        {/* Right: Columns Toggle & View Mode Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {viewMode === "table" && (
            <button
              type="button"
              onClick={onToggleColumnsMenu}
              className={`${styles.columnsToggleBtn} ${
                columnsMenuOpen ? styles.columnsToggleBtnActive : ""
              }`}
              title="إظهار / إخفاء الأعمدة"
            >
              <Columns className="h-4 w-4" />
              <span>الأعمدة</span>
            </button>
          )}

          <div className={styles.viewToggleButtons}>
            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={`${styles.viewToggleBtn} ${
                viewMode === "cards" ? styles.viewToggleBtnActive : ""
              }`}
              title="عرض كبطاقات"
            >
              <IconColumns3Filled size={16} />
              <span>بطاقات</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={`${styles.viewToggleBtn} ${
                viewMode === "table" ? styles.viewToggleBtnActive : ""
              }`}
              title="عرض كجدول"
            >
              <IconLayoutListFilled size={16} />
              <span>جدول</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "2.5px solid var(--border-glass, rgba(255,255,255,0.1))",
              borderTop: "2.5px solid var(--color-primary, #6366f1)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ margin: 0, fontSize: "0.9rem" }}>جاري تحميل قائمة المشتركين...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <i className="bx bx-user-x" style={{ fontSize: "3rem", opacity: 0.4 }} />
          <p style={{ margin: "12px 0 0", fontSize: "0.92rem", fontWeight: 700 }}>
            لا يوجد مشتركون يطابقون خيارات البحث والفلترة الحالية.
          </p>
        </div>
      ) : viewMode === "table" ? (
        <div className={styles.table05Container}>
          <div className={styles.table05Scroll}>
            <table className={styles.table05}>
              <thead>
                <tr>
                  {visibleColumns.user && (
                    <th className={styles.table05Th} style={{ minWidth: "220px" }}>
                      المستخدم
                    </th>
                  )}
                  {visibleColumns.tier && (
                    <th className={styles.table05Th} style={{ minWidth: "130px" }}>
                      الباقة الحالية
                    </th>
                  )}
                  {visibleColumns.period && (
                    <th className={styles.table05Th} style={{ minWidth: "120px" }}>
                      فترة الاشتراك
                    </th>
                  )}
                  {visibleColumns.expiry && (
                    <th className={styles.table05Th} style={{ minWidth: "160px" }}>
                      تاريخ الانتهاء والمهلة
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th className={styles.table05Th} style={{ minWidth: "110px" }}>
                      الحالة
                    </th>
                  )}
                  {visibleColumns.actions && (
                    <th
                      className={styles.table05Th}
                      style={{ width: "90px", textAlign: "center" }}
                    >
                      الإجراءات
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => {
                  const isExpired =
                    u.subscription_end && new Date(u.subscription_end) < new Date();
                  const statusText = isExpired
                    ? "منتهي 🔴"
                    : u.subscription_status === "active"
                    ? "نشط 🟢"
                    : u.subscription_status === "cancelled"
                    ? "ملغي 🟡"
                    : "مجاني";
                  const initial = (u.full_name || u.username || "U").charAt(0).toUpperCase();

                  return (
                    <tr
                      key={u.id}
                      className={styles.table05Tr}
                      onClick={() => onEditUser(u)}
                      style={{ cursor: "pointer" }}
                    >
                      {visibleColumns.user && (
                        <td className={styles.table05Td}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {u.avatar_url ? (
                              <img
                                src={u.avatar_url}
                                alt="avatar"
                                style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
                              />
                            ) : (
                              <Blobatar
                                name={u.full_name || u.username || u.email || "User"}
                                size={38}
                                style={{ borderRadius: "50%", flexShrink: 0 }}
                              />
                            )}
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                                {u.full_name || "مستخدم بدون اسم"}
                              </div>
                              <div style={{ fontSize: "0.78rem", color: "var(--text-muted, #94a3b8)" }}>
                                @{u.username || "بدون_يوزر"}
                                {u.phone && ` • ${u.phone}`}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}

                      {visibleColumns.tier && (
                        <td className={styles.table05Td}>{getTierBadge(u.subscription_tier)}</td>
                      )}

                      {visibleColumns.period && (
                        <td className={styles.table05Td} style={{ fontWeight: 700 }}>
                          {u.subscription_period === "daily"
                            ? "يومي (24س)"
                            : u.subscription_period === "monthly"
                            ? "شهري"
                            : u.subscription_period === "yearly"
                            ? "سنوي"
                            : "—"}
                        </td>
                      )}

                      {visibleColumns.expiry && (
                        <td className={styles.table05Td}>
                          <div style={{ fontWeight: 700 }}>
                            {u.subscription_end
                              ? new Date(u.subscription_end).toLocaleDateString("ar-EG")
                              : "غير محدد"}
                          </div>
                          {getDaysRemainingInfo(u.subscription_end, u.subscription_status)}
                        </td>
                      )}

                      {visibleColumns.status && (
                        <td className={styles.table05Td}>
                          <span
                            className={
                              isExpired || u.subscription_status === "expired"
                                ? styles.statusBadgeExpired
                                : u.subscription_status === "active"
                                ? styles.statusBadgeActive
                                : styles.statusBadgeCancelled
                            }
                          >
                            {statusText}
                          </span>
                        </td>
                      )}

                      {visibleColumns.actions && (
                        <td
                          className={styles.table05Td}
                          style={{ textAlign: "center" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => onEditUser(u)}
                              className={styles.secondaryBtn}
                              style={{ padding: "4px 8px", height: "32px", borderRadius: "8px" }}
                              title="تعديل الاشتراك"
                            >
                              <IconEdit size={16} />
                            </button>
                            <button
                              type="button"
                              className={styles.moreMenuBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenActionMenu(u, e.currentTarget.getBoundingClientRect());
                              }}
                              title="خيارات إضافية"
                            >
                              <IconDotsFilled size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className={styles.cardsGrid}>
          {paginatedUsers.map((u) => {
            const isExpired =
              u.subscription_end && new Date(u.subscription_end) < new Date();
            const statusText = isExpired
              ? "منتهي 🔴"
              : u.subscription_status === "active"
              ? "نشط 🟢"
              : u.subscription_status === "cancelled"
              ? "ملغي 🟡"
              : "مجاني";
            const initial = (u.full_name || u.username || "U").charAt(0).toUpperCase();

            return (
              <div key={u.id} className={styles.dataCard}>
                <div className={styles.dataCardHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                    {u.avatar_url ? (
                      <img
                        src={u.avatar_url}
                        alt="avatar"
                        style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <Blobatar
                        name={u.full_name || u.username || u.email || "User"}
                        size={42}
                        style={{ borderRadius: "50%", flexShrink: 0 }}
                      />
                    )}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4
                        className={styles.dataCardTitle}
                        style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      >
                        {u.full_name || "مستخدم بدون اسم"}
                      </h4>
                      <div className={styles.dataCardSubtitle}>
                        @{u.username || "بدون_يوزر"}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.moreMenuBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenActionMenu(u, e.currentTarget.getBoundingClientRect());
                    }}
                    title="خيارات إضافية"
                  >
                    <IconDotsFilled size={18} />
                  </button>
                </div>

                {/* User Contact Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.8rem", color: "var(--text-secondary, #94a3b8)" }}>
                  {u.email && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", direction: "ltr", justifyContent: "flex-end" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</span>
                      <IconMail size={15} style={{ color: "var(--text-muted, #64748b)", flexShrink: 0 }} />
                    </div>
                  )}
                  {u.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", direction: "ltr", justifyContent: "flex-end" }}>
                      <span>{u.phone}</span>
                      <IconPhone size={15} style={{ color: "var(--text-muted, #64748b)", flexShrink: 0 }} />
                    </div>
                  )}
                </div>

                {/* Subscription Info Rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.84rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted, #94a3b8)", fontWeight: 600 }}>الباقة الحالية:</span>
                    <div>{getTierBadge(u.subscription_tier)}</div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted, #94a3b8)", fontWeight: 600 }}>فترة الاشتراك:</span>
                    <strong>
                      {u.subscription_period === "daily"
                        ? "يومي (24 ساعة)"
                        : u.subscription_period === "monthly"
                        ? "شهري"
                        : u.subscription_period === "yearly"
                        ? "سنوي"
                        : "—"}
                    </strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted, #94a3b8)", fontWeight: 600 }}>تاريخ الانتهاء:</span>
                    <div style={{ textAlign: "left" }}>
                      <strong>
                        {u.subscription_end
                          ? new Date(u.subscription_end).toLocaleDateString("ar-EG")
                          : "غير محدد"}
                      </strong>
                      <div>
                        {getDaysRemainingInfo(u.subscription_end, u.subscription_status)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted, #94a3b8)", fontWeight: 600 }}>الحالة:</span>
                    <span
                      className={
                        isExpired || u.subscription_status === "expired"
                          ? styles.statusBadgeExpired
                          : u.subscription_status === "active"
                          ? styles.statusBadgeActive
                          : styles.statusBadgeCancelled
                      }
                    >
                      {statusText}
                    </span>
                  </div>
                </div>

                <div className={styles.dataCardFooter}>
                  <button
                    type="button"
                    onClick={() => onEditUser(u)}
                    className={styles.primaryBtn}
                    style={{ width: "100%", justifyContent: "center", padding: "8px 12px" }}
                  >
                    <IconEdit size={16} />
                    <span>تعديل الاشتراك</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      <AdminSubscriptionsPagination
        currentPage={currentPage}
        totalItems={filteredUsers.length}
        pageSize={pageSize}
        onPageChange={onPageChange}
        label="مشترك"
      />
    </div>
  );
}
