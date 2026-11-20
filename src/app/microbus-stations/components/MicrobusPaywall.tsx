import React, { RefObject } from "react";
import SubscriptionLockCard from "@/components/common/SubscriptionLockCard";
import { User } from "@supabase/supabase-js";
import styles from "../microbus.module.css";

interface MicrobusPaywallProps {
  user: User | null;
  paywallRef: RefObject<HTMLDivElement | null>;
  paywallCardRef: RefObject<HTMLDivElement | null>;
}

export default function MicrobusPaywall({
  user,
  paywallRef,
  paywallCardRef,
}: MicrobusPaywallProps) {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.ambientGlow} />
      <div className={styles.contentContainer} style={{ paddingTop: "40px" }}>
        <div ref={paywallRef} style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 className={styles.heroTitle}>
            <img
              src="/images/icons2d/microbus.webp"
              alt="Cairo Microbus"
              loading="lazy"
              decoding="async"
              className="h-auto"
              style={{ width: "60px", height: "42px", objectFit: "contain" }}
            />
            <span className={styles.heroTitleGradient}>مواقف الميكروباص</span>
          </h1>
          <p className={styles.heroSubtitle}>
            تقدر دلوقتي تعرف خطوط السير والأجرات الرسمية وزمن الرحلة في جميع المواقف و نقط التحميل في جمهورية مصر العربية.
          </p>
        </div>

        <SubscriptionLockCard
          cardRef={paywallCardRef}
          isLoggedIn={!!user}
          tier="gold"
          title="اشترك في الباقة الذهبية للوصول الكامل"
          description="تصفح مواقف السرفيس والميكروباص والتعرفة وخط السير متاح للمشتركين في الباقة الذهبية."
          features={[
            "مواقف السرفيس والميكروباص الرئيسية ونقاط الركوب",
            "التعرفة الرسمية التقريبية وخط السير التفصيلي",
            "أنواع المركبات (سقف عالي، ميني باص) وزمن الرحلة",
            "يشمل أيضاً مخطط الرحلات الذكي والمطارات والموانئ"
          ]}
        />
      </div>
    </div>
  );
}
