import { IconLoader2 } from "@tabler/icons-react";
import React from "react";

export function AdminMetroLoading() {
  return (
    <div
      className="p-11 flex color-fg items-center justify-center" 
    
    >
      <IconLoader2 stroke={2} />
      <span className="fw-bold font-sub">جاري تحميل إدارة شبكة مترو الأنفاق...</span>
    </div>
  );
}

