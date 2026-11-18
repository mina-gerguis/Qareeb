export interface PhoneEntry {
  id: string;
  name: string;
  specialty: string;
  phone_number: string;
  logo_url: string;
  icon?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TelecomCodeEntry {
  id: string;
  company: string;
  section_name: string;
  title: string;
  code: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
}

export type CompanyKey = "vodafone" | "orange" | "etisalat" | "we";

export interface CompanyMeta {
  label: string;
  logo: string;
  color: string;
  activeBg: string;
  activeBorder: string;
  badgeBg: string;
}

export interface PhoneFormData {
  name: string;
  specialtySelect: string;
  customSpecialty: string;
  customIcon: string;
  phone_number: string;
  logo_url: string;
  description: string;
}

export interface TelecomCodeFormData {
  company: string;
  sectionSelect: string;
  customSection: string;
  customSectionIcon: string;
  title: string;
  code: string;
  note: string;
}

export type DirectoryTab = "phones" | "codes";
export type ViewMode = "table" | "cards";

export interface VisibleColumnsPhones {
  select: boolean;
  logo: boolean;
  name: boolean;
  specialty: boolean;
  phone: boolean;
  actions: boolean;
}

export interface VisibleColumnsCodes {
  select: boolean;
  company: boolean;
  section: boolean;
  title: boolean;
  code: boolean;
  actions: boolean;
}

export type ActionMenuState =
  | { type: "phone"; item: PhoneEntry; top: number; left: number }
  | { type: "code"; item: TelecomCodeEntry; top: number; left: number }
  | null;

export type DetailsModalState =
  | { type: "phone"; item: PhoneEntry }
  | { type: "code"; item: TelecomCodeEntry }
  | null;

export type DeleteModalState =
  | { type: "phone"; item: PhoneEntry }
  | { type: "code"; item: TelecomCodeEntry }
  | { type: "bulk-phones"; ids: string[] }
  | { type: "bulk-codes"; ids: string[] }
  | null;
