import React from "react";
import clsx from "clsx";
import { ActionMenuState, LrtStation } from "../types";
import lrtStyles from "../admin-lrt.module.css";
import { IconListDetailsFilled, IconTrashFilled, IconWritingSignFilled } from "@tabler/icons-react";

interface AdminLrtActionDropdownProps {
  actionMenuState: ActionMenuState | null;
  onClose: () => void;
  onViewStation: (station: LrtStation) => void;
  onEditStation: (station: LrtStation) => void;
  onDeleteStation: (station: LrtStation) => void;
}

export function AdminLrtActionDropdown({
  actionMenuState,
  onClose,
  onViewStation,
  onEditStation,
  onDeleteStation,
}: AdminLrtActionDropdownProps) {
  if (!actionMenuState) return null;

  return (
    <div
      className={lrtStyles.actionDropdownMenu}
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
        className={lrtStyles.actionDropdownItem}
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
        className={lrtStyles.actionDropdownItem}
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

      <div className={lrtStyles.actionDropdownSeparator} role="separator" />

      <button
        type="button"
        role="menuitem"
        className={clsx(lrtStyles.actionDropdownItem, lrtStyles.actionDropdownItemDestructive)}
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
