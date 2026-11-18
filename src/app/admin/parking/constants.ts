import { ParkingSpot, ParkingFormData, VisibleColumns } from "./types";

export const POPULAR_PARKING_AREAS: string[] = [
  "وسط البلد",
  "التحرير",
  "مصر الجديدة",
  "مدينة نصر",
  "الدقي",
  "المعادي",
  "المهندسين",
  "التجمع الخامس",
  "العتبة",
  "شبرا",
  "الجيزة",
  "الزمالك",
  "روكسي",
  "العاصمة الإدارية",
  "6 أكتوبر",
  "الشيخ زايد"
];

export const GARAGE_TYPE_OPTIONS = [
  { value: "مغطى ومتعدد الطوابق 🏢", label: "مغطى ومتعدد الطوابق 🏢" },
  { value: "جراج ذكي إلكتروني 🤖", label: "جراج ذكي إلكتروني 🤖" },
  { value: "جراج سطحي مفتوح 🅿️", label: "جراج سطحي مفتوح 🅿️" },
  { value: "جراج تحت الأرض 🚇", label: "جراج تحت الأرض 🚇" }
];

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const INITIAL_FORM_DATA: ParkingFormData = {
  name: "",
  area: "وسط البلد",
  address: "",
  nearestMetro: "",
  hourlyRate: 15,
  maxDailyRate: 120,
  capacity: 250,
  type: "مغطى ومتعدد الطوابق 🏢",
  hours: "24 ساعة طوال الأسبوع",
  features: "أمن وحراسة، كاميرات مراقبة، مصاعد كهربائية، دفع إلكتروني",
  mapLocationLink: ""
};

export const INITIAL_VISIBLE_COLUMNS: VisibleColumns = {
  name: true,
  area: true,
  address: true,
  nearestMetro: true,
  rates: true,
  capacity: true,
  type: true,
  hours: false,
  mapLocation: true
};

export const DEFAULT_PARKING_SPOTS: ParkingSpot[] = [
  {
    id: "tahrir-multistory",
    name: "جراج التحرير متعدد الطوابق",
    area: "التحرير",
    address: "ميدان التحرير - أمام المتحف المصري مباشرة",
    nearestMetro: "أنور السادات (الخط 1 و 2)",
    hourlyRate: 20,
    maxDailyRate: 150,
    capacity: 1700,
    type: "مغطى ومتعدد الطوابق 🏢",
    hours: "24 ساعة طوال الأسبوع",
    features: ["أمن وحراسة 24/7", "كاميرات مراقبة حديثة", "مصاعد سريعة", "دفع كاش وفيزا", "شواحن سيارات كهربائية"],
    mapLocationLink: "https://maps.google.com/?q=Tahrir+Garage+Cairo"
  },
  {
    id: "roxy-smart-garage",
    name: "جراج روكسي الذكي الإلكتروني",
    area: "روكسي",
    address: "ميدان روكسي - مصر الجديدة",
    nearestMetro: "الأهرام (الخط 3)",
    hourlyRate: 25,
    maxDailyRate: 180,
    capacity: 900,
    type: "جراج ذكي إلكتروني 🤖",
    hours: "24 ساعة طوال الأسبوع",
    features: ["نظام ركن آلي بالكامل روبوتي", "استرجاع السيارة في 3 دقائق", "تأمين شامل", "دفع إلكتروني متقدم"],
    mapLocationLink: "https://maps.google.com/?q=Roxy+Smart+Garage"
  },
  {
    id: "opera-attaba-garage",
    name: "جراج الأوبرا والعتبة الحديث",
    area: "العتبة",
    address: "ميدان الأوبرا والعتبة - وسط البلد",
    nearestMetro: "العتبة (الخط 2 و 3)",
    hourlyRate: 15,
    maxDailyRate: 120,
    capacity: 1200,
    type: "مغطى ومتعدد الطوابق 🏢",
    hours: "24 ساعة طوال الأسبوع",
    features: ["أمن دائم", "بوابات دفع إلكترونية", "غسيل سيارات متاح", "قريب من الأسواق التجارية"],
    mapLocationLink: "https://maps.google.com/?q=Attaba+Opera+Garage"
  },
  {
    id: "bostan-multistory",
    name: "جراج البستان التجاري",
    area: "وسط البلد",
    address: "تقاطع شارع البستان وباب اللوق",
    nearestMetro: "محمد نجيب (الخط 1)",
    hourlyRate: 15,
    maxDailyRate: 100,
    capacity: 800,
    type: "مغطى ومتعدد الطوابق 🏢",
    hours: "من 7:00 ص حتى 2:00 ص",
    features: ["داخل مول البستان للإلكترونيات", "كاميرات مراقبة", "مصاعد للركاب"],
    mapLocationLink: "https://maps.google.com/?q=Bostan+Garage"
  },
  {
    id: "nasr-city-taiba",
    name: "جراج طيبة أوتليت والمنطقة الأولى",
    area: "مدينة نصر",
    address: "طريق النصر - بجوار مول طيبة أوتليت",
    nearestMetro: "الاستاد (الخط 3)",
    hourlyRate: 15,
    maxDailyRate: 110,
    capacity: 450,
    type: "جراج سطحي مفتوح 🅿️",
    hours: "24 ساعة طوال الأسبوع",
    features: ["مظلات حماية من الشمس", "حراسة أمنية", "قريب من المحلات والمطاعم"],
    mapLocationLink: "https://maps.google.com/?q=Tayba+Garage+Nasr+City"
  }
];
