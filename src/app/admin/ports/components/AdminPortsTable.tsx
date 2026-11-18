import React from "react";
import clsx from "clsx";
import { PortItem, VisibleColumns, ActionMenuState } from "../types";
import { isMedSea } from "../utils";
import portsStyles from "../admin-ports.module.css";
import {
  IconAnchor,
  IconDotsFilled,
  IconExternalLink,
} from "@tabler/icons-react";
import { Waves } from "lucide-react";

interface AdminPortsTableProps {
  ports: PortItem[];
  visibleColumns: VisibleColumns;
  actionMenuState: ActionMenuState | null;
  selectedPortKeys?: Record<string, boolean>;
  onToggleSelect?: (portKey: string) => void;
  onToggleSelectAll?: (ports: PortItem[]) => void;
  onViewPort: (port: PortItem) => void;
  onToggleActionMenu: (
    item: PortItem,
    key: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

export function AdminPortsTable({
  ports,
  visibleColumns,
  actionMenuState,
  selectedPortKeys = {},
  onToggleSelect,
  onToggleSelectAll,
  onViewPort,
  onToggleActionMenu,
}: AdminPortsTableProps) {
  const allSelected =
    ports.length > 0 &&
    ports.every((p) => selectedPortKeys[String(p.id || p.name)]);

  return (
    <div className={portsStyles.table05Container}>
      <div className={portsStyles.table05Scroll}>
        <table className={portsStyles.table05}>
          <thead>
            <tr>
              {onToggleSelect && (
                <th className={portsStyles.table05Th} style={{ width: "40px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => onToggleSelectAll && onToggleSelectAll(ports)}
                    style={{ cursor: "pointer", width: "16px", height: "16px" }}
                    title="تحديد الكل"
                  />
                </th>
              )}

              {visibleColumns.name && (
                <th className={portsStyles.table05Th} style={{ minWidth: "190px" }}>
                  اسم الميناء
                </th>
              )}

              {visibleColumns.governorate && (
                <th className={portsStyles.table05Th} style={{ minWidth: "110px" }}>
                  المحافظة
                </th>
              )}

              {visibleColumns.sea && (
                <th className={portsStyles.table05Th} style={{ minWidth: "160px" }}>
                  المسطح المائي
                </th>
              )}

              {visibleColumns.type && (
                <th className={portsStyles.table05Th} style={{ minWidth: "170px" }}>
                  النوع والتخصص
                </th>
              )}

              {visibleColumns.capacity && (
                <th className={portsStyles.table05Th} style={{ minWidth: "180px" }}>
                  السعة والأهمية
                </th>
              )}

              {visibleColumns.operator && (
                <th className={portsStyles.table05Th} style={{ minWidth: "150px" }}>
                  الهيئة المشغلة
                </th>
              )}

              {visibleColumns.status && (
                <th className={portsStyles.table05Th} style={{ width: "120px", textAlign: "center" }}>
                  الحالة
                </th>
              )}

              {visibleColumns.mapUrl && (
                <th className={portsStyles.table05Th} style={{ width: "70px", textAlign: "center" }}>
                  الخريطة
                </th>
              )}

              <th className={portsStyles.table05Th} style={{ textAlign: "center", width: "70px" }}>
                خيارات
              </th>
            </tr>
          </thead>
          <tbody>
            {ports.length === 0 ? (
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
                    <IconAnchor size={40} style={{ opacity: 0.3 }} />
                    <p style={{ margin: 0, fontSize: "0.95rem" }}>
                      لا توجد أي موانئ مطابقة لمعايير البحث الحالية.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              ports.map((port) => {
                const portKey = String(port.id || port.name);
                const isSelected = !!selectedPortKeys[portKey];
                const isMenuOpen = actionMenuState?.key === portKey;
                const isMed = isMedSea(port.sea);

                return (
                  <tr
                    key={portKey}
                    className={clsx(
                      portsStyles.table05Tr,
                      isSelected && portsStyles.table05TrSelected
                    )}
                  >
                    {onToggleSelect && (
                      <td className={portsStyles.table05Td} style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(portKey)}
                          style={{ cursor: "pointer", width: "16px", height: "16px" }}
                          title="تحديد الميناء"
                        />
                      </td>
                    )}

                    {visibleColumns.name && (
                      <td className={portsStyles.table05Td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              background: isMed ? "rgba(59, 130, 246, 0.12)" : "rgba(239, 68, 68, 0.12)",
                              color: isMed ? "#3b82f6" : "#ef4444",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <IconAnchor size={20} />
                          </span>
                          <button
                            type="button"
                            onClick={() => onViewPort(port)}
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
                            {port.name}
                          </button>
                        </div>
                      </td>
                    )}

                    {visibleColumns.governorate && (
                      <td className={portsStyles.table05Td}>
                        <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                          {port.governorate}
                        </span>
                      </td>
                    )}

                    {visibleColumns.sea && (
                      <td className={portsStyles.table05Td}>
                        <span className={isMed ? portsStyles.seaMedBadge : portsStyles.seaRedBadge}>
                          <Waves className="h-3.5 w-3.5" />
                          <span>{port.sea}</span>
                        </span>
                      </td>
                    )}

                    {visibleColumns.type && (
                      <td className={portsStyles.table05Td}>
                        <span className={portsStyles.portTypeBadge}>
                          {port.type}
                        </span>
                      </td>
                    )}

                    {visibleColumns.capacity && (
                      <td className={portsStyles.table05Td}>
                        <span
                          title={port.capacity}
                          style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "block",
                            fontSize: "0.85rem",
                            color: "var(--text-muted, #94a3b8)",
                          }}
                        >
                          {port.capacity}
                        </span>
                      </td>
                    )}

                    {visibleColumns.operator && (
                      <td className={portsStyles.table05Td}>
                        <span style={{ fontSize: "0.85rem", color: "var(--color-fg)" }}>
                          {port.operator || "-"}
                        </span>
                      </td>
                    )}

                    {visibleColumns.status && (
                      <td className={portsStyles.table05Td} style={{ textAlign: "center" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "12px",
                            background: "rgba(16, 185, 129, 0.12)",
                            color: "#10b981",
                            border: "1px solid rgba(16, 185, 129, 0.25)",
                          }}
                        >
                          {port.status || "تشغيل فعلي"}
                        </span>
                      </td>
                    )}

                    {visibleColumns.mapUrl && (
                      <td className={portsStyles.table05Td} style={{ textAlign: "center" }}>
                        {port.map_url ? (
                          <a
                            href={port.map_url}
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

                    <td className={portsStyles.table05Td} style={{ textAlign: "center" }}>
                      <div className={portsStyles.actionMenuWrapper}>
                        <button
                          type="button"
                          data-toggle-action
                          onClick={(e) => onToggleActionMenu(port, portKey, e)}
                          className={clsx(
                            portsStyles.moreMenuBtn,
                            isMenuOpen && portsStyles.moreMenuBtnActive
                          )}
                          aria-label="خيارات الميناء"
                          title="خيارات الميناء"
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
