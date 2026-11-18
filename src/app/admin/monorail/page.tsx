"use client";

import React, { Suspense } from "react";
import { useAdminMonorail } from "./hooks/useAdminMonorail";
import {
  AdminMonorailLoading,
  AdminMonorailNotifications,
  AdminMonorailHeader,
  AdminMonorailFilterBar,
  AdminMonorailControlsBar,
  AdminMonorailTable,
  AdminMonorailCards,
  AdminMonorailPagination,
  AdminMonorailStationModal,
  AdminMonorailDetailsModal,
  AdminMonorailDeleteModal,
  AdminMonorailPricingForm,
  AdminMonorailActionDropdown,
  AdminMonorailColumnsDropdown,
} from "./components";
import { MonorailStation, VisibleColumns } from "./types";
import monorailStyles from "./admin-monorail.module.css";

export default function AdminMonorailPage() {
  return (
    <Suspense fallback={<AdminMonorailLoading />}>
      <AdminMonorailContent />
    </Suspense>
  );
}

function AdminMonorailContent() {
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
    monorailStations,
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
  } = useAdminMonorail();

  if (authLoading || loading) {
    return <AdminMonorailLoading />;
  }

  if (!isAdmin) {
    return null;
  }

  const handleDragStart = (station: MonorailStation, stationKey: string, e: React.DragEvent) => {
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

  const handleDrop = (targetStation: MonorailStation, e: React.DragEvent) => {
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
    <div className={monorailStyles.monorailContainer} dir="rtl">
      {/* Top Header & Tab Navigation */}
      <AdminMonorailHeader
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setError("");
          setSuccess("");
        }}
        onAddStationClick={handleOpenAddStation}
      />

      {/* Notifications & Warning Alerts */}
      <AdminMonorailNotifications
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
          <AdminMonorailFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalStations={monorailStations.length}
            filteredCount={filteredRows.length}
            activeLine={adminActiveLine}
            onLineChange={setAdminActiveLine}
          />

          {/* Controls Bar: Page size, view mode, columns toggle, bulk selection */}
          <AdminMonorailControlsBar
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
            <div className="bg-secondary border border-glass p-12 rounded-lg text-center text-md text-muted">
              لا توجد أي محطات مونوريل مطابقة للتصفية الحالية.
            </div>
          ) : viewMode === "cards" ? (
            <AdminMonorailCards
              monorailStations={monorailStations}
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
            <AdminMonorailTable
              monorailStations={monorailStations}
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
          <AdminMonorailPagination
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
        <AdminMonorailPricingForm
          ticketPrices={ticketPrices}
          onPriceChange={handlePriceFieldChange}
          onSubmit={handlePricesSubmit}
        />
      )}

      {/* ============================================================
         MODALS
         ============================================================ */}
      <AdminMonorailStationModal
        isOpen={showStationModal}
        editingStation={editingStation}
        formData={stationForm}
        monorailStations={monorailStations}
        onClose={() => setShowStationModal(false)}
        onChange={setStationForm}
        onSubmit={handleStationSubmit}
      />

      <AdminMonorailDetailsModal
        station={viewingStation}
        onClose={() => setViewingStation(null)}
        onEdit={(st) => {
          setViewingStation(null);
          handleOpenEditStation(st);
        }}
      />

      <AdminMonorailDeleteModal
        station={stationToDelete}
        isDeleting={isDeleting}
        onConfirm={confirmDeleteStation}
        onCancel={() => !isDeleting && setStationToDelete(null)}
      />

      {/* ============================================================
         FLOATING MENUS / POPOVERS
         ============================================================ */}
      <AdminMonorailActionDropdown
        actionMenuState={actionMenuState}
        onClose={() => setActionMenuState(null)}
        onViewStation={setViewingStation}
        onEditStation={handleOpenEditStation}
        onDeleteStation={handleStationDelete}
      />

      <AdminMonorailColumnsDropdown
        isOpen={columnsMenuOpen}
        position={columnsMenuPos}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
      />
    </div>
  );
}
