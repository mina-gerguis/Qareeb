import { useState, useEffect, useMemo, useCallback } from "react";
import {
  VoucherItem,
  VoucherRedemptionLog,
  VoucherRewardType,
  VoucherStatus,
  VoucherFormState,
  VouchersVisibleColumns,
  ColumnsMenuPosition,
  ActionMenuState,
  VouchersKpiData,
} from "../types";
import {
  VOUCHER_FEATURE_OPTIONS,
  VOUCHER_PAGE_OPTIONS,
  createAdminVouchers,
  deleteAdminVoucher,
  fetchAdminVouchers,
  updateAdminVoucher,
} from "@/lib/vouchers";

export const DEFAULT_VOUCHER_FORM: VoucherFormState = {
  mode: "single",
  code: "",
  batchPrefix: "QRB-",
  batchCount: 5,
  batchName: "",
  title: "",
  description: "",
  rewardType: "promo_balance",
  amount: "50",
  promoExpiryMode: "days_after_redeem",
  promoExpiryDays: 30,
  promoExpiryDate: "",
  featureKey: VOUCHER_FEATURE_OPTIONS[0].key,
  targetPage: VOUCHER_PAGE_OPTIONS[0].value,
  accessDurationUnit: "days",
  accessDurationValue: 7,
  unlimitedUses: false,
  maxUses: 100,
  maxUsesPerUser: 1,
  startsAt: "",
  expiresAt: "",
  audience: "all",
  isActive: true,
};

export function generateRandomCode(prefix = "QRB-") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let part = "";
  for (let i = 0; i < 6; i++) {
    part += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix.toUpperCase()}${part}`;
}

export function useAdminVouchers() {
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [redemptionLogs, setRedemptionLogs] = useState<VoucherRedemptionLog[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [schemaReady, setSchemaReady] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | VoucherRewardType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | VoucherStatus>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination & View Mode
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Columns Visibility
  const [visibleColumns, setVisibleColumns] = useState<VouchersVisibleColumns>({
    code: true,
    title: true,
    reward: true,
    usage: true,
    expiresAt: true,
    status: true,
    actions: true,
  });

  const toggleColumn = (key: keyof VouchersVisibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Columns Dropdown
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [columnsMenuPos, setColumnsMenuPos] = useState<ColumnsMenuPosition | null>(null);

  const toggleColumnsMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (columnsMenuOpen) {
      setColumnsMenuOpen(false);
      setColumnsMenuPos(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const menuWidth = 190;
      let left = rect.left;
      if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 10;
      }
      setColumnsMenuPos({
        top: rect.bottom + 6,
        left: Math.max(10, left),
      });
      setColumnsMenuOpen(true);
    }
  };

  const closeColumnsMenu = () => {
    setColumnsMenuOpen(false);
    setColumnsMenuPos(null);
  };

  // 3-dots Action Menu
  const [actionMenuState, setActionMenuState] = useState<ActionMenuState | null>(null);

  const openActionMenu = (voucher: VoucherItem, rect: DOMRect) => {
    const menuWidth = 175;
    let left = rect.left;
    if (left + menuWidth > window.innerWidth) {
      left = window.innerWidth - menuWidth - 10;
    }
    setActionMenuState({
      voucher,
      top: rect.bottom + 6,
      left: Math.max(10, left),
    });
  };

  const closeActionMenu = () => {
    setActionMenuState(null);
  };

  // Close menus on outside click or scroll
  useEffect(() => {
    const handleGlobalClick = () => {
      closeColumnsMenu();
      closeActionMenu();
    };
    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("scroll", handleGlobalClick, true);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("scroll", handleGlobalClick, true);
    };
  }, []);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<VoucherItem | null>(null);
  const [form, setForm] = useState<VoucherFormState>(DEFAULT_VOUCHER_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  // Redemption Logs Modal State
  const [logsModalVoucher, setLogsModalVoucher] = useState<VoucherItem | null | "all">(null);

  // Load Data
  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetchAdminVouchers();
      setVouchers(res.vouchers);
      setRedemptionLogs(res.redemptions);
      setSchemaReady(res.schemaReady);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // KPIs
  const kpis: VouchersKpiData = useMemo(() => {
    const total = vouchers.length;
    const active = vouchers.filter((v) => v.status === "active").length;
    const totalRedemptions = vouchers.reduce((acc, v) => acc + v.usageCount, 0);
    const promoValueGranted = vouchers
      .filter((v) => v.rewardType === "promo_balance")
      .reduce((acc, v) => acc + (v.rewardConfig.amount ?? 0) * v.usageCount, 0);
    return { total, active, totalRedemptions, promoValueGranted };
  }, [vouchers]);

  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return vouchers.filter((v) => {
      if (typeFilter !== "all" && v.rewardType !== typeFilter) return false;
      if (statusFilter !== "all" && v.status !== statusFilter) return false;
      if (!q) return true;
      return (
        v.code.toLowerCase().includes(q) ||
        v.title.toLowerCase().includes(q) ||
        (v.batchName || "").toLowerCase().includes(q)
      );
    });
  }, [vouchers, searchQuery, typeFilter, statusFilter]);

  // Paginated Vouchers
  const paginatedVouchers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVouchers.slice(start, start + pageSize);
  }, [filteredVouchers, currentPage, pageSize]);

  // Copy Code
  const handleCopyCode = async (item: VoucherItem) => {
    try {
      await navigator.clipboard.writeText(item.code);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // ignore clipboard error
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingVoucher(null);
    setForm({
      ...DEFAULT_VOUCHER_FORM,
      code: generateRandomCode("QRB-"),
    });
    setFormError(null);
    setIsEditorOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: VoucherItem) => {
    setEditingVoucher(item);
    setForm({
      mode: "single",
      code: item.code,
      batchPrefix: "QRB-",
      batchCount: 1,
      batchName: item.batchName || "",
      title: item.title,
      description: item.description || "",
      rewardType: item.rewardType,
      amount: String(item.rewardConfig.amount ?? 50),
      promoExpiryMode: item.rewardConfig.promoExpiryMode || "days_after_redeem",
      promoExpiryDays: item.rewardConfig.promoExpiryDays ?? 30,
      promoExpiryDate: item.rewardConfig.promoExpiryDate || "",
      featureKey: item.rewardConfig.featureKey || VOUCHER_FEATURE_OPTIONS[0].key,
      targetPage: item.rewardConfig.targetPage || VOUCHER_PAGE_OPTIONS[0].value,
      accessDurationUnit: item.rewardConfig.accessDurationUnit || "days",
      accessDurationValue: item.rewardConfig.accessDurationValue ?? 7,
      unlimitedUses: item.maxUses === null,
      maxUses: item.maxUses ?? 100,
      maxUsesPerUser: item.maxUsesPerUser,
      startsAt: item.startsAt ? item.startsAt.slice(0, 10) : "",
      expiresAt: item.expiresAt ? item.expiresAt.slice(0, 10) : "",
      audience: item.audience,
      isActive: item.status === "active",
    });
    setFormError(null);
    setIsEditorOpen(true);
  };

  const closeEditorModal = () => {
    if (saving) return;
    setIsEditorOpen(false);
  };

  // Toggle Voucher Status (Active / Paused)
  const handleToggleStatus = async (item: VoucherItem) => {
    if (item.status !== "active" && item.status !== "paused") return;
    const nextStatus: VoucherStatus = item.status === "active" ? "paused" : "active";
    const res = await updateAdminVoucher(item.id, { status: nextStatus });
    if (res.success && res.item) {
      setVouchers((prev) => prev.map((v) => (v.id === item.id ? res.item! : v)));
    }
  };

  // Delete Voucher
  const handleDeleteVoucher = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه القسيمة نهائياً؟")) return;
    const res = await deleteAdminVoucher(id);
    if (res.success) {
      setVouchers((prev) => prev.filter((v) => v.id !== id));
    }
  };

  // Save Form (Create or Update)
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.title.trim()) {
      setFormError("يرجى إدخال عنوان واضح للقسيمة.");
      return;
    }

    if (
      (form.rewardType === "main_balance" || form.rewardType === "promo_balance") &&
      (isNaN(Number(form.amount)) || Number(form.amount) <= 0)
    ) {
      setFormError("يرجى إدخال مبلغ صحيح أكبر من الصفر.");
      return;
    }

    const featureOpt = VOUCHER_FEATURE_OPTIONS.find((f) => f.key === form.featureKey);
    const pageOpt = VOUCHER_PAGE_OPTIONS.find((p) => p.value === form.targetPage);

    const rewardConfig: VoucherItem["rewardConfig"] = {};
    if (form.rewardType === "main_balance") {
      rewardConfig.amount = Number(form.amount);
    } else if (form.rewardType === "promo_balance") {
      rewardConfig.amount = Number(form.amount);
      rewardConfig.promoExpiryMode = form.promoExpiryMode;
      if (form.promoExpiryMode === "days_after_redeem") {
        rewardConfig.promoExpiryDays = Math.max(1, form.promoExpiryDays);
      } else if (form.promoExpiryMode === "fixed_date") {
        rewardConfig.promoExpiryDate = form.promoExpiryDate || undefined;
      }
    } else if (form.rewardType === "feature_unlock") {
      rewardConfig.featureKey = form.featureKey;
      rewardConfig.featureLabel = featureOpt?.label || form.featureKey;
    } else if (form.rewardType === "page_access") {
      rewardConfig.targetPage = form.targetPage;
      rewardConfig.targetPageLabel = pageOpt?.label || form.targetPage;
      rewardConfig.accessDurationUnit = form.accessDurationUnit;
      rewardConfig.accessDurationValue = Math.max(1, form.accessDurationValue);
    }

    const baseStatus: VoucherStatus = form.isActive ? "active" : "paused";

    setSaving(true);
    try {
      if (editingVoucher) {
        const normalizedCode = form.code.trim().toUpperCase();
        if (!normalizedCode || normalizedCode.length < 4) {
          setFormError("يجب أن يتكون الكود من 4 أحرف أو أرقام على الأقل.");
          return;
        }
        const res = await updateAdminVoucher(editingVoucher.id, {
          code: normalizedCode,
          title: form.title.trim(),
          description: form.description.trim(),
          rewardType: form.rewardType,
          rewardConfig,
          status: baseStatus,
          maxUses: form.unlimitedUses ? null : Math.max(1, form.maxUses),
          maxUsesPerUser: Math.max(1, form.maxUsesPerUser),
          startsAt: form.startsAt ? `${form.startsAt}T00:00:00Z` : null,
          expiresAt: form.expiresAt ? `${form.expiresAt}T23:59:59Z` : null,
          audience: form.audience,
          batchName: form.batchName.trim() || null,
        });
        if (!res.success || !res.item) {
          setFormError(res.message || "تعذر حفظ التعديلات.");
          return;
        }
        setVouchers((prev) => prev.map((v) => (v.id === editingVoucher.id ? res.item! : v)));
        setIsEditorOpen(false);
        return;
      }

      if (form.mode === "batch") {
        const count = Math.min(25, Math.max(2, form.batchCount));
        const payloads = Array.from({ length: count }).map(() => ({
          code: generateRandomCode(form.batchPrefix || "QRB-"),
          title: form.title.trim(),
          description: form.description.trim(),
          rewardType: form.rewardType,
          rewardConfig,
          status: baseStatus,
          maxUses: form.unlimitedUses ? null : Math.max(1, form.maxUses),
          maxUsesPerUser: Math.max(1, form.maxUsesPerUser),
          startsAt: form.startsAt ? `${form.startsAt}T00:00:00Z` : null,
          expiresAt: form.expiresAt ? `${form.expiresAt}T23:59:59Z` : null,
          audience: form.audience,
          batchName: form.batchName.trim() || `دفعة ${new Date().toLocaleDateString("ar-EG")}`,
        }));
        const res = await createAdminVouchers(payloads);
        if (!res.success) {
          setFormError(res.message || "تعذر إصدار الدفعة.");
          return;
        }
        setVouchers((prev) => [...res.items, ...prev]);
      } else {
        const normalizedCode = (form.code || generateRandomCode()).trim().toUpperCase();
        if (normalizedCode.length < 4) {
          setFormError("يجب أن يتكون الكود من 4 أحرف أو أرقام على الأقل.");
          return;
        }
        const res = await createAdminVouchers([
          {
            code: normalizedCode,
            title: form.title.trim(),
            description: form.description.trim(),
            rewardType: form.rewardType,
            rewardConfig,
            status: baseStatus,
            maxUses: form.unlimitedUses ? null : Math.max(1, form.maxUses),
            maxUsesPerUser: Math.max(1, form.maxUsesPerUser),
            startsAt: form.startsAt ? `${form.startsAt}T00:00:00Z` : null,
            expiresAt: form.expiresAt ? `${form.expiresAt}T23:59:59Z` : null,
            audience: form.audience,
            batchName: form.batchName.trim() || null,
          },
        ]);
        if (!res.success) {
          setFormError(res.message || "تعذر إصدار القسيمة.");
          return;
        }
        setVouchers((prev) => [...res.items, ...prev]);
      }

      setIsEditorOpen(false);
    } finally {
      setSaving(false);
    }
  };

  // Visible Redemption Logs
  const visibleLogs = useMemo(() => {
    if (!logsModalVoucher || logsModalVoucher === "all") return redemptionLogs;
    return redemptionLogs.filter((l) => l.voucherId === logsModalVoucher.id);
  }, [logsModalVoucher, redemptionLogs]);

  const openLogsModal = (voucher: VoucherItem | "all") => {
    setLogsModalVoucher(voucher);
  };

  const closeLogsModal = () => {
    setLogsModalVoucher(null);
  };

  return {
    vouchers,
    redemptionLogs,
    loadingData,
    schemaReady,
    saving,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
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
    actionMenuState,
    openActionMenu,
    closeActionMenu,
    copiedId,
    kpis,
    filteredVouchers,
    paginatedVouchers,
    loadData,
    handleCopyCode,
    handleToggleStatus,
    handleDeleteVoucher,
    // Form & Editor
    isEditorOpen,
    editingVoucher,
    form,
    setForm,
    formError,
    openCreateModal,
    openEditModal,
    closeEditorModal,
    handleSaveForm,
    // Logs Modal
    logsModalVoucher,
    visibleLogs,
    openLogsModal,
    closeLogsModal,
  };
}
