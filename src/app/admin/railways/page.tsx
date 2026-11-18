"use client";

import React, { Suspense } from "react";
import { useAdminRailways } from "./hooks/useAdminRailways";
import {
  AdminRailwaysLoading,
  AdminRailwaysNotifications,
  AdminRailwaysHeader,
  AdminRailwaysLinesFilterBar,
  AdminRailwaysLinesControlsBar,
  AdminRailwaysLinesTable,
  AdminRailwaysLinesCards,
  AdminRailwaysStationsFilterBar,
  AdminRailwaysStationsControlsBar,
  AdminRailwaysStationsTable,
  AdminRailwaysStationsCards,
  AdminRailwaysPagination,
  AdminRailwaysLineModal,
  AdminRailwaysStationModal,
  AdminRailwaysLineDetailsModal,
  AdminRailwaysDeleteModal,
  AdminRailwaysActionDropdown,
  AdminRailwaysColumnsDropdown,
} from "./components";
import { RailwayRoute, RailwayStop, VisibleLineColumns, VisibleStationColumns } from "./types";
import railwaysStyles from "./admin-railways.module.css";

export default function AdminRailwaysPage() {
  return (
    <Suspense fallback={<AdminRailwaysLoading />}>
      <AdminRailwaysContent />
    </Suspense>
  );
}

function AdminRailwaysContent() {
  const {
    // Auth & Status
    isAdmin,
    loading,
    dbStatus,
    error,
    success,

    // Section
    activeSection,
    setActiveSection,

    // Routes data
    routes,
    selectedRouteId,
    setSelectedRouteId,
    activeRoute,

    // Lines controls & pagination
    linesSearchQuery,
    setLinesSearchQuery,
    linesViewMode,
    setLinesViewMode,
    linesPageSize,
    setLinesPageSize,
    linesCurrentPage,
    setLinesCurrentPage,
    visibleLineColumns,
    setVisibleLineColumns,
    filteredLines,
    paginatedLines,

    // Stations controls & pagination
    stationsSearchQuery,
    setStationsSearchQuery,
    stationsViewMode,
    setStationsViewMode,
    stationsPageSize,
    setStationsPageSize,
    stationsCurrentPage,
    setStationsCurrentPage,
    visibleStationColumns,
    setVisibleStationColumns,
    filteredStops,
    paginatedStops,

    // Drag and Drop & Reorder
    draggedStopIdx,
    setDraggedStopIdx,
    dragOverStopIdx,
    setDragOverStopIdx,
    isReordering,
    handleReorderStops,
    handleMoveStop,

    // Line Modals
    showLineModal,
    setShowLineModal,
    editingLine,
    lineForm,
    setLineForm,
    handleOpenAddLine,
    handleOpenEditLine,
    handleSaveLine,
    handleDeleteLine,
    viewingLine,
    setViewingLine,

    // Station Modals
    showStationModal,
    setShowStationModal,
    editingStation,
    stationForm,
    setStationForm,
    handleOpenAddStation,
    handleOpenEditStation,
    handleSaveStation,
    handleDeleteStation,

    // Deletion Modal
    itemToDelete,
    setItemToDelete,
    isDeleting,
    confirmDelete,

    // Dropdowns
    actionMenuState,
    setActionMenuState,
    handleToggleActionMenu,
    columnsMenuOpen,
    setColumnsMenuOpen,
    columnsMenuPos,
    handleToggleColumnsMenu,
  } = useAdminRailways();

  if (loading) {
    return <AdminRailwaysLoading />;
  }

  if (!isAdmin) {
    return null;
  }

  // Switch to stations section for a specific route
  const handleSelectRouteStations = (routeId: string) => {
    setSelectedRouteId(routeId);
    setActiveSection("stations");
  };

  // Toggle visible columns
  const handleToggleLineColumn = (key: keyof VisibleLineColumns) => {
    setVisibleLineColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleStationColumn = (key: keyof VisibleStationColumns) => {
    setVisibleStationColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Drag and Drop handlers for stops
  const handleDragStart = (idx: number, e: React.DragEvent) => {
    setDraggedStopIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedStopIdx !== null && draggedStopIdx !== idx) {
      setDragOverStopIdx(idx);
    }
  };

  const handleDrop = (targetIdx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedStopIdx !== null && draggedStopIdx !== targetIdx) {
      handleReorderStops(draggedStopIdx, targetIdx);
    }
  };

  const handleDragEnd = () => {
    setDraggedStopIdx(null);
    setDragOverStopIdx(null);
  };

  return (
    <div className={railwaysStyles.railwaysContainer} dir="rtl">
      {/* Notifications */}
      <AdminRailwaysNotifications
        error={error}
        success={success}
        dbStatus={dbStatus}
      />

      {/* Header with Segmented Navigation (Lines / Stations) */}
      <AdminRailwaysHeader
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        activeRoute={activeRoute}
        onOpenAddLine={handleOpenAddLine}
        onOpenAddStation={handleOpenAddStation}
      />

      {/* ── SECTION: LINES ── */}
      {activeSection === "lines" && (
        <section aria-label="مسارات سكك حديد مصر">
          <AdminRailwaysLinesFilterBar
            searchQuery={linesSearchQuery}
            onSearchChange={setLinesSearchQuery}
            totalLines={routes.length}
            filteredCount={filteredLines.length}
          />

          <AdminRailwaysLinesControlsBar
            pageSize={linesPageSize}
            onPageSizeChange={setLinesPageSize}
            columnsMenuOpen={columnsMenuOpen}
            onToggleColumnsMenu={handleToggleColumnsMenu}
            viewMode={linesViewMode}
            onViewModeChange={setLinesViewMode}
          />

          {linesViewMode === "table" ? (
            <AdminRailwaysLinesTable
              routes={routes}
              paginatedRoutes={paginatedLines}
              visibleColumns={visibleLineColumns}
              actionMenuState={actionMenuState}
              onViewLine={(route) => setViewingLine(route)}
              onSelectRouteStations={handleSelectRouteStations}
              onToggleActionMenu={(route, key, e) => handleToggleActionMenu("line", route, key, e)}
            />
          ) : (
            <AdminRailwaysLinesCards
              paginatedRoutes={paginatedLines}
              visibleColumns={visibleLineColumns}
              onViewLine={(route) => setViewingLine(route)}
              onEditLine={handleOpenEditLine}
              onDeleteLine={handleDeleteLine}
              onSelectRouteStations={handleSelectRouteStations}
            />
          )}

          <AdminRailwaysPagination
            currentPage={linesCurrentPage}
            pageSize={linesPageSize}
            totalItems={filteredLines.length}
            unitName="مسار"
            onPageChange={setLinesCurrentPage}
          />
        </section>
      )}

      {/* ── SECTION: STATIONS ── */}
      {activeSection === "stations" && (
        <section aria-label="محطات توقف المسار">
          <AdminRailwaysStationsFilterBar
            searchQuery={stationsSearchQuery}
            onSearchChange={setStationsSearchQuery}
            totalStations={activeRoute?.stops?.length || 0}
            filteredCount={filteredStops.length}
            routes={routes}
            selectedRouteId={selectedRouteId}
            onRouteChange={setSelectedRouteId}
          />

          <AdminRailwaysStationsControlsBar
            pageSize={stationsPageSize}
            onPageSizeChange={setStationsPageSize}
            columnsMenuOpen={columnsMenuOpen}
            onToggleColumnsMenu={handleToggleColumnsMenu}
            viewMode={stationsViewMode}
            onViewModeChange={setStationsViewMode}
          />

          {stationsViewMode === "table" ? (
            <AdminRailwaysStationsTable
              allStops={activeRoute?.stops || []}
              paginatedStops={paginatedStops}
              visibleColumns={visibleStationColumns}
              draggedStopIdx={draggedStopIdx}
              dragOverStopIdx={dragOverStopIdx}
              isReordering={isReordering}
              actionMenuState={actionMenuState}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onMoveStop={handleMoveStop}
              onToggleActionMenu={(stop, idx, key, e) =>
                handleToggleActionMenu("station", { stop, idx }, key, e)
              }
            />
          ) : (
            <AdminRailwaysStationsCards
              allStops={activeRoute?.stops || []}
              paginatedStops={paginatedStops}
              visibleColumns={visibleStationColumns}
              draggedStopIdx={draggedStopIdx}
              dragOverStopIdx={dragOverStopIdx}
              isReordering={isReordering}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onMoveStop={handleMoveStop}
              onEditStation={(stop, idx) => handleOpenEditStation(idx, stop)}
              onDeleteStation={(stop, idx) => handleDeleteStation(idx, stop)}
            />
          )}

          <AdminRailwaysPagination
            currentPage={stationsCurrentPage}
            pageSize={stationsPageSize}
            totalItems={filteredStops.length}
            unitName="محطة"
            onPageChange={setStationsCurrentPage}
          />
        </section>
      )}

      {/* ── MODALS ── */}
      {/* Route Modal (Add/Edit) */}
      <AdminRailwaysLineModal
        isOpen={showLineModal}
        editingLine={editingLine}
        formData={lineForm}
        onClose={() => setShowLineModal(false)}
        onChange={setLineForm}
        onSubmit={handleSaveLine}
      />

      {/* Station Modal (Add/Edit) */}
      <AdminRailwaysStationModal
        isOpen={showStationModal}
        editingStation={editingStation}
        formData={stationForm}
        activeRoute={activeRoute}
        onClose={() => setShowStationModal(false)}
        onChange={setStationForm}
        onSubmit={handleSaveStation}
      />

      {/* Route Details Modal */}
      <AdminRailwaysLineDetailsModal
        route={viewingLine}
        onClose={() => setViewingLine(null)}
        onManageStations={handleSelectRouteStations}
      />

      {/* Delete Confirmation Modal */}
      <AdminRailwaysDeleteModal
        itemToDelete={itemToDelete}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Floating 3-dots Action Dropdown */}
      <AdminRailwaysActionDropdown
        actionMenuState={actionMenuState}
        onClose={() => setActionMenuState(null)}
        onViewLine={(route: RailwayRoute) => setViewingLine(route)}
        onEditLine={(route: RailwayRoute) => handleOpenEditLine(route)}
        onDeleteLine={(route: RailwayRoute) => handleDeleteLine(route)}
        onEditStation={(data: { stop: RailwayStop; idx: number }) =>
          handleOpenEditStation(data.idx, data.stop)
        }
        onDeleteStation={(data: { stop: RailwayStop; idx: number }) =>
          handleDeleteStation(data.idx, data.stop)
        }
      />

      {/* Floating Columns Dropdown */}
      <AdminRailwaysColumnsDropdown
        isOpen={columnsMenuOpen}
        position={columnsMenuPos}
        section={activeSection}
        visibleLineColumns={visibleLineColumns}
        visibleStationColumns={visibleStationColumns}
        onToggleLineColumn={handleToggleLineColumn}
        onToggleStationColumn={handleToggleStationColumn}
      />
    </div>
  );
}
