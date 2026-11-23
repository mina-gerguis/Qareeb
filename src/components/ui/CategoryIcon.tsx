"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import * as TablerIcons from "@tabler/icons-react";
import { IconTag } from "@tabler/icons-react";

export interface CategoryIconProps {
  icon?: React.ReactNode | string | React.ElementType | null;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  fallback?: string | React.ReactNode;
}

export function CategoryIcon({
  icon,
  className = "",
  style,
  size = 18,
  fallback = "bx bx-tag",
}: CategoryIconProps) {
  if (!icon) {
    if (React.isValidElement(fallback)) {
      return (
        <span
          className={className}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            verticalAlign: "middle",
            ...style,
          }}
        >
          {React.cloneElement(fallback as React.ReactElement<any>, {
            size: (fallback as any).props?.size ?? size,
          })}
        </span>
      );
    }
    return typeof fallback === "string" && fallback.startsWith("bx") ? (
      <i className={`${fallback} ${className}`} style={style} />
    ) : (
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          verticalAlign: "middle",
          ...style,
        }}
      >
        <IconTag size={size} style={style} />
      </span>
    );
  }

  // 1. If it's already a valid React element: e.g. <IconChefHatFilled /> or <CircleParking />
  if (React.isValidElement(icon)) {
    return (
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          verticalAlign: "middle",
          ...style,
        }}
      >
        {React.cloneElement(icon as React.ReactElement<any>, {
          size: (icon as any).props?.size ?? size,
          style: {
            ...((icon as any).props?.style || {}),
            ...style,
          },
        })}
      </span>
    );
  }

  // 2. If it's a React component function or forwardRef: e.g. IconChefHatFilled or CircleParking
  if (typeof icon === "function" || (typeof icon === "object" && (icon as any)?.$$typeof)) {
    const IconComponent = icon as React.ElementType;
    return (
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          verticalAlign: "middle",
          ...style,
        }}
      >
        <IconComponent size={size} style={style} />
      </span>
    );
  }

  // 3. If it's a string
  if (typeof icon === "string") {
    const trimmed = icon.trim();

    // Check if it's formatted as "<IconName />" or "<IconName/>" or just "IconName"
    const tagMatch = trimmed.match(/^<?([A-Za-z0-9_-]+)(?:\s*\/>|>)?$/);
    const potentialName = tagMatch ? tagMatch[1] : trimmed;

    // Check Tabler Icons first (exact match or with "Icon" prefix)
    const tablerCandidate =
      (TablerIcons as Record<string, any>)[potentialName] ||
      (TablerIcons as Record<string, any>)[`Icon${potentialName}`];

    if (tablerCandidate) {
      const TablerComponent = tablerCandidate;
      return (
        <span
          className={className}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            verticalAlign: "middle",
            ...style,
          }}
        >
          <TablerComponent size={size} style={style} />
        </span>
      );
    }

    // Check Lucide Icons
    if (potentialName && (LucideIcons as Record<string, any>)[potentialName]) {
      const LucideComponent = (LucideIcons as Record<string, any>)[potentialName];
      return (
        <span
          className={className}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            verticalAlign: "middle",
            ...style,
          }}
        >
          <LucideComponent size={size} style={style} />
        </span>
      );
    }

    // FontAwesome icons: fa-*, fas *, far *, fab *
    if (
      trimmed.startsWith("fa-") ||
      trimmed.startsWith("fa ") ||
      trimmed.startsWith("fas ") ||
      trimmed.startsWith("far ") ||
      trimmed.startsWith("fab ")
    ) {
      return <i className={`${trimmed} ${className}`} style={style} />;
    }

    // Boxicons
    if (
      trimmed.startsWith("bx bx-") ||
      trimmed.startsWith("bxs ") ||
      trimmed.startsWith("bxl ") ||
      trimmed.startsWith("bx ")
    ) {
      return <i className={`${trimmed} ${className}`} style={style} />;
    }
    if (trimmed.startsWith("bx-")) {
      return <i className={`bx ${trimmed} ${className}`} style={style} />;
    }

    // Fallback if it's just a raw Boxicon name like "car" -> "bx bx-car"
    return <i className={`bx bx-${trimmed} ${className}`} style={style} />;
  }

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "middle",
        ...style,
      }}
    >
      <IconTag size={size} style={style} />
    </span>
  );
}

export default CategoryIcon;
