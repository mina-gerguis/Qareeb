import React from "react";
import clsx from "clsx";
import { ActionMenuState, BusStation } from "../types";
import busStyles from "../admin-bus-stations.module.css";
import { IconListDetailsFilled, IconTrashFilled, IconWritingSignFilled } from "@tabler/icons-react";

interface AdminBusStationsActionDropdownProps {
  actionMenuState: ActionMenuState | null;
  onClose: () => void;
  onViewStation: (station: BusStation) => void;
  onEditStation: (station: BusStation) => void;
  onDeleteStation: (station: BusStation) => void;
}

export function AdminBusStationsActionDropdown({
  actionMenuState,
  onClose,
  onViewStation,
  onEditStation,
  onDeleteStation,
}: AdminBusStationsActionDropdownProps) {
  if (!actionMenuState) return null;

  return (
    <div
      className={busStyles.actionDropdownMenu}
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
        className={busStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const st = actionMenuState.station;
          onClose();
          onViewStation(st);
        }}
      >
        <IconListDetailsFilled size={18} />
        <span>عرض التفاصيل</span>
      </button>

      <button
        type="button"
        role="menuitem"
        className={busStyles.actionDropdownItem}
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

      <div className={busStyles.actionDropdownSeparator} role="separator" />

      <button
        type="button"
        role="menuitem"
        className={clsx(busStyles.actionDropdownItem, busStyles.actionDropdownItemDestructive)}
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
