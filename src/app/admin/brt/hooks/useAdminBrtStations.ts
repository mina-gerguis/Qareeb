"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  AdminBrtStation,
  AdminBrtRoute,
  BrtStationFormData,
  ParsedExcelBrtStation,
  VisibleColumns,
  ActionMenuState,
  ColumnsMenuPosition,
} from "../types";
import { createEmptyBrtRoute, INITIAL_VISIBLE_COLUMNS } from "../constants";
import {
  isUUID,
  getLocalBrtStations,
  saveLocalBrtStations,
  normalizeBrtRoutes,
  validateBrtRoutes,
  filterBrtStations,
  getStationKey,
} from "../utils";
import { exportBrtStationsToExcel } from "../utils/excelParser";
import brtStyles from "../admin-brt.module.css";

const INITIAL_FORM_DATA: BrtStationFormData = {
  name: "",
  location: "",
  governorate: "القاهرة",
  sector: "شرق القاهرة",
  map_url: "",
  type: "محطة سطحية قياسية",
  status: "تشغيل تجريبي",
  landmarksText: "",
};

export function useAdminBrtStations() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);
  const [brtStations, setBrtStations] = useState<AdminBrtStation[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");

  // View Mode (cards / table)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(INITIAL_VISIBLE_COLUMNS);
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [columnsMenuPos, setColumnsMenuPos] = useState<ColumnsMenuPosition | null>(null);

  // Selection & Bulk Actions
  const [selectedStationKeys, setSelectedStationKeys] = useState<Record<string, boolean>>({});
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Floating Action Menu
  const [actionMenuState, setActionMenuState] = useState<ActionMenuState | null>(null);

  // Details Modal
  const [viewingStation, setViewingStation] = useState<AdminBrtStation | null>(null);

  // Excel Modal State
  const [showExcelModal, setShowExcelModal] = useState(false);

  // Modal / Form States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminBrtStation | null>(null);
  const [formData, setFormData] = useState<BrtStationFormData>(INITIAL_FORM_DATA);
  const [visualRoutes, setVisualRoutes] = useState<AdminBrtRoute[]>([createEmptyBrtRoute()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Delete Confirmation States
  const [itemToDelete, setItemToDelete] = useState<AdminBrtStation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Responsive default view mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewMode(window.innerWidth < 768 ? "cards" : "table");
    }
  }, []);

  // Reset pagination on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sectorFilter]);

  // Click outside listener for action and column menus
  useEffect(() => {
    if (!actionMenuState && !columnsMenuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(`.${brtStyles.actionDropdownMenu}`) ||
        target.closest(`.${brtStyles.columnsDropdownMenu}`) ||
        target.closest(`.${brtStyles.moreMenuBtn}`) ||
        target.closest(`.${brtStyles.columnsToggleBtn}`)
      ) {
        return;
      }
      setActionMenuState(null);
      setColumnsMenuOpen(false);
    };

    const handleWindowResize = () => {
      setActionMenuState(null);
      setColumnsMenuOpen(false);
    };

    window.addEventListener("resize", handleWindowResize);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [actionMenuState, columnsMenuOpen]);

  const loadBrtStations = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      setBrtStations(getLocalBrtStations());
      setDbConnected(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from("brt_stations")
        .select("*")
        .order("name", { ascending: true });

      if (fetchErr) {
        console.warn("Failed to fetch from brt_stations, using fallback.", fetchErr);
        setBrtStations(getLocalBrtStations());
        setDbConnected(false);
      } else if (!data || data.length === 0) {
        const locals = getLocalBrtStations();
        setBrtStations(locals);
        setDbConnected(true);
      } else {
        setBrtStations(data);
        setDbConnected(true);
      }
    } catch (err) {
      console.error("Error loading BRT stations:", err);
      setBrtStations(getLocalBrtStations());
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAdminStatus = useCallback(async () => {
    try {
      if (!user) {
        router.push("/login");
        return;
      }

      if (profile?.is_admin || user.email === "admin@cairomap.com" || user.user_metadata?.role === "admin") {
        setIsAdmin(true);
        loadBrtStations();
        return;
      }

      if (!supabase) {
        setIsAdmin(true);
        loadBrtStations();
        return;
      }

      const { data, error: profileErr } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (profileErr || !data?.is_admin) {
        router.push("/");
      } else {
        setIsAdmin(true);
        loadBrtStations();
      }
    } catch (err) {
      console.error(err);
      if (profile?.is_admin || user?.email === "admin@cairomap.com") {
        setIsAdmin(true);
        loadBrtStations();
      } else {
        router.push("/");
      }
    }
  }, [user, profile, router, loadBrtStations]);

  useEffect(() => {
    if (!authLoading) {
      checkAdminStatus();
    }
  }, [authLoading, checkAdminStatus]);

  // Filtered stations list
  const filteredStations = useMemo(() => {
    return filterBrtStations(brtStations, searchQuery, sectorFilter);
  }, [brtStations, searchQuery, sectorFilter]);

  // Paginated stations
  const paginatedStations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStations.slice(startIndex, startIndex + pageSize);
  }, [filteredStations, currentPage, pageSize]);

  const totalStationsCount = brtStations.length;

  // Selection handlers
  const selectedCount = useMemo(() => {
    return Object.values(selectedStationKeys).filter(Boolean).length;
  }, [selectedStationKeys]);

  const toggleSelectStation = (stationKey: string) => {
    setSelectedStationKeys((prev) => ({
      ...prev,
      [stationKey]: !prev[stationKey],
    }));
  };

  const toggleSelectAll = (stationsToToggle: AdminBrtStation[]) => {
    const allSelected =
      stationsToToggle.length > 0 &&
      stationsToToggle.every((s) => selectedStationKeys[getStationKey(s)]);

    if (allSelected) {
      setSelectedStationKeys((prev) => {
        const next = { ...prev };
        stationsToToggle.forEach((s) => {
          delete next[getStationKey(s)];
        });
        return next;
      });
    } else {
      setSelectedStationKeys((prev) => {
        const next = { ...prev };
        stationsToToggle.forEach((s) => {
          next[getStationKey(s)] = true;
        });
        return next;
      });
    }
  };

  const clearSelection = () => {
    setSelectedStationKeys({});
  };

  // Toggle Columns Menu
  const handleToggleColumnsMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (columnsMenuOpen) {
      setColumnsMenuOpen(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownWidth = 190;
    const dropdownHeight = 240;

    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
    const top = openUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4;

    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 10) {
      left = window.innerWidth - dropdownWidth - 10;
    }
    if (left < 10) left = 10;

    setColumnsMenuPos({ top, left });
    setColumnsMenuOpen(true);
    setActionMenuState(null);
  };

  const handleToggleColumn = (key: keyof VisibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle 3-dots action menu
  const handleToggleActionMenu = (
    station: AdminBrtStation,
    stationKey: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (actionMenuState?.stationKey === stationKey) {
      setActionMenuState(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownWidth = 150;
    const dropdownHeight = 135;

    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
    const top = openUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4;

    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 10) {
      left = window.innerWidth - dropdownWidth - 10;
    }
    if (left < 10) left = 10;

    setActionMenuState({
      station,
      stationKey,
      top,
      left,
    });
    setColumnsMenuOpen(false);
  };

  // Bulk Deletion Handlers
  const handleOpenBulkDelete = () => {
    if (selectedCount === 0) return;
    setShowBulkDeleteModal(true);
  };

  const handleCancelBulkDelete = () => {
    setShowBulkDeleteModal(false);
  };

  const handleConfirmBulkDelete = async () => {
    setIsBulkDeleting(true);
    setError("");
    setSuccess("");

    const keysToDelete = Object.keys(selectedStationKeys).filter(
      (k) => selectedStationKeys[k]
    );

    const dbIdsToDelete: string[] = [];
    const localKeysToDelete: string[] = [];

    keysToDelete.forEach((key) => {
      if (isUUID(key)) {
        dbIdsToDelete.push(key);
      } else {
        localKeysToDelete.push(key);
      }
    });

    if (dbConnected && supabase && dbIdsToDelete.length > 0) {
      try {
        const { error: dbErr } = await supabase
          .from("brt_stations")
          .delete()
          .in("id", dbIdsToDelete);

        if (dbErr) throw dbErr;
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error("Bulk delete DB error:", errorObj);
        setError("تعذر حذف بعض المحطات من قاعدة البيانات: " + errorObj.message);
        setIsBulkDeleting(false);
        setShowBulkDeleteModal(false);
        return;
      }
    }

    // Update local state and storage
    const updated = brtStations.filter((s) => {
      const key = getStationKey(s);
      return !selectedStationKeys[key];
    });

    saveLocalBrtStations(updated);
    setBrtStations(updated);
    clearSelection();
    setShowBulkDeleteModal(false);
    setIsBulkDeleting(false);
    setSuccess(`تم حذف ${keysToDelete.length} محطة بنجاح.`);
  };

  // Excel Handlers
  const handleOpenExcelModal = () => setShowExcelModal(true);
  const handleCloseExcelModal = () => setShowExcelModal(false);

  const handleExportExcel = () => {
    if (brtStations.length === 0) {
      setError("لا توجد محطات للتصدير.");
      return;
    }
    exportBrtStationsToExcel(brtStations);
    setSuccess("تم تصدير محطات الأتوبيس الترددي بنجاح إلى ملف Excel.");
  };

  const handleImportExcel = async (parsedStations: ParsedExcelBrtStation[]) => {
    if (!parsedStations || parsedStations.length === 0) return;
    setError("");
    setSuccess("");

    const formattedToInsert = parsedStations.map((p) => ({
      name: p.name,
      location: p.location,
      governorate: p.governorate,
      sector: p.sector,
      map_url: p.map_url,
      type: p.type,
      status: p.status,
      landmarks: p.landmarks,
      routes: p.routes,
    }));

    if (dbConnected && supabase) {
      try {
        const { data, error: insertErr } = await supabase
          .from("brt_stations")
          .insert(formattedToInsert)
          .select();

        if (insertErr) throw insertErr;

        setSuccess(`تم استيراد وحفظ ${formattedToInsert.length} محطة بنجاح في قاعدة البيانات.`);
        await loadBrtStations();
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error("Excel import DB error:", errorObj);
        setError("فشل الحفظ في قاعدة البيانات: " + errorObj.message);

        // Fallback local merge
        const updated = [...brtStations, ...formattedToInsert];
        saveLocalBrtStations(updated);
        setBrtStations(updated);
        setSuccess(`تم استيراد ${formattedToInsert.length} محطة وحفظها محلياً مؤقتاً.`);
      }
    } else {
      const updated = [...brtStations, ...formattedToInsert];
      saveLocalBrtStations(updated);
      setBrtStations(updated);
      setSuccess(`تم استيراد وحفظ ${formattedToInsert.length} محطة محلياً.`);
    }

    setShowExcelModal(false);
  };

  // Form Modal Handlers
  const handleOpenAdd = () => {
    setError("");
    setSuccess("");
    setEditingItem(null);
    setFormData(INITIAL_FORM_DATA);
    setVisualRoutes([createEmptyBrtRoute()]);
    setShowModal(true);
  };

  const handleOpenEdit = (station: AdminBrtStation) => {
    setError("");
    setSuccess("");
    setEditingItem(station);
    setFormData({
      name: station.name || "",
      location: station.location || "",
      governorate: station.governorate || "القاهرة",
      sector: station.sector || "شرق القاهرة",
      map_url: station.map_url || "",
      type: station.type || "محطة سطحية قياسية",
      status: station.status || "تشغيل تجريبي",
      landmarksText: Array.isArray(station.landmarks) ? station.landmarks.join("، ") : "",
    });
    setVisualRoutes(normalizeBrtRoutes(station.routes));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleFormFieldChange = (field: keyof BrtStationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRouteFieldChange = (index: number, field: keyof AdminBrtRoute, value: string) => {
    setVisualRoutes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddRoute = () => {
    setVisualRoutes((prev) => [...prev, createEmptyBrtRoute()]);
  };

  const handleRemoveRoute = (index: number) => {
    setVisualRoutes((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.location.trim()) {
      setError("يرجى ملء جميع الحقول المطلوبة (اسم المحطة والموقع).");
      return;
    }

    const routeValidationError = validateBrtRoutes(visualRoutes);
    if (routeValidationError) {
      setError(routeValidationError);
      return;
    }

    setIsSubmitting(true);

    const landmarksArray = formData.landmarksText
      ? formData.landmarksText
          .split(/[\n،,]+/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const stationPayload = {
      name: formData.name.trim(),
      location: formData.location.trim(),
      governorate: formData.governorate.trim(),
      sector: formData.sector,
      map_url: formData.map_url.trim() || undefined,
      type: formData.type,
      status: formData.status,
      landmarks: landmarksArray,
      routes: visualRoutes,
    };

    if (dbConnected && supabase) {
      try {
        let dbErr;
        if (editingItem && editingItem.id) {
          const { error: updErr } = await supabase
            .from("brt_stations")
            .update(stationPayload)
            .eq("id", editingItem.id);
          dbErr = updErr;
        } else {
          const { error: insErr } = await supabase
            .from("brt_stations")
            .insert([stationPayload]);
          dbErr = insErr;
        }

        if (dbErr) throw dbErr;

        setSuccess(
          editingItem
            ? "تم تعديل المحطة بنجاح في قاعدة البيانات."
            : "تم إضافة المحطة بنجاح إلى قاعدة البيانات."
        );
        await loadBrtStations();
        setShowModal(false);
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error("Save DB Error:", errorObj);
        setError("فشلت العملية في قاعدة البيانات: " + errorObj.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // LocalStorage mode
      let updated: AdminBrtStation[];
      if (editingItem) {
        const editKey = getStationKey(editingItem);
        updated = brtStations.map((s) =>
          getStationKey(s) === editKey ? { ...stationPayload, id: s.id } : s
        );
      } else {
        updated = [stationPayload, ...brtStations];
      }

      saveLocalBrtStations(updated);
      setBrtStations(updated);
      setSuccess(
        editingItem ? "تم تعديل المحطة بنجاح محلياً." : "تم إضافة المحطة بنجاح محلياً."
      );
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  // Delete Handlers
  const handleDeleteClick = (station: AdminBrtStation) => {
    setItemToDelete(station);
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    setError("");
    setSuccess("");

    if (dbConnected && supabase && itemToDelete.id) {
      try {
        const { error: delErr } = await supabase
          .from("brt_stations")
          .delete()
          .eq("id", itemToDelete.id);

        if (delErr) throw delErr;

        setSuccess("تم حذف المحطة بنجاح من قاعدة البيانات.");
        await loadBrtStations();
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error("Delete DB error:", errorObj);
        setError("فشل حذف المحطة من قاعدة البيانات: " + errorObj.message);
      } finally {
        setIsDeleting(false);
        setItemToDelete(null);
      }
    } else {
      const deleteKey = getStationKey(itemToDelete);
      const updated = brtStations.filter((s) => getStationKey(s) !== deleteKey);
      saveLocalBrtStations(updated);
      setBrtStations(updated);
      setSuccess("تم حذف المحطة بنجاح محلياً.");
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  return {
    authLoading,
    loading,
    isAdmin,
    dbConnected,
    error,
    setError,
    success,
    setSuccess,

    // Search & Filter
    searchQuery,
    setSearchQuery,
    sectorFilter,
    setSectorFilter,
    totalStationsCount,
    filteredStations,
    paginatedStations,

    // View Mode & Pagination
    viewMode,
    setViewMode,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,

    // Columns Visibility
    visibleColumns,
    setVisibleColumns,
    columnsMenuOpen,
    setColumnsMenuOpen,
    columnsMenuPos,
    handleToggleColumnsMenu,
    handleToggleColumn,

    // Floating 3-dots action menu
    actionMenuState,
    setActionMenuState,
    handleToggleActionMenu,

    // Viewing Details
    viewingStation,
    setViewingStation,

    // Selection & Bulk
    selectedStationKeys,
    selectedCount,
    toggleSelectStation,
    toggleSelectAll,
    clearSelection,
    showBulkDeleteModal,
    isBulkDeleting,
    handleOpenBulkDelete,
    handleCancelBulkDelete,
    handleConfirmBulkDelete,

    // Excel
    showExcelModal,
    setShowExcelModal,
    handleOpenExcelModal,
    handleCloseExcelModal,
    handleExportExcel,
    handleImportExcel,

    // Form Modal
    showModal,
    setShowModal,
    editingItem,
    formData,
    visualRoutes,
    isSubmitting,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleFormFieldChange,
    handleRouteFieldChange,
    handleAddRoute,
    handleRemoveRoute,
    handleSubmit,

    // Single Delete
    itemToDelete,
    setItemToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
