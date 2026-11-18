"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatBoxIcon } from "@/data/places";
import {
  PhoneEntry,
  TelecomCodeEntry,
  PhoneFormData,
  TelecomCodeFormData,
  DirectoryTab,
  ViewMode,
  VisibleColumnsPhones,
  VisibleColumnsCodes,
  ActionMenuState,
  DetailsModalState,
  DeleteModalState,
} from "../types";
import {
  INITIAL_PHONE_FORM,
  INITIAL_CODE_FORM,
  INITIAL_VISIBLE_PHONE_COLUMNS,
  INITIAL_VISIBLE_CODE_COLUMNS,
} from "../constants";
import {
  filterPhones,
  filterCodes,
  getSpecialtyCounts,
  getCompanyCounts,
  getSpecialtyIcons,
} from "../utils";

export function useAdminDirectory(isSubComponent = false) {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState<boolean>(isSubComponent ? true : false);
  const [loading, setLoading] = useState<boolean>(isSubComponent ? false : true);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<DirectoryTab>("phones");

  // Phones State
  const [phones, setPhones] = useState<PhoneEntry[]>([]);
  const [selectedSpecialtyTab, setSelectedSpecialtyTab] = useState<string>("all");
  const [phoneFormData, setPhoneFormData] = useState<PhoneFormData>(INITIAL_PHONE_FORM);
  const [editingPhone, setEditingPhone] = useState<PhoneEntry | null>(null);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [selectedPhoneIds, setSelectedPhoneIds] = useState<Set<string>>(new Set());

  // Codes State
  const [codes, setCodes] = useState<TelecomCodeEntry[]>([]);
  const [selectedCompanyTab, setSelectedCompanyTab] = useState<string>("all");
  const [codeFormData, setCodeFormData] = useState<TelecomCodeFormData>(INITIAL_CODE_FORM);
  const [editingCode, setEditingCode] = useState<TelecomCodeEntry | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [selectedCodeIds, setSelectedCodeIds] = useState<Set<string>>(new Set());

  // Shared Filter & View State
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Column Visibility
  const [visiblePhoneColumns, setVisiblePhoneColumns] =
    useState<VisibleColumnsPhones>(INITIAL_VISIBLE_PHONE_COLUMNS);
  const [visibleCodeColumns, setVisibleCodeColumns] =
    useState<VisibleColumnsCodes>(INITIAL_VISIBLE_CODE_COLUMNS);
  const [isColumnsMenuOpen, setIsColumnsMenuOpen] = useState(false);

  // Modals & Floating Menus
  const [actionMenu, setActionMenu] = useState<ActionMenuState>(null);
  const [detailsModal, setDetailsModal] = useState<DetailsModalState>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>(null);

  const showNotification = useCallback(
    (type: "success" | "error", text: string) => {
      setNotification({ type, text });
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    },
    []
  );

  // Auth & Initial Fetch
  useEffect(() => {
    if (isSubComponent) {
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (profile) {
      if (profile.is_admin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        setLoading(false);
        router.push("/");
        return;
      }
    }

    const checkAdminAndFetch = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        if (!profile) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.id)
            .single();

          if (profileError || !profileData?.is_admin) {
            setIsAdmin(false);
            setLoading(false);
            router.push("/");
            return;
          }
          setIsAdmin(true);
        }

        // Fetch phones
        const { data: phonesData, error: phonesError } = await supabase
          .from("phone_directory")
          .select("*")
          .order("created_at", { ascending: false });

        if (phonesError) {
          console.error("Error fetching phones:", phonesError);
        } else if (phonesData) {
          setPhones(phonesData);
          try {
            localStorage.setItem("admin_phones_cache", JSON.stringify(phonesData));
          } catch {}
        }

        // Fetch telecom codes
        const { data: codesData, error: codesError } = await supabase
          .from("telecom_codes")
          .select("*")
          .order("created_at", { ascending: false });

        if (codesError) {
          console.error("Error fetching telecom codes:", codesError);
        } else if (codesData) {
          setCodes(codesData);
          try {
            localStorage.setItem("admin_telecom_codes_cache", JSON.stringify(codesData));
          } catch {}
        }
      } catch (err: any) {
        console.error("Unexpected fetch error:", err);
        showNotification("error", err.message || "حدث خطأ أثناء تحميل البيانات");
        // Fallback to cache if available
        try {
          const cachedPhones = localStorage.getItem("admin_phones_cache");
          if (cachedPhones) setPhones(JSON.parse(cachedPhones));
          const cachedCodes = localStorage.getItem("admin_telecom_codes_cache");
          if (cachedCodes) setCodes(JSON.parse(cachedCodes));
        } catch {}
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetch();
  }, [user, profile, authLoading, isSubComponent, router, showNotification]);

  // Derived Specialties & Icons
  const existingSpecialties = useMemo(() => {
    return Array.from(
      new Set(phones.map((e) => e.specialty?.trim()).filter(Boolean))
    );
  }, [phones]);

  const specialtyIcons = useMemo(() => {
    return getSpecialtyIcons(phones);
  }, [phones]);

  const specialtyCounts = useMemo(() => {
    return getSpecialtyCounts(phones);
  }, [phones]);

  // Derived Telecom Sections & Companies
  const existingSections = useMemo(() => {
    return Array.from(
      new Set(
        codes
          .filter((c) => c.company === codeFormData.company)
          .map((c) => c.section_name?.trim())
          .filter(Boolean)
      )
    );
  }, [codes, codeFormData.company]);

  const companyCounts = useMemo(() => {
    return getCompanyCounts(codes);
  }, [codes]);

  // Fallback if selected specialty was deleted
  useEffect(() => {
    if (
      selectedSpecialtyTab !== "all" &&
      selectedSpecialtyTab !== "__other__" &&
      !existingSpecialties.includes(selectedSpecialtyTab)
    ) {
      setSelectedSpecialtyTab("all");
    }
  }, [existingSpecialties, selectedSpecialtyTab]);

  // Reset pagination on tab/filter change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedPhoneIds(new Set());
    setSelectedCodeIds(new Set());
    setActionMenu(null);
  }, [activeTab, selectedSpecialtyTab, selectedCompanyTab, searchQuery, pageSize]);

  // Filtered lists
  const filteredPhones = useMemo(() => {
    return filterPhones(phones, selectedSpecialtyTab, searchQuery);
  }, [phones, selectedSpecialtyTab, searchQuery]);

  const filteredCodes = useMemo(() => {
    return filterCodes(codes, selectedCompanyTab, searchQuery);
  }, [codes, selectedCompanyTab, searchQuery]);

  // Active items based on current tab
  const totalItems = activeTab === "phones" ? filteredPhones.length : filteredCodes.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedPhones = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPhones.slice(start, start + pageSize);
  }, [filteredPhones, currentPage, pageSize]);

  const paginatedCodes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCodes.slice(start, start + pageSize);
  }, [filteredCodes, currentPage, pageSize]);

  // ----------------------------------------------------
  // Selection Handlers (Bulk)
  // ----------------------------------------------------
  const toggleSelectPhone = useCallback((id: string) => {
    setSelectedPhoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAllPhones = useCallback(() => {
    setSelectedPhoneIds((prev) => {
      if (prev.size === paginatedPhones.length && paginatedPhones.length > 0) {
        return new Set();
      }
      return new Set(paginatedPhones.map((p) => p.id));
    });
  }, [paginatedPhones]);

  const toggleSelectCode = useCallback((id: string) => {
    setSelectedCodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAllCodes = useCallback(() => {
    setSelectedCodeIds((prev) => {
      if (prev.size === paginatedCodes.length && paginatedCodes.length > 0) {
        return new Set();
      }
      return new Set(paginatedCodes.map((c) => c.id));
    });
  }, [paginatedCodes]);

  // ----------------------------------------------------
  // Phone CRUD Modals & Actions
  // ----------------------------------------------------
  const openAddPhoneModal = useCallback(() => {
    setEditingPhone(null);
    setPhoneFormData({
      ...INITIAL_PHONE_FORM,
      specialtySelect:
        selectedSpecialtyTab !== "all" && selectedSpecialtyTab !== "__other__"
          ? selectedSpecialtyTab
          : "",
    });
    setIsPhoneModalOpen(true);
  }, [selectedSpecialtyTab]);

  const openEditPhoneModal = useCallback((entry: PhoneEntry) => {
    setEditingPhone(entry);
    setPhoneFormData({
      name: entry.name || "",
      specialtySelect: entry.specialty || "",
      customSpecialty: "",
      customIcon: entry.icon || "",
      phone_number: entry.phone_number || "",
      logo_url: entry.logo_url || "",
      description: entry.description || "",
    });
    setIsPhoneModalOpen(true);
  }, []);

  const closePhoneModal = useCallback(() => {
    setIsPhoneModalOpen(false);
    setEditingPhone(null);
    setPhoneFormData(INITIAL_PHONE_FORM);
  }, []);

  const savePhone = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!supabase) return;
      setIsSubmitting(true);

      try {
        const finalSpecialty =
          phoneFormData.specialtySelect === "__custom__"
            ? phoneFormData.customSpecialty.trim()
            : phoneFormData.specialtySelect.trim();

        if (!finalSpecialty) {
          throw new Error("يرجى تحديد أو كتابة تخصص للرقم الخدمي.");
        }

        let finalIcon = "bx-building";
        if (phoneFormData.specialtySelect === "__custom__") {
          finalIcon =
            formatBoxIcon(phoneFormData.customIcon.trim()) || "bx-building";
        } else {
          const existingEntry = phones.find(
            (p) => p.specialty === phoneFormData.specialtySelect && p.icon
          );
          if (existingEntry?.icon) {
            finalIcon = existingEntry.icon;
          }
        }

        const payload = {
          name: phoneFormData.name.trim(),
          specialty: finalSpecialty,
          phone_number: phoneFormData.phone_number.trim(),
          logo_url: phoneFormData.logo_url.trim(),
          icon: finalIcon,
          description: phoneFormData.description.trim(),
        };

        if (editingPhone) {
          const { data, error } = await supabase
            .from("phone_directory")
            .update(payload)
            .eq("id", editingPhone.id)
            .select();

          if (error) throw error;
          if (data && data.length > 0) {
            setPhones((prev) =>
              prev.map((p) => (p.id === editingPhone.id ? data[0] : p))
            );
            showNotification("success", "تم تعديل بيانات الرقم الخدمي بنجاح");
          }
        } else {
          const { data, error } = await supabase
            .from("phone_directory")
            .insert([payload])
            .select();

          if (error) throw error;
          if (data && data.length > 0) {
            setPhones((prev) => [data[0], ...prev]);
            setSelectedSpecialtyTab(finalSpecialty);
            showNotification("success", "تمت إضافة الرقم الخدمي الجديد بنجاح");
          }
        }

        closePhoneModal();
      } catch (err: any) {
        console.error("Save phone error:", err);
        showNotification("error", "فشل الحفظ: " + (err.message || "حدث خطأ غير متوقع"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [phoneFormData, editingPhone, phones, closePhoneModal, showNotification]
  );

  // ----------------------------------------------------
  // Telecom Codes CRUD Modals & Actions
  // ----------------------------------------------------
  const openAddCodeModal = useCallback(() => {
    setEditingCode(null);
    setCodeFormData({
      ...INITIAL_CODE_FORM,
      company: selectedCompanyTab !== "all" ? selectedCompanyTab : "vodafone",
    });
    setIsCodeModalOpen(true);
  }, [selectedCompanyTab]);

  const openEditCodeModal = useCallback((item: TelecomCodeEntry) => {
    setEditingCode(item);
    const parts = (item.code || "").split(" | ");
    setCodeFormData({
      company: item.company || "vodafone",
      sectionSelect: item.section_name || "",
      customSection: "",
      customSectionIcon: item.icon || "",
      title: item.title || "",
      code: parts[0] || "",
      note: parts[1] || "",
    });
    setIsCodeModalOpen(true);
  }, []);

  const closeCodeModal = useCallback(() => {
    setIsCodeModalOpen(false);
    setEditingCode(null);
    setCodeFormData(INITIAL_CODE_FORM);
  }, []);

  const saveCode = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!supabase) return;
      setIsSubmitting(true);

      try {
        const finalSection =
          codeFormData.sectionSelect === "__custom__"
            ? codeFormData.customSection.trim()
            : codeFormData.sectionSelect.trim();

        if (!finalSection) {
          throw new Error("يرجى تحديد أو كتابة اسم القسم.");
        }

        let finalIcon = "bx-folder";
        if (codeFormData.sectionSelect === "__custom__") {
          finalIcon =
            formatBoxIcon(codeFormData.customSectionIcon.trim()) || "bx-folder";
        } else {
          const existingEntry = codes.find(
            (c) =>
              c.company === codeFormData.company &&
              c.section_name === codeFormData.sectionSelect &&
              c.icon
          );
          if (existingEntry?.icon) {
            finalIcon = existingEntry.icon;
          }
        }

        const finalCodeValue = codeFormData.note.trim()
          ? `${codeFormData.code.trim()} | ${codeFormData.note.trim()}`
          : codeFormData.code.trim();

        const payload = {
          company: codeFormData.company,
          section_name: finalSection,
          title: codeFormData.title.trim(),
          code: finalCodeValue,
          icon: finalIcon,
        };

        if (editingCode) {
          const { data, error } = await supabase
            .from("telecom_codes")
            .update(payload)
            .eq("id", editingCode.id)
            .select();

          if (error) throw error;
          if (data && data.length > 0) {
            setCodes((prev) =>
              prev.map((c) => (c.id === editingCode.id ? data[0] : c))
            );
            showNotification("success", "تم تعديل كود الخدمة بنجاح");
          }
        } else {
          const { data, error } = await supabase
            .from("telecom_codes")
            .insert([payload])
            .select();

          if (error) throw error;
          if (data && data.length > 0) {
            setCodes((prev) => [data[0], ...prev]);
            setSelectedCompanyTab(codeFormData.company);
            showNotification("success", "تمت إضافة كود الخدمة بنجاح");
          }
        }

        closeCodeModal();
      } catch (err: any) {
        console.error("Save code error:", err);
        showNotification("error", "فشل الحفظ: " + (err.message || "حدث خطأ غير متوقع"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [codeFormData, editingCode, codes, closeCodeModal, showNotification]
  );

  // ----------------------------------------------------
  // Deletions (Single & Bulk)
  // ----------------------------------------------------
  const confirmDelete = useCallback(async () => {
    if (!deleteModal || !supabase) return;
    setIsDeleting(true);

    try {
      if (deleteModal.type === "phone") {
        const { error } = await supabase
          .from("phone_directory")
          .delete()
          .eq("id", deleteModal.item.id);
        if (error) throw error;
        setPhones((prev) => prev.filter((p) => p.id !== deleteModal.item.id));
        setSelectedPhoneIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteModal.item.id);
          return next;
        });
        showNotification("success", `تم حذف « ${deleteModal.item.name} » بنجاح`);
      } else if (deleteModal.type === "code") {
        const { error } = await supabase
          .from("telecom_codes")
          .delete()
          .eq("id", deleteModal.item.id);
        if (error) throw error;
        setCodes((prev) => prev.filter((c) => c.id !== deleteModal.item.id));
        setSelectedCodeIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteModal.item.id);
          return next;
        });
        showNotification("success", `تم حذف « ${deleteModal.item.title} » بنجاح`);
      } else if (deleteModal.type === "bulk-phones") {
        const ids = deleteModal.ids;
        const { error } = await supabase
          .from("phone_directory")
          .delete()
          .in("id", ids);
        if (error) throw error;
        setPhones((prev) => prev.filter((p) => !ids.includes(p.id)));
        setSelectedPhoneIds(new Set());
        showNotification("success", `تم حذف ${ids.length} رقم خدمي بنجاح`);
      } else if (deleteModal.type === "bulk-codes") {
        const ids = deleteModal.ids;
        const { error } = await supabase
          .from("telecom_codes")
          .delete()
          .in("id", ids);
        if (error) throw error;
        setCodes((prev) => prev.filter((c) => !ids.includes(c.id)));
        setSelectedCodeIds(new Set());
        showNotification("success", `تم حذف ${ids.length} كود خدمة بنجاح`);
      }

      setDeleteModal(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      showNotification("error", "فشل الحذف: " + (err.message || "حدث خطأ أثناء الحذف"));
    } finally {
      setIsDeleting(false);
    }
  }, [deleteModal, showNotification]);

  return {
    isAdmin,
    loading,
    notification,
    activeTab,
    setActiveTab,

    // Phones
    phones,
    filteredPhones,
    paginatedPhones,
    existingSpecialties,
    specialtyIcons,
    specialtyCounts,
    selectedSpecialtyTab,
    setSelectedSpecialtyTab,
    selectedPhoneIds,
    toggleSelectPhone,
    toggleSelectAllPhones,
    phoneFormData,
    setPhoneFormData,
    editingPhone,
    isPhoneModalOpen,
    openAddPhoneModal,
    openEditPhoneModal,
    closePhoneModal,
    savePhone,

    // Telecom Codes
    codes,
    filteredCodes,
    paginatedCodes,
    existingSections,
    companyCounts,
    selectedCompanyTab,
    setSelectedCompanyTab,
    selectedCodeIds,
    toggleSelectCode,
    toggleSelectAllCodes,
    codeFormData,
    setCodeFormData,
    editingCode,
    isCodeModalOpen,
    openAddCodeModal,
    openEditCodeModal,
    closeCodeModal,
    saveCode,

    // Shared State
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,
    isSubmitting,
    isDeleting,

    // Columns
    visiblePhoneColumns,
    setVisiblePhoneColumns,
    visibleCodeColumns,
    setVisibleCodeColumns,
    isColumnsMenuOpen,
    setIsColumnsMenuOpen,

    // Floating & Modals
    actionMenu,
    setActionMenu,
    detailsModal,
    setDetailsModal,
    deleteModal,
    setDeleteModal,
    confirmDelete,
  };
}
