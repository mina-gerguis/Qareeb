import { Airport } from "@/data/airports";

export type { Airport };

export interface AirportFormData {
  name: string;
  name_en: string;
  name_ar: string;
  code: string;
  iata_code: string;
  icao_code: string;
  type: string;
  type_en: string;
  status: string;
  governorate_ar: string;
  governorate_en: string;
  city: string;
  city_ar: string;
  city_en: string;
  area_ar: string;
  address: string;
  latitude: number | string;
  longitude: number | string;
  short_description: string;
  description: string;
  terminals_count: string;
  capacity: string;
  runways_count: string;
  runways_length: string;
  terminals: string;
  domestic_flights: string;
  international_flights: string;
  airlines: string;
  destinations: string;
  connections: string;
  nearby_landmarks: string;
  transportation: string;
  services: string;
  parking: string;
  official_website: string;
  phone: string;
  map_url: string;
  keywords_ar: string;
  keywords_en: string;
}

export interface VisibleColumns {
  name: boolean;
  code: boolean;
  city: boolean;
  type: boolean;
  phone: boolean;
  terminals: boolean;
  airlines: boolean;
  mapUrl: boolean;
}

export interface ActionMenuState {
  item: Airport;
  key: string;
  top: number;
  left: number;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}
