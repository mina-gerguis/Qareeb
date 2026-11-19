import { ScheduleDay } from "@/lib/workingHours";
import { CategoryItem } from "@/data/places";

export interface DBPlace {
  id: string;
  name: string;
  name_en?: string;
  category: string;
  category_label: string;
  sub_categories?: string[];
  governorate?: string;
  city?: string;
  short_description?: string;
  full_address: string;
  phones: string[];
  google_maps_url: string;
  images: string[];
  menu_images: string[];
  working_hours: string;
  rating: number;
  reviews_count?: number;
  description: string;
  latitude: number | null;
  longitude: number | null;
  created_at?: string;
  branches?: BranchItem[];
  features?: string[];
  services?: string[];
  place_type?: string;
  place_type_icon?: string;
  website_url?: string | null;
}

export interface BranchItem {
  id?: string;
  place_id?: string;
  name: string;
  governorate: string;
  city: string;
  full_address: string;
  phones: string[];
  google_maps_url: string;
  working_hours: string;
  latitude?: number | null;
  longitude?: number | null;
  media?: string[];
  is_main: boolean;
  website_url?: string | null;
  features?: string[];
  services?: string[];
}

export interface PlaceFormData {
  id?: string;
  name: string;
  name_en: string;
  category: string;
  category_label: string;
  sub_categories: string[];
  place_type: string;
  place_type_icon: string;
  governorate: string;
  city: string;
  short_description: string;
  full_address: string;
  phones: string;
  google_maps_url: string;
  image_url: string;
  menu_images: string;
  working_hours?: string;
  description: string;
  latitude: string;
  longitude: string;
  website_url: string;
  features: string[];
  services: string[];
}

export interface BranchFormData {
  name: string;
  governorate: string;
  city: string;
  full_address: string;
  phones: string;
  google_maps_url: string;
  latitude: string;
  longitude: string;
  media: string;
}

export interface ExcelParsedPlace {
  rowNum: number;
  name: string;
  name_en?: string | null;
  category: string;
  category_label: string;
  sub_categories: string[];
  governorate: string;
  city: string;
  short_description: string;
  full_address: string;
  phones: string[];
  google_maps_url: string;
  images: string[];
  menu_images: string[];
  working_hours: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  website_url: string | null;
  features: string[];
  services: string[];
  place_type: string | null;
  place_type_icon: string | null;
  duplicateType: "db" | "internal" | null;
  isUpdate: boolean;
  existingId: string | null;
  changedFields: string[];
}

export interface VisibleColumns {
  image: boolean;
  name: boolean;
  category: boolean;
  location: boolean;
  features: boolean;
  workingHours: boolean;
  actions: boolean;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}

export interface ActionMenuState {
  place: DBPlace | null;
  top: number;
  left: number;
  openUp: boolean;
}

export interface DeleteModalState {
  isOpen: boolean;
  place: DBPlace | null;
  isBulk?: boolean;
  bulkCount?: number;
}

export interface DeleteAlertModalState {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  placeName?: string;
}
