import React from "react";
import clsx from "clsx";
import monorailStyles from "../admin-monorail.module.css";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";

interface AdminMonorailHeaderProps {
  activeSection: "stations" | "pricing";
  onSectionChange: (section: "stations" | "pricing") => void;
  onAddStationClick: () => void;
}

export function AdminMonorailHeader({
  activeSection,
  onSectionChange,
  onAddStationClick,
}: AdminMonorailHeaderProps) {
  return (
    <>
      {/* Header Action Row for Stations */}
      {activeSection === "stations" && (
        <div className={`pt-3 ${monorailStyles.headerBar}`}>
          <div className={monorailStyles.headerTextGroup}>
            <h2 className="fs-3xl fw-900 color-fg">إدارة محطات المونوريل</h2>
          </div>
          <button
            type="button"
            onClick={onAddStationClick}
            className={clsx("btn btn-primary", monorailStyles.addStationBtn)}
          >
            <IconSquareRoundedPlusFilled size={20} />
            <span>إضافة محطة مونوريل جديدة</span>
          </button>
        </div>
      )}

      {/* Upper Navigation Tabs */}
      <div className={monorailStyles.mainNavTabs}>
        <button
          type="button"
          onClick={() => onSectionChange("stations")}
          className={clsx(
            "font-sub",
            monorailStyles.mainNavBtn,
            activeSection === "stations" ? "btn-primary" : monorailStyles.mainNavBtnInactive
          )}
        >
          <span>إدارة المحطات والمسارات</span>
        </button>
        <button
          type="button"
          onClick={() => onSectionChange("pricing")}
          className={clsx(
            "font-sub",
            monorailStyles.mainNavBtn,
            activeSection === "pricing" ? "btn-primary" : monorailStyles.mainNavBtnInactive
          )}
        >
          <span>إدارة أسعار التذاكر</span>
        </button>
      </div>
    </>
  );
}
