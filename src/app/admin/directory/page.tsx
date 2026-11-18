"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import directoryStyles from "./admin-directory.module.css";
import { useAdminDirectory } from "./hooks/useAdminDirectory";
import {
  AdminDirectoryLoading,
  AdminDirectoryNotifications,
  AdminDirectoryHeader,
  AdminPhonesFilterBar,
  AdminCodesFilterBar,
  AdminDirectoryControlsBar,
  AdminPhonesTable,
  AdminPhonesCards,
  AdminCodesTable,
  AdminCodesCards,
  AdminDirectoryPagination,
  AdminPhoneModal,
  AdminCodeModal,
  AdminPhoneDetailsModal,
  AdminCodeDetailsModal,
  AdminDirectoryDeleteModal,
  AdminDirectoryActionDropdown,
  AdminDirectoryColumnsDropdown,
} from "./components";

interface AdminDirectoryPageProps {
  isSubComponent?: boolean;
}

export default function AdminDirectoryPage({
  isSubComponent = false,
}: AdminDirectoryPageProps) {
  const {
    isAdmin,
    loading,
    notification,
    activeTab,
    setActiveTab,

    // Phones
    phones,
    filteredPhones,
    paginatedPhones,
    existingSpecialties,
    specialtyIcons,
    specialtyCounts,
    selectedSpecialtyTab,
    setSelectedSpecialtyTab,
    selectedPhoneIds,
    toggleSelectPhone,
    toggleSelectAllPhones,
    phoneFormData,
    setPhoneFormData,
    editingPhone,
    isPhoneModalOpen,
    openAddPhoneModal,
    openEditPhoneModal,
    closePhoneModal,
    savePhone,

    // Telecom Codes
    codes,
    filteredCodes,
    paginatedCodes,
    existingSections,
    companyCounts,
    selectedCompanyTab,
    setSelectedCompanyTab,
    selectedCodeIds,
    toggleSelectCode,
    toggleSelectAllCodes,
    codeFormData,
    setCodeFormData,
    editingCode,
    isCodeModalOpen,
    openAddCodeModal,
    openEditCodeModal,
    closeCodeModal,
    saveCode,

    // Shared State
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,
    isSubmitting,
    isDeleting,

    // Columns
    visiblePhoneColumns,
    setVisiblePhoneColumns,
    visibleCodeColumns,
    setVisibleCodeColumns,
    isColumnsMenuOpen,
    setIsColumnsMenuOpen,
    columnsMenuPos,
    handleToggleColumnsMenu,

    // Floating & Modals
    actionMenu,
    setActionMenu,
    handleTogglePhoneActionMenu,
    handleToggleCodeActionMenu,
    detailsModal,
    setDetailsModal,
    deleteModal,
    setDeleteModal,
    confirmDelete,
  } = useAdminDirectory(isSubComponent);

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

  // Bulk Delete triggers
  const handleBulkDelete = () => {
    if (activeTab === "phones") {
      if (selectedPhoneIds.size === 0) return;
      setDeleteModal({
        type: "bulk-phones",
        ids: Array.from(selectedPhoneIds),
      });
    } else {
      if (selectedCodeIds.size === 0) return;
      setDeleteModal({
        type: "bulk-codes",
        ids: Array.from(selectedCodeIds),
      });
    }
  };

  if (!isSubComponent && loading) {
    return <AdminDirectoryLoading />;
  }

  if (!isSubComponent && !isAdmin) {
    return (
      <div
        className={directoryStyles.directoryContainer}
        style={{ paddingTop: "120px", textAlign: "center", color: "#ff3b30" }}
      >
        عفواً، لا تملك صلاحية الوصول لهذه الصفحة.
      </div>
    );
  }

  return (
    <div
      className={clsx(
        directoryStyles.directoryContainer,
        !isSubComponent && "app-container"
      )}
      style={
        !isSubComponent
          ? { padding: "120px 10px 40px", maxWidth: "100%", width: "100%" }
          : undefined
      }
    >
      {/* Notifications */}
      <AdminDirectoryNotifications notification={notification} />

      {/* Header with Title and Add Buttons */}
      <AdminDirectoryHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearchQuery("");
        }}
        onAddPhoneClick={openAddPhoneModal}
        onAddCodeClick={openAddCodeModal}
        phonesCount={phones.length}
        codesCount={codes.length}
      />

      {/* Filter Bars depending on active tab */}
      {activeTab === "phones" ? (
        <AdminPhonesFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalPhones={phones.length}
          filteredCount={filteredPhones.length}
          selectedSpecialtyTab={selectedSpecialtyTab}
          onSpecialtyChange={setSelectedSpecialtyTab}
          existingSpecialties={existingSpecialties}
          specialtyCounts={specialtyCounts}
          specialtyIcons={specialtyIcons}
          hasOtherEntries={phones.some(
            (e) => !e.specialty || !e.specialty.trim()
          )}
        />
      ) : (
        <AdminCodesFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCodes={codes.length}
          filteredCount={filteredCodes.length}
          selectedCompanyTab={selectedCompanyTab}
          onCompanyChange={setSelectedCompanyTab}
          companyCounts={companyCounts}
        />
      )}

      {/* Controls Bar (Pagination size, View mode, Columns visibility, Bulk delete) */}
      <div style={{ position: "relative" }}>
        <AdminDirectoryControlsBar
          activeTab={activeTab}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          columnsMenuOpen={isColumnsMenuOpen}
          onToggleColumnsMenu={handleToggleColumnsMenu}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedCount={
            activeTab === "phones" ? selectedPhoneIds.size : selectedCodeIds.size
          }
          onClearSelection={() => {
            if (activeTab === "phones") toggleSelectAllPhones();
            else toggleSelectAllCodes();
          }}
          onBulkDelete={handleBulkDelete}
        />

        {/* Floating Column Visibility Menu */}
        <AdminDirectoryColumnsDropdown
          isOpen={isColumnsMenuOpen}
          position={columnsMenuPos}
          activeTab={activeTab}
          visiblePhoneColumns={visiblePhoneColumns}
          onTogglePhoneColumn={(key) =>
            setVisiblePhoneColumns((prev) => ({ ...prev, [key]: !prev[key] }))
          }
          visibleCodeColumns={visibleCodeColumns}
          onToggleCodeColumn={(key) =>
            setVisibleCodeColumns((prev) => ({ ...prev, [key]: !prev[key] }))
          }
        />
      </div>

      {/* Main Content: Tables or Cards */}
      {activeTab === "phones" ? (
        viewMode === "table" ? (
          <AdminPhonesTable
            phones={paginatedPhones}
            visibleColumns={visiblePhoneColumns}
            selectedIds={selectedPhoneIds}
            onToggleSelect={toggleSelectPhone}
            onToggleSelectAll={toggleSelectAllPhones}
            onViewPhone={(phone) => setDetailsModal({ type: "phone", item: phone })}
            onToggleActionMenu={handleTogglePhoneActionMenu}
            activeActionPhoneId={
              actionMenu?.type === "phone" ? actionMenu.key : undefined
            }
          />
        ) : (
          <AdminPhonesCards
            phones={paginatedPhones}
            visibleColumns={visiblePhoneColumns}
            onViewPhone={(phone) => setDetailsModal({ type: "phone", item: phone })}
            onEditPhone={openEditPhoneModal}
            onDeletePhone={(phone) =>
              setDeleteModal({ type: "phone", item: phone })
            }
          />
        )
      ) : viewMode === "table" ? (
        <AdminCodesTable
          codes={paginatedCodes}
          visibleColumns={visibleCodeColumns}
          selectedIds={selectedCodeIds}
          onToggleSelect={toggleSelectCode}
          onToggleSelectAll={toggleSelectAllCodes}
          onViewCode={(code) => setDetailsModal({ type: "code", item: code })}
          onToggleActionMenu={handleToggleCodeActionMenu}
          activeActionCodeId={
            actionMenu?.type === "code" ? actionMenu.key : undefined
          }
        />
      ) : (
        <AdminCodesCards
          codes={paginatedCodes}
          visibleColumns={visibleCodeColumns}
          onViewCode={(code) => setDetailsModal({ type: "code", item: code })}
          onEditCode={openEditCodeModal}
          onDeleteCode={(code) =>
            setDeleteModal({ type: "code", item: code })
          }
        />
      )}

      {/* Pagination Footer */}
      <AdminDirectoryPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        itemLabel={activeTab === "phones" ? "رقم" : "كود"}
      />

      {/* Floating Action Menu */}
      <AdminDirectoryActionDropdown
        actionMenuState={actionMenu}
        onClose={() => setActionMenu(null)}
        onViewPhone={(phone) => setDetailsModal({ type: "phone", item: phone })}
        onEditPhone={openEditPhoneModal}
        onDeletePhone={(phone) =>
          setDeleteModal({ type: "phone", item: phone })
        }
        onViewCode={(code) => setDetailsModal({ type: "code", item: code })}
        onEditCode={openEditCodeModal}
        onDeleteCode={(code) =>
          setDeleteModal({ type: "code", item: code })
        }
      />

      {/* Phone Add/Edit Modal */}
      <AdminPhoneModal
        isOpen={isPhoneModalOpen}
        editingItem={editingPhone}
        formData={phoneFormData}
        isSubmitting={isSubmitting}
        existingSpecialties={existingSpecialties}
        onClose={closePhoneModal}
        onFormFieldChange={(field, val) =>
          setPhoneFormData((prev) => ({ ...prev, [field]: val }))
        }
        onSubmit={savePhone}
      />

      {/* Code Add/Edit Modal */}
      <AdminCodeModal
        isOpen={isCodeModalOpen}
        editingItem={editingCode}
        formData={codeFormData}
        isSubmitting={isSubmitting}
        existingSections={existingSections}
        onClose={closeCodeModal}
        onFormFieldChange={(field, val) =>
          setCodeFormData((prev) => ({ ...prev, [field]: val }))
        }
        onSubmit={saveCode}
      />

      {/* Phone Details Modal */}
      <AdminPhoneDetailsModal
        phone={detailsModal?.type === "phone" ? detailsModal.item : null}
        onClose={() => setDetailsModal(null)}
        onEdit={(phone) => {
          setDetailsModal(null);
          openEditPhoneModal(phone);
        }}
      />

      {/* Code Details Modal */}
      <AdminCodeDetailsModal
        code={detailsModal?.type === "code" ? detailsModal.item : null}
        onClose={() => setDetailsModal(null)}
        onEdit={(code) => {
          setDetailsModal(null);
          openEditCodeModal(code);
        }}
      />

      {/* Delete / Bulk Delete Confirmation Modal */}
      <AdminDirectoryDeleteModal
        deleteModal={deleteModal}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal(null)}
      />
    </div>
  );
}
