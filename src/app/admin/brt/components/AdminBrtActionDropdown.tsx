import React from "react";
import clsx from "clsx";
import { ActionMenuState, AdminBrtStation } from "../types";
import brtStyles from "../admin-brt.module.css";
import { IconListDetailsFilled, IconTrashFilled, IconWritingSignFilled } from "@tabler/icons-react";

interface AdminBrtActionDropdownProps {
  actionMenuState: ActionMenuState | null;
  onClose: () => void;
  onViewStation: (station: AdminBrtStation) => void;
  onEditStation: (station: AdminBrtStation) => void;
  onDeleteStation: (station: AdminBrtStation) => void;
}

export function AdminBrtActionDropdown({
  actionMenuState,
  onClose,
  onViewStation,
  onEditStation,
  onDeleteStation,
}: AdminBrtActionDropdownProps) {
  if (!actionMenuState) return null;

  return (
    <div
      className={brtStyles.actionDropdownMenu}
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
        className={brtStyles.actionDropdownItem}
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
        className={brtStyles.actionDropdownItem}
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

      <div className={brtStyles.actionDropdownSeparator} role="separator" />

      <button
        type="button"
        role="menuitem"
        className={clsx(brtStyles.actionDropdownItem, brtStyles.actionDropdownItemDestructive)}
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
