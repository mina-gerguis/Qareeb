import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  DBPlace,
  BranchItem,
  PlaceFormData,
  BranchFormData,
  ExcelParsedPlace,
  VisibleColumns,
  ColumnsMenuPosition,
  ActionMenuState,
  DeleteModalState,
  DeleteAlertModalState
} from "../types";
import {
  INITIAL_VISIBLE_COLUMNS,
  INITIAL_PLACE_FORM,
  INITIAL_BRANCH_FORM,
  DEFAULT_SCHEDULE_DATA
} from "../constants";
import {
  filterPlaces,
  getCategoryCounts,
  getGovernorateCounts,
  findDbDuplicates,
  CATEGORY_MAP,
  parseExcelWorkingHours,
  comparePlaceData
} from "../utils";
import {
  CategoryItem,
  DEFAULT_CATEGORIES,
  CATEGORIES_STRUCTURE,
  formatBoxIcon,
  normalizePlaceCategory,
  initialPlaces,
  FEATURES_LIST
} from "@/data/places";
import { governoratesList } from "@/data/egypt_locations";
import { ScheduleDay, DAYS_OF_WEEK } from "@/lib/workingHours";

export function useAdminPlaces() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<DBPlace[]>([]);
  const [error, setError] = useState("");

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGovernorate, setSelectedGovernorate] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(INITIAL_VISIBLE_COLUMNS);

  // Floating Dropdown Menus
  const [columnsMenuPos, setColumnsMenuPos] = useState<ColumnsMenuPosition | null>(null);
  const [actionMenu, setActionMenu] = useState<ActionMenuState>({
    place: null,
    top: 0,
    left: 0,
    openUp: false,
  });

  // Details Modal
  const [detailsPlace, setDetailsPlace] = useState<DBPlace | null>(null);

  // Custom Place Form Modal (Add & Edit)
  const [placeModalOpen, setPlaceModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<DBPlace | null>(null);
  const [placeFormData, setPlaceFormData] = useState<PlaceFormData>(INITIAL_PLACE_FORM);
  const [scheduleType, setScheduleType] = useState<"24/7" | "custom">("24/7");
  const [scheduleData, setScheduleData] = useState<ScheduleDay[]>(DEFAULT_SCHEDULE_DATA);
  const [isSubmittingPlace, setIsSubmittingPlace] = useState(false);

  // Branch Management States
  const [selectedPlaceForBranch, setSelectedPlaceForBranch] = useState<DBPlace | null>(null);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [branchFormData, setBranchFormData] = useState<BranchFormData>(INITIAL_BRANCH_FORM);
  const [branchScheduleType, setBranchScheduleType] = useState<"24/7" | "custom">("24/7");
  const [branchScheduleData, setBranchScheduleData] = useState<ScheduleDay[]>(DEFAULT_SCHEDULE_DATA);
  const [isSubmittingBranch, setIsSubmittingBranch] = useState(false);

  // Custom Categories States
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatKey, setNewCatKey] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("bx bx-store");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Excel Import States
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parsedPlaces, setParsedPlaces] = useState<ExcelParsedPlace[]>([]);
  const [selectedParsedIndices, setSelectedParsedIndices] = useState<Set<number>>(new Set());
  const [parsedPlacesSearch, setParsedPlacesSearch] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [isDeletingDuplicates, setIsDeletingDuplicates] = useState(false);

  // Bulk Selection & Deletion
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    place: null,
    isBulk: false,
    bulkCount: 0,
  });
  const [isDeletingPlace, setIsDeletingPlace] = useState(false);

  // Alert Modal
  const [deleteAlertModal, setDeleteAlertModal] = useState<DeleteAlertModalState | null>(null);

  useEffect(() => {
    if (deleteAlertModal?.type === "success") {
      const timer = setTimeout(() => {
        setDeleteAlertModal(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [deleteAlertModal]);

  // Auth & Initial Fetch
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const checkAdminAndFetchPlaces = async () => {
      if (!supabase) return;
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (profileError || !profileData?.is_admin) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        const { data: placesData, error: placesError } = await supabase
          .from("places")
          .select("*, branches(*)")
          .order("created_at", { ascending: false });

        if (placesError) throw placesError;
        if (placesData) setPlaces(placesData as DBPlace[]);
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchPlaces();
  }, [user, authLoading, router]);

  // Close menus on scroll or window click
  useEffect(() => {
    const handleScrollOrClick = (e: MouseEvent | Event) => {
      if (columnsMenuPos) setColumnsMenuPos(null);
      if (actionMenu.place) {
        setActionMenu(prev => ({ ...prev, place: null }));
      }
    };
    window.addEventListener("scroll", handleScrollOrClick, true);
    window.addEventListener("click", handleScrollOrClick);
    return () => {
      window.removeEventListener("scroll", handleScrollOrClick, true);
      window.removeEventListener("click", handleScrollOrClick);
    };
  }, [columnsMenuPos, actionMenu.place]);

  // Custom Categories Fetch
  const fetchCategories = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data } = await supabase.from("categories").select("*").order("created_at", { ascending: true });
      if (data && data.length > 0) {
        setCategories(data);
      }
    } catch (e) {
      console.warn("Categories fetch fallback", e);
    }
  }, []);

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatLabel.trim()) return;

    const key = newCatKey.trim()
      ? newCatKey.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
      : `cat_${Date.now()}`;
    const iconClass = newCatIcon.trim() || "bx bx-category";

    setIsAddingCategory(true);
    try {
      const newCatObj: CategoryItem = {
        name: key,
        label: newCatLabel.trim(),
        icon: iconClass
      };

      if (supabase) {
        const { data } = await supabase.from("categories").insert([newCatObj]).select().single();
        if (data) {
          setCategories(prev => [...prev.filter(c => c.name !== data.name), data]);
        } else {
          setCategories(prev => [...prev.filter(c => c.name !== key), newCatObj]);
        }
      } else {
        setCategories(prev => [...prev.filter(c => c.name !== key), newCatObj]);
      }

      setPlaceFormData(prev => ({
        ...prev,
        category: key,
        category_label: newCatLabel.trim()
      }));

      setNewCatLabel("");
      setNewCatKey("");
      setNewCatIcon("bx bx-store");
      setShowAddCategoryModal(false);
      setDeleteAlertModal({
        isOpen: true,
        type: "success",
        title: "تمت إضافة التصنيف",
        message: "تمت إضافة التصنيف الجديد بنجاح!",
      });
    } catch (err: any) {
      alert("حدث خطأ أثناء إضافة التصنيف: " + (err.message || ""));
    } finally {
      setIsAddingCategory(false);
    }
  };

  // Filtered & Paginated
  const filteredPlaces = useMemo(() => {
    return filterPlaces(places, searchQuery, selectedCategory, selectedGovernorate);
  }, [places, searchQuery, selectedCategory, selectedGovernorate]);

  const totalPages = Math.max(1, Math.ceil(filteredPlaces.length / pageSize));

  const paginatedPlaces = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPlaces.slice(startIndex, startIndex + pageSize);
  }, [filteredPlaces, currentPage, pageSize]);

  const categoryCounts = useMemo(() => getCategoryCounts(places), [places]);
  const governorateCounts = useMemo(() => getGovernorateCounts(places), [places]);
  const dbDuplicatesList = useMemo(() => findDbDuplicates(places), [places]);

  const isAllSelected = useMemo(() => {
    return (
      filteredPlaces.length > 0 &&
      filteredPlaces.every(p => selectedPlaceIds.includes(p.id))
    );
  }, [filteredPlaces, selectedPlaceIds]);

  const handleToggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      const filteredIds = new Set(filteredPlaces.map(p => p.id));
      setSelectedPlaceIds(prev => prev.filter(id => !filteredIds.has(id)));
    } else {
      const allFilteredIds = filteredPlaces.map(p => p.id);
      setSelectedPlaceIds(prev => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  }, [isAllSelected, filteredPlaces]);

  const handleToggleSelectPlace = useCallback((id: string) => {
    setSelectedPlaceIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  // Dropdown Positioning
  const openActionMenu = useCallback((place: DBPlace, rect: DOMRect) => {
    const menuHeight = 220;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < menuHeight;
    const top = openUp ? rect.top - menuHeight - 4 : rect.bottom + 4;
    const left = Math.max(10, Math.min(rect.left, window.innerWidth - 210));

    setActionMenu({
      place,
      top,
      left,
      openUp,
    });
  }, []);

  const closeActionMenu = useCallback(() => {
    setActionMenu(prev => ({ ...prev, place: null }));
  }, []);

  const openColumnsMenu = useCallback((rect: DOMRect) => {
    const top = rect.bottom + 6;
    const left = Math.max(10, Math.min(rect.left, window.innerWidth - 240));
    setColumnsMenuPos({ top, left });
  }, []);

  const closeColumnsMenu = useCallback(() => {
    setColumnsMenuPos(null);
  }, []);

  const toggleColumn = useCallback((col: keyof VisibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  }, []);

  // Add / Edit Place Form Actions
  const handleStartAddPlace = useCallback(() => {
    setEditingPlace(null);
    setPlaceFormData(INITIAL_PLACE_FORM);
    setScheduleType("24/7");
    setScheduleData(DEFAULT_SCHEDULE_DATA);
    setPlaceModalOpen(true);
    setShowExcelImport(false);
  }, []);

  const handleStartEditPlace = useCallback((place: DBPlace) => {
    setEditingPlace(place);
    const mainImage = place.images && place.images.length > 0 ? place.images[0] : "";
    const menuImgs = place.menu_images ? (Array.isArray(place.menu_images) ? place.menu_images.join(", ") : place.menu_images) : "";
    const phonesStr = place.phones ? (Array.isArray(place.phones) ? place.phones.join(", ") : place.phones) : "";

    try {
      if (typeof place.working_hours === 'string' && place.working_hours.startsWith('{')) {
        const parsed = JSON.parse(place.working_hours);
        if (parsed.type === "custom" && Array.isArray(parsed.schedule)) {
          setScheduleType("custom");
          setScheduleData(parsed.schedule);
        } else {
          setScheduleType("24/7");
          setScheduleData(DEFAULT_SCHEDULE_DATA);
        }
      } else {
        setScheduleType("24/7");
        setScheduleData(DEFAULT_SCHEDULE_DATA);
      }
    } catch {
      setScheduleType("24/7");
      setScheduleData(DEFAULT_SCHEDULE_DATA);
    }

    setPlaceFormData({
      id: place.id,
      name: place.name || "",
      name_en: place.name_en || "",
      category: place.category || "food_drinks",
      category_label: place.category_label || CATEGORY_MAP[place.category] || "أكل ومشروبات",
      sub_categories: Array.isArray(place.sub_categories) ? place.sub_categories : [],
      place_type: place.place_type || "",
      place_type_icon: place.place_type_icon || "",
      governorate: place.governorate || governoratesList[0] || "القاهرة",
      city: place.city || "",
      short_description: place.short_description || "",
      full_address: place.full_address || "",
      phones: phonesStr,
      google_maps_url: place.google_maps_url || "",
      image_url: mainImage,
      menu_images: menuImgs,
      working_hours: typeof place.working_hours === 'object' ? JSON.stringify(place.working_hours) : (place.working_hours || ""),
      description: place.description || "",
      latitude: place.latitude != null ? place.latitude.toString() : "",
      longitude: place.longitude != null ? place.longitude.toString() : "",
      website_url: (place as any).website_url || "",
      features: Array.isArray(place.features) ? place.features : [],
      services: Array.isArray(place.services) ? place.services : [],
    });

    setPlaceModalOpen(true);
    closeActionMenu();
  }, [closeActionMenu]);

  const updatePlaceForm = useCallback((field: keyof PlaceFormData, value: any) => {
    setPlaceFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSavePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setIsSubmittingPlace(true);
    setError("");

    try {
      const phonesArray = placeFormData.phones.split(",").map(p => p.trim()).filter(Boolean);
      const imagesArray = placeFormData.image_url ? [placeFormData.image_url.trim()] : [];
      const menuImagesArray = placeFormData.menu_images.split(",").map(m => m.trim()).filter(Boolean);

      const finalWorkingHours = JSON.stringify({
        type: scheduleType,
        schedule: scheduleType === "custom" ? scheduleData : undefined
      });

      const payload = {
        name: placeFormData.name.trim(),
        name_en: placeFormData.name_en.trim() || null,
        category: placeFormData.category,
        category_label: placeFormData.category_label || CATEGORY_MAP[placeFormData.category] || placeFormData.category,
        sub_categories: placeFormData.sub_categories || [],
        governorate: placeFormData.governorate,
        city: placeFormData.city,
        short_description: placeFormData.short_description,
        full_address: placeFormData.full_address,
        phones: phonesArray,
        google_maps_url: placeFormData.google_maps_url,
        images: imagesArray,
        menu_images: menuImagesArray,
        working_hours: finalWorkingHours,
        description: placeFormData.description,
        latitude: parseFloat(placeFormData.latitude) || null,
        longitude: parseFloat(placeFormData.longitude) || null,
        website_url: placeFormData.website_url.trim() || null,
        features: placeFormData.features || [],
        services: placeFormData.services || [],
        place_type: placeFormData.place_type.trim() || null,
        place_type_icon: placeFormData.place_type.trim() ? (formatBoxIcon(placeFormData.place_type_icon).trim() || "bx bx-tag") : null
      };

      if (editingPlace) {
        // Update existing place
        let { data, error: updateError } = await supabase
          .from("places")
          .update(payload)
          .eq("id", editingPlace.id)
          .select()
          .single();

        if (updateError) {
          console.warn("Place update fallback attempt...");
          const fallback = { ...payload };
          // @ts-ignore
          delete fallback.features;
          let retry = await supabase.from("places").update(fallback).eq("id", editingPlace.id).select().single();
          if (retry.error) {
            // @ts-ignore
            delete fallback.website_url;
            retry = await supabase.from("places").update(fallback).eq("id", editingPlace.id).select().single();
          }
          data = retry.data;
          updateError = retry.error;
        }

        if (updateError) throw updateError;

        // Synchronize main branch
        const branchUpdatePayload = {
          name: placeFormData.name.trim(),
          governorate: placeFormData.governorate,
          city: placeFormData.city,
          full_address: placeFormData.full_address,
          phones: phonesArray,
          google_maps_url: placeFormData.google_maps_url,
          working_hours: finalWorkingHours,
          website_url: placeFormData.website_url.trim() || null,
          features: placeFormData.features || [],
          services: placeFormData.services || []
        };

        await supabase
          .from("branches")
          .update(branchUpdatePayload)
          .eq("place_id", editingPlace.id)
          .eq("is_main", true);

        setPlaces(prev => prev.map(p => p.id === editingPlace.id ? { ...p, ...(data || payload) } : p));
        setPlaceModalOpen(false);
        setEditingPlace(null);
        setDeleteAlertModal({
          isOpen: true,
          type: "success",
          title: "تم التحديث",
          message: `تم تحديث بيانات « ${placeFormData.name} » بنجاح!`,
        });
      } else {
        // Duplicate check
        const isManualDuplicate = places.some(p =>
          p.name.trim().toLowerCase() === placeFormData.name.trim().toLowerCase() &&
          p.category.trim().toLowerCase() === placeFormData.category.trim().toLowerCase() &&
          (p.governorate || "").trim().toLowerCase() === placeFormData.governorate.trim().toLowerCase() &&
          (p.city || "").trim().toLowerCase() === placeFormData.city.trim().toLowerCase()
        );

        if (isManualDuplicate) {
          setError(`المكان "${placeFormData.name}" مسجل بالفعل مسبقاً بنفس التصنيف في ${placeFormData.city}، ${placeFormData.governorate}.`);
          setIsSubmittingPlace(false);
          return;
        }

        let { data, error: insertError } = await supabase
          .from("places")
          .insert([payload])
          .select()
          .single();

        if (insertError) {
          console.warn("Place insert fallback attempt...");
          const fallback = { ...payload };
          // @ts-ignore
          delete fallback.features;
          let retry = await supabase.from("places").insert([fallback]).select().single();
          if (retry.error) {
            // @ts-ignore
            delete fallback.website_url;
            retry = await supabase.from("places").insert([fallback]).select().single();
          }
          data = retry.data;
          insertError = retry.error;
        }

        if (insertError) throw insertError;

        if (data) {
          // Create main branch
          const branchPayload = {
            place_id: data.id,
            name: "الفرع الرئيسي",
            governorate: data.governorate,
            city: data.city,
            full_address: data.full_address,
            phones: data.phones,
            google_maps_url: data.google_maps_url,
            working_hours: data.working_hours,
            latitude: data.latitude,
            longitude: data.longitude,
            is_main: true,
            website_url: data.website_url || null,
            features: data.features || [],
            services: data.services || []
          };

          await supabase.from("branches").insert([branchPayload]);

          const placeWithBranch: DBPlace = {
            ...data,
            branches: [{ ...branchPayload, id: "temp-main-branch" } as BranchItem]
          };

          setPlaces(prev => [placeWithBranch, ...prev]);
          setPlaceModalOpen(false);
          setPlaceFormData(INITIAL_PLACE_FORM);
          setDeleteAlertModal({
            isOpen: true,
            type: "success",
            title: "تمت الإضافة",
            message: `تمت إضافة المكان « ${data.name} » بنجاح!`,
          });
        }
      }
    } catch (err: any) {
      setError("فشل حفظ المكان: " + (err.message || ""));
    } finally {
      setIsSubmittingPlace(false);
    }
  };

  // Delete Place & Relations
  const deletePlacesAndRelations = useCallback(async (ids: string[]) => {
    if (!supabase || ids.length === 0) return;
    const CHUNK_SIZE = 40;
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      const chunk = ids.slice(i, i + CHUNK_SIZE);
      await Promise.allSettled([
        supabase.from("branches").delete().in("place_id", chunk),
        supabase.from("favorite_places").delete().in("place_id", chunk),
        supabase.from("place_notes").delete().in("place_id", chunk),
        supabase.from("place_reports").delete().in("place_id", chunk),
        supabase.from("reviews").delete().in("place_id", chunk),
      ]);
      const { error: placesError } = await supabase.from("places").delete().in("id", chunk);
      if (placesError) throw placesError;
    }
  }, []);

  const handleDeletePlace = useCallback((place: DBPlace) => {
    setDeleteModal({
      isOpen: true,
      place,
      isBulk: false,
    });
    closeActionMenu();
  }, [closeActionMenu]);

  const confirmDeletePlace = async () => {
    if (!deleteModal.place || !supabase) return;
    const placeId = deleteModal.place.id;
    const placeName = deleteModal.place.name;
    setIsDeletingPlace(true);
    try {
      await deletePlacesAndRelations([placeId]);
      setPlaces(prev => prev.filter(p => p.id !== placeId));
      setSelectedPlaceIds(prev => prev.filter(id => id !== placeId));
      setDeleteModal({ isOpen: false, place: null });
      setDeleteAlertModal({
        isOpen: true,
        type: "success",
        title: "تم الحذف بنجاح",
        message: "تم حذف المكان بنجاح من قاعدة البيانات!",
        placeName,
      });
    } catch (err: any) {
      setDeleteAlertModal({
        isOpen: true,
        type: "error",
        title: "فشل الحذف",
        message: "حدث خطأ أثناء الحذف: " + (err.message || "Bad Request"),
      });
    } finally {
      setIsDeletingPlace(false);
    }
  };

  const handleStartBulkDelete = useCallback(() => {
    if (selectedPlaceIds.length === 0) return;
    setDeleteModal({
      isOpen: true,
      place: null,
      isBulk: true,
      bulkCount: selectedPlaceIds.length,
    });
  }, [selectedPlaceIds]);

  const confirmBulkDelete = async () => {
    if (selectedPlaceIds.length === 0 || !supabase) return;
    setIsBulkDeleting(true);
    try {
      const count = selectedPlaceIds.length;
      await deletePlacesAndRelations(selectedPlaceIds);
      setPlaces(prev => prev.filter(p => !selectedPlaceIds.includes(p.id)));
      setSelectedPlaceIds([]);
      setDeleteModal({ isOpen: false, place: null });
      setDeleteAlertModal({
        isOpen: true,
        type: "success",
        title: "تم الحذف بنجاح",
        message: `تم بنجاح حذف ${count} مكان من قاعدة البيانات!`,
      });
    } catch (err: any) {
      setDeleteAlertModal({
        isOpen: true,
        type: "error",
        title: "خطأ أثناء الحذف",
        message: "حدث خطأ أثناء حذف الأماكن المحددة: " + (err.message || "Bad Request"),
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleCleanDbDuplicates = async () => {
    if (dbDuplicatesList.length === 0 || !supabase) return;
    const confirmClean = window.confirm(`هل أنت متأكد من رغبتك في حذف ${dbDuplicatesList.length} مكان مكرر من قاعدة البيانات نهائياً؟`);
    if (!confirmClean) return;

    setIsDeletingDuplicates(true);
    try {
      const idsToDelete = dbDuplicatesList.map(d => d.duplicateId);
      await deletePlacesAndRelations(idsToDelete);
      setPlaces(prev => prev.filter(p => !idsToDelete.includes(p.id)));
      setDeleteAlertModal({
        isOpen: true,
        type: "success",
        title: "تم التنظيف بنجاح",
        message: `تم بنجاح تنظيف قاعدة البيانات وحذف ${idsToDelete.length} مكان مكرر!`,
      });
    } catch (err: any) {
      setDeleteAlertModal({
        isOpen: true,
        type: "error",
        title: "خطأ أثناء التنظيف",
        message: "حدث خطأ أثناء تنظيف المكررات: " + (err.message || ""),
      });
    } finally {
      setIsDeletingDuplicates(false);
    }
  };

  const handleSeedData = async () => {
    if (!confirm("هل تريد إضافة البيانات التجريبية الأولية؟")) return;
    if (!supabase) return;

    setIsSubmittingPlace(true);
    try {
      const formattedInitialPlaces = initialPlaces.map(p => {
        const parts = (p.briefLocation || "").split("/").map(s => s.trim());
        const city = parts[0] || "غير محدد";
        const gov = parts[1] || parts[0] || "غير محدد";

        return {
          name: p.name,
          category: p.category,
          category_label: p.categoryLabel,
          governorate: gov,
          city: city,
          short_description: p.shortDescription || p.description?.substring(0, 50) || "",
          full_address: p.fullAddress,
          phones: p.phones || [],
          google_maps_url: p.googleMapsUrl || "",
          images: p.images || [],
          menu_images: p.menuImages || [],
          working_hours: JSON.stringify({ type: "24/7" }),
          rating: p.rating || 0,
          description: p.description || "",
          latitude: p.latitude || null,
          longitude: p.longitude || null,
        };
      });

      const { data, error: insertError } = await supabase
        .from("places")
        .insert(formattedInitialPlaces)
        .select();

      if (insertError) throw insertError;
      if (data) {
        setPlaces(prev => [...(data as DBPlace[]), ...prev]);
        setDeleteAlertModal({
          isOpen: true,
          type: "success",
          title: "تمت إضافة البيانات",
          message: "تم تفعيل البيانات التجريبية بنجاح!",
        });
      }
    } catch (err: any) {
      alert("حدث خطأ أثناء الإضافة: " + err.message);
    } finally {
      setIsSubmittingPlace(false);
    }
  };

  // Branch Handlers
  const openBranchesModal = useCallback((place: DBPlace) => {
    setSelectedPlaceForBranch(place);
    setEditingBranchId(null);
    setBranchFormData({
      name: "",
      governorate: place.governorate || governoratesList[0] || "القاهرة",
      city: "",
      full_address: "",
      phones: "",
      google_maps_url: "",
      latitude: "",
      longitude: "",
      media: ""
    });
    setBranchScheduleType("24/7");
    setBranchScheduleData(DEFAULT_SCHEDULE_DATA);
    closeActionMenu();
  }, [closeActionMenu]);

  const handleEditBranch = useCallback((branch: BranchItem) => {
    setEditingBranchId(branch.id || null);
    setBranchFormData({
      name: branch.name || "",
      governorate: branch.governorate || selectedPlaceForBranch?.governorate || "القاهرة",
      city: branch.city || "",
      full_address: branch.full_address || "",
      phones: (branch.phones || []).join(", "),
      google_maps_url: branch.google_maps_url || "",
      latitude: branch.latitude != null ? branch.latitude.toString() : "",
      longitude: branch.longitude != null ? branch.longitude.toString() : "",
      media: (branch.media || []).join(", ")
    });

    const hw = branch.working_hours;
    if (!hw || hw === "24/7") {
      setBranchScheduleType("24/7");
      setBranchScheduleData(DEFAULT_SCHEDULE_DATA);
    } else {
      try {
        const parsed = JSON.parse(hw);
        if (parsed.type === "custom" && parsed.schedule) {
          setBranchScheduleType("custom");
          setBranchScheduleData(parsed.schedule);
        } else {
          setBranchScheduleType("24/7");
          setBranchScheduleData(DEFAULT_SCHEDULE_DATA);
        }
      } catch {
        setBranchScheduleType("24/7");
        setBranchScheduleData(DEFAULT_SCHEDULE_DATA);
      }
    }
  }, [selectedPlaceForBranch]);

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !selectedPlaceForBranch) return;

    setIsSubmittingBranch(true);
    try {
      const phonesArray = branchFormData.phones.split(",").map(p => p.trim()).filter(Boolean);
      const mediaArray = branchFormData.media.split(",").map(m => m.trim()).filter(Boolean);

      const branchPayload = {
        name: branchFormData.name,
        governorate: branchFormData.governorate,
        city: branchFormData.city,
        full_address: branchFormData.full_address,
        phones: phonesArray,
        google_maps_url: branchFormData.google_maps_url,
        working_hours: branchScheduleType === "24/7" ? "24/7" : JSON.stringify({ type: "custom", schedule: branchScheduleData }),
        latitude: parseFloat(branchFormData.latitude) || null,
        longitude: parseFloat(branchFormData.longitude) || null,
        media: mediaArray
      };

      let savedData: any, insertOrUpdateError: any;

      if (editingBranchId) {
        const res = await supabase
          .from("branches")
          .update(branchPayload)
          .eq("id", editingBranchId)
          .select()
          .single();
        savedData = res.data;
        insertOrUpdateError = res.error;
      } else {
        const newBranchPayload = {
          ...branchPayload,
          place_id: selectedPlaceForBranch.id,
          is_main: false
        };
        const res = await supabase
          .from("branches")
          .insert([newBranchPayload])
          .select()
          .single();
        savedData = res.data;
        insertOrUpdateError = res.error;
      }

      if (insertOrUpdateError) throw insertOrUpdateError;

      if (savedData) {
        setPlaces(prev => prev.map(p => {
          if (p.id === selectedPlaceForBranch.id) {
            const currentBranches = p.branches || [];
            const nextBranches = editingBranchId
              ? currentBranches.map(b => b.id === editingBranchId ? savedData : b)
              : [...currentBranches, savedData];
            return { ...p, branches: nextBranches };
          }
          return p;
        }));

        setSelectedPlaceForBranch(prev => {
          if (!prev) return null;
          const currentBranches = prev.branches || [];
          const nextBranches = editingBranchId
            ? currentBranches.map(b => b.id === editingBranchId ? savedData : b)
            : [...currentBranches, savedData];
          return { ...prev, branches: nextBranches };
        });

        setEditingBranchId(null);
        setBranchFormData({
          name: "",
          governorate: selectedPlaceForBranch.governorate || "القاهرة",
          city: "",
          full_address: "",
          phones: "",
          google_maps_url: "",
          latitude: "",
          longitude: "",
          media: ""
        });

        setDeleteAlertModal({
          isOpen: true,
          type: "success",
          title: editingBranchId ? "تم تعديل الفرع" : "تمت إضافة الفرع",
          message: editingBranchId ? "تم تعديل بيانات الفرع بنجاح!" : "تمت إضافة الفرع الجديد بنجاح!",
        });
      }
    } catch (err: any) {
      alert("حدث خطأ أثناء حفظ الفرع: " + (err.message || ""));
    } finally {
      setIsSubmittingBranch(false);
    }
  };

  const handleDeleteBranch = async (branchId: string, placeId: string, isMain: boolean) => {
    if (isMain) {
      alert("لا يمكن حذف الفرع الرئيسي مباشرة. يمكنك حذف المكان بالكامل.");
      return;
    }
    if (!confirm("هل أنت متأكد من حذف هذا الفرع؟")) return;
    if (!supabase) return;

    try {
      const { error: deleteError } = await supabase.from("branches").delete().eq("id", branchId);
      if (deleteError) throw deleteError;

      setPlaces(prev => prev.map(p => {
        if (p.id === placeId) {
          return { ...p, branches: (p.branches || []).filter(b => b.id !== branchId) };
        }
        return p;
      }));

      setSelectedPlaceForBranch(prev => {
        if (!prev) return null;
        return { ...prev, branches: (prev.branches || []).filter(b => b.id !== branchId) };
      });
    } catch (err: any) {
      alert("فشل حذف الفرع: " + err.message);
    }
  };

  const extractCoordinates = async (url: string) => {
    if (!url || !url.includes("maps")) return;
    try {
      const res = await fetch(`/api/extract-location?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.latitude && data.longitude) {
          updatePlaceForm("latitude", data.latitude.toString());
          updatePlaceForm("longitude", data.longitude.toString());
        }
      }
    } catch (err) {
      console.error("Failed to extract coordinates", err);
    }
  };

  const extractBranchCoordinates = async (url: string) => {
    if (!url || !url.includes("maps")) return;
    try {
      const res = await fetch(`/api/extract-location?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.latitude && data.longitude) {
          setBranchFormData(p => ({ ...p, latitude: data.latitude.toString(), longitude: data.longitude.toString() }));
        }
      }
    } catch (err) {
      console.error("Failed to extract branch coordinates", err);
    }
  };

  // Excel Handlers
  const handleDownloadTemplate = async () => {
    if (typeof window === "undefined") return;
    try {
      const XLSX = await import("xlsx");
      const headers = [
        "الاسم", "الاسم (بالإنجليزية)", "القسم الرئيسي", "الأقسام الفرعية", "المدينة / المنطقة", "العنوان بالتفصيل", "رابط جوجل ماب", "المحافظة", "الهواتف",
        "مواعيد الأحد", "مواعيد الإثنين", "مواعيد الثلاثاء", "مواعيد الأربعاء", "مواعيد الخميس", "مواعيد الجمعة", "مواعيد السبت",
        "مواعيد العمل",
        "معلومات مفيدة (المميزات)",
        "خط العرض", "خط الطول", "وصف قصير", "الوصف التفصيلي", "رابط الصورة الرئيسية", "روابط المنيو",
        "موقع الويب", "الخدمات", "نوع المكان", "أيقونة النوع"
      ];

      const sampleData = [
        {
          "الاسم": "مطعم البركة",
          "الاسم (بالإنجليزية)": "Al Baraka Restaurant",
          "القسم الرئيسي": "أكل ومشروبات",
          "الأقسام الفرعية": "مطاعم, فاست فود",
          "المدينة / المنطقة": "مصر الجديدة",
          "العنوان بالتفصيل": "15 شارع الثورة، بجوار مسجد جمال",
          "رابط جوجل ماب": "https://maps.google.com/?q=30.0815,31.3256",
          "المحافظة": "القاهرة",
          "الهواتف": "01012345678, 0224150000",
          "مواعيد الأحد": "09:00 ص - 11:00 م",
          "مواعيد الإثنين": "09:00 ص - 11:00 م",
          "مواعيد الثلاثاء": "09:00 ص - 11:00 م",
          "مواعيد الأربعاء": "09:00 ص - 11:00 م",
          "مواعيد الخميس": "09:00 ص - 12:00 م",
          "مواعيد الجمعة": "02:00 م - 12:00 م",
          "مواعيد السبت": "09:00 ص - 11:00 م",
          "مواعيد العمل": "",
          "معلومات مفيدة (المميزات)": "خيارات نباتية متوفرة, شبكة واي فاي مجانية, يقبل الدفع بالبطاقات الائتمانية, مناسب للمجموعات والعائلات",
          "خط العرض": 30.0815,
          "خط الطول": 31.3256,
          "وصف قصير": "أفضل مطعم مشويات في مصر الجديدة",
          "الوصف التفصيلي": "مطعم شرقي يقدم أشهى المشويات والطواجن المصرية بأسعار مناسبة وأجواء عائلية راقية.",
          "رابط الصورة الرئيسية": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
          "روابط المنيو": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
          "موقع الويب": "https://albarakarestaurant.com",
          "الخدمات": "دليفري, صالة طعام, تيك أواي",
          "نوع المكان": "مشويات شرقية",
          "أيقونة النوع": "bx-dish"
        }
      ];

      const guideHeaders = ["القسم الرئيسي", "التصنيفات الفرعية المتاحة (يفصل بينها بفصلة)"];
      const guideData = CATEGORIES_STRUCTURE.map(main => ({
        "القسم الرئيسي": main.label,
        "التصنيفات الفرعية المتاحة (يفصل بينها بفصلة)": main.subCategories.map(s => s.label).join(" ، ")
      }));

      const whGuideHeaders = ["اسم عمود اليوم في Excel", "مثال التوقيت المدخل في الخلية", "شرح النتيجة"];
      const whGuideData = [
        { "اسم عمود اليوم في Excel": "مواعيد الأحد (أو الأحد)", "مثال التوقيت المدخل في الخلية": "09:00 ص - 11:00 م", "شرح النتيجة": "يفتح الساعة 9 صباحاً ويغلق 11 مساءً يوم الأحد" },
        { "اسم عمود اليوم في Excel": "مواعيد الخميس (أو الخميس)", "مثال التوقيت المدخل في الخلية": "09:00 ص - 12:00 م", "شرح النتيجة": "يفتح الساعة 9 صباحاً ويغلق 12 منتصف الليل يوم الخميس" },
        { "اسم عمود اليوم في Excel": "مواعيد الجمعة (أو الجمعة)", "مثال التوقيت المدخل في الخلية": "إجازة (أو مغلق)", "شرح النتيجة": "يوم الجمعة عطلة رسمية للمكان" },
        { "اسم عمود اليوم في Excel": "مواعيد الأحد إلى السبت", "مثال التوقيت المدخل في الخلية": "24/7", "شرح النتيجة": "المكان يعمل 24 ساعة طوال اليوم" }
      ];

      const featGuideHeaders = ["الأيقونة", "معلومات مفيدة / الميزة", "طريقة الكتابة في Excel"];
      const featGuideData = FEATURES_LIST.map(f => ({
        "الأيقونة": f.icon,
        "معلومات مفيدة / الميزة": f.label,
        "طريقة الكتابة في Excel": `${f.label} (أو ${f.key})`
      }));

      const worksheet = XLSX.utils.json_to_sheet(sampleData, { header: headers });
      const guideWorksheet = XLSX.utils.json_to_sheet(guideData, { header: guideHeaders });
      const whGuideWorksheet = XLSX.utils.json_to_sheet(whGuideData, { header: whGuideHeaders });
      const featGuideWorksheet = XLSX.utils.json_to_sheet(featGuideData, { header: featGuideHeaders });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "الأماكن");
      XLSX.utils.book_append_sheet(workbook, guideWorksheet, "دليل التصنيفات الفرعية");
      XLSX.utils.book_append_sheet(workbook, whGuideWorksheet, "دليل مواعيد العمل اليومية");
      XLSX.utils.book_append_sheet(workbook, featGuideWorksheet, "دليل المميزات والمعلومات");

      XLSX.writeFile(workbook, "places_template.xlsx");
    } catch (err: any) {
      alert("حدث خطأ أثناء تحميل الملف: " + err.message);
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError("");
    setImportSuccess("");
    setParsedPlaces([]);
    setSelectedParsedIndices(new Set());
    setParsedPlacesSearch("");
    setDuplicates([]);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const XLSX = await import("xlsx");
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          setImportError("الملف المرفوع فارغ أو يحتوي على بيانات غير صالحة.");
          return;
        }

        const categoryMapByLabel: Record<string, string> = {};
        CATEGORIES_STRUCTURE.forEach(main => {
          categoryMapByLabel[main.label.trim().toLowerCase()] = main.name;
          categoryMapByLabel[main.name.trim().toLowerCase()] = main.name;
          main.subCategories.forEach(sub => {
            categoryMapByLabel[sub.label.trim().toLowerCase()] = sub.name;
            categoryMapByLabel[sub.name.trim().toLowerCase()] = sub.name;
          });
        });

        const normalizeKeyPart = (val?: string | null): string => {
          return (val || "").toString().trim().toLowerCase().replace(/\s+/g, " ");
        };

        const getPlaceIdentityKey = (pName: string, pCategory: string, pGov?: string | null, pCity?: string | null): string => {
          return `${normalizeKeyPart(pName)}_${normalizeKeyPart(pCategory)}_${normalizeKeyPart(pGov || "القاهرة")}_${normalizeKeyPart(pCity)}`;
        };

        const dbPlacesMap = new Map<string, DBPlace>();
        places.forEach(p => {
          const key = getPlaceIdentityKey(p.name, p.category, p.governorate, p.city);
          dbPlacesMap.set(key, p);
        });

        const seenKeys = new Set<string>();
        const duplicatesList: any[] = [];
        const mapped: ExcelParsedPlace[] = [];

        for (let i = 0; i < data.length; i++) {
          const row: any = data[i];

          const name = (row["الاسم"] || row["اسم المكان (بالعربية)"] || row["الاسم بالعربية"] || row["name_ar"] || row["Name"] || "")?.toString().trim();
          const name_en = (row["الاسم (بالإنجليزية)"] || row["الاسم (بالانجليزية)"] || row["اسم المكان (بالإنجليزية)"] || row["name_en"] || "")?.toString().trim();
          let category = (row["القسم الرئيسي"] || row["التصنيف الرئيسي"] || row["category"] || "")?.toString().trim();
          const city = (row["المدينة / المنطقة"] || row["المدينة"] || row["المنطقة / الحي"] || row["city"] || "")?.toString().trim();
          const full_address = (row["العنوان بالتفصيل"] || row["العنوان"] || row["address"] || "")?.toString().trim();
          const google_maps_url = (row["رابط جوجل ماب"] || row["رابط الخريطة"] || row["google_maps_url"] || row["Maps URL"] || "")?.toString().trim();

          if (!name || !category || !city || !full_address || !google_maps_url) {
            setImportError(`السطر رقم ${i + 2}: يحتوي على حقول مطلوبة مفقودة (الاسم، القسم الرئيسي، المدينة / المنطقة، العنوان بالتفصيل، ورابط جوجل ماب مطلوبة جميعها).`);
            setParsedPlaces([]);
            setDuplicates([]);
            return;
          }

          const rawSubCats = row["الأقسام الفرعية"]?.toString() || "";
          const parsedSubCats = rawSubCats
            ? rawSubCats.split(/[,\u060C\n\r\/;|]+/).map((s: string) => {
              const trimmed = s.trim();
              if (!trimmed) return "";
              const lower = trimmed.toLowerCase();
              return categoryMapByLabel[lower] || trimmed;
            }).filter(Boolean)
            : [];

          const governorate = row["المحافظة"]?.toString().trim() || "القاهرة";
          const normalizedCat = normalizePlaceCategory(category, parsedSubCats);
          category = normalizedCat.category;
          const category_label = CATEGORY_MAP[category] || normalizedCat.categoryLabel;
          const sub_categories = Array.from(new Set(normalizedCat.subCategories));

          const rawPhones = (row["الهواتف"] || row["الهاتف"] || row["التليفون"] || row["أرقام الهواتف"] || row["phones"] || "").toString();
          const phones = rawPhones
            ? rawPhones.split(/[,;\n\r]+/).map((p: string) => p.trim()).filter(Boolean)
            : [];

          const finalWorkingHours = parseExcelWorkingHours(row);
          const latitude = parseFloat(row["خط العرض"]) || null;
          const longitude = parseFloat(row["خط الطول"]) || parseFloat(row["خط الظرل"]) || null;
          const short_description = (row["وصف قصير"] || row["الوصف القصير"] || "")?.toString().trim() || "";
          const description = (row["الوصف التفصيلي"] || row["الوصف"] || "")?.toString().trim() || "";
          const image_url = (row["رابط الصورة الرئيسية"] || row["رابط الصورة"] || row["الصورة"] || row["الصور"] || "")?.toString().trim();
          const rawMenu = (row["روابط المنيو"] || row["رابط المنيو"] || row["المنيو"] || "")?.toString();
          const menu_images = rawMenu
            ? rawMenu.split(/[,;\n\r]+/).map((m: string) => m.trim()).filter(Boolean)
            : [];
          const website_url = (row["موقع الويب"] || row["الموقع الإلكتروني"] || row["الموقع"] || row["website"] || "")?.toString().trim() || null;

          const rawFeatsStr = (row["معلومات مفيدة (المميزات)"] || row["المميزات"] || row["المميزات والخدمات"] || "").toString();
          const parsedFeats: string[] = [];

          if (rawFeatsStr) {
            const items = rawFeatsStr.split(/[,\u060C\n\r\/;|]+/).map((s: string) => s.trim()).filter(Boolean);
            items.forEach((item: string) => {
              const cleanItem = item.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g, "").trim().toLowerCase();
              const foundFeat = FEATURES_LIST.find(f =>
                f.key.toLowerCase() === item.toLowerCase() ||
                f.label.trim().toLowerCase() === item.trim().toLowerCase() ||
                (cleanItem && f.label.trim().toLowerCase().includes(cleanItem)) ||
                item.includes(f.label)
              );

              if (foundFeat) {
                if (!parsedFeats.includes(foundFeat.key)) parsedFeats.push(foundFeat.key);
              } else if (item.trim()) {
                if (!parsedFeats.includes(item.trim())) parsedFeats.push(item.trim());
              }
            });
          }

          const features = parsedFeats;
          const services = row["الخدمات"]
            ? row["الخدمات"].toString().split(",").map((s: string) => s.trim()).filter(Boolean)
            : [];
          const place_type = row["نوع المكان"]?.toString().trim() || null;
          const place_type_icon = row["أيقونة النوع"]?.toString().trim() || null;

          const key = getPlaceIdentityKey(name, category, governorate, city);

          let duplicateType: "db" | "internal" | null = null;
          let isUpdate = false;
          let existingId: string | null = null;
          let changedFields: string[] = [];

          const existingDbPlace = dbPlacesMap.get(key);

          const candidatePlace = {
            name,
            name_en: name_en || null,
            category,
            category_label: CATEGORY_MAP[category] || category,
            sub_categories,
            governorate,
            city,
            short_description: short_description || (description ? description.substring(0, 80) : ""),
            full_address,
            phones,
            google_maps_url,
            images: image_url ? [image_url] : [],
            menu_images,
            working_hours: finalWorkingHours,
            description,
            latitude,
            longitude,
            website_url,
            features,
            services,
            place_type,
            place_type_icon: place_type ? (formatBoxIcon(place_type_icon || "").trim() || "bx bx-tag") : null
          };

          if (seenKeys.has(key)) {
            duplicateType = "internal";
          } else if (existingDbPlace) {
            const comparison = comparePlaceData(existingDbPlace, candidatePlace);
            if (comparison.isModified) {
              isUpdate = true;
              existingId = existingDbPlace.id;
              changedFields = comparison.changedFields;
              duplicateType = null;
              seenKeys.add(key);
            } else {
              duplicateType = "db";
            }
          } else {
            seenKeys.add(key);
          }

          const item: ExcelParsedPlace = {
            rowNum: i + 2,
            ...candidatePlace,
            duplicateType,
            isUpdate,
            existingId,
            changedFields
          };

          if (duplicateType) {
            duplicatesList.push(item);
          }

          mapped.push(item);
        }

        setParsedPlaces(mapped);
        setDuplicates(duplicatesList);
      } catch (err: any) {
        setImportError("حدث خطأ أثناء قراءة الملف: " + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleRemoveParsedDuplicates = () => {
    const cleanPlaces = parsedPlaces.filter(p => p.duplicateType === null);
    setParsedPlaces(cleanPlaces);
    setDuplicates([]);
    setSelectedParsedIndices(new Set());
    setImportSuccess("تم حذف الأماكن المتكررة بنجاح! الأماكن الباقية جاهزة للاستيراد.");
  };

  const handleDeleteParsedPlace = (indexToDelete: number) => {
    setParsedPlaces(prev => {
      const updated = prev.filter((_, idx) => idx !== indexToDelete);
      const remainingDuplicates = updated.filter(p => p.duplicateType !== null);
      setDuplicates(remainingDuplicates);
      return updated;
    });
    setSelectedParsedIndices(prev => {
      const next = new Set<number>();
      prev.forEach(i => {
        if (i < indexToDelete) next.add(i);
        else if (i > indexToDelete) next.add(i - 1);
      });
      return next;
    });
  };

  const handleDeleteSelectedParsedPlaces = () => {
    if (selectedParsedIndices.size === 0) return;
    const count = selectedParsedIndices.size;
    setParsedPlaces(prev => {
      const updated = prev.filter((_, idx) => !selectedParsedIndices.has(idx));
      const remainingDuplicates = updated.filter(p => p.duplicateType !== null);
      setDuplicates(remainingDuplicates);
      return updated;
    });
    setSelectedParsedIndices(new Set());
    setImportSuccess(`تم حذف ${count} مكان من قائمة المعاينة بنجاح.`);
  };

  const toggleSelectParsedPlace = (idx: number) => {
    setSelectedParsedIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleSelectAllParsedPlaces = (indices: number[]) => {
    setSelectedParsedIndices(prev => {
      const allSelected = indices.length > 0 && indices.every(i => prev.has(i));
      const next = new Set(prev);
      if (allSelected) {
        indices.forEach(i => next.delete(i));
      } else {
        indices.forEach(i => next.add(i));
      }
      return next;
    });
  };

  const handleImportSubmit = async () => {
    if (parsedPlaces.length === 0 || !supabase) return;

    if (duplicates.length > 0) {
      setImportError("يرجى إزالة الأماكن المتكررة أولاً بالضغط على زر 'حذف المتكرر' قبل الحفظ.");
      return;
    }

    setImporting(true);
    setImportError("");
    setImportSuccess("");

    try {
      const newPlaces = parsedPlaces.filter(p => !p.isUpdate);
      const updatePlaces = parsedPlaces.filter(p => p.isUpdate && p.existingId);

      let insertedCount = 0;
      let updatedCount = 0;
      let newlyInsertedWithBranches: DBPlace[] = [];
      const updatedPlacesMap: Record<string, any> = {};

      // 1. Process New Places
      if (newPlaces.length > 0) {
        const cleanData = newPlaces.map(({ duplicateType, rowNum, isUpdate, existingId, changedFields, ...rest }) => rest);

        const { data: insertedPlaces, error: insertError } = await supabase
          .from("places")
          .insert(cleanData)
          .select();

        if (insertError) throw insertError;

        if (insertedPlaces && insertedPlaces.length > 0) {
          insertedCount = insertedPlaces.length;

          const branchesPayload = insertedPlaces.map(place => ({
            place_id: place.id,
            name: "الفرع الرئيسي",
            governorate: place.governorate,
            city: place.city,
            full_address: place.full_address || "",
            phones: place.phones || [],
            google_maps_url: place.google_maps_url || "",
            working_hours: place.working_hours || JSON.stringify({ type: "24/7" }),
            latitude: place.latitude,
            longitude: place.longitude,
            is_main: true,
            website_url: place.website_url || null,
            features: place.features || [],
            services: place.services || []
          }));

          await supabase.from("branches").insert(branchesPayload);

          newlyInsertedWithBranches = insertedPlaces.map((place, idx) => {
            const mainBranch = branchesPayload[idx];
            return {
              ...place,
              branches: mainBranch ? [{ ...mainBranch, id: `temp-branch-${idx}` }] : []
            } as DBPlace;
          });
        }
      }

      // 2. Process Update Places
      if (updatePlaces.length > 0) {
        for (const p of updatePlaces) {
          if (!p.existingId) continue;

          const updatedFields: any = {
            name: p.name,
            name_en: p.name_en || null,
            category: p.category,
            category_label: p.category_label || CATEGORY_MAP[p.category] || p.category,
            sub_categories: p.sub_categories || [],
            governorate: p.governorate,
            city: p.city,
            short_description: p.short_description || "",
            full_address: p.full_address || "",
            phones: p.phones || [],
            google_maps_url: p.google_maps_url || "",
            images: p.images || [],
            menu_images: p.menu_images || [],
            working_hours: p.working_hours || JSON.stringify({ type: "24/7" }),
            description: p.description || "",
            latitude: p.latitude,
            longitude: p.longitude,
            website_url: p.website_url || null,
            features: p.features || [],
            services: p.services || [],
            place_type: p.place_type || null,
            place_type_icon: p.place_type_icon || null
          };

          const { data: updatedData } = await supabase
            .from("places")
            .update(updatedFields)
            .eq("id", p.existingId)
            .select()
            .single();

          if (updatedData) {
            updatedCount++;
            updatedPlacesMap[p.existingId] = updatedData;

            const branchPayload: any = {
              name: p.name,
              governorate: p.governorate,
              city: p.city,
              full_address: p.full_address || "",
              phones: p.phones || [],
              google_maps_url: p.google_maps_url || "",
              working_hours: p.working_hours || JSON.stringify({ type: "24/7" }),
              website_url: p.website_url || null,
              features: p.features || [],
              services: p.services || []
            };

            await supabase
              .from("branches")
              .update(branchPayload)
              .eq("place_id", p.existingId)
              .eq("is_main", true);
          }
        }
      }

      setPlaces(prev => {
        let next = prev.map(p => {
          if (updatedPlacesMap[p.id]) {
            return {
              ...p,
              ...updatedPlacesMap[p.id],
              branches: p.branches
            };
          }
          return p;
        });
        if (newlyInsertedWithBranches.length > 0) {
          next = [...newlyInsertedWithBranches, ...next];
        }
        return next;
      });

      const successParts: string[] = [];
      if (insertedCount > 0) successParts.push(`إضافة ${insertedCount} مكان جديد وإنشاء فروعها الرئيسية`);
      if (updatedCount > 0) successParts.push(`تحديث بيانات ${updatedCount} مكان مسجل مسبقاً`);
      setImportSuccess(`تم بنجاح ${successParts.join(" و ")}!`);

      setParsedPlaces([]);
      setDuplicates([]);

      const fileInput = document.getElementById("excel-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      setImportError("حدث خطأ أثناء حفظ الأماكن: " + (err.message || ""));
    } finally {
      setImporting(false);
    }
  };

  return {
    // Auth & Base State
    isAdmin,
    loading: authLoading || loading,
    places,
    error,
    setError,

    // Filter & Search
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedGovernorate,
    setSelectedGovernorate,
    viewMode,
    setViewMode,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredPlaces,
    paginatedPlaces,
    categoryCounts,
    governorateCounts,
    dbDuplicatesList,

    // Columns & Dropdown Menus
    visibleColumns,
    toggleColumn,
    columnsMenuPos,
    openColumnsMenu,
    closeColumnsMenu,
    actionMenu,
    openActionMenu,
    closeActionMenu,

    // Details Modal
    detailsPlace,
    setDetailsPlace,

    // Selection & Bulk Actions
    selectedPlaceIds,
    setSelectedPlaceIds,
    isAllSelected,
    handleToggleSelectAll,
    handleToggleSelectPlace,
    isBulkDeleting,
    handleStartBulkDelete,
    confirmBulkDelete,

    // Delete Modals
    deleteModal,
    setDeleteModal,
    isDeletingPlace,
    handleDeletePlace,
    confirmDeletePlace,
    deleteAlertModal,
    setDeleteAlertModal,

    // Place Form Modal (Add & Edit)
    placeModalOpen,
    setPlaceModalOpen,
    editingPlace,
    placeFormData,
    updatePlaceForm,
    scheduleType,
    setScheduleType,
    scheduleData,
    setScheduleData,
    isSubmittingPlace,
    handleStartAddPlace,
    handleStartEditPlace,
    handleSavePlace,
    extractCoordinates,

    // Branches Modal
    selectedPlaceForBranch,
    setSelectedPlaceForBranch,
    editingBranchId,
    setEditingBranchId,
    branchFormData,
    setBranchFormData,
    branchScheduleType,
    setBranchScheduleType,
    branchScheduleData,
    setBranchScheduleData,
    isSubmittingBranch,
    openBranchesModal,
    handleEditBranch,
    handleSaveBranch,
    handleDeleteBranch,
    extractBranchCoordinates,

    // Excel Import
    showExcelImport,
    setShowExcelImport,
    importing,
    parsedPlaces,
    selectedParsedIndices,
    parsedPlacesSearch,
    setParsedPlacesSearch,
    importError,
    importSuccess,
    duplicates,
    handleDownloadTemplate,
    handleExcelUpload,
    handleRemoveParsedDuplicates,
    handleDeleteParsedPlace,
    handleDeleteSelectedParsedPlaces,
    toggleSelectParsedPlace,
    toggleSelectAllParsedPlaces,
    handleImportSubmit,

    // Custom Categories Modal
    categories,
    fetchCategories,
    showAddCategoryModal,
    setShowAddCategoryModal,
    newCatLabel,
    setNewCatLabel,
    newCatKey,
    setNewCatKey,
    newCatIcon,
    setNewCatIcon,
    isAddingCategory,
    handleAddCategorySubmit,

    // DB Clean & Seed
    handleCleanDbDuplicates,
    isDeletingDuplicates,
    handleSeedData
  };
}
