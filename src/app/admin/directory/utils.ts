import { PhoneEntry, TelecomCodeEntry } from "./types";
import { COMPANY_LABELS } from "./constants";

export const isUUID = (str: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const filterPhones = (
  entries: PhoneEntry[],
  selectedSpecialtyTab: string,
  searchQuery: string
): PhoneEntry[] => {
  let list = entries;
  if (selectedSpecialtyTab !== "all") {
    if (selectedSpecialtyTab === "__other__") {
      list = list.filter((e) => !e.specialty || !e.specialty.trim());
    } else {
      list = list.filter((e) => e.specialty?.trim() === selectedSpecialtyTab);
    }
  }

  if (!searchQuery.trim()) return list;

  const term = searchQuery.toLowerCase().trim();
  return list.filter((e) => {
    const name = (e.name || "").toLowerCase();
    const specialty = (e.specialty || "").toLowerCase();
    const description = (e.description || "").toLowerCase();
    const phone = (e.phone_number || "").toLowerCase();
    return (
      name.includes(term) ||
      specialty.includes(term) ||
      description.includes(term) ||
      phone.includes(term)
    );
  });
};

export const filterCodes = (
  codes: TelecomCodeEntry[],
  selectedCompanyTab: string,
  searchQuery: string
): TelecomCodeEntry[] => {
  let list = codes;
  if (selectedCompanyTab !== "all") {
    list = list.filter((c) => c.company === selectedCompanyTab);
  }

  if (!searchQuery.trim()) return list;

  const term = searchQuery.toLowerCase().trim();
  return list.filter((c) => {
    const company = (COMPANY_LABELS[c.company] || c.company || "").toLowerCase();
    const section = (c.section_name || "").toLowerCase();
    const title = (c.title || "").toLowerCase();
    const code = (c.code || "").toLowerCase();
    return (
      company.includes(term) ||
      section.includes(term) ||
      title.includes(term) ||
      code.includes(term)
    );
  });
};

export const getSpecialtyCounts = (entries: PhoneEntry[]): Record<string, number> => {
  const counts: Record<string, number> = { all: entries.length };
  let otherCount = 0;
  entries.forEach((e) => {
    const spec = e.specialty?.trim();
    if (spec) {
      counts[spec] = (counts[spec] || 0) + 1;
    } else {
      otherCount++;
    }
  });
  if (otherCount > 0) {
    counts["__other__"] = otherCount;
  }
  return counts;
};

export const getCompanyCounts = (codes: TelecomCodeEntry[]): Record<string, number> => {
  const counts: Record<string, number> = {
    all: codes.length,
    vodafone: 0,
    orange: 0,
    etisalat: 0,
    we: 0,
  };
  codes.forEach((c) => {
    if (counts[c.company] !== undefined) {
      counts[c.company]++;
    } else {
      counts[c.company] = 1;
    }
  });
  return counts;
};

export const getSpecialtyIcons = (entries: PhoneEntry[]): Record<string, string> => {
  const map: Record<string, string> = {};
  entries.forEach((e) => {
    if (e.specialty && e.icon && !map[e.specialty]) {
      map[e.specialty] = e.icon;
    }
  });
  return map;
};
