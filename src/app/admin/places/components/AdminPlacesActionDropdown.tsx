import React from "react";
import clsx from "clsx";
import { ActionMenuState, DBPlace } from "../types";
import styles from "../admin-places.module.css";
import {
  IconListDetailsFilled,
  IconTrashFilled,
  IconWritingSignFilled,
  IconMapPin,
  IconBuildingStore
} from "@tabler/icons-react";

interface Props {
  actionMenu: ActionMenuState;
  onClose: () => void;
  onViewPlace: (place: DBPlace) => void;
  onEditPlace: (place: DBPlace) => void;
  onOpenBranches: (place: DBPlace) => void;
  onDeletePlace: (place: DBPlace) => void;
}

export const AdminPlacesActionDropdown: React.FC<Props> = ({
  actionMenu,
  onClose,
  onViewPlace,
  onEditPlace,
  onOpenBranches,
  onDeletePlace,
}) => {
  if (!actionMenu.place) return null;
  const place = actionMenu.place;

  return (
    <div
      className={styles.actionDropdownMenu}
      style={{
        position: "fixed",
        top: `${actionMenu.top}px`,
        left: `${actionMenu.left}px`,
        zIndex: 99999,
      }}
      role="menu"
      dir="rtl"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Details */}
      <button
        type="button"
        role="menuitem"
        className={styles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onViewPlace(place);
        }}
      >
        <IconListDetailsFilled size={18} />
        <span>عرض التفاصيل</span>
      </button>

      {/* Edit */}
      <button
        type="button"
        role="menuitem"
        className={styles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onEditPlace(place);
        }}
      >
        <IconWritingSignFilled size={18} />
        <span>تعديل البيانات</span>
      </button>

      {/* Manage Branches */}
      <button
        type="button"
        role="menuitem"
        className={styles.actionDropdownItem}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onOpenBranches(place);
        }}
      >
        <IconBuildingStore size={18} />
        <span>إدارة الفروع ({place.branches?.length || 1})</span>
      </button>

      {/* Google Maps link if exists */}
      {place.google_maps_url && (
        <a
          href={place.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          role="menuitem"
          className={styles.actionDropdownItem}
          onClick={() => onClose()}
          style={{ textDecoration: "none" }}
        >
          <IconMapPin size={18} />
          <span>فتح في Google Maps</span>
        </a>
      )}

      {/* Delete */}
      <button
        type="button"
        role="menuitem"
        className={clsx(styles.actionDropdownItem, styles.actionDropdownDanger)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onDeletePlace(place);
        }}
      >
        <IconTrashFilled size={18} />
        <span>حذف المكان</span>
      </button>
    </div>
  );
};
