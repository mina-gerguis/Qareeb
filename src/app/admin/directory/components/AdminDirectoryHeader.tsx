import React from "react";
import clsx from "clsx";
import directoryStyles from "../admin-directory.module.css";
import {
  IconSquareRoundedPlusFilled,
  IconPhoneCall,
  IconDeviceMobile,
  IconAddressBook,
} from "@tabler/icons-react";
import { DirectoryTab } from "../types";

interface AdminDirectoryHeaderProps {
  activeTab: DirectoryTab;
  onTabChange: (tab: DirectoryTab) => void;
  onAddPhoneClick: () => void;
  onAddCodeClick: () => void;
  phonesCount: number;
  codesCount: number;
}

export function AdminDirectoryHeader({
  activeTab,
  onTabChange,
  onAddPhoneClick,
  onAddCodeClick,
  phonesCount,
  codesCount,
}: AdminDirectoryHeaderProps) {
  return (
    <div>
      <div className={`pt-3 ${directoryStyles.headerBar}`}>
        <div className={directoryStyles.headerTextGroup}>
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
              <IconAddressBook size={22} />
            </span>
            <h2 className="fs-3xl fw-900 color-fg" style={{ margin: 0 }}>
              دليل الهواتف الخدمية وأكواد الاتصالات
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
            إدارة جهات الطوارئ والخدمات العامة، بالإضافة لأكواد باقات وخدمات شركات الاتصالات الأربعة
          </p>
        </div>

        <button
          type="button"
          onClick={activeTab === "phones" ? onAddPhoneClick : onAddCodeClick}
          className={clsx("btn btn-primary", directoryStyles.addStationBtn)}
        >
          <IconSquareRoundedPlusFilled size={20} />
          <span>
            {activeTab === "phones" ? "إضافة رقم جديد" : "إضافة كود جديد"}
          </span>
        </button>
      </div>

      {/* Main Tabs Segmented Control */}
      <div className={directoryStyles.mainNavTabs}>
        <button
          type="button"
          onClick={() => onTabChange("phones")}
          className={clsx(
            "font-sub",
            directoryStyles.mainNavBtn,
            activeTab === "phones" ? "btn-primary" : directoryStyles.mainNavBtnInactive
          )}
        >
          <IconPhoneCall size={18} />
          <span>أرقام الخدمات</span>
          <span
            style={{
              fontSize: "0.75rem",
              padding: "2px 8px",
              borderRadius: "12px",
              background:
                activeTab === "phones"
                  ? "rgba(255, 255, 255, 0.25)"
                  : "rgba(255, 255, 255, 0.08)",
              color: activeTab === "phones" ? "#fff" : "var(--text-muted)",
              fontWeight: "700",
            }}
          >
            {phonesCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("codes")}
          className={clsx(
            "font-sub",
            directoryStyles.mainNavBtn,
            activeTab === "codes" ? "btn-primary" : directoryStyles.mainNavBtnInactive
          )}
        >
          <IconDeviceMobile size={18} />
          <span>أكواد الشركات</span>
          <span
            style={{
              fontSize: "0.75rem",
              padding: "2px 8px",
              borderRadius: "12px",
              background:
                activeTab === "codes"
                  ? "rgba(255, 255, 255, 0.25)"
                  : "rgba(255, 255, 255, 0.08)",
              color: activeTab === "codes" ? "#fff" : "var(--text-muted)",
              fontWeight: "700",
            }}
          >
            {codesCount}
          </span>
        </button>
      </div>
    </div>
  );
}
