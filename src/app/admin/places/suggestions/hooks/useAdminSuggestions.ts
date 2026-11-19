"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  PlaceProposal,
  ProposalFilterTab,
  ViewMode,
  VisibleColumns,
  ColumnsMenuPosition,
  ActionMenuState,
  DeleteModalState,
  UserProfile,
} from "../types";
import { INITIAL_VISIBLE_COLUMNS } from "../constants";
import {
  filterProposals,
  getStatusCounts,
  getCategoryCounts,
} from "../utils";

export function useAdminSuggestions() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Proposals Data
  const [proposals, setProposals] = useState<PlaceProposal[]>([]);
  const [statusTab, setStatusTab] = useState<ProposalFilterTab>("pending");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination & Layout View
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Columns & Positioning
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(
    INITIAL_VISIBLE_COLUMNS
  );
  const [isColumnsMenuOpen, setIsColumnsMenuOpen] = useState(false);
  const [columnsMenuPos, setColumnsMenuPos] =
    useState<ColumnsMenuPosition | null>(null);

  // Modals & Active Menus
  const [actionMenu, setActionMenu] = useState<ActionMenuState | null>(null);
  const [detailsModal, setDetailsModal] = useState<PlaceProposal | null>(null);
  const [rejectModal, setRejectModal] = useState<PlaceProposal | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>(null);
  const [userProfileModal, setUserProfileModal] = useState<UserProfile | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const showNotification = useCallback(
    (type: "success" | "error", text: string) => {
      setNotification({ type, text });
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    },
    []
  );

  // Fetch proposals from Supabase
  const fetchProposals = useCallback(async () => {
    if (!supabase) return;
    try {
      // 1. Try to purge any marked as deleted
      await supabase.from("place_proposals").delete().eq("status", "deleted");

      // 2. Fetch all non-deleted proposals
      const { data, error } = await supabase
        .from("place_proposals")
        .select("*")
        .neq("status", "deleted")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Proposals fetch error:", error);
        showNotification("error", "خطأ في جلب الاقتراحات: " + error.message);
        return;
      }

      if (data) {
        const validProposals: PlaceProposal[] = data.filter(
          (p) => p.status !== "deleted"
        );
        const userIds = Array.from(
          new Set(validProposals.map((p) => p.user_id).filter(Boolean))
        );

        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("*")
            .in("id", userIds);

          const profilesMap = new Map(
            (profilesData || []).map((pr) => [pr.id, pr])
          );
          const proposalsWithProfiles = validProposals.map((p) => ({
            ...p,
            user_profile: profilesMap.get(p.user_id) || null,
          }));
          setProposals(proposalsWithProfiles);
        } else {
          setProposals(validProposals);
        }
      }
    } catch (err: any) {
      console.error("Fetch proposals error:", err);
      showNotification("error", err.message || "حدث خطأ غير متوقع أثناء الجلب");
    }
  }, [showNotification]);

  // Auth & Initial Load
  useEffect(() => {
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

        await fetchProposals();
      } catch (err: any) {
        console.error("Check admin error:", err);
        showNotification("error", err.message || "حدث خطأ في صلاحيات المشرف");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetch();
  }, [user, profile, authLoading, router, fetchProposals, showNotification]);

  // Derived Counts
  const statusCounts = useMemo(() => {
    return getStatusCounts(proposals);
  }, [proposals]);

  const categoryCounts = useMemo(() => {
    return getCategoryCounts(proposals);
  }, [proposals]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
    setActionMenu(null);
  }, [statusTab, selectedCategory, searchQuery, pageSize]);

  // Filtered & Paginated Proposals
  const filteredProposals = useMemo(() => {
    return filterProposals(proposals, statusTab, selectedCategory, searchQuery);
  }, [proposals, statusTab, selectedCategory, searchQuery]);

  const totalItems = filteredProposals.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedProposals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProposals.slice(start, start + pageSize);
  }, [filteredProposals, currentPage, pageSize]);

  // Selection Handlers (Bulk)
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (
        prev.size === paginatedProposals.length &&
        paginatedProposals.length > 0
      ) {
        return new Set();
      }
      return new Set(paginatedProposals.map((p) => p.id));
    });
  }, [paginatedProposals]);

  // Dropdowns positioning (Fixed viewport coordinates)
  const handleToggleColumnsMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (isColumnsMenuOpen) {
        setIsColumnsMenuOpen(false);
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
      setIsColumnsMenuOpen(true);
    },
    [isColumnsMenuOpen]
  );

  const handleToggleActionMenu = useCallback(
    (proposal: PlaceProposal, e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (actionMenu?.key === proposal.id) {
        setActionMenu(null);
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const dropdownWidth = 160;
      const dropdownHeight = 175;

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

      setActionMenu({
        key: proposal.id,
        proposal,
        top,
        left,
      });
    },
    [actionMenu]
  );

  // Approve Proposal (Add to Places & Branches)
  const approveProposal = useCallback(
    async (proposal: PlaceProposal) => {
      if (!supabase) return;
      setIsProcessing(true);

      try {
        const imagesArr =
          proposal.images && proposal.images.length > 0
            ? proposal.images
            : proposal.image_url
            ? [proposal.image_url]
            : [];

        const phonesArr = proposal.phone ? [proposal.phone] : [];

        const newPlaceObj = {
          name: proposal.name,
          category: proposal.category,
          category_label: proposal.category_label || proposal.category,
          sub_categories: proposal.sub_categories || [],
          place_type: proposal.place_type || null,
          place_type_icon: proposal.place_type_icon || null,
          governorate: proposal.governorate,
          city: proposal.city,
          short_description: proposal.description
            ? proposal.description.substring(0, 80)
            : "",
          full_address: proposal.address || "",
          phones: phonesArr,
          google_maps_url: proposal.location_url || "",
          images: imagesArr,
          menu_images: [],
          description: proposal.description || "",
          working_hours: JSON.stringify({ type: "24/7" }),
          services: proposal.services || [],
          features: proposal.features || [],
        };

        const { data: insertedPlace, error: insertError } = await supabase
          .from("places")
          .insert([newPlaceObj])
          .select()
          .single();

        if (insertError) throw insertError;

        if (insertedPlace) {
          await supabase.from("branches").insert([
            {
              place_id: insertedPlace.id,
              name: "الفرع الرئيسي",
              governorate: insertedPlace.governorate,
              city: insertedPlace.city,
              full_address: insertedPlace.full_address || "",
              phones: insertedPlace.phones || [],
              google_maps_url: insertedPlace.google_maps_url || "",
              working_hours:
                insertedPlace.working_hours || JSON.stringify({ type: "24/7" }),
              services: insertedPlace.services || [],
            },
          ]);
        }

        const { error: updateError } = await supabase
          .from("place_proposals")
          .update({
            status: "approved",
            rejection_reason: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", proposal.id);

        if (updateError) throw updateError;

        const newPlaceId = insertedPlace?.id || "";
        if (proposal.user_id) {
          await supabase.from("notifications").insert([
            {
              user_id: proposal.user_id,
              title: "🎉 تهانينا! تم قبول مكانك المقترح",
              message: `تهانينا! تمت مراجعة واعتماد إدراج المكان "${proposal.name}" ونشره رسمياً على التطبيق.`,
              type: "system",
              is_read: false,
              link: newPlaceId ? `/places/${newPlaceId}` : "/profile",
            },
          ]);
        }

        setProposals((prev) =>
          prev.map((p) =>
            p.id === proposal.id ? { ...p, status: "approved" } : p
          )
        );
        showNotification(
          "success",
          `تمت الموافقة ونشر المكان « ${proposal.name} » بنجاح!`
        );
        if (detailsModal?.id === proposal.id) setDetailsModal(null);
      } catch (err: any) {
        console.error("Approve proposal error:", err);
        showNotification(
          "error",
          "فشل اعتماد المكان: " + (err.message || "حدث خطأ غير معروف")
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [detailsModal, showNotification]
  );

  // Reject Proposal
  const confirmReject = useCallback(async () => {
    if (!supabase || !rejectModal) return;
    if (!rejectionReason.trim()) {
      showNotification("error", "يرجى كتابة سبب الرفض لتوضيحه للمستخدم.");
      return;
    }

    setIsProcessing(true);
    try {
      const { error: updateError } = await supabase
        .from("place_proposals")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", rejectModal.id);

      if (updateError) throw updateError;

      if (rejectModal.user_id) {
        await supabase.from("notifications").insert([
          {
            user_id: rejectModal.user_id,
            title: "⚠️ تم رفض اقتراح المكان",
            message: `نأسف، لم نتمكن من إدراج المكان "${
              rejectModal.name
            }". السبب: ${rejectionReason.trim()}. يمكنك تعديل بيانات الاقتراح وإعادة إرساله.`,
            type: "system",
            is_read: false,
            link: `/propose-place?edit=${rejectModal.id}`,
          },
        ]);
      }

      setProposals((prev) =>
        prev.map((p) =>
          p.id === rejectModal.id
            ? { ...p, status: "rejected", rejection_reason: rejectionReason.trim() }
            : p
        )
      );
      showNotification(
        "success",
        `تم رفض المقترح « ${rejectModal.name} » وإبلاغ المستخدم بالسبب.`
      );
      setRejectModal(null);
      setRejectionReason("");
      if (detailsModal?.id === rejectModal.id) setDetailsModal(null);
    } catch (err: any) {
      console.error("Reject proposal error:", err);
      showNotification(
        "error",
        "فشل رفض المقترح: " + (err.message || "حدث خطأ غير معروف")
      );
    } finally {
      setIsProcessing(false);
    }
  }, [rejectModal, rejectionReason, detailsModal, showNotification]);

  // Delete Proposal (Single or Bulk)
  const confirmDelete = useCallback(async () => {
    if (!deleteModal || !supabase) return;
    setIsProcessing(true);

    try {
      if (deleteModal.type === "single") {
        const id = deleteModal.proposal.id;
        const { data: delData, error: deleteError } = await supabase
          .from("place_proposals")
          .delete()
          .eq("id", id)
          .select();

        if (!delData || delData.length === 0) {
          await supabase
            .from("place_proposals")
            .update({ status: "deleted", updated_at: new Date().toISOString() })
            .eq("id", id);
        }

        setProposals((prev) => prev.filter((p) => p.id !== id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        showNotification(
          "success",
          `تم حذف المقترح « ${deleteModal.proposal.name} » بنجاح`
        );
        if (detailsModal?.id === id) setDetailsModal(null);
      } else if (deleteModal.type === "bulk") {
        const ids = deleteModal.ids;
        const { data: delData } = await supabase
          .from("place_proposals")
          .delete()
          .in("id", ids)
          .select();

        if (!delData || delData.length === 0) {
          await supabase
            .from("place_proposals")
            .update({ status: "deleted", updated_at: new Date().toISOString() })
            .in("id", ids);
        }

        setProposals((prev) => prev.filter((p) => !ids.includes(p.id)));
        setSelectedIds(new Set());
        showNotification("success", `تم حذف (${ids.length}) من المقترحات بنجاح`);
      }

      setDeleteModal(null);
    } catch (err: any) {
      console.error("Delete proposal error:", err);
      showNotification(
        "error",
        "فشل حذف المقترح: " + (err.message || "حدث خطأ غير معروف")
      );
    } finally {
      setIsProcessing(false);
    }
  }, [deleteModal, detailsModal, showNotification]);

  return {
    isAdmin,
    loading,
    notification,
    proposals,
    filteredProposals,
    paginatedProposals,
    statusTab,
    setStatusTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    statusCounts,
    categoryCounts,

    // Layout View & Page
    viewMode,
    setViewMode,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,
    selectedIds,
    toggleSelect,
    toggleSelectAll,

    // Columns
    visibleColumns,
    setVisibleColumns,
    isColumnsMenuOpen,
    setIsColumnsMenuOpen,
    columnsMenuPos,
    handleToggleColumnsMenu,

    // Actions & Modals
    actionMenu,
    setActionMenu,
    handleToggleActionMenu,
    detailsModal,
    setDetailsModal,
    rejectModal,
    setRejectModal,
    rejectionReason,
    setRejectionReason,
    deleteModal,
    setDeleteModal,
    userProfileModal,
    setUserProfileModal,
    isProcessing,
    approveProposal,
    confirmReject,
    confirmDelete,
    fetchProposals,
  };
}
