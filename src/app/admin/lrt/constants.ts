import { LrtStation, LrtPrice, LrtStationFormData, VisibleColumns, LrtLineOption } from "./types";

export const DEFAULT_LRT_STATIONS: LrtStation[] = [
  // الجذع الرئيسي (عدلي منصور - بدر)
  { name: "عدلي منصور", line_type: "trunk", station_order: 1 },
  { name: "العبور", line_type: "trunk", station_order: 2 },
  { name: "المستقبل", line_type: "trunk", station_order: 3 },
  { name: "الشروق", line_type: "trunk", station_order: 4 },
  { name: "هليوبوليس الجديدة", line_type: "trunk", station_order: 5 },
  { name: "بدر", line_type: "trunk", station_order: 6 },

  // تفريعة العاصمة الإدارية (بدر - الفنون والثقافة)
  { name: "الروبيكي", line_type: "capital", station_order: 1 },
  { name: "حدائق العاصمة", line_type: "capital", station_order: 2 },
  { name: "مطار العاصمة", line_type: "capital", station_order: 3 },
  { name: "مدينة الفنون والثقافة", line_type: "capital", station_order: 4 },

  // تفريعة العاشر من رمضان (بدر - مدينة المعرفة)
  { name: "المنطقة الصناعية", line_type: "ramadan", station_order: 1 },
  { name: "مدينة المعرفة", line_type: "ramadan", station_order: 2 },
];

export const DEFAULT_LRT_PRICES: LrtPrice[] = [
  { tier_name: "حتى 3 محطات", max_stations: 3, price: 10 },
  { tier_name: "من 4 إلى 7 محطات", max_stations: 7, price: 15 },
  { tier_name: "من 8 إلى 12 محطة", max_stations: 12, price: 20 },
  { tier_name: "13 محطة فأكثر", max_stations: 25, price: 25 },
];

export const LRT_LINES: LrtLineOption[] = [
  { id: "all", label: "جميع المسارات", color: "#818cf8" },
  { id: "trunk", label: "الجذع الرئيسي (عدلي منصور - بدر)", color: "#06b6d4" },
  { id: "capital", label: "تفريعة العاصمة (الفنون والثقافة)", color: "#a855f7" },
  { id: "ramadan", label: "تفريعة العاشر (مدينة المعرفة)", color: "#10b981" },
];

export const INITIAL_STATION_FORM: LrtStationFormData = {
  name: "",
  line_type: "trunk",
  station_order: 1,
  landmarks: "",
  status: "تشغيل فعلي",
};

export const INITIAL_VISIBLE_COLUMNS: VisibleColumns = {
  order: true,
  name: true,
  line: true,
  landmarks: true,
  status: true,
};
