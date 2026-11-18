"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  BusStation,
  BusCompany,
  BusStationFormData,
  VisibleColumns,
  ActionMenuState,
  ColumnsMenuPosition,
} from "../types";
import {
  DEFAULT_BUS_STATIONS,
  INITIAL_FORM_DATA,
  INITIAL_VISIBLE_COLUMNS,
} from "../constants";
import {
  isUUID,
  getLocalBusStations,
  saveLocalBusStations,
  filterBusStations,
  getStationKey,
} from "../utils";
import busStyles from "../admin-bus-stations.module.css";

export function useAdminBusStations() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);
  const [busStations, setBusStations] = useState<BusStation[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [governorateFilter, setGovernorateFilter] = useState("all");

  // View Mode (table / cards)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(INITIAL_VISIBLE_COLUMNS);
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [columnsMenuPos, setColumnsMenuPos] = useState<ColumnsMenuPosition | null>(null);

  // Floating Action Menu
  const [actionMenuState, setActionMenuState] = useState<ActionMenuState | null>(null);

  // Selection
  const [selectedStationKeys, setSelectedStationKeys] = useState<Record<string, boolean>>({});

  // Details Modal
  const [viewingStation, setViewingStation] = useState<BusStation | null>(null);

  // Form / Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BusStation | null>(null);
  const [formData, setFormData] = useState<BusStationFormData>(INITIAL_FORM_DATA);
  const [formCompanies, setFormCompanies] = useState<BusCompany[]>([]);
  const [availableLogos, setAvailableLogos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation Modal
  const [stationToDelete, setStationToDelete] = useState<BusStation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Responsive default view mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewMode(window.innerWidth < 768 ? "cards" : "table");
    }
  }, []);

  // Reset pagination on filter or search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, governorateFilter]);

  // Click outside listener for action and column menus
  useEffect(() => {
    if (!actionMenuState && !columnsMenuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(`.${busStyles.actionDropdownMenu}`) ||
        target.closest(`.${busStyles.columnsDropdownMenu}`) ||
        target.closest(`.${busStyles.moreMenuBtn}`) ||
        target.closest(`.${busStyles.columnsToggleBtn}`)
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

  const loadBusStations = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      setBusStations(getLocalBusStations());
      setDbConnected(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from("bus_stations")
        .select("*")
        .order("name", { ascending: true });

      if (fetchErr) {
        console.warn("Failed to fetch from bus_stations, using fallback.", fetchErr);
        setBusStations(getLocalBusStations());
        setDbConnected(false);
      } else if (!data || data.length === 0) {
        const locals = getLocalBusStations();
        setBusStations(locals);
        setDbConnected(true);
      } else {
        setBusStations(data);
        setDbConnected(true);
      }
    } catch (err) {
      console.error("Error loading bus stations:", err);
      setBusStations(getLocalBusStations());
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch available logos
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await fetch("/api/bus-logos");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setAvailableLogos(data);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch bus logos:", err);
      }
    };
    fetchLogos();
  }, []);

  // Admin Verification
  const checkAdminStatus = useCallback(async () => {
    try {
      if (!user) {
        router.push("/login");
        return;
      }

      // Check profile directly if already loaded
      if (profile?.is_admin || user.email === "admin@cairomap.com" || user.user_metadata?.role === "admin") {
        setIsAdmin(true);
        loadBusStations();
        return;
      }

      if (!supabase) {
        setIsAdmin(true);
        loadBusStations();
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
        loadBusStations();
      }
    } catch (err) {
      console.error(err);
      if (profile?.is_admin || user?.email === "admin@cairomap.com") {
        setIsAdmin(true);
        loadBusStations();
      } else {
        router.push("/");
      }
    }
  }, [user, profile, router, loadBusStations]);

  useEffect(() => {
    if (!authLoading) {
      checkAdminStatus();
    }
  }, [authLoading, checkAdminStatus]);

  // Filtered List
  const filteredStations = useMemo(() => {
    return filterBusStations(busStations, searchQuery, governorateFilter);
  }, [busStations, searchQuery, governorateFilter]);

  // Paginated List
  const paginatedStations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStations.slice(startIndex, startIndex + pageSize);
  }, [filteredStations, currentPage, pageSize]);

  // Available governorates list from current stations
  const availableGovernorates = useMemo(() => {
    const set = new Set<string>();
    busStations.forEach((s) => {
      if (s.governorate) set.add(s.governorate.trim());
    });
    return Array.from(set);
  }, [busStations]);

  // Selection Handlers
  const selectedCount = useMemo(() => {
    return Object.values(selectedStationKeys).filter(Boolean).length;
  }, [selectedStationKeys]);

  const toggleSelectStation = (stationKey: string) => {
    setSelectedStationKeys((prev) => ({
      ...prev,
      [stationKey]: !prev[stationKey],
    }));
  };

  const toggleSelectAll = (stationsToToggle: BusStation[]) => {
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
    station: BusStation,
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

  // Modal Handlers
  const handleOpenAdd = () => {
    setError("");
    setSuccess("");
    setEditingItem(null);
    setFormData(INITIAL_FORM_DATA);
    setFormCompanies([]);
    setShowModal(true);
  };

  const handleOpenEdit = (station: BusStation) => {
    setError("");
    setSuccess("");
    setEditingItem(station);
    setFormData({
      name: station.name || "",
      location: station.location || "",
      governorate: station.governorate || "القاهرة",
      destinationsText: Array.isArray(station.destinations)
        ? station.destinations.join("، ")
        : station.destinations || "",
      description: station.description || "",
      map_url: station.map_url || "",
    });

    let comps: BusCompany[] = [];
    if (Array.isArray(station.companies)) {
      comps = station.companies;
    } else if (typeof station.companies === "string") {
      try {
        comps = JSON.parse(station.companies);
      } catch {
        comps = [];
      }
    }
    setFormCompanies(comps);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleFormFieldChange = (field: keyof BusStationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCompany = () => {
    setFormCompanies((prev) => [
      ...prev,
      { name: "", phone: "", type: "رسمي حكومي", logo: "" },
    ]);
  };

  const handleRemoveCompany = (index: number) => {
    setFormCompanies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCompanyFieldChange = (
    index: number,
    field: keyof BusCompany,
    value: string
  ) => {
    setFormCompanies((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.location.trim()) {
      setError("يرجى ملء جميع الحقول المطلوبة (اسم الموقف والعنوان).");
      return;
    }

    if (formCompanies.length === 0) {
      setError("يجب إضافة شركة واحدة مشغلة على الأقل.");
      return;
    }

    for (const company of formCompanies) {
      if (!company.name.trim() || !company.phone.trim() || !company.type.trim()) {
        setError("يرجى ملء جميع الحقول الإلزامية لكل شركة (الاسم، الهاتف، والنوع).");
        return;
      }
    }

    setIsSubmitting(true);

    const destinationsArray = formData.destinationsText
      ? formData.destinationsText
          .split(/[\n،,]+/)
          .map((d) => d.trim())
          .filter(Boolean)
      : [];

    const stationPayload = {
      name: formData.name.trim(),
      location: formData.location.trim(),
      governorate: formData.governorate.trim(),
      companies: formCompanies,
      destinations: destinationsArray,
      description: formData.description.trim(),
      map_url: formData.map_url.trim() || undefined,
    };

    if (dbConnected && supabase) {
      try {
        let dbErr;
        const isEditingDbRecord = editingItem && editingItem.id && isUUID(editingItem.id);

        if (isEditingDbRecord) {
          const { error: updErr } = await supabase
            .from("bus_stations")
            .update(stationPayload)
            .eq("id", editingItem.id);
          dbErr = updErr;
        } else {
          const { error: insErr } = await supabase
            .from("bus_stations")
            .insert([stationPayload]);
          dbErr = insErr;
        }

        if (dbErr) throw dbErr;

        setSuccess(
          editingItem
            ? "تم تعديل موقف الأتوبيس بنجاح في قاعدة البيانات."
            : "تم إضافة موقف الأتوبيس بنجاح إلى قاعدة البيانات."
        );
        await loadBusStations();
        setShowModal(false);
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error("Save Bus Station DB Error:", errorObj);
        setError("فشلت العملية في قاعدة البيانات: " + errorObj.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // LocalStorage mode
      let updated: BusStation[];
      if (editingItem) {
        const editKey = getStationKey(editingItem);
        updated = busStations.map((s) =>
          getStationKey(s) === editKey ? { ...stationPayload, id: s.id } : s
        );
      } else {
        const newRecord: BusStation = {
          id: Math.random().toString(36).substring(2, 9),
          ...stationPayload,
          created_at: new Date().toISOString(),
        };
        updated = [newRecord, ...busStations];
      }

      saveLocalBusStations(updated);
      setBusStations(updated);
      setSuccess(
        editingItem ? "تم تعديل الموقف بنجاح محلياً." : "تم إضافة الموقف بنجاح محلياً."
      );
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  // Delete Handlers
  const handleDeleteClick = (station: BusStation) => {
    setStationToDelete(station);
  };

  const handleCancelDelete = () => {
    setStationToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!stationToDelete) return;
    setIsDeleting(true);
    setError("");
    setSuccess("");

    if (dbConnected && supabase && stationToDelete.id && isUUID(stationToDelete.id)) {
      try {
        const { error: delErr } = await supabase
          .from("bus_stations")
          .delete()
          .eq("id", stationToDelete.id);

        if (delErr) throw delErr;

        setSuccess("تم حذف موقف الأتوبيس بنجاح من قاعدة البيانات.");
        await loadBusStations();
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error("Delete DB error:", errorObj);
        setError("فشل حذف الموقف من قاعدة البيانات: " + errorObj.message);
      } finally {
        setIsDeleting(false);
        setStationToDelete(null);
      }
    } else {
      const deleteKey = getStationKey(stationToDelete);
      const updated = busStations.filter((s) => getStationKey(s) !== deleteKey);
      saveLocalBusStations(updated);
      setBusStations(updated);
      setSuccess("تم حذف الموقف بنجاح محلياً.");
      setIsDeleting(false);
      setStationToDelete(null);
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
    governorateFilter,
    setGovernorateFilter,
    availableGovernorates,
    totalStationsCount: busStations.length,
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

    // Selection
    selectedStationKeys,
    selectedCount,
    toggleSelectStation,
    toggleSelectAll,
    clearSelection,

    // Form Modal
    showModal,
    editingItem,
    formData,
    formCompanies,
    availableLogos,
    isSubmitting,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleFormFieldChange,
    handleAddCompany,
    handleRemoveCompany,
    handleCompanyFieldChange,
    handleSubmit,

    // Delete Modal
    stationToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
