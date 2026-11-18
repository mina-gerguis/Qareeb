import { BusStation, BusStationFormData, VisibleColumns } from "./types";

export const DEFAULT_BUS_STATIONS: BusStation[] = [
  {
    id: "almaza-superjet",
    name: "موقف ألماظة للسوبر جيت (Almaza Terminal)",
    location: "مصر الجديدة - بجوار طريق السويس ومطار القاهرة",
    governorate: "القاهرة",
    companies: [
      { name: "السوبر جيت (Super Jet)", phone: "19142", type: "رسمي حكومي" },
      { name: "جو باص (Go Bus)", phone: "19567", type: "خاص فاخر" }
    ],
    destinations: ["الإسكندرية", "شرم الشيخ", "الغردقة", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "السويس", "بورسعيد"],
    description: "أحدث محطات السوبر جيت في القاهرة. تخدم بشكل رئيسي المسافرين إلى مدن القناة، البحر الأحمر، والوجه القبلي والصعيد بتنظيم ممتاز وصالة انتظار مكيفة.",
    map_url: "https://maps.google.com/?q=Almaza+Super+Jet+Station"
  },
  {
    id: "torgoman-gateway",
    name: "موقف الترجمان (Cairo Gateway)",
    location: "وسط البلد - شارع الجلاء بجوار محطة مترو جمال عبد الناصر",
    governorate: "القاهرة",
    companies: [
      { name: "شركة شرق الدلتا للنقل", phone: "02-25761311", type: "حكومي" },
      { name: "شركة غرب ووسط الدلتا", phone: "02-25761211", type: "حكومي" },
      { name: "شركة الصعيد للنقل", phone: "02-25761411", type: "حكومي" },
      { name: "جو باص (Go Bus)", phone: "19567", type: "خاص فاخر" }
    ],
    destinations: ["الإسكندرية", "مطروح", "المنصورة", "الزقازيق", "شبه جزيرة سيناء (العريش/طور سيناء)", "محافظات الصعيد بأكملها", "البحر الأحمر"],
    description: "المحطة المركزية الكبرى للنقل البري لجميع المحافظات والدول المجاورة. يضم مكاتب حجز لمعظم الشركات العامة والخاصة وصالة انتظار تجارية ضخمة.",
    map_url: "https://maps.google.com/?q=Torgoman+Bus+Station"
  }
];

export const GOVERNORATES_LIST: string[] = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "القليوبية",
  "مطروح",
  "البحر الأحمر",
  "جنوب سيناء",
  "شمال سيناء",
  "بورسعيد",
  "السويس",
  "الإسماعيلية",
  "الدقهلية",
  "الغربية",
  "الشرقية",
  "المنوفية",
  "البحيرة",
  "كفر الشيخ",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان"
];

export const COMPANY_TYPE_OPTIONS = [
  { label: "رسمي حكومي", value: "رسمي حكومي" },
  { label: "حكومي عام", value: "حكومي" },
  { label: "خاص فاخر", value: "خاص فاخر" },
  { label: "سياحي درجة أولى", value: "سياحي درجة أولى" },
  { label: "اقتصادي", value: "اقتصادي" }
];

export const INITIAL_FORM_DATA: BusStationFormData = {
  name: "",
  location: "",
  governorate: "القاهرة",
  destinationsText: "",
  description: "",
  map_url: ""
};

export const INITIAL_VISIBLE_COLUMNS: VisibleColumns = {
  name: true,
  governorate: true,
  location: true,
  companiesCount: true,
  destinations: true,
  description: false
};
