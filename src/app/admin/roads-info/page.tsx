"use client";

import React, { Suspense } from "react";
import { useAdminRoadsInfo } from "./hooks/useAdminRoadsInfo";
import {
  AdminRoadsInfoLoading,
  AdminRoadsInfoNotifications,
  AdminRoadsInfoHeader,
  AdminRoadsFilterBar,
  AdminNewsFilterBar,
  AdminRoadsControlsBar,
  AdminNewsControlsBar,
  AdminRoadsTable,
  AdminRoadsCards,
  AdminNewsTable,
  AdminNewsCards,
  AdminRoadsInfoPagination,
  AdminRoadModal,
  AdminRoadDetailsModal,
  AdminNewsModal,
  AdminRoadsDeleteModal,
  AdminRoadsActionDropdown,
  AdminRoadsColumnsDropdown,
  AdminNewsColumnsDropdown,
} from "./components";
import roadsStyles from "./admin-roads-info.module.css";

export default function AdminRoadsInfoPage() {
  return (
    <Suspense fallback={<AdminRoadsInfoLoading />}>
      <AdminRoadsInfoContent />
    </Suspense>
  );
}

function AdminRoadsInfoContent() {
  const {
    // Auth & Global
    activeAdminTab,
    setActiveAdminTab,
    isAdmin,
    loading,
    authLoading,
    dbConnected,
    error,
    success,

    // Roads State & Handlers
    roadsData,
    roadSearch,
    setRoadSearch,
    roadTypeFilter,
    setRoadTypeFilter,
    filteredRoads,
    paginatedRoads,
    roadViewMode,
    setRoadViewMode,
    roadPageSize,
    setRoadPageSize,
    currentRoadPage,
    setCurrentRoadPage,
    visibleColumnsRoads,
    columnsMenuRoadOpen,
    columnsMenuRoadPos,
    handleToggleColumnsMenuRoad,
    handleToggleColumnRoads,
    actionMenuRoad,
    setActionMenuRoad,
    handleToggleActionMenuRoad,
    viewingRoad,
    setViewingRoad,
    selectedRoadKeys,
    selectedRoadsCount,
    toggleSelectRoad,
    toggleSelectAllRoads,
    clearRoadSelection,
    showRoadBulkDeleteModal,
    isRoadBulkDeleting,
    handleOpenRoadBulkDelete,
    handleCancelRoadBulkDelete,
    handleConfirmRoadBulkDelete,
    showRoadModal,
    editingRoad,
    roadForm,
    handleOpenAddRoad,
    handleOpenEditRoad,
    handleCloseRoadModal,
    handleRoadFormChange,
    handleSubmitRoad,
    roadToDelete,
    isDeletingRoad,
    handleDeleteRoadClick,
    handleConfirmDeleteRoad,
    handleCancelDeleteRoad,

    // News State & Handlers
    newsData,
    newsSearch,
    setNewsSearch,
    newsCatFilter,
    setNewsCatFilter,
    filteredNews,
    paginatedNews,
    newsViewMode,
    setNewsViewMode,
    newsPageSize,
    setNewsPageSize,
    currentNewsPage,
    setCurrentNewsPage,
    visibleColumnsNews,
    columnsMenuNewsOpen,
    columnsMenuNewsPos,
    handleToggleColumnsMenuNews,
    handleToggleColumnNews,
    actionMenuNews,
    setActionMenuNews,
    handleToggleActionMenuNews,
    selectedNewsKeys,
    selectedNewsCount,
    toggleSelectNews,
    toggleSelectAllNews,
    clearNewsSelection,
    showNewsBulkDeleteModal,
    isNewsBulkDeleting,
    handleOpenNewsBulkDelete,
    handleCancelNewsBulkDelete,
    handleConfirmNewsBulkDelete,
    showNewsModal,
    editingNews,
    newsForm,
    handleOpenAddNews,
    handleOpenEditNews,
    handleCloseNewsModal,
    handleNewsFormChange,
    handleSubmitNews,
    newsToDelete,
    isDeletingNews,
    handleDeleteNewsClick,
    handleConfirmDeleteNews,
    handleCancelDeleteNews,
  } = useAdminRoadsInfo();

  if (authLoading || loading) {
    return <AdminRoadsInfoLoading />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={roadsStyles.roadsInfoContainer} dir="rtl">
      {/* Global Notifications */}
      <AdminRoadsInfoNotifications
        error={error}
        success={success}
        dbConnected={dbConnected}
      />

      {/* Header with Dual Tabs and Add Button */}
      <AdminRoadsInfoHeader
        activeTab={activeAdminTab}
        onTabChange={setActiveAdminTab}
        onAddRoad={handleOpenAddRoad}
        onAddNews={handleOpenAddNews}
      />

      {/* ===================== ROADS TAB CONTENT ===================== */}
      {activeAdminTab === "roads" && (
        <>
          {/* Roads Filter Bar (Search + Road Type Pills) */}
          <AdminRoadsFilterBar
            searchQuery={roadSearch}
            onSearchChange={setRoadSearch}
            totalRoads={roadsData.length}
            filteredCount={filteredRoads.length}
            selectedType={roadTypeFilter}
            onTypeChange={setRoadTypeFilter}
          />

          {/* Controls Bar: Page Size, Columns Menu, Table/Cards Toggle, Bulk Delete */}
          <AdminRoadsControlsBar
            pageSize={roadPageSize}
            onPageSizeChange={setRoadPageSize}
            columnsMenuOpen={columnsMenuRoadOpen}
            onToggleColumnsMenu={handleToggleColumnsMenuRoad}
            viewMode={roadViewMode}
            onViewModeChange={setRoadViewMode}
            selectedCount={selectedRoadsCount}
            onClearSelection={clearRoadSelection}
            onBulkDelete={handleOpenRoadBulkDelete}
          />

          {/* Roads View: Table or Cards */}
          {roadViewMode === "table" ? (
            <AdminRoadsTable
              roads={paginatedRoads}
              visibleColumns={visibleColumnsRoads}
              actionMenuState={actionMenuRoad}
              selectedRoadKeys={selectedRoadKeys}
              onToggleSelect={toggleSelectRoad}
              onToggleSelectAll={toggleSelectAllRoads}
              onViewRoad={(road) => setViewingRoad(road)}
              onToggleActionMenu={handleToggleActionMenuRoad}
            />
          ) : (
            <AdminRoadsCards
              roads={paginatedRoads}
              visibleColumns={visibleColumnsRoads}
              onViewRoad={(road) => setViewingRoad(road)}
              onEditRoad={handleOpenEditRoad}
              onDeleteRoad={handleDeleteRoadClick}
            />
          )}

          {/* Roads Pagination */}
          <AdminRoadsInfoPagination
            currentPage={currentRoadPage}
            pageSize={roadPageSize}
            totalItems={filteredRoads.length}
            onPageChange={setCurrentRoadPage}
          />

          {/* Road Form Modal (Add / Edit) */}
          <AdminRoadModal
            isOpen={showRoadModal}
            editingRoad={editingRoad}
            formData={roadForm}
            onClose={handleCloseRoadModal}
            onFormFieldChange={handleRoadFormChange}
            onSubmit={handleSubmitRoad}
          />

          {/* Road Details Modal */}
          <AdminRoadDetailsModal
            road={viewingRoad}
            onClose={() => setViewingRoad(null)}
            onEdit={(road) => {
              setViewingRoad(null);
              handleOpenEditRoad(road);
            }}
          />

          {/* Single Road Delete Confirmation Modal */}
          <AdminRoadsDeleteModal
            isOpen={Boolean(roadToDelete)}
            title="تأكيد حذف الطريق"
            message="هل أنت متأكد من حذف هذا الطريق/المحور نهائياً من قاعدة البيانات؟"
            itemName={roadToDelete?.name}
            isDeleting={isDeletingRoad}
            onConfirm={handleConfirmDeleteRoad}
            onCancel={handleCancelDeleteRoad}
          />

          {/* Bulk Road Delete Confirmation Modal */}
          <AdminRoadsDeleteModal
            isOpen={showRoadBulkDeleteModal}
            title="تأكيد الحذف الجماعي للطرق"
            message={`هل أنت متأكد من حذف (${selectedRoadsCount}) من الطرق والمحاور المحددة؟ لا يمكن التراجع عن هذه الخطوة.`}
            isDeleting={isRoadBulkDeleting}
            onConfirm={handleConfirmRoadBulkDelete}
            onCancel={handleCancelRoadBulkDelete}
          />

          {/* Floating Action Menu for Road Table */}
          <AdminRoadsActionDropdown
            isOpen={Boolean(actionMenuRoad)}
            position={actionMenuRoad ? { top: actionMenuRoad.top, left: actionMenuRoad.left } : null}
            onClose={() => setActionMenuRoad(null)}
            onView={() => {
              if (actionMenuRoad) {
                setViewingRoad(actionMenuRoad.road);
                setActionMenuRoad(null);
              }
            }}
            onEdit={() => {
              if (actionMenuRoad) {
                handleOpenEditRoad(actionMenuRoad.road);
                setActionMenuRoad(null);
              }
            }}
            onDelete={() => {
              if (actionMenuRoad) {
                handleDeleteRoadClick(actionMenuRoad.road);
                setActionMenuRoad(null);
              }
            }}
            deleteLabel="حذف الطريق"
          />

          {/* Floating Columns Dropdown for Roads */}
          <AdminRoadsColumnsDropdown
            isOpen={columnsMenuRoadOpen}
            position={columnsMenuRoadPos}
            visibleColumns={visibleColumnsRoads}
            onToggleColumn={handleToggleColumnRoads}
          />
        </>
      )}

      {/* ===================== NEWS TAB CONTENT ===================== */}
      {activeAdminTab === "news" && (
        <>
          {/* News Filter Bar (Search + News Category Pills) */}
          <AdminNewsFilterBar
            searchQuery={newsSearch}
            onSearchChange={setNewsSearch}
            totalNews={newsData.length}
            filteredCount={filteredNews.length}
            selectedCategory={newsCatFilter}
            onCategoryChange={setNewsCatFilter}
          />

          {/* Controls Bar: Page Size, Columns Menu, Table/Cards Toggle, Bulk Delete */}
          <AdminNewsControlsBar
            pageSize={newsPageSize}
            onPageSizeChange={setNewsPageSize}
            columnsMenuOpen={columnsMenuNewsOpen}
            onToggleColumnsMenu={handleToggleColumnsMenuNews}
            viewMode={newsViewMode}
            onViewModeChange={setNewsViewMode}
            selectedCount={selectedNewsCount}
            onClearSelection={clearNewsSelection}
            onBulkDelete={handleOpenNewsBulkDelete}
          />

          {/* News View: Table or Cards */}
          {newsViewMode === "table" ? (
            <AdminNewsTable
              news={paginatedNews}
              visibleColumns={visibleColumnsNews}
              actionMenuState={actionMenuNews}
              selectedNewsKeys={selectedNewsKeys}
              onToggleSelect={toggleSelectNews}
              onToggleSelectAll={toggleSelectAllNews}
              onEditNews={handleOpenEditNews}
              onToggleActionMenu={handleToggleActionMenuNews}
            />
          ) : (
            <AdminNewsCards
              news={paginatedNews}
              visibleColumns={visibleColumnsNews}
              onEditNews={handleOpenEditNews}
              onDeleteNews={handleDeleteNewsClick}
            />
          )}

          {/* News Pagination */}
          <AdminRoadsInfoPagination
            currentPage={currentNewsPage}
            pageSize={newsPageSize}
            totalItems={filteredNews.length}
            onPageChange={setCurrentNewsPage}
          />

          {/* News Form Modal (Add / Edit) */}
          <AdminNewsModal
            isOpen={showNewsModal}
            editingNews={editingNews}
            formData={newsForm}
            onClose={handleCloseNewsModal}
            onFormFieldChange={handleNewsFormChange}
            onSubmit={handleSubmitNews}
          />

          {/* Single News Delete Confirmation Modal */}
          <AdminRoadsDeleteModal
            isOpen={Boolean(newsToDelete)}
            title="تأكيد حذف النشرة/التنبيه"
            message="هل أنت متأكد من حذف هذا التنبيه نهائياً من قاعدة البيانات؟"
            itemName={newsToDelete?.title}
            isDeleting={isDeletingNews}
            onConfirm={handleConfirmDeleteNews}
            onCancel={handleCancelDeleteNews}
          />

          {/* Bulk News Delete Confirmation Modal */}
          <AdminRoadsDeleteModal
            isOpen={showNewsBulkDeleteModal}
            title="تأكيد الحذف الجماعي للتنبيهات"
            message={`هل أنت متأكد من حذف (${selectedNewsCount}) من التنبيهات المحددة؟ لا يمكن التراجع عن هذه الخطوة.`}
            isDeleting={isNewsBulkDeleting}
            onConfirm={handleConfirmNewsBulkDelete}
            onCancel={handleCancelNewsBulkDelete}
          />

          {/* Floating Action Menu for News Table */}
          <AdminRoadsActionDropdown
            isOpen={Boolean(actionMenuNews)}
            position={actionMenuNews ? { top: actionMenuNews.top, left: actionMenuNews.left } : null}
            onClose={() => setActionMenuNews(null)}
            onEdit={() => {
              if (actionMenuNews) {
                handleOpenEditNews(actionMenuNews.news);
                setActionMenuNews(null);
              }
            }}
            onDelete={() => {
              if (actionMenuNews) {
                handleDeleteNewsClick(actionMenuNews.news);
                setActionMenuNews(null);
              }
            }}
            deleteLabel="حذف التنبيه"
          />

          {/* Floating Columns Dropdown for News */}
          <AdminNewsColumnsDropdown
            isOpen={columnsMenuNewsOpen}
            position={columnsMenuNewsPos}
            visibleColumns={visibleColumnsNews}
            onToggleColumn={handleToggleColumnNews}
          />
        </>
      )}
    </div>
  );
}
