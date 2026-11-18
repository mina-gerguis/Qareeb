import { HighwayItem, RoadNewsItem, HighwaySpeedLimits, RoadNewsCategory, RoadNewsSeverity } from "@/data/roads_info";

export type { HighwayItem, RoadNewsItem, HighwaySpeedLimits, RoadNewsCategory, RoadNewsSeverity };

export interface RoadFormData {
  name: string;
  code: string;
  type: string;
  lengthKm: number | string;
  startPoint: string;
  endPoint: string;
  governorates: string;
  speed_private_car: number | string;
  speed_minibus: number | string;
  speed_microbus: number | string;
  speed_pickup: number | string;
  speed_bus: number | string;
  speed_truck: number | string;
  lanesCount: number | string;
  emergencyPhone: string;
  lat: number | string;
  lng: number | string;
  status: string;
  description: string;
  radarInfo: string;
  mapUrl: string;
}

export interface NewsFormData {
  title: string;
  summary: string;
  category: RoadNewsCategory;
  severity: RoadNewsSeverity;
  roadName: string;
  source: string;
  isActive: boolean;
}

export interface VisibleColumnsRoads {
  name: boolean;
  type: boolean;
  length: boolean;
  endpoints: boolean;
  speeds: boolean;
  lanes: boolean;
  status: boolean;
  emergency: boolean;
  mapUrl: boolean;
}

export interface VisibleColumnsNews {
  title: boolean;
  category: boolean;
  severity: boolean;
  roadName: boolean;
  source: boolean;
  date: boolean;
  status: boolean;
}

export interface ActionMenuStateRoad {
  road: HighwayItem;
  roadKey: string;
  top: number;
  left: number;
}

export interface ActionMenuStateNews {
  news: RoadNewsItem;
  newsKey: string;
  top: number;
  left: number;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}
