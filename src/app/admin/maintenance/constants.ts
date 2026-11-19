import { PresetType } from "./types";

export interface PresetTemplate {
  id: PresetType;
  label: string;
  icon: string;
  title: string;
  message: string;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: "upgrade",
    label: "تحديث وتطوير",
    icon: "bx bx-rocket",
    title: "تحديثات وتطويرات جديدة جارية 🚀",
    message:
      "نقوم بإضافة مميزات جديدة وتحسينات شاملة في واجهة هذه الصفحة. انتظرونا بتجربة مميزة قريباً!",
  },
  {
    id: "db",
    label: "صيانة دورية",
    icon: "bx bx-wrench",
    title: "صيانة دورية لقواعد البيانات 🛠️",
    message:
      "يتم حالياً إجراء صيانة دورية مجدولة وتحديث البيانات لضمان دقة وسرعة الخدمة. نعتذر عن الإزعاج المؤقت.",
  },
  {
    id: "emergency",
    label: "صيانة طارئة",
    icon: "bx bx-error-alt",
    title: "الصفحة متوقفة مؤقتاً للصيانة الطارئة ⚠️",
    message:
      "نعمل على حل مشكلة فنية طارئة بأسرع وقت ممكن. يرجى إعادة المحاولة بعد قليل.",
  },
];

export const CATEGORY_OPTIONS: { id: string; label: string }[] = [
  { id: "all", label: "كل الأقسام" },
  { id: "مواصلات", label: "مواصلات" },
  { id: "خدمات وأماكن", label: "خدمات وأماكن" },
  { id: "صفحات عامة", label: "صفحات عامة" },
  { id: "حسابات ومستخدمين", label: "حسابات" },
];
