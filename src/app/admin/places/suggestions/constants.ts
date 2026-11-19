import { VisibleColumns, ProposalStatus } from "./types";

export const AVAILABLE_INTERESTS_MAP: Record<
  string,
  { label: string; icon: string }
> = {
  restaurants: { label: "مطاعم", icon: "bx bx-restaurant" },
  drinks: { label: "مشروبات", icon: "bx bx-coffee" },
  family: { label: "اماكن عائلية", icon: "bx bx-home-heart" },
  kids: { label: "اماكن للأطفال", icon: "bx bx-child" },
  hotels_aqua: { label: "فنادق واكوا بارك", icon: "bx bx-building-house" },
  activities: { label: "أنشطة وترفيه", icon: "bx bx-party" },
  offers: { label: "اقوي العروض", icon: "bx bxs-discount" },
  cinema: { label: "السينما", icon: "bx bx-camera-movie" },
  medical: { label: "خدمات طبية", icon: "bx bx-plus-medical" },
  health_beauty: { label: "الصحة والجمال", icon: "bx bx-spa" },
  parks: { label: "الحدائق", icon: "bx bx-tree" },
  work: { label: "شغل", icon: "bx bx-briefcase" },
  courses_study: { label: "كورسات ودراسة", icon: "bx bx-book-reader" },
  quiet_places: { label: "اماكن هادئه", icon: "bx bx-moon" },
};

export const STATUS_META: Record<
  ProposalStatus,
  { label: string; color: string; bg: string; border: string; icon: string }
> = {
  pending: {
    label: "قيد المراجعة",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.3)",
    icon: "bx-time-five",
  },
  approved: {
    label: "معتمد ومقبول",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.3)",
    icon: "bx-check-circle",
  },
  rejected: {
    label: "مرفوض",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.3)",
    icon: "bx-x-circle",
  },
  retracted: {
    label: "متراجع عنه",
    color: "#8e8e93",
    bg: "rgba(142, 142, 147, 0.12)",
    border: "rgba(142, 142, 147, 0.3)",
    icon: "bx-undo",
  },
};

export const INITIAL_VISIBLE_COLUMNS: VisibleColumns = {
  select: true,
  image: true,
  name: true,
  category: true,
  proposer: true,
  date: true,
  status: true,
  actions: true,
};

export const PAGE_SIZE_OPTIONS: number[] = [10, 25, 50, 100];
