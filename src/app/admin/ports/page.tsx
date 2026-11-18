"use client";

import React, { Suspense } from "react";
import { useAdminPorts } from "./hooks/useAdminPorts";
import {
  AdminPortsLoading,
  AdminPortsNotifications,
  AdminPortsHeader,
  AdminPortsFilterBar,
  AdminPortsControlsBar,
  AdminPortsTable,
  AdminPortsCards,
  AdminPortsPagination,
  AdminPortModal,
  AdminPortDetailsModal,
  AdminPortsDeleteModal,
  AdminPortsActionDropdown,
  AdminPortsColumnsDropdown,
} from "./components";
import { PortItem } from "./types";
import portsStyles from "./admin-ports.module.css";

export default function AdminPortsPage() {
  return (
    <Suspense fallback={<AdminPortsLoading />}>
      <AdminPortsContent />
    </Suspense>
  );
}

function AdminPortsContent() {
  const {
    // Auth & Status
    isAdmin,
    loading,
    authLoading,
    dbConnected,
    error,
    success,

    // Data & Filters
    portsData,
    searchQuery,
    setSearchQuery,
    seaFilter,
    setSeaFilter,
    filteredPorts,
    paginatedPorts,

    // View Mode & Pagination
    viewMode,
    setViewMode,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,

    // Columns Visibility
    visibleColumns,
    columnsMenuOpen,
    columnsMenuPos,
    handleToggleColumnsMenu,
    handleToggleColumn,

    // Floating 3-dots Menu
    actionMenuState,
    setActionMenuState,
    handleToggleActionMenu,

    // Details Modal
    viewingPort,
    setViewingPort,

    // Selection & Bulk Delete
    selectedPortKeys,
    selectedCount,
    toggleSelectPort,
    toggleSelectAll,
    clearSelection,
    showBulkDeleteModal,
    isBulkDeleting,
    handleOpenBulkDelete,
    handleCancelBulkDelete,
    handleConfirmBulkDelete,

    // Form Modal (Add / Edit)
    showModal,
    editingItem,
    formData,
    isSubmitting,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleFormFieldChange,
    handleSubmit,

    // Delete Modal
    portToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useAdminPorts();

  if (authLoading || loading) {
    return <AdminPortsLoading />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={portsStyles.portsContainer} dir="rtl">
      {/* Global Notifications */}
      <AdminPortsNotifications
        error={error}
        success={success}
        dbConnected={dbConnected}
      />

      {/* Header Bar */}
      <AdminPortsHeader onAddClick={handleOpenAdd} />

      {/* Filter Bar with Search and Sea Pills */}
      <AdminPortsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalPorts={portsData.length}
        filteredCount={filteredPorts.length}
        selectedSea={seaFilter}
        onSeaChange={setSeaFilter}
      />

      {/* Controls Bar: Page size, Columns, View mode cards/table toggle, Bulk Delete */}
      <AdminPortsControlsBar
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        columnsMenuOpen={columnsMenuOpen}
        onToggleColumnsMenu={handleToggleColumnsMenu}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedCount={selectedCount}
        onClearSelection={clearSelection}
        onBulkDelete={handleOpenBulkDelete}
      />

      {/* Main Table or Cards View */}
      {viewMode === "table" ? (
        <AdminPortsTable
          ports={paginatedPorts}
          visibleColumns={visibleColumns}
          actionMenuState={actionMenuState}
          selectedPortKeys={selectedPortKeys}
          onToggleSelect={toggleSelectPort}
          onToggleSelectAll={toggleSelectAll}
          onViewPort={(port) => setViewingPort(port)}
          onToggleActionMenu={handleToggleActionMenu}
        />
      ) : (
        <AdminPortsCards
          ports={paginatedPorts}
          visibleColumns={visibleColumns}
          onViewPort={(port) => setViewingPort(port)}
          onEditPort={handleOpenEdit}
          onDeletePort={handleDeleteClick}
        />
      )}

      {/* Pagination */}
      <AdminPortsPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredPorts.length}
        onPageChange={setCurrentPage}
      />

      {/* Port Form Modal (Add / Edit) */}
      <AdminPortModal
        isOpen={showModal}
        editingItem={editingItem}
        formData={formData}
        isSubmitting={isSubmitting}
        onClose={handleCloseModal}
        onFormFieldChange={handleFormFieldChange}
        onSubmit={handleSubmit}
      />

      {/* Port Details Modal */}
      <AdminPortDetailsModal
        port={viewingPort}
        onClose={() => setViewingPort(null)}
        onEdit={(port) => {
          setViewingPort(null);
          handleOpenEdit(port);
        }}
      />

      {/* Single Delete Confirmation Modal */}
      <AdminPortsDeleteModal
        port={portToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Bulk Delete Confirmation Modal */}
      <AdminPortsDeleteModal
        isBulk
        bulkCount={selectedCount}
        isOpen={showBulkDeleteModal}
        isDeleting={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={handleCancelBulkDelete}
      />

      {/* Floating 3-dots Action Dropdown */}
      <AdminPortsActionDropdown
        actionMenuState={actionMenuState}
        onClose={() => setActionMenuState(null)}
        onViewPort={(port: PortItem) => setViewingPort(port)}
        onEditPort={(port: PortItem) => handleOpenEdit(port)}
        onDeletePort={(port: PortItem) => handleDeleteClick(port)}
      />

      {/* Floating Columns Dropdown */}
      <AdminPortsColumnsDropdown
        isOpen={columnsMenuOpen}
        position={columnsMenuPos}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
      />
    </div>
  );
}
