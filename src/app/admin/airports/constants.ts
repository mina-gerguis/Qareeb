import { AirportFormData, VisibleColumns } from "./types";

export const INITIAL_AIRPORT_FORM: AirportFormData = {
  name: "",
  name_en: "",
  name_ar: "",
  code: "",
  iata_code: "",
  icao_code: "",
  type: "دولي",
  type_en: "international",
  status: "active",
  governorate_ar: "",
  governorate_en: "",
  city: "",
  city_ar: "",
  city_en: "",
  area_ar: "",
  address: "",
  latitude: "",
  longitude: "",
  short_description: "",
  description: "",
  terminals_count: "",
  capacity: "",
  runways_count: "",
  runways_length: "",
  terminals: "",
  domestic_flights: "",
  international_flights: "",
  airlines: "",
  destinations: "",
  connections: "",
  nearby_landmarks: "",
  transportation: "",
  services: "",
  parking: "",
  official_website: "",
  phone: "",
  map_url: "",
  keywords_ar: "",
  keywords_en: "",
};

export const INITIAL_VISIBLE_COLUMNS: VisibleColumns = {
  name: true,
  code: true,
  city: true,
  type: true,
  phone: true,
  terminals: true,
  airlines: true,
  mapUrl: true,
};

export const AIRPORT_TYPE_OPTIONS = [
  { value: "دولي", label: "دولي (International)", type_en: "international" },
  { value: "محلي", label: "محلي (Domestic)", type_en: "domestic" },
  { value: "BOT", label: "نظام BOT (استثماري)", type_en: "bot" },
  { value: "إقليمي", label: "إقليمي (Regional)", type_en: "regional" },
];

export const AIRPORT_STATUS_OPTIONS = [
  { value: "active", label: "نشط / يعمل بكفاءة" },
  { value: "maintenance", label: "صيانة / تطوير" },
  { value: "inactive", label: "غير نشط / متوقف" },
];

export const AIRPORT_FILTER_TYPES = [
  { id: "all", label: "جميع المطارات" },
  { id: "international", label: "مطارات دولية" },
  { id: "domestic", label: "مطارات داخلية ومحلية" },
];
