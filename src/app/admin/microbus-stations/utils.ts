import { AdminMicrobusStation, AdminMicrobusRoute } from "./types";
import { DEFAULT_MICROBUS_STATIONS, createEmptyRoute } from "./constants";

const LOCAL_STORAGE_KEY = "local_microbus_stations";

/**
 * Checks if a given string is a valid UUID
 */
export function isUUID(str: unknown): boolean {
  if (typeof str !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Retrieves cached local microbus stations from localStorage with fallback to default stations
 */
export function getLocalMicrobusStations(): AdminMicrobusStation[] {
  if (typeof window === "undefined") return DEFAULT_MICROBUS_STATIONS;
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      return DEFAULT_MICROBUS_STATIONS;
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_MICROBUS_STATIONS));
  return DEFAULT_MICROBUS_STATIONS;
}

/**
 * Persists microbus stations array to localStorage
 */
export function saveLocalMicrobusStations(data: AdminMicrobusStation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Stable key for selection, action popovers and keys
 */
export function getStationKey(station: AdminMicrobusStation): string {
  return station.id || station.name.trim();
}

/**
 * Governorate badge color
 */
export function getGovernorateColor(gov?: string): string {
  switch (gov) {
    case "القاهرة":
      return "#3b82f6";
    case "الجيزة":
      return "#10b981";
    case "الإسكندرية":
      return "#06b6d4";
    case "القليوبية":
      return "#f59e0b";
    case "الشرقية":
    case "الغربية":
    case "الدقهلية":
    case "المنوفية":
    case "البحيرة":
    case "كفر الشيخ":
      return "#8b5cf6";
    case "السويس":
    case "الإسماعيلية":
    case "بورسعيد":
      return "#ec4899";
    case "مطروح":
    case "البحر الأحمر":
    case "جنوب سيناء":
    case "شمال سيناء":
      return "#f97316";
    default:
      return "#6366f1";
  }
}

/**
 * Sanitizes and normalizes an array of routes for forms
 */
export function normalizeRoutes(routes: unknown): AdminMicrobusRoute[] {
  if (!Array.isArray(routes) || routes.length === 0) {
    return [createEmptyRoute()];
  }

  return routes.map((r: any) => ({
    destination: r.destination || "",
    fare: r.fare || "",
    vehicleType: r.vehicleType || "ميكروباص",
    description: r.description || r.notes || "",
    via: r.via || "",
    type: r.type || "official",
    lastUpdated: r.lastUpdated || new Date().toISOString().split("T")[0],
    duration: r.duration || ""
  }));
}

/**
 * Validates routes before form submission
 * Returns error string if invalid, null otherwise
 */
export function validateRoutes(routes: AdminMicrobusRoute[]): string | null {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    if (!route.destination.trim()) {
      return `يرجى تحديد وجهة الخط رقم ${i + 1}`;
    }
    if (!route.fare.trim()) {
      return `يرجى تحديد تعريفة الأجرة للخط رقم ${i + 1}`;
    }
  }
  return null;
}

/**
 * Filters stations based on search query matching name, location, governorate, route destinations, or via
 */
export function filterMicrobusStations(
  stations: AdminMicrobusStation[],
  query: string,
  govFilter: string = "all"
): AdminMicrobusStation[] {
  let list = stations;

  if (govFilter && govFilter !== "all") {
    list = list.filter((s) => s.governorate === govFilter);
  }

  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return list;

  return list.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(trimmed);
    const locationMatch = item.location?.toLowerCase().includes(trimmed);
    const govMatch = item.governorate?.toLowerCase().includes(trimmed);
    const routeMatch =
      Array.isArray(item.routes) &&
      item.routes.some(
        (r) =>
          r.destination?.toLowerCase().includes(trimmed) ||
          r.via?.toLowerCase().includes(trimmed) ||
          r.fare?.toLowerCase().includes(trimmed)
      );
    return Boolean(nameMatch || locationMatch || govMatch || routeMatch);
  });
}
