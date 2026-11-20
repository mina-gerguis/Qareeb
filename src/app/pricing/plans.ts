/**
 * القيم الافتراضية للباقات. الأسعار هنا مطابقة لـ supabase/supabase_subscriptions_schema.sql.
 * الصفحة تحاول تقرأ الأسعار الحية من جدول subscription_plans وتستخدم الأسعار دي كاحتياطي فقط.
 * أي سعر قيمته null يظهر في الصفحة "السعر قريباً" (مكان جاهز لتحديد السعر).
 */
export type PlanId = "free" | "mishwar" | "silver" | "gold";

export interface PlanInfo {
  id: PlanId;
  name: string;
  tagline: string;
  priceDaily: number | null;
  priceMonthly: number | null;
  priceYearly: number | null;
  features: string[];
  highlight?: boolean;
}

export const FREE_FEATURES = [
  "تصفح الصفحة الرئيسية والبحث في الأماكن",
  "خريطة الأماكن التفاعلية ودليل الأماكن",
  "حد يعرف؟ (اسأل وجاوب مجتمع قريب)",
  "حفظ الأماكن المفضلة وأحفظ مكاني",
  "المدونة والمقالات والمساعدة",
];

export const DEFAULT_PLANS: PlanInfo[] = [
  {
    id: "free",
    name: "الباقة المجانية",
    tagline: "ابدأ من غير أي مصاريف",
    priceDaily: 0,
    priceMonthly: 0,
    priceYearly: 0,
    features: FREE_FEATURES, // TODO(Mina): راجع قائمة المميزات المجانية الفعلية
  },
  {
    id: "mishwar",
    name: "باقة المشوار",
    tagline: "للمشاوير السريعة، 24 ساعة",
    priceDaily: 9,
    priceMonthly: null,
    priceYearly: null,
    features: [
      "اشتراك سريع لمدة 24 ساعة",
      "تصفح خطوط المترو الأساسية والبحث",
      "خريطة المونوريل التفاعلية الكاملة",
      'محرك البحث المتقدم "ازاي اروح" لخطوط المواصلات',
      "إضافة تذكيرات وملاحظات للأماكن",
    ],
  },
  {
    id: "silver",
    name: "الباقة الفضية",
    tagline: "للاستخدام اليومي",
    priceDaily: null,
    priceMonthly: 40,
    priceYearly: 450,
    features: [
      "تصفح خطوط المترو الأساسية والبحث",
      "عرض جداول المواعيد والمحطات التبادلية",
      "خريطة المونوريل التفاعلية الكاملة",
      "دليل مواعيد وأسعار سكك حديد مصر",
      "دليل محطات وتعرفة القطار الكهربائي LRT",
      'محرك البحث المتقدم "ازاي اروح" للمواصلات',
      "إضافة تذكيرات وملاحظات للأماكن",
    ],
  },
  {
    id: "gold",
    name: "الباقة الذهبية",
    tagline: "كل حاجة من غير حدود",
    priceDaily: null,
    priceMonthly: 60,
    priceYearly: 700,
    highlight: true,
    features: [
      "كل مميزات الباقة الفضية",
      "دليل المطارات المصرية والصالات",
      "دليل الموانئ البحرية التجارية والسياحية",
      "دليل مواقف وأتوبيسات السفر بين المدن",
      "دليل مواقف الميكروباص والسرفيس والتعرفة",
      "مخطط الرحلات الذكي بالذكاء الاصطناعي",
    ],
  },
];

// TODO(Mina): فعّل التجربة المجانية للمسجلين الجدد من لوحة الأدمن (new_user_trial) وغيّر النص ده لو المدة مختلفة.
export const FREE_TRIAL_ANNOUNCEMENT = {
  enabled: true,
  title: "ابدأ مجاناً",
  text: "الباقة المجانية متاحة لكل المسجلين. وقريباً: تجربة مجانية للباقة الذهبية للمشتركين الجدد.",
};
