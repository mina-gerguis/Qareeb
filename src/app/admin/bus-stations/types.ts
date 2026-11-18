export interface BusCompany {
  name: string;
  phone: string;
  type: string;
  logo?: string;
}

export interface BusStation {
  id?: string;
  name: string;
  location: string;
  governorate: string;
  companies: BusCompany[];
  destinations: string[];
  description?: string;
  map_url?: string;
  created_at?: string;
}

export interface BusStationFormData {
  name: string;
  location: string;
  governorate: string;
  destinationsText: string;
  description: string;
  map_url: string;
}

export interface VisibleColumns {
  name: boolean;
  governorate: boolean;
  location: boolean;
  companiesCount: boolean;
  destinations: boolean;
  description: boolean;
}

export interface ActionMenuState {
  station: BusStation;
  stationKey: string;
  top: number;
  left: number;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}
