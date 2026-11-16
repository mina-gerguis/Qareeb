export interface MetroStation {
  id?: string;
  name: string;
  name_en?: string;
  line_type: string;
  station_order: number;
  landmarks?: string[];
  status?: string;
  is_interchange?: boolean;
  created_at?: string;
}

export interface MetroPrice {
  id?: string | number;
  tier_name: string;
  max_stations: number;
  price: number;
  created_at?: string;
}

export interface MetroStationFormData {
  name: string;
  line_type: string;
  station_order: number;
  landmarks: string;
  status: string;
}

export interface VisibleColumns {
  order: boolean;
  name: boolean;
  line: boolean;
  landmarks: boolean;
  status: boolean;
}

export interface ActionMenuState {
  key: string;
  station: MetroStation;
  top: number;
  left: number;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}

export interface MetroLineOption {
  id: string;
  label: string;
  color: string;
}

