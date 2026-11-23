"use client";

import React from "react";
import styles from "./vouchers.module.css";
import { useAdminVouchers } from "./hooks/useAdminVouchers";
import {
  AdminVouchersHeader,
  AdminVouchersKpis,
  AdminVouchersFilterBar,
  AdminVouchersControlsBar,
  AdminVouchersTable,
  AdminVouchersCards,
  AdminVouchersPagination,
  AdminVouchersColumnsDropdown,
  AdminVouchersActionDropdown,
  AdminVoucherEditorModal,
  AdminVoucherLogsModal,
} from "./components";
import { VoucherRewardType } from "./types";

export default function AdminVouchersPage() {
  const {
    vouchers,
    redemptionLogs,
    loadingData,
    schemaReady,
    saving,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    viewMode,
    setViewMode,
    visibleColumns,
    toggleColumn,
    columnsMenuOpen,
    columnsMenuPos,
    toggleColumnsMenu,
    closeColumnsMenu,
    actionMenuState,
    openActionMenu,
    closeActionMenu,
    copiedId,
    kpis,
    filteredVouchers,
    paginatedVouchers,
    loadData,
    handleCopyCode,
    handleToggleStatus,
    handleDeleteVoucher,
    isEditorOpen,
    editingVoucher,
    form,
    setForm,
    formError,
    openCreateModal,
    openEditModal,
    closeEditorModal,
    handleSaveForm,
    logsModalVoucher,
    visibleLogs,
    openLogsModal,
    closeLogsModal,
  } = useAdminVouchers();

  const getTypeCount = (type: VoucherRewardType) =>
    vouchers.filter((v) => v.rewardType === type).length;

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <AdminVouchersHeader
        loading={loadingData}
        redemptionLogsCount={redemptionLogs.length}
        onRefresh={loadData}
        onOpenLogsModal={() => openLogsModal("all")}
        onOpenCreateModal={openCreateModal}
      />

      {/* Database Schema Notice if not ready */}
      {!schemaReady && !loadingData && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "14px",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            background: "rgba(245, 158, 11, 0.1)",
            color: "#fbbf24",
            fontSize: "0.84rem",
            fontWeight: 700,
          }}
        >
          جداول القسائم غير مفعّلة في قاعدة البيانات بعد. يرجى تشغيل ملف{" "}
          <code dir="ltr">supabase/supabase_promo_balance_schema.sql</code> ثم{" "}
          <code dir="ltr">supabase/supabase_vouchers_schema.sql</code> داخل Supabase SQL Editor.
        </div>
      )}

      {/* KPI Cards */}
      <AdminVouchersKpis kpis={kpis} />

      {/* Filters Bar */}
      <AdminVouchersFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        totalVouchersCount={vouchers.length}
        getTypeCount={getTypeCount}
      />

      {/* Controls Bar (Page Size, Columns Dropdown, View Mode) */}
      <AdminVouchersControlsBar
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        totalCount={filteredVouchers.length}
        columnsMenuOpen={columnsMenuOpen}
        onToggleColumnsMenu={toggleColumnsMenu}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main View: Table vs Cards */}
      {viewMode === "table" ? (
        <AdminVouchersTable
          vouchers={filteredVouchers}
          paginatedVouchers={paginatedVouchers}
          loading={loadingData}
          visibleColumns={visibleColumns}
          copiedId={copiedId}
          onCopyCode={handleCopyCode}
          onOpenEditModal={openEditModal}
          onToggleStatus={handleToggleStatus}
          onDeleteVoucher={handleDeleteVoucher}
          onOpenLogsModal={openLogsModal}
          onOpenActionMenu={openActionMenu}
        />
      ) : (
        <AdminVouchersCards
          vouchers={paginatedVouchers}
          copiedId={copiedId}
          onCopyCode={handleCopyCode}
          onOpenEditModal={openEditModal}
          onToggleStatus={handleToggleStatus}
          onOpenLogsModal={openLogsModal}
          onOpenActionMenu={openActionMenu}
        />
      )}

      {/* Pagination Footer */}
      <AdminVouchersPagination
        currentPage={currentPage}
        totalItems={filteredVouchers.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        label="قسيمة"
      />

      {/* Columns Toggle Dropdown (Fixed Viewport Position) */}
      <AdminVouchersColumnsDropdown
        isOpen={columnsMenuOpen}
        position={columnsMenuPos}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
      />

      {/* 3-Dots Action Dropdown Menu (Fixed Viewport Position) */}
      <AdminVouchersActionDropdown
        actionMenu={actionMenuState}
        onClose={closeActionMenu}
        onCopyCode={handleCopyCode}
        onOpenEditModal={openEditModal}
        onToggleStatus={handleToggleStatus}
        onOpenLogsModal={openLogsModal}
        onDeleteVoucher={handleDeleteVoucher}
      />

      {/* Voucher Create / Edit Modal */}
      <AdminVoucherEditorModal
        isOpen={isEditorOpen}
        editingVoucher={editingVoucher}
        form={form}
        setForm={setForm}
        formError={formError}
        saving={saving}
        onClose={closeEditorModal}
        onSubmit={handleSaveForm}
      />

      {/* Redemption History Logs Modal */}
      <AdminVoucherLogsModal
        logsModalVoucher={logsModalVoucher}
        visibleLogs={visibleLogs}
        onClose={closeLogsModal}
      />
    </div>
  );
}
