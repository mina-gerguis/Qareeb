"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_PLANS, FREE_TRIAL_ANNOUNCEMENT, type PlanInfo } from "./plans";
import styles from "./pricing.module.css";

type Period = "monthly" | "yearly";

interface DbPlan {
  id: string;
  name?: string;
  price_daily?: number | string | null;
  price_monthly?: number | string | null;
  price_yearly?: number | string | null;
  features?: string[] | null;
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatPrice(p: number | null, suffix: string) {
  if (p === null) return <span className={styles.soon}>السعر قريباً</span>;
  if (p === 0) return <span className={styles.price}>مجاناً</span>;
  return (
    <>
      <span className={styles.price}>{p.toLocaleString("ar-EG")}</span>
      <span className={styles.currency}> جنيه{suffix}</span>
    </>
  );
}

export default function PricingClient() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>("monthly");
  const [plans, setPlans] = useState<PlanInfo[]>(DEFAULT_PLANS);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.from("subscription_plans").select("*");
        if (cancelled || !data || data.length === 0) return;
        const rows = data as DbPlan[];
        setPlans(
          DEFAULT_PLANS.map((p) => {
            const row = rows.find((r) => r.id === p.id);
            if (!row || p.id === "free") return p;
            // سعر 0 في الجدول لفترة غير مدعومة يعني "غير متاح" وليس مجاني
            const nz = (v: unknown) => {
              const n = toNum(v);
              return n && n > 0 ? n : null;
            };
            return {
              ...p,
              name: row.name || p.name,
              priceDaily: nz(row.price_daily),
              priceMonthly: nz(row.price_monthly),
              priceYearly: nz(row.price_yearly),
              features: row.features && row.features.length ? row.features : p.features,
            };
          })
        );
      } catch (e) {
        console.error("pricing: failed to load plans", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ctaHref = user ? "/profile" : "/signup";
  const gold = plans.find((x) => x.id === "gold");
  const yearlySaving =
    gold && gold.priceMonthly && gold.priceYearly
      ? Math.max(0, Math.round((1 - gold.priceYearly / (gold.priceMonthly * 12)) * 100))
      : 0;

  return (
    <main className={styles.container} dir="rtl">
      <div className={styles.gridBg} aria-hidden="true" />
      <section className={styles.hero}>
        <h1 className={styles.title}>الأسعار والباقات</h1>
        <p className={styles.subtitle}>اختار الباقة اللي تناسبك. تقدر تبدأ مجاناً وتترقى في أي وقت.</p>
        {FREE_TRIAL_ANNOUNCEMENT.enabled && (
          <div className={styles.banner}>
            <strong>{FREE_TRIAL_ANNOUNCEMENT.title}:</strong> {FREE_TRIAL_ANNOUNCEMENT.text}
          </div>
        )}
        <div className={styles.toggle} role="tablist" aria-label="مدة الاشتراك">
          {(["monthly", "yearly"] as Period[]).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={period === k}
              className={period === k ? styles.toggleActive : styles.toggleBtn}
              onClick={() => setPeriod(k)}
            >
              {period === k && (
                <motion.span layoutId="pricing-pill" className={styles.pill} transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className={styles.toggleLabel}>
                {k === "monthly" ? "شهري" : "سنوي"}
                {k === "yearly" && yearlySaving > 0 && <em className={styles.save}>وفّر {yearlySaving}%</em>}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.grid}>
        {plans.map((p) => {
          const isFree = p.id === "free";
          const isDaily = p.id === "mishwar";
          const amount = isDaily ? p.priceDaily : period === "monthly" ? p.priceMonthly : p.priceYearly;
          const suffix = isDaily ? " / 24 ساعة" : period === "monthly" ? " / شهر" : " / سنة";
          return (
            <motion.article
              key={p.id}
              className={`${styles.card} ${p.highlight ? styles.cardHighlight : ""}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
            >
              {p.highlight && <span className={styles.badge}>الأكثر شمولاً</span>}
              <h2 className={styles.planName}>{p.name}</h2>
              <p className={styles.tagline}>{p.tagline}</p>
              <div className={styles.priceRow}>{isFree ? formatPrice(0, "") : formatPrice(amount, suffix)}</div>
              <ul className={styles.features}>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link href={isFree ? ctaHref : user ? "/profile" : "/signup"} className={styles.cta}>
                {isFree ? (user ? "حسابك" : "ابدأ مجاناً") : user ? "اشترك من حسابك" : "سجّل واشترك"}
              </Link>
            </motion.article>
          );
        })}
      </section>

      <p className={styles.note}>الأسعار بالجنيه المصري. الاشتراك والتجديد من صفحة حسابك. لأي استفسار تواصل معنا من صفحة المساعدة.</p>
    </main>
  );
}
