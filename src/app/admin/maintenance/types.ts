import { MaintenanceItem, PageInfo } from "@/lib/maintenance";

export type { MaintenanceItem, PageInfo };

export type MaintenanceFilterTab = "all" | "active" | "inactive";

export type MaintenanceCategory =
  | "all"
  | "مواصلات"
  | "خدمات وأماكن"
  | "صفحات عامة"
  | "حسابات ومستخدمين"
  | "عام";

export interface StatusMessage {
  text: string;
  type: "success" | "error";
}

export interface MaintenancePageItem extends PageInfo {
  record: MaintenanceItem | null;
  isUnderMaintenance: boolean;
}

export type PresetType = "upgrade" | "db" | "emergency";
