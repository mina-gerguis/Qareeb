export interface RailwayStop {
  id?: string;
  name: string;
  status: "تعمل" | "تشغيل فعلي" | "تحت الإنشاء";
  station_order?: number;
}

export interface TrainClass {
  name: string;
  price: string;
  features: string;
}

export interface RailwayRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  duration: string;
  stops: RailwayStop[];
  classes?: TrainClass[];
  tips?: string;
  color?: string;
}

export interface RailwayLineFormData {
  id: string;
  name: string;
  from: string;
  to: string;
  duration: string;
  tips: string;
}

export interface RailwayStationFormData {
  name: string;
  status: "تعمل" | "تشغيل فعلي" | "تحت الإنشاء";
}

export interface VisibleLineColumns {
  id: boolean;
  name: boolean;
  from: boolean;
  to: boolean;
  duration: boolean;
  stopsCount: boolean;
}

export interface VisibleStationColumns {
  order: boolean;
  name: boolean;
  status: boolean;
}

export interface ActionMenuState {
  key: string;
  type: "line" | "station";
  item: any;
  top: number;
  left: number;
}

export interface ColumnsMenuPosition {
  top: number;
  left: number;
}
