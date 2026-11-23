"use client";

import React from "react";
import styles from "./subscriptions.module.css";
import { useAdminSubscriptions } from "./hooks/useAdminSubscriptions";
import {
  AdminSubscriptionsHeader,
  AdminSubscriptionsKpis,
  AdminSubscriptionsUsersTab,
  AdminSubscriptionsPlansTab,
  AdminSubscriptionsPromotionsTab,
  AdminSubscriptionsColumnsDropdown,
  AdminSubscriptionsUserActionDropdown,
  AdminUserSubscriptionModal,
  AdminPlanEditorModal,
  AdminOfferEditorModal,
} from "./components";

export default function AdminSubscriptionsPage() {
  const {
    isAdmin,
    authChecking,
    activeTab,
    handleTabChange,
    statusMessage,
    updating,
    kpis,
    plans,
    loadingPlans,
    selectedPlan,
    planForm,
    setPlanForm,
    handleEditPlan,
    closePlanModal,
    handleSavePlan,
    users,
    filteredUsers,
    paginatedUsers,
    loadingUsers,
    searchQuery,
    setSearchQuery,
    tierFilter,
    setTierFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    viewMode,
    setViewMode,
    visibleColumns,
    toggleColumn,
    columnsMenuOpen,
    columnsMenuPos,
    toggleColumnsMenu,
    closeColumnsMenu,
    userActionMenuState,
    openUserActionMenu,
    closeUserActionMenu,
    selectedUser,
    userForm,
    setUserForm,
    handleEditUserSubscription,
    closeUserModal,
    handleSaveUserSubscription,
    handleQuickExtendUser,
    addPresetDaysToModalEnd,
    trialConfig,
    setTrialConfig,
    trialPreset,
    setTrialPreset,
    loadingTrial,
    savingTrial,
    handleSaveTrial,
    openOffers,
    loadingOffers,
    savingOffer,
    isOfferModalOpen,
    selectedOffer,
    offerForm,
    setOfferForm,
    handleOpenAddOfferModal,
    handleEditOffer,
    closeOfferModal,
    handleSaveOffer,
    handleToggleOfferStatus,
    handleDeleteOffer,
    refreshAllData,
  } = useAdminSubscriptions();

  if (authChecking) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px", color: "var(--text-secondary, #94a3b8)" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid var(--border-glass, rgba(255,255,255,0.1))",
            borderTop: "3px solid var(--color-primary, #6366f1)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>
          جاري التحقق من الصلاحيات والبيانات...
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <i className="bx bx-lock-alt" style={{ fontSize: "4rem", color: "#f87171" }} />
        <h2 style={{ marginTop: "16px", color: "var(--color-fg, #ffffff)" }}>
          عفواً، الدخول غير مصرح به
        </h2>
        <p style={{ color: "var(--text-secondary, #94a3b8)" }}>
          هذه الصفحة مخصصة لمديري النظام فقط.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className={styles.primaryBtn}
          style={{ marginTop: "16px" }}
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className={styles.subscriptionsContainer}>
      {/* Header & Tabs */}
      <AdminSubscriptionsHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        loading={loadingUsers || loadingPlans || loadingOffers || loadingTrial}
        onRefresh={refreshAllData}
        usersCount={users.length}
        plansCount={plans.length}
        isTrialActive={trialConfig.is_active}
        activeOffersCount={kpis.activeOffersCount}
      />

      {/* KPI Cards */}
      <AdminSubscriptionsKpis kpis={kpis} />

      {/* Alert Status Banner */}
      {statusMessage && (
        <div
          className={`${styles.alert} ${
            statusMessage.type === "success" ? styles.alertSuccess : styles.alertError
          }`}
        >
          <i
            className={`bx ${
              statusMessage.type === "success" ? "bx-check-circle" : "bx-error-circle"
            }`}
            style={{ fontSize: "1.3rem" }}
          />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* TAB 1: Users Subscriptions */}
      {activeTab === "users" && (
        <AdminSubscriptionsUsersTab
          users={users}
          filteredUsers={filteredUsers}
          paginatedUsers={paginatedUsers}
          loading={loadingUsers}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tierFilter={tierFilter}
          onTierFilterChange={setTierFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          visibleColumns={visibleColumns}
          columnsMenuOpen={columnsMenuOpen}
          onToggleColumnsMenu={toggleColumnsMenu}
          onEditUser={handleEditUserSubscription}
          onOpenActionMenu={openUserActionMenu}
        />
      )}

      {/* TAB 2: Subscription Plans Manager */}
      {activeTab === "plans" && (
        <AdminSubscriptionsPlansTab
          plans={plans}
          loading={loadingPlans}
          onEditPlan={handleEditPlan}
        />
      )}

      {/* TAB 3: Promotions & Offers Manager */}
      {activeTab === "promotions" && (
        <AdminSubscriptionsPromotionsTab
          trialConfig={trialConfig}
          setTrialConfig={setTrialConfig}
          trialPreset={trialPreset}
          setTrialPreset={setTrialPreset}
          savingTrial={savingTrial}
          onSaveTrial={handleSaveTrial}
          openOffers={openOffers}
          loadingOffers={loadingOffers}
          onOpenAddOffer={handleOpenAddOfferModal}
          onEditOffer={handleEditOffer}
          onToggleOfferStatus={handleToggleOfferStatus}
          onDeleteOffer={handleDeleteOffer}
        />
      )}

      {/* Columns Dropdown (Fixed Viewport Position) */}
      <AdminSubscriptionsColumnsDropdown
        isOpen={columnsMenuOpen}
        position={columnsMenuPos}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
      />

      {/* User 3-Dots Action Dropdown (Fixed Viewport Position) */}
      <AdminSubscriptionsUserActionDropdown
        actionMenu={userActionMenuState}
        onClose={closeUserActionMenu}
        onEdit={handleEditUserSubscription}
        onQuickExtend={handleQuickExtendUser}
      />

      {/* Modal: Edit User Subscription */}
      <AdminUserSubscriptionModal
        isOpen={!!selectedUser}
        user={selectedUser}
        form={userForm}
        setForm={setUserForm}
        updating={updating}
        onClose={closeUserModal}
        onSubmit={handleSaveUserSubscription}
        onAddPresetDays={addPresetDaysToModalEnd}
      />

      {/* Modal: Edit Subscription Plan */}
      <AdminPlanEditorModal
        isOpen={!!selectedPlan}
        plan={selectedPlan}
        form={planForm}
        setForm={setPlanForm}
        updating={updating}
        onClose={closePlanModal}
        onSubmit={handleSavePlan}
      />

      {/* Modal: Add / Edit Open Page Offer */}
      <AdminOfferEditorModal
        isOpen={isOfferModalOpen}
        offer={selectedOffer}
        form={offerForm}
        setForm={setOfferForm}
        saving={savingOffer}
        onClose={closeOfferModal}
        onSubmit={handleSaveOffer}
      />
    </div>
  );
}
