import { Airport } from "./types";

export function isUUID(str: any): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str));
}

export function isInternationalAirport(airport: Airport): boolean {
  const t = (airport.type || "").toLowerCase();
  const te = (airport.type_en || "").toLowerCase();
  return t.includes("دولي") || te.includes("int");
}

export function parseCommaList(val: string | string[] | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(",").map((s) => s.trim()).filter(Boolean);
}

export function filterAirports(
  airports: Airport[],
  query: string,
  typeFilter: string
): Airport[] {
  const q = query.trim().toLowerCase();

  return airports.filter((airport) => {
    // 1. Type Filter
    if (typeFilter === "international") {
      if (!isInternationalAirport(airport)) return false;
    } else if (typeFilter === "domestic") {
      if (isInternationalAirport(airport)) return false;
    }

    // 2. Query Search
    if (!q) return true;

    const nameAr = (airport.name_ar || (airport as any).name || "").toLowerCase();
    const nameEn = (airport.name_en || "").toLowerCase();
    const iata = (airport.iata_code || (airport as any).code || "").toLowerCase();
    const icao = (airport.icao_code || "").toLowerCase();
    const city = (airport.city_ar || (airport as any).city || "").toLowerCase();
    const gov = (airport.governorate_ar || (airport as any).governorate || "").toLowerCase();
    const type = (airport.type || "").toLowerCase();
    const address = (airport.address || "").toLowerCase();

    return (
      nameAr.includes(q) ||
      nameEn.includes(q) ||
      iata.includes(q) ||
      icao.includes(q) ||
      city.includes(q) ||
      gov.includes(q) ||
      type.includes(q) ||
      address.includes(q)
    );
  });
}
