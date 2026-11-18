import { IconLoader2 } from "@tabler/icons-react";
import React from "react";

export function AdminMonorailLoading() {
  return (
    <div className="p-11 flex color-fg items-center justify-center">
      <IconLoader2 stroke={2} />
      <span className="fw-bold font-sub" style={{ marginRight: "10px" }}>جاري تحميل إدارة شبكة المونوريل...</span>
    </div>
  );
}
