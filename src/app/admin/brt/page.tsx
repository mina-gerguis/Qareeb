"use client";

import React, { Suspense } from "react";
import { useAdminBrtStations } from "./hooks/useAdminBrtStations";
import {
  AdminBrtLoading,
  AdminBrtNotifications,
  AdminBrtHeader,
  AdminBrtFilterBar,
  AdminBrtControlsBar,
  AdminBrtTable,
  AdminBrtCards,
  AdminBrtPagination,
  AdminBrtStationModal,
  AdminBrtDetailsModal,
  AdminBrtDeleteModal,
  AdminBrtActionDropdown,
  AdminBrtColumnsDropdown,
} from "./components";
import { AdminBrtStation } from "./types";
import brtStyles from "./admin-brt.module.css";

export default function AdminBrtPage() {
  return (
    <Suspense fallback={<AdminBrtLoading />}>
      <AdminBrtContent />
    </Suspense>
  );
}

function AdminBrtContent() {
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
    sectorFilter,
    setSectorFilter,
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

    // Selection & Bulk
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

    // Excel
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

    // Single Delete
    itemToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useAdminBrtStations();

  if (authLoading || loading) {
    return <AdminBrtLoading />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={brtStyles.brtContainer} dir="rtl">
      {/* Notifications */}
      <AdminBrtNotifications
        error={error}
        success={success}
        dbConnected={dbConnected}
      />

      {/* Header Bar */}
      <AdminBrtHeader
        onAddClick={handleOpenAdd}
        onOpenExcelModal={handleOpenExcelModal}
        onExportExcel={handleExportExcel}
      />

      {/* Filter Bar with Search and Sector Pills */}
      <AdminBrtFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalStations={totalStationsCount}
        filteredCount={filteredStations.length}
        selectedSector={sectorFilter}
        onSectorChange={setSectorFilter}
      />

      {/* Controls Bar: Page size, Columns, View mode & Bulk selection ribbon */}
      <AdminBrtControlsBar
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

      {/* Table or Cards View */}
      {viewMode === "table" ? (
        <AdminBrtTable
          stations={paginatedStations}
          selectedStationKeys={selectedStationKeys}
          visibleColumns={visibleColumns}
          actionMenuState={actionMenuState}
          onToggleSelectRow={toggleSelectStation}
          onToggleSelectAll={toggleSelectAll}
          onViewStation={(st) => setViewingStation(st)}
          onToggleActionMenu={handleToggleActionMenu}
        />
      ) : (
        <AdminBrtCards
          stations={paginatedStations}
          selectedStationKeys={selectedStationKeys}
          visibleColumns={visibleColumns}
          onToggleSelectRow={toggleSelectStation}
          onViewStation={(st) => setViewingStation(st)}
          onEditStation={handleOpenEdit}
          onDeleteStation={handleDeleteClick}
        />
      )}

      {/* Pagination */}
      <AdminBrtPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredStations.length}
        onPageChange={setCurrentPage}
      />

      {/* Station Modal (Add / Edit) */}
      <AdminBrtStationModal
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
      <AdminBrtDetailsModal
        station={viewingStation}
        onClose={() => setViewingStation(null)}
        onEdit={(st) => {
          setViewingStation(null);
          handleOpenEdit(st);
        }}
      />

      {/* Delete Confirmation Modal (Single) */}
      <AdminBrtDeleteModal
        itemToDelete={itemToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Bulk Delete Confirmation Modal */}
      <AdminBrtDeleteModal
        itemToDelete={null}
        bulkDeleteCount={showBulkDeleteModal ? selectedCount : 0}
        isDeleting={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={handleCancelBulkDelete}
      />

      {/* Floating 3-dots Action Menu */}
      <AdminBrtActionDropdown
        actionMenuState={actionMenuState}
        onClose={() => setActionMenuState(null)}
        onViewStation={(st: AdminBrtStation) => setViewingStation(st)}
        onEditStation={(st: AdminBrtStation) => handleOpenEdit(st)}
        onDeleteStation={(st: AdminBrtStation) => handleDeleteClick(st)}
      />

      {/* Floating Columns Dropdown */}
      <AdminBrtColumnsDropdown
        isOpen={columnsMenuOpen}
        position={columnsMenuPos}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
      />
    </div>
  );
}
