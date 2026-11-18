import {
  CompanyKey,
  CompanyMeta,
  PhoneFormData,
  TelecomCodeFormData,
  VisibleColumnsPhones,
  VisibleColumnsCodes,
} from "./types";

export const COMPANY_META: Record<CompanyKey, CompanyMeta> = {
  vodafone: {
    label: "فودافون",
    logo: "/images/company/vodafone.webp",
    color: "#ef4444",
    activeBg: "rgba(239, 68, 68, 0.12)",
    activeBorder: "rgba(239, 68, 68, 0.4)",
    badgeBg: "rgba(239, 68, 68, 0.2)",
  },
  orange: {
    label: "اورنج",
    logo: "/images/company/orange.webp",
    color: "#f97316",
    activeBg: "rgba(249, 115, 22, 0.12)",
    activeBorder: "rgba(249, 115, 22, 0.4)",
    badgeBg: "rgba(249, 115, 22, 0.2)",
  },
  etisalat: {
    label: "اتصالات",
    logo: "/images/company/etisalat.webp",
    color: "#22c55e",
    activeBg: "rgba(34, 197, 94, 0.12)",
    activeBorder: "rgba(34, 197, 94, 0.4)",
    badgeBg: "rgba(34, 197, 94, 0.2)",
  },
  we: {
    label: "وي",
    logo: "/images/company/we.webp",
    color: "#a855f7",
    activeBg: "rgba(168, 85, 247, 0.12)",
    activeBorder: "rgba(168, 85, 247, 0.4)",
    badgeBg: "rgba(168, 85, 247, 0.2)",
  },
};

export const COMPANY_LABELS: Record<string, string> = {
  vodafone: "فودافون",
  orange: "اورنج",
  etisalat: "اتصالات",
  we: "وي",
};

export const INITIAL_PHONE_FORM: PhoneFormData = {
  name: "",
  specialtySelect: "",
  customSpecialty: "",
  customIcon: "",
  phone_number: "",
  logo_url: "",
  description: "",
};

export const INITIAL_CODE_FORM: TelecomCodeFormData = {
  company: "vodafone",
  sectionSelect: "",
  customSection: "",
  customSectionIcon: "",
  title: "",
  code: "",
  note: "",
};

export const INITIAL_VISIBLE_PHONE_COLUMNS: VisibleColumnsPhones = {
  select: true,
  logo: true,
  name: true,
  specialty: true,
  phone: true,
  actions: true,
};

export const INITIAL_VISIBLE_CODE_COLUMNS: VisibleColumnsCodes = {
  select: true,
  company: true,
  section: true,
  title: true,
  code: true,
  actions: true,
};

export const PAGE_SIZE_OPTIONS: number[] = [10, 25, 50, 100];
