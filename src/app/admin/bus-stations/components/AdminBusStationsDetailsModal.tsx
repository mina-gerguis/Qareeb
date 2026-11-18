import React from "react";
import { BusStation } from "../types";
import { getGovernorateColor } from "../utils";
import busStyles from "../admin-bus-stations.module.css";
import {
  IconBuildingSkyscraper,
  IconExternalLink,
  IconMapPin,
  IconPhone,
  IconRoute,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminBusStationsDetailsModalProps {
  station: BusStation | null;
  onClose: () => void;
  onEdit: (station: BusStation) => void;
}

export function AdminBusStationsDetailsModal({
  station,
  onClose,
  onEdit,
}: AdminBusStationsDetailsModalProps) {
  if (!station) return null;

  const govColor = getGovernorateColor(station.governorate);
  const companies = station.companies || [];
  const destinations = station.destinations || [];

  return (
    <div className={busStyles.modalOverlay}>
      <div className={busStyles.modalContent} style={{ maxWidth: "620px" }}>
        {/* Modal Header */}
        <div className={busStyles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: govColor,
                boxShadow: `0 0 10px ${govColor}80`,
                display: "inline-block",
              }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "900", color: "var(--color-fg)" }}>
                {station.name}
              </h3>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                محافظة {station.governorate}
              </span>
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

        {/* Modal Body */}
        <div className={busStyles.modalBody}>
          {/* Key Info: Location & Map */}
          <div
            style={{
              background: "var(--bg-secondary, rgba(255, 255, 255, 0.03))",
              border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.08))",
              borderRadius: "10px",
              padding: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "6px" }}>
              <IconMapPin size={16} />
              <span>العنوان بالتفصيل</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-fg)", lineHeight: 1.5 }}>
              {station.location}
            </div>

            {station.map_url && (
              <div style={{ marginTop: "10px" }}>
                <a
                  href={station.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#60a5fa",
                    fontSize: "0.84rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <IconExternalLink size={15} />
                  <span>عرض الموقع الجغرافي على Google Maps</span>
                </a>
              </div>
            )}
          </div>

          {/* Operating Companies */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <IconBuildingSkyscraper size={18} style={{ color: "#818cf8" }} />
              <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--color-fg)" }}>
                الشركات المشغلة وخطوط النقل ({companies.length})
              </span>
            </div>

            <div
              style={{
                maxHeight: "220px",
                overflowY: "auto",
                border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.08))",
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {companies.length === 0 ? (
                <div style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  لا توجد شركات مسجلة
                </div>
              ) : (
                companies.map((comp, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.05))",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {comp.logo && (
                        <img
                          src={`/images/busStations/${comp.logo}`}
                          alt={comp.name}
                          style={{
                            width: "30px",
                            height: "30px",
                            objectFit: "contain",
                            borderRadius: "6px",
                            background: "white",
                            padding: "2px",
                          }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--color-fg)" }}>
                          {comp.name}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                          {comp.type}
                        </div>
                      </div>
                    </div>

                    {comp.phone && (
                      <a
                        href={`tel:${comp.phone}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 10px",
                          borderRadius: "16px",
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "#34d399",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        <IconPhone size={14} />
                        <span dir="ltr">{comp.phone}</span>
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <IconRoute size={18} style={{ color: "#34d399" }} />
              <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--color-fg)" }}>
                الوجهات والمدن المتاحة ({destinations.length})
              </span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {destinations.length === 0 ? (
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  لم يتم إضافة وجهات لهذا الموقف
                </span>
              ) : (
                destinations.map((dest, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "0.8rem",
                      background: "rgba(255, 255, 255, 0.04)",
                      color: "var(--color-fg)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-glass)",
                      fontWeight: 600,
                    }}
                  >
                    {dest}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Description & Notes */}
          {station.description && (
            <div
              style={{
                background: "rgba(99, 102, 241, 0.08)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "0.88rem",
                lineHeight: "1.6",
                color: "var(--color-fg)",
              }}
            >
              <strong style={{ color: "#818cf8", display: "block", marginBottom: "4px" }}>
                الوصف ومعلومات السفر:
              </strong>
              {station.description}
            </div>
          )}

          {/* Modal Footer */}
          <div className={busStyles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel"
            >
              إغلاق
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(station);
              }}
              className="btn btn-primary"
            >
              <IconWritingSignFilled size={18} />
              <span>تعديل بيانات الموقف</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
