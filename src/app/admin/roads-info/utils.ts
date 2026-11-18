import { HighwayItem, RoadNewsItem } from "./types";

/**
 * Checks if a given string is a valid UUID
 */
export function isUUID(str: unknown): boolean {
  if (typeof str !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Road Type Color Badge
 */
export function getRoadTypeColor(type: string): string {
  switch (type) {
    case "حر":
      return "#3b82f6";
    case "صحراوي":
      return "#f59e0b";
    case "ساحلي":
      return "#06b6d4";
    case "زراعي":
      return "#10b981";
    case "دائري":
      return "#8b5cf6";
    case "محور":
      return "#ec4899";
    default:
      return "#6366f1";
  }
}

/**
 * Road Status Badge
 */
export function getRoadStatusBadge(status: string): { label: string; color: string; bg: string } {
  switch (status) {
    case "open":
      return { label: "مفتوح وسيولة", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" };
    case "maintenance":
      return { label: "أعمال صيانة", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" };
    case "fog_warning":
      return { label: "تحذير شبورة", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.12)" };
    case "detour":
      return { label: "تحويلة مرورية", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.12)" };
    default:
      return { label: "متاح", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" };
  }
}

/**
 * News Severity Badge
 */
export function getNewsSeverityBadge(sev: string): { label: string; color: string; bg: string } {
  switch (sev) {
    case "critical":
      return { label: "عاجل وهام", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" };
    case "warning":
      return { label: "تحذير متوسط", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" };
    case "info":
    default:
      return { label: "تنبيه عادي", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" };
  }
}

/**
 * News Category Label
 */
export function getNewsCategoryLabel(cat: string): string {
  switch (cat) {
    case "weather_fog":
      return "شبورة وطقس 🌫️";
    case "maintenance":
      return "أعمال صيانة 🚧";
    case "detour":
      return "تحويلة 🔄";
    case "traffic":
      return "كثافات مرورية 🚗";
    case "radar":
      return "رادار 📷";
    case "general":
    default:
      return "عام 📢";
  }
}

/**
 * Filter Highways
 */
export function filterRoads(
  roads: HighwayItem[],
  query: string,
  typeFilter: string = "all"
): HighwayItem[] {
  let list = roads;

  if (typeFilter && typeFilter !== "all") {
    list = list.filter((r) => r.type === typeFilter);
  }

  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return list;

  return list.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(trimmed);
    const codeMatch = item.code?.toLowerCase().includes(trimmed);
    const startMatch = item.startPoint?.toLowerCase().includes(trimmed);
    const endMatch = item.endPoint?.toLowerCase().includes(trimmed);
    const govMatch =
      Array.isArray(item.governorates) &&
      item.governorates.some((g) => g.toLowerCase().includes(trimmed));
    return Boolean(nameMatch || codeMatch || startMatch || endMatch || govMatch);
  });
}

/**
 * Filter News
 */
export function filterNews(
  news: RoadNewsItem[],
  query: string,
  catFilter: string = "all"
): RoadNewsItem[] {
  let list = news;

  if (catFilter && catFilter !== "all") {
    list = list.filter((n) => n.category === catFilter || n.severity === catFilter);
  }

  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return list;

  return list.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(trimmed);
    const summaryMatch = item.summary?.toLowerCase().includes(trimmed);
    const roadMatch = item.roadName?.toLowerCase().includes(trimmed);
    const sourceMatch = item.source?.toLowerCase().includes(trimmed);
    return Boolean(titleMatch || summaryMatch || roadMatch || sourceMatch);
  });
}
