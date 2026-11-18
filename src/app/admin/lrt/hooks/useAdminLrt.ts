"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  LrtStation,
  LrtPrice,
  LrtStationFormData,
  VisibleColumns,
  ActionMenuState,
  ColumnsMenuPosition,
} from "../types";
import {
  INITIAL_STATION_FORM,
  INITIAL_VISIBLE_COLUMNS,
} from "../constants";
import {
  getLineLabel,
  getStationKey,
  getNextStationOrder,
  enrichStationLandmarks,
  getLocalStations,
  saveLocalStations,
  getLocalPrices,
  saveLocalPrices,
} from "../utils";
import lrtStyles from "../admin-lrt.module.css";

export function useAdminLrt() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<boolean>(true);
  const [pricesDbStatus, setPricesDbStatus] = useState<boolean>(true);

  // Section Navigation: stations or pricing
  const [activeSection, setActiveSection] = useState<"stations" | "pricing">("stations");

  // Table Data States
  const [lrtStations, setLrtStations] = useState<LrtStation[]>([]);
  const [ticketPrices, setTicketPrices] = useState<LrtPrice[]>([]);
  const [adminActiveLine, setAdminActiveLine] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Pagination and Selection States
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStationKeys, setSelectedStationKeys] = useState<string[]>([]);

  // Modal / Form States for Station
  const [showStationModal, setShowStationModal] = useState(false);
  const [editingStation, setEditingStation] = useState<LrtStation | null>(null);
  const [stationForm, setStationForm] = useState<LrtStationFormData>(INITIAL_STATION_FORM);

  // Drag and Drop & Reordering States
  const [draggedStationId, setDraggedStationId] = useState<string | null>(null);
  const [dragOverStationId, setDragOverStationId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stationToDelete, setStationToDelete] = useState<LrtStation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dropdown Action Menu & Details View States
  const [actionMenuState, setActionMenuState] = useState<ActionMenuState | null>(null);
  const [viewingStation, setViewingStation] = useState<LrtStation | null>(null);

  // Columns Visibility States
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(INITIAL_VISIBLE_COLUMNS);
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [columnsMenuPos, setColumnsMenuPos] = useState<ColumnsMenuPosition | null>(null);

  // Responsive default view mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewMode(window.innerWidth < 768 ? "cards" : "table");
    }
  }, []);

  // Reset pagination on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, adminActiveLine]);

  // Click outside listener for floating menus
  useEffect(() => {
    if (!actionMenuState && !columnsMenuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(`.${lrtStyles.actionDropdownMenu}`) ||
        target.closest(`.${lrtStyles.columnsDropdownMenu}`) ||
        target.closest(`.${lrtStyles.moreMenuBtn}`) ||
        target.closest(`.${lrtStyles.columnsToggleBtn}`)
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

  const fetchStationsData = useCallback(async () => {
    if (!supabase) {
      setLrtStations(getLocalStations());
      setDbStatus(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from("lrt_stations")
        .select("*")
        .order("station_order", { ascending: true });

      if (fetchErr) {
        console.warn("Failed to fetch from lrt_stations, using fallback.", fetchErr);
        setLrtStations(getLocalStations());
        setDbStatus(false);
      } else {
        const mappedData: LrtStation[] = data ? data.map(item => enrichStationLandmarks(item)) : [];

        mappedData.sort((a, b) => {
          if (a.line_type !== b.line_type) {
            return a.line_type.localeCompare(b.line_type);
          }
          return (Number(a.station_order) || 0) - (Number(b.station_order) || 0);
        });

        setLrtStations(mappedData);
        setDbStatus(true);
      }
    } catch (err) {
      console.error(err);
      setLrtStations(getLocalStations());
      setDbStatus(false);
    }
  }, []);

  const fetchPricesData = useCallback(async () => {
    if (!supabase) {
      setTicketPrices(getLocalPrices());
      setPricesDbStatus(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from("lrt_prices")
        .select("*")
        .order("max_stations", { ascending: true });

      if (fetchErr) {
        console.warn("Failed to fetch from lrt_prices, using fallback.", fetchErr);
        setTicketPrices(getLocalPrices());
        setPricesDbStatus(false);
      } else {
        setTicketPrices(data && data.length > 0 ? data : getLocalPrices());
        setPricesDbStatus(true);
      }
    } catch (err) {
      console.error(err);
      setTicketPrices(getLocalPrices());
      setPricesDbStatus(false);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStationsData(), fetchPricesData()]);
    setLoading(false);
  }, [fetchStationsData, fetchPricesData]);

  const checkAdminStatus = useCallback(async () => {
    try {
      if (!user) {
        router.push("/login");
        return;
      }
      if (!supabase) {
        router.push("/");
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
        loadAllData();
      }
    } catch (err) {
      console.error(err);
      router.push("/");
    }
  }, [user, router, loadAllData]);

  useEffect(() => {
    if (!authLoading) {
      checkAdminStatus();
    }
  }, [authLoading, checkAdminStatus]);

  const handleToggleActionMenu = (station: LrtStation, stationKey: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (actionMenuState?.key === stationKey) {
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
    if (left < 10) {
      left = 10;
    }

    setActionMenuState({
      key: stationKey,
      station,
      top,
      left,
    });
  };

  const handleToggleColumnsMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (columnsMenuOpen) {
      setColumnsMenuOpen(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownWidth = 185;
    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 10) {
      left = window.innerWidth - dropdownWidth - 10;
    }
    if (left < 10) left = 10;

    setColumnsMenuPos({
      top: rect.bottom + 6,
      left,
    });
    setColumnsMenuOpen(true);
  };

  const handleOpenAddStation = () => {
    setError("");
    setSuccess("");
    setEditingStation(null);
    const defaultLine = adminActiveLine !== "all" ? adminActiveLine : "trunk";
    const nextOrder = getNextStationOrder(defaultLine, lrtStations);
    setStationForm({
      name: "",
      line_type: defaultLine,
      station_order: nextOrder,
      landmarks: "",
      status: "تشغيل فعلي",
    });
    setShowStationModal(true);
  };

  const handleOpenEditStation = (item: LrtStation) => {
    setError("");
    setSuccess("");
    setEditingStation(item);
    setStationForm({
      name: item.name,
      line_type: item.line_type,
      station_order: item.station_order || 1,
      landmarks: Array.isArray(item.landmarks) ? item.landmarks.join(", ") : (item.landmarks as unknown as string) || "",
      status: item.status || "تشغيل فعلي",
    });
    setShowStationModal(true);
  };

  const handleReorderStations = async (sourceStation: LrtStation, targetStation: LrtStation) => {
    if (!sourceStation || !targetStation) return;
    const sourceKey = getStationKey(sourceStation);
    const targetKey = getStationKey(targetStation);
    if (sourceKey === targetKey) return;

    const lineType = sourceStation.line_type;
    const targetLine = targetStation.line_type;

    if (lineType !== targetLine) {
      setError("لا يمكن السحب بين مسارات مختلفة، يرجى إعادة الترتيب داخل نفس المسار.");
      return;
    }

    setIsReordering(true);
    setError("");

    const masterCopy = [...lrtStations];
    let lineStations = masterCopy
      .filter(s => s.line_type === lineType)
      .sort((a, b) => (Number(a.station_order) || 0) - (Number(b.station_order) || 0));

    const sourceIndex = lineStations.findIndex(s => getStationKey(s) === sourceKey);
    const targetIndex = lineStations.findIndex(s => getStationKey(s) === targetKey);

    if (sourceIndex === -1 || targetIndex === -1) {
      setIsReordering(false);
      return;
    }

    const [movedItem] = lineStations.splice(sourceIndex, 1);
    lineStations.splice(targetIndex, 0, movedItem);

    const changedStations: LrtStation[] = [];
    lineStations = lineStations.map((st, idx) => {
      const newOrder = idx + 1;
      if (st.station_order !== newOrder) {
        changedStations.push({ ...st, station_order: newOrder });
      }
      return { ...st, station_order: newOrder };
    });

    const otherStations = masterCopy.filter(s => s.line_type !== lineType);
    const newMasterList = [...otherStations, ...lineStations].sort((a, b) => {
      if (a.line_type !== b.line_type) {
        return a.line_type.localeCompare(b.line_type);
      }
      return (Number(a.station_order) || 0) - (Number(b.station_order) || 0);
    });

    setLrtStations(newMasterList);
    saveLocalStations(newMasterList);

    if (dbStatus && supabase && changedStations.length > 0) {
      try {
        for (const st of changedStations) {
          if (st.id) {
            await supabase
              .from("lrt_stations")
              .update({ station_order: st.station_order })
              .eq("id", st.id);
          }
        }
        setSuccess(`تم تحديث وحفظ ترتيب محطات ${getLineLabel(lineType)} بنجاح.`);
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error("DB reorder error:", errorObj);
        setError("تم حفظ الترتيب محلياً، لكن تعذر التحديث في قاعدة البيانات: " + errorObj.message);
      }
    } else {
      setSuccess(`تم حفظ ترتيب محطات ${getLineLabel(lineType)} بنجاح.`);
    }

    setIsReordering(false);
    setDraggedStationId(null);
    setDragOverStationId(null);
  };

  const handleMoveStation = async (station: LrtStation, direction: "up" | "down") => {
    const lineType = station.line_type;
    const lineStations = lrtStations
      .filter(s => s.line_type === lineType)
      .sort((a, b) => (Number(a.station_order) || 0) - (Number(b.station_order) || 0));

    const stationKey = getStationKey(station);
    const currIndex = lineStations.findIndex(s => getStationKey(s) === stationKey);
    if (currIndex === -1) return;

    const targetIndex = direction === "up" ? currIndex - 1 : currIndex + 1;
    if (targetIndex < 0 || targetIndex >= lineStations.length) return;

    const targetStation = lineStations[targetIndex];
    await handleReorderStations(station, targetStation);
  };

  const handleStationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const landmarksArray = typeof stationForm.landmarks === "string"
      ? stationForm.landmarks.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const payload: Partial<LrtStation> = {
      name: stationForm.name,
      line_type: stationForm.line_type,
      station_order: Number(stationForm.station_order) || 1,
      landmarks: landmarksArray,
      status: stationForm.status,
    };

    if (dbStatus && supabase) {
      try {
        let query;
        if (editingStation) {
          query = supabase
            .from("lrt_stations")
            .update(payload)
            .eq("id", editingStation.id);
        } else {
          const sameLine = lrtStations.filter(s => s.line_type === payload.line_type);
          if (sameLine.some(s => Number(s.station_order) === Number(payload.station_order))) {
            for (const s of sameLine) {
              if (Number(s.station_order) >= Number(payload.station_order) && s.id) {
                await supabase
                  .from("lrt_stations")
                  .update({ station_order: Number(s.station_order) + 1 })
                  .eq("id", s.id);
              }
            }
          }
          query = supabase
            .from("lrt_stations")
            .insert([payload]);
        }

        const { error: dbErr } = await query;
        if (dbErr) throw dbErr;

        setSuccess(editingStation ? "تم تعديل المحطة بنجاح في قاعدة البيانات." : "تم إضافة المحطة بنجاح لقاعدة البيانات.");
        await fetchStationsData();
        setShowStationModal(false);
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error(errorObj);
        let errMsg = "فشلت العملية في قاعدة البيانات: " + errorObj.message;
        if (errorObj.message && (errorObj.message.includes("lrt_stations") || errorObj.message.includes("relation") || errorObj.message.includes("column"))) {
          errMsg += " (تنبيه: قد لا يكون جدول lrt_stations مهيئاً في قاعدة البيانات. يرجى تشغيل كود SQL الخاص بالقطار الكهربائي في لوحة تحكم Supabase لتفعيله).";
        }
        setError(errMsg);
      }
    } else {
      let currentLocal = getLocalStations();
      if (editingStation) {
        currentLocal = currentLocal.map((item: LrtStation) => {
          if (editingStation.id && item.id === editingStation.id) {
            return { ...item, ...payload };
          }
          if (!editingStation.id && item.name === editingStation.name && item.line_type === editingStation.line_type) {
            return { ...item, ...payload };
          }
          return item;
        });
        setSuccess("تم تعديل المحطة بنجاح محلياً (LocalStorage).");
      } else {
        currentLocal = currentLocal.map((item: LrtStation) => {
          if (item.line_type === payload.line_type && Number(item.station_order) >= Number(payload.station_order)) {
            return { ...item, station_order: Number(item.station_order) + 1 };
          }
          return item;
        });

        const newRecord: LrtStation = {
          id: Math.random().toString(36).substring(2, 11),
          name: payload.name || "",
          line_type: payload.line_type || "trunk",
          station_order: payload.station_order || 1,
          landmarks: payload.landmarks || [],
          status: payload.status || "تشغيل فعلي",
        };
        currentLocal.push(newRecord);
        currentLocal.sort((a: LrtStation, b: LrtStation) => {
          if (a.line_type !== b.line_type) return a.line_type.localeCompare(b.line_type);
          return (Number(a.station_order) || 0) - (Number(b.station_order) || 0);
        });
        setSuccess("تم إضافة المحطة بنجاح محلياً (LocalStorage).");
      }
      saveLocalStations(currentLocal);
      setLrtStations(currentLocal);
      setShowStationModal(false);
    }
  };

  const handleStationDelete = (item: LrtStation) => {
    setStationToDelete(item);
  };

  const confirmDeleteStation = async () => {
    if (!stationToDelete) return;
    setIsDeleting(true);
    setError("");
    setSuccess("");

    if (dbStatus && supabase) {
      try {
        const { error: dbErr } = await supabase
          .from("lrt_stations")
          .delete()
          .eq("id", stationToDelete.id);

        if (dbErr) throw dbErr;

        setSuccess("تم حذف المحطة بنجاح من قاعدة البيانات.");
        await fetchStationsData();
        setStationToDelete(null);
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error(errorObj);
        setError("فشلت عملية الحذف: " + errorObj.message);
      } finally {
        setIsDeleting(false);
      }
    } else {
      let currentLocal = getLocalStations();
      currentLocal = currentLocal.filter((s: LrtStation) => {
        if (stationToDelete.id && s.id === stationToDelete.id) return false;
        if (!stationToDelete.id && s.name === stationToDelete.name && s.line_type === stationToDelete.line_type) return false;
        return true;
      });
      saveLocalStations(currentLocal);
      setLrtStations(currentLocal);
      setSuccess("تم حذف المحطة بنجاح محلياً.");
      setStationToDelete(null);
      setIsDeleting(false);
    }
  };

  const handlePricesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (pricesDbStatus && supabase) {
      try {
        for (const tier of ticketPrices) {
          let query;
          if (tier.id) {
            query = supabase
              .from("lrt_prices")
              .update({ price: Number(tier.price), max_stations: Number(tier.max_stations) })
              .eq("id", tier.id);
          } else {
            query = supabase
              .from("lrt_prices")
              .insert([{ tier_name: tier.tier_name, max_stations: Number(tier.max_stations), price: Number(tier.price) }]);
          }
          const { error: dbErr } = await query;
          if (dbErr) throw dbErr;
        }
        setSuccess("تم حفظ أسعار تذاكر القطار الكهربائي في قاعدة البيانات بنجاح.");
        await fetchPricesData();
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error(errorObj);
        // Fallback to local storage so changes are not lost
        saveLocalPrices(ticketPrices);
        setPricesDbStatus(false);
        if (errorObj.message && (errorObj.message.includes("lrt_prices") || errorObj.message.includes("schema cache") || errorObj.message.includes("relation"))) {
          setSuccess("تم حفظ أسعار التذاكر بنجاح محلياً في متصفحك (LocalStorage). لتمكين الحفظ الدائم في قاعدة البيانات، يرجى تشغيل كود SQL لإنشاء جدول lrt_prices في لوحة تحكم Supabase.");
        } else {
          setError("فشل الحفظ في قاعدة البيانات: " + errorObj.message + " (تم الحفظ مؤقتاً في متصفحك).");
        }
      }
    } else {
      saveLocalPrices(ticketPrices);
      setSuccess("تم حفظ أسعار تذاكر القطار الكهربائي محلياً (LocalStorage) بنجاح.");
    }
  };

  const handlePriceFieldChange = (index: number, field: keyof LrtPrice, val: unknown) => {
    const updated = [...ticketPrices];
    updated[index] = { ...updated[index], [field]: val };
    setTicketPrices(updated);
  };

  const handleToggleSelectRow = (stationKey: string) => {
    setSelectedStationKeys(prev =>
      prev.includes(stationKey) ? prev.filter(k => k !== stationKey) : [...prev, stationKey]
    );
  };

  // Filtered rows for station view
  const filteredRows = useMemo(() => {
    let rows = [...lrtStations];
    if (adminActiveLine !== "all") {
      rows = rows.filter(s => s.line_type === adminActiveLine);
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.landmarks && Array.isArray(s.landmarks) && s.landmarks.some((l: string) => l.toLowerCase().includes(q)))
      );
    }
    return rows;
  }, [lrtStations, adminActiveLine, searchQuery]);

  // Pagination calculations
  const totalFiltered = filteredRows.length;
  const pageCount = Math.ceil(totalFiltered / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), pageCount);
  const startItem = totalFiltered === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalFiltered);
  const paginatedRows = useMemo(() => {
    return filteredRows.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);
  }, [filteredRows, safeCurrentPage, pageSize]);

  const handleToggleSelectAll = () => {
    const allPageSelected = paginatedRows.length > 0 && paginatedRows.every(s => selectedStationKeys.includes(getStationKey(s)));
    if (allPageSelected) {
      const pageKeys = new Set(paginatedRows.map(s => getStationKey(s)));
      setSelectedStationKeys(prev => prev.filter(k => !pageKeys.has(k)));
    } else {
      const pageKeys = paginatedRows.map(s => getStationKey(s));
      setSelectedStationKeys(prev => Array.from(new Set([...prev, ...pageKeys])));
    }
  };

  const clearSelection = () => {
    setSelectedStationKeys([]);
  };

  return {
    // Auth & Status
    isAdmin,
    loading,
    authLoading,
    dbStatus,
    error,
    setError,
    success,
    setSuccess,

    // Section
    activeSection,
    setActiveSection,

    // Stations & Prices Data
    lrtStations,
    ticketPrices,
    adminActiveLine,
    setAdminActiveLine,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,

    // Pagination & Selection
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    selectedStationKeys,
    setSelectedStationKeys,
    handleToggleSelectRow,
    handleToggleSelectAll,
    clearSelection,

    // Filtered / Paginated lists
    filteredRows,
    paginatedRows,
    totalFiltered,
    pageCount,
    safeCurrentPage,
    startItem,
    endItem,

    // Drag and Drop & Reorder
    draggedStationId,
    setDraggedStationId,
    dragOverStationId,
    setDragOverStationId,
    isReordering,
    handleReorderStations,
    handleMoveStation,

    // Station Add / Edit Form Modal
    showStationModal,
    setShowStationModal,
    editingStation,
    stationForm,
    setStationForm,
    handleOpenAddStation,
    handleOpenEditStation,
    handleStationSubmit,

    // Station Delete Modal
    stationToDelete,
    setStationToDelete,
    isDeleting,
    handleStationDelete,
    confirmDeleteStation,

    // View Details Modal
    viewingStation,
    setViewingStation,

    // Floating Action Menu
    actionMenuState,
    setActionMenuState,
    handleToggleActionMenu,

    // Floating Columns Menu
    visibleColumns,
    setVisibleColumns,
    columnsMenuOpen,
    setColumnsMenuOpen,
    columnsMenuPos,
    handleToggleColumnsMenu,

    // Prices Form
    handlePricesSubmit,
    handlePriceFieldChange,
  };
}
