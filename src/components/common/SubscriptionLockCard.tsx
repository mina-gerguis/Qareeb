"use client";

import React, { RefObject, useState } from "react";
import Link from "next/link";
import styles from "./SubscriptionLockCard.module.css";

export type LockTier = "silver" | "gold";

interface SubscriptionLockCardProps {
  /** هل المستخدم مسجل دخول؟ بيحدد زر الدعوة */
  isLoggedIn: boolean;
  tier: LockTier;
  title: string;
  description: string;
  features: string[];
  cardRef?: RefObject<HTMLDivElement | null>;
}

const TIER_META: Record<LockTier, { label: string; image: string; alt: string; cta: string }> = {
  silver: {
    label: "الباقة الفضية",
    image: "/images/threeD/qareeb_silver.webp",
    alt: "الباقة الفضية",
    cta: "اشترك في الباقة الفضية",
  },
  gold: {
    label: "الباقة الذهبية",
    image: "/images/threeD/qareeb_gold.webp",
    alt: "الباقة الذهبية",
    cta: "اشترك في الباقة الذهبية",
  },
};

/** شاشة قفل الاشتراك الموحدة: نفس الروابط والمنطق القديم (اشتراك / تسجيل دخول / الرئيسية)، بتصميم أوضح. */
export default function SubscriptionLockCard({
  isLoggedIn,
  tier,
  title,
  description,
  features,
  cardRef,
}: SubscriptionLockCardProps) {
  const meta = TIER_META[tier];
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div ref={cardRef} className={`${styles.card} ${tier === "gold" ? styles.gold : styles.silver}`} dir="rtl">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.badgeWrap}>
        {imgFailed ? (
          <span className={styles.badgeFallback} aria-hidden="true">{tier === "gold" ? "👑" : "⭐"}</span>
        ) : (
          <img
            src={meta.image}
            alt=""
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
            className={styles.badgeImg}
            onError={() => setImgFailed(true)}
          />
        )}
        <span className={styles.lockChip}>
          <span aria-hidden="true">🔒</span> محتوى للمشتركين
        </span>
      </div>

      <h2 className={styles.title}>{title}</h2>
      <p className={styles.desc}>{description}</p>

      <div className={styles.perks}>
        <div className={styles.perksTitle}>اللي هتاخده مع {meta.label}</div>
        <ul className={styles.perksList}>
          {features.map((f) => (
            <li key={f}>
              <span className={styles.check} aria-hidden="true">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        {isLoggedIn ? (
          <Link href="/profile?expand=subscription" className={`${styles.primaryBtn} ${styles[`${tier}Btn`]}`}>
            {meta.cta}
          </Link>
        ) : (
          <Link href="/login" className={`${styles.primaryBtn} ${styles.loginBtn}`}>
            سجّل دخولك لتفعيل الاشتراك
          </Link>
        )}
        <Link href="/" className={styles.homeBtn}>
          الرجوع للرئيسية
        </Link>
      </div>
    </div>
  );
}
