import { CATEGORIES_STRUCTURE, FEATURES_LIST } from "@/data/places";
import { DAYS_OF_WEEK, ScheduleDay } from "@/lib/workingHours";
import { DBPlace } from "./types";
import { AVAILABLE_INTERESTS_MAP } from "./constants";

export const CATEGORY_ICONS: Record<string, any> = {
  all: "bx-grid-alt",
};

export const CATEGORY_MAP: Record<string, string> = {};

CATEGORIES_STRUCTURE.forEach(main => {
  CATEGORY_ICONS[main.name] = main.icon;
  CATEGORY_MAP[main.name] = main.label;
  main.subCategories.forEach(sub => {
    CATEGORY_ICONS[sub.name] = sub.icon;
    CATEGORY_MAP[sub.name] = sub.label;
  });
});

export function getCategoryColor(cat: string): string {
  const mainCat = CATEGORIES_STRUCTURE.find(m => m.name === cat || m.subCategories.some(s => s.name === cat));
  return mainCat?.color ?? "var(--color-primary, #6c63ff)";
}

export function getInterestObj(intKey: string): { label: string; icon: string } {
  if (AVAILABLE_INTERESTS_MAP[intKey]) return AVAILABLE_INTERESTS_MAP[intKey];
  const found = Object.values(AVAILABLE_INTERESTS_MAP).find(item => item.label === intKey);
  if (found) return found;
  return { label: intKey, icon: "bx bx-star" };
}

// ─── Excel Working Hours Helpers ───

export function parseExcelTimePart(rawPart: string, defaultPeriod: "ص" | "م"): { time: string; period: "ص" | "م" } {
  let period: "ص" | "م" = defaultPeriod;
  const lower = rawPart.toLowerCase();

  if (lower.includes("م") || lower.includes("مساء") || lower.includes("pm")) {
    period = "م";
  } else if (lower.includes("ص") || lower.includes("صباح") || lower.includes("am")) {
    period = "ص";
  }

  const match = rawPart.match(/(\d{1,2})(?:[:.](\d{2}))?/);
  if (!match) {
    return { time: defaultPeriod === "ص" ? "09:00" : "11:00", period };
  }

  let hour = parseInt(match[1], 10);
  const minStr = match[2] || "00";

  if (hour > 12) {
    hour = hour - 12;
    period = "م";
  } else if (hour === 0) {
    hour = 12;
    period = "ص";
  }

  const hourStr = hour.toString().padStart(2, "0");
  return { time: `${hourStr}:${minStr}`, period };
}

export function parseExcelSingleDayTime(dayName: string, str: string): ScheduleDay {
  const defaultOpen: ScheduleDay = {
    day: dayName,
    isWorking: true,
    openTime: "09:00",
    openPeriod: "ص",
    closeTime: "11:00",
    closePeriod: "م"
  };

  if (!str || !str.trim()) return defaultOpen;
  const s = str.trim().toLowerCase();

  if (s.includes("مغلق") || s.includes("إجازة") || s.includes("اجازة") || s.includes("عطلة") || s.includes("closed") || s.includes("off")) {
    return { day: dayName, isWorking: false, openTime: "09:00", openPeriod: "ص", closeTime: "11:00", closePeriod: "م" };
  }

  if (s.includes("24/7") || s.includes("24 ساعة") || s.includes("24ساعة") || s.includes("مفتوح 24")) {
    return { day: dayName, isWorking: true, openTime: "12:00", openPeriod: "ص", closeTime: "11:59", closePeriod: "م" };
  }

  const parts = str.split(/[-–—|/|الى|إلى|حتى|حتي|to]+/i).map(p => p.trim()).filter(Boolean);

  if (parts.length >= 2) {
    const openParsed = parseExcelTimePart(parts[0], "ص");
    const closeParsed = parseExcelTimePart(parts[1], "م");
    return {
      day: dayName,
      isWorking: true,
      openTime: openParsed.time,
      openPeriod: openParsed.period,
      closeTime: closeParsed.time,
      closePeriod: closeParsed.period
    };
  } else if (parts.length === 1) {
    const timeParsed = parseExcelTimePart(parts[0], "ص");
    return {
      day: dayName,
      isWorking: true,
      openTime: timeParsed.time,
      openPeriod: timeParsed.period,
      closeTime: "11:00",
      closePeriod: "م"
    };
  }

  return defaultOpen;
}

export function resolveExcelDaysFromText(daysStr: string): string[] {
  const norm = daysStr.trim().toLowerCase();
  if (norm.includes("يوميا") || norm.includes("يومياً") || norm.includes("كل يوم") || norm.includes("جميع الايام") || norm.includes("جميع الأيام")) {
    return DAYS_OF_WEEK;
  }

  const rangeMatch = daysStr.split(/[-–—|الى|إلى|حتى|حتي|to]/).map(d => d.trim()).filter(Boolean);
  if (rangeMatch.length === 2) {
    const normalizeDay = (raw: string): string | null => {
      const s = raw.trim().toLowerCase();
      if (s.includes("احد") || s.includes("أحد") || s.includes("sun")) return "الأحد";
      if (s.includes("اتنين") || s.includes("إثنين") || s.includes("اثنين") || s.includes("mon")) return "الإثنين";
      if (s.includes("ثلاثاء") || s.includes("تلات") || s.includes("tue")) return "الثلاثاء";
      if (s.includes("اربعاء") || s.includes("أربعاء") || s.includes("wed")) return "الأربعاء";
      if (s.includes("خميس") || s.includes("thu")) return "الخميس";
      if (s.includes("جمعة") || s.includes("جمعه") || s.includes("fri")) return "الجمعة";
      if (s.includes("سبت") || s.includes("sat")) return "السبت";
      return null;
    };

    const startDay = normalizeDay(rangeMatch[0]);
    const endDay = normalizeDay(rangeMatch[1]);
    if (startDay && endDay) {
      const WEEK_ORDER = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
      const sIdx = WEEK_ORDER.indexOf(startDay);
      const eIdx = WEEK_ORDER.indexOf(endDay);
      if (sIdx !== -1 && eIdx !== -1) {
        const result: string[] = [];
        let curr = sIdx;
        while (curr !== eIdx) {
          result.push(WEEK_ORDER[curr]);
          curr = (curr + 1) % 7;
        }
        result.push(WEEK_ORDER[eIdx]);
        return result;
      }
    }
  }

  const matchedDays: string[] = [];
  DAYS_OF_WEEK.forEach(day => {
    if (daysStr.includes(day) || daysStr.includes(day.replace("أ", "ا").replace("إ", "ا"))) {
      matchedDays.push(day);
    }
  });

  return matchedDays.length > 0 ? matchedDays : DAYS_OF_WEEK;
}

export function parseExcelWorkingHours(row: any): string {
  const dayColumnNames: Record<string, string[]> = {
    "الأحد": ["مواعيد الأحد", "الأحد", "يوم الأحد", "Sunday"],
    "الإثنين": ["مواعيد الإثنين", "مواعيد الاثنين", "الإثنين", "الاثنين", "Monday"],
    "الثلاثاء": ["مواعيد الثلاثاء", "الثلاثاء", "Tuesday"],
    "الأربعاء": ["مواعيد الأربعاء", "مواعيد الاربعاء", "الأربعاء", "الاربعاء", "Wednesday"],
    "الخميس": ["مواعيد الخميس", "الخميس", "Thursday"],
    "الجمعة": ["مواعيد الجمعة", "مواعيد الجمعه", "الجمعة", "الجمعه", "Friday"],
    "السبت": ["مواعيد السبت", "السبت", "Saturday"]
  };

  let hasPerDayCols = false;
  for (const day of DAYS_OF_WEEK) {
    const colKeys = dayColumnNames[day];
    if (colKeys.some(k => row[k] !== undefined && row[k] !== null && row[k].toString().trim() !== "")) {
      hasPerDayCols = true;
      break;
    }
  }

  if (hasPerDayCols) {
    const schedule: ScheduleDay[] = DAYS_OF_WEEK.map(day => {
      const colKeys = dayColumnNames[day];
      let val = "";
      for (const k of colKeys) {
        if (row[k] !== undefined && row[k] !== null && row[k].toString().trim() !== "") {
          val = row[k].toString().trim();
          break;
        }
      }
      return parseExcelSingleDayTime(day, val);
    });
    return JSON.stringify({ type: "custom", schedule });
  }

  const rawWH = row["مواعيد العمل"]?.toString().trim() || "";
  if (!rawWH) {
    return JSON.stringify({ type: "24/7" });
  }

  const lowerWH = rawWH.toLowerCase();
  if (lowerWH === "24/7" || lowerWH === "مفتوح 24 ساعة" || lowerWH === "24 ساعة" || lowerWH === "24/7 🟢") {
    return JSON.stringify({ type: "24/7" });
  }

  const scheduleMap: Record<string, ScheduleDay> = {};
  DAYS_OF_WEEK.forEach(day => {
    scheduleMap[day] = {
      day,
      isWorking: true,
      openTime: "09:00",
      openPeriod: "ص",
      closeTime: "11:00",
      closePeriod: "م"
    };
  });

  const segments = rawWH.split(/[|\n\r;]/).map((s: string) => s.trim()).filter(Boolean);
  let parsedAnySegment = false;

  for (const seg of segments) {
    if (seg.includes(":")) {
      const colonIdx = seg.indexOf(":");
      const daysPart = seg.substring(0, colonIdx);
      const timePart = seg.substring(colonIdx + 1);

      const targetDays = resolveExcelDaysFromText(daysPart);
      if (targetDays.length > 0) {
        targetDays.forEach(day => {
          scheduleMap[day] = parseExcelSingleDayTime(day, timePart);
        });
        parsedAnySegment = true;
      }
    }
  }

  if (parsedAnySegment) {
    const schedule = DAYS_OF_WEEK.map(day => scheduleMap[day]);
    return JSON.stringify({ type: "custom", schedule });
  }

  const singleParsed = parseExcelSingleDayTime("يومي", rawWH);
  if (singleParsed.isWorking) {
    const schedule = DAYS_OF_WEEK.map(day => ({
      ...singleParsed,
      day
    }));
    return JSON.stringify({ type: "custom", schedule });
  }

  return rawWH;
}

export function areWorkingHoursEqual(wh1: any, wh2: any): boolean {
  const s1 = (wh1 || "").toString().trim();
  const s2 = (wh2 || "").toString().trim();
  if (!s1 && !s2) return true;
  if (!s1 || !s2) return false;
  if (s1 === s2) return true;

  let obj1: any = null;
  let obj2: any = null;
  try { obj1 = JSON.parse(s1); } catch { }
  try { obj2 = JSON.parse(s2); } catch { }

  if (obj1 && obj2 && typeof obj1 === "object" && typeof obj2 === "object") {
    if (obj1.type !== obj2.type) return false;
    if (obj1.type === "24/7") return true;
    if (obj1.type === "custom") {
      const sched1 = Array.isArray(obj1.schedule) ? obj1.schedule : [];
      const sched2 = Array.isArray(obj2.schedule) ? obj2.schedule : [];
      for (const day of DAYS_OF_WEEK) {
        const d1 = sched1.find((x: any) => x.day === day);
        const d2 = sched2.find((x: any) => x.day === day);
        if (!d1 && !d2) continue;
        if (!d1 || !d2) return false;
        if (Boolean(d1.isWorking) !== Boolean(d2.isWorking)) return false;
        if (d1.isWorking) {
          if ((d1.openTime || "").trim() !== (d2.openTime || "").trim()) return false;
          if ((d1.closeTime || "").trim() !== (d2.closeTime || "").trim()) return false;
          if ((d1.openPeriod || "").trim() !== (d2.openPeriod || "").trim()) return false;
          if ((d1.closePeriod || "").trim() !== (d2.closePeriod || "").trim()) return false;
        }
      }
      return true;
    }
  }

  return s1.toLowerCase().replace(/\s+/g, " ") === s2.toLowerCase().replace(/\s+/g, " ");
}

export function comparePlaceData(dbPlace: DBPlace, excelPlace: any): { isModified: boolean; changedFields: string[] } {
  const changedFields: string[] = [];

  const normStr = (val?: string | null): string => (val || "").toString().trim().replace(/\s+/g, " ");

  const normPhones = (phones?: string[] | null): string[] => {
    if (!phones || !Array.isArray(phones)) return [];
    return phones
      .map(p => (p || "").toString().replace(/[\s\-\(\)\+]/g, "").trim())
      .filter(Boolean)
      .sort();
  };

  const normArray = (arr?: string[] | null): string[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr
      .map(s => (s || "").toString().trim())
      .filter(Boolean)
      .sort();
  };

  // 1. Phone numbers
  const dbPhones = normPhones(dbPlace.phones);
  const excelPhones = normPhones(excelPlace.phones);
  if (dbPhones.join(",") !== excelPhones.join(",")) {
    changedFields.push("أرقام الهواتف");
  }

  // 2. Working hours
  if (!areWorkingHoursEqual(dbPlace.working_hours, excelPlace.working_hours)) {
    changedFields.push("مواعيد العمل");
  }

  // 3. Website
  const dbWebsite = normStr((dbPlace as any).website_url).toLowerCase().replace(/\/+$/, "");
  const excelWebsite = normStr(excelPlace.website_url).toLowerCase().replace(/\/+$/, "");
  if (dbWebsite !== excelWebsite) {
    changedFields.push("موقع الويب");
  }

  // 4. Images
  const dbImages = normArray(dbPlace.images);
  const excelImages = normArray(excelPlace.images);
  if (dbImages.join(",") !== excelImages.join(",")) {
    changedFields.push("الصور");
  }

  // 5. Menu Images
  const dbMenu = normArray(dbPlace.menu_images);
  const excelMenu = normArray(excelPlace.menu_images);
  if (dbMenu.join(",") !== excelMenu.join(",")) {
    changedFields.push("صور المنيو");
  }

  // 6. English Name
  if (normStr(dbPlace.name_en).toLowerCase() !== normStr(excelPlace.name_en).toLowerCase()) {
    changedFields.push("الاسم بالإنجليزية");
  }

  // 7. Full Address
  if (normStr(dbPlace.full_address) !== normStr(excelPlace.full_address)) {
    changedFields.push("العنوان");
  }

  // 8. Google Maps URL
  if (normStr(dbPlace.google_maps_url) !== normStr(excelPlace.google_maps_url)) {
    changedFields.push("رابط الخريطة");
  }

  // 9. Short description
  if (normStr(dbPlace.short_description) !== normStr(excelPlace.short_description)) {
    changedFields.push("الوصف المختصر");
  }

  // 10. Detailed description
  if (normStr(dbPlace.description) !== normStr(excelPlace.description)) {
    changedFields.push("الوصف التفصيلي");
  }

  // 11. Sub-categories
  const dbSubCats = normArray(dbPlace.sub_categories);
  const excelSubCats = normArray(excelPlace.sub_categories);
  if (dbSubCats.join(",") !== excelSubCats.join(",")) {
    changedFields.push("الأقسام الفرعية");
  }

  // 12. Coordinates
  const dbLat = dbPlace.latitude != null ? Number(Number(dbPlace.latitude).toFixed(5)) : null;
  const dbLng = dbPlace.longitude != null ? Number(Number(dbPlace.longitude).toFixed(5)) : null;
  const exLat = excelPlace.latitude != null ? Number(Number(excelPlace.latitude).toFixed(5)) : null;
  const exLng = excelPlace.longitude != null ? Number(Number(excelPlace.longitude).toFixed(5)) : null;
  if (dbLat !== exLat || dbLng !== exLng) {
    if (exLat !== null || exLng !== null) {
      changedFields.push("الإحداثيات");
    }
  }

  // 13. Features
  const dbFeats = normArray(dbPlace.features);
  const excelFeats = normArray(excelPlace.features);
  if (dbFeats.join(",") !== excelFeats.join(",")) {
    changedFields.push("المميزات والخدمات");
  }

  // 14. Services
  const dbServ = normArray(dbPlace.services);
  const excelServ = normArray(excelPlace.services);
  if (dbServ.join(",") !== excelServ.join(",")) {
    changedFields.push("الخدمات");
  }

  // 15. Place Type
  if (normStr(dbPlace.place_type) !== normStr(excelPlace.place_type)) {
    changedFields.push("نوع المكان");
  }

  // 16. Place Type Icon
  if (normStr(dbPlace.place_type_icon) !== normStr(excelPlace.place_type_icon)) {
    changedFields.push("أيقونة النوع");
  }

  return {
    isModified: changedFields.length > 0,
    changedFields
  };
}

// ─── Filter & Duplicates Functions ───

export function filterPlaces(
  places: DBPlace[],
  searchQuery: string,
  selectedCategory: string,
  selectedGovernorate: string
): DBPlace[] {
  const q = searchQuery.trim().toLowerCase();

  return places.filter(place => {
    // 1. Search Query filter (matches ID, name, name_en, city, full_address, or phones)
    if (q) {
      const matchId = (place.id || "").toLowerCase().includes(q);
      const matchName = (place.name || "").toLowerCase().includes(q);
      const matchNameEn = (place.name_en || "").toLowerCase().includes(q);
      const matchCity = (place.city || "").toLowerCase().includes(q);
      const matchGov = (place.governorate || "").toLowerCase().includes(q);
      const matchAddress = (place.full_address || "").toLowerCase().includes(q);
      const matchPhone = (place.phones || []).some(ph => ph.includes(q));

      if (!matchId && !matchName && !matchNameEn && !matchCity && !matchGov && !matchAddress && !matchPhone) {
        return false;
      }
    }

    // 2. Category Filter
    if (selectedCategory !== "all") {
      const matchMainCat = place.category === selectedCategory;
      const matchSubCat = (place.sub_categories || []).includes(selectedCategory);
      if (!matchMainCat && !matchSubCat) return false;
    }

    // 3. Governorate Filter
    if (selectedGovernorate !== "all") {
      if ((place.governorate || "") !== selectedGovernorate) return false;
    }

    return true;
  });
}

export function getCategoryCounts(places: DBPlace[]): Record<string, number> {
  const counts: Record<string, number> = { all: places.length };
  places.forEach(p => {
    if (p.category) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
  });
  return counts;
}

export function getGovernorateCounts(places: DBPlace[]): Record<string, number> {
  const counts: Record<string, number> = { all: places.length };
  places.forEach(p => {
    const gov = p.governorate || "غير محدد";
    counts[gov] = (counts[gov] || 0) + 1;
  });
  return counts;
}

export function findDbDuplicates(places: DBPlace[]): { originalId: string; duplicateId: string; place: DBPlace }[] {
  const seen = new Map<string, string>(); // key -> id of first seen
  const dups: { originalId: string; duplicateId: string; place: DBPlace }[] = [];
  places.forEach(p => {
    const key = `${p.name.trim().toLowerCase()}_${p.category.trim().toLowerCase()}_${(p.governorate || "").trim().toLowerCase()}_${(p.city || "").trim().toLowerCase()}`;
    if (seen.has(key)) {
      const originalId = seen.get(key)!;
      dups.push({ originalId, duplicateId: p.id, place: p });
    } else {
      seen.set(key, p.id);
    }
  });
  return dups;
}
