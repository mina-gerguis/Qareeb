"use client";

import React from "react";
import styles from "./admin-maintenance.module.css";
import { useAdminMaintenance } from "./hooks/useAdminMaintenance";
import CustomModal from "@/components/common/Modals";
import {
  MaintenanceHeader,
  MaintenanceStats,
  MaintenanceStatusToast,
  MaintenanceForm,
  MaintenancePagesList,
  MaintenancePreviewModal,
  MaintenanceEditModal,
  MaintenanceBatchLockModal,
} from "./components";

export default function AdminMaintenancePage() {
  const {
    authChecking,
    isSaving,
    fetchLoading,
    statusMessage,
    setStatusMessage,

    // Form
    selectedPath,
    setSelectedPath,
    customPath,
    setCustomPath,
    title,
    setTitle,
    message,
    setMessage,
    isIndefinite,
    setIsIndefinite,
    estimatedEnd,
    setEstimatedEnd,
    applyPreset,
    handleSubmitForm,

    // Filters & Search
    searchQuery,
    setSearchQuery,
    filterTab,
    setFilterTab,
    selectedCategory,
    setSelectedCategory,
    combinedPagesList,
    filteredPages,

    // Stats
    activeCount,
    isGlobalMaintenanceActive,

    // Row & Quick Actions
    handleQuickTogglePageFromList,
    handleToggleGlobalSite,
    handleDeleteRecord,
    handleSaveEdit,

    // Modals
    previewItem,
    setPreviewItem,
    editingItem,
    setEditingItem,
    deletingId,
    setDeletingId,
    showGlobalToggleModal,
    setShowGlobalToggleModal,
    showLockAllExceptModal,
    setShowLockAllExceptModal,
    handleOpenLockAllExcept,

    // Batch Lock Except State
    excludedPaths,
    setExcludedPaths,
    exceptSearchTerm,
    setExceptSearchTerm,
    exceptTitle,
    setExceptTitle,
    exceptMessage,
    setExceptMessage,
    exceptIsIndefinite,
    setExceptIsIndefinite,
    exceptEstimatedEnd,
    setExceptEstimatedEnd,
    handleToggleExcludePath,
    handleSelectAllExceptions,
    handleClearAllExceptions,
    handleLockAllExceptSubmit,
  } = useAdminMaintenance();

  if (authChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <i className="bx bx-loader-alt animate-spin text-4xl text-[var(--color-secondary,#6366f1)] mb-3" />
        <p className="text-sm font-semibold text-[var(--text-secondary)]">
          جاري التحقق من صلاحيات الإدارة...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ── Page Header ── */}
      <MaintenanceHeader
        isGlobalMaintenanceActive={isGlobalMaintenanceActive}
        onOpenLockAllExcept={() => handleOpenLockAllExcept()}
        onOpenGlobalToggleModal={() => setShowGlobalToggleModal(true)}
      />

      {/* ── Status Toast ── */}
      <MaintenanceStatusToast
        status={statusMessage}
        onClose={() => setStatusMessage(null)}
      />

      {/* ── Stat Cards ── */}
      <MaintenanceStats
        totalCount={combinedPagesList.length}
        activeCount={activeCount}
        isGlobalMaintenanceActive={isGlobalMaintenanceActive}
      />

      {/* ── Main Two Column Grid: Form & List ── */}
      <div className={styles.mainGrid}>
        {/* Left Column: Form to Lock / Configure Page Maintenance */}
        <MaintenanceForm
          selectedPath={selectedPath}
          setSelectedPath={setSelectedPath}
          customPath={customPath}
          setCustomPath={setCustomPath}
          title={title}
          setTitle={setTitle}
          message={message}
          setMessage={setMessage}
          isIndefinite={isIndefinite}
          setIsIndefinite={setIsIndefinite}
          estimatedEnd={estimatedEnd}
          setEstimatedEnd={setEstimatedEnd}
          isSaving={isSaving}
          onApplyPreset={applyPreset}
          onSubmit={handleSubmitForm}
          onOpenPreview={setPreviewItem}
        />

        {/* Right Column: Interactive List of All Pages & Maintenance Status */}
        <MaintenancePagesList
          filteredPages={filteredPages}
          fetchLoading={fetchLoading}
          activeCount={activeCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterTab={filterTab}
          setFilterTab={setFilterTab}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onQuickToggle={handleQuickTogglePageFromList}
          onLockAllExceptThis={handleOpenLockAllExcept}
          onEdit={setEditingItem}
          onPreview={setPreviewItem}
          onDelete={setDeletingId}
        />
      </div>

      {/* ── Modal 1: Live Preview Modal ── */}
      <MaintenancePreviewModal
        previewItem={previewItem}
        onClose={() => setPreviewItem(null)}
      />

      {/* ── Modal 2: Edit Maintenance Details Modal ── */}
      <MaintenanceEditModal
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        isSaving={isSaving}
        onSave={handleSaveEdit}
      />

      {/* ── Modal 3: Lock All Except Specific Pages Modal ── */}
      <MaintenanceBatchLockModal
        isOpen={showLockAllExceptModal}
        onClose={() => setShowLockAllExceptModal(false)}
        excludedPaths={excludedPaths}
        setExcludedPaths={setExcludedPaths}
        exceptSearchTerm={exceptSearchTerm}
        setExceptSearchTerm={setExceptSearchTerm}
        exceptTitle={exceptTitle}
        setExceptTitle={setExceptTitle}
        exceptMessage={exceptMessage}
        setExceptMessage={setExceptMessage}
        exceptIsIndefinite={exceptIsIndefinite}
        setExceptIsIndefinite={setExceptIsIndefinite}
        exceptEstimatedEnd={exceptEstimatedEnd}
        setExceptEstimatedEnd={setExceptEstimatedEnd}
        onToggleExcludePath={handleToggleExcludePath}
        onSelectAllExceptions={handleSelectAllExceptions}
        onClearAllExceptions={handleClearAllExceptions}
        onSubmit={handleLockAllExceptSubmit}
        isSaving={isSaving}
      />

      {/* ── Modal 4: Confirm Delete Modal ── */}
      <CustomModal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="تأكيد حذف إعداد الصيانة"
        message="هل أنت متأكد من رغبتك في حذف إعداد وقفل الصيانة لهذه الصفحة؟ سيتم فتح الصفحة تلقائياً لجميع الزوار."
        iconSrc="/images/threeD/trash.webp"
        borderColor="rgba(239, 68, 68, 0.4)"
        primaryButton={{
          label: "نعم، احذف الإعداد",
          onClick: handleDeleteRecord,
          bgColor: "#ef4444",
          icon: <i className="bx bx-trash" />,
        }}
        secondaryButton={{
          label: "تراجع",
          onClick: () => setDeletingId(null),
          bgColor: "var(--btn-cancel)",
          icon: <i className="bx bx-x" />,
        }}
      />

      {/* ── Modal 5: Global Emergency Site Lock Confirmation Modal ── */}
      <CustomModal
        isOpen={showGlobalToggleModal}
        onClose={() => setShowGlobalToggleModal(false)}
        title={
          isGlobalMaintenanceActive
            ? "تأكيد إلغاء قفل كامل الموقع"
            : "تأكيد قفل كامل الموقع للصيانة الطارئة"
        }
        message={
          isGlobalMaintenanceActive
            ? "هل تريد فتح كامل الموقع للزوار وإلغاء شاشة الصيانة العامة؟"
            : "تحذير: سيتم قفل كافة صفحات الموقع (ما عدا لوحة الإدارة) وتحويل جميع الزوار لشاشة الصيانة العامة. هل أنت متأكد؟"
        }
        iconSrc="/images/threeD/alert.webp"
        borderColor={
          isGlobalMaintenanceActive
            ? "rgba(16, 185, 129, 0.4)"
            : "rgba(239, 68, 68, 0.5)"
        }
        primaryButton={{
          label: isGlobalMaintenanceActive ? "فتح الموقع للكل" : "نعم، اقفل كامل الموقع",
          onClick: handleToggleGlobalSite,
          bgColor: isGlobalMaintenanceActive ? "#10b981" : "#ef4444",
          icon: (
            <i
              className={`bx ${
                isGlobalMaintenanceActive ? "bx-lock-open" : "bx-lock-alt"
              }`}
            />
          ),
        }}
        secondaryButton={{
          label: "إلغاء",
          onClick: () => setShowGlobalToggleModal(false),
          bgColor: "var(--btn-cancel)",
          icon: <i className="bx bx-x" />,
        }}
      />
    </div>
  );
}
