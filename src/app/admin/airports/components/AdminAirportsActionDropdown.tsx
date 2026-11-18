import React from "react";
import clsx from "clsx";
import { ActionMenuState, Airport } from "../types";
import airportsStyles from "../admin-airports.module.css";
import {
  IconListDetailsFilled,
  IconTrashFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminAirportsActionDropdownProps {
  actionMenuState: ActionMenuState | null;
  onClose: () => void;
  onViewAirport: (airport: Airport) => void;
  onEditAirport: (airport: Airport) => void;
  onDeleteAirport: (airport: Airport) => void;
}

export function AdminAirportsActionDropdown({
  actionMenuState,
  onClose,
  onViewAirport,
  onEditAirport,
  onDeleteAirport,
}: AdminAirportsActionDropdownProps) {
  if (!actionMenuState) return null;

  const { item, top, left } = actionMenuState;

  return (
    <div
      className={airportsStyles.actionDropdownMenu}
      style={{
        top: `${top}px`,
        left: `${left}px`,
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
        className={airportsStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onViewAirport(item);
        }}
      >
        <IconListDetailsFilled size={18} />
        <span>عرض التفاصيل</span>
      </button>

      <button
        type="button"
        role="menuitem"
        className={airportsStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onEditAirport(item);
        }}
      >
        <IconWritingSignFilled size={18} />
        <span>تعديل المطار</span>
      </button>

      <div className={airportsStyles.actionDropdownSeparator} role="separator" />

      <button
        type="button"
        role="menuitem"
        className={clsx(airportsStyles.actionDropdownItem, airportsStyles.actionDropdownItemDestructive)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onDeleteAirport(item);
        }}
      >
        <IconTrashFilled size={18} />
        <span>حذف المطار</span>
      </button>
    </div>
  );
}
