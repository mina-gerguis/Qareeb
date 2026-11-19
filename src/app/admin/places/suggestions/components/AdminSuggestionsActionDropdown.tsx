import React from "react";
import clsx from "clsx";
import { ActionMenuState, PlaceProposal, UserProfile } from "../types";
import suggestionsStyles from "../admin-suggestions.module.css";
import {
  IconListDetailsFilled,
  IconCheck,
  IconX,
  IconTrashFilled,
  IconUser,
} from "@tabler/icons-react";

interface AdminSuggestionsActionDropdownProps {
  actionMenuState: ActionMenuState | null;
  onClose: () => void;
  onViewDetails: (proposal: PlaceProposal) => void;
  onViewProposer: (userProfile: UserProfile | null, userId: string) => void;
  onApprove: (proposal: PlaceProposal) => void;
  onReject: (proposal: PlaceProposal) => void;
  onDelete: (proposal: PlaceProposal) => void;
}

export function AdminSuggestionsActionDropdown({
  actionMenuState,
  onClose,
  onViewDetails,
  onViewProposer,
  onApprove,
  onReject,
  onDelete,
}: AdminSuggestionsActionDropdownProps) {
  if (!actionMenuState) return null;

  const { proposal, top, left } = actionMenuState;

  return (
    <div
      className={suggestionsStyles.actionDropdownMenu}
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
        className={suggestionsStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onViewDetails(proposal);
        }}
      >
        <IconListDetailsFilled size={18} />
        <span>عرض التفاصيل</span>
      </button>

      {proposal.status === "pending" && (
        <>
          <button
            type="button"
            role="menuitem"
            className={suggestionsStyles.actionDropdownItem}
            style={{ color: "#10b981" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
              onApprove(proposal);
            }}
          >
            <IconCheck size={18} />
            <span>موافقة ونشر المكان</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className={suggestionsStyles.actionDropdownItem}
            style={{ color: "#f59e0b" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
              onReject(proposal);
            }}
          >
            <IconX size={18} />
            <span>رفض الاقتراح</span>
          </button>
        </>
      )}

      <button
        type="button"
        role="menuitem"
        className={suggestionsStyles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onViewProposer(proposal.user_profile || null, proposal.user_id);
        }}
      >
        <IconUser size={18} />
        <span>بروفايل صاحب الاقتراح</span>
      </button>

      <div className={suggestionsStyles.actionDropdownSeparator} role="separator" />

      <button
        type="button"
        role="menuitem"
        className={clsx(
          suggestionsStyles.actionDropdownItem,
          suggestionsStyles.actionDropdownItemDestructive
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onDelete(proposal);
        }}
      >
        <IconTrashFilled size={18} />
        <span>حذف الاقتراح</span>
      </button>
    </div>
  );
}
