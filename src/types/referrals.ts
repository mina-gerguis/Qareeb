export type ReferralRewardType = "points" | "promo_balance";

export type ReferralStatus = "pending" | "rewarded" | "max_reached" | "fraud_blocked";

export interface ReferralSettings {
  id: string;
  is_enabled: boolean;
  max_referrals_per_user: number; // 0 = unlimited
  reward_type: ReferralRewardType;
  require_subscription: boolean;
  reward_no_condition: number;
  reward_mishwar: number;
  reward_silver: number;
  reward_gold: number;
  reward_invited_user: number;
  block_same_ip: boolean;
  auto_suspend_fraud: boolean;
  updated_at?: string;
  updated_by?: string;
}

export interface ReferralRecord {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code_used: string;
  ip_address: string | null;
  status: ReferralStatus;
  plan_subscribed: string | null;
  reward_amount: number;
  reward_type: ReferralRewardType;
  rejection_reason: string | null;
  created_at: string;
  rewarded_at: string | null;
  referrer?: {
    id: string;
    full_name: string;
    username: string;
    email: string;
    avatar_url?: string;
    referral_code?: string;
    is_suspended?: boolean;
  };
  referred?: {
    id: string;
    full_name: string;
    username: string;
    email: string;
    avatar_url?: string;
    subscription_tier?: string;
    is_suspended?: boolean;
    created_at?: string;
  };
}

export interface ReferralStatsSummary {
  totalReferrals: number;
  rewardedCount: number;
  pendingCount: number;
  fraudBlockedCount: number;
  maxReachedCount: number;
  totalRewardsDistributed: number;
  rewardType: ReferralRewardType;
}

export interface ReferrerLeaderboardItem {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string;
  referralCode: string;
  totalInvited: number;
  successfulRewarded: number;
  pendingCount: number;
  totalEarned: number;
  isSuspended: boolean;
}
