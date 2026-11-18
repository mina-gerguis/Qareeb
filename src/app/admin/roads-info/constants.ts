import {
  RoadFormData,
  NewsFormData,
  VisibleColumnsRoads,
  VisibleColumnsNews,
} from "./types";

export const ROAD_TYPE_OPTIONS = [
  { value: "حر", label: "طريق حر 🛣️" },
  { value: "صحراوي", label: "طريق صحراوي 🏜️" },
  { value: "ساحلي", label: "طريق ساحلي 🌊" },
  { value: "زراعي", label: "طريق زراعي 🌾" },
  { value: "دائري", label: "طريق دائري ⭕" },
  { value: "محور", label: "محور رئيسي 🌉" },
];

export const ROAD_STATUS_OPTIONS = [
  { value: "open", label: "مفتوح وسيولة مرورية ✅" },
  { value: "maintenance", label: "أعمال صيانة وتطوير 🚧" },
  { value: "fog_warning", label: "تحذير شبورة مائية 🌫️" },
  { value: "detour", label: "تحويلة مرورية 🔄" },
];

export const NEWS_CATEGORY_OPTIONS = [
  { value: "weather_fog", label: "شبورة وطقس 🌫️" },
  { value: "maintenance", label: "أعمال صيانة 🚧" },
  { value: "detour", label: "تحويلة مرورية 🔄" },
  { value: "traffic", label: "كثافات مرورية 🚗" },
  { value: "radar", label: "تنبيه رادار 📷" },
  { value: "general", label: "عام ومعلومات 📢" },
];

export const NEWS_SEVERITY_OPTIONS = [
  { value: "info", label: "تنبيه عادي (معلومات)" },
  { value: "warning", label: "تحذير متوسط" },
  { value: "critical", label: "تحذير عاجل وهام جداً ⚠️" },
];

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const INITIAL_ROAD_FORM: RoadFormData = {
  name: "",
  code: "",
  type: "حر",
  lengthKm: 150,
  startPoint: "",
  endPoint: "",
  governorates: "القاهرة، الجيزة",
  speed_private_car: 120,
  speed_minibus: 100,
  speed_microbus: 100,
  speed_pickup: 90,
  speed_bus: 100,
  speed_truck: 80,
  lanesCount: 4,
  emergencyPhone: "01221110000",
  lat: 30.0444,
  lng: 31.2357,
  status: "open",
  description: "",
  radarInfo: "",
  mapUrl: "",
};

export const INITIAL_NEWS_FORM: NewsFormData = {
  title: "",
  summary: "",
  category: "weather_fog",
  severity: "warning",
  roadName: "كافة الطرق",
  source: "الإدارة العامة للمرور",
  isActive: true,
};

export const INITIAL_VISIBLE_ROAD_COLUMNS: VisibleColumnsRoads = {
  name: true,
  type: true,
  length: true,
  endpoints: true,
  speeds: true,
  lanes: true,
  status: true,
  emergency: false,
  mapUrl: true,
};

export const INITIAL_VISIBLE_NEWS_COLUMNS: VisibleColumnsNews = {
  title: true,
  category: true,
  severity: true,
  roadName: true,
  source: true,
  date: true,
  status: true,
};
