"use client";

import React, { Suspense } from "react";
import { useAdminParking } from "./hooks/useAdminParking";
import {
  AdminParkingLoading,
  AdminParkingNotifications,
  AdminParkingHeader,
  AdminParkingFilterBar,
  AdminParkingControlsBar,
  AdminParkingTable,
  AdminParkingCards,
  AdminParkingPagination,
  AdminParkingModal,
  AdminParkingDetailsModal,
  AdminParkingDeleteModal,
  AdminParkingActionDropdown,
  AdminParkingColumnsDropdown,
} from "./components";
import { ParkingSpot } from "./types";
import parkingStyles from "./admin-parking.module.css";

export default function AdminParkingPage() {
  return (
    <Suspense fallback={<AdminParkingLoading />}>
      <AdminParkingContent />
    </Suspense>
  );
}

function AdminParkingContent() {
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
    areaFilter,
    setAreaFilter,
    availableAreas,
    totalSpotsCount,
    filteredSpots,
    paginatedSpots,

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
    viewingSpot,
    setViewingSpot,

    // Selection & Bulk Delete
    selectedSpotKeys,
    selectedCount,
    toggleSelectSpot,
    toggleSelectAll,
    clearSelection,
    showBulkDeleteModal,
    isBulkDeleting,
    handleOpenBulkDelete,
    handleCancelBulkDelete,
    handleConfirmBulkDelete,

    // Form Modal
    showModal,
    editingItem,
    formData,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleFormFieldChange,
    handleSubmit,

    // Delete Modal
    spotToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useAdminParking();

  if (authLoading || loading) {
    return <AdminParkingLoading />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={parkingStyles.parkingContainer} dir="rtl">
      {/* Notifications */}
      <AdminParkingNotifications
        error={error}
        success={success}
        dbConnected={dbConnected}
      />

      {/* Header Bar */}
      <AdminParkingHeader onAddClick={handleOpenAdd} />

      {/* Filter Bar with Search and Area Pills */}
      <AdminParkingFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalSpots={totalSpotsCount}
        filteredCount={filteredSpots.length}
        selectedArea={areaFilter}
        onAreaChange={setAreaFilter}
        availableAreas={availableAreas}
      />

      {/* Controls Bar: Page size, Columns button, View mode cards/table toggle, Bulk Delete */}
      <AdminParkingControlsBar
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
        <AdminParkingTable
          spots={paginatedSpots}
          visibleColumns={visibleColumns}
          actionMenuState={actionMenuState}
          selectedSpotKeys={selectedSpotKeys}
          onToggleSelect={toggleSelectSpot}
          onToggleSelectAll={toggleSelectAll}
          onViewSpot={(sp) => setViewingSpot(sp)}
          onToggleActionMenu={handleToggleActionMenu}
        />
      ) : (
        <AdminParkingCards
          spots={paginatedSpots}
          visibleColumns={visibleColumns}
          onViewSpot={(sp) => setViewingSpot(sp)}
          onEditSpot={handleOpenEdit}
          onDeleteSpot={handleDeleteClick}
        />
      )}

      {/* Pagination */}
      <AdminParkingPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredSpots.length}
        onPageChange={setCurrentPage}
      />

      {/* Parking Modal (Add / Edit) */}
      <AdminParkingModal
        isOpen={showModal}
        editingItem={editingItem}
        formData={formData}
        onClose={handleCloseModal}
        onFormFieldChange={handleFormFieldChange}
        onSubmit={handleSubmit}
      />

      {/* Details Modal */}
      <AdminParkingDetailsModal
        spot={viewingSpot}
        onClose={() => setViewingSpot(null)}
        onEdit={(sp) => {
          setViewingSpot(null);
          handleOpenEdit(sp);
        }}
      />

      {/* Single Delete Confirmation Modal */}
      <AdminParkingDeleteModal
        spot={spotToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Bulk Delete Confirmation Modal */}
      <AdminParkingDeleteModal
        isBulk
        bulkCount={selectedCount}
        isDeleting={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={handleCancelBulkDelete}
      />

      {/* Floating 3-dots Action Dropdown */}
      <AdminParkingActionDropdown
        actionMenuState={actionMenuState}
        onClose={() => setActionMenuState(null)}
        onViewSpot={(sp: ParkingSpot) => setViewingSpot(sp)}
        onEditSpot={(sp: ParkingSpot) => handleOpenEdit(sp)}
        onDeleteSpot={(sp: ParkingSpot) => handleDeleteClick(sp)}
      />

      {/* Floating Columns Dropdown */}
      <AdminParkingColumnsDropdown
        isOpen={columnsMenuOpen}
        position={columnsMenuPos}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
      />
    </div>
  );
}
