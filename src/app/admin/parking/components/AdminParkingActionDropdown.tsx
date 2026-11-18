import React from "react";
import clsx from "clsx";
import { ActionMenuState, ParkingSpot } from "../types";
import parkingStyles from "../admin-parking.module.css";
import { IconListDetailsFilled, IconTrashFilled, IconWritingSignFilled } from "@tabler/icons-react";

interface AdminParkingActionDropdownProps {
  actionMenuState: ActionMenuState | null;
  onClose: () => void;
  onViewSpot: (spot: ParkingSpot) => void;
  onEditSpot: (spot: ParkingSpot) => void;
  onDeleteSpot: (spot: ParkingSpot) => void;
}

export function AdminParkingActionDropdown({
  actionMenuState,
  onClose,
  onViewSpot,
  onEditSpot,
  onDeleteSpot,
}: AdminParkingActionDropdownProps) {
  if (!actionMenuState) return null;

  return (
    <div
      className={parkingStyles.actionDropdownMenu}
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
        className={parkingStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const sp = actionMenuState.spot;
          onClose();
          onViewSpot(sp);
        }}
      >
        <IconListDetailsFilled size={18} />
        <span>عرض التفاصيل والأسعار</span>
      </button>

      <button
        type="button"
        role="menuitem"
        className={parkingStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const sp = actionMenuState.spot;
          onClose();
          onEditSpot(sp);
        }}
      >
        <IconWritingSignFilled size={18} />
        <span>تعديل</span>
      </button>

      <div className={parkingStyles.actionDropdownSeparator} role="separator" />

      <button
        type="button"
        role="menuitem"
        className={clsx(parkingStyles.actionDropdownItem, parkingStyles.actionDropdownItemDestructive)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const sp = actionMenuState.spot;
          onClose();
          onDeleteSpot(sp);
        }}
      >
        <IconTrashFilled size={18} />
        <span>حذف الجراج</span>
      </button>
    </div>
  );
}
