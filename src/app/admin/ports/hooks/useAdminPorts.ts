"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  PortItem,
  PortFormData,
  VisibleColumns,
  ActionMenuState,
  ColumnsMenuPosition,
} from "../types";
import {
  DEFAULT_PORTS,
  INITIAL_PORT_FORM,
  INITIAL_VISIBLE_COLUMNS,
} from "../constants";
import {
  isUUID,
  filterPorts,
  parseConnections,
} from "../utils";

export function useAdminPorts() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);

  // Global Alerts
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Data & Filters
  const [portsData, setPortsData] = useState<PortItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [seaFilter, setSeaFilter] = useState("all");

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
  const [viewingPort, setViewingPort] = useState<PortItem | null>(null);

  // Selection & Bulk Delete
  const [selectedPortKeys, setSelectedPortKeys] = useState<Record<string, boolean>>({});
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Form Modal (Add / Edit)
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortItem | null>(null);
  const [formData, setFormData] = useState<PortFormData>(INITIAL_PORT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation Modal
  const [portToDelete, setPortToDelete] = useState<PortItem | null>(null);
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
  const getLocalData = (): PortItem[] => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("local_ports");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          return DEFAULT_PORTS;
        }
      }
    }
    return DEFAULT_PORTS;
  };

  const saveLocalData = (data: PortItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("local_ports", JSON.stringify(data));
    }
  };

  // Fetch Data from Supabase with LocalStorage fallback
  const fetchPortsData = useCallback(async () => {
    if (!supabase) {
      setPortsData(getLocalData());
      setDbConnected(false);
      return;
    }

    try {
      const { data, error: dbErr } = await supabase.from("ports").select("*");
      if (dbErr) {
        console.warn("Failed to fetch ports from database, using fallback:", dbErr);
        setPortsData(getLocalData());
        setDbConnected(false);
      } else {
        const mappedData = data || [];
        const enriched: PortItem[] = mappedData.map((dbPort: any) => {
          const localMatch = DEFAULT_PORTS.find(
            (lp) =>
              (lp.name && dbPort.name && lp.name.includes(dbPort.name)) ||
              (lp.name && dbPort.name && dbPort.name.includes(lp.name))
          );

          return {
            ...localMatch,
            ...dbPort,
            id: dbPort.id || localMatch?.id || Date.now(),
            name: dbPort.name || localMatch?.name || "",
            governorate: dbPort.governorate || localMatch?.governorate || "",
            sea: dbPort.sea || localMatch?.sea || "البحر الأبيض المتوسط",
            type: dbPort.type || localMatch?.type || "",
            capacity: dbPort.capacity || localMatch?.capacity || "",
            description: dbPort.description || localMatch?.description || "",
            berths_count: dbPort.berths_count || localMatch?.berths_count || "غير محدد",
            connections: dbPort.connections || localMatch?.connections || [],
            operator: dbPort.operator || localMatch?.operator || "",
            status: dbPort.status || localMatch?.status || "تشغيل فعلي",
            map_url: dbPort.map_url || localMatch?.map_url || "",
          } as PortItem;
        });

        const dbNames = new Set(mappedData.map((d: any) => (d.name || "").toLowerCase()));
        const missingLocals = DEFAULT_PORTS.filter(
          (lp) => !dbNames.has((lp.name || "").toLowerCase())
        );

        const merged = [...enriched, ...missingLocals];
        setPortsData(merged);
        setDbConnected(true);
        saveLocalData(merged);
      }
    } catch (err) {
      console.error("fetchPortsData error:", err);
      setPortsData(getLocalData());
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
        await fetchPortsData();
        setLoading(false);
        return;
      }

      if (!supabase) {
        setIsAdmin(true);
        setPortsData(getLocalData());
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
          await fetchPortsData();
        }
      } catch (err) {
        console.error("Auth authorization check failed:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user, profile, authLoading, router, fetchPortsData]);

  // Filtered Ports
  const filteredPorts = useMemo(() => {
    return filterPorts(portsData, searchQuery, seaFilter);
  }, [portsData, searchQuery, seaFilter]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, seaFilter, pageSize]);

  // Paginated Ports
  const paginatedPorts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPorts.slice(start, start + pageSize);
  }, [filteredPorts, currentPage, pageSize]);

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
    item: PortItem,
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
    return Object.values(selectedPortKeys).filter(Boolean).length;
  }, [selectedPortKeys]);

  const toggleSelectPort = (portKey: string) => {
    setSelectedPortKeys((prev) => ({
      ...prev,
      [portKey]: !prev[portKey],
    }));
  };

  const toggleSelectAll = (currentPorts: PortItem[]) => {
    const allSelected =
      currentPorts.length > 0 &&
      currentPorts.every((p) => selectedPortKeys[String(p.id || p.name)]);

    if (allSelected) {
      setSelectedPortKeys({});
    } else {
      const next: Record<string, boolean> = { ...selectedPortKeys };
      currentPorts.forEach((p) => {
        const k = String(p.id || p.name);
        next[k] = true;
      });
      setSelectedPortKeys(next);
    }
  };

  const clearSelection = () => {
    setSelectedPortKeys({});
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

    const keysToDelete = Object.keys(selectedPortKeys).filter(
      (k) => selectedPortKeys[k]
    );

    try {
      if (dbConnected && supabase) {
        const uuidKeys = keysToDelete.filter(isUUID);
        if (uuidKeys.length > 0) {
          const { error: delErr } = await supabase
            .from("ports")
            .delete()
            .in("id", uuidKeys);
          if (delErr) throw delErr;
        }
      }

      // Update state and local storage
      const remaining = portsData.filter((p) => {
        const k = String(p.id || p.name);
        return !selectedPortKeys[k];
      });

      setPortsData(remaining);
      saveLocalData(remaining);
      setSelectedPortKeys({});
      setShowBulkDeleteModal(false);
      setSuccess(`تم حذف (${keysToDelete.length}) من الموانئ المحددة بنجاح.`);
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
    setFormData(INITIAL_PORT_FORM);
    setShowModal(true);
  };

  const handleOpenEdit = (item: PortItem) => {
    setError("");
    setSuccess("");
    setEditingItem(item);

    setFormData({
      name: item.name || "",
      governorate: item.governorate || "",
      sea: item.sea || "البحر الأبيض المتوسط",
      type: item.type || "",
      capacity: item.capacity || "",
      description: item.description || "",
      berths_count: item.berths_count || "",
      connections: Array.isArray(item.connections)
        ? item.connections.join(", ")
        : item.connections || "",
      operator: item.operator || "",
      status: item.status || "تشغيل فعلي",
      map_url: item.map_url || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleFormFieldChange = (field: keyof PortFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const connectionsArr = parseConnections(formData.connections);

    const payload: PortItem = {
      name: formData.name.trim(),
      governorate: formData.governorate.trim(),
      sea: formData.sea.trim(),
      type: formData.type.trim(),
      capacity: formData.capacity.trim(),
      description: formData.description.trim(),
      berths_count: formData.berths_count.trim(),
      connections: connectionsArr,
      operator: formData.operator.trim(),
      status: formData.status.trim() || "تشغيل فعلي",
      map_url: formData.map_url.trim(),
    };

    try {
      if (dbConnected && supabase) {
        const isEditingDbRecord = editingItem && editingItem.id && isUUID(editingItem.id);

        const fullPayload = {
          name: payload.name,
          governorate: payload.governorate,
          sea: payload.sea,
          type: payload.type,
          capacity: payload.capacity,
          description: payload.description,
          berths_count: payload.berths_count,
          operator: payload.operator,
          status: payload.status,
          map_url: payload.map_url,
        };

        const basicPayload = {
          name: payload.name,
          governorate: payload.governorate,
          sea: payload.sea,
          type: payload.type,
          capacity: payload.capacity,
          description: payload.description,
          map_url: payload.map_url,
        };

        if (isEditingDbRecord) {
          const { error: updateErr } = await supabase
            .from("ports")
            .update(fullPayload)
            .eq("id", editingItem.id);

          if (updateErr) {
            const errorMsg = updateErr.message || "";
            if (
              errorMsg.includes("Could not find the") ||
              errorMsg.includes("column") ||
              updateErr.code === "PGRST102"
            ) {
              const { error: retryErr } = await supabase
                .from("ports")
                .update(basicPayload)
                .eq("id", editingItem.id);
              if (retryErr) throw retryErr;
            } else {
              throw updateErr;
            }
          }
          setSuccess("تم تحديث بيانات الميناء بنجاح في قاعدة البيانات.");
        } else {
          const { error: insertErr } = await supabase
            .from("ports")
            .insert(fullPayload);

          if (insertErr) {
            const errorMsg = insertErr.message || "";
            if (
              errorMsg.includes("Could not find the") ||
              errorMsg.includes("column") ||
              insertErr.code === "PGRST102"
            ) {
              const { error: retryErr } = await supabase
                .from("ports")
                .insert(basicPayload);
              if (retryErr) throw retryErr;
            } else {
              throw insertErr;
            }
          }
          setSuccess("تم إضافة الميناء بنجاح إلى قاعدة البيانات.");
        }

        await fetchPortsData();
        setShowModal(false);
      } else {
        // LocalStorage fallback
        let currentLocal = getLocalData();
        if (editingItem) {
          currentLocal = currentLocal.map((item) => {
            if (editingItem.id && item.id === editingItem.id) {
              return { ...item, ...payload };
            }
            if (!editingItem.id && item.name === editingItem.name) {
              return { ...item, ...payload };
            }
            return item;
          });
          setSuccess("تم تعديل السجل بنجاح محلياً.");
        } else {
          const newRecord: PortItem = {
            id: Date.now().toString(),
            ...payload,
          };
          currentLocal = [newRecord, ...currentLocal];
          setSuccess("تم إضافة الميناء بنجاح محلياً.");
        }

        saveLocalData(currentLocal);
        setPortsData(currentLocal);
        setShowModal(false);
      }
    } catch (err: any) {
      console.error("Save port error:", err);
      setError("فشلت عملية الحفظ: " + (err.message || "حدث خطأ غير متوقع"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Single Delete Handlers
  const handleDeleteClick = (item: PortItem) => {
    setPortToDelete(item);
  };

  const handleCancelDelete = () => {
    setPortToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!portToDelete) return;
    setIsDeleting(true);
    setError("");
    setSuccess("");

    try {
      if (dbConnected && supabase && portToDelete.id && isUUID(portToDelete.id)) {
        const { error: delErr } = await supabase
          .from("ports")
          .delete()
          .eq("id", portToDelete.id);
        if (delErr) throw delErr;
        setSuccess("تم حذف الميناء بنجاح من قاعدة البيانات.");
        await fetchPortsData();
      } else {
        let currentLocal = getLocalData();
        currentLocal = currentLocal.filter((item) => {
          if (portToDelete.id && item.id !== portToDelete.id) return true;
          if (!portToDelete.id && item.name !== portToDelete.name) return true;
          return false;
        });
        saveLocalData(currentLocal);
        setPortsData(currentLocal);
        setSuccess("تم حذف السجل بنجاح محلياً.");
      }
      setPortToDelete(null);
    } catch (err: any) {
      console.error("Delete port error:", err);
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
    portsData,
    searchQuery,
    setSearchQuery,
    seaFilter,
    setSeaFilter,
    filteredPorts,
    paginatedPorts,

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
    viewingPort,
    setViewingPort,

    // Selection & Bulk Delete
    selectedPortKeys,
    selectedCount,
    toggleSelectPort,
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
    portToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
