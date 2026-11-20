import React, { RefObject } from "react";
import SubscriptionLockCard from "@/components/common/SubscriptionLockCard";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import styles from "../ports.module.css";

interface PortsPaywallProps {
  user: User | null;
  paywallRef: RefObject<HTMLDivElement | null>;
  paywallCardRef: RefObject<HTMLDivElement | null>;
}

export default function PortsPaywall({
  user,
  paywallRef,
  paywallCardRef,
}: PortsPaywallProps) {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.ambientGlow} />

      <div className={styles.contentContainer} style={{ paddingTop: "40px" }}>
        {/* Back Link */}
        <div className={styles.backLinkNav}>
          <Link href="/" className={styles.backLink}>
            <i className="bx bx-right-arrow-alt" style={{ fontSize: "1.3rem" }} />
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        {/* Hero Area */}
        <div ref={paywallRef} style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 className={styles.heroTitle}>
            <img
              src="/images/icons2d/arab_republice.webp"
              alt="جمهورية مصر العربية"
              loading="lazy"
              decoding="async"
              style={{ width: "48px", height: "48px", objectFit: "contain" }}
            />
            <span className={styles.heroTitleGradient}>دليل الموانئ البحرية</span>
          </h1>
          <p className={styles.heroSubtitle}>
            استكشف الموانئ المصرية على البحرين المتوسط والأحمر وقناة السويس.
          </p>
        </div>

        {/* Lock Panel */}
        <SubscriptionLockCard
          cardRef={paywallCardRef}
          isLoggedIn={!!user}
          tier="gold"
          title="دليل الموانئ يتطلب اشتراك في الباقة الذهبية"
          description="تصفح دليل الموانئ البحرية التجارية، اللوجستية، وموانئ الركاب وطاقتها الاستيعابية وأرصفتها متاح حصرياً لمشتركي الباقة الذهبية المميزة."
          features={[
            "دليل الموانئ البحرية (الإسكندرية، دمياط، السخنة، بورسعيد، سفاجا، إلخ)",
            "الطاقة الاستيعابية والقدرة التشغيلية وأرصفة التداول والملاحة",
            "شبكات الربط المباشرة مع الطرق السريعة وسكك حديد مصر والقطار السريع",
            "تشمل أيضاً مواقف الميكروباص، المطارات، ومخطط الرحلات الذكي بالكامل"
          ]}
        />
      </div>
    </div>
  );
}
