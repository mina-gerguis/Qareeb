import { MetroStation, MetroPrice } from "./types";
import { DEFAULT_METRO_STATIONS, DEFAULT_METRO_PRICES } from "./constants";
import { METRO_STATION_LANDMARKS } from "@/app/metro/constants";

export const getLineLabel = (line: string): string => {
  switch (line) {
    case "line1": return "الخط الأول";
    case "line2": return "الخط الثاني";
    case "line3": return "الخط الثالث (الجذع)";
    case "line3_branch_a": return " الثالث (روض الفرج)";
    case "line3_branch_b": return " الثالث (الجامعة)";
    case "line4": return "الخط الرابع (تحت الإنشاء)";
    case "line5": return "الخط الخامس (تحت الإنشاء)";
    case "line6": return "الخط السادس (تحت الإنشاء)";
    default: return line;
  }
};

export const getLineColor = (line: string): string => {
  switch (line) {
    case "line1": return "#a70000ff";
    case "line2": return "#0044b1ff";
    case "line3":
    case "line3_branch_a":
    case "line3_branch_b": return "#007950ff";
    case "line4": return "#af6f00ff";
    case "line5": return "#8b5cf6";
    case "line6": return "#ec4899";
    default: return "#6366f1";
  }
};

export const getStationKey = (s: Partial<MetroStation>): string => {
  return s.id ? String(s.id) : `${s.line_type}_${s.name}_${s.station_order}`;
};

export const getNextStationOrder = (line: string, stationsList: MetroStation[]): number => {
  const lineStations = stationsList.filter(s => s.line_type === line);
  if (lineStations.length === 0) return 1;
  const maxOrder = Math.max(...lineStations.map(s => Number(s.station_order) || 0), 0);
  return maxOrder + 1;
};

export const enrichStationLandmarks = (station: MetroStation): MetroStation => {
  const updated = { ...station };
  updated.status = station.status || "يعمل";
  if (!updated.landmarks || !Array.isArray(updated.landmarks) || updated.landmarks.length === 0) {
    updated.landmarks = METRO_STATION_LANDMARKS[updated.name] || [];
  }
  return updated;
};

export const getLocalStations = (): MetroStation[] => {
  if (typeof window === "undefined") return DEFAULT_METRO_STATIONS;
  const local = localStorage.getItem("local_metro_stations");
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        return parsed.map((item: MetroStation) => enrichStationLandmarks(item));
      }
      return parsed;
    } catch {
      return DEFAULT_METRO_STATIONS;
    }
  }
  localStorage.setItem("local_metro_stations", JSON.stringify(DEFAULT_METRO_STATIONS));
  return DEFAULT_METRO_STATIONS;
};

export const saveLocalStations = (data: MetroStation[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("local_metro_stations", JSON.stringify(data));
  }
};

export const getLocalPrices = (): MetroPrice[] => {
  if (typeof window === "undefined") return DEFAULT_METRO_PRICES;
  const local = localStorage.getItem("local_metro_prices");
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return DEFAULT_METRO_PRICES;
    }
  }
  localStorage.setItem("local_metro_prices", JSON.stringify(DEFAULT_METRO_PRICES));
  return DEFAULT_METRO_PRICES;
};

export const saveLocalPrices = (data: MetroPrice[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("local_metro_prices", JSON.stringify(data));
  }
};

