import React from "react";
import clsx from "clsx";
import railwaysStyles from "../admin-railways.module.css";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import { RailwayRoute } from "../types";

interface AdminRailwaysHeaderProps {
  activeSection: "lines" | "stations";
  onSectionChange: (section: "lines" | "stations") => void;
  activeRoute?: RailwayRoute;
  onOpenAddLine: () => void;
  onOpenAddStation: () => void;
}

export function AdminRailwaysHeader({
  activeSection,
  onSectionChange,
  activeRoute,
  onOpenAddLine,
  onOpenAddStation,
}: AdminRailwaysHeaderProps) {
  return (
    <>
      {/* Header Action Row */}
      <div className={`pt-3 ${railwaysStyles.headerBar}`}>
        <div className={railwaysStyles.headerTextGroup}>
          <h2 className="fs-3xl fw-900 color-fg">
            {activeSection === "lines"
              ? "إدارة مسارات سكك حديد مصر"
              : `إدارة محطات ${activeRoute ? activeRoute.name : "المسار المحدد"}`}
          </h2>
        </div>

        {activeSection === "lines" ? (
          <button
            type="button"
            onClick={onOpenAddLine}
            className={clsx("btn btn-primary", railwaysStyles.addStationBtn)}
          >
            <IconSquareRoundedPlusFilled size={20} />
            <span>إضافة مسار جديد</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAddStation}
            className={clsx("btn btn-primary", railwaysStyles.addStationBtn)}
            disabled={!activeRoute}
          >
            <IconSquareRoundedPlusFilled size={20} />
            <span>إضافة محطة جديدة</span>
          </button>
        )}
      </div>

      {/* Upper Navigation Tabs */}
      <div className={railwaysStyles.mainNavTabs}>
        <button
          type="button"
          onClick={() => onSectionChange("lines")}
          className={clsx(
            "font-sub",
            railwaysStyles.mainNavBtn,
            activeSection === "lines" ? "btn-primary" : railwaysStyles.mainNavBtnInactive
          )}
        >
          <span>إدارة المسارات والخطوط</span>
        </button>
        <button
          type="button"
          onClick={() => onSectionChange("stations")}
          className={clsx(
            "font-sub",
            railwaysStyles.mainNavBtn,
            activeSection === "stations" ? "btn-primary" : railwaysStyles.mainNavBtnInactive
          )}
        >
          <span>إدارة محطات التوقف</span>
        </button>
      </div>
    </>
  );
}
