"use client";

import React, { Suspense } from "react";
import { useAdminAirports } from "./hooks/useAdminAirports";
import {
  AdminAirportsLoading,
  AdminAirportsNotifications,
  AdminAirportsHeader,
  AdminAirportsFilterBar,
  AdminAirportsControlsBar,
  AdminAirportsTable,
  AdminAirportsCards,
  AdminAirportsPagination,
  AdminAirportModal,
  AdminAirportDetailsModal,
  AdminAirportsDeleteModal,
  AdminAirportsActionDropdown,
  AdminAirportsColumnsDropdown,
} from "./components";
import { Airport } from "./types";
import airportsStyles from "./admin-airports.module.css";

export default function AdminAirportsPage() {
  return (
    <Suspense fallback={<AdminAirportsLoading />}>
      <AdminAirportsContent />
    </Suspense>
  );
}

function AdminAirportsContent() {
  const {
    // Auth & Status
    isAdmin,
    loading,
    authLoading,
    dbConnected,
    error,
    success,

    // Data & Filters
    airportsData,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    filteredAirports,
    paginatedAirports,

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
    viewingAirport,
    setViewingAirport,

    // Selection & Bulk Delete
    selectedAirportKeys,
    selectedCount,
    toggleSelectAirport,
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
    airportToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useAdminAirports();

  if (authLoading || loading) {
    return <AdminAirportsLoading />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={airportsStyles.airportsContainer} dir="rtl">
      {/* Global Notifications */}
      <AdminAirportsNotifications
        error={error}
        success={success}
        dbConnected={dbConnected}
      />

      {/* Header Bar */}
      <AdminAirportsHeader onAddClick={handleOpenAdd} />

      {/* Filter Bar with Search and Type Pills */}
      <AdminAirportsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalAirports={airportsData.length}
        filteredCount={filteredAirports.length}
        selectedType={typeFilter}
        onTypeChange={setTypeFilter}
      />

      {/* Controls Bar: Page size, Columns, View mode cards/table toggle, Bulk Delete */}
      <AdminAirportsControlsBar
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
        <AdminAirportsTable
          airports={paginatedAirports}
          visibleColumns={visibleColumns}
          actionMenuState={actionMenuState}
          selectedAirportKeys={selectedAirportKeys}
          onToggleSelect={toggleSelectAirport}
          onToggleSelectAll={toggleSelectAll}
          onViewAirport={(item) => setViewingAirport(item)}
          onToggleActionMenu={handleToggleActionMenu}
        />
      ) : (
        <AdminAirportsCards
          airports={paginatedAirports}
          visibleColumns={visibleColumns}
          onViewAirport={(item) => setViewingAirport(item)}
          onEditAirport={handleOpenEdit}
          onDeleteAirport={handleDeleteClick}
        />
      )}

      {/* Pagination */}
      <AdminAirportsPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredAirports.length}
        onPageChange={setCurrentPage}
      />

      {/* Airport Form Modal (Add / Edit) */}
      <AdminAirportModal
        isOpen={showModal}
        editingItem={editingItem}
        formData={formData}
        isSubmitting={isSubmitting}
        onClose={handleCloseModal}
        onFormFieldChange={handleFormFieldChange}
        onSubmit={handleSubmit}
      />

      {/* Airport Details Modal */}
      <AdminAirportDetailsModal
        airport={viewingAirport}
        onClose={() => setViewingAirport(null)}
        onEdit={(item) => {
          setViewingAirport(null);
          handleOpenEdit(item);
        }}
      />

      {/* Single Delete Confirmation Modal */}
      <AdminAirportsDeleteModal
        airport={airportToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Bulk Delete Confirmation Modal */}
      <AdminAirportsDeleteModal
        isBulk
        bulkCount={selectedCount}
        isOpen={showBulkDeleteModal}
        isDeleting={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={handleCancelBulkDelete}
      />

      {/* Floating 3-dots Action Dropdown */}
      <AdminAirportsActionDropdown
        actionMenuState={actionMenuState}
        onClose={() => setActionMenuState(null)}
        onViewAirport={(item: Airport) => setViewingAirport(item)}
        onEditAirport={(item: Airport) => handleOpenEdit(item)}
        onDeleteAirport={(item: Airport) => handleDeleteClick(item)}
      />

      {/* Floating Columns Dropdown */}
      <AdminAirportsColumnsDropdown
        isOpen={columnsMenuOpen}
        position={columnsMenuPos}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
      />
    </div>
  );
}
