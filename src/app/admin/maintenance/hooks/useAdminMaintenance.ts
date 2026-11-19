"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  MaintenanceItem,
  SITE_PAGES_LIST,
  PageInfo,
  getPageInfo,
} from "@/lib/maintenance";
import {
  MaintenanceFilterTab,
  MaintenanceCategory,
  StatusMessage,
  MaintenancePageItem,
  PresetType,
} from "../types";
import { PRESET_TEMPLATES } from "../constants";

export function useAdminMaintenance() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Maintenance records state
  const [records, setRecords] = useState<MaintenanceItem[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  // Form states for creating / updating maintenance
  const [selectedPath, setSelectedPath] = useState<string>("/places");
  const [customPath, setCustomPath] = useState<string>("");
  const [title, setTitle] = useState<string>("الصفحة قيد الصيانة والتحديث");
  const [message, setMessage] = useState<string>(
    "نعمل حالياً على تطوير وتحديث هذه الصفحة لتقديم خدمة وتجربة أفضل. سنعود قريباً!"
  );
  const [isIndefinite, setIsIndefinite] = useState<boolean>(true);
  const [estimatedEnd, setEstimatedEnd] = useState<string>("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterTab, setFilterTab] = useState<MaintenanceFilterTab>("all");
  const [selectedCategory, setSelectedCategory] = useState<MaintenanceCategory>("all");

  // Modals
  const [previewItem, setPreviewItem] = useState<MaintenanceItem | null>(null);
  const [editingItem, setEditingItem] = useState<MaintenanceItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showGlobalToggleModal, setShowGlobalToggleModal] = useState<boolean>(false);
  const [showLockAllExceptModal, setShowLockAllExceptModal] = useState<boolean>(false);

  // Lock All Except Custom Selection State
  const [excludedPaths, setExcludedPaths] = useState<string[]>(["/"]);
  const [exceptSearchTerm, setExceptSearchTerm] = useState<string>("");
  const [exceptTitle, setExceptTitle] = useState<string>("الصفحة قيد الصيانة والتحديث");
  const [exceptMessage, setExceptMessage] = useState<string>(
    "نعمل حالياً على تطوير وتحديث هذه الصفحة لتقديم خدمة وتجربة أفضل. سنعود قريباً!"
  );
  const [exceptIsIndefinite, setExceptIsIndefinite] = useState<boolean>(true);
  const [exceptEstimatedEnd, setExceptEstimatedEnd] = useState<string>("");

  // Fetch records
  const fetchMaintenanceRecords = useCallback(async (showLoader = true) => {
    if (!supabase) return;
    if (showLoader) setFetchLoading(true);
    try {
      const { data, error } = await supabase
        .from("page_maintenance")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Could not load page_maintenance table:", error);
      } else {
        setRecords(data || []);
      }
    } catch (err) {
      console.error("Error fetching maintenance records:", err);
    } finally {
      if (showLoader) setFetchLoading(false);
    }
  }, []);

  // Auth & Admin verification
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const checkAdmin = async () => {
      if (!supabase) return;
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (error || !profileData?.is_admin) {
          setIsAdmin(false);
          router.push("/");
        } else {
          setIsAdmin(true);
          fetchMaintenanceRecords();
        }
      } catch (err) {
        setIsAdmin(false);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAdmin();
  }, [user, authLoading, router, fetchMaintenanceRecords]);

  // Real-time listener for page_maintenance table
  useEffect(() => {
    if (!supabase || !isAdmin) return;

    const channel = supabase
      .channel("public:page_maintenance_admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "page_maintenance" },
        () => {
          fetchMaintenanceRecords(false);
        }
      )
      .subscribe();

    return () => {
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [isAdmin, fetchMaintenanceRecords]);

  // Preset quick templates
  const applyPreset = useCallback((presetType: PresetType) => {
    const template = PRESET_TEMPLATES.find((t) => t.id === presetType);
    if (template) {
      setTitle(template.title);
      setMessage(template.message);
    }
  }, []);

  // Submit new or update maintenance rule
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !isAdmin) return;

    const targetPath = selectedPath === "custom" ? customPath.trim() : selectedPath;
    if (!targetPath) {
      setStatusMessage({ text: "يرجى تحديد مسار الصفحة أو إدخال مسار مخصص", type: "error" });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payload = {
        page_path: targetPath,
        title: title.trim() || "الصفحة قيد الصيانة والتحديث",
        message: message.trim() || "نعمل حالياً على تطوير وتحديث هذه الصفحة.",
        is_active: true,
        estimated_end: !isIndefinite && estimatedEnd ? new Date(estimatedEnd).toISOString() : null,
        created_by: user?.id || null,
        updated_at: new Date().toISOString(),
      };

      // Check if a record with this path already exists
      const existing = records.find((r) => r.page_path === targetPath);

      if (existing) {
        const { error } = await supabase
          .from("page_maintenance")
          .update(payload)
          .eq("id", existing.id);

        if (error) throw error;
        setStatusMessage({
          text: `تم تحديث وتفعيل وضع الصيانة لصفحة (${getPageInfo(targetPath).label}) بنجاح!`,
          type: "success",
        });
      } else {
        const { error } = await supabase.from("page_maintenance").insert([payload]);
        if (error) throw error;
        setStatusMessage({
          text: `تم قفل وتفعيل الصيانة لصفحة (${getPageInfo(targetPath).label}) بنجاح!`,
          type: "success",
        });
      }

      await fetchMaintenanceRecords(false);

      if (selectedPath !== "custom") {
        setCustomPath("");
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        text: `حدث خطأ أثناء حفظ الصيانة: ${err?.message || "يرجى التأكد من إنشاء الجدول في Supabase"}`,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle maintenance status (Active / Inactive)
  const handleToggleActive = async (record: MaintenanceItem) => {
    if (!supabase || !isAdmin) return;
    try {
      const nextState = !record.is_active;
      const { error } = await supabase
        .from("page_maintenance")
        .update({
          is_active: nextState,
          updated_at: new Date().toISOString(),
        })
        .eq("id", record.id);

      if (error) throw error;

      setRecords((prev) =>
        prev.map((r) => (r.id === record.id ? { ...r, is_active: nextState } : r))
      );

      setStatusMessage({
        text: nextState
          ? `تم تفعيل الصيانة لـ (${getPageInfo(record.page_path).label})`
          : `تم فتح صفحة (${getPageInfo(record.page_path).label}) للزوار بنجاح!`,
        type: "success",
      });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: "فشل تحديث الحالة", type: "error" });
    }
  };

  // Toggle quick maintenance for whole site ('all')
  const handleToggleGlobalSite = async () => {
    if (!supabase || !isAdmin) return;
    const globalRecord = records.find((r) => r.page_path === "all");
    const isCurrentlyActive = globalRecord?.is_active || false;

    try {
      if (globalRecord) {
        const { error } = await supabase
          .from("page_maintenance")
          .update({
            is_active: !isCurrentlyActive,
            updated_at: new Date().toISOString(),
          })
          .eq("id", globalRecord.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("page_maintenance").insert([
          {
            page_path: "all",
            title: "الموقع بالكامل قيد الصيانة والتحديث الشامل",
            message:
              "نجري حالياً أعمال صيانة ترقية شاملة لكافة خوادم وخدمات الموقع لتقديم خدمة أسرع وأكثر استقراراً. سنعود قريباً جداً!",
            is_active: true,
            estimated_end: null,
            created_by: user?.id,
          },
        ]);
        if (error) throw error;
      }

      await fetchMaintenanceRecords(false);
      setShowGlobalToggleModal(false);
      setStatusMessage({
        text: !isCurrentlyActive
          ? "⚠️ تم قفل الموقع بالكامل وتفعيل وضع الصيانة لجميع الصفحات!"
          : "✅ تم إلغاء صيانة الموقع بالكامل وفتح جميع الصفحات للزوار!",
        type: "success",
      });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: "حدث خطأ أثناء تطبيق الإجراء", type: "error" });
    }
  };

  // Delete maintenance record
  const handleDeleteRecord = async () => {
    if (!deletingId || !supabase || !isAdmin) return;
    try {
      const { error } = await supabase
        .from("page_maintenance")
        .delete()
        .eq("id", deletingId);

      if (error) throw error;

      setRecords((prev) => prev.filter((r) => r.id !== deletingId));
      setStatusMessage({ text: "تم حذف إعداد الصيانة بنجاح", type: "success" });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: "فشل حذف الإعداد", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  // Save changes from Edit Modal
  const handleSaveEdit = async () => {
    if (!editingItem || !supabase || !isAdmin) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("page_maintenance")
        .update({
          title: editingItem.title,
          message: editingItem.message,
          is_active: editingItem.is_active,
          estimated_end: editingItem.estimated_end,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingItem.id);

      if (error) throw error;

      setRecords((prev) =>
        prev.map((r) => (r.id === editingItem.id ? editingItem : r))
      );
      setEditingItem(null);
      setStatusMessage({ text: "تم تحديث بيانات الصيانة بنجاح!", type: "success" });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: "فشل حفظ التعديلات", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // Open Lock All Except Modal (optionally with a pre-selected single page)
  const handleOpenLockAllExcept = useCallback((defaultPath?: string) => {
    if (defaultPath) {
      setExcludedPaths([defaultPath]);
    } else if (excludedPaths.length === 0) {
      setExcludedPaths(["/"]);
    }
    setShowLockAllExceptModal(true);
  }, [excludedPaths.length]);

  // Toggle single path in exception list
  const handleToggleExcludePath = useCallback((path: string) => {
    setExcludedPaths((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  }, []);

  // Select all or clear exceptions
  const handleSelectAllExceptions = useCallback(() => {
    setExcludedPaths(SITE_PAGES_LIST.filter((p) => p.path !== "all").map((p) => p.path));
  }, []);

  const handleClearAllExceptions = useCallback(() => {
    setExcludedPaths([]);
  }, []);

  // Submit batch lock for all pages except selected exceptions
  const handleLockAllExceptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !isAdmin) return;

    if (excludedPaths.length === 0) {
      setStatusMessage({
        text: "يرجى تحديد صفحة واحدة على الأقل لاستثنائها وإبقائها مفتوحة للزوار",
        type: "error",
      });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const allPages = SITE_PAGES_LIST.filter((p) => p.path !== "all");

      const upsertItems = allPages.map((page) => {
        const isExcluded = excludedPaths.includes(page.path);
        return {
          page_path: page.path,
          title: isExcluded
            ? `صفحة ${page.label} متاحة`
            : exceptTitle.trim() || `صفحة ${page.label} قيد الصيانة والتحديث`,
          message: isExcluded
            ? `الصفحة تعمل بشكل طبيعي.`
            : exceptMessage.trim() || `نعمل حالياً على تطوير وتحديث هذه الصفحة.`,
          is_active: !isExcluded,
          estimated_end:
            !isExcluded && !exceptIsIndefinite && exceptEstimatedEnd
              ? new Date(exceptEstimatedEnd).toISOString()
              : null,
          created_by: user?.id,
          updated_at: new Date().toISOString(),
        };
      });

      // Ensure global site lock ('all') is inactive so individual page rules apply
      upsertItems.push({
        page_path: "all",
        title: "الموقع قيد الصيانة والتحديث",
        message: "صيانة عامة لكافة الموقع.",
        is_active: false,
        estimated_end: null,
        created_by: user?.id,
        updated_at: new Date().toISOString(),
      });

      const { error } = await supabase
        .from("page_maintenance")
        .upsert(upsertItems, { onConflict: "page_path" });

      if (error) throw error;

      await fetchMaintenanceRecords(false);
      setShowLockAllExceptModal(false);

      const lockedCount = allPages.length - excludedPaths.length;
      setStatusMessage({
        text: `🔒 تم قفل ${lockedCount} صفحة للصيانة بنجاح، وإبقاء ${excludedPaths.length} صفحة مفتوحة ومتاحة للزوار!`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Lock all except error:", err);
      setStatusMessage({
        text: `حدث خطأ أثناء تطبيق القفل: ${err?.message || "يرجى المحاولة مرة أخرى"}`,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Quick 1-click unlock / lock for predefined pages list
  const handleQuickTogglePageFromList = async (page: PageInfo) => {
    const existing = records.find((r) => r.page_path === page.path);
    if (existing) {
      await handleToggleActive(existing);
    } else {
      if (!supabase || !isAdmin) return;
      try {
        const { error } = await supabase.from("page_maintenance").insert([
          {
            page_path: page.path,
            title: `صفحة ${page.label} قيد الصيانة والتحديث`,
            message: `نعمل حالياً على تطوير وتحديث صفحة ${page.label} لتقديم تجربة أفضل. سنعود قريباً!`,
            is_active: true,
            estimated_end: null,
            created_by: user?.id,
          },
        ]);
        if (error) throw error;
        await fetchMaintenanceRecords(false);
        setStatusMessage({
          text: `تم قفل وتفعيل الصيانة لصفحة (${page.label})!`,
          type: "success",
        });
      } catch (err: any) {
        console.error(err);
        setStatusMessage({ text: "فشل تفعيل الصيانة", type: "error" });
      }
    }
  };

  // Computed / Filtered Pages
  const combinedPagesList: MaintenancePageItem[] = useMemo(() => {
    const now = new Date();
    const list: MaintenancePageItem[] = SITE_PAGES_LIST.map((p) => {
      const record = records.find((r) => r.page_path === p.path);
      const isRecordActive = record ? record.is_active : false;
      const isExpired =
        record && record.estimated_end
          ? new Date(record.estimated_end) <= now
          : false;

      return {
        ...p,
        record: record || null,
        isUnderMaintenance: isRecordActive && !isExpired,
      };
    });

    // Custom paths in records not present in SITE_PAGES_LIST
    records.forEach((r) => {
      const exists = list.some((item) => item.path === r.page_path);
      if (!exists) {
        const isExpired = r.estimated_end ? new Date(r.estimated_end) <= now : false;
        list.push({
          path: r.page_path,
          label: r.page_path,
          category: "عام",
          icon: "bx bx-link",
          record: r,
          isUnderMaintenance: r.is_active && !isExpired,
        });
      }
    });

    return list;
  }, [records]);

  const filteredPages = useMemo(() => {
    return combinedPagesList.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (filterTab === "active" && !item.isUnderMaintenance) return false;
      if (filterTab === "inactive" && item.isUnderMaintenance) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.path.toLowerCase().includes(q) ||
          (item.record?.title && item.record.title.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [combinedPagesList, filterTab, selectedCategory, searchQuery]);

  // Statistics
  const activeCount = useMemo(
    () => combinedPagesList.filter((p) => p.isUnderMaintenance).length,
    [combinedPagesList]
  );

  const isGlobalMaintenanceActive = useMemo(
    () => Boolean(records.find((r) => r.page_path === "all" && r.is_active)),
    [records]
  );

  return {
    isAdmin,
    authChecking,
    records,
    fetchLoading,
    isSaving,
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
    handleToggleActive,
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
  };
}
