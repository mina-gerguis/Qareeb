"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  HighwayItem,
  RoadNewsItem,
  RoadFormData,
  NewsFormData,
  VisibleColumnsRoads,
  VisibleColumnsNews,
  ActionMenuStateRoad,
  ActionMenuStateNews,
  ColumnsMenuPosition,
} from "../types";
import {
  INITIAL_ROAD_FORM,
  INITIAL_NEWS_FORM,
  INITIAL_VISIBLE_ROAD_COLUMNS,
  INITIAL_VISIBLE_NEWS_COLUMNS,
} from "../constants";
import {
  isUUID,
  filterRoads,
  filterNews,
} from "../utils";
import { DEFAULT_HIGHWAYS, DEFAULT_ROAD_NEWS } from "@/data/roads_info";
import roadsStyles from "../admin-roads-info.module.css";

export function useAdminRoadsInfo() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState<"roads" | "news">("roads");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);

  // Global Alerts
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =================== ROADS STATE ===================
  const [roadsData, setRoadsData] = useState<HighwayItem[]>([]);
  const [roadSearch, setRoadSearch] = useState("");
  const [roadTypeFilter, setRoadTypeFilter] = useState("all");

  const [roadViewMode, setRoadViewMode] = useState<"table" | "cards">("table");
  const [roadPageSize, setRoadPageSize] = useState<number>(10);
  const [currentRoadPage, setCurrentRoadPage] = useState<number>(1);

  const [visibleColumnsRoads, setVisibleColumnsRoads] = useState<VisibleColumnsRoads>(INITIAL_VISIBLE_ROAD_COLUMNS);
  const [columnsMenuRoadOpen, setColumnsMenuRoadOpen] = useState(false);
  const [columnsMenuRoadPos, setColumnsMenuRoadPos] = useState<ColumnsMenuPosition>({ top: 0, left: 0 });

  const [actionMenuRoad, setActionMenuRoad] = useState<ActionMenuStateRoad | null>(null);
  const [viewingRoad, setViewingRoad] = useState<HighwayItem | null>(null);

  const [selectedRoadKeys, setSelectedRoadKeys] = useState<Record<string, boolean>>({});
  const [showRoadBulkDeleteModal, setShowRoadBulkDeleteModal] = useState(false);
  const [isRoadBulkDeleting, setIsRoadBulkDeleting] = useState(false);

  const [showRoadModal, setShowRoadModal] = useState(false);
  const [editingRoad, setEditingRoad] = useState<HighwayItem | null>(null);
  const [roadForm, setRoadForm] = useState<RoadFormData>(INITIAL_ROAD_FORM);
  const [isSubmittingRoad, setIsSubmittingRoad] = useState(false);

  const [roadToDelete, setRoadToDelete] = useState<HighwayItem | null>(null);
  const [isDeletingRoad, setIsDeletingRoad] = useState(false);

  // =================== NEWS STATE ===================
  const [newsData, setNewsData] = useState<RoadNewsItem[]>([]);
  const [newsSearch, setNewsSearch] = useState("");
  const [newsCatFilter, setNewsCatFilter] = useState("all");

  const [newsViewMode, setNewsViewMode] = useState<"table" | "cards">("table");
  const [newsPageSize, setNewsPageSize] = useState<number>(10);
  const [currentNewsPage, setCurrentNewsPage] = useState<number>(1);

  const [visibleColumnsNews, setVisibleColumnsNews] = useState<VisibleColumnsNews>(INITIAL_VISIBLE_NEWS_COLUMNS);
  const [columnsMenuNewsOpen, setColumnsMenuNewsOpen] = useState(false);
  const [columnsMenuNewsPos, setColumnsMenuNewsPos] = useState<ColumnsMenuPosition>({ top: 0, left: 0 });

  const [actionMenuNews, setActionMenuNews] = useState<ActionMenuStateNews | null>(null);

  const [selectedNewsKeys, setSelectedNewsKeys] = useState<Record<string, boolean>>({});
  const [showNewsBulkDeleteModal, setShowNewsBulkDeleteModal] = useState(false);
  const [isNewsBulkDeleting, setIsNewsBulkDeleting] = useState(false);

  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<RoadNewsItem | null>(null);
  const [newsForm, setNewsForm] = useState<NewsFormData>(INITIAL_NEWS_FORM);
  const [isSubmittingNews, setIsSubmittingNews] = useState(false);

  const [newsToDelete, setNewsToDelete] = useState<RoadNewsItem | null>(null);
  const [isDeletingNews, setIsDeletingNews] = useState(false);

  // Click outside listener for action and column menus
  useEffect(() => {
    if (!actionMenuRoad && !actionMenuNews && !columnsMenuRoadOpen && !columnsMenuNewsOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(`.${roadsStyles.actionDropdownMenu}`) ||
        target.closest(`.${roadsStyles.columnsDropdownMenu}`) ||
        target.closest(`.${roadsStyles.moreMenuBtn}`) ||
        target.closest(`.${roadsStyles.columnsToggleBtn}`)
      ) {
        return;
      }
      setActionMenuRoad(null);
      setActionMenuNews(null);
      setColumnsMenuRoadOpen(false);
      setColumnsMenuNewsOpen(false);
    };

    window.addEventListener("resize", () => {
      setActionMenuRoad(null);
      setActionMenuNews(null);
      setColumnsMenuRoadOpen(false);
      setColumnsMenuNewsOpen(false);
    });
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [actionMenuRoad, actionMenuNews, columnsMenuRoadOpen, columnsMenuNewsOpen]);

  // Load All Data
  const loadAllData = useCallback(async () => {
    setLoading(true);
    let loadedRoads: HighwayItem[] = DEFAULT_HIGHWAYS;
    let loadedNews: RoadNewsItem[] = DEFAULT_ROAD_NEWS;

    if (typeof window !== "undefined") {
      const cachedRoads = localStorage.getItem("local_highways_info");
      if (cachedRoads) {
        try {
          const parsed = JSON.parse(cachedRoads);
          if (Array.isArray(parsed) && parsed.length > 0) loadedRoads = parsed;
        } catch { }
      }
      const cachedNews = localStorage.getItem("local_road_news");
      if (cachedNews) {
        try {
          const parsed = JSON.parse(cachedNews);
          if (Array.isArray(parsed) && parsed.length > 0) loadedNews = parsed;
        } catch { }
      }
    }

    if (!supabase) {
      setRoadsData(loadedRoads);
      setNewsData(loadedNews);
      setDbConnected(false);
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch Roads
      const { data: dbRoads, error: rErr } = await supabase
        .from("highways_info")
        .select("*")
        .order("length_km", { ascending: false });

      if (rErr) {
        console.warn("Failed to fetch highways_info:", rErr);
        setRoadsData(loadedRoads);
        setDbConnected(false);
      } else if (dbRoads && dbRoads.length > 0) {
        loadedRoads = dbRoads.map((d: any) => ({
          id: d.id,
          name: d.name,
          code: d.code,
          type: d.type,
          lengthKm: Number(d.length_km) || 0,
          startPoint: d.start_point,
          endPoint: d.end_point,
          governorates: Array.isArray(d.governorates) ? d.governorates : [],
          speeds: {
            privateCar: d.speed_private_car ?? 120,
            minibus: d.speed_minibus ?? 100,
            microbus: d.speed_microbus ?? 100,
            pickup: d.speed_pickup ?? 90,
            bus: d.speed_bus ?? 100,
            truck: d.speed_truck ?? 80,
          },
          lanesCount: d.lanes_count ?? 4,
          tollGates: Array.isArray(d.toll_gates) ? d.toll_gates : [],
          gasStations: Array.isArray(d.gas_stations) ? d.gas_stations : [],
          emergencyPhone: d.emergency_phone || "01221110000",
          lat: Number(d.lat) || 30.0444,
          lng: Number(d.lng) || 31.2357,
          status: d.status || "open",
          statusText: d.status === "open" ? "مفتوح وسيولة" : "أعمال صيانة",
          description: d.description || "",
          radarInfo: d.radar_info || "",
          mapUrl: d.map_url || "",
        }));
        setRoadsData(loadedRoads);
        setDbConnected(true);
      } else {
        setRoadsData(loadedRoads);
        setDbConnected(true);
      }

      // 2. Fetch News
      const { data: dbNews, error: nErr } = await supabase
        .from("road_news")
        .select("*")
        .order("published_at", { ascending: false });

      if (nErr) {
        console.warn("Failed to fetch road_news:", nErr);
        setNewsData(loadedNews);
      } else if (dbNews && dbNews.length > 0) {
        loadedNews = dbNews.map((d: any) => ({
          id: d.id,
          title: d.title,
          summary: d.summary,
          category: d.category,
          severity: d.severity,
          roadName: d.road_name || "كافة الطرق",
          source: d.source || "الإدارة العامة للمرور",
          publishedAt: d.published_at || new Date().toISOString(),
          isActive: d.is_active ?? true,
        }));
        setNewsData(loadedNews);
      } else {
        setNewsData(loadedNews);
      }
    } catch (err) {
      console.error("Error loading roads admin data:", err);
      setRoadsData(loadedRoads);
      setNewsData(loadedNews);
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Admin Verification
  const checkAdminStatus = useCallback(async () => {
    try {
      if (!user) {
        router.push("/login");
        return;
      }

      if (profile?.is_admin || user.email === "admin@cairomap.com" || user.user_metadata?.role === "admin") {
        setIsAdmin(true);
        loadAllData();
        return;
      }

      if (!supabase) {
        setIsAdmin(true);
        loadAllData();
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
      console.error("Error verifying admin status:", err);
      if (profile?.is_admin || user?.email === "admin@cairomap.com") {
        setIsAdmin(true);
        loadAllData();
      } else {
        router.push("/");
      }
    }
  }, [user, profile, router, loadAllData]);

  useEffect(() => {
    if (!authLoading) {
      checkAdminStatus();
    }
  }, [authLoading, checkAdminStatus]);

  // LocalStorage Helpers
  const saveLocalRoads = (data: HighwayItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("local_highways_info", JSON.stringify(data));
    }
  };

  const saveLocalNews = (data: RoadNewsItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("local_road_news", JSON.stringify(data));
    }
  };

  // =================== ROADS HANDLERS ===================
  const filteredRoads = useMemo(() => {
    return filterRoads(roadsData, roadSearch, roadTypeFilter);
  }, [roadsData, roadSearch, roadTypeFilter]);

  const paginatedRoads = useMemo(() => {
    const startIndex = (currentRoadPage - 1) * roadPageSize;
    return filteredRoads.slice(startIndex, startIndex + roadPageSize);
  }, [filteredRoads, currentRoadPage, roadPageSize]);

  const selectedRoadsCount = useMemo(() => {
    return Object.values(selectedRoadKeys).filter(Boolean).length;
  }, [selectedRoadKeys]);

  const toggleSelectRoad = (roadId: string) => {
    setSelectedRoadKeys((prev) => ({ ...prev, [roadId]: !prev[roadId] }));
  };

  const toggleSelectAllRoads = (roadsToToggle: HighwayItem[]) => {
    const allSelected =
      roadsToToggle.length > 0 &&
      roadsToToggle.every((r) => selectedRoadKeys[r.id || r.name]);

    if (allSelected) {
      setSelectedRoadKeys((prev) => {
        const next = { ...prev };
        roadsToToggle.forEach((r) => delete next[r.id || r.name]);
        return next;
      });
    } else {
      setSelectedRoadKeys((prev) => {
        const next = { ...prev };
        roadsToToggle.forEach((r) => { next[r.id || r.name] = true; });
        return next;
      });
    }
  };

  const clearRoadSelection = () => setSelectedRoadKeys({});

  const handleToggleColumnsMenuRoad = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (columnsMenuRoadOpen) {
      setColumnsMenuRoadOpen(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownWidth = 190;
    const dropdownHeight = 240;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
    const top = openUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4;
    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 10) left = window.innerWidth - dropdownWidth - 10;
    if (left < 10) left = 10;

    setColumnsMenuRoadPos({ top, left });
    setColumnsMenuRoadOpen(true);
    setActionMenuRoad(null);
  };

  const handleToggleColumnRoads = (key: keyof VisibleColumnsRoads) => {
    setVisibleColumnsRoads((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleActionMenuRoad = (
    road: HighwayItem,
    roadKey: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (actionMenuRoad?.roadKey === roadKey) {
      setActionMenuRoad(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownWidth = 150;
    const dropdownHeight = 135;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
    const top = openUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4;
    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 10) left = window.innerWidth - dropdownWidth - 10;
    if (left < 10) left = 10;

    setActionMenuRoad({ road, roadKey, top, left });
    setColumnsMenuRoadOpen(false);
  };

  const handleOpenAddRoad = () => {
    setError("");
    setSuccess("");
    setEditingRoad(null);
    setRoadForm(INITIAL_ROAD_FORM);
    setShowRoadModal(true);
  };

  const handleOpenEditRoad = (road: HighwayItem) => {
    setError("");
    setSuccess("");
    setEditingRoad(road);
    setRoadForm({
      name: road.name || "",
      code: road.code || "",
      type: road.type || "حر",
      lengthKm: road.lengthKm || 0,
      startPoint: road.startPoint || "",
      endPoint: road.endPoint || "",
      governorates: Array.isArray(road.governorates) ? road.governorates.join("، ") : "",
      speed_private_car: road.speeds?.privateCar ?? 120,
      speed_minibus: road.speeds?.minibus ?? 100,
      speed_microbus: road.speeds?.microbus ?? 100,
      speed_pickup: road.speeds?.pickup ?? 90,
      speed_bus: road.speeds?.bus ?? 100,
      speed_truck: road.speeds?.truck ?? 80,
      lanesCount: road.lanesCount ?? 4,
      emergencyPhone: road.emergencyPhone || "01221110000",
      lat: road.lat ?? 30.0444,
      lng: road.lng ?? 31.2357,
      status: road.status || "open",
      description: road.description || "",
      radarInfo: road.radarInfo || "",
      mapUrl: road.mapUrl || "",
    });
    setShowRoadModal(true);
  };

  const handleCloseRoadModal = () => {
    setShowRoadModal(false);
    setEditingRoad(null);
    setError("");
  };

  const handleRoadFormChange = (field: keyof RoadFormData, value: string | number) => {
    setRoadForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitRoad = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!roadForm.name.trim() || !roadForm.startPoint.trim() || !roadForm.endPoint.trim()) {
      setError("يرجى ملء جميع الحقول الإلزامية (اسم الطريق، نقطة البداية، ونقطة النهاية).");
      return;
    }

    setIsSubmittingRoad(true);

    const govArray = roadForm.governorates
      ? roadForm.governorates.split(/[\n،,]+/).map((g) => g.trim()).filter(Boolean)
      : [];

    const dbPayload = {
      name: roadForm.name.trim(),
      code: roadForm.code.trim() || null,
      type: roadForm.type,
      length_km: Number(roadForm.lengthKm) || 0,
      start_point: roadForm.startPoint.trim(),
      end_point: roadForm.endPoint.trim(),
      governorates: govArray,
      speed_private_car: Number(roadForm.speed_private_car) || 120,
      speed_minibus: Number(roadForm.speed_minibus) || 100,
      speed_microbus: Number(roadForm.speed_microbus) || 100,
      speed_pickup: Number(roadForm.speed_pickup) || 90,
      speed_bus: Number(roadForm.speed_bus) || 100,
      speed_truck: Number(roadForm.speed_truck) || 80,
      lanes_count: Number(roadForm.lanesCount) || 4,
      emergency_phone: roadForm.emergencyPhone.trim() || "01221110000",
      lat: Number(roadForm.lat) || 30.0444,
      lng: Number(roadForm.lng) || 31.2357,
      status: roadForm.status,
      description: roadForm.description.trim(),
      radar_info: roadForm.radarInfo.trim() || null,
      map_url: roadForm.mapUrl.trim() || null,
    };

    if (dbConnected && supabase) {
      try {
        let dbErr;
        const isEditingDbRecord = editingRoad && editingRoad.id && isUUID(editingRoad.id);

        if (isEditingDbRecord) {
          const { error: updErr } = await supabase
            .from("highways_info")
            .update(dbPayload)
            .eq("id", editingRoad.id);
          dbErr = updErr;
        } else {
          const { error: insErr } = await supabase
            .from("highways_info")
            .insert([dbPayload]);
          dbErr = insErr;
        }

        if (dbErr) throw dbErr;

        setSuccess(
          editingRoad
            ? "تم تعديل بيانات الطريق بنجاح في قاعدة البيانات."
            : "تم إضافة الطريق بنجاح إلى قاعدة البيانات."
        );
        await loadAllData();
        setShowRoadModal(false);
      } catch (err: any) {
        console.error("Save Road Error:", err);
        setError("فشلت العملية في قاعدة البيانات: " + (err.message || String(err)));
      } finally {
        setIsSubmittingRoad(false);
      }
    } else {
      // LocalStorage mode
      const jsRoadItem: HighwayItem = {
        id: editingRoad?.id || Math.random().toString(36).substring(2, 9),
        name: roadForm.name.trim(),
        code: roadForm.code.trim() || undefined,
        type: roadForm.type as any,
        lengthKm: Number(roadForm.lengthKm) || 0,
        startPoint: roadForm.startPoint.trim(),
        endPoint: roadForm.endPoint.trim(),
        governorates: govArray,
        speeds: {
          privateCar: Number(roadForm.speed_private_car) || 120,
          minibus: Number(roadForm.speed_minibus) || 100,
          microbus: Number(roadForm.speed_microbus) || 100,
          pickup: Number(roadForm.speed_pickup) || 90,
          bus: Number(roadForm.speed_bus) || 100,
          truck: Number(roadForm.speed_truck) || 80,
        },
        lanesCount: Number(roadForm.lanesCount) || 4,
        emergencyPhone: roadForm.emergencyPhone.trim() || "01221110000",
        lat: Number(roadForm.lat) || 30.0444,
        lng: Number(roadForm.lng) || 31.2357,
        status: roadForm.status as any,
        statusText: roadForm.status === "open" ? "مفتوح وسيولة" : "أعمال صيانة",
        description: roadForm.description.trim(),
        radarInfo: roadForm.radarInfo.trim() || undefined,
        mapUrl: roadForm.mapUrl.trim() || undefined,
      };

      let updated: HighwayItem[];
      if (editingRoad) {
        updated = roadsData.map((r) => (r.id === editingRoad.id ? jsRoadItem : r));
      } else {
        updated = [jsRoadItem, ...roadsData];
      }

      saveLocalRoads(updated);
      setRoadsData(updated);
      setSuccess(editingRoad ? "تم تعديل الطريق بنجاح محلياً." : "تم إضافة الطريق بنجاح محلياً.");
      setIsSubmittingRoad(false);
      setShowRoadModal(false);
    }
  };

  const handleDeleteRoadClick = (road: HighwayItem) => {
    setRoadToDelete(road);
  };

  const handleCancelDeleteRoad = () => {
    setRoadToDelete(null);
  };

  const handleConfirmDeleteRoad = async () => {
    if (!roadToDelete) return;
    setIsDeletingRoad(true);
    setError("");
    setSuccess("");

    if (dbConnected && supabase && roadToDelete.id && isUUID(roadToDelete.id)) {
      try {
        const { error: delErr } = await supabase
          .from("highways_info")
          .delete()
          .eq("id", roadToDelete.id);

        if (delErr) throw delErr;

        setSuccess("تم حذف الطريق بنجاح من قاعدة البيانات.");
        await loadAllData();
      } catch (err: any) {
        console.error("Delete Road DB error:", err);
        setError("فشل حذف الطريق من قاعدة البيانات: " + (err.message || String(err)));
      } finally {
        setIsDeletingRoad(false);
        setRoadToDelete(null);
      }
    } else {
      const updated = roadsData.filter((r) => (r.id || r.name) !== (roadToDelete.id || roadToDelete.name));
      saveLocalRoads(updated);
      setRoadsData(updated);
      setSuccess("تم حذف الطريق بنجاح محلياً.");
      setIsDeletingRoad(false);
      setRoadToDelete(null);
    }
  };

  const handleOpenRoadBulkDelete = () => {
    if (selectedRoadsCount === 0) return;
    setShowRoadBulkDeleteModal(true);
  };

  const handleCancelRoadBulkDelete = () => {
    if (!isRoadBulkDeleting) setShowRoadBulkDeleteModal(false);
  };

  const handleConfirmRoadBulkDelete = async () => {
    if (selectedRoadsCount === 0) return;
    setIsRoadBulkDeleting(true);
    setError("");
    setSuccess("");

    const selectedKeysSet = new Set(
      Object.keys(selectedRoadKeys).filter((k) => !!selectedRoadKeys[k])
    );

    if (dbConnected && supabase) {
      try {
        const idsToDelete: string[] = [];
        roadsData.forEach((r) => {
          const key = r.id || r.name;
          if (selectedKeysSet.has(key) && r.id && isUUID(r.id)) {
            idsToDelete.push(r.id);
          }
        });

        if (idsToDelete.length > 0) {
          const { error: delErr } = await supabase
            .from("highways_info")
            .delete()
            .in("id", idsToDelete);
          if (delErr) throw delErr;
        }

        await loadAllData();
        setSuccess(`تم حذف (${selectedRoadsCount}) طريق بنجاح من قاعدة البيانات.`);
        clearRoadSelection();
      } catch (err: any) {
        console.error("Bulk delete roads error:", err);
        setError("فشل الحذف الجماعي: " + (err?.message || String(err)));
      } finally {
        setIsRoadBulkDeleting(false);
        setShowRoadBulkDeleteModal(false);
      }
    } else {
      const updated = roadsData.filter((r) => !selectedKeysSet.has(r.id || r.name));
      saveLocalRoads(updated);
      setRoadsData(updated);
      setSuccess(`تم حذف (${selectedRoadsCount}) طريق بنجاح محلياً.`);
      clearRoadSelection();
      setIsRoadBulkDeleting(false);
      setShowRoadBulkDeleteModal(false);
    }
  };

  // =================== NEWS HANDLERS ===================
  const filteredNews = useMemo(() => {
    return filterNews(newsData, newsSearch, newsCatFilter);
  }, [newsData, newsSearch, newsCatFilter]);

  const paginatedNews = useMemo(() => {
    const startIndex = (currentNewsPage - 1) * newsPageSize;
    return filteredNews.slice(startIndex, startIndex + newsPageSize);
  }, [filteredNews, currentNewsPage, newsPageSize]);

  const selectedNewsCount = useMemo(() => {
    return Object.values(selectedNewsKeys).filter(Boolean).length;
  }, [selectedNewsKeys]);

  const toggleSelectNews = (newsId: string) => {
    setSelectedNewsKeys((prev) => ({ ...prev, [newsId]: !prev[newsId] }));
  };

  const toggleSelectAllNews = (newsToToggle: RoadNewsItem[]) => {
    const allSelected =
      newsToToggle.length > 0 &&
      newsToToggle.every((n) => selectedNewsKeys[n.id]);

    if (allSelected) {
      setSelectedNewsKeys((prev) => {
        const next = { ...prev };
        newsToToggle.forEach((n) => delete next[n.id]);
        return next;
      });
    } else {
      setSelectedNewsKeys((prev) => {
        const next = { ...prev };
        newsToToggle.forEach((n) => { next[n.id] = true; });
        return next;
      });
    }
  };

  const clearNewsSelection = () => setSelectedNewsKeys({});

  const handleToggleColumnsMenuNews = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (columnsMenuNewsOpen) {
      setColumnsMenuNewsOpen(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownWidth = 190;
    const dropdownHeight = 240;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
    const top = openUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4;
    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 10) left = window.innerWidth - dropdownWidth - 10;
    if (left < 10) left = 10;

    setColumnsMenuNewsPos({ top, left });
    setColumnsMenuNewsOpen(true);
    setActionMenuNews(null);
  };

  const handleToggleColumnNews = (key: keyof VisibleColumnsNews) => {
    setVisibleColumnsNews((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleActionMenuNews = (
    news: RoadNewsItem,
    newsKey: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (actionMenuNews?.newsKey === newsKey) {
      setActionMenuNews(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownWidth = 150;
    const dropdownHeight = 135;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
    const top = openUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4;
    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 10) left = window.innerWidth - dropdownWidth - 10;
    if (left < 10) left = 10;

    setActionMenuNews({ news, newsKey, top, left });
    setColumnsMenuNewsOpen(false);
  };

  const handleOpenAddNews = () => {
    setError("");
    setSuccess("");
    setEditingNews(null);
    setNewsForm(INITIAL_NEWS_FORM);
    setShowNewsModal(true);
  };

  const handleOpenEditNews = (news: RoadNewsItem) => {
    setError("");
    setSuccess("");
    setEditingNews(news);
    setNewsForm({
      title: news.title || "",
      summary: news.summary || "",
      category: news.category || "weather_fog",
      severity: news.severity || "warning",
      roadName: news.roadName || "كافة الطرق",
      source: news.source || "الإدارة العامة للمرور",
      isActive: news.isActive ?? true,
    });
    setShowNewsModal(true);
  };

  const handleCloseNewsModal = () => {
    setShowNewsModal(false);
    setEditingNews(null);
    setError("");
  };

  const handleNewsFormChange = (field: keyof NewsFormData, value: any) => {
    setNewsForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newsForm.title.trim() || !newsForm.summary.trim()) {
      setError("يرجى ملء جميع الحقول الإلزامية (عنوان التنبيه والتفاصيل).");
      return;
    }

    setIsSubmittingNews(true);

    const dbPayload = {
      title: newsForm.title.trim(),
      summary: newsForm.summary.trim(),
      category: newsForm.category,
      severity: newsForm.severity,
      road_name: newsForm.roadName.trim() || "كافة الطرق",
      source: newsForm.source.trim() || "الإدارة العامة للمرور",
      is_active: newsForm.isActive,
    };

    if (dbConnected && supabase) {
      try {
        let dbErr;
        const isEditingDbRecord = editingNews && editingNews.id && isUUID(editingNews.id);

        if (isEditingDbRecord) {
          const { error: updErr } = await supabase
            .from("road_news")
            .update(dbPayload)
            .eq("id", editingNews.id);
          dbErr = updErr;
        } else {
          const { error: insErr } = await supabase
            .from("road_news")
            .insert([dbPayload]);
          dbErr = insErr;
        }

        if (dbErr) throw dbErr;

        setSuccess(
          editingNews
            ? "تم تعديل التنبيه المروري بنجاح في قاعدة البيانات."
            : "تم إضافة التنبيه المروري بنجاح إلى قاعدة البيانات."
        );
        await loadAllData();
        setShowNewsModal(false);
      } catch (err: any) {
        console.error("Save News Error:", err);
        setError("فشلت العملية في قاعدة البيانات: " + (err.message || String(err)));
      } finally {
        setIsSubmittingNews(false);
      }
    } else {
      // LocalStorage mode
      const jsNewsItem: RoadNewsItem = {
        id: editingNews?.id || Math.random().toString(36).substring(2, 9),
        title: newsForm.title.trim(),
        summary: newsForm.summary.trim(),
        category: newsForm.category,
        severity: newsForm.severity,
        roadName: newsForm.roadName.trim() || "كافة الطرق",
        source: newsForm.source.trim() || "الإدارة العامة للمرور",
        publishedAt: editingNews?.publishedAt || new Date().toISOString(),
        isActive: newsForm.isActive,
      };

      let updated: RoadNewsItem[];
      if (editingNews) {
        updated = newsData.map((n) => (n.id === editingNews.id ? jsNewsItem : n));
      } else {
        updated = [jsNewsItem, ...newsData];
      }

      saveLocalNews(updated);
      setNewsData(updated);
      setSuccess(editingNews ? "تم تعديل التنبيه بنجاح محلياً." : "تم إضافة التنبيه بنجاح محلياً.");
      setIsSubmittingNews(false);
      setShowNewsModal(false);
    }
  };

  const handleDeleteNewsClick = (news: RoadNewsItem) => {
    setNewsToDelete(news);
  };

  const handleCancelDeleteNews = () => {
    setNewsToDelete(null);
  };

  const handleConfirmDeleteNews = async () => {
    if (!newsToDelete) return;
    setIsDeletingNews(true);
    setError("");
    setSuccess("");

    if (dbConnected && supabase && newsToDelete.id && isUUID(newsToDelete.id)) {
      try {
        const { error: delErr } = await supabase
          .from("road_news")
          .delete()
          .eq("id", newsToDelete.id);

        if (delErr) throw delErr;

        setSuccess("تم حذف التنبيه المروري بنجاح من قاعدة البيانات.");
        await loadAllData();
      } catch (err: any) {
        console.error("Delete News DB error:", err);
        setError("فشل حذف التنبيه من قاعدة البيانات: " + (err.message || String(err)));
      } finally {
        setIsDeletingNews(false);
        setNewsToDelete(null);
      }
    } else {
      const updated = newsData.filter((n) => n.id !== newsToDelete.id);
      saveLocalNews(updated);
      setNewsData(updated);
      setSuccess("تم حذف التنبيه بنجاح محلياً.");
      setIsDeletingNews(false);
      setNewsToDelete(null);
    }
  };

  const handleOpenNewsBulkDelete = () => {
    if (selectedNewsCount === 0) return;
    setShowNewsBulkDeleteModal(true);
  };

  const handleCancelNewsBulkDelete = () => {
    if (!isNewsBulkDeleting) setShowNewsBulkDeleteModal(false);
  };

  const handleConfirmNewsBulkDelete = async () => {
    if (selectedNewsCount === 0) return;
    setIsNewsBulkDeleting(true);
    setError("");
    setSuccess("");

    const selectedKeysSet = new Set(
      Object.keys(selectedNewsKeys).filter((k) => !!selectedNewsKeys[k])
    );

    if (dbConnected && supabase) {
      try {
        const idsToDelete: string[] = [];
        newsData.forEach((n) => {
          if (selectedKeysSet.has(n.id) && isUUID(n.id)) {
            idsToDelete.push(n.id);
          }
        });

        if (idsToDelete.length > 0) {
          const { error: delErr } = await supabase
            .from("road_news")
            .delete()
            .in("id", idsToDelete);
          if (delErr) throw delErr;
        }

        await loadAllData();
        setSuccess(`تم حذف (${selectedNewsCount}) تنبيه بنجاح من قاعدة البيانات.`);
        clearNewsSelection();
      } catch (err: any) {
        console.error("Bulk delete news error:", err);
        setError("فشل الحذف الجماعي: " + (err?.message || String(err)));
      } finally {
        setIsNewsBulkDeleting(false);
        setShowNewsBulkDeleteModal(false);
      }
    } else {
      const updated = newsData.filter((n) => !selectedKeysSet.has(n.id));
      saveLocalNews(updated);
      setNewsData(updated);
      setSuccess(`تم حذف (${selectedNewsCount}) تنبيه بنجاح محلياً.`);
      clearNewsSelection();
      setIsNewsBulkDeleting(false);
      setShowNewsBulkDeleteModal(false);
    }
  };

  return {
    // Nav & Status
    activeAdminTab,
    setActiveAdminTab,
    authLoading,
    loading,
    isAdmin,
    dbConnected,
    error,
    setError,
    success,
    setSuccess,

    // Roads State & Handlers
    roadsData,
    roadSearch,
    setRoadSearch,
    roadTypeFilter,
    setRoadTypeFilter,
    filteredRoads,
    paginatedRoads,
    roadViewMode,
    setRoadViewMode,
    roadPageSize,
    setRoadPageSize,
    currentRoadPage,
    setCurrentRoadPage,
    visibleColumnsRoads,
    columnsMenuRoadOpen,
    columnsMenuRoadPos,
    handleToggleColumnsMenuRoad,
    handleToggleColumnRoads,
    actionMenuRoad,
    setActionMenuRoad,
    handleToggleActionMenuRoad,
    viewingRoad,
    setViewingRoad,
    selectedRoadKeys,
    selectedRoadsCount,
    toggleSelectRoad,
    toggleSelectAllRoads,
    clearRoadSelection,
    showRoadBulkDeleteModal,
    isRoadBulkDeleting,
    handleOpenRoadBulkDelete,
    handleCancelRoadBulkDelete,
    handleConfirmRoadBulkDelete,
    showRoadModal,
    editingRoad,
    roadForm,
    handleOpenAddRoad,
    handleOpenEditRoad,
    handleCloseRoadModal,
    handleRoadFormChange,
    handleSubmitRoad,
    roadToDelete,
    isDeletingRoad,
    handleDeleteRoadClick,
    handleConfirmDeleteRoad,
    handleCancelDeleteRoad,

    // News State & Handlers
    newsData,
    newsSearch,
    setNewsSearch,
    newsCatFilter,
    setNewsCatFilter,
    filteredNews,
    paginatedNews,
    newsViewMode,
    setNewsViewMode,
    newsPageSize,
    setNewsPageSize,
    currentNewsPage,
    setCurrentNewsPage,
    visibleColumnsNews,
    columnsMenuNewsOpen,
    columnsMenuNewsPos,
    handleToggleColumnsMenuNews,
    handleToggleColumnNews,
    actionMenuNews,
    setActionMenuNews,
    handleToggleActionMenuNews,
    selectedNewsKeys,
    selectedNewsCount,
    toggleSelectNews,
    toggleSelectAllNews,
    clearNewsSelection,
    showNewsBulkDeleteModal,
    isNewsBulkDeleting,
    handleOpenNewsBulkDelete,
    handleCancelNewsBulkDelete,
    handleConfirmNewsBulkDelete,
    showNewsModal,
    editingNews,
    newsForm,
    handleOpenAddNews,
    handleOpenEditNews,
    handleCloseNewsModal,
    handleNewsFormChange,
    handleSubmitNews,
    newsToDelete,
    isDeletingNews,
    handleDeleteNewsClick,
    handleConfirmDeleteNews,
    handleCancelDeleteNews,
  };
}
