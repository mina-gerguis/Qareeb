import React from "react";
import clsx from "clsx";
import roadsStyles from "../admin-roads-info.module.css";
import {
  IconSquareRoundedPlusFilled,
  IconRoad,
  IconAlertTriangle,
} from "@tabler/icons-react";

interface AdminRoadsInfoHeaderProps {
  activeTab: "roads" | "news";
  onTabChange: (tab: "roads" | "news") => void;
  onAddRoad: () => void;
  onAddNews: () => void;
}

export function AdminRoadsInfoHeader({
  activeTab,
  onTabChange,
  onAddRoad,
  onAddNews,
}: AdminRoadsInfoHeaderProps) {
  return (
    <>
      <div className={`pt-3 ${roadsStyles.headerBar}`}>
        <div className={roadsStyles.headerTextGroup}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
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
              <IconRoad size={22} />
            </span>
            <h2 className="fs-3xl fw-900 color-fg" style={{ margin: 0 }}>
              دليل الطرق والمحاور السريعة والمرور
            </h2>
          </div>
          <p style={{ color: "var(--text-muted, #94a3b8)", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>
            إدارة شبكة الطرق السريعة والمحاور، السرعات المقررة، المحطات، وحالة السيولة والنشرات المرورية
          </p>
        </div>

        <div>
          {activeTab === "roads" ? (
            <button
              type="button"
              onClick={onAddRoad}
              className={clsx("btn btn-primary", roadsStyles.addStationBtn)}
            >
              <IconSquareRoundedPlusFilled size={20} />
              <span>إضافة طريق جديد</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onAddNews}
              className={clsx("btn btn-primary", roadsStyles.addStationBtn)}
            >
              <IconSquareRoundedPlusFilled size={20} />
              <span>إضافة تنبيه مروري جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Segmented Control */}
      <div className={roadsStyles.mainNavTabs}>
        <button
          type="button"
          onClick={() => onTabChange("roads")}
          className={clsx(
            roadsStyles.mainNavBtn,
            activeTab === "roads" && roadsStyles.mainNavBtnActive
          )}
        >
          <IconRoad size={18} />
          <span>شبكة الطرق والمحاور</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("news")}
          className={clsx(
            roadsStyles.mainNavBtn,
            activeTab === "news" && roadsStyles.mainNavBtnActive
          )}
        >
          <IconAlertTriangle size={18} />
          <span>النشرات وتنبيهات المرور</span>
        </button>
      </div>
    </>
  );
}
