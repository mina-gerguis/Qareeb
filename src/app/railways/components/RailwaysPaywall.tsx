import React, { RefObject } from "react";
import SubscriptionLockCard from "@/components/common/SubscriptionLockCard";
import { User } from "@supabase/supabase-js";
import styles from "../railways.module.css";

interface RailwaysPaywallProps {
  user: User | null;
  paywallRef: RefObject<HTMLDivElement | null>;
  paywallCardRef: RefObject<HTMLDivElement | null>;
}

export default function RailwaysPaywall({
  user,
  paywallRef,
  paywallCardRef,
}: RailwaysPaywallProps) {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.ambientGlow} />

      <div className={styles.contentContainer} style={{ paddingTop: "32px" }}>
        {/* Banner */}
        <div ref={paywallRef} style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 className={styles.heroTitle}>
            <img
              src="/images/icons2d/Cairo_train.webp"
              alt="Cairo Train"
              loading="lazy"
              decoding="async"
              style={{ width: "42px", height: "42px", objectFit: "contain" }}
            />
            <span className={styles.heroTitleGradient}>سكك حديد مصر</span>
          </h1>

          <p className={styles.heroSubtitle}>
            مواعيد وأسعار قطارات السفر بين المحافظات.
          </p>
        </div>

        {/* Lock Panel Card */}
        <SubscriptionLockCard
          cardRef={paywallCardRef}
          isLoggedIn={!!user}
          tier="silver"
          title="دليل سكك حديد مصر يتطلب اشتراكاً في الباقة الفضية"
          description="تصفح مواعيد وأسعار قطارات السفر بين المحافظات المختلفة متاح حصرياً للمشتركين في الباقة الفضية أو الذهبية."
          features={[
            "خطوط ومحطات قطارات السفر بين المحافظات",
            "تفاصيل فئات القطارات (تالجو، VIP، إسباني، روسي)",
            "أسعار التذاكر ونقاط التبديل ومحطات التوقف",
            "روابط حجز التذاكر المعتمدة إلكترونياً ونصائح السفر"
          ]}
        />
      </div>
    </div>
  );
}
