import { MonorailStation, MonorailPrice, MonorailStationFormData, VisibleColumns, MonorailLineOption } from "./types";

export const DEFAULT_MONORAIL_STATIONS: MonorailStation[] = [
  // مونوريل شرق النيل (العاصمة الإدارية) - 22 محطة
  { name: "الاستاد", line_type: "east", station_order: 1 },
  { name: "هشام بركات", line_type: "east", station_order: 2 },
  { name: "نوري خطاب", line_type: "east", station_order: 3 },
  { name: "الحي السابع", line_type: "east", station_order: 4 },
  { name: "ذاكر حسين", line_type: "east", station_order: 5 },
  { name: "المنطقة الحرة", line_type: "east", station_order: 6 },
  { name: "المشير طنطاوي", line_type: "east", station_order: 7 },
  { name: "وان قطامية", line_type: "east", station_order: 8 },
  { name: "المستثمرين", line_type: "east", station_order: 9 },
  { name: "النسيم", line_type: "east", station_order: 10 },
  { name: "الجامعة الأمريكية", line_type: "east", station_order: 11 },
  { name: "إعمار", line_type: "east", station_order: 12 },
  { name: "ميدان النافورة", line_type: "east", station_order: 13 },
  { name: "البروة", line_type: "east", station_order: 14 },
  { name: "بيت الوطن", line_type: "east", station_order: 15 },
  { name: "مسجد الفتاح العليم", line_type: "east", station_order: 16 },
  { name: "الحي السكني R2", line_type: "east", station_order: 17 },
  { name: "الدائري الإقليمي", line_type: "east", station_order: 18 },
  { name: "فندق الماسة", line_type: "east", station_order: 19 },
  { name: "الحي الحكومي", line_type: "east", station_order: 20 },
  { name: "حي السفارات", line_type: "east", station_order: 21 },
  { name: "مدينة الفنون والثقافة", line_type: "east", station_order: 22 },

  // مونوريل غرب النيل (السادس من أكتوبر) - 16 محطة
  { name: "أكتوبر الجديدة", line_type: "west", station_order: 1 },
  { name: "المنطقة الصناعية", line_type: "west", station_order: 2 },
  { name: "السادات", line_type: "west", station_order: 3 },
  { name: "جهاز مدينة 6 أكتوبر", line_type: "west", station_order: 4 },
  { name: "جمعية المهندسين", line_type: "west", station_order: 5 },
  { name: "جامعة النيل", line_type: "west", station_order: 6 },
  { name: "هايبر وان", line_type: "west", station_order: 7 },
  { name: "الصحراوي", line_type: "west", station_order: 8 },
  { name: "المنصورية", line_type: "west", station_order: 9 },
  { name: "المريوطية", line_type: "west", station_order: 10 },
  { name: "الطريق الدائري", line_type: "west", station_order: 11 },
  { name: "العريش", line_type: "west", station_order: 12 },
  { name: "المطبغة", line_type: "west", station_order: 13 },
  { name: "بولاق الدكرور", line_type: "west", station_order: 14 },
  { name: "جامعة الدول العربية", line_type: "west", station_order: 15 },
  { name: "وادي النيل", line_type: "west", station_order: 16 },
];

export const DEFAULT_MONORAIL_PRICES: MonorailPrice[] = [
  { tier_name: "منطقة واحدة (حتى 5 محطات)", max_stations: 5, price: 20, discount_price: 10 },
  { tier_name: "منطقتان (من 6 إلى 10 محطات)", max_stations: 10, price: 40, discount_price: 20 },
  { tier_name: "ثلاث مناطق (من 11 إلى 15 محطة)", max_stations: 15, price: 55, discount_price: 27.5 },
  { tier_name: "أربع مناطق (أكثر من 15 محطة)", max_stations: 30, price: 80, discount_price: 40 },
];

export const MONORAIL_LINES: MonorailLineOption[] = [
  { id: "all", label: "جميع الخطوط", color: "#818cf8" },
  { id: "east", label: "شرق النيل (العاصمة الإدارية)", color: "#3b82f6" },
  { id: "west", label: "غرب النيل (6 أكتوبر)", color: "#10b981" },
];

export const INITIAL_STATION_FORM: MonorailStationFormData = {
  name: "",
  line_type: "east",
  station_order: 1,
  landmarks: "",
  status: "تحت الإنشاء",
};

export const INITIAL_VISIBLE_COLUMNS: VisibleColumns = {
  order: true,
  name: true,
  line: true,
  landmarks: true,
  status: true,
};
