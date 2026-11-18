export interface MonorailStation {
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

export interface MonorailPrice {
  id?: string | number;
  tier_name: string;
  max_stations: number;
  price: number;
  discount_price?: number;
  created_at?: string;
}

export interface MonorailStationFormData {
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
  station: MonorailStation;
  top: number;
  left: number;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}

export interface MonorailLineOption {
  id: string;
  label: string;
  color: string;
}
