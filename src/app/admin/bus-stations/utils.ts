import { BusStation } from "./types";
import { DEFAULT_BUS_STATIONS } from "./constants";

const LOCAL_STORAGE_KEY = "local_bus_stations";

/**
 * Checks if a given string is a valid UUID
 */
export function isUUID(str: unknown): boolean {
  if (typeof str !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Retrieves cached local bus stations from localStorage with fallback to default stations
 */
export function getLocalBusStations(): BusStation[] {
  if (typeof window === "undefined") return DEFAULT_BUS_STATIONS;
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      return DEFAULT_BUS_STATIONS;
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_BUS_STATIONS));
  return DEFAULT_BUS_STATIONS;
}

/**
 * Persists bus stations array to localStorage
 */
export function saveLocalBusStations(data: BusStation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Stable key for selection, action popovers and keys
 */
export function getStationKey(station: BusStation): string {
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
    case "مطروح":
      return "#f59e0b";
    case "البحر الأحمر":
      return "#ef4444";
    case "جنوب سيناء":
    case "شمال سيناء":
      return "#8b5cf6";
    default:
      return "#6366f1";
  }
}

/**
 * Filters bus stations based on query (name, location, governorate, destinations, description) and optional governorate filter
 */
export function filterBusStations(
  stations: BusStation[],
  query: string,
  govFilter: string = "all"
): BusStation[] {
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
    const descMatch = item.description?.toLowerCase().includes(trimmed);
    const destinationMatch =
      Array.isArray(item.destinations) &&
      item.destinations.some((d) => d.toLowerCase().includes(trimmed));
    const companyMatch =
      Array.isArray(item.companies) &&
      item.companies.some(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.phone.toLowerCase().includes(trimmed) ||
          c.type.toLowerCase().includes(trimmed)
      );

    return Boolean(
      nameMatch || locationMatch || govMatch || descMatch || destinationMatch || companyMatch
    );
  });
}
