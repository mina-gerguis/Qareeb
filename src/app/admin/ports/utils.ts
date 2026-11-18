import { PortItem } from "./types";

export function isUUID(str: any): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str));
}

export function isMedSea(sea: string = ""): boolean {
  const s = sea.toLowerCase();
  return s.includes("متوسط") || s.includes("mediterranean");
}

export function isRedSea(sea: string = ""): boolean {
  const s = sea.toLowerCase();
  return s.includes("أحمر") || s.includes("احمر") || s.includes("red") || s.includes("عقبة") || s.includes("سويس");
}

export function parseConnections(val: string[] | string | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(",").map((s) => s.trim()).filter(Boolean);
}

export function filterPorts(
  ports: PortItem[],
  query: string,
  seaFilter: string
): PortItem[] {
  const q = query.trim().toLowerCase();

  return ports.filter((port) => {
    // 1. Sea Filter
    if (seaFilter === "mediterranean") {
      if (!isMedSea(port.sea)) return false;
    } else if (seaFilter === "red_sea") {
      if (!isRedSea(port.sea)) return false;
    } else if (seaFilter === "suez_canal") {
      const s = (port.sea || "").toLowerCase();
      const desc = (port.description || "").toLowerCase();
      const cap = (port.capacity || "").toLowerCase();
      if (!s.includes("قناة") && !desc.includes("قناة السويس") && !cap.includes("قناة السويس")) {
        return false;
      }
    }

    // 2. Query Search
    if (!q) return true;

    const name = (port.name || "").toLowerCase();
    const gov = (port.governorate || "").toLowerCase();
    const sea = (port.sea || "").toLowerCase();
    const type = (port.type || "").toLowerCase();
    const cap = (port.capacity || "").toLowerCase();
    const operator = (port.operator || "").toLowerCase();
    const status = (port.status || "").toLowerCase();

    return (
      name.includes(q) ||
      gov.includes(q) ||
      sea.includes(q) ||
      type.includes(q) ||
      cap.includes(q) ||
      operator.includes(q) ||
      status.includes(q)
    );
  });
}
