"use client";

import React, { Suspense } from "react";
import { useAdminMetro } from "./hooks/useAdminMetro";
import {
  AdminMetroLoading,
  AdminMetroNotifications,
  AdminMetroHeader,
  AdminMetroFilterBar,
  AdminMetroControlsBar,
  AdminMetroTable,
  AdminMetroCards,
  AdminMetroPagination,
  AdminMetroStationModal,
  AdminMetroDetailsModal,
  AdminMetroDeleteModal,
  AdminMetroPricingForm,
  AdminMetroActionDropdown,
  AdminMetroColumnsDropdown,
} from "./components";
import { MetroStation, VisibleColumns } from "./types";
import metroStyles from "./admin-metro.module.css";

export default function AdminMetroPage() {
  return (
    <Suspense fallback={<AdminMetroLoading />}>
      <AdminMetroContent />
    </Suspense>
  );
}

function AdminMetroContent() {
  const {
    // Auth & Status
    isAdmin,
    loading,
    authLoading,
    dbStatus,
    error,
    setError,
    success,
    setSuccess,

    // Section Navigation
    activeSection,
    setActiveSection,

    // Stations & Pricing Data
    metroStations,
    ticketPrices,
    adminActiveLine,
    setAdminActiveLine,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,

    // Pagination & Selection
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    selectedStationKeys,
    handleToggleSelectRow,
    handleToggleSelectAll,
    clearSelection,

    // Filtered / Paginated lists
    filteredRows,
    paginatedRows,
    totalFiltered,

    // Drag and Drop & Reordering
    draggedStationId,
    setDraggedStationId,
    dragOverStationId,
    setDragOverStationId,
    isReordering,
    handleReorderStations,
    handleMoveStation,

    // Modals
    showStationModal,
    setShowStationModal,
    editingStation,
    stationForm,
    setStationForm,
    handleOpenAddStation,
    handleOpenEditStation,
    handleStationSubmit,

    stationToDelete,
    setStationToDelete,
    isDeleting,
    handleStationDelete,
    confirmDeleteStation,

    viewingStation,
    setViewingStation,

    // Dropdown Menus
    actionMenuState,
    setActionMenuState,
    handleToggleActionMenu,

    visibleColumns,
    setVisibleColumns,
    columnsMenuOpen,
    setColumnsMenuOpen,
    columnsMenuPos,
    handleToggleColumnsMenu,

    // Pricing Handlers
    handlePricesSubmit,
    handlePriceFieldChange,
  } = useAdminMetro();

  if (authLoading || loading) {
    return <AdminMetroLoading />;
  }

  if (!isAdmin) {
    return null;
  }

  const handleDragStart = (station: MetroStation, stationKey: string, e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/json", JSON.stringify(station));
    setDraggedStationId(stationKey);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (stationKey: string, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedStationId && draggedStationId !== stationKey) {
      setDragOverStationId(stationKey);
    }
  };

  const handleDrop = (targetStation: MetroStation, e: React.DragEvent) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (dataStr) {
        const sourceData = JSON.parse(dataStr);
        handleReorderStations(sourceData, targetStation);
      }
    } catch (err) {
      console.error(err);
    }
    setDraggedStationId(null);
    setDragOverStationId(null);
  };

  const handleDragEnd = () => {
    setDraggedStationId(null);
    setDragOverStationId(null);
  };

  const handleToggleColumn = (key: keyof VisibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={metroStyles.metroContainer} dir="rtl">
      {/* Top Header & Tab Navigation */}
      <AdminMetroHeader
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setError("");
          setSuccess("");
        }}
        onAddStationClick={handleOpenAddStation}
      />

      {/* Notifications & Warning Alerts */}
      <AdminMetroNotifications
        error={error}
        success={success}
        dbStatus={dbStatus}
      />

      {/* ============================================================
         SECTION 1: Manage Stations & Lines
         ============================================================ */}
      {activeSection === "stations" && (
        <div>
          {/* Search bar & Line filters */}
          <AdminMetroFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalStations={metroStations.length}
            filteredCount={filteredRows.length}
            activeLine={adminActiveLine}
            onLineChange={setAdminActiveLine}
          />

          {/* Controls Bar: Page size, view mode, columns toggle, bulk selection */}
          <AdminMetroControlsBar
            pageSize={pageSize}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            columnsMenuOpen={columnsMenuOpen}
            onToggleColumnsMenu={handleToggleColumnsMenu}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedCount={selectedStationKeys.length}
            onClearSelection={clearSelection}
          />

          {/* Stations List: Cards or Table */}
          {filteredRows.length === 0 ? (
            <div className="bg-secondary border border-glass p-12 rounded-lg text-center text-md text-muted"
            >
              لا توجد أي محطات مترو مطابقة للتصفية الحالية.
            </div>
          ) : viewMode === "cards" ? (
            <AdminMetroCards
              metroStations={metroStations}
              paginatedRows={paginatedRows}
              selectedStationKeys={selectedStationKeys}
              visibleColumns={visibleColumns}
              draggedStationId={draggedStationId}
              dragOverStationId={dragOverStationId}
              isReordering={isReordering}
              onToggleSelectRow={handleToggleSelectRow}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onMoveStation={handleMoveStation}
              onViewStation={setViewingStation}
              onEditStation={handleOpenEditStation}
              onDeleteStation={handleStationDelete}
            />
          ) : (
            <AdminMetroTable
              metroStations={metroStations}
              paginatedRows={paginatedRows}
              selectedStationKeys={selectedStationKeys}
              visibleColumns={visibleColumns}
              draggedStationId={draggedStationId}
              dragOverStationId={dragOverStationId}
              isReordering={isReordering}
              actionMenuState={actionMenuState}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelectRow={handleToggleSelectRow}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onMoveStation={handleMoveStation}
              onToggleActionMenu={handleToggleActionMenu}
            />
          )}

          {/* Pagination Footer */}
          <AdminMetroPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalFiltered}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* ============================================================
         SECTION 2: Manage Ticket Pricing
         ============================================================ */}
      {activeSection === "pricing" && (
        <AdminMetroPricingForm
          ticketPrices={ticketPrices}
          onPriceChange={handlePriceFieldChange}
          onSubmit={handlePricesSubmit}
        />
      )}

      {/* ============================================================
         MODALS
         ============================================================ */}
      <AdminMetroStationModal
        isOpen={showStationModal}
        editingStation={editingStation}
        formData={stationForm}
        metroStations={metroStations}
        onClose={() => setShowStationModal(false)}
        onChange={setStationForm}
        onSubmit={handleStationSubmit}
      />

      <AdminMetroDetailsModal
        station={viewingStation}
        onClose={() => setViewingStation(null)}
        onEdit={(st) => {
          setViewingStation(null);
          handleOpenEditStation(st);
        }}
      />

      <AdminMetroDeleteModal
        station={stationToDelete}
        isDeleting={isDeleting}
        onConfirm={confirmDeleteStation}
        onCancel={() => !isDeleting && setStationToDelete(null)}
      />

      {/* ============================================================
         FLOATING MENUS / POPOVERS
         ============================================================ */}
      <AdminMetroActionDropdown
        actionMenuState={actionMenuState}
        onClose={() => setActionMenuState(null)}
        onViewStation={setViewingStation}
        onEditStation={handleOpenEditStation}
        onDeleteStation={handleStationDelete}
      />

      <AdminMetroColumnsDropdown
        isOpen={columnsMenuOpen}
        position={columnsMenuPos}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
      />
    </div>
  );
}
