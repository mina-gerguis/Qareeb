export interface PortItem {
  id?: string | number;
  name: string;
  governorate: string;
  sea: string;
  type: string;
  capacity: string;
  description: string;
  berths_count?: string;
  connections?: string[] | string;
  operator?: string;
  status?: string;
  map_url: string;
}

export interface PortFormData {
  name: string;
  governorate: string;
  sea: string;
  type: string;
  capacity: string;
  description: string;
  berths_count: string;
  connections: string;
  operator: string;
  status: string;
  map_url: string;
}

export interface VisibleColumns {
  name: boolean;
  governorate: boolean;
  sea: boolean;
  type: boolean;
  capacity: boolean;
  operator: boolean;
  status: boolean;
  mapUrl: boolean;
}

export interface ActionMenuState {
  item: PortItem;
  key: string;
  top: number;
  left: number;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}
