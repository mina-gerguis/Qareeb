"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  SubscriptionPlan,
  UserProfile,
  SubscriptionsTab,
  UsersVisibleColumns,
  ColumnsMenuPosition,
  UserActionMenuState,
  PlanFormState,
  UserFormState,
  OfferFormState,
  SubscriptionsKpiData,
  NewUserTrialConfig,
  OpenPageAccessOffer,
  DEFAULT_TRIAL_CONFIG,
  PROTECTED_PAGE_OPTIONS,
} from "../types";
import {
  getNewUserTrialConfig,
  saveNewUserTrialConfig,
  getOpenPageAccessOffers,
  saveOpenPageAccessOffer,
  deleteOpenPageAccessOffer,
} from "@/lib/promotions";

export function useAdminSubscriptions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<SubscriptionsTab>("users");

  // Status Message
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Updating states
  const [updating, setUpdating] = useState(false);

  // ── PLANS STATE ──
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [planForm, setPlanForm] = useState<PlanFormState>({
    name: "",
    price_monthly: 0,
    price_yearly: 0,
    featuresText: "",
  });

  // ── USERS STATE ──
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userForm, setUserForm] = useState<UserFormState>({
    subscription_tier: "free",
    subscription_period: "",
    subscription_status: "active",
    subscription_start: "",
    subscription_end: "",
  });

  // Users View & Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Users Column Visibility
  const [visibleColumns, setVisibleColumns] = useState<UsersVisibleColumns>({
    user: true,
    tier: true,
    period: true,
    expiry: true,
    status: true,
    actions: true,
  });

  const toggleColumn = (key: keyof UsersVisibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Columns Menu
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [columnsMenuPos, setColumnsMenuPos] = useState<ColumnsMenuPosition | null>(null);

  const toggleColumnsMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (columnsMenuOpen) {
      setColumnsMenuOpen(false);
      setColumnsMenuPos(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const menuWidth = 190;
      let left = rect.left;
      if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 10;
      }
      setColumnsMenuPos({
        top: rect.bottom + 6,
        left: Math.max(10, left),
      });
      setColumnsMenuOpen(true);
    }
  };

  const closeColumnsMenu = () => {
    setColumnsMenuOpen(false);
    setColumnsMenuPos(null);
  };

  // 3-dots Action Menu for User
  const [userActionMenuState, setUserActionMenuState] = useState<UserActionMenuState | null>(null);

  const openUserActionMenu = (targetUser: UserProfile, rect: DOMRect) => {
    const menuWidth = 180;
    let left = rect.left;
    if (left + menuWidth > window.innerWidth) {
      left = window.innerWidth - menuWidth - 10;
    }
    setUserActionMenuState({
      user: targetUser,
      top: rect.bottom + 6,
      left: Math.max(10, left),
    });
  };

  const closeUserActionMenu = () => {
    setUserActionMenuState(null);
  };

  // Global click & scroll listener to close menus
  useEffect(() => {
    const handleGlobalClick = () => {
      closeColumnsMenu();
      closeUserActionMenu();
    };
    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("scroll", handleGlobalClick, true);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("scroll", handleGlobalClick, true);
    };
  }, []);

  // ── PROMOTIONS STATE ──
  const [trialConfig, setTrialConfig] = useState<NewUserTrialConfig>(DEFAULT_TRIAL_CONFIG);
  const [loadingTrial, setLoadingTrial] = useState(true);
  const [savingTrial, setSavingTrial] = useState(false);
  const [trialPreset, setTrialPreset] = useState<"7" | "30" | "90" | "custom">("30");

  const [openOffers, setOpenOffers] = useState<OpenPageAccessOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OpenPageAccessOffer | null>(null);
  const [savingOffer, setSavingOffer] = useState(false);

  const [offerForm, setOfferForm] = useState<OfferFormState>({
    title: "",
    target_page: "all",
    duration_type: "preset",
    duration_preset_days: 7,
    custom_end_date: "",
    is_active: true,
    banner_message: "",
    send_broadcast: false,
  });

  // Sync tab with URL search params
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "promotions" || tabParam === "offers") {
      setActiveTab("promotions");
    } else if (tabParam === "plans") {
      setActiveTab("plans");
    } else if (tabParam === "users") {
      setActiveTab("users");
    }
  }, [searchParams]);

  const handleTabChange = (tab: SubscriptionsTab) => {
    setActiveTab(tab);
    setStatusMessage(null);
  };

  // ── FETCH DATA ──
  const fetchPlans = useCallback(async () => {
    if (!supabase) return;
    setLoadingPlans(true);
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price_monthly", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (err: any) {
      console.error("Error fetching subscription plans:", err);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!supabase) return;
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, full_name, username, email, phone, governorate, city, subscription_tier, subscription_period, subscription_status, subscription_start, subscription_end, created_at, is_admin"
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data as UserProfile[]);
    } catch (err: any) {
      console.error("Error fetching user profiles:", err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchPromotions = useCallback(async () => {
    setLoadingTrial(true);
    setLoadingOffers(true);
    try {
      const [trialData, offersData] = await Promise.all([
        getNewUserTrialConfig(),
        getOpenPageAccessOffers(),
      ]);

      setTrialConfig(trialData);
      if (trialData.duration_days === 7) setTrialPreset("7");
      else if (trialData.duration_days === 30) setTrialPreset("30");
      else if (trialData.duration_days === 90) setTrialPreset("90");
      else setTrialPreset("custom");

      setOpenOffers(offersData);
    } catch (err) {
      console.error("Error fetching promotions:", err);
    } finally {
      setLoadingTrial(false);
      setLoadingOffers(false);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    await Promise.all([fetchPlans(), fetchUsers(), fetchPromotions()]);
  }, [fetchPlans, fetchUsers, fetchPromotions]);

  // Auth checking
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const checkAdmin = async () => {
      if (!supabase) return;
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (profileError || !profileData?.is_admin) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
          refreshAllData();
        }
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAdmin();
  }, [user, authLoading, router, refreshAllData]);

  // ── PLAN HANDLERS ──
  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setPlanForm({
      name: plan.name,
      price_monthly: plan.price_monthly,
      price_yearly: plan.price_yearly,
      featuresText: plan.features ? plan.features.join("\n") : "",
    });
    setStatusMessage(null);
  };

  const closePlanModal = () => {
    if (updating) return;
    setSelectedPlan(null);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !selectedPlan) return;
    setUpdating(true);
    setStatusMessage(null);

    const features = planForm.featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    try {
      const { error } = await supabase
        .from("subscription_plans")
        .update({
          name: planForm.name,
          price_monthly: Number(planForm.price_monthly),
          price_yearly: Number(planForm.price_yearly),
          features: features,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedPlan.id);

      if (error) throw error;

      setPlans((prev) =>
        prev.map((p) =>
          p.id === selectedPlan.id
            ? {
                ...p,
                name: planForm.name,
                price_monthly: Number(planForm.price_monthly),
                price_yearly: Number(planForm.price_yearly),
                features: features,
              }
            : p
        )
      );

      setStatusMessage({ type: "success", text: "تم تحديث الباقة بنجاح!" });
      setSelectedPlan(null);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "فشل تحديث الباقة: " + err.message });
    } finally {
      setUpdating(false);
    }
  };

  // ── USER HANDLERS ──
  const handleEditUserSubscription = (profile: UserProfile) => {
    setSelectedUser(profile);
    setUserForm({
      subscription_tier: profile.subscription_tier || "free",
      subscription_period: profile.subscription_period || "",
      subscription_status: profile.subscription_status || "active",
      subscription_start: profile.subscription_start
        ? new Date(profile.subscription_start).toISOString().split("T")[0]
        : "",
      subscription_end: profile.subscription_end
        ? new Date(profile.subscription_end).toISOString().split("T")[0]
        : "",
    });
    setStatusMessage(null);
  };

  const closeUserModal = () => {
    if (updating) return;
    setSelectedUser(null);
  };

  const handleQuickExtendUser = async (profile: UserProfile, daysToAdd: number) => {
    if (!supabase) return;
    setUpdating(true);
    setStatusMessage(null);

    const currentEnd = profile.subscription_end ? new Date(profile.subscription_end) : new Date();
    const baseDate = currentEnd < new Date() ? new Date() : currentEnd;
    const newEnd = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    const subStart = profile.subscription_start || new Date().toISOString();
    const subEndStr = newEnd.toISOString();

    try {
      const { data, error } = await supabase.rpc("admin_update_user_subscription", {
        p_user_id: profile.id,
        p_tier: profile.subscription_tier === "free" ? "mishwar" : profile.subscription_tier,
        p_period: profile.subscription_period || "monthly",
        p_status: "active",
        p_start: subStart,
        p_end: subEndStr,
      });

      if (error) throw error;
      if (data && !data.success) throw new Error(data.message);

      // Notification
      try {
        await supabase.from("notifications").insert([
          {
            user_id: profile.id,
            title: "🎉 تم تمديد اشتراكك بنجاح",
            message: `تم تمديد فترة اشتراكك لمدة ${daysToAdd} يوماً إضافية من قبل الإدارة.`,
            type: "success",
            link: "/profile",
          },
        ]);
      } catch (errNotif) {
        console.error("Failed to send extension notification:", errNotif);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === profile.id
            ? {
                ...u,
                subscription_tier:
                  profile.subscription_tier === "free" ? "mishwar" : profile.subscription_tier,
                subscription_status: "active",
                subscription_end: subEndStr,
              }
            : u
        )
      );

      setStatusMessage({
        type: "success",
        text: `تم تمديد اشتراك ${profile.full_name || profile.username} لمدة ${daysToAdd} يوماً بنجاح!`,
      });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "فشل التمديد السريع: " + err.message });
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveUserSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !selectedUser) return;
    setUpdating(true);
    setStatusMessage(null);

    const subStart = userForm.subscription_start
      ? new Date(userForm.subscription_start).toISOString()
      : null;
    const subEnd = userForm.subscription_end
      ? new Date(userForm.subscription_end).toISOString()
      : null;
    const subPeriod = userForm.subscription_period || null;

    try {
      const { data, error } = await supabase.rpc("admin_update_user_subscription", {
        p_user_id: selectedUser.id,
        p_tier: userForm.subscription_tier,
        p_period: subPeriod,
        p_status: userForm.subscription_status,
        p_start: subStart,
        p_end: subEnd,
      });

      if (error) throw error;
      if (data && !data.success) throw new Error(data.message);

      // Notification
      try {
        const planName =
          plans.find((p) => p.id === userForm.subscription_tier)?.name ||
          userForm.subscription_tier;
        let notifTitle = "⚙️ تم تعديل اشتراكك من قبل الإدارة";
        let notifMsg = `تم تعديل تفاصيل اشتراكك في باقة (${planName}) من قبل المشرف.`;

        if (userForm.subscription_status === "expired") {
          notifTitle = "⚠️ انتهى اشتراكك";
          notifMsg = `انتهت صلاحية اشتراكك في باقة (${planName}). يرجى التجديد لتفادي توقف الخدمات.`;
        }

        await supabase.from("notifications").insert([
          {
            user_id: selectedUser.id,
            title: notifTitle,
            message: notifMsg,
            type: userForm.subscription_status === "active" ? "success" : "warning",
            link: "/profile",
          },
        ]);
      } catch (errNotif) {
        console.error("Failed to send subscription update notification:", errNotif);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                subscription_tier: userForm.subscription_tier,
                subscription_period: subPeriod,
                subscription_status: userForm.subscription_status,
                subscription_start: subStart,
                subscription_end: subEnd,
              }
            : u
        )
      );

      setStatusMessage({
        type: "success",
        text: "تم تحديث اشتراك المستخدم وإرسال الإشعار بنجاح!",
      });
      setSelectedUser(null);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "فشل تحديث الاشتراك: " + err.message });
    } finally {
      setUpdating(false);
    }
  };

  const addPresetDaysToModalEnd = (days: number) => {
    const currentEnd = userForm.subscription_end ? new Date(userForm.subscription_end) : new Date();
    const baseDate = currentEnd < new Date() ? new Date() : currentEnd;
    const newDate = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
    setUserForm((prev) => ({
      ...prev,
      subscription_end: newDate.toISOString().split("T")[0],
      subscription_status: "active",
      subscription_start: prev.subscription_start || new Date().toISOString().split("T")[0],
    }));
  };

  // ── PROMOTION HANDLERS ──
  const handleSaveTrial = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingTrial(true);
    setStatusMessage(null);

    let days = trialConfig.duration_days;
    if (trialPreset === "7") days = 7;
    else if (trialPreset === "30") days = 30;
    else if (trialPreset === "90") days = 90;

    const payload = {
      ...trialConfig,
      duration_days: Math.max(1, days),
    };

    try {
      const res = await saveNewUserTrialConfig(payload);
      if (res.success) {
        setTrialConfig(payload);
        setStatusMessage({
          type: "success",
          text: payload.is_active
            ? `🎉 تم تفعيل عرض الاشتراك المجاني للحسابات الجديدة (${days} يوماً - باقة ${
                payload.target_tier === "gold"
                  ? "الذهبية"
                  : payload.target_tier === "silver"
                  ? "الفضية"
                  : "المشوار"
              }) بنجاح!`
            : "تم تعطيل عرض الاشتراك التجريبي للحسابات الجديدة.",
        });
      } else {
        throw new Error(res.error || "Failed");
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: "فشل حفظ إعدادات العرض الترحيبي: " + err.message,
      });
    } finally {
      setSavingTrial(false);
    }
  };

  const handleOpenAddOfferModal = () => {
    setSelectedOffer(null);
    setOfferForm({
      title: "عرض مجاني خاص لفترة محدودة",
      target_page: "all",
      duration_type: "preset",
      duration_preset_days: 7,
      custom_end_date: "",
      is_active: true,
      banner_message: "🎉 هذه الخدمة مفتوحة الآن مجاناً لجميع المستخدمين والزوار لفترة محدودة!",
      send_broadcast: false,
    });
    setIsOfferModalOpen(true);
  };

  const handleEditOffer = (offer: OpenPageAccessOffer) => {
    setSelectedOffer(offer);
    const hasCustomEnd = !!offer.end_date;
    const endDateStr = offer.end_date ? new Date(offer.end_date).toISOString().split("T")[0] : "";

    setOfferForm({
      title: offer.title || "",
      target_page: offer.target_page || "all",
      duration_type: hasCustomEnd ? "custom" : "preset",
      duration_preset_days: 7,
      custom_end_date: endDateStr,
      is_active: offer.is_active,
      banner_message: offer.banner_message || "",
      send_broadcast: false,
    });
    setIsOfferModalOpen(true);
  };

  const closeOfferModal = () => {
    if (savingOffer) return;
    setIsOfferModalOpen(false);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOffer(true);
    setStatusMessage(null);

    let calculatedEndDate: string | null = null;
    const now = new Date();

    if (offerForm.duration_type === "preset") {
      calculatedEndDate = new Date(
        now.getTime() + offerForm.duration_preset_days * 24 * 60 * 60 * 1000
      ).toISOString();
    } else if (offerForm.custom_end_date) {
      calculatedEndDate = new Date(offerForm.custom_end_date + "T23:59:59").toISOString();
    }

    const payload: Partial<OpenPageAccessOffer> = {
      id: selectedOffer?.id,
      title: offerForm.title.trim(),
      target_page: offerForm.target_page,
      is_active: offerForm.is_active,
      start_date: selectedOffer?.start_date || now.toISOString(),
      end_date: calculatedEndDate,
      banner_message: offerForm.banner_message.trim(),
    };

    try {
      const res = await saveOpenPageAccessOffer(payload);
      if (res.success && res.data) {
        const savedData = res.data;
        setOpenOffers((prev) => {
          const exists = prev.some((o) => o.id === savedData.id);
          return exists
            ? prev.map((o) => (o.id === savedData.id ? savedData : o))
            : [savedData, ...prev];
        });

        if (offerForm.send_broadcast && supabase && offerForm.is_active) {
          try {
            const pageOption = PROTECTED_PAGE_OPTIONS.find((p) => p.value === offerForm.target_page);
            const pageLabel = pageOption ? pageOption.label : offerForm.target_page;
            await supabase.from("notifications").insert([
              {
                user_id: null,
                title: `🎁 ${offerForm.title}`,
                message: `يسرنا إعلامكم بفتح (${pageLabel}) مجاناً لجميع المستخدمين حتى ${new Date(
                  calculatedEndDate || ""
                ).toLocaleDateString("ar-EG")}.`,
                type: "info",
                link: offerForm.target_page === "all" ? "/" : offerForm.target_page,
              },
            ]);
          } catch (bErr) {
            console.warn("Failed to send broadcast notification:", bErr);
          }
        }

        setStatusMessage({ type: "success", text: "تم حفظ وتفعيل عرض فتح الصفحة بنجاح!" });
        setIsOfferModalOpen(false);
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "فشل حفظ العرض: " + err.message });
    } finally {
      setSavingOffer(false);
    }
  };

  const handleToggleOfferStatus = async (offer: OpenPageAccessOffer) => {
    try {
      const updated = { ...offer, is_active: !offer.is_active };
      await saveOpenPageAccessOffer(updated);
      setOpenOffers((prev) => prev.map((o) => (o.id === offer.id ? updated : o)));
      setStatusMessage({
        type: "success",
        text: updated.is_active
          ? `تم تشغيل عرض "${offer.title}" بنجاح.`
          : `تم إيقاف عرض "${offer.title}".`,
      });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "فشل تعديل حالة العرض: " + err.message });
    }
  };

  const handleDeleteOffer = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف عرض "${title}"؟`)) return;
    try {
      await deleteOpenPageAccessOffer(id);
      setOpenOffers((prev) => prev.filter((o) => o.id !== id));
      setStatusMessage({ type: "success", text: `تم حذف العرض "${title}" بنجاح.` });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "فشل حذف العرض: " + err.message });
    }
  };

  // ── FILTERED & PAGINATED USERS ──
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.username || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q);

      const matchesTier = tierFilter === "all" || u.subscription_tier === tierFilter;

      const isExpired = u.subscription_end && new Date(u.subscription_end) < new Date();
      const currentStatus = isExpired ? "expired" : u.subscription_status || "active";
      const matchesStatus = statusFilter === "all" || currentStatus === statusFilter;

      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [users, searchQuery, tierFilter, statusFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // ── KPIS ──
  const kpis: SubscriptionsKpiData = useMemo(() => {
    const totalSubscribers = users.length;
    const activeSubscribers = users.filter((u) => {
      if (!u.subscription_tier || u.subscription_tier === "free") return false;
      const isExpired = u.subscription_end && new Date(u.subscription_end) < new Date();
      return !isExpired && u.subscription_status === "active";
    }).length;

    const isTrialActive = trialConfig.is_active;

    const activeOffersCount = openOffers.filter((o) => {
      if (!o.is_active) return false;
      if (o.end_date && new Date(o.end_date) < new Date()) return false;
      return true;
    }).length;

    return {
      totalSubscribers,
      activeSubscribers,
      isTrialActive,
      activeOffersCount,
    };
  }, [users, trialConfig, openOffers]);

  return {
    isAdmin,
    authChecking,
    activeTab,
    handleTabChange,
    statusMessage,
    setStatusMessage,
    updating,
    // KPIs
    kpis,
    // Plans
    plans,
    loadingPlans,
    selectedPlan,
    planForm,
    setPlanForm,
    handleEditPlan,
    closePlanModal,
    handleSavePlan,
    // Users
    users,
    filteredUsers,
    paginatedUsers,
    loadingUsers,
    searchQuery,
    setSearchQuery,
    tierFilter,
    setTierFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    viewMode,
    setViewMode,
    visibleColumns,
    toggleColumn,
    columnsMenuOpen,
    columnsMenuPos,
    toggleColumnsMenu,
    closeColumnsMenu,
    userActionMenuState,
    openUserActionMenu,
    closeUserActionMenu,
    selectedUser,
    userForm,
    setUserForm,
    handleEditUserSubscription,
    closeUserModal,
    handleSaveUserSubscription,
    handleQuickExtendUser,
    addPresetDaysToModalEnd,
    // Promotions
    trialConfig,
    setTrialConfig,
    trialPreset,
    setTrialPreset,
    loadingTrial,
    savingTrial,
    handleSaveTrial,
    openOffers,
    loadingOffers,
    savingOffer,
    isOfferModalOpen,
    selectedOffer,
    offerForm,
    setOfferForm,
    handleOpenAddOfferModal,
    handleEditOffer,
    closeOfferModal,
    handleSaveOffer,
    handleToggleOfferStatus,
    handleDeleteOffer,
    // Global
    refreshAllData,
  };
}
