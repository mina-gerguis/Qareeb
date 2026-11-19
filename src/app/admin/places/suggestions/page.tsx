"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import suggestionsStyles from "./admin-suggestions.module.css";
import { useAdminSuggestions } from "./hooks/useAdminSuggestions";
import {
  AdminSuggestionsLoading,
  AdminSuggestionsNotifications,
  AdminSuggestionsHeader,
  AdminSuggestionsFilterBar,
  AdminSuggestionsControlsBar,
  AdminSuggestionsTable,
  AdminSuggestionsCards,
  AdminSuggestionsPagination,
  AdminSuggestionDetailsModal,
  AdminSuggestionRejectModal,
  AdminSuggestionDeleteModal,
  AdminProposerProfileModal,
  AdminSuggestionsActionDropdown,
  AdminSuggestionsColumnsDropdown,
} from "./components";

export default function PlacesSuggestionsPage() {
  const {
    isAdmin,
    loading,
    notification,
    proposals,
    filteredProposals,
    paginatedProposals,
    statusTab,
    setStatusTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    statusCounts,
    categoryCounts,

    // Layout View & Page
    viewMode,
    setViewMode,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalItems,
    selectedIds,
    toggleSelect,
    toggleSelectAll,

    // Columns
    visibleColumns,
    setVisibleColumns,
    isColumnsMenuOpen,
    setIsColumnsMenuOpen,
    columnsMenuPos,
    handleToggleColumnsMenu,

    // Actions & Modals
    actionMenu,
    setActionMenu,
    handleToggleActionMenu,
    detailsModal,
    setDetailsModal,
    rejectModal,
    setRejectModal,
    rejectionReason,
    setRejectionReason,
    deleteModal,
    setDeleteModal,
    userProfileModal,
    setUserProfileModal,
    isProcessing,
    approveProposal,
    confirmReject,
    confirmDelete,
    fetchProposals,
  } = useAdminSuggestions();

  // Close menus on outside click or scroll
  useEffect(() => {
    const handleClose = () => {
      setActionMenu(null);
      setIsColumnsMenuOpen(false);
    };
    window.addEventListener("click", handleClose);
    window.addEventListener("scroll", handleClose, { passive: true });
    return () => {
      window.removeEventListener("click", handleClose);
      window.removeEventListener("scroll", handleClose);
    };
  }, [setActionMenu, setIsColumnsMenuOpen]);

  // Bulk Delete Trigger
  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setDeleteModal({
      type: "bulk",
      ids: Array.from(selectedIds),
    });
  };

  if (loading) {
    return <AdminSuggestionsLoading />;
  }

  if (!isAdmin) {
    return (
      <div
        className={suggestionsStyles.suggestionsContainer}
        style={{ paddingTop: "120px", textAlign: "center", color: "#ff3b30" }}
      >
        عفواً، لا تملك صلاحية الوصول لهذه الصفحة.
      </div>
    );
  }

  return (
    <div
      className={clsx(
        suggestionsStyles.suggestionsContainer,
        "app-container"
      )}
      style={{
        padding: "120px 10px 40px",
        maxWidth: "100%",
        width: "100%",
      }}
    >
      {/* Notifications Banner */}
      <AdminSuggestionsNotifications notification={notification} />

      {/* Header with Title, Status Segmented Tabs, and Refresh */}
      <AdminSuggestionsHeader
        statusTab={statusTab}
        onStatusTabChange={setStatusTab}
        statusCounts={statusCounts}
        onRefresh={fetchProposals}
        isProcessing={isProcessing}
      />

      {/* Filter Bar with Search and Categories */}
      <AdminSuggestionsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalProposals={proposals.length}
        filteredCount={filteredProposals.length}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* Controls Bar (Pagination size, Columns toggle, View mode, Bulk actions) */}
      <div style={{ position: "relative" }}>
        <AdminSuggestionsControlsBar
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          columnsMenuOpen={isColumnsMenuOpen}
          onToggleColumnsMenu={handleToggleColumnsMenu}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedCount={selectedIds.size}
          onClearSelection={toggleSelectAll}
          onBulkDelete={handleBulkDelete}
        />

        {/* Floating Column Visibility Menu */}
        <AdminSuggestionsColumnsDropdown
          isOpen={isColumnsMenuOpen}
          position={columnsMenuPos}
          visibleColumns={visibleColumns}
          onToggleColumn={(key) =>
            setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
          }
        />
      </div>

      {/* Main Content: Table or Cards */}
      {viewMode === "table" ? (
        <AdminSuggestionsTable
          proposals={paginatedProposals}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onViewDetails={setDetailsModal}
          onViewProposer={(userProfile, userId) =>
            setUserProfileModal(userProfile || { id: userId })
          }
          onToggleActionMenu={handleToggleActionMenu}
          activeActionProposalId={actionMenu?.key}
        />
      ) : (
        <AdminSuggestionsCards
          proposals={paginatedProposals}
          visibleColumns={visibleColumns}
          onViewDetails={setDetailsModal}
          onViewProposer={(userProfile, userId) =>
            setUserProfileModal(userProfile || { id: userId })
          }
          onApprove={approveProposal}
          onReject={(prop) => {
            setRejectModal(prop);
            setRejectionReason("");
          }}
          onDelete={(prop) => setDeleteModal({ type: "single", proposal: prop })}
          isProcessing={isProcessing}
        />
      )}

      {/* Pagination Footer */}
      <AdminSuggestionsPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />

      {/* Floating 3-Dots Action Menu */}
      <AdminSuggestionsActionDropdown
        actionMenuState={actionMenu}
        onClose={() => setActionMenu(null)}
        onViewDetails={setDetailsModal}
        onViewProposer={(userProfile, userId) =>
          setUserProfileModal(userProfile || { id: userId })
        }
        onApprove={approveProposal}
        onReject={(prop) => {
          setRejectModal(prop);
          setRejectionReason("");
        }}
        onDelete={(prop) => setDeleteModal({ type: "single", proposal: prop })}
      />

      {/* Proposal Full Details Modal */}
      <AdminSuggestionDetailsModal
        proposal={detailsModal}
        onClose={() => setDetailsModal(null)}
        onViewProposer={(userProfile, userId) => {
          setDetailsModal(null);
          setUserProfileModal(userProfile || { id: userId });
        }}
        onApprove={approveProposal}
        onReject={(prop) => {
          setDetailsModal(null);
          setRejectModal(prop);
          setRejectionReason("");
        }}
        onDelete={(prop) => {
          setDetailsModal(null);
          setDeleteModal({ type: "single", proposal: prop });
        }}
        isProcessing={isProcessing}
      />

      {/* Rejection Reason Modal */}
      <AdminSuggestionRejectModal
        proposal={rejectModal}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        isProcessing={isProcessing}
        onConfirm={confirmReject}
        onCancel={() => {
          setRejectModal(null);
          setRejectionReason("");
        }}
      />

      {/* Single & Bulk Delete Confirmation Modal */}
      <AdminSuggestionDeleteModal
        deleteModal={deleteModal}
        isProcessing={isProcessing}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal(null)}
      />

      {/* Proposer Full Profile Modal */}
      <AdminProposerProfileModal
        userProfile={userProfileModal}
        onClose={() => setUserProfileModal(null)}
      />
    </div>
  );
}
