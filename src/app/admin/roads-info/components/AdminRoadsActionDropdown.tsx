import React from "react";
import clsx from "clsx";
import roadsStyles from "../admin-roads-info.module.css";
import { IconListDetailsFilled, IconTrashFilled, IconWritingSignFilled } from "@tabler/icons-react";

interface AdminRoadsActionDropdownProps {
  isOpen: boolean;
  position: { top: number; left: number } | null;
  onClose: () => void;
  onView?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleteLabel?: string;
}

export function AdminRoadsActionDropdown({
  isOpen,
  position,
  onClose,
  onView,
  onEdit,
  onDelete,
  deleteLabel = "حذف العنصر",
}: AdminRoadsActionDropdownProps) {
  if (!isOpen || !position) return null;

  return (
    <div
      className={roadsStyles.actionDropdownMenu}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      role="menu"
      dir="rtl"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {onView && (
        <button
          type="button"
          role="menuitem"
          className={roadsStyles.actionDropdownItem}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
            onView();
          }}
        >
          <IconListDetailsFilled size={18} />
          <span>عرض التفاصيل</span>
        </button>
      )}

      <button
        type="button"
        role="menuitem"
        className={roadsStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onEdit();
        }}
      >
        <IconWritingSignFilled size={18} />
        <span>تعديل</span>
      </button>

      <div className={roadsStyles.actionDropdownSeparator} role="separator" />

      <button
        type="button"
        role="menuitem"
        className={clsx(roadsStyles.actionDropdownItem, roadsStyles.actionDropdownItemDestructive)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onDelete();
        }}
      >
        <IconTrashFilled size={18} />
        <span>{deleteLabel}</span>
      </button>
    </div>
  );
}
