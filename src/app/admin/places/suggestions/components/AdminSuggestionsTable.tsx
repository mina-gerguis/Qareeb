import React from "react";
import { blobatarUri } from "blobatar/uri";
import clsx from "clsx";
import { PlaceProposal, VisibleColumns, UserProfile } from "../types";
import { STATUS_META } from "../constants";
import { getCategoryColor, CATEGORY_ICONS } from "../utils";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import suggestionsStyles from "../admin-suggestions.module.css";
import {
  IconDotsFilled,
  IconMapPin,
  IconUser,
  IconCalendar,
} from "@tabler/icons-react";

interface AdminSuggestionsTableProps {
  proposals: PlaceProposal[];
  visibleColumns: VisibleColumns;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewDetails: (proposal: PlaceProposal) => void;
  onViewProposer: (userProfile: UserProfile | null, userId: string) => void;
  onToggleActionMenu: (
    proposal: PlaceProposal,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
  activeActionProposalId?: string;
}

export function AdminSuggestionsTable({
  proposals,
  visibleColumns,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetails,
  onViewProposer,
  onToggleActionMenu,
  activeActionProposalId,
}: AdminSuggestionsTableProps) {
  const allSelected =
    proposals.length > 0 && proposals.every((p) => selectedIds.has(p.id));

  return (
    <div className={suggestionsStyles.table05Container}>
      <div className={suggestionsStyles.table05Scroll}>
        <table className={suggestionsStyles.table05}>
          <thead>
            <tr>
              {visibleColumns.select && (
                <th
                  className={suggestionsStyles.table05Th}
                  style={{ width: "40px", textAlign: "center" }}
                >
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onToggleSelectAll}
                    style={{ cursor: "pointer", width: "16px", height: "16px" }}
                    title="تحديد الكل"
                  />
                </th>
              )}

              {visibleColumns.image && (
                <th
                  className={suggestionsStyles.table05Th}
                  style={{ width: "65px", textAlign: "center" }}
                >
                  الصورة
                </th>
              )}

              {visibleColumns.name && (
                <th
                  className={suggestionsStyles.table05Th}
                  style={{ minWidth: "180px" }}
                >
                  اسم المكان والمدينة
                </th>
              )}

              {visibleColumns.category && (
                <th
                  className={suggestionsStyles.table05Th}
                  style={{ minWidth: "180px" }}
                >
                  التصنيف
                </th>
              )}

              {visibleColumns.proposer && (
                <th
                  className={suggestionsStyles.table05Th}
                  style={{ minWidth: "160px" }}
                >
                  صاحب الاقتراح
                </th>
              )}

              {visibleColumns.date && (
                <th
                  className={suggestionsStyles.table05Th}
                  style={{ minWidth: "150px" }}
                >
                  تاريخ التقديم
                </th>
              )}

              {visibleColumns.status && (
                <th
                  className={suggestionsStyles.table05Th}
                  style={{ minWidth: "150px", textAlign: "center" }}
                >
                  الحالة
                </th>
              )}

              {visibleColumns.actions && (
                <th
                  className={suggestionsStyles.table05Th}
                  style={{ width: "70px", textAlign: "center" }}
                >
                  إجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {proposals.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className={suggestionsStyles.table05Td}
                  style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}
                >
                  لا توجد اقتراحات مطابقة للبحث أو القسم المحدد
                </td>
              </tr>
            ) : (
              proposals.map((prop) => {
                const isSelected = selectedIds.has(prop.id);
                const isMenuOpen = activeActionProposalId === prop.id;
                const statusInfo = STATUS_META[prop.status];
                const catColor = getCategoryColor(prop.category);
                const catIcon = CATEGORY_ICONS[prop.category] || "bx-category";
                const firstImg =
                  prop.images && prop.images.length > 0
                    ? prop.images[0]
                    : prop.image_url;

                return (
                  <tr
                    key={prop.id}
                    className={clsx(
                      suggestionsStyles.table05Tr,
                      isSelected && suggestionsStyles.table05TrSelected
                    )}
                  >
                    {visibleColumns.select && (
                      <td
                        className={suggestionsStyles.table05Td}
                        style={{ textAlign: "center" }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(prop.id)}
                          style={{
                            cursor: "pointer",
                            width: "16px",
                            height: "16px",
                          }}
                          title="تحديد"
                        />
                      </td>
                    )}

                    {visibleColumns.image && (
                      <td
                        className={suggestionsStyles.table05Td}
                        style={{ textAlign: "center" }}
                      >
                        {firstImg ? (
                          <img
                            src={firstImg}
                            alt={prop.name}
                            loading="lazy"
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "10px",
                              objectFit: "cover",
                              border: "1px solid var(--border-glass)",
                            }}
                            onError={(e: any) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop&q=80";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "10px",
                              background: "rgba(59, 130, 246, 0.12)",
                              color: "#3b82f6",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.2rem",
                            }}
                          >
                            <i className="bx bx-map-pin" />
                          </div>
                        )}
                      </td>
                    )}

                    {visibleColumns.name && (
                      <td className={suggestionsStyles.table05Td}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <button
                            type="button"
                            onClick={() => onViewDetails(prop)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              font: "inherit",
                              textAlign: "right",
                              cursor: "pointer",
                              fontWeight: 700,
                              fontSize: "0.92rem",
                              color: "var(--color-fg)",
                            }}
                            className="hover:underline"
                          >
                            {prop.name}
                          </button>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-muted, #94a3b8)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <IconMapPin size={13} style={{ color: "var(--color-primary)" }} />
                            <span>
                              {prop.city} / {prop.governorate}
                            </span>
                          </span>
                        </div>
                      </td>
                    )}

                    {visibleColumns.category && (
                      <td className={suggestionsStyles.table05Td}>
                        <span
                        className="font-sub"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            background: "var(--color-primary)",
                            border: `1px solid ${catColor}40`,
                            color: "#fff",
                          }}
                        >
                          <CategoryIcon
                            icon={catIcon}
                            size={15}
                          />
                          <span>{prop.category_label || prop.category}</span>
                        </span>
                      </td>
                    )}

                    {visibleColumns.proposer && (
                      <td className={suggestionsStyles.table05Td}>
                        <button
                          type="button"
                          onClick={() =>
                            onViewProposer(prop.user_profile || null, prop.user_id)
                          }
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            textAlign: "right",
                          }}
                          className="hover:opacity-80"
                        >
                          <img
                            src={
                              prop.user_profile?.avatar_url ||
                              blobatarUri(prop.user_profile?.full_name || prop.user_profile?.email || "Proposer")
                            }
                            alt="Proposer"
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "1px solid var(--border-glass)",
                            }}
                          />
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span
                              style={{
                                fontSize: "0.82rem",
                                fontWeight: 700,
                                color: "var(--color-fg)",
                              }}
                            >
                              {prop.user_profile?.full_name ||
                                prop.user_profile?.username ||
                                "مستخدم قريب"}
                            </span>
                            {prop.user_profile?.username && (
                              <span
                                style={{
                                  fontSize: "0.72rem",
                                  color: "var(--text-muted)",
                                  direction: "ltr",
                                  textAlign: "right",
                                }}
                              >
                                @{prop.user_profile.username}
                              </span>
                            )}
                          </div>
                        </button>
                      </td>
                    )}

                    {visibleColumns.date && (
                      <td className={suggestionsStyles.table05Td}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "0.82rem",
                            color: "var(--text-muted, #94a3b8)",
                          }}
                        >
                          <IconCalendar size={14} />
                          <span>
                            {prop.created_at
                              ? new Date(prop.created_at).toLocaleDateString(
                                  "ar-EG",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "-"}
                          </span>
                        </div>
                      </td>
                    )}

                    {visibleColumns.status && (
                      <td
                        className={suggestionsStyles.table05Td}
                        style={{ textAlign: "center" }}
                      >
                        <span
                        className="font-sub"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            background: statusInfo?.bg || "rgba(255, 255, 255, 0.05)",
                            border: `1px solid ${
                              statusInfo?.border || "var(--border-glass)"
                            }`,
                            color: statusInfo?.color || "var(--color-fg)",
                          }}
                        >
                          <i className={`bx ${statusInfo?.icon || "bx-info-circle"}`} />
                          <span>{statusInfo?.label || prop.status}</span>
                        </span>
                      </td>
                    )}

                    {visibleColumns.actions && (
                      <td
                        className={suggestionsStyles.table05Td}
                        style={{ textAlign: "center" }}
                      >
                        <div className={suggestionsStyles.actionMenuWrapper}>
                          <button
                            type="button"
                            onClick={(e) => onToggleActionMenu(prop, e)}
                            className={clsx(
                              suggestionsStyles.moreMenuBtn,
                              isMenuOpen && suggestionsStyles.moreMenuBtnActive
                            )}
                            title="خيارات الاقتراح"
                          >
                            <IconDotsFilled size={18} />
                          </button>
                        </div>
                      </td>
                    )}
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
