"use client";

import React from "react";
import styles from "./admin-places.module.css";
import { useAdminPlaces } from "./hooks/useAdminPlaces";
import {
  AdminPlacesLoading,
  AdminPlacesNotifications,
  AdminPlacesHeader,
  AdminPlacesFilterBar,
  AdminPlacesControlsBar,
  AdminPlacesTable,
  AdminPlacesCards,
  AdminPlacesPagination,
  AdminPlacesActionDropdown,
  AdminPlacesColumnsDropdown,
  AdminPlaceDetailsModal,
  AdminPlaceModal,
  AdminBranchesModal,
  AdminExcelImportModal,
  AdminAddCategoryModal,
  AdminPlaceDeleteModal,
  AdminFeedbackModal,
} from "./components";

export default function AdminPlacesPage() {
  const {
    // Auth & Base State
    isAdmin,
    loading,
    places,
    error,
    setError,

    // Filter & Search
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedGovernorate,
    setSelectedGovernorate,
    viewMode,
    setViewMode,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    filteredPlaces,
    paginatedPlaces,
    categoryCounts,
    governorateCounts,
    dbDuplicatesList,

    // Columns & Menus
    visibleColumns,
    toggleColumn,
    columnsMenuPos,
    openColumnsMenu,
    closeColumnsMenu,
    actionMenu,
    openActionMenu,
    closeActionMenu,

    // Details Modal
    detailsPlace,
    setDetailsPlace,

    // Selection & Bulk
    selectedPlaceIds,
    setSelectedPlaceIds,
    handleToggleSelectAll,
    handleToggleSelectPlace,
    isBulkDeleting,
    handleStartBulkDelete,
    confirmBulkDelete,

    // Delete Modals
    deleteModal,
    setDeleteModal,
    isDeletingPlace,
    handleDeletePlace,
    confirmDeletePlace,
    deleteAlertModal,
    setDeleteAlertModal,

    // Place Form Modal
    placeModalOpen,
    setPlaceModalOpen,
    editingPlace,
    placeFormData,
    updatePlaceForm,
    scheduleType,
    setScheduleType,
    scheduleData,
    setScheduleData,
    isSubmittingPlace,
    handleStartAddPlace,
    handleStartEditPlace,
    handleSavePlace,
    extractCoordinates,

    // Branches Modal
    selectedPlaceForBranch,
    setSelectedPlaceForBranch,
    editingBranchId,
    setEditingBranchId,
    branchFormData,
    setBranchFormData,
    branchScheduleType,
    setBranchScheduleType,
    branchScheduleData,
    setBranchScheduleData,
    isSubmittingBranch,
    openBranchesModal,
    handleEditBranch,
    handleSaveBranch,
    handleDeleteBranch,
    extractBranchCoordinates,

    // Excel Import
    showExcelImport,
    setShowExcelImport,
    importing,
    parsedPlaces,
    selectedParsedIndices,
    parsedPlacesSearch,
    setParsedPlacesSearch,
    importError,
    importSuccess,
    duplicates,
    handleDownloadTemplate,
    handleExcelUpload,
    handleRemoveParsedDuplicates,
    handleDeleteParsedPlace,
    handleDeleteSelectedParsedPlaces,
    toggleSelectParsedPlace,
    toggleSelectAllParsedPlaces,
    handleImportSubmit,

    // Custom Categories Modal
    showAddCategoryModal,
    setShowAddCategoryModal,
    newCatLabel,
    setNewCatLabel,
    newCatKey,
    setNewCatKey,
    newCatIcon,
    setNewCatIcon,
    isAddingCategory,
    handleAddCategorySubmit,

    // Clean DB & Seed
    handleCleanDbDuplicates,
    isDeletingDuplicates,
    handleSeedData
  } = useAdminPlaces();

  if (loading) {
    return <AdminPlacesLoading />;
  }

  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div className="glass-panel" style={{ padding: "40px", maxWidth: "460px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🚫</div>
          <h2 style={{ color: "#ff3b30", marginBottom: "8px", fontWeight: "800" }}>
            صلاحيات غير كافية
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            عذراً، هذه الصفحة مخصصة لمديري النظام فقط.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.placesContainer}>
      {/* Top Notifications */}
      <AdminPlacesNotifications
        error={error}
        onDismissError={() => setError("")}
      />

      {/* Header Bar */}
      <AdminPlacesHeader
        totalPlaces={places.length}
        dbDuplicatesCount={dbDuplicatesList.length}
        showExcelImport={showExcelImport}
        onToggleExcelImport={() => setShowExcelImport(!showExcelImport)}
        onStartAddPlace={handleStartAddPlace}
        onCleanDbDuplicates={handleCleanDbDuplicates}
        onSeedData={handleSeedData}
        isDeletingDuplicates={isDeletingDuplicates}
        isSubmitting={isSubmittingPlace}
      />

      {/* Excel Import Panel (Collapsible) */}
      <AdminExcelImportModal
        isOpen={showExcelImport}
        importing={importing}
        parsedPlaces={parsedPlaces}
        selectedIndices={selectedParsedIndices}
        searchQuery={parsedPlacesSearch}
        importError={importError}
        importSuccess={importSuccess}
        duplicates={duplicates}
        onClose={() => setShowExcelImport(false)}
        onDownloadTemplate={handleDownloadTemplate}
        onUploadFile={handleExcelUpload}
        onSearchChange={setParsedPlacesSearch}
        onRemoveDuplicates={handleRemoveParsedDuplicates}
        onDeleteParsedPlace={handleDeleteParsedPlace}
        onDeleteSelectedParsedPlaces={handleDeleteSelectedParsedPlaces}
        onToggleSelectParsed={toggleSelectParsedPlace}
        onToggleSelectAllParsed={toggleSelectAllParsedPlaces}
        onSubmitImport={handleImportSubmit}
      />

      {/* Filter Bar */}
      <AdminPlacesFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalPlaces={places.length}
        filteredCount={filteredPlaces.length}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categoryCounts={categoryCounts}
        selectedGovernorate={selectedGovernorate}
        onGovernorateChange={setSelectedGovernorate}
        governorateCounts={governorateCounts}
      />

      {/* Controls Bar */}
      <AdminPlacesControlsBar
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        columnsMenuOpen={Boolean(columnsMenuPos)}
        onToggleColumnsMenu={(e) => {
          e.stopPropagation();
          if (columnsMenuPos) closeColumnsMenu();
          else openColumnsMenu(e.currentTarget.getBoundingClientRect());
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalFiltered={filteredPlaces.length}
        selectedCount={selectedPlaceIds.length}
        onClearSelection={() => setSelectedPlaceIds([])}
        onBulkDelete={handleStartBulkDelete}
      />

      {/* Places View: Table or Cards */}
      {viewMode === "table" ? (
        <AdminPlacesTable
          places={paginatedPlaces}
          visibleColumns={visibleColumns}
          selectedIds={selectedPlaceIds}
          dbDuplicatesList={dbDuplicatesList}
          onToggleSelect={handleToggleSelectPlace}
          onToggleSelectAll={handleToggleSelectAll}
          onViewPlace={setDetailsPlace}
          onOpenActionMenu={openActionMenu}
          activeActionPlaceId={actionMenu.place?.id}
        />
      ) : (
        <AdminPlacesCards
          places={paginatedPlaces}
          selectedIds={selectedPlaceIds}
          dbDuplicatesList={dbDuplicatesList}
          onToggleSelect={handleToggleSelectPlace}
          onViewPlace={setDetailsPlace}
          onEditPlace={handleStartEditPlace}
          onOpenBranches={openBranchesModal}
          onDeletePlace={handleDeletePlace}
          onOpenActionMenu={openActionMenu}
          activeActionPlaceId={actionMenu.place?.id}
        />
      )}

      {/* Pagination */}
      <AdminPlacesPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredPlaces.length}
        onPageChange={setCurrentPage}
      />

      {/* Floating Action Dropdown Menu */}
      <AdminPlacesActionDropdown
        actionMenu={actionMenu}
        onClose={closeActionMenu}
        onViewPlace={setDetailsPlace}
        onEditPlace={handleStartEditPlace}
        onOpenBranches={openBranchesModal}
        onDeletePlace={handleDeletePlace}
      />

      {/* Floating Columns Dropdown Menu */}
      <AdminPlacesColumnsDropdown
        isOpen={Boolean(columnsMenuPos)}
        position={columnsMenuPos}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
      />

      {/* Place Details Modal */}
      <AdminPlaceDetailsModal
        place={detailsPlace}
        onClose={() => setDetailsPlace(null)}
        onEdit={handleStartEditPlace}
        onOpenBranches={openBranchesModal}
      />

      {/* Add / Edit Place Modal */}
      <AdminPlaceModal
        isOpen={placeModalOpen}
        editingPlace={editingPlace}
        formData={placeFormData}
        scheduleType={scheduleType}
        scheduleData={scheduleData}
        isSubmitting={isSubmittingPlace}
        places={places}
        onClose={() => setPlaceModalOpen(false)}
        onUpdateForm={updatePlaceForm}
        onSetScheduleType={setScheduleType}
        onSetScheduleData={setScheduleData}
        onSave={handleSavePlace}
        onExtractCoordinates={extractCoordinates}
        onOpenAddCategoryModal={() => setShowAddCategoryModal(true)}
      />

      {/* Branches Management Modal */}
      <AdminBranchesModal
        isOpen={Boolean(selectedPlaceForBranch)}
        place={selectedPlaceForBranch}
        editingBranchId={editingBranchId}
        formData={branchFormData}
        scheduleType={branchScheduleType}
        scheduleData={branchScheduleData}
        isSubmitting={isSubmittingBranch}
        onClose={() => setSelectedPlaceForBranch(null)}
        onEditBranch={handleEditBranch}
        onCancelEditBranch={() => {
          setEditingBranchId(null);
          setBranchFormData({
            name: "",
            governorate: selectedPlaceForBranch?.governorate || "القاهرة",
            city: "",
            full_address: "",
            phones: "",
            google_maps_url: "",
            latitude: "",
            longitude: "",
            media: ""
          });
          setBranchScheduleType("24/7");
        }}
        onDeleteBranch={handleDeleteBranch}
        onUpdateFormData={setBranchFormData}
        onSetScheduleType={setBranchScheduleType}
        onSetScheduleData={setBranchScheduleData}
        onSaveBranch={handleSaveBranch}
        onExtractBranchCoordinates={extractBranchCoordinates}
      />

      {/* Add Category Modal */}
      <AdminAddCategoryModal
        isOpen={showAddCategoryModal}
        newCatLabel={newCatLabel}
        newCatKey={newCatKey}
        newCatIcon={newCatIcon}
        isAdding={isAddingCategory}
        onClose={() => setShowAddCategoryModal(false)}
        onSetLabel={setNewCatLabel}
        onSetKey={setNewCatKey}
        onSetIcon={setNewCatIcon}
        onSubmit={handleAddCategorySubmit}
      />

      {/* Place Single & Bulk Delete Confirmation Modal */}
      <AdminPlaceDeleteModal
        deleteModal={deleteModal}
        isDeleting={isDeletingPlace || isBulkDeleting}
        onConfirm={deleteModal.isBulk ? confirmBulkDelete : confirmDeletePlace}
        onCancel={() => setDeleteModal({ isOpen: false, place: null })}
      />

      {/* Center Alert / Feedback Dialog */}
      <AdminFeedbackModal
        alertState={deleteAlertModal}
        onClose={() => setDeleteAlertModal(null)}
      />
    </div>
  );
}
