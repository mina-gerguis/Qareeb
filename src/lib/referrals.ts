import { supabase } from "./supabase";
import {
  ReferralRecord,
  ReferralSettings,
  ReferralStatsSummary,
  ReferrerLeaderboardItem,
} from "@/types/referrals";

export const DEFAULT_REFERRAL_SETTINGS: ReferralSettings = {
  id: "default",
  is_enabled: true,
  max_referrals_per_user: 10,
  reward_type: "points",
  require_subscription: true,
  reward_no_condition: 20,
  reward_mishwar: 30,
  reward_silver: 70,
  reward_gold: 120,
  reward_invited_user: 15,
  block_same_ip: true,
  auto_suspend_fraud: true,
};

/**
 * جلب إعدادات نظام الإحالات الحالية
 */
export async function fetchReferralSettings(): Promise<ReferralSettings> {
  if (!supabase) return DEFAULT_REFERRAL_SETTINGS;

  try {
    const { data, error } = await supabase
      .from("referral_settings")
      .select("*")
      .eq("id", "default")
      .single();

    if (error || !data) {
      return DEFAULT_REFERRAL_SETTINGS;
    }

    return {
      id: data.id,
      is_enabled: Boolean(data.is_enabled),
      max_referrals_per_user: Number(data.max_referrals_per_user ?? 10),
      reward_type: data.reward_type === "promo_balance" ? "promo_balance" : "points",
      require_subscription: Boolean(data.require_subscription),
      reward_no_condition: Number(data.reward_no_condition ?? 20),
      reward_mishwar: Number(data.reward_mishwar ?? 30),
      reward_silver: Number(data.reward_silver ?? 70),
      reward_gold: Number(data.reward_gold ?? 120),
      reward_invited_user: Number(data.reward_invited_user ?? 15),
      block_same_ip: data.block_same_ip !== false,
      auto_suspend_fraud: data.auto_suspend_fraud !== false,
      updated_at: data.updated_at,
    };
  } catch (err) {
    console.error("Error fetching referral settings:", err);
    return DEFAULT_REFERRAL_SETTINGS;
  }
}

/**
 * حفظ وتحديث إعدادات نظام الإحالات من لوحة تحكم الأدمن
 */
export async function updateReferralSettings(
  settings: Partial<ReferralSettings>,
  adminUserId?: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: "الاتصال بقاعدة البيانات غير متوفر" };

  try {
    const payload = {
      ...settings,
      id: "default",
      updated_at: new Date().toISOString(),
      updated_by: adminUserId || null,
    };

    const { error } = await supabase
      .from("referral_settings")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "حدث خطأ غير متوقع" };
  }
}

/**
 * جلب إحصائيات الإحالات العامة للأدمن (KPIs)
 */
export async function fetchReferralsSummary(): Promise<ReferralStatsSummary> {
  const summary: ReferralStatsSummary = {
    totalReferrals: 0,
    rewardedCount: 0,
    pendingCount: 0,
    fraudBlockedCount: 0,
    maxReachedCount: 0,
    totalRewardsDistributed: 0,
    rewardType: "points",
  };

  if (!supabase) return summary;

  try {
    const { data: settings } = await supabase
      .from("referral_settings")
      .select("reward_type")
      .eq("id", "default")
      .single();

    if (settings?.reward_type) {
      summary.rewardType = settings.reward_type;
    }

    const { data: referrals, error } = await supabase
      .from("referrals")
      .select("status, reward_amount");

    if (error || !referrals) return summary;

    summary.totalReferrals = referrals.length;
    referrals.forEach((row) => {
      if (row.status === "rewarded") {
        summary.rewardedCount++;
        summary.totalRewardsDistributed += Number(row.reward_amount || 0);
      } else if (row.status === "pending") {
        summary.pendingCount++;
      } else if (row.status === "fraud_blocked") {
        summary.fraudBlockedCount++;
      } else if (row.status === "max_reached") {
        summary.maxReachedCount++;
      }
    });

    return summary;
  } catch (err) {
    console.error("Error fetching referrals summary:", err);
    return summary;
  }
}

/**
 * جلب سجل الإحالات التفصيلي للأدمن مع بيانات الداعي والمدعو
 */
export async function fetchAdminReferralsList(params?: {
  status?: string;
  searchQuery?: string;
  limit?: number;
}): Promise<ReferralRecord[]> {
  if (!supabase) return [];

  try {
    let query = supabase
      .from("referrals")
      .select(`
        *,
        referrer:referrer_id (
          id, full_name, username, email, avatar_url, referral_code, is_suspended
        ),
        referred:referred_id (
          id, full_name, username, email, avatar_url, subscription_tier, is_suspended, created_at
        )
      `)
      .order("created_at", { ascending: false })
      .limit(params?.limit || 150);

    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching admin referrals list:", error);
      return [];
    }

    let records: ReferralRecord[] = (data || []).map((row: any) => ({
      id: row.id,
      referrer_id: row.referrer_id,
      referred_id: row.referred_id,
      referral_code_used: row.referral_code_used,
      ip_address: row.ip_address,
      status: row.status,
      plan_subscribed: row.plan_subscribed,
      reward_amount: Number(row.reward_amount || 0),
      reward_type: row.reward_type || "points",
      rejection_reason: row.rejection_reason,
      created_at: row.created_at,
      rewarded_at: row.rewarded_at,
      referrer: row.referrer,
      referred: row.referred,
    }));

    if (params?.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.trim().toLowerCase();
      records = records.filter(
        (r) =>
          r.referral_code_used.toLowerCase().includes(q) ||
          r.ip_address?.toLowerCase().includes(q) ||
          r.referrer?.full_name?.toLowerCase().includes(q) ||
          r.referrer?.email?.toLowerCase().includes(q) ||
          r.referred?.full_name?.toLowerCase().includes(q) ||
          r.referred?.email?.toLowerCase().includes(q)
      );
    }

    return records;
  } catch (err) {
    console.error("Error fetching admin referrals list:", err);
    return [];
  }
}

/**
 * لوحة الشرف: المستخدمين الأكثر دعوة وأعلى مكافآت
 */
export async function fetchTopReferrersLeaderboard(): Promise<ReferrerLeaderboardItem[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("referrals")
      .select(`
        referrer_id,
        status,
        reward_amount,
        referrer:referrer_id (
          id, full_name, username, email, avatar_url, referral_code, is_suspended
        )
      `);

    if (error || !data) return [];

    const map = new Map<string, ReferrerLeaderboardItem>();

    data.forEach((row: any) => {
      const refUser = row.referrer;
      if (!refUser) return;
      const id = row.referrer_id;

      if (!map.has(id)) {
        map.set(id, {
          userId: id,
          fullName: refUser.full_name || "مستخدم",
          username: refUser.username || "user",
          email: refUser.email || "",
          avatarUrl: refUser.avatar_url,
          referralCode: refUser.referral_code || "",
          totalInvited: 0,
          successfulRewarded: 0,
          pendingCount: 0,
          totalEarned: 0,
          isSuspended: Boolean(refUser.is_suspended),
        });
      }

      const item = map.get(id)!;
      item.totalInvited++;
      if (row.status === "rewarded") {
        item.successfulRewarded++;
        item.totalEarned += Number(row.reward_amount || 0);
      } else if (row.status === "pending") {
        item.pendingCount++;
      }
    });

    return Array.from(map.values())
      .sort((a, b) => b.totalInvited - a.totalInvited || b.totalEarned - a.totalEarned)
      .slice(0, 50);
  } catch (err) {
    console.error("Error fetching top referrers:", err);
    return [];
  }
}

/**
 * دالة استدعاء تسجيل الإحالة من خلال السيرفر / الفرونت
 */
export async function processReferralSignupCall(
  userId: string,
  refCode: string,
  clientIp?: string
): Promise<{ success: boolean; status?: string; message?: string }> {
  if (!supabase || !refCode.trim()) return { success: false, status: "empty_code" };

  try {
    const { data, error } = await supabase.rpc("handle_referral_on_signup", {
      p_referred_user_id: userId,
      p_referral_code: refCode.trim(),
      p_client_ip: clientIp || "unknown",
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return data || { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to process referral" };
  }
}
