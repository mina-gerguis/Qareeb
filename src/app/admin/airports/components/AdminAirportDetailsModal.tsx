import React from "react";
import { Airport } from "../types";
import { isInternationalAirport } from "../utils";
import airportsStyles from "../admin-airports.module.css";
import {
  IconBuilding,
  IconCar,
  IconExternalLink,
  IconGlobe,
  IconMapPin,
  IconNavigation,
  IconPhone,
  IconPlaneDeparture,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminAirportDetailsModalProps {
  airport: Airport | null;
  onClose: () => void;
  onEdit: (airport: Airport) => void;
}

export function AdminAirportDetailsModal({
  airport,
  onClose,
  onEdit,
}: AdminAirportDetailsModalProps) {
  if (!airport) return null;

  const isInt = isInternationalAirport(airport);

  return (
    <div className={airportsStyles.modalOverlay} onClick={onClose}>
      <div
        className={airportsStyles.modalContent}
        style={{ maxWidth: "680px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={airportsStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: isInt ? "rgba(59, 130, 246, 0.15)" : "rgba(16, 185, 129, 0.15)",
                color: isInt ? "#3b82f6" : "#10b981",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconPlaneDeparture size={20} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "var(--color-fg)" }}>
                {airport.name_ar || (airport as any).name}
              </h3>
              {airport.name_en && (
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted, #94a3b8)" }}>
                  {airport.name_en}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-close"
            type="button"
            aria-label="إغلاق"
          >
            <i className="bx bx-x" />
          </button>
        </div>

        {/* Body */}
        <div className={airportsStyles.modalBody} style={{ maxHeight: "70vh" }}>
          {/* Top badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <span className={isInt ? airportsStyles.airportTypeInt : airportsStyles.airportTypeDom}>
              {isInt ? <IconGlobe size={14} /> : <IconNavigation size={14} />}
              <span>{airport.type || (isInt ? "دولي" : "محلي")}</span>
            </span>

            <span className={airportsStyles.airportCodeBadge} title="كود IATA">
              IATA: {airport.iata_code || (airport as any).code || "N/A"}
            </span>

            {airport.icao_code && (
              <span className={airportsStyles.airportIcaoBadge} title="كود ICAO">
                ICAO: {airport.icao_code}
              </span>
            )}

            <span
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                color: "var(--text-secondary)",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <IconMapPin size={14} />
              <span>{airport.city_ar || (airport as any).city} - {airport.governorate_ar || (airport as any).governorate}</span>
            </span>
          </div>

          {/* Short Description */}
          {airport.short_description && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border-glass)",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "0.88rem",
                lineHeight: 1.5,
                color: "var(--color-fg)",
              }}
            >
              <strong>نبذة: </strong>
              {airport.short_description}
            </div>
          )}

          {/* Full Description */}
          {airport.description && (
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {airport.description}
            </div>
          )}

          {/* Infrastructure Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-glass)",
              borderRadius: "10px",
              padding: "14px",
            }}
          >
            <div>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>الصالات والمباني:</span>
              <p style={{ margin: "2px 0 0 0", fontWeight: 700, fontSize: "0.88rem" }}>
                {airport.terminals_count || "غير محدد"}
              </p>
            </div>

            <div>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>الطاقة الاستيعابية:</span>
              <p style={{ margin: "2px 0 0 0", fontWeight: 700, fontSize: "0.88rem" }}>
                {airport.capacity || "غير محدد"}
              </p>
            </div>

            <div>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>عدد المدارج:</span>
              <p style={{ margin: "2px 0 0 0", fontWeight: 700, fontSize: "0.88rem" }}>
                {airport.runways_count || "غير محدد"}
              </p>
            </div>

            <div>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>طول المدارج:</span>
              <p style={{ margin: "2px 0 0 0", fontWeight: 700, fontSize: "0.88rem" }}>
                {airport.runways_length || "غير محدد"}
              </p>
            </div>
          </div>

          {/* Flights and Airlines */}
          {(airport.domestic_flights || airport.international_flights || airport.airlines) && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-glass)",
                borderRadius: "10px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {airport.airlines && (
                <div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>شركات الطيران العاملة:</span>
                  <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "var(--color-fg)" }}>
                    {airport.airlines}
                  </p>
                </div>
              )}

              {airport.destinations && (
                <div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>أبرز الوجهات:</span>
                  <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "var(--color-fg)" }}>
                    {airport.destinations}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Services & Facilities */}
          {Array.isArray(airport.services) && airport.services.length > 0 && (
            <div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-fg)", display: "block", marginBottom: "6px" }}>
                الخدمات والتسهيلات:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {airport.services.map((srv, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "rgba(16, 185, 129, 0.08)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      color: "#34d399",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                    }}
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Transportation */}
          {Array.isArray(airport.transportation) && airport.transportation.length > 0 && (
            <div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-fg)", display: "block", marginBottom: "6px" }}>
                وسائل النقل والمواصلات:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {airport.transportation.map((tr, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "rgba(59, 130, 246, 0.08)",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      color: "#60a5fa",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                    }}
                  >
                    {tr}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact & Map */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              paddingTop: "10px",
              borderTop: "1px solid var(--border-glass)",
            }}
          >
            {airport.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", direction: "ltr" }}>
                <IconPhone size={16} style={{ color: "var(--text-muted)" }} />
                <span style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>{airport.phone}</span>
              </div>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              {airport.official_website && (
                <a
                  href={airport.official_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-cancel"
                  style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", minHeight: "34px", fontSize: "0.82rem" }}
                >
                  <IconExternalLink size={14} />
                  <span>الموقع الرسمي</span>
                </a>
              )}

              {airport.map_url && (
                <a
                  href={airport.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", minHeight: "34px", fontSize: "0.82rem" }}
                >
                  <IconMapPin size={14} />
                  <span>الخريطة</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${airportsStyles.modalFooter} gap-3`}>
          <button
            type="button"
            onClick={() => onEdit(airport)}
            className="btn btn-blue w-full"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <IconWritingSignFilled size={18} />
            <span>تعديل المطار</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-cancel w-full"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
