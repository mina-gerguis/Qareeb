import {
  PromoExpiryMode,
  VOUCHER_REWARD_META,
  VOUCHER_STATUS_META,
  VoucherAudience,
  VoucherItem,
  VoucherRedemptionLog,
  VoucherRewardType,
  VoucherStatus,
} from "@/types/vouchers";

export interface VoucherFormState {
  mode: "single" | "batch";
  code: string;
  batchPrefix: string;
  batchCount: number;
  batchName: string;
  title: string;
  description: string;
  rewardType: VoucherRewardType;
  amount: string;
  promoExpiryMode: PromoExpiryMode;
  promoExpiryDays: number;
  promoExpiryDate: string;
  featureKey: string;
  targetPage: string;
  accessDurationUnit: "hours" | "days";
  accessDurationValue: number;
  unlimitedUses: boolean;
  maxUses: number;
  maxUsesPerUser: number;
  startsAt: string;
  expiresAt: string;
  audience: VoucherAudience;
  isActive: boolean;
}

export interface VouchersVisibleColumns {
  code: boolean;
  title: boolean;
  reward: boolean;
  usage: boolean;
  expiresAt: boolean;
  status: boolean;
  actions: boolean;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}

export interface ActionMenuState {
  voucher: VoucherItem;
  top: number;
  left: number;
}

export interface VouchersKpiData {
  total: number;
  active: number;
  totalRedemptions: number;
  promoValueGranted: number;
}

export {
  type PromoExpiryMode,
  VOUCHER_REWARD_META,
  VOUCHER_STATUS_META,
  type VoucherAudience,
  type VoucherItem,
  type VoucherRedemptionLog,
  type VoucherRewardType,
  type VoucherStatus,
};
