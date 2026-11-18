import React from "react";
import clsx from "clsx";
import { ActionMenuState, PortItem } from "../types";
import portsStyles from "../admin-ports.module.css";
import {
  IconListDetailsFilled,
  IconTrashFilled,
  IconWritingSignFilled,
} from "@tabler/icons-react";

interface AdminPortsActionDropdownProps {
  actionMenuState: ActionMenuState | null;
  onClose: () => void;
  onViewPort: (port: PortItem) => void;
  onEditPort: (port: PortItem) => void;
  onDeletePort: (port: PortItem) => void;
}

export function AdminPortsActionDropdown({
  actionMenuState,
  onClose,
  onViewPort,
  onEditPort,
  onDeletePort,
}: AdminPortsActionDropdownProps) {
  if (!actionMenuState) return null;

  const { item, top, left } = actionMenuState;

  return (
    <div
      className={portsStyles.actionDropdownMenu}
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
        className={portsStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onViewPort(item);
        }}
      >
        <IconListDetailsFilled size={18} />
        <span>عرض التفاصيل</span>
      </button>

      <button
        type="button"
        role="menuitem"
        className={portsStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onEditPort(item);
        }}
      >
        <IconWritingSignFilled size={18} />
        <span>تعديل الميناء</span>
      </button>

      <div className={portsStyles.actionDropdownSeparator} role="separator" />

      <button
        type="button"
        role="menuitem"
        className={clsx(portsStyles.actionDropdownItem, portsStyles.actionDropdownItemDestructive)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onDeletePort(item);
        }}
      >
        <IconTrashFilled size={18} />
        <span>حذف الميناء</span>
      </button>
    </div>
  );
}
