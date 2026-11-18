import { RailwayRoute, RailwayLineFormData, RailwayStationFormData, VisibleLineColumns, VisibleStationColumns } from "./types";

export const DEFAULT_RAILWAY_ROUTES: RailwayRoute[] = [
  {
    id: "cairo-alex",
    name: "القاهرة ⇆ الإسكندرية (خط بحري)",
    from: "القاهرة (محطة رمسيس)",
    to: "الإسكندرية (محطة سيدي جابر / مصر)",
    duration: "ساعتين إلى 3 ساعات ونصف (حسب نوع القطار)",
    stops: [
      { name: "القاهرة (رمسيس)", status: "تشغيل فعلي", station_order: 1 },
      { name: "بنها", status: "تشغيل فعلي", station_order: 2 },
      { name: "طنطا", status: "تشغيل فعلي", station_order: 3 },
      { name: "دمنهور", status: "تشغيل فعلي", station_order: 4 },
      { name: "سيدي جابر", status: "تشغيل فعلي", station_order: 5 },
      { name: "الإسكندرية", status: "تشغيل فعلي", station_order: 6 },
    ],
    classes: [
      { name: "قطار تالجو (Talgo) الفاخر", price: "درجة أولى: 225 ج.م | درجة ثانية: 150 ج.م", features: "شاشات عرض، واي فاي، عربة بوفيه فاخرة، تكييف متطور، هدوء تام وسرعة عالية." },
      { name: "قطارات VIP السريعة", price: "درجة أولى: 145 ج.م | درجة ثانية: 115 ج.م", features: "تكييف ممتاز، مقاعد مريحة قابلة للتعديل، بوفيه، خدمة جيدة." },
      { name: "قطارات إسباني مطور / فرنسي", price: "درجة أولى: 80 ج.م | درجة ثانية: 65 ج.م", features: "تكييف، مقاعد مريحة، قطارات سريعة كلاسيكية." },
      { name: "قطار روسي مكيف", price: "تذكرة موحدة: 60 ج.م", features: "تكييف، عربات جديدة، سعر اقتصادي وسرعة متوسطة." },
    ],
    tips: "قطارات تالجو هي الخيار الأفضل والأسرع على هذا الخط. يفضل الحجز قبل موعد الرحلة بـ 24 ساعة على الأقل.",
    color: "#ef4444",
  },
  {
    id: "cairo-aswan",
    name: "القاهرة ⇆ أسوان (خط قبلي الصعيد)",
    from: "القاهرة (محطة رمسيس / الجيزة)",
    to: "أسوان",
    duration: "10 إلى 13 ساعة",
    stops: [
      { name: "القاهرة (رمسيس)", status: "تشغيل فعلي", station_order: 1 },
      { name: "الجيزة", status: "تشغيل فعلي", station_order: 2 },
      { name: "بني سويف", status: "تشغيل فعلي", station_order: 3 },
      { name: "المنيا", status: "تشغيل فعلي", station_order: 4 },
      { name: "أسيوط", status: "تشغيل فعلي", station_order: 5 },
      { name: "سوهاج", status: "تشغيل فعلي", station_order: 6 },
      { name: "قنا", status: "تشغيل فعلي", station_order: 7 },
      { name: "الأقصر", status: "تشغيل فعلي", station_order: 8 },
      { name: "إدفو", status: "تشغيل فعلي", station_order: 9 },
      { name: "كوم أمبو", status: "تشغيل فعلي", station_order: 10 },
      { name: "أسوان", status: "تشغيل فعلي", station_order: 11 },
    ],
    classes: [
      { name: "قطارات النوم الفاخرة (Wagon-Lits)", price: "كابينة فردية: 1200+ ج.م | كابينة مزدوجة: 850 ج.م (للمصريين)", features: "وجبة عشاء وإفطار مجانية، سرير مريح في كابينة مغلقة، هدوء وخدمة فندقية." },
      { name: "قطار تالجو (Talgo) الصعيد", price: "درجة أولى: 700 ج.م | درجة ثانية: 550 ج.م", features: "القطار الأحدث والأكثر راحة بالصعيد، هادئ وسريع ومكيف بالكامل." },
      { name: "قطارات VIP الصعيد", price: "درجة أولى: 335 ج.م | درجة ثانية: 220 ج.م", features: "تكييف ممتاز، مقاعد مريحة للمسافات الطويلة، عربة بوفيه متكاملة." },
    ],
    tips: "لرحلات النوم، يفضل الحجز قبل السفر بأسبوع على الأقل نظراً للإقبال الشديد خصوصاً في مواسم الشتاء والسياحة.",
    color: "#f59e0b",
  },
  {
    id: "cairo-portsaid",
    name: "القاهرة ⇆ بورسعيد (خط القناة)",
    from: "القاهرة (محطة رمسيس)",
    to: "بورسعيد",
    duration: "3 إلى 4 ساعات",
    stops: [
      { name: "القاهرة (رمسيس)", status: "تشغيل فعلي", station_order: 1 },
      { name: "بنها", status: "تشغيل فعلي", station_order: 2 },
      { name: "الزقازيق", status: "تشغيل فعلي", station_order: 3 },
      { name: "الإسماعيلية", status: "تشغيل فعلي", station_order: 4 },
      { name: "القنطرة غرب", status: "تشغيل فعلي", station_order: 5 },
      { name: "بورسعيد", status: "تشغيل فعلي", station_order: 6 },
    ],
    classes: [
      { name: "قطارات مكيفة إسباني/فرنسي", price: "درجة أولى: 80 ج.م | درجة ثانية: 65 ج.م", features: "مكيفة، كراسي مريحة، تقف في المراكز والمحافظات الرئيسية." },
      { name: "قطار روسي مكيف الجديد", price: "تذكرة موحدة: 55 ج.م", features: "تكييف، عربات جديدة مريحة واقتصادية." },
    ],
    tips: "الرحلة تمر بمدن القناة وتوفر مناظر جميلة ومحطات ممتعة على طول قناة السويس.",
    color: "#3b82f6",
  },
  {
    id: "cairo-mansoura",
    name: "القاهرة ⇆ المنصورة (خط الدلتا)",
    from: "القاهرة (محطة رمسيس)",
    to: "المنصورة",
    duration: "ساعتين إلى ساعتين ونصف",
    stops: [
      { name: "القاهرة (رمسيس)", status: "تشغيل فعلي", station_order: 1 },
      { name: "بنها", status: "تشغيل فعلي", station_order: 2 },
      { name: "قويسنا", status: "تشغيل فعلي", station_order: 3 },
      { name: "بركة السبع", status: "تشغيل فعلي", station_order: 4 },
      { name: "طنطا", status: "تشغيل فعلي", station_order: 5 },
      { name: "المحلة الكبرى", status: "تشغيل فعلي", station_order: 6 },
      { name: "سمنود", status: "تشغيل فعلي", station_order: 7 },
      { name: "طلخا", status: "تشغيل فعلي", station_order: 8 },
      { name: "المنصورة", status: "تشغيل فعلي", station_order: 9 },
    ],
    classes: [
      { name: "قطارات VIP السريعة", price: "درجة أولى: 100 ج.م | درجة ثانية: 80 ج.م", features: "قطارات سريعة ومكيفة بالكامل ومريحة جداً." },
      { name: "قطارات مكيفة إسباني", price: "درجة أولى: 60 ج.م | درجة ثانية: 50 ج.م", features: "مكيفة ومناسبة جداً للسفر اليومي والدراسي." },
    ],
    tips: "العديد من طلاب الجامعات يستخدمون هذا الخط يومياً، لذا ينصح بتجنب أوقات الذروة الصباحية وبعد الظهر.",
    color: "#10b981",
  },
];

export const INITIAL_LINE_FORM: RailwayLineFormData = {
  id: "",
  name: "",
  from: "",
  to: "",
  duration: "",
  tips: "",
};

export const INITIAL_STATION_FORM: RailwayStationFormData = {
  name: "",
  status: "تشغيل فعلي",
};

export const INITIAL_VISIBLE_LINE_COLUMNS: VisibleLineColumns = {
  id: true,
  name: true,
  from: true,
  to: true,
  duration: true,
  stopsCount: true,
};

export const INITIAL_VISIBLE_STATION_COLUMNS: VisibleStationColumns = {
  order: true,
  name: true,
  status: true,
};
