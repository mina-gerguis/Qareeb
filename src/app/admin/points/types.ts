import { AdminPromoLedgerEntry } from "@/lib/promoBalance";

export interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  phone: string | null;
  governorate: string | null;
  city: string | null;
  points: number;
  balance: number;
  promo_balance: number;
  created_at: string;
  is_admin: boolean;
}

export interface BalanceTransaction {
  id: string;
  user_id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  method: string;
  provider_number: string;
  recipient_name: string | null;
  transaction_id: string | null;
  image_url: string | null;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    username: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}

export type AdminPointsTab = "users" | "requests" | "promo_ledger";
export type ActionType = "deposit" | "withdraw";
export type AssetType = "points" | "balance" | "promo_balance";
export type PromoExpiryOption = "unlimited" | "30d" | "90d" | "custom";

export interface StatusMessage {
  type: "success" | "error";
  text: string;
}

export interface UsersVisibleColumns {
  username: boolean;
  full_name: boolean;
  email: boolean;
  phone: boolean;
  balance: boolean;
  promo_balance: boolean;
  points: boolean;
  actions: boolean;
}

export interface RequestsVisibleColumns {
  user: boolean;
  type: boolean;
  amount: boolean;
  method: boolean;
  receipt: boolean;
  created_at: boolean;
  status: boolean;
  actions: boolean;
}

export interface PromoVisibleColumns {
  user: boolean;
  type: boolean;
  description: boolean;
  amount: boolean;
  code: boolean;
  expires_at: boolean;
  created_at: boolean;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}

export interface ActionMenuState {
  item: UserProfile | BalanceTransaction | AdminPromoLedgerEntry;
  type: "user" | "request" | "promo";
  top: number;
  left: number;
}

export { type AdminPromoLedgerEntry };
