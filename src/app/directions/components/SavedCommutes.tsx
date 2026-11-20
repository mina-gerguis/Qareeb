"use client";

import React, { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "qareeb_saved_commutes_v1";
const MAX_SAVED = 5;

interface Commute {
  from: string;
  to: string;
}

interface SavedCommutesProps {
  fromInput: string;
  toInput: string;
  searchTriggered: boolean;
  onSelect: (from: string, to: string) => void;
}

function readSaved(): Commute[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((c) => c && typeof c.from === "string" && typeof c.to === "string")
      .slice(0, MAX_SAVED);
  } catch {
    return [];
  }
}

/** مشاويري المحفوظة: بتتخزن على جهاز المستخدم (localStorage) ومفيش أي بيانات بتتبعت لسيرفر. */
export default function SavedCommutes({ fromInput, toInput, searchTriggered, onSelect }: SavedCommutesProps) {
  const [saved, setSaved] = useState<Commute[]>([]);

  useEffect(() => {
    setSaved(readSaved());
  }, []);

  const persist = useCallback((next: Commute[]) => {
    setSaved(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* التخزين ممتلئ أو ممنوع */
    }
  }, []);

  const from = fromInput.trim();
  const to = toInput.trim();
  const alreadySaved = saved.some((c) => c.from === from && c.to === to);
  const canSave = searchTriggered && !!from && !!to && !alreadySaved;

  if (saved.length === 0 && !canSave) return null;

  return (
    <section
      dir="rtl"
      aria-label="مشاويري المحفوظة"
      style={{
        margin: "0 auto 20px",
        maxWidth: "900px",
        padding: "14px 16px",
        background: "var(--bg-glass-card)",
        border: "1px solid var(--border-glass)",
        borderRadius: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
        <strong style={{ color: "var(--color-fg)", fontSize: "0.95rem" }}>⭐ مشاويري المحفوظة</strong>
        {canSave && (
          <button
            type="button"
            onClick={() => persist([{ from, to }, ...saved].slice(0, MAX_SAVED))}
            style={{
              border: "1px solid var(--color-primary)",
              background: "transparent",
              color: "var(--color-primary)",
              padding: "6px 14px",
              borderRadius: "10px",
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            احفظ المشوار ده
          </button>
        )}
      </div>

      {saved.length > 0 && (
        <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0, display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {saved.map((c, i) => (
            <li
              key={`${c.from}->${c.to}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid var(--border-glass)",
                borderRadius: "9999px",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => onSelect(c.from, c.to)}
                title="ابحث عن المشوار ده"
                style={{
                  border: 0,
                  background: "transparent",
                  color: "var(--color-fg)",
                  padding: "7px 14px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.85rem",
                }}
              >
                {c.from} ← {c.to}
              </button>
              <button
                type="button"
                aria-label={`احذف مشوار ${c.from} إلى ${c.to}`}
                onClick={() => persist(saved.filter((_, idx) => idx !== i))}
                style={{
                  border: 0,
                  borderRight: "1px solid var(--border-glass)",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  padding: "7px 10px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
