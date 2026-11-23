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
      id: "all",
      label: "الكل",
      icon: <IconListDetails size={18} />,
      color: "#3b82f6",
    },
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
  ];

  return (
    <div>
      <div className={` ${suggestionsStyles.headerBar}`}>
        <div className={suggestionsStyles.headerTextGroup}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "4px",
            }}
          >
            <h2 className="fs-3xl fw-900 color-fg" style={{ margin: 0 }}>
             اقتراحات الأماكن
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isProcessing}
          className="btn btn-primary min-h-min"
          title="تحديث البيانات"
        >
          <IconRefresh size={18} className={isProcessing ? "animate-spin" : ""} />
          <span>تحديث</span>
        </button>
      </div>

      {/* Main Status Tabs Segmented Control */}
      <div
        className={suggestionsStyles.mainNavTabs}
        style={{ maxWidth: "100%", overflowX: "auto" }}
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
