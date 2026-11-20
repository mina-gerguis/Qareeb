import React, { RefObject } from "react";
import SubscriptionLockCard from "@/components/common/SubscriptionLockCard";
import { User } from "@supabase/supabase-js";
import styles from "../brt.module.css";

interface BrtPaywallProps {
  user: User | null;
  paywallRef: RefObject<HTMLDivElement | null>;
  paywallCardRef: RefObject<HTMLDivElement | null>;
}

export default function BrtPaywall({
  user,
  paywallRef,
  paywallCardRef,
}: BrtPaywallProps) {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.ambientGlow} />
      <div className={styles.contentContainer} style={{ paddingTop: "40px" }}>
        <div ref={paywallRef} style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 className={styles.heroTitle}>
            <img
              src="/images/icons2d/brt.webp"
              alt="Cairo BRT"
              loading="lazy"
              decoding="async"
              className="h-auto"
              style={{ width: "60px", height: "42px", objectFit: "contain" }}
            />
            <span className={styles.heroTitleGradient}>الأتوبيس الترددي (BRT)</span>
          </h1>
          <p className={styles.heroSubtitle}>
            دليلك الشامل لخطوط ومحطات الأتوبيس الترددي السريع على الطريق الدائري ومواعيد التقاطر والأسعار.
          </p>
        </div>

        <SubscriptionLockCard
          cardRef={paywallCardRef}
          isLoggedIn={!!user}
          tier="gold"
          title="الأتوبيس الترددي (BRT) للمشتركين"
          description="تصفح محطات الأتوبيس الترددي وأسعار التذاكر وخطوط السير متاح للمشتركين."
          features={[
            "جميع محطات الأتوبيس الترددي على الطريق الدائري بالكامل",
            "أسعار التذاكر وخطوط السير والربط التبادلي مع المترو والمونوريل",
            "زمن الرحلات التقديري والمعالم الحيوية بجوار كل محطة"
          ]}
        />
      </div>
    </div>
  );
}
