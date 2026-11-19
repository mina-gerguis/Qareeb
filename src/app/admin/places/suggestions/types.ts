export type ProposalStatus = "pending" | "approved" | "rejected" | "retracted";
export type ProposalFilterTab = ProposalStatus | "all";
export type ViewMode = "table" | "cards";

export interface UserProfile {
  id: string;
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  phone?: string | null;
  governorate?: string | null;
  city?: string | null;
  dob?: string | null;
  interests?: string[] | null;
  bio?: string | null;
  created_at?: string | null;
  is_admin?: boolean;
}

export interface PlaceProposal {
  id: string;
  user_id: string;
  name: string;
  category: string;
  category_label?: string | null;
  sub_categories?: string[] | null;
  place_type?: string | null;
  place_type_icon?: string | null;
  governorate: string;
  city: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  location_url?: string | null;
  images?: string[] | null;
  image_url?: string | null;
  services?: string[] | null;
  features?: string[] | null;
  status: ProposalStatus;
  rejection_reason?: string | null;
  created_at?: string;
  updated_at?: string;
  user_profile?: UserProfile | null;
}

export interface VisibleColumns {
  select: boolean;
  image: boolean;
  name: boolean;
  category: boolean;
  proposer: boolean;
  date: boolean;
  status: boolean;
  actions: boolean;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}

export interface ActionMenuState {
  key: string;
  proposal: PlaceProposal;
  top: number;
  left: number;
}

export type DeleteModalState =
  | { type: "single"; proposal: PlaceProposal }
  | { type: "bulk"; ids: string[] }
  | null;
