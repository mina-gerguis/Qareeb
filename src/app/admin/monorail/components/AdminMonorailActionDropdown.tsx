import React from "react";
import clsx from "clsx";
import { ActionMenuState, MonorailStation } from "../types";
import monorailStyles from "../admin-monorail.module.css";
import { IconListDetailsFilled, IconTrashFilled, IconWritingSignFilled } from "@tabler/icons-react";

interface AdminMonorailActionDropdownProps {
  actionMenuState: ActionMenuState | null;
  onClose: () => void;
  onViewStation: (station: MonorailStation) => void;
  onEditStation: (station: MonorailStation) => void;
  onDeleteStation: (station: MonorailStation) => void;
}

export function AdminMonorailActionDropdown({
  actionMenuState,
  onClose,
  onViewStation,
  onEditStation,
  onDeleteStation,
}: AdminMonorailActionDropdownProps) {
  if (!actionMenuState) return null;

  return (
    <div
      className={monorailStyles.actionDropdownMenu}
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
        className={monorailStyles.actionDropdownItem}
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
        className={monorailStyles.actionDropdownItem}
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

      <div className={monorailStyles.actionDropdownSeparator} role="separator" />

      <button
        type="button"
        role="menuitem"
        className={clsx(monorailStyles.actionDropdownItem, monorailStyles.actionDropdownItemDestructive)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const st = actionMenuState.station;
          onClose();
          onDeleteStation(st);
        }}
      >
        <IconTrashFilled size={18} />
        <span>حذف المحطة</span>
      </button>
    </div>
  );
}
