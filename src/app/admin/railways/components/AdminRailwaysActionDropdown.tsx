import React from "react";
import clsx from "clsx";
import { ActionMenuState, RailwayRoute } from "../types";
import railwaysStyles from "../admin-railways.module.css";
import { IconListDetailsFilled, IconTrashFilled, IconWritingSignFilled } from "@tabler/icons-react";

interface AdminRailwaysActionDropdownProps {
  actionMenuState: ActionMenuState | null;
  onClose: () => void;
  onViewLine?: (route: RailwayRoute) => void;
  onEditLine?: (route: RailwayRoute) => void;
  onDeleteLine?: (route: RailwayRoute) => void;
  onEditStation?: (station: any) => void;
  onDeleteStation?: (station: any) => void;
}

export function AdminRailwaysActionDropdown({
  actionMenuState,
  onClose,
  onViewLine,
  onEditLine,
  onDeleteLine,
  onEditStation,
  onDeleteStation,
}: AdminRailwaysActionDropdownProps) {
  if (!actionMenuState) return null;

  const isLine = actionMenuState.type === "line";
  const item = actionMenuState.item;

  return (
    <div
      className={railwaysStyles.actionDropdownMenu}
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
      {isLine && (
        <button
          type="button"
          role="menuitem"
          className={railwaysStyles.actionDropdownItem}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
            onViewLine?.(item);
          }}
        >
          <IconListDetailsFilled size={18} />
          <span>عرض تفاصيل المسار</span>
        </button>
      )}

      <button
        type="button"
        role="menuitem"
        className={railwaysStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          if (isLine) {
            onEditLine?.(item);
          } else {
            onEditStation?.(item);
          }
        }}
      >
        <IconWritingSignFilled size={18} />
        <span>تعديل</span>
      </button>

      <div className={railwaysStyles.actionDropdownSeparator} role="separator" />

      <button
        type="button"
        role="menuitem"
        className={clsx(railwaysStyles.actionDropdownItem, railwaysStyles.actionDropdownItemDestructive)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          if (isLine) {
            onDeleteLine?.(item);
          } else {
            onDeleteStation?.(item);
          }
        }}
      >
        <IconTrashFilled size={18} />
        <span>{isLine ? "حذف المسار" : "حذف المحطة"}</span>
      </button>
    </div>
  );
}
