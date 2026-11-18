import React from "react";
import { Airport, VisibleColumns } from "../types";
import { isInternationalAirport } from "../utils";
import airportsStyles from "../admin-airports.module.css";
import {
  IconExternalLink,
  IconGlobe,
  IconListDetailsFilled,
  IconMapPin,
  IconNavigation,
  IconPhone,
  IconPlaneDeparture,
  IconTrashFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminAirportsCardsProps {
  airports: Airport[];
  visibleColumns: VisibleColumns;
  onViewAirport: (airport: Airport) => void;
  onEditAirport: (airport: Airport) => void;
  onDeleteAirport: (airport: Airport) => void;
}

export function AdminAirportsCards({
  airports,
  visibleColumns,
  onViewAirport,
  onEditAirport,
  onDeleteAirport,
}: AdminAirportsCardsProps) {
  return (
    <div className={airportsStyles.stationCardsList}>
      {airports.map((airport) => {
        const airportKey = String(airport.id || airport.iata_code || airport.name_ar);
        const isInt = isInternationalAirport(airport);
        const themeColor = isInt ? "#3b82f6" : "#10b981";

        return (
          <div key={airportKey} className={airportsStyles.stationCard}>
            {/* Header: Name + Badges */}
            <div className={airportsStyles.stationCardHeader}>
              <div className={airportsStyles.stationCardMain}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: themeColor,
                    boxShadow: `0 0 8px ${themeColor}80`,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <h3 className={airportsStyles.stationCardName}>
                    {airport.name_ar || (airport as any).name}
                  </h3>
                  {airport.name_en && (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted, #94a3b8)", display: "block" }}>
                      {airport.name_en}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                <span className={isInt ? airportsStyles.airportTypeInt : airportsStyles.airportTypeDom}>
                  {isInt ? <IconGlobe size={13} /> : <IconNavigation size={13} />}
                  <span>{airport.type || (isInt ? "دولي" : "محلي")}</span>
                </span>
                <div style={{ display: "flex", gap: "4px" }}>
                  <span className={airportsStyles.airportCodeBadge}>
                    {airport.iata_code || (airport as any).code || "N/A"}
                  </span>
                  {airport.icao_code && (
                    <span className={airportsStyles.airportIcaoBadge}>
                      {airport.icao_code}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* City & Address Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {visibleColumns.city && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <IconMapPin size={16} />
                  <span>
                    {airport.city_ar || (airport as any).city || "غير محدد"}
                    {airport.governorate_ar && ` (${airport.governorate_ar})`}
                    {airport.area_ar && ` - ${airport.area_ar}`}
                  </span>
                </div>
              )}

              {visibleColumns.phone && airport.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--color-fg)", direction: "ltr", justifyContent: "flex-end" }}>
                  <IconPhone size={15} style={{ color: "var(--text-muted)" }} />
                  <span style={{ fontFamily: "monospace" }}>{airport.phone}</span>
                </div>
              )}
            </div>

            {/* Terminals & Capacity Stats */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
              {visibleColumns.terminals && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: "rgba(99, 102, 241, 0.12)",
                    color: "#818cf8",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                  }}
                >
                  الصالات: {airport.terminals_count || "غير محدد"}
                </span>
              )}

              {airport.capacity && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: "rgba(245, 158, 11, 0.12)",
                    color: "#f59e0b",
                    border: "1px solid rgba(245, 158, 11, 0.25)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                  }}
                >
                  السعة: {airport.capacity}
                </span>
              )}
            </div>

            {/* Short Description */}
            {airport.short_description && (
              <p
                style={{
                  fontSize: "0.83rem",
                  color: "var(--text-secondary, #cbd5e1)",
                  margin: "4px 0 0 0",
                  lineHeight: 1.5,
                  borderTop: "1px dashed rgba(255, 255, 255, 0.08)",
                  paddingTop: "8px",
                }}
              >
                {airport.short_description}
              </p>
            )}

            {/* Action Buttons matching Parking and Metro */}
            <div className={airportsStyles.stationCardActions}>
              <button
                type="button"
                onClick={() => onViewAirport(airport)}
                className="btn btn-cancel w-full"
                title="عرض تفاصيل المطار"
              >
                <IconListDetailsFilled size={18} />
                <span>تفاصيل</span>
              </button>

              <button
                type="button"
                onClick={() => onEditAirport(airport)}
                className="btn btn-blue w-full"
                title="تعديل المطار"
              >
                <IconWritingSignFilled size={18} />
                <span>تعديل</span>
              </button>

              {airport.map_url && visibleColumns.mapUrl && (
                <a
                  href={airport.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: "0 12px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                  title="فتح في خرائط جوجل"
                >
                  <IconExternalLink size={18} />
                </a>
              )}

              <button
                type="button"
                onClick={() => onDeleteAirport(airport)}
                className="btn btn-error"
                style={{ padding: "0 12px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                title="حذف المطار"
              >
                <IconTrashFilled size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
