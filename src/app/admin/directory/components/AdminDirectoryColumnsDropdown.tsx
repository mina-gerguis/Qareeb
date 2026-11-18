import React from "react";
import { Check } from "lucide-react";
import {
  DirectoryTab,
  VisibleColumnsPhones,
  VisibleColumnsCodes,
  ColumnsMenuPosition,
} from "../types";
import directoryStyles from "../admin-directory.module.css";

interface AdminDirectoryColumnsDropdownProps {
  isOpen: boolean;
  position: ColumnsMenuPosition | null;
  activeTab: DirectoryTab;
  visiblePhoneColumns: VisibleColumnsPhones;
  onTogglePhoneColumn: (key: keyof VisibleColumnsPhones) => void;
  visibleCodeColumns: VisibleColumnsCodes;
  onToggleCodeColumn: (key: keyof VisibleColumnsCodes) => void;
}

export function AdminDirectoryColumnsDropdown({
  isOpen,
  position,
  activeTab,
  visiblePhoneColumns,
  onTogglePhoneColumn,
  visibleCodeColumns,
  onToggleCodeColumn,
}: AdminDirectoryColumnsDropdownProps) {
  if (!isOpen || !position) return null;

  const phoneColumnsList: { key: keyof VisibleColumnsPhones; label: string }[] = [
    { key: "select", label: "تحديد السجل" },
    { key: "logo", label: "اللوجو أو الشعار" },
    { key: "name", label: "الاسم والجهة" },
    { key: "specialty", label: "التخصص الخدمي" },
    { key: "phone", label: "رقم الهاتف / الخط الساخن" },
    { key: "actions", label: "زر الإجراءات" },
  ];

  const codeColumnsList: { key: keyof VisibleColumnsCodes; label: string }[] = [
    { key: "select", label: "تحديد السجل" },
    { key: "company", label: "شركة الاتصالات" },
    { key: "section", label: "اسم القسم" },
    { key: "title", label: "اسم الخدمة" },
    { key: "code", label: "الكود الرقمي" },
    { key: "actions", label: "زر الإجراءات" },
  ];

  return (
    <div
      className={directoryStyles.columnsDropdownMenu}
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
      <div className={directoryStyles.columnsDropdownHeader}>
        إظهار / إخفاء الأعمدة ({activeTab === "phones" ? "دليل الأرقام" : "أكواد الاتصالات"})
      </div>

      {activeTab === "phones"
        ? phoneColumnsList.map(({ key, label }) => {
            const isChecked = visiblePhoneColumns[key];
            return (
              <button
                key={key}
                type="button"
                role="menuitemcheckbox"
                aria-checked={isChecked}
                className={directoryStyles.columnsDropdownItem}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTogglePhoneColumn(key);
                }}
              >
                <span className={directoryStyles.columnsCheckIcon}>
                  {isChecked && <Check className="h-4 w-4" />}
                </span>
                <span>{label}</span>
              </button>
            );
          })
        : codeColumnsList.map(({ key, label }) => {
            const isChecked = visibleCodeColumns[key];
            return (
              <button
                key={key}
                type="button"
                role="menuitemcheckbox"
                aria-checked={isChecked}
                className={directoryStyles.columnsDropdownItem}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleCodeColumn(key);
                }}
              >
                <span className={directoryStyles.columnsCheckIcon}>
                  {isChecked && <Check className="h-4 w-4" />}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
    </div>
  );
}
