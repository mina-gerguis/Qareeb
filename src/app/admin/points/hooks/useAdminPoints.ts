import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  adminAdjustPromoBalance,
  fetchAdminPromoLedger,
} from "@/lib/promoBalance";
import {
  UserProfile,
  BalanceTransaction,
  AdminPromoLedgerEntry,
  AdminPointsTab,
  ActionType,
  AssetType,
  PromoExpiryOption,
  StatusMessage,
  UsersVisibleColumns,
  RequestsVisibleColumns,
  PromoVisibleColumns,
  ColumnsMenuPosition,
  ActionMenuState,
} from "../types";

export function useAdminPoints() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const { user, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Active Tab
  const [activeTab, setActiveTabState] = useState<AdminPointsTab>(
    tabParam === "requests" || tabParam === "promo_ledger" || tabParam === "users"
      ? tabParam
      : "users"
  );

  const setActiveTab = (tab: AdminPointsTab) => {
    setActiveTabState(tab);
    closeColumnsMenu();
    closeActionMenu();
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    router.replace(`/admin/points?${params.toString()}`);
  };

  // View Mode: "table" | "cards"
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Columns Visibility
  const [usersVisibleColumns, setUsersVisibleColumns] = useState<UsersVisibleColumns>({
    username: true,
    full_name: true,
    email: true,
    phone: true,
    balance: true,
    promo_balance: true,
    points: true,
    actions: true,
  });

  const [requestsVisibleColumns, setRequestsVisibleColumns] = useState<RequestsVisibleColumns>({
    user: true,
    type: true,
    amount: true,
    method: true,
    receipt: true,
    created_at: true,
    status: true,
    actions: true,
  });

  const [promoVisibleColumns, setPromoVisibleColumns] = useState<PromoVisibleColumns>({
    user: true,
    type: true,
    description: true,
    amount: true,
    code: true,
    expires_at: true,
    created_at: true,
  });

  // Columns Dropdown State
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

  const toggleUserColumn = (key: keyof UsersVisibleColumns) => {
    setUsersVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleRequestColumn = (key: keyof RequestsVisibleColumns) => {
    setRequestsVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePromoColumn = (key: keyof PromoVisibleColumns) => {
    setPromoVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 3-dots Action Menu State
  const [actionMenuState, setActionMenuState] = useState<ActionMenuState | null>(null);

  const openActionMenu = (
    item: UserProfile | BalanceTransaction | AdminPromoLedgerEntry,
    type: "user" | "request" | "promo",
    rect: DOMRect
  ) => {
    const menuWidth = 175;
    let left = rect.left;
    if (left + menuWidth > window.innerWidth) {
      left = window.innerWidth - menuWidth - 10;
    }
    setActionMenuState({
      item,
      type,
      top: rect.bottom + 6,
      left: Math.max(10, left),
    });
  };

  const closeActionMenu = () => {
    setActionMenuState(null);
  };

  // Close menus on click outside or scroll
  useEffect(() => {
    const handleGlobalClick = () => {
      closeColumnsMenu();
      closeActionMenu();
    };
    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("scroll", handleGlobalClick, true);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("scroll", handleGlobalClick, true);
    };
  }, []);

  // Users State
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(25);

  // Requests State
  const [requestsList, setRequestsList] = useState<BalanceTransaction[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestSearchQuery, setRequestSearchQuery] = useState("");
  const [requestFilterStatus, setRequestFilterStatus] = useState<string>("pending");
  const [requestFilterType, setRequestFilterType] = useState<string>("all");
  const [requestPage, setRequestPage] = useState(1);
  const [requestPageSize, setRequestPageSize] = useState(20);

  // Rejection Notes & Reasons History
  const [selectedRequest, setSelectedRequest] = useState<BalanceTransaction | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [savedReasons, setSavedReasons] = useState<string[]>([]);

  // Promo Ledger State
  const [promoLedgerItems, setPromoLedgerItems] = useState<AdminPromoLedgerEntry[]>([]);
  const [loadingPromoLedger, setLoadingPromoLedger] = useState(false);
  const [promoSchemaReady, setPromoSchemaReady] = useState(true);
  const [promoPage, setPromoPage] = useState(1);
  const [promoPageSize, setPromoPageSize] = useState(20);

  // Receipt Preview Lightbox
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  // Modal Adjustment State
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [actionType, setActionType] = useState<ActionType>("deposit");
  const [assetType, setAssetType] = useState<AssetType>("points");
  const [transactionAmount, setTransactionAmount] = useState<string>("");
  const [promoExpiryOption, setPromoExpiryOption] = useState<PromoExpiryOption>("30d");
  const [promoCustomExpiryDate, setPromoCustomExpiryDate] = useState<string>("");
  const [promoReason, setPromoReason] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  // Load saved rejection reasons from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rejected_balance_reasons");
      if (saved) {
        try {
          setSavedReasons(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing saved rejection reasons:", e);
        }
      }
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    if (!supabase) return;
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, full_name, username, email, phone, governorate, city, points, balance, promo_balance, created_at, is_admin"
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        setUsersList(data as UserProfile[]);
      }
    } catch (err: any) {
      console.error("Error fetching profiles:", err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Fetch Requests
  const fetchRequests = useCallback(async () => {
    if (!supabase) return;
    setLoadingRequests(true);
    try {
      const { data, error } = await supabase
        .from("balance_transactions")
        .select(
          `
          id,
          user_id,
          type,
          amount,
          method,
          provider_number,
          recipient_name,
          transaction_id,
          image_url,
          status,
          admin_notes,
          created_at,
          updated_at,
          profiles:user_id (
            full_name,
            username,
            email,
            phone
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequestsList((data as unknown as BalanceTransaction[]) || []);
    } catch (err: any) {
      console.error("Error fetching transactions requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  // Fetch Promo Ledger
  const loadPromoLedger = useCallback(async () => {
    setLoadingPromoLedger(true);
    try {
      const { items, schemaReady } = await fetchAdminPromoLedger(100);
      setPromoLedgerItems(items);
      setPromoSchemaReady(schemaReady);
    } finally {
      setLoadingPromoLedger(false);
    }
  }, []);

  // Sync activeTab with tabParam from URL and refresh data
  useEffect(() => {
    const validTab =
      tabParam === "requests" || tabParam === "promo_ledger" || tabParam === "users"
        ? tabParam
        : "users";
    setActiveTabState(validTab);
    if (validTab === "requests") {
      fetchRequests();
    } else if (validTab === "promo_ledger") {
      loadPromoLedger();
    } else if (validTab === "users") {
      fetchUsers();
    }
  }, [tabParam, fetchRequests, loadPromoLedger, fetchUsers]);

  // Auth & Admin check
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
          fetchUsers();
          fetchRequests();
          loadPromoLedger();
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAdmin();
  }, [user, authLoading, router, fetchUsers, fetchRequests, loadPromoLedger]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return usersList;
    return usersList.filter(
      (u) =>
        (u.username || "").toLowerCase().includes(q) ||
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q)
    );
  }, [usersList, searchQuery]);

  // Paginated Users
  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * userPageSize;
    return filteredUsers.slice(start, start + userPageSize);
  }, [filteredUsers, userPage, userPageSize]);

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    const q = requestSearchQuery.toLowerCase().trim();
    return requestsList.filter((r) => {
      const userMatch =
        !q ||
        (r.profiles?.username || "").toLowerCase().includes(q) ||
        (r.profiles?.full_name || "").toLowerCase().includes(q) ||
        (r.profiles?.email || "").toLowerCase().includes(q) ||
        (r.provider_number || "").toLowerCase().includes(q) ||
        (r.transaction_id || "").toLowerCase().includes(q);

      const statusMatch = requestFilterStatus === "all" || r.status === requestFilterStatus;
      const typeMatch = requestFilterType === "all" || r.type === requestFilterType;

      return userMatch && statusMatch && typeMatch;
    });
  }, [requestsList, requestSearchQuery, requestFilterStatus, requestFilterType]);

  // Paginated Requests
  const paginatedRequests = useMemo(() => {
    const start = (requestPage - 1) * requestPageSize;
    return filteredRequests.slice(start, start + requestPageSize);
  }, [filteredRequests, requestPage, requestPageSize]);

  // Paginated Promo Ledger
  const paginatedPromoLedger = useMemo(() => {
    const start = (promoPage - 1) * promoPageSize;
    return promoLedgerItems.slice(start, start + promoPageSize);
  }, [promoLedgerItems, promoPage, promoPageSize]);

  // Pending count badge
  const pendingRequestsCount = useMemo(() => {
    return requestsList.filter((r) => r.status === "pending").length;
  }, [requestsList]);

  // Approve Request
  const handleApproveRequest = async (request: BalanceTransaction) => {
    if (!supabase) return;
    if (
      !window.confirm(
        "هل أنت متأكد من الموافقة على هذا الطلب؟ سيتم شحن/سحب الرصيد وتحديث محفظة المستخدم تلقائياً."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("balance_transactions")
        .update({
          status: "approved",
          updated_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (error) throw error;

      // Send notification to the user
      try {
        const notifTitle =
          request.type === "deposit" ? "💰 تم قبول طلب الإيداع" : "💸 تم قبول طلب السحب";
        const notifMessage =
          request.type === "deposit"
            ? `تمت الموافقة على طلب شحن الرصيد الخاص بك بقيمة ${request.amount} ج.م وإضافتها إلى حسابك.`
            : `تمت الموافقة على طلب سحب الرصيد الخاص بك بقيمة ${request.amount} ج.م وتحويلها إلى حسابك.`;

        await supabase.from("notifications").insert([
          {
            user_id: request.user_id,
            title: notifTitle,
            message: notifMessage,
            type: "success",
            link: "/profile",
          },
        ]);
      } catch (errNotif) {
        console.error("Failed to send approval notification:", errNotif);
      }

      // Update state locally
      setRequestsList((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, status: "approved" } : r))
      );

      // Refresh users list
      fetchUsers();
    } catch (err: any) {
      alert("فشل في قبول الطلب: " + (err.message || "خطأ غير معروف"));
    }
  };

  // Open Reject Modal
  const handleOpenRejectModal = (request: BalanceTransaction) => {
    setSelectedRequest(request);
    setRejectNotes("");
  };

  // Close Reject Modal
  const handleCloseRejectModal = () => {
    setSelectedRequest(null);
    setRejectNotes("");
  };

  // Confirm Reject Request
  const handleRejectRequest = async () => {
    if (!supabase || !selectedRequest) return;
    if (!rejectNotes.trim()) {
      alert("يرجى إدخال سبب الرفض أولاً.");
      return;
    }

    try {
      const { error } = await supabase
        .from("balance_transactions")
        .update({
          status: "rejected",
          admin_notes: rejectNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedRequest.id);

      if (error) throw error;

      // Save reason to history
      const trimmedReason = rejectNotes.trim();
      if (trimmedReason) {
        setSavedReasons((prev) => {
          const updated = [trimmedReason, ...prev.filter((r) => r !== trimmedReason)].slice(0, 15);
          if (typeof window !== "undefined") {
            localStorage.setItem("rejected_balance_reasons", JSON.stringify(updated));
          }
          return updated;
        });
      }

      // Send notification to the user
      try {
        const notifTitle =
          selectedRequest.type === "deposit" ? "❌ تم رفض طلب الإيداع" : "❌ تم رفض طلب السحب";
        const notifMessage =
          selectedRequest.type === "deposit"
            ? `تم رفض طلب شحن الرصيد الخاص بك بقيمة ${selectedRequest.amount} ج.م. سبب الرفض: ${rejectNotes}`
            : `تم رفض طلب سحب الرصيد الخاص بك بقيمة ${selectedRequest.amount} ج.م وتمت إعادة المبلغ لمحفظتك. سبب الرفض: ${rejectNotes}`;

        await supabase.from("notifications").insert([
          {
            user_id: selectedRequest.user_id,
            title: notifTitle,
            message: notifMessage,
            type: "warning",
            link: "/profile",
          },
        ]);
      } catch (errNotif) {
        console.error("Failed to send rejection notification:", errNotif);
      }

      // Update state locally
      setRequestsList((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id
            ? { ...r, status: "rejected", admin_notes: rejectNotes }
            : r
        )
      );

      handleCloseRejectModal();
      fetchUsers();
    } catch (err: any) {
      alert("فشل في رفض الطلب: " + (err.message || "خطأ غير معروف"));
    }
  };

  // Delete saved reason tag
  const handleDeleteSavedReason = (reason: string) => {
    setSavedReasons((prev) => {
      const updated = prev.filter((r) => r !== reason);
      if (typeof window !== "undefined") {
        localStorage.setItem("rejected_balance_reasons", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Open Edit User Modal
  const handleOpenEditModal = (targetUser: UserProfile) => {
    setSelectedUser(targetUser);
    setActionType("deposit");
    setAssetType("points");
    setTransactionAmount("");
    setPromoReason("");
    setPromoCustomExpiryDate("");
    setStatusMessage(null);
  };

  // Close Edit User Modal
  const handleCloseEditModal = () => {
    if (updating) return;
    setSelectedUser(null);
  };

  // Save Adjustment
  const handleSaveAdjustment = async () => {
    if (!supabase || !selectedUser) return;
    setUpdating(true);
    setStatusMessage(null);

    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      setStatusMessage({
        type: "error",
        text: "يرجى إدخال مبلغ أو عدد نقاط صحيح أكبر من الصفر.",
      });
      setUpdating(false);
      return;
    }

    // Promotional Balance Business Logic
    if (assetType === "promo_balance") {
      const amountFixed = parseFloat(amount.toFixed(2));
      let expiresAt: string | null = null;

      if (actionType === "deposit") {
        if (promoExpiryOption === "30d") {
          expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();
        } else if (promoExpiryOption === "90d") {
          expiresAt = new Date(Date.now() + 90 * 86400000).toISOString();
        } else if (promoExpiryOption === "custom") {
          if (!promoCustomExpiryDate) {
            setStatusMessage({
              type: "error",
              text: "يرجى تحديد تاريخ انتهاء الصلاحية.",
            });
            setUpdating(false);
            return;
          }
          const parsed = new Date(`${promoCustomExpiryDate}T23:59:59Z`);
          if (isNaN(parsed.getTime()) || parsed.getTime() <= Date.now()) {
            setStatusMessage({
              type: "error",
              text: "تاريخ انتهاء الصلاحية يجب أن يكون في المستقبل.",
            });
            setUpdating(false);
            return;
          }
          expiresAt = parsed.toISOString();
        }
      }

      try {
        const res = await adminAdjustPromoBalance({
          userId: selectedUser.id,
          action: actionType,
          amount: amountFixed,
          expiresAt,
          reason: promoReason.trim() || undefined,
          fallbackCurrentPromo: selectedUser.promo_balance || 0,
          currentPoints: selectedUser.points || 0,
          currentBalance: selectedUser.balance || 0,
        });

        if (!res.success) {
          setStatusMessage({ type: "error", text: res.message });
          setUpdating(false);
          return;
        }

        const updatedPromo =
          res.newPromoBalance !== undefined
            ? res.newPromoBalance
            : actionType === "deposit"
            ? parseFloat(((selectedUser.promo_balance || 0) + amountFixed).toFixed(2))
            : parseFloat(Math.max(0, (selectedUser.promo_balance || 0) - amountFixed).toFixed(2));

        setUsersList((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, promo_balance: updatedPromo } : u
          )
        );
        setSelectedUser({ ...selectedUser, promo_balance: updatedPromo });
        setTransactionAmount("");
        setPromoReason("");
        setStatusMessage({ type: "success", text: res.message });
        loadPromoLedger();

        setTimeout(() => {
          setSelectedUser(null);
        }, 1200);
      } catch (err: any) {
        setStatusMessage({
          type: "error",
          text: err?.message || "فشل تعديل الرصيد الترويجي.",
        });
      } finally {
        setUpdating(false);
      }
      return;
    }

    let finalPoints = selectedUser.points || 0;
    let finalBalance = selectedUser.balance || 0;
    const finalPromoBalance = selectedUser.promo_balance || 0;

    if (assetType === "points") {
      const amountInt = Math.floor(amount);
      if (amountInt !== amount) {
        setStatusMessage({
          type: "error",
          text: "النقاط يجب أن تكون عدداً صحيحاً.",
        });
        setUpdating(false);
        return;
      }

      if (actionType === "deposit") {
        finalPoints += amountInt;
      } else {
        if (finalPoints < amountInt) {
          setStatusMessage({
            type: "error",
            text: `رصيد نقاط المستخدم غير كافٍ للخصم (الرصيد الحالي: ${finalPoints} نقطة).`,
          });
          setUpdating(false);
          return;
        }
        finalPoints -= amountInt;
      }
    } else if (assetType === "balance") {
      const amountFixed = parseFloat(amount.toFixed(2));
      if (actionType === "deposit") {
        finalBalance += amountFixed;
      } else {
        if (finalBalance < amountFixed) {
          setStatusMessage({
            type: "error",
            text: `الرصيد الأساسي للمستخدم غير كافٍ للخصم (الرصيد الحالي: ${finalBalance.toFixed(2)} ج.م).`,
          });
          setUpdating(false);
          return;
        }
        finalBalance -= amountFixed;
      }
    }

    try {
      const { data, error } = await supabase.rpc("admin_update_user_assets", {
        p_user_id: selectedUser.id,
        p_points: finalPoints,
        p_balance: parseFloat(finalBalance.toFixed(2)),
        p_promo_balance: parseFloat(finalPromoBalance.toFixed(2)),
      });

      if (error) throw error;
      if (data && !data.success) {
        throw new Error(data.message || "حدث خطأ أثناء تحديث البيانات");
      }

      // Update state locally
      setUsersList((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, points: finalPoints, balance: finalBalance, promo_balance: finalPromoBalance }
            : u
        )
      );

      // Log transaction for main cash balance audit
      if (assetType === "balance") {
        try {
          const isDeposit = actionType === "deposit";
          await supabase.from("balance_transactions").insert({
            user_id: selectedUser.id,
            type: isDeposit ? "deposit" : "withdrawal",
            method: isDeposit ? "admin_reward" : "admin_deduction",
            amount: parseFloat(amount.toFixed(2)),
            provider_number: "system_admin",
            recipient_name: selectedUser.full_name || selectedUser.username || "مستخدم",
            transaction_id: "ADM_" + Date.now(),
            status: "approved",
            admin_notes: `تعديل إداري (رصيد أساسي): ${isDeposit ? "إضافة مكافأة" : "خصم رصيد"}`,
          });
        } catch (logErr) {
          console.warn("Error logging admin asset modification:", logErr);
        }
      }

      setStatusMessage({ type: "success", text: "تم تنفيذ العملية وتحديث البيانات بنجاح!" });
      setTransactionAmount("");

      setSelectedUser({
        ...selectedUser,
        points: finalPoints,
        balance: finalBalance,
        promo_balance: finalPromoBalance,
      });

      setTimeout(() => {
        setSelectedUser(null);
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: "فشل تنفيذ العملية: " + (err.message || "خطأ غير معروف"),
      });
    } finally {
      setUpdating(false);
    }
  };

  return {
    isAdmin,
    authChecking,
    authLoading,
    activeTab,
    setActiveTab,
    // View mode
    viewMode,
    setViewMode,
    // Columns Visibility
    usersVisibleColumns,
    requestsVisibleColumns,
    promoVisibleColumns,
    columnsMenuOpen,
    columnsMenuPos,
    toggleColumnsMenu,
    closeColumnsMenu,
    toggleUserColumn,
    toggleRequestColumn,
    togglePromoColumn,
    // 3-dots Action Menu
    actionMenuState,
    openActionMenu,
    closeActionMenu,
    // Users
    usersList,
    filteredUsers,
    paginatedUsers,
    loadingUsers,
    searchQuery,
    setSearchQuery,
    userPage,
    setUserPage,
    userPageSize,
    setUserPageSize,
    fetchUsers,
    // Requests
    requestsList,
    filteredRequests,
    paginatedRequests,
    loadingRequests,
    requestSearchQuery,
    setRequestSearchQuery,
    requestFilterStatus,
    setRequestFilterStatus,
    requestFilterType,
    setRequestFilterType,
    requestPage,
    setRequestPage,
    requestPageSize,
    setRequestPageSize,
    pendingRequestsCount,
    fetchRequests,
    handleApproveRequest,
    // Rejection modal
    selectedRequest,
    rejectNotes,
    setRejectNotes,
    savedReasons,
    handleOpenRejectModal,
    handleCloseRejectModal,
    handleRejectRequest,
    handleDeleteSavedReason,
    // Promo ledger
    promoLedgerItems,
    paginatedPromoLedger,
    loadingPromoLedger,
    promoSchemaReady,
    promoPage,
    setPromoPage,
    promoPageSize,
    setPromoPageSize,
    loadPromoLedger,
    // Adjust modal
    selectedUser,
    actionType,
    setActionType,
    assetType,
    setAssetType,
    transactionAmount,
    setTransactionAmount,
    promoExpiryOption,
    setPromoExpiryOption,
    promoCustomExpiryDate,
    setPromoCustomExpiryDate,
    promoReason,
    setPromoReason,
    updating,
    statusMessage,
    handleOpenEditModal,
    handleCloseEditModal,
    handleSaveAdjustment,
    // Receipt preview
    previewReceiptUrl,
    setPreviewReceiptUrl,
  };
}
