"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  ParkingSpot,
  ParkingFormData,
  VisibleColumns,
  ActionMenuState,
  ColumnsMenuPosition
} from "../types";
import {
  INITIAL_FORM_DATA,
  INITIAL_VISIBLE_COLUMNS,
  POPULAR_PARKING_AREAS
} from "../constants";
import {
  isUUID,
  getLocalParkingSpots,
  saveLocalParkingSpots,
  getParkingKey,
  mapDBToJs,
  mapJsToDB,
  filterParkingSpots
} from "../utils";
import parkingStyles from "../admin-parking.module.css";

export function useAdminParking() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");

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
  const [viewingSpot, setViewingSpot] = useState<ParkingSpot | null>(null);

  // Selection & Bulk Actions
  const [selectedSpotKeys, setSelectedSpotKeys] = useState<Record<string, boolean>>({});
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Modal / Form States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ParkingSpot | null>(null);
  const [formData, setFormData] = useState<ParkingFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Delete Confirmation States
  const [spotToDelete, setSpotToDelete] = useState<ParkingSpot | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Click outside listener for action and column menus
  useEffect(() => {
    if (!actionMenuState && !columnsMenuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(`.${parkingStyles.actionDropdownMenu}`) ||
        target.closest(`.${parkingStyles.columnsDropdownMenu}`) ||
        target.closest(`.${parkingStyles.moreMenuBtn}`) ||
        target.closest(`.${parkingStyles.columnsToggleBtn}`)
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

  const loadParkingSpots = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      setParkingSpots(getLocalParkingSpots());
      setDbConnected(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from("parking_spots")
        .select("*")
        .order("name", { ascending: true });

      if (fetchErr) {
        console.warn("Failed to fetch from parking_spots, using fallback.", fetchErr);
        setParkingSpots(getLocalParkingSpots());
        setDbConnected(false);
      } else if (!data || data.length === 0) {
        const locals = getLocalParkingSpots();
        setParkingSpots(locals);
        setDbConnected(true);
      } else {
        const mapped = data.map(mapDBToJs);
        setParkingSpots(mapped);
        setDbConnected(true);
      }
    } catch (err) {
      console.error("Error loading parking spots:", err);
      setParkingSpots(getLocalParkingSpots());
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
        loadParkingSpots();
        return;
      }

      if (!supabase) {
        setIsAdmin(true);
        loadParkingSpots();
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
        loadParkingSpots();
      }
    } catch (err) {
      console.error("Error verifying admin status:", err);
      if (profile?.is_admin || user?.email === "admin@cairomap.com") {
        setIsAdmin(true);
        loadParkingSpots();
      } else {
        router.push("/");
      }
    }
  }, [user, profile, router, loadParkingSpots]);

  useEffect(() => {
    if (!authLoading) {
      checkAdminStatus();
    }
  }, [authLoading, checkAdminStatus]);

  // Filtered List
  const filteredSpots = useMemo(() => {
    return filterParkingSpots(parkingSpots, searchQuery, areaFilter);
  }, [parkingSpots, searchQuery, areaFilter]);

  // Paginated List
  const paginatedSpots = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSpots.slice(startIndex, startIndex + pageSize);
  }, [filteredSpots, currentPage, pageSize]);

  // Available areas list
  const availableAreas = useMemo(() => {
    const set = new Set<string>(POPULAR_PARKING_AREAS);
    parkingSpots.forEach((s) => {
      if (s.area) set.add(s.area.trim());
    });
    return Array.from(set);
  }, [parkingSpots]);

  // Selection Handlers
  const selectedCount = useMemo(() => {
    return Object.values(selectedSpotKeys).filter(Boolean).length;
  }, [selectedSpotKeys]);

  const toggleSelectSpot = (spotKey: string) => {
    setSelectedSpotKeys((prev) => ({
      ...prev,
      [spotKey]: !prev[spotKey]
    }));
  };

  const toggleSelectAll = (spotsToToggle: ParkingSpot[]) => {
    const allSelected =
      spotsToToggle.length > 0 &&
      spotsToToggle.every((s) => selectedSpotKeys[getParkingKey(s)]);

    if (allSelected) {
      setSelectedSpotKeys((prev) => {
        const next = { ...prev };
        spotsToToggle.forEach((s) => {
          delete next[getParkingKey(s)];
        });
        return next;
      });
    } else {
      setSelectedSpotKeys((prev) => {
        const next = { ...prev };
        spotsToToggle.forEach((s) => {
          next[getParkingKey(s)] = true;
        });
        return next;
      });
    }
  };

  const clearSelection = () => {
    setSelectedSpotKeys({});
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
    spot: ParkingSpot,
    spotKey: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (actionMenuState?.spotKey === spotKey) {
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
      spot,
      spotKey,
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
    setShowModal(true);
  };

  const handleOpenEdit = (item: ParkingSpot) => {
    setError("");
    setSuccess("");
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      area: item.area || "وسط البلد",
      address: item.address || "",
      nearestMetro: item.nearestMetro || "",
      hourlyRate: item.hourlyRate ?? 15,
      maxDailyRate: item.maxDailyRate !== null && item.maxDailyRate !== undefined ? item.maxDailyRate : "",
      capacity: item.capacity ?? 0,
      type: item.type || "مغطى ومتعدد الطوابق 🏢",
      hours: item.hours || "24 ساعة طوال الأسبوع",
      features: Array.isArray(item.features) ? item.features.join("، ") : item.features || "",
      mapLocationLink: item.mapLocationLink || ""
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setError("");
  };

  const handleFormFieldChange = (field: keyof ParkingFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.address.trim()) {
      setError("يرجى ملء جميع الحقول المطلوبة (اسم الجراج والعنوان).");
      return;
    }

    setIsSubmitting(true);

    const payload = mapJsToDB(formData);

    if (dbConnected && supabase) {
      try {
        let dbErr;
        const isEditingDbRecord = editingItem && editingItem.id && isUUID(editingItem.id);

        if (isEditingDbRecord) {
          const { error: updErr } = await supabase
            .from("parking_spots")
            .update(payload)
            .eq("id", editingItem.id);
          dbErr = updErr;
        } else {
          const { error: insErr } = await supabase
            .from("parking_spots")
            .insert([payload]);
          dbErr = insErr;
        }

        if (dbErr) throw dbErr;

        setSuccess(
          editingItem
            ? "تم تعديل بيانات الجراج بنجاح في قاعدة البيانات."
            : "تم إضافة الجراج بنجاح إلى قاعدة البيانات."
        );
        await loadParkingSpots();
        setShowModal(false);
      } catch (err: any) {
        console.error("Save Parking DB Error:", err);
        setError("فشلت العملية في قاعدة البيانات: " + (err.message || String(err)));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // LocalStorage mode
      const jsItem: ParkingSpot = {
        ...formData,
        hourlyRate: Number(formData.hourlyRate || 0),
        capacity: Number(formData.capacity || 0),
        features: formData.features.split(/[\n،,]+/).map((f) => f.trim()).filter(Boolean)
      };

      let updated: ParkingSpot[];
      if (editingItem) {
        const editKey = getParkingKey(editingItem);
        updated = parkingSpots.map((s) =>
          getParkingKey(s) === editKey ? { ...jsItem, id: s.id } : s
        );
      } else {
        const newRecord: ParkingSpot = {
          id: Math.random().toString(36).substring(2, 9),
          ...jsItem,
          created_at: new Date().toISOString()
        };
        updated = [newRecord, ...parkingSpots];
      }

      saveLocalParkingSpots(updated);
      setParkingSpots(updated);
      setSuccess(
        editingItem ? "تم تعديل الجراج بنجاح محلياً." : "تم إضافة الجراج بنجاح محلياً."
      );
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  // Delete Handlers
  const handleDeleteClick = (spot: ParkingSpot) => {
    setSpotToDelete(spot);
  };

  const handleCancelDelete = () => {
    setSpotToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!spotToDelete) return;
    setIsDeleting(true);
    setError("");
    setSuccess("");

    if (dbConnected && supabase && spotToDelete.id && isUUID(spotToDelete.id)) {
      try {
        const { error: delErr } = await supabase
          .from("parking_spots")
          .delete()
          .eq("id", spotToDelete.id);

        if (delErr) throw delErr;

        setSuccess("تم حذف الجراج بنجاح من قاعدة البيانات.");
        await loadParkingSpots();
      } catch (err: any) {
        console.error("Delete DB error:", err);
        setError("فشل حذف الجراج من قاعدة البيانات: " + (err.message || String(err)));
      } finally {
        setIsDeleting(false);
        setSpotToDelete(null);
      }
    } else {
      const deleteKey = getParkingKey(spotToDelete);
      const updated = parkingSpots.filter((s) => getParkingKey(s) !== deleteKey);
      saveLocalParkingSpots(updated);
      setParkingSpots(updated);
      setSuccess("تم حذف الجراج بنجاح محلياً.");
      setIsDeleting(false);
      setSpotToDelete(null);
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
      Object.keys(selectedSpotKeys).filter((k) => !!selectedSpotKeys[k])
    );

    if (dbConnected && supabase) {
      try {
        const idsToDelete: string[] = [];
        const namesToDelete: string[] = [];

        parkingSpots.forEach((st) => {
          const key = getParkingKey(st);
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
            .from("parking_spots")
            .delete()
            .in("id", idsToDelete);
          if (delErr) throw delErr;
        }

        if (namesToDelete.length > 0) {
          const { error: delErr } = await supabase
            .from("parking_spots")
            .delete()
            .in("name", namesToDelete);
          if (delErr) throw delErr;
        }

        await loadParkingSpots();
        setSuccess(`تم حذف (${selectedCount}) جراج بنجاح من قاعدة البيانات.`);
        clearSelection();
      } catch (err: any) {
        console.error("Bulk delete error:", err);
        setError("فشل الحذف الجماعي: " + (err?.message || String(err)));
      } finally {
        setIsBulkDeleting(false);
        setShowBulkDeleteModal(false);
      }
    } else {
      let currentLocal = getLocalParkingSpots();
      currentLocal = currentLocal.filter((localItem) => {
        const key = getParkingKey(localItem);
        return !selectedKeysSet.has(key);
      });
      saveLocalParkingSpots(currentLocal);
      setParkingSpots(currentLocal);
      setSuccess(`تم حذف (${selectedCount}) جراج بنجاح محلياً (LocalStorage).`);
      clearSelection();
      setIsBulkDeleting(false);
      setShowBulkDeleteModal(false);
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
    areaFilter,
    setAreaFilter,
    availableAreas,
    totalSpotsCount: parkingSpots.length,
    filteredSpots,
    paginatedSpots,

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
    viewingSpot,
    setViewingSpot,

    // Selection & Bulk Delete
    selectedSpotKeys,
    selectedCount,
    toggleSelectSpot,
    toggleSelectAll,
    clearSelection,
    showBulkDeleteModal,
    isBulkDeleting,
    handleOpenBulkDelete,
    handleCancelBulkDelete,
    handleConfirmBulkDelete,

    // Modal & Form
    showModal,
    editingItem,
    formData,
    isSubmitting,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleFormFieldChange,
    handleSubmit,

    // Delete
    spotToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete
  };
}
