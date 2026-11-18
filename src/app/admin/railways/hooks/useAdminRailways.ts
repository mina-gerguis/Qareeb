"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  RailwayRoute,
  RailwayStop,
  RailwayLineFormData,
  RailwayStationFormData,
  VisibleLineColumns,
  VisibleStationColumns,
  ActionMenuState,
  ColumnsMenuPosition,
} from "../types";
import {
  INITIAL_LINE_FORM,
  INITIAL_STATION_FORM,
  INITIAL_VISIBLE_LINE_COLUMNS,
  INITIAL_VISIBLE_STATION_COLUMNS,
  DEFAULT_RAILWAY_ROUTES,
} from "../constants";
import {
  getLocalRoutes,
  saveLocalRoutes,
  getRouteColor,
} from "../utils";
import railwaysStyles from "../admin-railways.module.css";

export function useAdminRailways() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<boolean>(true);

  // Active section: "lines" or "stations"
  const [activeSection, setActiveSection] = useState<"lines" | "stations">("lines");

  // Routes Data
  const [routes, setRoutes] = useState<RailwayRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");

  // Search Queries
  const [linesSearchQuery, setLinesSearchQuery] = useState("");
  const [stationsSearchQuery, setStationsSearchQuery] = useState("");

  // View Modes (responsive default)
  const [linesViewMode, setLinesViewMode] = useState<"table" | "cards">("table");
  const [stationsViewMode, setStationsViewMode] = useState<"table" | "cards">("table");

  // Pagination
  const [linesPageSize, setLinesPageSize] = useState<number>(10);
  const [linesCurrentPage, setLinesCurrentPage] = useState<number>(1);
  const [stationsPageSize, setStationsPageSize] = useState<number>(10);
  const [stationsCurrentPage, setStationsCurrentPage] = useState<number>(1);

  // Columns visibility
  const [visibleLineColumns, setVisibleLineColumns] = useState<VisibleLineColumns>(INITIAL_VISIBLE_LINE_COLUMNS);
  const [visibleStationColumns, setVisibleStationColumns] = useState<VisibleStationColumns>(INITIAL_VISIBLE_STATION_COLUMNS);
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [columnsMenuPos, setColumnsMenuPos] = useState<ColumnsMenuPosition | null>(null);

  // Line Modals
  const [showLineModal, setShowLineModal] = useState(false);
  const [editingLine, setEditingLine] = useState<RailwayRoute | null>(null);
  const [lineForm, setLineForm] = useState<RailwayLineFormData>(INITIAL_LINE_FORM);
  const [viewingLine, setViewingLine] = useState<RailwayRoute | null>(null);

  // Station Modals
  const [showStationModal, setShowStationModal] = useState(false);
  const [editingStation, setEditingStation] = useState<{ id?: string; index: number; name: string; status: "تعمل" | "تشغيل فعلي" | "تحت الإنشاء" } | null>(null);
  const [stationForm, setStationForm] = useState<RailwayStationFormData>(INITIAL_STATION_FORM);

  // Drag and drop & reordering for stops
  const [draggedStopIdx, setDraggedStopIdx] = useState<number | null>(null);
  const [dragOverStopIdx, setDragOverStopIdx] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // Deletion Modal
  const [itemToDelete, setItemToDelete] = useState<{ type: "line" | "station"; item: any; index?: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Floating Action Menu
  const [actionMenuState, setActionMenuState] = useState<ActionMenuState | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Responsive default view mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mode = window.innerWidth < 768 ? "cards" : "table";
      setLinesViewMode(mode);
      setStationsViewMode(mode);
    }
  }, []);

  // Reset pagination on search
  useEffect(() => {
    setLinesCurrentPage(1);
  }, [linesSearchQuery]);

  useEffect(() => {
    setStationsCurrentPage(1);
  }, [stationsSearchQuery, selectedRouteId]);

  // Click outside listener for popovers
  useEffect(() => {
    if (!actionMenuState && !columnsMenuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(`.${railwaysStyles.actionDropdownMenu}`) ||
        target.closest(`.${railwaysStyles.columnsDropdownMenu}`) ||
        target.closest(`.${railwaysStyles.moreMenuBtn}`) ||
        target.closest(`.${railwaysStyles.columnsToggleBtn}`)
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

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      setDbStatus(false);
      const local = getLocalRoutes();
      setRoutes(local);
      if (local.length > 0 && !selectedRouteId) {
        setSelectedRouteId(local[0].id);
      }
      setLoading(false);
      return;
    }

    try {
      const { data: routesData, error: routesErr } = await supabase
        .from("railway_routes")
        .select("*");

      if (routesErr) throw routesErr;

      const { data: stationsData, error: stationsErr } = await supabase
        .from("railway_stations")
        .select("*")
        .order("station_order", { ascending: true });

      if (stationsErr) throw stationsErr;

      const combined: RailwayRoute[] = (routesData || []).map((route: any) => {
        const stops: RailwayStop[] = (stationsData || [])
          .filter((s: any) => s.route_id === route.id)
          .map((s: any, idx: number) => ({
            id: s.id,
            name: s.name,
            status: (s.status === "تحت الإنشاء" ? "تحت الإنشاء" : "تشغيل فعلي") as "تشغيل فعلي" | "تحت الإنشاء",
            station_order: s.station_order || idx + 1,
          }));

        return {
          id: route.id,
          name: route.name,
          from: route.from_location,
          to: route.to_location,
          duration: route.duration,
          stops,
          classes: route.classes,
          tips: route.tips || "",
          color: getRouteColor(route.id),
        };
      });

      if (combined.length === 0) {
        const local = getLocalRoutes();
        setRoutes(local);
        if (!selectedRouteId && local.length > 0) setSelectedRouteId(local[0].id);
      } else {
        setRoutes(combined);
        setDbStatus(true);
        if (!selectedRouteId && combined.length > 0) {
          setSelectedRouteId(combined[0].id);
        }
      }
    } catch (err) {
      console.warn("Failed to load from Supabase, using localStorage", err);
      setDbStatus(false);
      const local = getLocalRoutes();
      setRoutes(local);
      if (local.length > 0 && !selectedRouteId) {
        setSelectedRouteId(local[0].id);
      }
    }
    setLoading(false);
  }, [selectedRouteId]);

  const checkAdminStatus = useCallback(async () => {
    try {
      if (!user) {
        router.push("/login");
        return;
      }
      if (!supabase) {
        setIsAdmin(true);
        loadRoutes();
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
        loadRoutes();
      }
    } catch (err) {
      console.error(err);
      router.push("/");
    }
  }, [user, router, loadRoutes]);

  useEffect(() => {
    if (!authLoading) {
      checkAdminStatus();
    }
  }, [authLoading, checkAdminStatus]);

  // Active route
  const activeRoute = useMemo(() => {
    return routes.find(r => r.id === selectedRouteId) || routes[0];
  }, [routes, selectedRouteId]);

  // Line CRUD
  const handleOpenAddLine = () => {
    setError("");
    setSuccess("");
    setEditingLine(null);
    setLineForm(INITIAL_LINE_FORM);
    setShowLineModal(true);
  };

  const handleOpenEditLine = (line: RailwayRoute) => {
    setError("");
    setSuccess("");
    setEditingLine(line);
    setLineForm({
      id: line.id,
      name: line.name,
      from: line.from,
      to: line.to,
      duration: line.duration,
      tips: line.tips || "",
    });
    setShowLineModal(true);
  };

  const handleSaveLine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lineForm.id || !lineForm.name || !lineForm.from || !lineForm.to) {
      setError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    const payload = {
      id: lineForm.id,
      name: lineForm.name,
      from_location: lineForm.from,
      to_location: lineForm.to,
      duration: lineForm.duration,
      tips: lineForm.tips,
    };

    if (dbStatus && supabase) {
      try {
        let query;
        if (editingLine) {
          query = supabase
            .from("railway_routes")
            .update(payload)
            .eq("id", editingLine.id);
        } else {
          query = supabase
            .from("railway_routes")
            .insert([payload]);
        }

        const { error: dbErr } = await query;
        if (dbErr) throw dbErr;

        setSuccess(editingLine ? "تم تعديل الخط بنجاح في قاعدة البيانات." : "تم إضافة الخط بنجاح لقاعدة البيانات.");
        await loadRoutes();
        setShowLineModal(false);
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error(errorObj);
        setError("فشلت العملية في قاعدة البيانات: " + errorObj.message);
      }
    } else {
      let updatedRoutes = [...routes];
      if (editingLine) {
        updatedRoutes = updatedRoutes.map(r => {
          if (r.id === editingLine.id) {
            return {
              ...r,
              id: lineForm.id,
              name: lineForm.name,
              from: lineForm.from,
              to: lineForm.to,
              duration: lineForm.duration,
              tips: lineForm.tips,
            };
          }
          return r;
        });
        setSuccess("تم تعديل الخط بنجاح محلياً.");
      } else {
        if (routes.some(r => r.id === lineForm.id)) {
          setError("كود الخط هذا مستخدم بالفعل، يرجى اختيار كود آخر.");
          return;
        }
        updatedRoutes.push({
          id: lineForm.id,
          name: lineForm.name,
          from: lineForm.from,
          to: lineForm.to,
          duration: lineForm.duration,
          tips: lineForm.tips,
          stops: [],
          color: getRouteColor(lineForm.id),
        });
        setSuccess("تم إضافة الخط الجديد بنجاح محلياً.");
      }

      saveLocalRoutes(updatedRoutes);
      setRoutes(updatedRoutes);
      setShowLineModal(false);
    }
  };

  const handleDeleteLine = (line: RailwayRoute) => {
    setItemToDelete({ type: "line", item: line });
  };

  // Station CRUD
  const handleOpenAddStation = () => {
    if (!activeRoute) {
      setError("الرجاء اختيار خط أولاً.");
      return;
    }
    setError("");
    setSuccess("");
    setEditingStation(null);
    setStationForm(INITIAL_STATION_FORM);
    setShowStationModal(true);
  };

  const handleOpenEditStation = (index: number, stop: RailwayStop) => {
    setError("");
    setSuccess("");
    setEditingStation({
      id: stop.id,
      index,
      name: stop.name,
      status: stop.status === "تحت الإنشاء" ? "تحت الإنشاء" : "تشغيل فعلي",
    });
    setStationForm({
      name: stop.name,
      status: stop.status === "تحت الإنشاء" ? "تحت الإنشاء" : "تشغيل فعلي",
    });
    setShowStationModal(true);
  };

  const handleSaveStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationForm.name) {
      setError("الرجاء إدخال اسم المحطة.");
      return;
    }

    if (dbStatus && supabase) {
      try {
        let dbErr;
        if (editingStation && editingStation.id) {
          const { error } = await supabase
            .from("railway_stations")
            .update({
              name: stationForm.name,
              status: stationForm.status,
            })
            .eq("id", editingStation.id);
          dbErr = error;
        } else {
          const order = (activeRoute?.stops.length || 0) + 1;
          const { error } = await supabase
            .from("railway_stations")
            .insert([{
              route_id: selectedRouteId,
              name: stationForm.name,
              status: stationForm.status,
              station_order: order,
            }]);
          dbErr = error;
        }

        if (dbErr) throw dbErr;

        setSuccess(editingStation ? "تم تعديل المحطة بنجاح في قاعدة البيانات." : "تم إضافة المحطة بنجاح لقاعدة البيانات.");
        await loadRoutes();
        setShowStationModal(false);
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error(errorObj);
        setError("فشلت العملية في قاعدة البيانات: " + errorObj.message);
      }
    } else {
      const updatedRoutes = routes.map(r => {
        if (r.id === selectedRouteId) {
          const updatedStops = [...r.stops];
          if (editingStation) {
            updatedStops[editingStation.index] = {
              ...updatedStops[editingStation.index],
              name: stationForm.name,
              status: stationForm.status,
            };
          } else {
            updatedStops.push({
              name: stationForm.name,
              status: stationForm.status,
              station_order: updatedStops.length + 1,
            });
          }
          return { ...r, stops: updatedStops };
        }
        return r;
      });

      saveLocalRoutes(updatedRoutes);
      setRoutes(updatedRoutes);
      setSuccess(editingStation ? "تم تعديل المحطة بنجاح محلياً." : "تم إضافة المحطة بنجاح محلياً.");
      setShowStationModal(false);
    }
  };

  const handleDeleteStation = (index: number, stop: RailwayStop) => {
    setItemToDelete({ type: "station", item: stop, index });
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    setError("");
    setSuccess("");

    if (itemToDelete.type === "line") {
      const lineToDelete = itemToDelete.item;
      if (dbStatus && supabase) {
        try {
          const { error: dbErr } = await supabase
            .from("railway_routes")
            .delete()
            .eq("id", lineToDelete.id);

          if (dbErr) throw dbErr;

          setSuccess("تم حذف الخط بنجاح من قاعدة البيانات.");
          await loadRoutes();
          setItemToDelete(null);
        } catch (err: unknown) {
          const errorObj = err as Error;
          console.error(errorObj);
          setError("فشل حذف الخط من قاعدة البيانات: " + errorObj.message);
        } finally {
          setIsDeleting(false);
        }
      } else {
        const updated = routes.filter(r => r.id !== lineToDelete.id);
        saveLocalRoutes(updated);
        setRoutes(updated);
        setSuccess("تم حذف الخط بنجاح محلياً.");
        if (selectedRouteId === lineToDelete.id && updated.length > 0) {
          setSelectedRouteId(updated[0].id);
        }
        setItemToDelete(null);
        setIsDeleting(false);
      }
    } else {
      // station delete
      const stopToDelete = itemToDelete.item;
      const stopIndex = itemToDelete.index!;

      if (dbStatus && supabase && stopToDelete.id) {
        try {
          const { error: dbErr } = await supabase
            .from("railway_stations")
            .delete()
            .eq("id", stopToDelete.id);

          if (dbErr) throw dbErr;

          setSuccess("تم حذف المحطة بنجاح من قاعدة البيانات.");
          await loadRoutes();
          setItemToDelete(null);
        } catch (err: unknown) {
          const errorObj = err as Error;
          console.error(errorObj);
          setError("فشل حذف المحطة من قاعدة البيانات: " + errorObj.message);
        } finally {
          setIsDeleting(false);
        }
      } else {
        const updatedRoutes = routes.map(r => {
          if (r.id === selectedRouteId) {
            const updatedStops = r.stops.filter((_, i) => i !== stopIndex);
            return { ...r, stops: updatedStops };
          }
          return r;
        });
        saveLocalRoutes(updatedRoutes);
        setRoutes(updatedRoutes);
        setSuccess("تم حذف المحطة بنجاح محلياً.");
        setItemToDelete(null);
        setIsDeleting(false);
      }
    }
  };

  // Reordering Stops with drag & drop or arrows
  const handleReorderStops = async (sourceIndex: number, targetIndex: number) => {
    if (!activeRoute || sourceIndex === targetIndex) return;
    setIsReordering(true);
    setError("");

    const stops = [...activeRoute.stops];
    const [movedItem] = stops.splice(sourceIndex, 1);
    stops.splice(targetIndex, 0, movedItem);

    // Re-assign station_order
    const updatedStops = stops.map((st, i) => ({ ...st, station_order: i + 1 }));

    const updatedRoutes = routes.map(r => {
      if (r.id === selectedRouteId) {
        return { ...r, stops: updatedStops };
      }
      return r;
    });

    setRoutes(updatedRoutes);
    saveLocalRoutes(updatedRoutes);

    if (dbStatus && supabase) {
      try {
        for (let i = 0; i < updatedStops.length; i++) {
          const st = updatedStops[i];
          if (st.id) {
            await supabase
              .from("railway_stations")
              .update({ station_order: i + 1 })
              .eq("id", st.id);
          }
        }
        setSuccess("تم تحديث وحفظ ترتيب المحطات بنجاح.");
      } catch (err: unknown) {
        const errorObj = err as Error;
        console.error(errorObj);
        setError("تم حفظ الترتيب محلياً، ولكن تعذر الحفظ بقاعدة البيانات: " + errorObj.message);
      }
    } else {
      setSuccess("تم حفظ ترتيب المحطات بنجاح محلياً.");
    }

    setIsReordering(false);
    setDraggedStopIdx(null);
    setDragOverStopIdx(null);
  };

  const handleMoveStop = async (index: number, direction: "up" | "down") => {
    if (!activeRoute) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeRoute.stops.length) return;
    await handleReorderStops(index, targetIndex);
  };

  // Action Menu toggle
  const handleToggleActionMenu = (type: "line" | "station", item: any, key: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (actionMenuState?.key === key) {
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
      key,
      type,
      item,
      top,
      left,
    });
  };

  // Columns Menu toggle
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

  // Filtered & Paginated Lines
  const filteredLines = useMemo(() => {
    if (!linesSearchQuery.trim()) return routes;
    const q = linesSearchQuery.toLowerCase();
    return routes.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.from.toLowerCase().includes(q) ||
      r.to.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q)
    );
  }, [routes, linesSearchQuery]);

  const paginatedLines = useMemo(() => {
    const start = (linesCurrentPage - 1) * linesPageSize;
    return filteredLines.slice(start, start + linesPageSize);
  }, [filteredLines, linesCurrentPage, linesPageSize]);

  // Filtered & Paginated Stops
  const filteredStops = useMemo(() => {
    const stops = activeRoute?.stops || [];
    if (!stationsSearchQuery.trim()) return stops;
    const q = stationsSearchQuery.toLowerCase();
    return stops.filter(s => s.name.toLowerCase().includes(q));
  }, [activeRoute, stationsSearchQuery]);

  const paginatedStops = useMemo(() => {
    const start = (stationsCurrentPage - 1) * stationsPageSize;
    return filteredStops.slice(start, start + stationsPageSize);
  }, [filteredStops, stationsCurrentPage, stationsPageSize]);

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

    // Routes data
    routes,
    selectedRouteId,
    setSelectedRouteId,
    activeRoute,

    // Lines controls & pagination
    linesSearchQuery,
    setLinesSearchQuery,
    linesViewMode,
    setLinesViewMode,
    linesPageSize,
    setLinesPageSize,
    linesCurrentPage,
    setLinesCurrentPage,
    visibleLineColumns,
    setVisibleLineColumns,
    filteredLines,
    paginatedLines,

    // Stations controls & pagination
    stationsSearchQuery,
    setStationsSearchQuery,
    stationsViewMode,
    setStationsViewMode,
    stationsPageSize,
    setStationsPageSize,
    stationsCurrentPage,
    setStationsCurrentPage,
    visibleStationColumns,
    setVisibleStationColumns,
    filteredStops,
    paginatedStops,

    // Drag and Drop & Reorder
    draggedStopIdx,
    setDraggedStopIdx,
    dragOverStopIdx,
    setDragOverStopIdx,
    isReordering,
    handleReorderStops,
    handleMoveStop,

    // Line Modals
    showLineModal,
    setShowLineModal,
    editingLine,
    lineForm,
    setLineForm,
    handleOpenAddLine,
    handleOpenEditLine,
    handleSaveLine,
    handleDeleteLine,
    viewingLine,
    setViewingLine,

    // Station Modals
    showStationModal,
    setShowStationModal,
    editingStation,
    stationForm,
    setStationForm,
    handleOpenAddStation,
    handleOpenEditStation,
    handleSaveStation,
    handleDeleteStation,

    // Deletion Modal
    itemToDelete,
    setItemToDelete,
    isDeleting,
    confirmDelete,

    // Dropdowns
    actionMenuState,
    setActionMenuState,
    handleToggleActionMenu,
    columnsMenuOpen,
    setColumnsMenuOpen,
    columnsMenuPos,
    handleToggleColumnsMenu,
  };
}
