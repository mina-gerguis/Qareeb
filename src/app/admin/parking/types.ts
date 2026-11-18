export interface ParkingSpot {
  id?: string;
  name: string;
  area: string;
  address: string;
  nearestMetro?: string;
  hourlyRate: number;
  maxDailyRate?: number | string | null;
  capacity: number;
  type: string;
  hours: string;
  features: string[];
  mapLocationLink?: string;
  created_at?: string;
}

export interface ParkingFormData {
  name: string;
  area: string;
  address: string;
  nearestMetro: string;
  hourlyRate: number | string;
  maxDailyRate: number | string;
  capacity: number | string;
  type: string;
  hours: string;
  features: string;
  mapLocationLink: string;
}

export interface VisibleColumns {
  name: boolean;
  area: boolean;
  address: boolean;
  nearestMetro: boolean;
  rates: boolean;
  capacity: boolean;
  type: boolean;
  hours: boolean;
  mapLocation: boolean;
}

export interface ActionMenuState {
  spot: ParkingSpot;
  spotKey: string;
  top: number;
  left: number;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}
