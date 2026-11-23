"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import styles from "./admin-points.module.css";
import { useAdminPoints } from "./hooks/useAdminPoints";
import {
  AdminPointsHeader,
  AdminPointsControlsBar,
  AdminPointsPagination,
  AdminPointsColumnsDropdown,
  AdminPointsActionDropdown,
  AdminPointsUsersTable,
  AdminPointsUsersCards,
  AdminPointsRequestsTable,
  AdminPointsRequestsCards,
  AdminPointsPromoLedgerTable,
  AdminPointsPromoLedgerCards,
  AdminAdjustBalanceModal,
  AdminRejectRequestModal,
  AdminReceiptPreviewModal,
} from "./components";

function AdminPointsPageInner() {
  const {
    isAdmin,
    authChecking,
    authLoading,
    activeTab,
    setActiveTab,
    // View mode
    viewMode,
    setViewMode,
    // Columns Visibility
    usersVisibleColumns,
    requestsVisibleColumns,
    promoVisibleColumns,
    columnsMenuOpen,
    columnsMenuPos,
    toggleColumnsMenu,
    toggleUserColumn,
    toggleRequestColumn,
    togglePromoColumn,
    // 3-dots Action Menu
    actionMenuState,
    openActionMenu,
    closeActionMenu,
    // Users
    filteredUsers,
    paginatedUsers,
    loadingUsers,
    searchQuery,
    setSearchQuery,
    userPage,
    setUserPage,
    userPageSize,
    setUserPageSize,
    fetchUsers,
    // Requests
    filteredRequests,
    paginatedRequests,
    loadingRequests,
    requestSearchQuery,
    setRequestSearchQuery,
    requestFilterStatus,
    setRequestFilterStatus,
    requestFilterType,
    setRequestFilterType,
    requestPage,
    setRequestPage,
    requestPageSize,
    setRequestPageSize,
    pendingRequestsCount,
    fetchRequests,
    handleApproveRequest,
    // Rejection modal
    selectedRequest,
    rejectNotes,
    setRejectNotes,
    savedReasons,
    handleOpenRejectModal,
    handleCloseRejectModal,
    handleRejectRequest,
    handleDeleteSavedReason,
    // Promo ledger
    promoLedgerItems,
    paginatedPromoLedger,
    loadingPromoLedger,
    promoSchemaReady,
    promoPage,
    setPromoPage,
    promoPageSize,
    setPromoPageSize,
    loadPromoLedger,
    // Adjust modal
    selectedUser,
    actionType,
    setActionType,
    assetType,
    setAssetType,
    transactionAmount,
    setTransactionAmount,
    promoExpiryOption,
    setPromoExpiryOption,
    promoCustomExpiryDate,
    setPromoCustomExpiryDate,
    promoReason,
    setPromoReason,
    updating,
    statusMessage,
    handleOpenEditModal,
    handleCloseEditModal,
    handleSaveAdjustment,
    // Receipt preview
    previewReceiptUrl,
    setPreviewReceiptUrl,
  } = useAdminPoints();

  if (authLoading || authChecking) {
    return (
      <div style={{ textAlign: "center", padding: "50px", marginTop: "100px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid var(--border-glass)",
            borderTop: "3px solid var(--color-primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        />
        <p style={{ color: "var(--text-secondary)" }}>جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          marginTop: "100px",
          maxWidth: "420px",
          marginInline: "auto",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "rgba(239, 68, 68, 0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <i className="bx bxs-error-circle" style={{ fontSize: "3rem", color: "#ef4444" }} />
        </div>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "16px", color: "var(--color-fg)" }}>
          صلاحيات غير كافية
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "32px", lineHeight: "1.6" }}>
          عفواً، حسابك لا يمتلك صلاحيات المسؤول للوصول إلى هذه الصفحة. يرجى التواصل مع الإدارة إذا كنت تعتقد أن هذا خطأ.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.pointsContainer}>
      {/* Header */}
      <AdminPointsHeader
        activeTab={activeTab}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* ========================================================
          TAB 1: USERS LIST & BALANCES
          ======================================================== */}
      {activeTab === "users" && (
        <>
          {/* Search & Actions Bar */}
          <div className={styles.filterCard}>
            <div className={styles.searchBox}>
              <i className={`bx bx-search ${styles.searchIcon}`} />
              <input
                type="text"
                className={`input-fields ${styles.searchInput}`}
                placeholder="ابحث باسم المستخدم، الاسم بالكامل، أو البريد..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setUserPage(1);
                }}
              />
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setUserPage(1);
                }}
                className="btn"
                style={{ padding: "0 14px", height: "42px", fontSize: "0.85rem" }}
              >
                إعادة تعيين
              </button>
            )}

            <button
              type="button"
              onClick={fetchUsers}
              disabled={loadingUsers}
              className={`btn ${styles.filterBtn}`}
            >
              <i
                className={`bx bx-refresh ${loadingUsers ? "bx-spin" : ""}`}
                style={{ fontSize: "1.15rem" }}
              />
              <span>تحديث البيانات</span>
            </button>
          </div>

          {/* Controls Bar: Page size + Columns toggle + View Mode (Table/Cards) */}
          <AdminPointsControlsBar
            pageSize={userPageSize}
            onPageSizeChange={(size) => {
              setUserPageSize(size);
              setUserPage(1);
            }}
            pageSizeOptions={[15, 25, 50, 100]}
            itemLabel="مستخدم"
            totalCount={filteredUsers.length}
            totalLabel="إجمالي المستخدمين"
            columnsMenuOpen={columnsMenuOpen}
            onToggleColumnsMenu={toggleColumnsMenu}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Table or Cards View */}
          {viewMode === "table" ? (
            <AdminPointsUsersTable
              users={filteredUsers}
              paginatedUsers={paginatedUsers}
              loading={loadingUsers}
              visibleColumns={usersVisibleColumns}
              onOpenEditModal={handleOpenEditModal}
              onOpenActionMenu={(u, rect) => openActionMenu(u, "user", rect)}
            />
          ) : (
            <AdminPointsUsersCards
              users={paginatedUsers}
              onOpenEditModal={handleOpenEditModal}
              onOpenActionMenu={(u, rect) => openActionMenu(u, "user", rect)}
            />
          )}

          {/* Pagination */}
          <AdminPointsPagination
            currentPage={userPage}
            totalItems={filteredUsers.length}
            pageSize={userPageSize}
            onPageChange={setUserPage}
            label="مستخدم"
          />
        </>
      )}

      {/* ========================================================
          TAB 2: DEPOSIT & WITHDRAWAL REQUESTS
          ======================================================== */}
      {activeTab === "requests" && (
        <>
          {/* Filters Bar */}
          <div className={styles.filterCard}>
            <div className={styles.searchBox}>
              <i className={`bx bx-search ${styles.searchIcon}`} />
              <input
                type="text"
                className={`input-fields ${styles.searchInput}`}
                placeholder="ابحث باسم المستخدم، الاسم، أو الإيميل..."
                value={requestSearchQuery}
                onChange={(e) => {
                  setRequestSearchQuery(e.target.value);
                  setRequestPage(1);
                }}
              />
            </div>

            <select
              className={styles.filterSelect}
              value={requestFilterType}
              onChange={(e) => {
                setRequestFilterType(e.target.value);
                setRequestPage(1);
              }}
            >
              <option value="all">كل العمليات</option>
              <option value="deposit">إيداع فقط</option>
              <option value="withdrawal">سحب فقط</option>
            </select>

            <select
              className={styles.filterSelect}
              value={requestFilterStatus}
              onChange={(e) => {
                setRequestFilterStatus(e.target.value);
                setRequestPage(1);
              }}
            >
              <option value="pending">المعلقة فقط</option>
              <option value="approved">المقبولة</option>
              <option value="rejected">المرفوضة</option>
              <option value="all">الكل</option>
            </select>

            <button
              type="button"
              onClick={fetchRequests}
              disabled={loadingRequests}
              className={`btn ${styles.filterBtn}`}
            >
              <i
                className={`bx bx-refresh ${loadingRequests ? "bx-spin" : ""}`}
                style={{ fontSize: "1.15rem" }}
              />
              <span>تحديث</span>
            </button>
          </div>

          {/* Controls Bar: Page size + Columns toggle + View Mode (Table/Cards) */}
          <AdminPointsControlsBar
            pageSize={requestPageSize}
            onPageSizeChange={(size) => {
              setRequestPageSize(size);
              setRequestPage(1);
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            itemLabel="طلب"
            totalCount={filteredRequests.length}
            totalLabel="إجمالي الطلبات المطابقة"
            columnsMenuOpen={columnsMenuOpen}
            onToggleColumnsMenu={toggleColumnsMenu}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Table or Cards View */}
          {viewMode === "table" ? (
            <AdminPointsRequestsTable
              requests={filteredRequests}
              paginatedRequests={paginatedRequests}
              loading={loadingRequests}
              visibleColumns={requestsVisibleColumns}
              onApproveRequest={handleApproveRequest}
              onOpenRejectModal={handleOpenRejectModal}
              onPreviewReceipt={(url) => setPreviewReceiptUrl(url)}
              onOpenActionMenu={(req, rect) => openActionMenu(req, "request", rect)}
            />
          ) : (
            <AdminPointsRequestsCards
              requests={paginatedRequests}
              onApproveRequest={handleApproveRequest}
              onOpenRejectModal={handleOpenRejectModal}
              onPreviewReceipt={(url) => setPreviewReceiptUrl(url)}
              onOpenActionMenu={(req, rect) => openActionMenu(req, "request", rect)}
            />
          )}

          {/* Pagination */}
          <AdminPointsPagination
            currentPage={requestPage}
            totalItems={filteredRequests.length}
            pageSize={requestPageSize}
            onPageChange={setRequestPage}
            label="طلب"
          />
        </>
      )}

      {/* ========================================================
          TAB 3: PROMOTIONAL BALANCE LEDGER
          ======================================================== */}
      {activeTab === "promo_ledger" && (
        <>
          {/* Header Action Bar */}
          <div className={styles.filterCard} style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(99, 102, 241, 0.15)",
                  color: "#818cf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                }}
              >
                <i className="bx bx-gift" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "var(--color-fg)" }}>
                  سجل حركات الرصيد الترويجي
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  متابعة الإضافات، الخصومات للشراء داخل الموقع، وتواريخ انتهاء الصلاحية ({promoLedgerItems.length} حركة)
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={loadPromoLedger}
                disabled={loadingPromoLedger}
                className={`btn ${styles.filterBtn}`}
              >
                <i className={`bx bx-refresh ${loadingPromoLedger ? "bx-spin" : ""}`} />
                <span>تحديث</span>
              </button>

              <Link
                href="/admin/vouchers"
                className="btn btn-primary"
                style={{
                  padding: "0 16px",
                  height: "42px",
                  fontSize: "0.86rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 700,
                }}
              >
                <i className="bx bxs-coupon" />
                <span>إدارة القسائم والأكواد</span>
              </Link>
            </div>
          </div>

          {/* Controls Bar: Page size + Columns toggle + View Mode (Table/Cards) */}
          {promoSchemaReady && (
            <AdminPointsControlsBar
              pageSize={promoPageSize}
              onPageSizeChange={(size) => {
                setPromoPageSize(size);
                setPromoPage(1);
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              itemLabel="حركة"
              totalCount={promoLedgerItems.length}
              totalLabel="إجمالي الحركات"
              columnsMenuOpen={columnsMenuOpen}
              onToggleColumnsMenu={toggleColumnsMenu}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          )}

          {/* Table or Cards View */}
          {viewMode === "table" ? (
            <AdminPointsPromoLedgerTable
              items={promoLedgerItems}
              paginatedItems={paginatedPromoLedger}
              loading={loadingPromoLedger}
              schemaReady={promoSchemaReady}
              visibleColumns={promoVisibleColumns}
              onOpenActionMenu={(item, rect) => openActionMenu(item, "promo", rect)}
            />
          ) : (
            <AdminPointsPromoLedgerCards
              items={paginatedPromoLedger}
              onOpenActionMenu={(item, rect) => openActionMenu(item, "promo", rect)}
            />
          )}

          {/* Pagination */}
          {promoSchemaReady && (
            <AdminPointsPagination
              currentPage={promoPage}
              totalItems={promoLedgerItems.length}
              pageSize={promoPageSize}
              onPageChange={setPromoPage}
              label="حركة"
            />
          )}
        </>
      )}

      {/* Floating Columns Visibility Dropdown */}
      <AdminPointsColumnsDropdown
        isOpen={columnsMenuOpen}
        position={columnsMenuPos}
        activeTab={activeTab}
        usersColumns={usersVisibleColumns}
        requestsColumns={requestsVisibleColumns}
        promoColumns={promoVisibleColumns}
        onToggleUserColumn={toggleUserColumn}
        onToggleRequestColumn={toggleRequestColumn}
        onTogglePromoColumn={togglePromoColumn}
      />

      {/* Floating 3-dots Action Menu */}
      <AdminPointsActionDropdown
        actionMenu={actionMenuState}
        onClose={closeActionMenu}
        onEditUser={handleOpenEditModal}
        onApproveRequest={handleApproveRequest}
        onRejectRequest={handleOpenRejectModal}
        onPreviewReceipt={(url) => setPreviewReceiptUrl(url)}
      />

      {/* Modal 1: Adjust User Points & Balances */}
      <AdminAdjustBalanceModal
        user={selectedUser}
        isOpen={Boolean(selectedUser)}
        onClose={handleCloseEditModal}
        actionType={actionType}
        onActionTypeChange={setActionType}
        assetType={assetType}
        onAssetTypeChange={setAssetType}
        amount={transactionAmount}
        onAmountChange={setTransactionAmount}
        promoExpiryOption={promoExpiryOption}
        onPromoExpiryOptionChange={setPromoExpiryOption}
        promoCustomExpiryDate={promoCustomExpiryDate}
        onPromoCustomExpiryDateChange={setPromoCustomExpiryDate}
        promoReason={promoReason}
        onPromoReasonChange={setPromoReason}
        updating={updating}
        statusMessage={statusMessage}
        onSave={handleSaveAdjustment}
      />

      {/* Modal 2: Reject Transaction Request Modal */}
      <AdminRejectRequestModal
        request={selectedRequest}
        isOpen={Boolean(selectedRequest)}
        onClose={handleCloseRejectModal}
        rejectNotes={rejectNotes}
        onRejectNotesChange={setRejectNotes}
        savedReasons={savedReasons}
        onSelectReason={(reason) => setRejectNotes(reason)}
        onDeleteReason={handleDeleteSavedReason}
        onConfirm={handleRejectRequest}
      />

      {/* Modal 3: Receipt Image Preview Lightbox */}
      <AdminReceiptPreviewModal
        imageUrl={previewReceiptUrl}
        isOpen={Boolean(previewReceiptUrl)}
        onClose={() => setPreviewReceiptUrl(null)}
      />
    </div>
  );
}

export default function AdminPointsPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            padding: "3rem",
            color: "var(--color-fgSecondary)",
            direction: "rtl",
            textAlign: "center",
          }}
        >
          جاري التحميل...
        </div>
      }
    >
      <AdminPointsPageInner />
    </Suspense>
  );
}
