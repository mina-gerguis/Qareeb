import React, { RefObject } from "react";
import SubscriptionLockCard from "@/components/common/SubscriptionLockCard";
import { User } from "@supabase/supabase-js";

interface DirectionsPaywallProps {
  user: User | null;
  paywallRef: RefObject<HTMLDivElement | null>;
  paywallCardRef: RefObject<HTMLDivElement | null>;
}

export default function DirectionsPaywall({
  user,
  paywallRef,
  paywallCardRef
}: DirectionsPaywallProps) {
  return (
    <div className="min-h-screen relative overflow-x-hidden pb-16">
      <div className="ambient-glow" />
      <div className="max-w-3xl mx-auto px-4 pt-10 relative z-10">
        {/* Paywall Header */}
        <div ref={paywallRef} className="text-center mb-7">
          <h1 className="flex items-center justify-center gap-3 font-extrabold font-sub text-3xl sm:text-4xl m-0 mb-2.5">
            <img
              src="/images/transit/arab_republic _of_egypt.webp"
              alt="Cairo Directions"
              loading="lazy"
              decoding="async"
              className="w-10 h-auto object-contain"
            />
            <span className="text-gradient-title">ازاي اروح ..؟</span>
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-lg mx-auto m-0 leading-relaxed font-body">
            دليل السفر والانتقال الذكي لمختلف وسائل المواصلات والطرق المختصرة.
          </p>
        </div>

        {/* Paywall Card */}
        <SubscriptionLockCard
          cardRef={paywallCardRef}
          isLoggedIn={!!user}
          tier="silver"
          title="دليل مسارات المواصلات يتطلب الاشتراك في الباقة الفضية"
          description="محرك البحث المتقدم عن خطوط المواصلات والطرق المختصرة (ميكروباص، أتوبيسات، مترو، ومونوريل) متاح للمشتركين في الباقة الفضية أو الذهبية أو المشوار."
          features={[
            "البحث عن مسارات مواصلات بين أي منطقتين بالتفصيل",
            "حساب تكلفة الرحلة والمدة المتوقعة بدقة لكل مرحلة",
            "خيارات متعددة للتنقل (مباشر، مترو + ميكروباص، إلخ)",
            "تشمل أيضاً دليل القطارات والمونوريل والقطار الكهربائي"
          ]}
        />
      </div>
    </div>
  );
}
