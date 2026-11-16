import React from "react";
import clsx from "clsx";
import metroStyles from "../admin-metro.module.css";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";

interface AdminMetroHeaderProps {
  activeSection: "stations" | "pricing";
  onSectionChange: (section: "stations" | "pricing") => void;
  onAddStationClick: () => void;
}

export function AdminMetroHeader({
  activeSection,
  onSectionChange,
  onAddStationClick,
}: AdminMetroHeaderProps) {
  return (
    <>
      {/* Header Action Row for Stations */}
      {activeSection === "stations" && (
        <div className={`pt-3 ${metroStyles.headerBar}`}>
          <div className={metroStyles.headerTextGroup}>
            <h2 className="fs-3xl fw-900 color-fg">إدارة محطات المترو</h2>
          </div>
          <button
            type="button"
            onClick={onAddStationClick}
            className={clsx("btn btn-primary", metroStyles.addStationBtn)}
          >
            <IconSquareRoundedPlusFilled size={20}/>
            <span>إضافة محطة مترو جديدة</span>
          </button>
        </div>
      )}

      {/* Upper Navigation Tabs */}
      <div className={metroStyles.mainNavTabs}>
        <button
          type="button"
          onClick={() => onSectionChange("stations")}
          className={clsx("font-sub",
            metroStyles.mainNavBtn,
            activeSection === "stations" ? "btn-primary" : metroStyles.mainNavBtnInactive
          )}
        >
          <span>إدارة المحطات والخطوط</span>
        </button>
        <button
          type="button"
          onClick={() => onSectionChange("pricing")}
          className={clsx("font-sub",
            metroStyles.mainNavBtn,
            activeSection === "pricing" ? "btn-primary" : metroStyles.mainNavBtnInactive
          )}
        >
          <span>إدارة أسعار التذاكر</span>
        </button>
      </div>
    </>
  );
}

