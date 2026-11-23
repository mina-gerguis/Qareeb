import {
  NewUserTrialConfig,
  OpenPageAccessOffer,
  PROTECTED_PAGE_OPTIONS,
  DEFAULT_TRIAL_CONFIG,
} from "@/lib/promotions";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  phone: string | null;
  governorate: string | null;
  city: string | null;
  subscription_tier: string;
  subscription_period: string | null;
  subscription_status: string | null;
  subscription_start: string | null;
  subscription_end: string | null;
  created_at: string;
  is_admin: boolean;
}

export type SubscriptionsTab = "users" | "plans" | "promotions";

export interface UsersVisibleColumns {
  user: boolean;
  tier: boolean;
  period: boolean;
  expiry: boolean;
  status: boolean;
  actions: boolean;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}

export interface UserActionMenuState {
  user: UserProfile;
  top: number;
  left: number;
}

export interface PlanFormState {
  name: string;
  price_monthly: number;
  price_yearly: number;
  featuresText: string;
}

export interface UserFormState {
  subscription_tier: string;
  subscription_period: string;
  subscription_status: string;
  subscription_start: string;
  subscription_end: string;
}

export interface OfferFormState {
  title: string;
  target_page: string;
  duration_type: "preset" | "custom";
  duration_preset_days: number;
  custom_end_date: string;
  is_active: boolean;
  banner_message: string;
  send_broadcast: boolean;
}

export interface SubscriptionsKpiData {
  totalSubscribers: number;
  activeSubscribers: number;
  isTrialActive: boolean;
  activeOffersCount: number;
}

export {
  type NewUserTrialConfig,
  type OpenPageAccessOffer,
  PROTECTED_PAGE_OPTIONS,
  DEFAULT_TRIAL_CONFIG,
};
