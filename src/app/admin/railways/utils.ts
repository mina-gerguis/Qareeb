import { RailwayRoute } from "./types";
import { DEFAULT_RAILWAY_ROUTES } from "./constants";
import { ROUTE_COLORS } from "@/app/railways/constants";

export const getRouteColor = (routeId: string): string => {
  if (ROUTE_COLORS[routeId]) {
    return ROUTE_COLORS[routeId];
  }
  const fallbackColors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4"];
  const charCode = routeId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return fallbackColors[charCode % fallbackColors.length];
};

export const getLocalRoutes = (): RailwayRoute[] => {
  if (typeof window === "undefined") return DEFAULT_RAILWAY_ROUTES;
  const local = localStorage.getItem("local_railways_routes");
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        return parsed.map((route: any) => {
          if (Array.isArray(route.stops)) {
            route.stops = route.stops.map((stop: any, idx: number) => {
              if (typeof stop === "string") {
                return { name: stop, status: "تشغيل فعلي" as const, station_order: idx + 1 };
              }
              return {
                ...stop,
                status: stop.status === "تحت الإنشاء" ? ("تحت الإنشاء" as const) : ("تشغيل فعلي" as const),
                station_order: stop.station_order || idx + 1,
              };
            });
          } else {
            route.stops = [];
          }
          return route;
        });
      }
      return DEFAULT_RAILWAY_ROUTES;
    } catch {
      return DEFAULT_RAILWAY_ROUTES;
    }
  }
  localStorage.setItem("local_railways_routes", JSON.stringify(DEFAULT_RAILWAY_ROUTES));
  return DEFAULT_RAILWAY_ROUTES;
};

export const saveLocalRoutes = (data: RailwayRoute[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("local_railways_routes", JSON.stringify(data));
  }
};
