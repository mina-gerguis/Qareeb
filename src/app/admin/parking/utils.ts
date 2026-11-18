import { ParkingSpot, ParkingFormData } from "./types";
import { DEFAULT_PARKING_SPOTS } from "./constants";

const LOCAL_STORAGE_KEY = "local_parking_spots";

/**
 * Checks if a given string is a valid UUID
 */
export function isUUID(str: unknown): boolean {
  if (typeof str !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Retrieves cached local parking spots from localStorage with fallback to default spots
 */
export function getLocalParkingSpots(): ParkingSpot[] {
  if (typeof window === "undefined") return DEFAULT_PARKING_SPOTS;
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      return DEFAULT_PARKING_SPOTS;
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PARKING_SPOTS));
  return DEFAULT_PARKING_SPOTS;
}

/**
 * Persists parking spots array to localStorage
 */
export function saveLocalParkingSpots(data: ParkingSpot[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Stable key for selection, action popovers and keys
 */
export function getParkingKey(spot: ParkingSpot): string {
  return spot.id || spot.name.trim();
}

/**
 * Area badge color
 */
export function getAreaColor(area?: string): string {
  switch (area) {
    case "وسط البلد":
    case "التحرير":
      return "#3b82f6";
    case "مصر الجديدة":
    case "روكسي":
      return "#10b981";
    case "مدينة نصر":
      return "#f59e0b";
    case "الدقي":
    case "المهندسين":
      return "#8b5cf6";
    case "المعادي":
      return "#ec4899";
    case "التجمع الخامس":
    case "القاهرة الجديدة":
      return "#06b6d4";
    case "العتبة":
    case "شبرا":
      return "#f97316";
    case "الجيزة":
    case "الزمالك":
      return "#14b8a6";
    default:
      return "#6366f1";
  }
}

/**
 * Map Supabase DB record to JS ParkingSpot object
 */
export function mapDBToJs(dbItem: any): ParkingSpot {
  let parsedFeatures: string[] = [];
  if (Array.isArray(dbItem.features)) {
    parsedFeatures = dbItem.features;
  } else if (typeof dbItem.features === "string") {
    try {
      const parsed = JSON.parse(dbItem.features);
      parsedFeatures = Array.isArray(parsed) ? parsed : dbItem.features.split(",").map((s: string) => s.trim());
    } catch {
      parsedFeatures = dbItem.features.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
  }

  return {
    id: dbItem.id,
    name: dbItem.name || "",
    area: dbItem.area || "",
    address: dbItem.address || "",
    nearestMetro: dbItem.nearest_metro || dbItem.nearestMetro || "",
    hourlyRate: dbItem.hourly_rate ?? dbItem.hourlyRate ?? 0,
    maxDailyRate:
      dbItem.max_daily_rate !== null && dbItem.max_daily_rate !== undefined
        ? dbItem.max_daily_rate
        : dbItem.maxDailyRate !== undefined
        ? dbItem.maxDailyRate
        : "",
    capacity: dbItem.capacity ?? 0,
    type: dbItem.type || "مغطى ومتعدد الطوابق 🏢",
    hours: dbItem.hours || "24 ساعة طوال الأسبوع",
    features: parsedFeatures,
    mapLocationLink: dbItem.map_location_link || dbItem.mapLocationLink || "",
    created_at: dbItem.created_at
  };
}

/**
 * Map JS object to Supabase DB payload
 */
export function mapJsToDB(jsItem: ParkingSpot | ParkingFormData): any {
  const featuresArray = Array.isArray(jsItem.features)
    ? jsItem.features
    : typeof jsItem.features === "string"
    ? jsItem.features.split(/[\n،,]+/).map((f) => f.trim()).filter(Boolean)
    : [];

  const maxRate =
    jsItem.maxDailyRate !== "" && jsItem.maxDailyRate !== null && jsItem.maxDailyRate !== undefined
      ? Number(jsItem.maxDailyRate)
      : null;

  return {
    name: jsItem.name.trim(),
    area: jsItem.area.trim(),
    address: jsItem.address.trim(),
    nearest_metro: jsItem.nearestMetro?.trim() || "",
    hourly_rate: Number(jsItem.hourlyRate ?? 0),
    max_daily_rate: maxRate,
    capacity: Number(jsItem.capacity ?? 0),
    type: jsItem.type,
    hours: jsItem.hours.trim() || "24 ساعة طوال الأسبوع",
    features: featuresArray,
    map_location_link: jsItem.mapLocationLink?.trim() || ""
  };
}

/**
 * Filters parking spots based on query (name, area, address, metro, features) and optional area filter
 */
export function filterParkingSpots(
  spots: ParkingSpot[],
  query: string,
  areaFilter: string = "all"
): ParkingSpot[] {
  let list = spots;

  if (areaFilter && areaFilter !== "all") {
    list = list.filter((s) => s.area === areaFilter);
  }

  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return list;

  return list.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(trimmed);
    const areaMatch = item.area?.toLowerCase().includes(trimmed);
    const addressMatch = item.address?.toLowerCase().includes(trimmed);
    const metroMatch = item.nearestMetro?.toLowerCase().includes(trimmed);
    const typeMatch = item.type?.toLowerCase().includes(trimmed);
    const featureMatch =
      Array.isArray(item.features) &&
      item.features.some((f) => f.toLowerCase().includes(trimmed));
    return Boolean(nameMatch || areaMatch || addressMatch || metroMatch || typeMatch || featureMatch);
  });
}
