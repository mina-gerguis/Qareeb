import React from "react";
import { ActionMenuState, PhoneEntry, TelecomCodeEntry } from "../types";
import directoryStyles from "../admin-directory.module.css";
import {
  IconListDetailsFilled,
  IconTrashFilled,
  IconWritingSignFilled,
  IconPhoneCall,
  IconCopy,
} from "@tabler/icons-react";

interface AdminDirectoryActionDropdownProps {
  actionMenuState: ActionMenuState;
  onClose: () => void;
  onViewPhone: (phone: PhoneEntry) => void;
  onEditPhone: (phone: PhoneEntry) => void;
  onDeletePhone: (phone: PhoneEntry) => void;
  onViewCode: (code: TelecomCodeEntry) => void;
  onEditCode: (code: TelecomCodeEntry) => void;
  onDeleteCode: (code: TelecomCodeEntry) => void;
}

export function AdminDirectoryActionDropdown({
  actionMenuState,
  onClose,
  onViewPhone,
  onEditPhone,
  onDeletePhone,
  onViewCode,
  onEditCode,
  onDeleteCode,
}: AdminDirectoryActionDropdownProps) {
  if (!actionMenuState) return null;

  const { type, top, left } = actionMenuState;

  return (
    <div
      className={directoryStyles.actionDropdownMenu}
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
      {type === "phone" ? (
        <>
          <button
            type="button"
            role="menuitem"
            className={directoryStyles.actionDropdownItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
              onViewPhone(actionMenuState.item);
            }}
          >
            <IconListDetailsFilled size={18} />
            <span>عرض التفاصيل</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className={directoryStyles.actionDropdownItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
              onEditPhone(actionMenuState.item);
            }}
          >
            <IconWritingSignFilled size={18} />
            <span>تعديل الجهة</span>
          </button>

          <a
            href={`tel:${actionMenuState.item.phone_number}`}
            role="menuitem"
            className={directoryStyles.actionDropdownItem}
            style={{ color: "#10b981", textDecoration: "none" }}
            onClick={() => onClose()}
          >
            <IconPhoneCall size={18} />
            <span>اتصال ({actionMenuState.item.phone_number})</span>
          </a>

          <div
            style={{
              height: "1px",
              background: "var(--border-glass)",
              margin: "4px 0",
            }}
          />

          <button
            type="button"
            role="menuitem"
            className={directoryStyles.actionDropdownItemDanger}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
              onDeletePhone(actionMenuState.item);
            }}
          >
            <IconTrashFilled size={18} />
            <span>حذف الرقم</span>
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            role="menuitem"
            className={directoryStyles.actionDropdownItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
              onViewCode(actionMenuState.item);
            }}
          >
            <IconListDetailsFilled size={18} />
            <span>عرض التفاصيل</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className={directoryStyles.actionDropdownItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
              onEditCode(actionMenuState.item);
            }}
          >
            <IconWritingSignFilled size={18} />
            <span>تعديل الكود</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className={directoryStyles.actionDropdownItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const raw = actionMenuState.item.code.split(" | ")[0] || actionMenuState.item.code;
              navigator.clipboard.writeText(raw);
              onClose();
            }}
          >
            <IconCopy size={18} />
            <span>نسخ الكود</span>
          </button>

          <div
            style={{
              height: "1px",
              background: "var(--border-glass)",
              margin: "4px 0",
            }}
          />

          <button
            type="button"
            role="menuitem"
            className={directoryStyles.actionDropdownItemDanger}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
              onDeleteCode(actionMenuState.item);
            }}
          >
            <IconTrashFilled size={18} />
            <span>حذف الكود</span>
          </button>
        </>
      )}
    </div>
  );
}
