import React from "react";
import clsx from "clsx";
import { Airport, VisibleColumns, ActionMenuState } from "../types";
import { isInternationalAirport } from "../utils";
import airportsStyles from "../admin-airports.module.css";
import {
  IconDotsFilled,
  IconExternalLink,
  IconGlobe,
  IconNavigation,
  IconPlaneDeparture,
  IconPhone,
} from "@tabler/icons-react";

interface AdminAirportsTableProps {
  airports: Airport[];
  visibleColumns: VisibleColumns;
  actionMenuState: ActionMenuState | null;
  selectedAirportKeys?: Record<string, boolean>;
  onToggleSelect?: (airportKey: string) => void;
  onToggleSelectAll?: (airports: Airport[]) => void;
  onViewAirport: (airport: Airport) => void;
  onToggleActionMenu: (
    item: Airport,
    key: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

export function AdminAirportsTable({
  airports,
  visibleColumns,
  actionMenuState,
  selectedAirportKeys = {},
  onToggleSelect,
  onToggleSelectAll,
  onViewAirport,
  onToggleActionMenu,
}: AdminAirportsTableProps) {
  const allSelected =
    airports.length > 0 &&
    airports.every((a) => selectedAirportKeys[String(a.id || a.iata_code || a.name_ar)]);

  return (
    <div className={airportsStyles.table05Container}>
      <div className={airportsStyles.table05Scroll}>
        <table className={airportsStyles.table05}>
          <thead>
            <tr>
              {onToggleSelect && (
                <th className={airportsStyles.table05Th} style={{ width: "40px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => onToggleSelectAll && onToggleSelectAll(airports)}
                    style={{ cursor: "pointer", width: "16px", height: "16px" }}
                    title="تحديد الكل"
                  />
                </th>
              )}

              {visibleColumns.name && (
                <th className={airportsStyles.table05Th} style={{ minWidth: "200px" }}>
                  المطار
                </th>
              )}

              {visibleColumns.code && (
                <th className={airportsStyles.table05Th} style={{ minWidth: "140px", textAlign: "center" }}>
                  الكود (IATA / ICAO)
                </th>
              )}

              {visibleColumns.city && (
                <th className={airportsStyles.table05Th} style={{ minWidth: "150px" }}>
                  المدينة والمحافظة
                </th>
              )}

              {visibleColumns.type && (
                <th className={airportsStyles.table05Th} style={{ minWidth: "110px", textAlign: "center" }}>
                  التصنيف
                </th>
              )}

              {visibleColumns.phone && (
                <th className={airportsStyles.table05Th} style={{ minWidth: "120px", textAlign: "center" }}>
                  الاستعلامات
                </th>
              )}

              {visibleColumns.terminals && (
                <th className={airportsStyles.table05Th} style={{ minWidth: "170px" }}>
                  الصالات والبنية
                </th>
              )}

              {visibleColumns.airlines && (
                <th className={airportsStyles.table05Th} style={{ minWidth: "170px" }}>
                  شركات الطيران
                </th>
              )}

              {visibleColumns.mapUrl && (
                <th className={airportsStyles.table05Th} style={{ width: "70px", textAlign: "center" }}>
                  الخريطة
                </th>
              )}

              <th className={airportsStyles.table05Th} style={{ textAlign: "center", width: "70px" }}>
                خيارات
              </th>
            </tr>
          </thead>
          <tbody>
            {airports.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    textAlign: "center",
                    padding: "48px 20px",
                    color: "var(--text-muted, #94a3b8)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <IconPlaneDeparture size={40} style={{ opacity: 0.3 }} />
                    <p style={{ margin: 0, fontSize: "0.95rem" }}>
                      لا توجد أي مطارات مطابقة لمعايير البحث الحالية.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              airports.map((airport) => {
                const airportKey = String(airport.id || airport.iata_code || airport.name_ar);
                const isSelected = !!selectedAirportKeys[airportKey];
                const isMenuOpen = actionMenuState?.key === airportKey;
                const isInt = isInternationalAirport(airport);

                return (
                  <tr
                    key={airportKey}
                    className={clsx(
                      airportsStyles.table05Tr,
                      isSelected && airportsStyles.table05TrSelected
                    )}
                  >
                    {onToggleSelect && (
                      <td className={airportsStyles.table05Td} style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(airportKey)}
                          style={{ cursor: "pointer", width: "16px", height: "16px" }}
                          title="تحديد المطار"
                        />
                      </td>
                    )}

                    {visibleColumns.name && (
                      <td className={airportsStyles.table05Td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              background: isInt ? "rgba(59, 130, 246, 0.12)" : "rgba(16, 185, 129, 0.12)",
                              color: isInt ? "#3b82f6" : "#10b981",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <IconPlaneDeparture size={20} />
                          </span>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <button
                              type="button"
                              onClick={() => onViewAirport(airport)}
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                textAlign: "right",
                                cursor: "pointer",
                                fontWeight: 700,
                                color: "var(--color-fg)",
                                fontSize: "0.92rem",
                              }}
                              className="hover:underline"
                            >
                              {airport.name_ar || (airport as any).name}
                            </button>
                            {airport.name_en && (
                              <span style={{ fontSize: "0.78rem", color: "var(--text-muted, #94a3b8)" }}>
                                {airport.name_en}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                    )}

                    {visibleColumns.code && (
                      <td className={airportsStyles.table05Td} style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-flex", gap: "6px", alignItems: "center", justifyContent: "center" }}>
                          <span className={airportsStyles.airportCodeBadge} title="كود IATA">
                            {airport.iata_code || (airport as any).code || "N/A"}
                          </span>
                          {airport.icao_code && (
                            <span className={airportsStyles.airportIcaoBadge} title="كود ICAO">
                              {airport.icao_code}
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {visibleColumns.city && (
                      <td className={airportsStyles.table05Td}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                            {airport.city_ar || (airport as any).city || "غير محدد"}
                          </span>
                          {airport.governorate_ar && (
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted, #94a3b8)" }}>
                              {airport.governorate_ar}
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {visibleColumns.type && (
                      <td className={airportsStyles.table05Td} style={{ textAlign: "center" }}>
                        <span className={isInt ? airportsStyles.airportTypeInt : airportsStyles.airportTypeDom}>
                          {isInt ? <IconGlobe size={14} /> : <IconNavigation size={14} />}
                          <span>{airport.type || (isInt ? "دولي" : "محلي")}</span>
                        </span>
                      </td>
                    )}

                    {visibleColumns.phone && (
                      <td className={airportsStyles.table05Td} style={{ textAlign: "center" }}>
                        {airport.phone ? (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              direction: "ltr",
                              fontFamily: "monospace",
                              fontSize: "0.85rem",
                              color: "var(--color-fg)",
                            }}
                          >
                            <IconPhone size={14} style={{ color: "var(--text-muted)" }} />
                            <span>{airport.phone}</span>
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>-</span>
                        )}
                      </td>
                    )}

                    {visibleColumns.terminals && (
                      <td className={airportsStyles.table05Td}>
                        <div
                          style={{
                            maxWidth: "180px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                          }}
                        >
                          <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                            {airport.terminals_count || "غير محدد"}
                          </span>
                          {airport.capacity && (
                            <span
                              title={airport.capacity}
                              style={{
                                fontSize: "0.78rem",
                                color: "var(--text-muted, #94a3b8)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              سعة: {airport.capacity}
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {visibleColumns.airlines && (
                      <td className={airportsStyles.table05Td}>
                        <div
                          title={airport.airlines || "غير محدد"}
                          style={{
                            maxWidth: "180px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.85rem",
                            color: "var(--color-fg)",
                          }}
                        >
                          {airport.airlines || "-"}
                        </div>
                      </td>
                    )}

                    {visibleColumns.mapUrl && (
                      <td className={airportsStyles.table05Td} style={{ textAlign: "center" }}>
                        {airport.map_url ? (
                          <a
                            href={airport.map_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#3b82f6",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "30px",
                              height: "30px",
                              borderRadius: "8px",
                              background: "rgba(59, 130, 246, 0.1)",
                            }}
                            title="عرض على الخريطة"
                          >
                            <IconExternalLink size={16} />
                          </a>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>-</span>
                        )}
                      </td>
                    )}

                    <td className={airportsStyles.table05Td} style={{ textAlign: "center" }}>
                      <div className={airportsStyles.actionMenuWrapper}>
                        <button
                          type="button"
                          data-toggle-action
                          onClick={(e) => onToggleActionMenu(airport, airportKey, e)}
                          className={clsx(
                            airportsStyles.moreMenuBtn,
                            isMenuOpen && airportsStyles.moreMenuBtnActive
                          )}
                          aria-label="خيارات المطار"
                          title="خيارات المطار"
                        >
                          <IconDotsFilled size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
