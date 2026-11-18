import { MonorailStation, MonorailPrice } from "./types";
import { DEFAULT_MONORAIL_STATIONS, DEFAULT_MONORAIL_PRICES } from "./constants";
import { MONORAIL_STATION_DETAILS } from "@/app/monorail/constants";

export const getLineLabel = (line: string): string => {
  switch (line) {
    case "east":
      return "شرق النيل (العاصمة)";
    case "west":
      return "غرب النيل (أكتوبر)";
    default:
      return line;
  }
};

export const getLineColor = (line: string): string => {
  switch (line) {
    case "east":
      return "#3b82f6";
    case "west":
      return "#10b981";
    default:
      return "#6366f1";
  }
};

export const getStationKey = (s: Partial<MonorailStation>): string => {
  return s.id ? String(s.id) : `${s.line_type}_${s.name}_${s.station_order}`;
};

export const getNextStationOrder = (line: string, stationsList: MonorailStation[]): number => {
  const lineStations = stationsList.filter(s => s.line_type === line);
  if (lineStations.length === 0) return 1;
  const maxOrder = Math.max(...lineStations.map(s => Number(s.station_order) || 0), 0);
  return maxOrder + 1;
};

export const enrichStationLandmarks = (station: MonorailStation): MonorailStation => {
  const updated = { ...station };
  const staticInfo = MONORAIL_STATION_DETAILS[updated.name];
  
  if (!updated.landmarks || !Array.isArray(updated.landmarks) || updated.landmarks.length === 0) {
    if (staticInfo?.landmarks) {
      updated.landmarks = staticInfo.landmarks;
    } else {
      updated.landmarks = [];
    }
  }

  if (!updated.status) {
    updated.status = staticInfo?.status || "تحت الإنشاء";
  }

  return updated;
};

export const getLocalStations = (): MonorailStation[] => {
  if (typeof window === "undefined") return DEFAULT_MONORAIL_STATIONS;
  const local = localStorage.getItem("local_monorail");
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        return parsed.map((item: MonorailStation) => enrichStationLandmarks(item));
      }
      return parsed;
    } catch {
      return DEFAULT_MONORAIL_STATIONS;
    }
  }
  localStorage.setItem("local_monorail", JSON.stringify(DEFAULT_MONORAIL_STATIONS));
  return DEFAULT_MONORAIL_STATIONS;
};

export const saveLocalStations = (data: MonorailStation[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("local_monorail", JSON.stringify(data));
  }
};

export const getLocalPrices = (): MonorailPrice[] => {
  if (typeof window === "undefined") return DEFAULT_MONORAIL_PRICES;
  const local = localStorage.getItem("local_monorail_prices");
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return DEFAULT_MONORAIL_PRICES;
    }
  }
  localStorage.setItem("local_monorail_prices", JSON.stringify(DEFAULT_MONORAIL_PRICES));
  return DEFAULT_MONORAIL_PRICES;
};

export const saveLocalPrices = (data: MonorailPrice[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("local_monorail_prices", JSON.stringify(data));
  }
};
