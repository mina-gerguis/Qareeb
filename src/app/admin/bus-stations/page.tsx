"use client";

import React, { Suspense } from "react";
import { useAdminBusStations } from "./hooks/useAdminBusStations";
import {
  AdminBusStationsLoading,
  AdminBusStationsNotifications,
  AdminBusStationsHeader,
  AdminBusStationsFilterBar,
  AdminBusStationsControlsBar,
  AdminBusStationsTable,
  AdminBusStationsCards,
  AdminBusStationsPagination,
  AdminBusStationsModal,
  AdminBusStationsDetailsModal,
  AdminBusStationsDeleteModal,
  AdminBusStationsActionDropdown,
  AdminBusStationsColumnsDropdown,
} from "./components";
import { BusStation } from "./types";
import busStyles from "./admin-bus-stations.module.css";

export default function AdminBusStationsPage() {
  return (
    <Suspense fallback={<AdminBusStationsLoading />}>
      <AdminBusStationsContent />
    </Suspense>
  );
}

function AdminBusStationsContent() {
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

    // Form Modal
    showModal,
    editingItem,
    formData,
    formCompanies,
    availableLogos,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleFormFieldChange,
    handleAddCompany,
    handleRemoveCompany,
    handleCompanyFieldChange,
    handleSubmit,

    // Delete Modal
    stationToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useAdminBusStations();

  if (authLoading || loading) {
    return <AdminBusStationsLoading />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={busStyles.busStationsContainer} dir="rtl">
      {/* Notifications */}
      <AdminBusStationsNotifications
        error={error}
        success={success}
        dbConnected={dbConnected}
      />

      {/* Header Bar */}
      <AdminBusStationsHeader onAddClick={handleOpenAdd} />

      {/* Filter Bar with Search and Governorate Pills */}
      <AdminBusStationsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalStations={totalStationsCount}
        filteredCount={filteredStations.length}
        selectedGovernorate={governorateFilter}
        onGovernorateChange={setGovernorateFilter}
        availableGovernorates={availableGovernorates}
      />

      {/* Controls Bar: Page size, Columns button, View mode cards/table toggle */}
      <AdminBusStationsControlsBar
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        columnsMenuOpen={columnsMenuOpen}
        onToggleColumnsMenu={handleToggleColumnsMenu}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Table or Cards View */}
      {viewMode === "table" ? (
        <AdminBusStationsTable
          stations={paginatedStations}
          visibleColumns={visibleColumns}
          actionMenuState={actionMenuState}
          onViewStation={(st) => setViewingStation(st)}
          onToggleActionMenu={handleToggleActionMenu}
        />
      ) : (
        <AdminBusStationsCards
          stations={paginatedStations}
          visibleColumns={visibleColumns}
          onViewStation={(st) => setViewingStation(st)}
          onEditStation={handleOpenEdit}
          onDeleteStation={handleDeleteClick}
        />
      )}

      {/* Pagination */}
      <AdminBusStationsPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredStations.length}
        onPageChange={setCurrentPage}
      />

      {/* Station Modal (Add / Edit) */}
      <AdminBusStationsModal
        isOpen={showModal}
        editingItem={editingItem}
        formData={formData}
        formCompanies={formCompanies}
        availableLogos={availableLogos}
        onClose={handleCloseModal}
        onFormFieldChange={handleFormFieldChange}
        onAddCompany={handleAddCompany}
        onRemoveCompany={handleRemoveCompany}
        onCompanyFieldChange={handleCompanyFieldChange}
        onSubmit={handleSubmit}
      />

      {/* Details Modal */}
      <AdminBusStationsDetailsModal
        station={viewingStation}
        onClose={() => setViewingStation(null)}
        onEdit={(st) => {
          setViewingStation(null);
          handleOpenEdit(st);
        }}
      />

      {/* Delete Confirmation Modal */}
      <AdminBusStationsDeleteModal
        station={stationToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Floating 3-dots Action Dropdown */}
      <AdminBusStationsActionDropdown
        actionMenuState={actionMenuState}
        onClose={() => setActionMenuState(null)}
        onViewStation={(st: BusStation) => setViewingStation(st)}
        onEditStation={(st: BusStation) => handleOpenEdit(st)}
        onDeleteStation={(st: BusStation) => handleDeleteClick(st)}
      />

      {/* Floating Columns Dropdown */}
      <AdminBusStationsColumnsDropdown
        isOpen={columnsMenuOpen}
        position={columnsMenuPos}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
      />
    </div>
  );
}
