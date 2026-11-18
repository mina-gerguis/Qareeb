"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  AdminMicrobusStation,
  AdminMicrobusRoute,
  MicrobusStationFormData,
  VisibleColumns,
  ActionMenuState,
  ColumnsMenuPosition
} from "../types";
import {
  INITIAL_FORM_DATA,
  INITIAL_VISIBLE_COLUMNS,
  createEmptyRoute
} from "../constants";
import {
  isUUID,
  getLocalMicrobusStations,
  saveLocalMicrobusStations,
  getStationKey,
  normalizeRoutes,
  validateRoutes,
  filterMicrobusStations
} from "../utils";
import {
  ParsedExcelMicrobusStation,
  exportMicrobusStationsToExcel
} from "../utils/excelParser";
import microStyles from "../admin-microbus-stations.module.css";

export function useAdminMicrobusStations() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);
  const [microbusStations, setMicrobusStations] = useState<AdminMicrobusStation[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [governorateFilter, setGovernorateFilter] = useState("all");

  // View Mode & Pagination
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(INITIAL_VISIBLE_COLUMNS);
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [columnsMenuPos, setColumnsMenuPos] = useState<ColumnsMenuPosition>({ top: 0, left: 0 });

  // Floating 3-dots Action Menu
  const [actionMenuState, setActionMenuState] = useState<ActionMenuState | null>(null);

  // View Details Modal
  const [viewingStation, setViewingStation] = useState<AdminMicrobusStation | null>(null);

  // Selection & Bulk Actions
  const [selectedStationKeys, setSelectedStationKeys] = useState<Record<string, boolean>>({});
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Excel Modal State
  const [showExcelModal, setShowExcelModal] = useState(false);

  // Modal / Form States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminMicrobusStation | null>(null);
  const [formData, setFormData] = useState<MicrobusStationFormData>(INITIAL_FORM_DATA);
  const [visualRoutes, setVisualRoutes] = useState<AdminMicrobusRoute[]>([createEmptyRoute()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Delete Confirmation States
  const [itemToDelete, setItemToDelete] = useState<AdminMicrobusStation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Click outside listener for action and column menus
  useEffect(() => {
    if (!actionMenuState && !columnsMenuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(`.${microStyles.actionDropdownMenu}`) ||
        target.closest(`.${microStyles.columnsDropdownMenu}`) ||
        target.closest(`.${microStyles.moreMenuBtn}`) ||
        target.closest(`.${microStyles.columnsToggleBtn}`)
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

  const loadMicrobusStations = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      setMicrobusStations(getLocalMicrobusStations());
      setDbConnected(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from("microbus_stations")
        .select("*")
        .order("name", { ascending: true });

      if (fetchErr) {
        console.warn("Failed to fetch from microbus_stations, using fallback.", fetchErr);
        setMicrobusStations(getLocalMicrobusStations());
        setDbConnected(false);
      } else if (!data || data.length === 0) {
        const locals = getLocalMicrobusStations();
        setMicrobusStations(locals);
        setDbConnected(true);
      } else {
        setMicrobusStations(data);
        setDbConnected(true);
      }
    } catch (err) {
      console.error("Error loading microbus stations:", err);
      setMicrobusStations(getLocalMicrobusStations());
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

      // Check profile directly if already loaded
      if (profile?.is_admin || user.email === "admin@cairomap.com" || user.user_metadata?.role === "admin") {
        setIsAdmin(true);
        loadMicrobusStations();
        return;
      }

      if (!supabase) {
        setIsAdmin(true);
        loadMicrobusStations();
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
        loadMicrobusStations();
      }
    } catch (err) {
      console.error("Error verifying admin status:", err);
      if (profile?.is_admin || user?.email === "admin@cairomap.com") {
        setIsAdmin(true);
        loadMicrobusStations();
      } else {
        router.push("/");
      }
    }
  }, [user, profile, router, loadMicrobusStations]);

  useEffect(() => {
    if (!authLoading) {
      checkAdminStatus();
    }
  }, [authLoading, checkAdminStatus]);

  // Filtered List
  const filteredStations = useMemo(() => {
    return filterMicrobusStations(microbusStations, searchQuery, governorateFilter);
  }, [microbusStations, searchQuery, governorateFilter]);

  // Paginated List
  const paginatedStations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStations.slice(startIndex, startIndex + pageSize);
  }, [filteredStations, currentPage, pageSize]);

  // Available governorates list from current stations
  const availableGovernorates = useMemo(() => {
    const set = new Set<string>();
    microbusStations.forEach((s) => {
      if (s.governorate) set.add(s.governorate.trim());
    });
    return Array.from(set);
  }, [microbusStations]);

  // Selection Handlers
  const selectedCount = useMemo(() => {
    return Object.values(selectedStationKeys).filter(Boolean).length;
  }, [selectedStationKeys]);

  const toggleSelectStation = (stationKey: string) => {
    setSelectedStationKeys((prev) => ({
      ...prev,
      [stationKey]: !prev[stationKey]
    }));
  };

  const toggleSelectAll = (stationsToToggle: AdminMicrobusStation[]) => {
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
    station: AdminMicrobusStation,
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
      left
    });
    setColumnsMenuOpen(false);
  };

  // Modal actions
  const handleOpenAdd = () => {
    setError("");
    setSuccess("");
    setEditingItem(null);
    setFormData(INITIAL_FORM_DATA);
    setVisualRoutes([createEmptyRoute()]);
    setShowModal(true);
  };

  const handleOpenEdit = (item: AdminMicrobusStation) => {
    setError("");
    setSuccess("");
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      location: item.location || "",
      governorate: item.governorate || "القاهرة",
      map_url: item.map_url || ""
    });
    setVisualRoutes(normalizeRoutes(item.routes));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setError("");
  };

  const handleFormFieldChange = (field: keyof MicrobusStationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRouteFieldChange = (
    index: number,
    field: keyof AdminMicrobusRoute,
    value: string
  ) => {
    setVisualRoutes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddRoute = () => {
    setVisualRoutes((prev) => [...prev, createEmptyRoute()]);
  };

  const handleRemoveRoute = (index: number) => {
    setVisualRoutes((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [createEmptyRoute()];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.location.trim()) {
      setError("يرجى ملء جميع الحقول المطلوبة (اسم الموقف وموقعه بالتفصيل).");
      return;
    }

    const routeError = validateRoutes(visualRoutes);
    if (routeError) {
      setError(routeError);
      return;
    }

    setIsSubmitting(true);

    const stationPayload = {
      name: formData.name.trim(),
      location: formData.location.trim(),
      governorate: formData.governorate.trim() || "القاهرة",
      map_url: formData.map_url.trim(),
      routes: visualRoutes
    };

    if (dbConnected && supabase) {
      try {
        let dbErr;
        const isEditingDbRecord = editingItem && editingItem.id && isUUID(editingItem.id);

        if (isEditingDbRecord) {
          const { error: updErr } = await supabase
            .from("microbus_stations")
            .update(stationPayload)
            .eq("id", editingItem.id);
          dbErr = updErr;
        } else {
          const { error: insErr } = await supabase
            .from("microbus_stations")
            .insert([stationPayload]);
          dbErr = insErr;
        }

        if (dbErr) throw dbErr;

        setSuccess(
          editingItem
            ? "تم تعديل موقف السرفيس بنجاح في قاعدة البيانات."
            : "تم إضافة موقف السرفيس بنجاح إلى قاعدة البيانات."
        );
        await loadMicrobusStations();
        setShowModal(false);
      } catch (err: any) {
        console.error("Save Microbus Station DB Error:", err);
        setError("فشلت العملية في قاعدة البيانات: " + (err.message || String(err)));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // LocalStorage mode
      let updated: AdminMicrobusStation[];
      if (editingItem) {
        const editKey = getStationKey(editingItem);
        updated = microbusStations.map((s) =>
          getStationKey(s) === editKey ? { ...stationPayload, id: s.id } : s
        );
      } else {
        const newRecord: AdminMicrobusStation = {
          id: Math.random().toString(36).substring(2, 9),
          ...stationPayload,
          created_at: new Date().toISOString()
        };
        updated = [newRecord, ...microbusStations];
      }

      saveLocalMicrobusStations(updated);
      setMicrobusStations(updated);
      setSuccess(
        editingItem ? "تم تعديل الموقف بنجاح محلياً." : "تم إضافة الموقف بنجاح محلياً."
      );
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  // Delete Handlers
  const handleDeleteClick = (station: AdminMicrobusStation) => {
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

    if (dbConnected && supabase && itemToDelete.id && isUUID(itemToDelete.id)) {
      try {
        const { error: delErr } = await supabase
          .from("microbus_stations")
          .delete()
          .eq("id", itemToDelete.id);

        if (delErr) throw delErr;

        setSuccess("تم حذف موقف السرفيس بنجاح من قاعدة البيانات.");
        await loadMicrobusStations();
      } catch (err: any) {
        console.error("Delete DB error:", err);
        setError("فشل حذف الموقف من قاعدة البيانات: " + (err.message || String(err)));
      } finally {
        setIsDeleting(false);
        setItemToDelete(null);
      }
    } else {
      const deleteKey = getStationKey(itemToDelete);
      const updated = microbusStations.filter((s) => getStationKey(s) !== deleteKey);
      saveLocalMicrobusStations(updated);
      setMicrobusStations(updated);
      setSuccess("تم حذف الموقف بنجاح محلياً.");
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Bulk Delete Handlers
  const handleOpenBulkDelete = () => {
    if (selectedCount === 0) return;
    setShowBulkDeleteModal(true);
  };

  const handleCancelBulkDelete = () => {
    if (!isBulkDeleting) {
      setShowBulkDeleteModal(false);
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedCount === 0) return;
    setIsBulkDeleting(true);
    setError("");
    setSuccess("");

    const selectedKeysSet = new Set(
      Object.keys(selectedStationKeys).filter((k) => !!selectedStationKeys[k])
    );

    if (dbConnected && supabase) {
      try {
        const idsToDelete: string[] = [];
        const namesToDelete: string[] = [];

        microbusStations.forEach((st) => {
          const key = getStationKey(st);
          if (selectedKeysSet.has(key)) {
            if (st.id && isUUID(st.id)) {
              idsToDelete.push(st.id);
            } else {
              namesToDelete.push(st.name);
            }
          }
        });

        if (idsToDelete.length > 0) {
          const { error: delErr } = await supabase
            .from("microbus_stations")
            .delete()
            .in("id", idsToDelete);
          if (delErr) throw delErr;
        }

        if (namesToDelete.length > 0) {
          const { error: delErr } = await supabase
            .from("microbus_stations")
            .delete()
            .in("name", namesToDelete);
          if (delErr) throw delErr;
        }

        await loadMicrobusStations();
        setSuccess(`تم حذف (${selectedCount}) موقف بنجاح من قاعدة البيانات.`);
        clearSelection();
      } catch (err: any) {
        console.error("Bulk delete error:", err);
        setError("فشل الحذف الجماعي: " + (err?.message || String(err)));
      } finally {
        setIsBulkDeleting(false);
        setShowBulkDeleteModal(false);
      }
    } else {
      let currentLocal = getLocalMicrobusStations();
      currentLocal = currentLocal.filter((localItem) => {
        const key = getStationKey(localItem);
        return !selectedKeysSet.has(key);
      });
      saveLocalMicrobusStations(currentLocal);
      setMicrobusStations(currentLocal);
      setSuccess(`تم حذف (${selectedCount}) موقف بنجاح محلياً (LocalStorage).`);
      clearSelection();
      setIsBulkDeleting(false);
      setShowBulkDeleteModal(false);
    }
  };

  // Excel Handlers
  const handleOpenExcelModal = () => setShowExcelModal(true);
  const handleCloseExcelModal = () => setShowExcelModal(false);

  const handleExportExcel = () => {
    try {
      const dataToExport = filteredStations.length > 0 ? filteredStations : microbusStations;
      exportMicrobusStationsToExcel(dataToExport);
      setSuccess("تم تصدير ملف الإكسل بنجاح!");
    } catch (err: any) {
      console.error("Failed to export Excel:", err);
      setError("حدث خطأ أثناء تصدير ملف الإكسل.");
    }
  };

  const handleImportExcel = async (
    parsedStations: ParsedExcelMicrobusStation[],
    replaceExisting: boolean
  ) => {
    setError("");
    setSuccess("");

    if (dbConnected && supabase) {
      try {
        const { data: existingStations } = await supabase.from("microbus_stations").select("*");
        const existingMap = new Map<string, any>();
        (existingStations || []).forEach((st: any) => {
          if (st.name) {
            existingMap.set(st.name.trim().toLowerCase(), st);
          }
        });

        const toInsert: any[] = [];
        const toUpdate: any[] = [];

        for (const st of parsedStations) {
          const key = st.name.trim().toLowerCase();
          const existing = existingMap.get(key);

          if (existing) {
            let mergedRoutes = st.routes;
            if (!replaceExisting && Array.isArray(existing.routes)) {
              mergedRoutes = [...existing.routes, ...st.routes];
            }

            toUpdate.push({
              id: existing.id,
              name: st.name.trim(),
              location: st.location.trim(),
              governorate: st.governorate.trim(),
              map_url: st.map_url.trim(),
              routes: mergedRoutes
            });
          } else {
            toInsert.push({
              name: st.name.trim(),
              location: st.location.trim(),
              governorate: st.governorate.trim(),
              map_url: st.map_url.trim(),
              routes: st.routes
            });
          }
        }

        if (toInsert.length > 0) {
          const { error: insErr } = await supabase.from("microbus_stations").insert(toInsert);
          if (insErr) throw insErr;
        }

        for (const updItem of toUpdate) {
          const { error: updErr } = await supabase
            .from("microbus_stations")
            .update({
              name: updItem.name,
              location: updItem.location,
              governorate: updItem.governorate,
              map_url: updItem.map_url,
              routes: updItem.routes
            })
            .eq("id", updItem.id);
          if (updErr) throw updErr;
        }

        await loadMicrobusStations();
        setSuccess(`تم استيراد وحفظ (${parsedStations.length}) موقف بنجاح في قاعدة البيانات.`);
      } catch (err: any) {
        console.error("Failed to save imported excel stations into DB:", err);
        throw err;
      }
    } else {
      let currentLocal = getLocalMicrobusStations();
      const localMap = new Map<string, AdminMicrobusStation>();
      currentLocal.forEach((st) => {
        if (st.name) {
          localMap.set(st.name.trim().toLowerCase(), st);
        }
      });

      for (const st of parsedStations) {
        const key = st.name.trim().toLowerCase();
        const existing = localMap.get(key);

        if (existing) {
          if (replaceExisting) {
            existing.location = st.location;
            existing.governorate = st.governorate;
            existing.map_url = st.map_url;
            existing.routes = st.routes;
          } else {
            const existingRoutes = Array.isArray(existing.routes) ? existing.routes : [];
            existing.routes = [...existingRoutes, ...st.routes];
          }
        } else {
          const newRecord: AdminMicrobusStation = {
            id: Math.random().toString(36).substring(2, 11),
            name: st.name.trim(),
            location: st.location.trim(),
            governorate: st.governorate.trim(),
            map_url: st.map_url.trim(),
            routes: st.routes,
            created_at: new Date().toISOString()
          };
          currentLocal = [newRecord, ...currentLocal];
          localMap.set(key, newRecord);
        }
      }

      saveLocalMicrobusStations(currentLocal);
      setMicrobusStations(currentLocal);
      setSuccess(`تم استيراد وحفظ (${parsedStations.length}) موقف بنجاح محلياً (LocalStorage).`);
    }
  };

  return {
    // Auth & Status
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
    governorateFilter,
    setGovernorateFilter,
    availableGovernorates,
    totalStationsCount: microbusStations.length,
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
    columnsMenuOpen,
    columnsMenuPos,
    handleToggleColumnsMenu,
    handleToggleColumn,

    // Floating 3-dots Action Menu
    actionMenuState,
    setActionMenuState,
    handleToggleActionMenu,

    // Viewing Details
    viewingStation,
    setViewingStation,

    // Selection & Bulk Delete
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

    // Excel Modal & Actions
    showExcelModal,
    handleOpenExcelModal,
    handleCloseExcelModal,
    handleExportExcel,
    handleImportExcel,

    // Modal & Form
    showModal,
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

    // Delete
    itemToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete
  };
}
