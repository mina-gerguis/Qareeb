import { VisibleColumns, PlaceFormData, BranchFormData } from "./types";
import { DAYS_OF_WEEK, ScheduleDay } from "@/lib/workingHours";
import { governoratesList } from "@/data/egypt_locations";

export const AVAILABLE_INTERESTS_MAP: Record<string, { label: string; icon: string }> = {
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
  quiet_places: { label: "اماكن هادئه", icon: "bx bx-moon" }
};

export const PRESET_BOXICONS = [
  { name: "مطعم / أكل", icon: "bx bx-utensils" },
  { name: "كافيه / قهوة", icon: "bx bx-coffee-togo" },
  { name: "صيدلية", icon: "bx bx-first-aid" },
  { name: "مستشفى", icon: "bx bx-plus-medical" },
  { name: "حديقة", icon: "bx bx-tree" },
  { name: "عائلية", icon: "bx bx-group" },
  { name: "ترفيه / ألعاب", icon: "bx bx-game" },
  { name: "جيم / رياضة", icon: "bx bx-dumbbell" },
  { name: "سيارات / خدمات", icon: "bx bx-car" },
  { name: "مكتبة / تعليم", icon: "bx bx-book" },
  { name: "صالون / حلاقة", icon: "bx bx-cut" },
  { name: "سوبرماركت / تسوق", icon: "bx bx-cart" },
  { name: "فندق / إقامة", icon: "bx bx-hotel" },
  { name: "سينما / مسرح", icon: "bx bx-film" },
  { name: "صيانة / كهروميكانيك", icon: "bx bx-wrench" },
  { name: "محطة بنزين", icon: "bx bx-gas-pump" },
  { name: "متجر / محل", icon: "bx bx-store" },
  { name: "صحة / عناية", icon: "bx bx-heart" },
  { name: "شركات / مكاتب", icon: "bx bx-building" },
  { name: "ملابس / موضة", icon: "bx bx-t-shirt" },
  { name: "إلكترونيات", icon: "bx bx-mobile-alt" },
  { name: "كمبيوتر / تقنية", icon: "bx bx-laptop" },
  { name: "ديكور / دهانات", icon: "bx bx-paint" },
  { name: "سباحة / شاطئ", icon: "bx bx-swim" }
];

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const INITIAL_VISIBLE_COLUMNS: VisibleColumns = {
  image: true,
  name: true,
  category: true,
  location: true,
  features: true,
  workingHours: true,
  actions: true,
};

export const INITIAL_PLACE_FORM: PlaceFormData = {
  name: "",
  name_en: "",
  category: "food_drinks",
  category_label: "أكل ومشروبات",
  sub_categories: ["restaurants"],
  place_type: "",
  place_type_icon: "",
  governorate: governoratesList[0] || "القاهرة",
  city: "",
  short_description: "",
  full_address: "",
  phones: "",
  google_maps_url: "",
  image_url: "",
  menu_images: "",
  description: "",
  latitude: "",
  longitude: "",
  website_url: "",
  features: [],
  services: []
};

export const INITIAL_BRANCH_FORM: BranchFormData = {
  name: "",
  governorate: governoratesList[0] || "القاهرة",
  city: "",
  full_address: "",
  phones: "",
  google_maps_url: "",
  latitude: "",
  longitude: "",
  media: ""
};

export const DEFAULT_SCHEDULE_DATA: ScheduleDay[] = DAYS_OF_WEEK.map(day => ({
  day,
  isWorking: true,
  openTime: "09:00",
  openPeriod: "ص",
  closeTime: "11:00",
  closePeriod: "م"
}));
