import React from "react";
import clsx from "clsx";
import suggestionsStyles from "../admin-suggestions.module.css";
import {
  IconMapPin,
  IconRefresh,
  IconClock,
  IconCircleCheck,
  IconCircleX,
  IconArrowBackUp,
  IconListDetails,
} from "@tabler/icons-react";
import { ProposalFilterTab } from "../types";

interface AdminSuggestionsHeaderProps {
  statusTab: ProposalFilterTab;
  onStatusTabChange: (tab: ProposalFilterTab) => void;
  statusCounts: Record<ProposalFilterTab, number>;
  onRefresh: () => void;
  isProcessing?: boolean;
}

export function AdminSuggestionsHeader({
  statusTab,
  onStatusTabChange,
  statusCounts,
  onRefresh,
  isProcessing = false,
}: AdminSuggestionsHeaderProps) {
  const tabs: {
    id: ProposalFilterTab;
    label: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: "pending",
      label: "قيد المراجعة",
      icon: <IconClock size={18} />,
      color: "#f59e0b",
    },
    {
      id: "approved",
      label: "المقبولة",
      icon: <IconCircleCheck size={18} />,
      color: "#10b981",
    },
    {
      id: "rejected",
      label: "المرفوضة",
      icon: <IconCircleX size={18} />,
      color: "#ef4444",
    },
    {
      id: "retracted",
      label: "المتراجع عنها",
      icon: <IconArrowBackUp size={18} />,
      color: "#8e8e93",
    },
    {
      id: "all",
      label: "الكل",
      icon: <IconListDetails size={18} />,
      color: "#3b82f6",
    },
  ];

  return (
    <div>
      <div className={`pt-3 ${suggestionsStyles.headerBar}`}>
        <div className={suggestionsStyles.headerTextGroup}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "4px",
            }}
          >
            <span
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(59, 130, 246, 0.15)",
                color: "#3b82f6",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconMapPin size={22} />
            </span>
            <h2 className="fs-3xl fw-900 color-fg" style={{ margin: 0 }}>
              مراجعة اقتراحات الأماكن
            </h2>
          </div>
          <p
            style={{
              color: "var(--text-muted, #94a3b8)",
              fontSize: "0.88rem",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            مراجعة واعتماد أو رفض الأماكن المقترحة من قبل المستخدمين ونشرها في الدليل الرئيسي
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isProcessing}
          className="btn btn-secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
          title="تحديث البيانات"
        >
          <IconRefresh size={18} className={isProcessing ? "animate-spin" : ""} />
          <span>تحديث</span>
        </button>
      </div>

      {/* Main Status Tabs Segmented Control */}
      <div
        className={suggestionsStyles.mainNavTabs}
        style={{ maxWidth: "680px", overflowX: "auto" }}
      >
        {tabs.map((tab) => {
          const isActive = statusTab === tab.id;
          const count = statusCounts[tab.id] || 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusTabChange(tab.id)}
              className={clsx(
                "font-sub",
                suggestionsStyles.mainNavBtn,
                isActive
                  ? "btn-primary"
                  : suggestionsStyles.mainNavBtnInactive
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: isActive
                    ? "rgba(255, 255, 255, 0.25)"
                    : "rgba(255, 255, 255, 0.08)",
                  color: isActive ? "#fff" : "var(--text-muted)",
                  fontWeight: "700",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
