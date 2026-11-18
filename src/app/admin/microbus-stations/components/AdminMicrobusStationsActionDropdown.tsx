import React from "react";
import clsx from "clsx";
import { ActionMenuState, AdminMicrobusStation } from "../types";
import microStyles from "../admin-microbus-stations.module.css";
import { IconListDetailsFilled, IconTrashFilled, IconWritingSignFilled } from "@tabler/icons-react";

interface AdminMicrobusStationsActionDropdownProps {
  actionMenuState: ActionMenuState | null;
  onClose: () => void;
  onViewStation: (station: AdminMicrobusStation) => void;
  onEditStation: (station: AdminMicrobusStation) => void;
  onDeleteStation: (station: AdminMicrobusStation) => void;
}

export function AdminMicrobusStationsActionDropdown({
  actionMenuState,
  onClose,
  onViewStation,
  onEditStation,
  onDeleteStation,
}: AdminMicrobusStationsActionDropdownProps) {
  if (!actionMenuState) return null;

  return (
    <div
      className={microStyles.actionDropdownMenu}
      style={{
        top: `${actionMenuState.top}px`,
        left: `${actionMenuState.left}px`,
      }}
      role="menu"
      dir="rtl"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        role="menuitem"
        className={microStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const st = actionMenuState.station;
          onClose();
          onViewStation(st);
        }}
      >
        <IconListDetailsFilled size={18} />
        <span>عرض التفاصيل والخطوط</span>
      </button>

      <button
        type="button"
        role="menuitem"
        className={microStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const st = actionMenuState.station;
          onClose();
          onEditStation(st);
        }}
      >
        <IconWritingSignFilled size={18} />
        <span>تعديل</span>
      </button>

      <div className={microStyles.actionDropdownSeparator} role="separator" />

      <button
        type="button"
        role="menuitem"
        className={clsx(microStyles.actionDropdownItem, microStyles.actionDropdownItemDestructive)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const st = actionMenuState.station;
          onClose();
          onDeleteStation(st);
        }}
      >
        <IconTrashFilled size={18} />
        <span>حذف الموقف</span>
      </button>
    </div>
  );
}
