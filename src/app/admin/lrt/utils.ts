import { LrtStation, LrtPrice } from "./types";
import { DEFAULT_LRT_STATIONS, DEFAULT_LRT_PRICES } from "./constants";
import { STATION_DETAILS } from "@/app/lrt/constants";

export const getLineLabel = (line: string): string => {
  switch (line) {
    case "trunk":
      return "الجذع الرئيسي (عدلي منصور - بدر)";
    case "capital":
      return "تفريعة العاصمة (الفنون والثقافة)";
    case "ramadan":
      return "تفريعة العاشر (مدينة المعرفة)";
    default:
      return line;
  }
};

export const getLineColor = (line: string): string => {
  switch (line) {
    case "trunk":
      return "#06b6d4";
    case "capital":
      return "#a855f7";
    case "ramadan":
      return "#10b981";
    default:
      return "#6366f1";
  }
};

export const getStationKey = (s: Partial<LrtStation>): string => {
  return s.id ? String(s.id) : `${s.line_type}_${s.name}_${s.station_order}`;
};

export const getNextStationOrder = (line: string, stationsList: LrtStation[]): number => {
  const lineStations = stationsList.filter(s => s.line_type === line);
  if (lineStations.length === 0) return 1;
  const maxOrder = Math.max(...lineStations.map(s => Number(s.station_order) || 0), 0);
  return maxOrder + 1;
};

export const enrichStationLandmarks = (station: LrtStation): LrtStation => {
  const updated = { ...station };
  const staticInfo = STATION_DETAILS[updated.name];

  if (!updated.landmarks || !Array.isArray(updated.landmarks) || updated.landmarks.length === 0) {
    if (staticInfo?.landmarks) {
      updated.landmarks = staticInfo.landmarks;
    } else {
      updated.landmarks = [];
    }
  }

  if (!updated.status) {
    updated.status = staticInfo?.status || "تشغيل فعلي";
  }

  return updated;
};

export const getLocalStations = (): LrtStation[] => {
  if (typeof window === "undefined") return DEFAULT_LRT_STATIONS;
  const local = localStorage.getItem("local_lrt");
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        return parsed.map((item: LrtStation) => enrichStationLandmarks(item));
      }
      return parsed;
    } catch {
      return DEFAULT_LRT_STATIONS;
    }
  }
  localStorage.setItem("local_lrt", JSON.stringify(DEFAULT_LRT_STATIONS));
  return DEFAULT_LRT_STATIONS;
};

export const saveLocalStations = (data: LrtStation[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("local_lrt", JSON.stringify(data));
  }
};

export const getLocalPrices = (): LrtPrice[] => {
  if (typeof window === "undefined") return DEFAULT_LRT_PRICES;
  const local = localStorage.getItem("local_lrt_prices");
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return DEFAULT_LRT_PRICES;
    }
  }
  localStorage.setItem("local_lrt_prices", JSON.stringify(DEFAULT_LRT_PRICES));
  return DEFAULT_LRT_PRICES;
};

export const saveLocalPrices = (data: LrtPrice[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("local_lrt_prices", JSON.stringify(data));
  }
};
