"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  Airport,
  AirportFormData,
  VisibleColumns,
  ActionMenuState,
  ColumnsMenuPosition,
} from "../types";
import {
  INITIAL_AIRPORT_FORM,
  INITIAL_VISIBLE_COLUMNS,
} from "../constants";
import {
  isUUID,
  filterAirports,
  parseCommaList,
} from "../utils";
import { DEFAULT_AIRPORTS } from "@/data/airports";

export function useAdminAirports() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);

  // Global Alerts
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Data & Filters
  const [airportsData, setAirportsData] = useState<Airport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // View Mode & Pagination
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(INITIAL_VISIBLE_COLUMNS);
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [columnsMenuPos, setColumnsMenuPos] = useState<ColumnsMenuPosition>({ top: 0, left: 0 });

  // Floating 3-dots Menu
  const [actionMenuState, setActionMenuState] = useState<ActionMenuState | null>(null);

  // Viewing Details Modal
  const [viewingAirport, setViewingAirport] = useState<Airport | null>(null);

  // Selection & Bulk Delete
  const [selectedAirportKeys, setSelectedAirportKeys] = useState<Record<string, boolean>>({});
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Form Modal (Add / Edit)
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Airport | null>(null);
  const [formData, setFormData] = useState<AirportFormData>(INITIAL_AIRPORT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation Modal
  const [airportToDelete, setAirportToDelete] = useState<Airport | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(`[role="menu"]`) || target?.closest(`button[data-toggle-action]`)) {
        return;
      }
      setActionMenuState(null);
      setColumnsMenuOpen(false);
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("touchstart", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Local storage helpers
  const getLocalData = (): Airport[] => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("local_airports");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return DEFAULT_AIRPORTS;
        }
      }
    }
    return DEFAULT_AIRPORTS;
  };

  const saveLocalData = (data: Airport[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("local_airports", JSON.stringify(data));
    }
  };

  // Fetch Data from Supabase with LocalStorage fallback
  const fetchAirportsData = useCallback(async () => {
    if (!supabase) {
      setAirportsData(getLocalData());
      setDbConnected(false);
      return;
    }

    try {
      const { data, error: dbErr } = await supabase.from("airports").select("*");
      if (dbErr) {
        console.warn("Failed to fetch airports from database, using fallback:", dbErr);
        setAirportsData(getLocalData());
        setDbConnected(false);
      } else {
        const mappedData = data || [];
        const enriched: Airport[] = mappedData.map((dbAirport: any) => {
          const localMatch = DEFAULT_AIRPORTS.find(
            (la) =>
              (la.iata_code && dbAirport.code && la.iata_code.toLowerCase() === dbAirport.code.toLowerCase()) ||
              (la.iata_code && dbAirport.iata_code && la.iata_code.toLowerCase() === dbAirport.iata_code.toLowerCase()) ||
              (la.name_ar && dbAirport.name && la.name_ar.includes(dbAirport.name))
          );

          return {
            ...localMatch,
            ...dbAirport,
            id: dbAirport.id || localMatch?.id || Date.now(),
            name_ar: dbAirport.name_ar || dbAirport.name || localMatch?.name_ar || "",
            name_en: dbAirport.name_en || localMatch?.name_en || "",
            slug: dbAirport.slug || localMatch?.slug || "",
            iata_code: dbAirport.iata_code || dbAirport.code || localMatch?.iata_code || "",
            icao_code: dbAirport.icao_code || localMatch?.icao_code || "",
            city_ar: dbAirport.city_ar || dbAirport.city || localMatch?.city_ar || "",
            city_en: dbAirport.city_en || localMatch?.city_en || "",
            governorate_ar: dbAirport.governorate_ar || dbAirport.governorate || localMatch?.governorate_ar || "",
            governorate_en: dbAirport.governorate_en || localMatch?.governorate_en || "",
            area_ar: dbAirport.area_ar || dbAirport.region || localMatch?.area_ar || "",
            type: dbAirport.type || localMatch?.type || "دولي",
            type_en: dbAirport.type_en || localMatch?.type_en || "international",
            status: dbAirport.status || localMatch?.status || "active",
            latitude: dbAirport.latitude ? parseFloat(dbAirport.latitude) : (localMatch?.latitude || 0),
            longitude: dbAirport.longitude ? parseFloat(dbAirport.longitude) : (localMatch?.longitude || 0),
            short_description: dbAirport.short_desc || dbAirport.short_description || localMatch?.short_description || "",
            description: dbAirport.detailed_desc || dbAirport.description || localMatch?.description || "",
            address: dbAirport.address || localMatch?.address || "",
            capacity: dbAirport.capacity || localMatch?.capacity || "",
            terminals_count: dbAirport.terminals_count || dbAirport.terminals || localMatch?.terminals_count || "غير محدد",
            runways_count: dbAirport.runways_count || localMatch?.runways_count || "",
            runways_length: dbAirport.runways_length || localMatch?.runways_length || "",
            domestic_flights: dbAirport.domestic_flights || localMatch?.domestic_flights || "",
            international_flights: dbAirport.international_flights || localMatch?.international_flights || "",
            services: Array.isArray(dbAirport.services) ? dbAirport.services : (localMatch?.services || []),
            airlines: dbAirport.airlines || localMatch?.airlines || "",
            destinations: dbAirport.destinations || localMatch?.destinations || "",
            connections: Array.isArray(dbAirport.connections) ? dbAirport.connections : (localMatch?.connections || []),
            nearby_landmarks: Array.isArray(dbAirport.landmarks)
              ? dbAirport.landmarks
              : Array.isArray(dbAirport.nearby_landmarks)
              ? dbAirport.nearby_landmarks
              : (localMatch?.nearby_landmarks || []),
            transportation: Array.isArray(dbAirport.transit)
              ? dbAirport.transit
              : Array.isArray(dbAirport.transportation)
              ? dbAirport.transportation
              : (localMatch?.transportation || []),
            parking: dbAirport.parking || localMatch?.parking || "",
            official_website: dbAirport.official_website || localMatch?.official_website || "",
            phone: dbAirport.phone || localMatch?.phone || "غير متوفر",
            map_url: dbAirport.map_url || localMatch?.map_url || "",
            keywords_ar: Array.isArray(dbAirport.keywords_ar) ? dbAirport.keywords_ar : (localMatch?.keywords_ar || []),
            keywords_en: Array.isArray(dbAirport.keywords_en) ? dbAirport.keywords_en : (localMatch?.keywords_en || []),
          } as Airport;
        });

        const dbCodes = new Set(mappedData.map((d: any) => (d.code || d.iata_code || "").toLowerCase()));
        const missingLocals = DEFAULT_AIRPORTS.filter(
          (la) => la.iata_code && !dbCodes.has(la.iata_code.toLowerCase())
        );

        const merged = [...enriched, ...missingLocals];
        setAirportsData(merged);
        setDbConnected(true);
        saveLocalData(merged);
      }
    } catch (err) {
      console.error("fetchAirportsData error:", err);
      setAirportsData(getLocalData());
      setDbConnected(false);
    }
  }, []);

  // Auth & Admin check
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const checkAdmin = async () => {
      if (
        profile?.is_admin ||
        user.email === "admin@cairomap.com" ||
        user.user_metadata?.role === "admin"
      ) {
        setIsAdmin(true);
        await fetchAirportsData();
        setLoading(false);
        return;
      }

      if (!supabase) {
        setIsAdmin(true);
        setAirportsData(getLocalData());
        setDbConnected(false);
        setLoading(false);
        return;
      }

      try {
        const { data: dbProfile, error: profileErr } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (profileErr || !dbProfile?.is_admin) {
          router.push("/");
        } else {
          setIsAdmin(true);
          await fetchAirportsData();
        }
      } catch (err) {
        console.error("Auth authorization check failed:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user, profile, authLoading, router, fetchAirportsData]);

  // Filtered Airports
  const filteredAirports = useMemo(() => {
    return filterAirports(airportsData, searchQuery, typeFilter);
  }, [airportsData, searchQuery, typeFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, pageSize]);

  // Paginated Airports
  const paginatedAirports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAirports.slice(start, start + pageSize);
  }, [filteredAirports, currentPage, pageSize]);

  // Column Menu Handlers
  const handleToggleColumnsMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setColumnsMenuPos({
      top: rect.bottom + window.scrollY + 6,
      left: Math.max(10, rect.left + window.scrollX - 120),
    });
    setColumnsMenuOpen((prev) => !prev);
  };

  const handleToggleColumn = (key: keyof VisibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 3-dots Action Menu Handlers
  const handleToggleActionMenu = (
    item: Airport,
    key: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (actionMenuState && actionMenuState.key === key) {
      setActionMenuState(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setActionMenuState({
      item,
      key,
      top: rect.bottom + window.scrollY + 4,
      left: Math.max(10, rect.left + window.scrollX - 140),
    });
  };

  // Selection & Bulk Delete Handlers
  const selectedCount = useMemo(() => {
    return Object.values(selectedAirportKeys).filter(Boolean).length;
  }, [selectedAirportKeys]);

  const toggleSelectAirport = (airportKey: string) => {
    setSelectedAirportKeys((prev) => ({
      ...prev,
      [airportKey]: !prev[airportKey],
    }));
  };

  const toggleSelectAll = (currentAirports: Airport[]) => {
    const allSelected =
      currentAirports.length > 0 &&
      currentAirports.every((a) => selectedAirportKeys[String(a.id || a.iata_code || a.name_ar)]);

    if (allSelected) {
      setSelectedAirportKeys({});
    } else {
      const next: Record<string, boolean> = { ...selectedAirportKeys };
      currentAirports.forEach((a) => {
        const k = String(a.id || a.iata_code || a.name_ar);
        next[k] = true;
      });
      setSelectedAirportKeys(next);
    }
  };

  const clearSelection = () => {
    setSelectedAirportKeys({});
  };

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

    const keysToDelete = Object.keys(selectedAirportKeys).filter(
      (k) => selectedAirportKeys[k]
    );

    try {
      if (dbConnected && supabase) {
        const uuidKeys = keysToDelete.filter(isUUID);
        if (uuidKeys.length > 0) {
          const { error: delErr } = await supabase
            .from("airports")
            .delete()
            .in("id", uuidKeys);
          if (delErr) throw delErr;
        }
      }

      // Update state and local storage
      const remaining = airportsData.filter((a) => {
        const k = String(a.id || a.iata_code || a.name_ar);
        return !selectedAirportKeys[k];
      });

      setAirportsData(remaining);
      saveLocalData(remaining);
      setSelectedAirportKeys({});
      setShowBulkDeleteModal(false);
      setSuccess(`تم حذف (${keysToDelete.length}) من المطارات المحددة بنجاح.`);
    } catch (err: any) {
      console.error("Bulk delete error:", err);
      setError("فشل الحذف الجماعي: " + (err.message || "حدث خطأ غير متوقع"));
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // Add / Edit Modal Handlers
  const handleOpenAdd = () => {
    setError("");
    setSuccess("");
    setEditingItem(null);
    setFormData(INITIAL_AIRPORT_FORM);
    setShowModal(true);
  };

  const handleOpenEdit = (item: Airport) => {
    setError("");
    setSuccess("");
    setEditingItem(item);

    setFormData({
      name: item.name_ar || (item as any).name || "",
      name_ar: item.name_ar || (item as any).name || "",
      name_en: item.name_en || "",
      code: item.iata_code || (item as any).code || "",
      iata_code: item.iata_code || (item as any).code || "",
      icao_code: item.icao_code || "",
      type: item.type || "دولي",
      type_en: item.type_en || "international",
      status: item.status || "active",
      governorate_ar: item.governorate_ar || (item as any).governorate || "",
      governorate_en: item.governorate_en || "",
      city: item.city_ar || (item as any).city || "",
      city_ar: item.city_ar || (item as any).city || "",
      city_en: item.city_en || "",
      area_ar: item.area_ar || (item as any).region || "",
      address: item.address || "",
      latitude: item.latitude || "",
      longitude: item.longitude || "",
      short_description: item.short_description || (item as any).short_desc || "",
      description: item.description || (item as any).detailed_desc || "",
      terminals_count: item.terminals_count || (item as any).terminals || "",
      capacity: item.capacity || "",
      runways_count: item.runways_count || "",
      runways_length: item.runways_length || "",
      terminals: (item as any).terminals || item.terminals_count || "",
      domestic_flights: item.domestic_flights || "",
      international_flights: item.international_flights || "",
      airlines: item.airlines || "",
      destinations: item.destinations || "",
      connections: Array.isArray(item.connections) ? item.connections.join(", ") : (item.connections || ""),
      nearby_landmarks: Array.isArray(item.nearby_landmarks) ? item.nearby_landmarks.join(", ") : (item.nearby_landmarks || ""),
      transportation: Array.isArray(item.transportation) ? item.transportation.join(", ") : (item.transportation || ""),
      services: Array.isArray(item.services) ? item.services.join(", ") : (item.services || ""),
      parking: item.parking || "",
      official_website: item.official_website || "",
      phone: item.phone || "",
      map_url: item.map_url || "",
      keywords_ar: Array.isArray(item.keywords_ar) ? item.keywords_ar.join(", ") : (item.keywords_ar || ""),
      keywords_en: Array.isArray(item.keywords_en) ? item.keywords_en.join(", ") : (item.keywords_en || ""),
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleFormFieldChange = (field: keyof AirportFormData, value: string | number) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name") {
        next.name_ar = String(value);
      } else if (field === "name_ar") {
        next.name = String(value);
      } else if (field === "code") {
        next.iata_code = String(value).toUpperCase();
        next.code = String(value).toUpperCase();
      } else if (field === "iata_code") {
        next.code = String(value).toUpperCase();
        next.iata_code = String(value).toUpperCase();
      } else if (field === "city") {
        next.city_ar = String(value);
      } else if (field === "city_ar") {
        next.city = String(value);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const connectionsArr = parseCommaList(formData.connections);
    const landmarksArr = parseCommaList(formData.nearby_landmarks);
    const transportArr = parseCommaList(formData.transportation);
    const servicesArr = parseCommaList(formData.services);
    const keywordsArArr = parseCommaList(formData.keywords_ar);
    const keywordsEnArr = parseCommaList(formData.keywords_en);

    const lat = formData.latitude ? parseFloat(String(formData.latitude)) : 0;
    const lng = formData.longitude ? parseFloat(String(formData.longitude)) : 0;

    const payload: Partial<Airport> & Record<string, any> = {
      name: formData.name || formData.name_ar,
      name_ar: formData.name_ar || formData.name,
      name_en: formData.name_en,
      code: formData.code || formData.iata_code,
      iata_code: formData.iata_code || formData.code,
      icao_code: formData.icao_code,
      type: formData.type,
      type_en: formData.type_en,
      status: formData.status || "active",
      governorate: formData.governorate_ar,
      governorate_ar: formData.governorate_ar,
      governorate_en: formData.governorate_en,
      city: formData.city || formData.city_ar,
      city_ar: formData.city_ar || formData.city,
      city_en: formData.city_en,
      region: formData.area_ar,
      area_ar: formData.area_ar,
      address: formData.address,
      latitude: lat,
      longitude: lng,
      coordinates: `${lat}° N, ${lng}° E`,
      short_desc: formData.short_description,
      short_description: formData.short_description,
      detailed_desc: formData.description,
      description: formData.description,
      terminals: formData.terminals || formData.terminals_count,
      terminals_count: formData.terminals_count || formData.terminals,
      capacity: formData.capacity,
      runways_count: formData.runways_count,
      runways_length: formData.runways_length,
      domestic_flights: formData.domestic_flights,
      international_flights: formData.international_flights,
      airlines: formData.airlines,
      destinations: formData.destinations,
      connections: connectionsArr,
      landmarks: landmarksArr,
      nearby_landmarks: landmarksArr,
      transit: transportArr,
      transportation: transportArr,
      services: servicesArr,
      parking: formData.parking,
      official_website: formData.official_website,
      phone: formData.phone,
      map_url: formData.map_url,
      keywords_ar: keywordsArArr,
      keywords_en: keywordsEnArr,
      search_keywords: [...keywordsArArr, ...keywordsEnArr].join(", "),
    };

    try {
      if (dbConnected && supabase) {
        const isEditingDbRecord = editingItem && editingItem.id && isUUID(editingItem.id);

        const dbPayload = {
          name: payload.name || "",
          code: payload.code || "",
          city: payload.city || "",
          type: payload.type || "",
          terminals: payload.terminals || "",
          services: payload.services || [],
          airlines: payload.airlines || "",
          phone: payload.phone || "",
          map_url: payload.map_url || "",
          name_en: payload.name_en || "",
          iata_code: payload.iata_code || "",
          icao_code: payload.icao_code || "",
          governorate: payload.governorate || "",
          region: payload.region || "",
          short_desc: payload.short_desc || "",
          detailed_desc: payload.detailed_desc || "",
          coordinates: payload.coordinates || "",
          address: payload.address || "",
          capacity: payload.capacity || "",
          runways_count: payload.runways_count || "",
          runways_length: payload.runways_length || "",
          domestic_flights: payload.domestic_flights || "",
          international_flights: payload.international_flights || "",
          destinations: payload.destinations || "",
          landmarks: payload.landmarks || [],
          transit: payload.transit || [],
          parking: payload.parking || "",
          official_website: payload.official_website || "",
          search_keywords: payload.search_keywords || "",
        };

        const basicPayload = {
          name: payload.name || "",
          code: payload.code || "",
          city: payload.city || "",
          type: payload.type || "",
          terminals: payload.terminals || "",
          services: payload.services || [],
          airlines: payload.airlines || "",
          phone: payload.phone || "",
          map_url: payload.map_url || "",
        };

        if (isEditingDbRecord) {
          const { error: updateErr } = await supabase
            .from("airports")
            .update(dbPayload)
            .eq("id", editingItem.id);

          if (updateErr) {
            const errorMsg = updateErr.message || "";
            if (errorMsg.includes("Could not find the") || errorMsg.includes("column") || updateErr.code === "PGRST102") {
              const { error: retryErr } = await supabase
                .from("airports")
                .update(basicPayload)
                .eq("id", editingItem.id);
              if (retryErr) throw retryErr;
            } else {
              throw updateErr;
            }
          }
          setSuccess("تم تحديث بيانات المطار بنجاح في قاعدة البيانات.");
        } else {
          const { error: insertErr } = await supabase
            .from("airports")
            .insert(dbPayload);

          if (insertErr) {
            const errorMsg = insertErr.message || "";
            if (errorMsg.includes("Could not find the") || errorMsg.includes("column") || insertErr.code === "PGRST102") {
              const { error: retryErr } = await supabase
                .from("airports")
                .insert(basicPayload);
              if (retryErr) throw retryErr;
            } else {
              throw insertErr;
            }
          }
          setSuccess("تم إضافة المطار بنجاح إلى قاعدة البيانات.");
        }

        await fetchAirportsData();
        setShowModal(false);
      } else {
        // LocalStorage fallback
        let currentLocal = getLocalData();
        if (editingItem) {
          currentLocal = currentLocal.map((item) => {
            if (editingItem.id && item.id === editingItem.id) {
              return { ...item, ...payload } as Airport;
            }
            if (!editingItem.id && item.name_ar === editingItem.name_ar) {
              return { ...item, ...payload } as Airport;
            }
            return item;
          });
          setSuccess("تم تعديل السجل بنجاح محلياً.");
        } else {
          const newRecord = {
            id: Date.now(),
            slug: (formData.name_en || "airport").toLowerCase().replace(/\s+/g, "-"),
            ...payload,
          } as Airport;
          currentLocal = [newRecord, ...currentLocal];
          setSuccess("تم إضافة المطار بنجاح محلياً.");
        }

        saveLocalData(currentLocal);
        setAirportsData(currentLocal);
        setShowModal(false);
      }
    } catch (err: any) {
      console.error("Save airport error:", err);
      setError("فشلت عملية الحفظ: " + (err.message || "حدث خطأ غير متوقع"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Single Delete Handlers
  const handleDeleteClick = (item: Airport) => {
    setAirportToDelete(item);
  };

  const handleCancelDelete = () => {
    setAirportToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!airportToDelete) return;
    setIsDeleting(true);
    setError("");
    setSuccess("");

    try {
      if (dbConnected && supabase && airportToDelete.id && isUUID(airportToDelete.id)) {
        const { error: delErr } = await supabase
          .from("airports")
          .delete()
          .eq("id", airportToDelete.id);
        if (delErr) throw delErr;
        setSuccess("تم حذف المطار بنجاح من قاعدة البيانات.");
        await fetchAirportsData();
      } else {
        let currentLocal = getLocalData();
        currentLocal = currentLocal.filter((item) => {
          if (airportToDelete.id && item.id !== airportToDelete.id) return true;
          if (!airportToDelete.id && item.name_ar !== airportToDelete.name_ar) return true;
          return false;
        });
        saveLocalData(currentLocal);
        setAirportsData(currentLocal);
        setSuccess("تم حذف السجل بنجاح محلياً.");
      }
      setAirportToDelete(null);
    } catch (err: any) {
      console.error("Delete airport error:", err);
      setError("فشل الحذف: " + (err.message || "حدث خطأ غير متوقع"));
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    // Auth & Status
    isAdmin,
    loading,
    authLoading,
    dbConnected,
    error,
    setError,
    success,
    setSuccess,

    // Data & Filters
    airportsData,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    filteredAirports,
    paginatedAirports,

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

    // Floating 3-dots Menu
    actionMenuState,
    setActionMenuState,
    handleToggleActionMenu,

    // Details Modal
    viewingAirport,
    setViewingAirport,

    // Selection & Bulk Delete
    selectedAirportKeys,
    selectedCount,
    toggleSelectAirport,
    toggleSelectAll,
    clearSelection,
    showBulkDeleteModal,
    isBulkDeleting,
    handleOpenBulkDelete,
    handleCancelBulkDelete,
    handleConfirmBulkDelete,

    // Form Modal (Add / Edit)
    showModal,
    editingItem,
    formData,
    isSubmitting,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleFormFieldChange,
    handleSubmit,

    // Delete Modal
    airportToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
