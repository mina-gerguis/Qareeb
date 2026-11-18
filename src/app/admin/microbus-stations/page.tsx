"use client";

import React, { Suspense } from "react";
import { useAdminMicrobusStations } from "./hooks/useAdminMicrobusStations";
import {
  AdminMicrobusStationsLoading,
  AdminMicrobusStationsNotifications,
  AdminMicrobusStationsHeader,
  AdminMicrobusStationsFilterBar,
  AdminMicrobusStationsControlsBar,
  AdminMicrobusStationsTable,
  AdminMicrobusStationsCards,
  AdminMicrobusStationsPagination,
  AdminMicrobusStationsModal,
  AdminMicrobusStationsDetailsModal,
  AdminMicrobusStationsDeleteModal,
  AdminMicrobusStationsActionDropdown,
  AdminMicrobusStationsColumnsDropdown,
  AdminMicrobusStationsExcelModal,
} from "./components";
import { AdminMicrobusStation } from "./types";
import microStyles from "./admin-microbus-stations.module.css";

export default function AdminMicrobusStationsPage() {
  return (
    <Suspense fallback={<AdminMicrobusStationsLoading />}>
      <AdminMicrobusStationsContent />
    </Suspense>
  );
}

function AdminMicrobusStationsContent() {
  const {
    // Auth & Status
    authLoading,
    loading,
    isAdmin,
    dbConnected,
    error,
    success,

    // Search & Filter
    searchQuery,
    setSearchQuery,
    governorateFilter,
    setGovernorateFilter,
    availableGovernorates,
    totalStationsCount,
    filteredStations,
    paginatedStations,

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

    // Floating 3-dots action menu
    actionMenuState,
    setActionMenuState,
    handleToggleActionMenu,

    // Viewing Details
    viewingStation,
    setViewingStation,

    // Selection & Bulk Delete
    selectedStationKeys,
    selectedCount,
    toggleSelectStation,
    toggleSelectAll,
    clearSelection,
    showBulkDeleteModal,
    isBulkDeleting,
    handleOpenBulkDelete,
    handleCancelBulkDelete,
    handleConfirmBulkDelete,

    // Excel Modal & Actions
    showExcelModal,
    handleOpenExcelModal,
    handleCloseExcelModal,
    handleExportExcel,
    handleImportExcel,

    // Form Modal
    showModal,
    editingItem,
    formData,
    visualRoutes,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleFormFieldChange,
    handleRouteFieldChange,
    handleAddRoute,
    handleRemoveRoute,
    handleSubmit,

    // Delete Modal
    itemToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useAdminMicrobusStations();

  if (authLoading || loading) {
    return <AdminMicrobusStationsLoading />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={microStyles.microbusStationsContainer} dir="rtl">
      {/* Notifications */}
      <AdminMicrobusStationsNotifications
        error={error}
        success={success}
        dbConnected={dbConnected}
      />

      {/* Header Bar */}
      <AdminMicrobusStationsHeader
        onAddClick={handleOpenAdd}
        onOpenExcelModal={handleOpenExcelModal}
        onExportExcel={handleExportExcel}
      />

      {/* Filter Bar with Search and Governorate Pills */}
      <AdminMicrobusStationsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalStations={totalStationsCount}
        filteredCount={filteredStations.length}
        selectedGovernorate={governorateFilter}
        onGovernorateChange={setGovernorateFilter}
        availableGovernorates={availableGovernorates}
      />

      {/* Controls Bar: Page size, Columns button, View mode cards/table toggle, Bulk Delete */}
      <AdminMicrobusStationsControlsBar
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
        <AdminMicrobusStationsTable
          stations={paginatedStations}
          visibleColumns={visibleColumns}
          actionMenuState={actionMenuState}
          selectedStationKeys={selectedStationKeys}
          onToggleSelect={toggleSelectStation}
          onToggleSelectAll={toggleSelectAll}
          onViewStation={(st) => setViewingStation(st)}
          onToggleActionMenu={handleToggleActionMenu}
        />
      ) : (
        <AdminMicrobusStationsCards
          stations={paginatedStations}
          visibleColumns={visibleColumns}
          onViewStation={(st) => setViewingStation(st)}
          onEditStation={handleOpenEdit}
          onDeleteStation={handleDeleteClick}
        />
      )}

      {/* Pagination */}
      <AdminMicrobusStationsPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredStations.length}
        onPageChange={setCurrentPage}
      />

      {/* Station Modal (Add / Edit) */}
      <AdminMicrobusStationsModal
        isOpen={showModal}
        editingItem={editingItem}
        formData={formData}
        visualRoutes={visualRoutes}
        onClose={handleCloseModal}
        onFormFieldChange={handleFormFieldChange}
        onRouteFieldChange={handleRouteFieldChange}
        onAddRoute={handleAddRoute}
        onRemoveRoute={handleRemoveRoute}
        onSubmit={handleSubmit}
      />

      {/* Details Modal */}
      <AdminMicrobusStationsDetailsModal
        station={viewingStation}
        onClose={() => setViewingStation(null)}
        onEdit={(st) => {
          setViewingStation(null);
          handleOpenEdit(st);
        }}
      />

      {/* Single Delete Confirmation Modal */}
      <AdminMicrobusStationsDeleteModal
        station={itemToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Bulk Delete Confirmation Modal */}
      <AdminMicrobusStationsDeleteModal
        isBulk
        bulkCount={selectedCount}
        isDeleting={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={handleCancelBulkDelete}
      />

      {/* Excel Import Modal */}
      <AdminMicrobusStationsExcelModal
        isOpen={showExcelModal}
        onClose={handleCloseExcelModal}
        onImportSuccess={handleImportExcel}
      />

      {/* Floating 3-dots Action Dropdown */}
      <AdminMicrobusStationsActionDropdown
        actionMenuState={actionMenuState}
        onClose={() => setActionMenuState(null)}
        onViewStation={(st: AdminMicrobusStation) => setViewingStation(st)}
        onEditStation={(st: AdminMicrobusStation) => handleOpenEdit(st)}
        onDeleteStation={(st: AdminMicrobusStation) => handleDeleteClick(st)}
      />

      {/* Floating Columns Dropdown */}
      <AdminMicrobusStationsColumnsDropdown
        isOpen={columnsMenuOpen}
        position={columnsMenuPos}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
      />
    </div>
  );
}
