import React from "react";
import clsx from "clsx";
import lrtStyles from "../admin-lrt.module.css";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";

interface AdminLrtHeaderProps {
  activeSection: "stations" | "pricing";
  onSectionChange: (section: "stations" | "pricing") => void;
  onAddStationClick: () => void;
}

export function AdminLrtHeader({
  activeSection,
  onSectionChange,
  onAddStationClick,
}: AdminLrtHeaderProps) {
  return (
    <>
      {/* Header Action Row for Stations */}
      {activeSection === "stations" && (
        <div className={`pt-3 ${lrtStyles.headerBar}`}>
          <div className={lrtStyles.headerTextGroup}>
            <h2 className="fs-3xl fw-900 color-fg">إدارة محطات القطار الكهربائي LRT</h2>
          </div>
          <button
            type="button"
            onClick={onAddStationClick}
            className={clsx("btn btn-primary", lrtStyles.addStationBtn)}
          >
            <IconSquareRoundedPlusFilled size={20} />
            <span>إضافة محطة قطار جديدة</span>
          </button>
        </div>
      )}

      {/* Upper Navigation Tabs */}
      <div className={lrtStyles.mainNavTabs}>
        <button
          type="button"
          onClick={() => onSectionChange("stations")}
          className={clsx(
            "font-sub",
            lrtStyles.mainNavBtn,
            activeSection === "stations" ? "btn-primary" : lrtStyles.mainNavBtnInactive
          )}
        >
          <span>إدارة المحطات والمسارات</span>
        </button>
        <button
          type="button"
          onClick={() => onSectionChange("pricing")}
          className={clsx(
            "font-sub",
            lrtStyles.mainNavBtn,
            activeSection === "pricing" ? "btn-primary" : lrtStyles.mainNavBtnInactive
          )}
        >
          <span>إدارة أسعار التذاكر</span>
        </button>
      </div>
    </>
  );
}
