import React from 'react';
import {
  IconChefHatFilled,
  IconToolsKitchen2,
  IconBurger,
  IconCake,
  IconCoffee,
  IconGlass,
  IconHeartbeat,
  IconBuildingHospital,
  IconFirstAidKit,
  IconPill,
  IconDental,
  IconEye,
  IconTestPipe,
  IconScan,
  IconAmbulance,
  IconShoppingBag,
  IconBuildingStore,
  IconShoppingCart,
  IconDeviceMobile,
  IconDeviceLaptop,
  IconShirt,
  IconShoe,
  IconDiamond,
  IconSparkles,
  IconArmchair,
  IconBook,
  IconDeviceGamepad2,
  IconBone,
  IconGift,
  IconTool,
  IconCar,
  IconGasStation,
  IconCarGarage,
  IconCircleDot,
  IconWash,
  IconParking,
  IconCompass,
  IconBed,
  IconBuildingSkyscraper,
  IconHome,
  IconTent,
  IconPlaneTilt,
  IconMoodSmile,
  IconMovie,
  IconPool,
  IconBallBowling,
  IconMasksTheater,
  IconBuildingMonument,
  IconPhoto,
  IconCalendarEvent,
  IconBarbell,
  IconBallFootball,
  IconBallTennis,
  IconMedal,
  IconBike,
  IconBuildingArch,
  IconBuilding,
  IconShield,
  IconFiretruck,
  IconGavel,
  IconMail,
  IconFileDescription,
  IconCash,
  IconBuildingBank,
  IconCreditCard,
  IconArrowsExchange,
  IconBuildingMosque,
  IconCross,
  IconSchool,
  IconCertificate,
  IconChalkboard,
  IconLanguage,
  IconMoodKid,
  IconBriefcase,
  IconDeviceDesktop,
  IconScale,
  IconCalculator,
  IconHome2,
  IconTools,
  IconWashMachine,
  IconCut,
  IconMassage,
  IconKey,
  IconPlug,
  IconAirConditioning,
  IconPackage,
  IconTruck,
  IconTrees,
  IconSun,
  IconMountain,
  IconMapPin,
  IconBus,
  IconTrain,
  IconPlaneDeparture,
} from '@tabler/icons-react';

export type PlaceCategory = string;

export interface CategoryItem {
  id?: string;
  name: string;
  label: string;
  icon: React.ReactNode | string;
  color?: string;
}

export interface SubCategoryItem {
  name: string;
  label: string;
  icon: React.ReactNode | string;
}

export interface MainCategoryItem {
  name: string;
  label: string;
  icon: React.ReactNode | string;
  emoji: string;
  image: string;
  color: string;
  subCategories: SubCategoryItem[];
}

export const CATEGORIES_STRUCTURE: MainCategoryItem[] = [
  // Food and Drinks
  {
    name: 'food_drinks',
    label: 'أكل ومشروبات',
    icon: <IconChefHatFilled />,
    emoji: '🍴',
    image: 'burger.webp',
    color: '#ff3b30',
    subCategories: [
      { name: 'restaurant', label: 'مطاعم', icon: <IconToolsKitchen2 /> },
      { name: 'fast_food', label: 'فاست فود', icon: <IconBurger /> },
      { name: 'bakery', label: 'مخابز وحلويات', icon: <IconCake /> },
      { name: 'cafe', label: 'كافيهات', icon: <IconCoffee /> },
      { name: 'juice_bar', label: 'عصائر', icon: <IconGlass /> },
    ]
  },
  // Health
  {
    name: 'health',
    label: 'صحة',
    icon: <IconHeartbeat />,
    emoji: '🏥',
    image: 'hospital.webp',
    color: '#007aff',
    subCategories: [
      { name: 'hospital', label: 'مستشفيات', icon: <IconBuildingHospital /> },
      { name: 'clinic', label: 'عيادات', icon: <IconFirstAidKit /> },
      { name: 'pharmacy', label: 'صيدليات', icon: <IconPill /> },
      { name: 'dental_clinic', label: 'عيادات أسنان', icon: <IconDental /> },
      { name: 'eye_center', label: 'مراكز عيون', icon: <IconEye /> },
      { name: 'lab', label: 'معامل تحاليل', icon: <IconTestPipe /> },
      { name: 'radiology', label: 'مراكز أشعة', icon: <IconScan /> },
      { name: 'ambulance', label: 'إسعاف', icon: <IconAmbulance /> },
    ]
  },
  // Shopping
  {
    name: 'shopping',
    label: 'تسوق',
    icon: <IconShoppingBag />,
    emoji: '🛍️',
    image: 'store.webp',
    color: '#ff9500',
    subCategories: [
      { name: 'mall', label: 'مولات', icon: <IconBuildingStore /> },
      { name: 'supermarket', label: 'سوبر ماركت', icon: <IconShoppingCart /> },
      { name: 'mobile_store', label: 'محلات موبايلات', icon: <IconDeviceMobile /> },
      { name: 'computer_store', label: 'محلات كمبيوتر', icon: <IconDeviceLaptop /> },
      { name: 'clothing_store', label: 'ملابس', icon: <IconShirt /> },
      { name: 'shoe_store', label: 'أحذية', icon: <IconShoe /> },
      { name: 'jewelry', label: 'مجوهرات', icon: <IconDiamond /> },
      { name: 'cosmetics', label: 'مستحضرات تجميل', icon: <IconSparkles /> },
      { name: 'furniture', label: 'أثاث', icon: <IconArmchair /> },
      { name: 'bookstore', label: 'مكتبات', icon: <IconBook /> },
      { name: 'toy_store', label: 'ألعاب', icon: <IconDeviceGamepad2 /> },
      { name: 'pet_store', label: 'مستلزمات حيوانات', icon: <IconBone /> },
      { name: 'flower_shop', label: 'ورد وهدايا', icon: <IconGift /> },
      { name: 'hardware_store', label: 'أدوات منزلية', icon: <IconTool /> },
    ]
  },
  // Automotive
  {
    name: 'automotive',
    label: 'سيارات',
    icon: <IconCar />,
    emoji: '🚗',
    image: 'car.webp',
    color: '#5856d6',
    subCategories: [
      { name: 'gas_station', label: 'محطات بنزين', icon: <IconGasStation /> },
      { name: 'car_service', label: 'مراكز صيانة', icon: <IconCarGarage /> },
      { name: 'car_dealer', label: 'معارض سيارات', icon: <IconCar /> },
      { name: 'tire_shop', label: 'كاوتش', icon: <IconCircleDot /> },
      { name: 'car_wash', label: 'مغاسل سيارات', icon: <IconWash /> },
      { name: 'parking', label: 'مواقف سيارات', icon: <IconParking /> },
    ]
  },
  // Tourism
  {
    name: 'tourism',
    label: 'إقامة وسياحة',
    icon: <IconCompass />,
    emoji: '🏨',
    image: 'museum.webp',
    color: '#af52de',
    subCategories: [
      { name: 'hotel', label: 'فنادق', icon: <IconBed /> },
      { name: 'apartment_hotel', label: 'شقق فندقية', icon: <IconBuildingSkyscraper /> },
      { name: 'guest_house', label: 'بيوت ضيافة', icon: <IconHome /> },
      { name: 'camp', label: 'مخيمات', icon: <IconTent /> },
      { name: 'travel_agency', label: 'شركات سياحة', icon: <IconPlaneTilt /> },
    ]
  },
  // Entertainment
  {
    name: 'entertainment',
    label: 'ترفيه',
    icon: <IconMoodSmile />,
    emoji: '🎭',
    image: 'amusement_park.webp',
    color: '#ff2d55',
    subCategories: [
      { name: 'cinema', label: 'سينما', icon: <IconMovie /> },
      { name: 'amusement_park', label: 'ملاهي', icon: <IconMoodSmile /> },
      { name: 'water_park', label: 'أكوا بارك', icon: <IconPool /> },
      { name: 'bowling', label: 'بولينج', icon: <IconBallBowling /> },
      { name: 'swimming_pool', label: 'حمامات سباحة', icon: <IconPool /> },
      { name: 'theater', label: 'مسارح', icon: <IconMasksTheater /> },
      { name: 'museum', label: 'متاحف', icon: <IconBuildingMonument /> },
      { name: 'gallery', label: 'معارض', icon: <IconPhoto /> },
      { name: 'event_venue', label: 'فعاليات', icon: <IconCalendarEvent /> },
    ]
  },
  // Sports
  {
    name: 'sports',
    label: 'رياضة',
    icon: <IconBarbell />,
    emoji: '🏋️',
    image: 'dumbbell.webp',
    color: '#34c759',
    subCategories: [
      { name: 'gym', label: 'جيم', icon: <IconBarbell /> },
      { name: 'sports_field', label: 'ملاعب', icon: <IconBallFootball /> },
      { name: 'tennis_court', label: 'ملاعب تنس', icon: <IconBallTennis /> },
      { name: 'sports_academy', label: 'أكاديميات رياضية', icon: <IconMedal /> },
      { name: 'bike_rental', label: 'تأجير دراجات', icon: <IconBike /> },
    ]
  },
  // Government
  {
    name: 'government',
    label: 'حكومية',
    icon: <IconBuildingArch />,
    emoji: '🏛️',
    image: 'government.webp',
    color: '#8e8e93',
    subCategories: [
      { name: 'government_office', label: 'مصالح حكومية', icon: <IconBuilding /> },
      { name: 'police_station', label: 'قسم شرطة', icon: <IconShield /> },
      { name: 'fire_station', label: 'مطافي', icon: <IconFiretruck /> },
      { name: 'court', label: 'محاكم', icon: <IconGavel /> },
      { name: 'post_office', label: 'بريد', icon: <IconMail /> },
      { name: 'registry_office', label: 'شهر عقاري', icon: <IconFileDescription /> },
    ]
  },
  // Finance
  {
    name: 'finance',
    label: 'خدمات مالية',
    icon: <IconCash />,
    emoji: '💰',
    image: 'bank.webp',
    color: '#30b0c7',
    subCategories: [
      { name: 'bank', label: 'بنوك', icon: <IconBuildingBank /> },
      { name: 'atm', label: 'ماكينات ATM', icon: <IconCreditCard /> },
      { name: 'exchange', label: 'صرافة', icon: <IconArrowsExchange /> },
    ]
  },
  // Religion
  {
    name: 'religion',
    label: 'أماكن دينية',
    icon: <IconBuildingMosque />,
    emoji: '🕌',
    image: 'moon_and_cross.webp',
    color: '#a2845e',
    subCategories: [
      { name: 'mosque', label: 'مساجد', icon: <IconBuildingMosque /> },
      { name: 'church', label: 'كنائس', icon: <IconCross /> },
    ]
  },
  // Education
  {
    name: 'education',
    label: 'تعليم',
    icon: <IconSchool />,
    emoji: '🎓',
    image: 'book.webp',
    color: '#34c759',
    subCategories: [
      { name: 'school', label: 'مدارس', icon: <IconSchool /> },
      { name: 'university', label: 'جامعات', icon: <IconCertificate /> },
      { name: 'training_center', label: 'مراكز تعليم', icon: <IconChalkboard /> },
      { name: 'language_center', label: 'مراكز لغات', icon: <IconLanguage /> },
      { name: 'nursery', label: 'حضانات', icon: <IconMoodKid /> },
    ]
  },
  // Business
  {
    name: 'business',
    label: 'أعمال',
    icon: <IconBriefcase />,
    emoji: '💼',
    image: 'business.webp',
    color: '#1c1c1e',
    subCategories: [
      { name: 'company', label: 'شركات', icon: <IconBuilding /> },
      { name: 'office', label: 'مكاتب', icon: <IconDeviceDesktop /> },
      { name: 'law_firm', label: 'مكاتب محاماة', icon: <IconScale /> },
      { name: 'accounting_office', label: 'مكاتب محاسبة', icon: <IconCalculator /> },
      { name: 'real_estate', label: 'شركات عقارات', icon: <IconHome2 /> },
    ]
  },
  // Services
  {
    name: 'services',
    label: 'خدمات',
    icon: <IconTools />,
    emoji: '🧹',
    image: 'washing_machine.webp',
    color: '#ff9f0a',
    subCategories: [
      { name: 'laundry', label: 'مغاسل', icon: <IconWashMachine /> },
      { name: 'barbershop', label: 'صالونات حلاقة', icon: <IconCut /> },
      { name: 'beauty_salon', label: 'بيوتي سنتر', icon: <IconMassage /> },
      { name: 'locksmith', label: 'مفاتيح', icon: <IconKey /> },
      { name: 'plumber', label: 'سباك', icon: <IconTool /> },
      { name: 'electrician', label: 'كهربائي', icon: <IconPlug /> },
      { name: 'ac_service', label: 'تكييف', icon: <IconAirConditioning /> },
      { name: 'shipping', label: 'شركات شحن', icon: <IconPackage /> },
      { name: 'moving_service', label: 'نقل أثاث', icon: <IconTruck /> },
    ]
  },
  // Public Places
  {
    name: 'public_places',
    label: 'أماكن عامة',
    icon: <IconTrees />,
    emoji: '🌳',
    image: 'beach.webp',
    color: '#30b0c7',
    subCategories: [
      { name: 'park', label: 'حدائق', icon: <IconTrees /> },
      { name: 'beach', label: 'شواطئ', icon: <IconSun /> },
      { name: 'nature_reserve', label: 'محميات', icon: <IconMountain /> },
      { name: 'square', label: 'ميادين', icon: <IconMapPin /> },
      { name: 'bus_station', label: 'مواقف مواصلات', icon: <IconBus /> },
      { name: 'metro_station', label: 'محطات مترو', icon: <IconTrain /> },
      { name: 'train_station', label: 'محطات قطار', icon: <IconTrain /> },
      { name: 'airport', label: 'مطارات', icon: <IconPlaneDeparture /> },
    ]
  }
];

// Flat categories derived from CATEGORIES_STRUCTURE to maintain compatibility
export const DEFAULT_CATEGORIES: CategoryItem[] = CATEGORIES_STRUCTURE.reduce((acc, main) => {
  main.subCategories.forEach(sub => {
    acc.push({
      name: sub.name,
      label: sub.label,
      icon: sub.icon,
      color: main.color
    });
  });
  return acc;
}, [] as CategoryItem[]);

export function normalizePlaceCategory(rawCategory: string, existingSubCats: string[] = []): { category: string; categoryLabel: string; subCategories: string[] } {
  if (!rawCategory) return { category: 'food_drinks', categoryLabel: 'أكل ومشروبات', subCategories: existingSubCats };

  const trimmed = rawCategory.trim();
  const lower = trimmed.toLowerCase();
  const finalSubCategories = [...existingSubCats];

  // 1. Check if rawCategory is already a main category key
  const isMainKey = CATEGORIES_STRUCTURE.find(m => m.name.toLowerCase() === lower);
  if (isMainKey) {
    return { category: isMainKey.name, categoryLabel: isMainKey.label, subCategories: finalSubCategories };
  }

  // 2. Check if rawCategory matches a main category label in Arabic
  const mainByLabel = CATEGORIES_STRUCTURE.find(m => m.label.trim().toLowerCase() === lower);
  if (mainByLabel) {
    return { category: mainByLabel.name, categoryLabel: mainByLabel.label, subCategories: finalSubCategories };
  }

  // 3. Check if rawCategory is a subcategory key or subcategory label
  for (const main of CATEGORIES_STRUCTURE) {
    const subMatch = main.subCategories.find(s =>
      s.name.toLowerCase() === lower ||
      s.label.trim().toLowerCase() === lower
    );
    if (subMatch) {
      if (!finalSubCategories.includes(subMatch.name)) {
        finalSubCategories.push(subMatch.name);
      }
      return { category: main.name, categoryLabel: main.label, subCategories: finalSubCategories };
    }
  }

  // 4. Backward compatibility for legacy categories
  if (lower === 'restaurant' || lower === 'cafe') {
    if (!finalSubCategories.includes(lower)) finalSubCategories.push(lower);
    return { category: 'food_drinks', categoryLabel: 'أكل ومشروبات', subCategories: finalSubCategories };
  } else if (lower === 'garden' || lower === 'outings') {
    if (!finalSubCategories.includes('park')) finalSubCategories.push('park');
    return { category: 'public_places', categoryLabel: 'أماكن عامة', subCategories: finalSubCategories };
  } else if (lower === 'medicalcenter' || lower === 'hospital' || lower === 'pharmacy') {
    const sub = lower === 'medicalcenter' ? 'clinic' : lower;
    if (!finalSubCategories.includes(sub)) finalSubCategories.push(sub);
    return { category: 'health', categoryLabel: 'صحة', subCategories: finalSubCategories };
  } else if (lower === 'health_beauty') {
    if (!finalSubCategories.includes('beauty_salon')) finalSubCategories.push('beauty_salon');
    return { category: 'services', categoryLabel: 'خدمات', subCategories: finalSubCategories };
  } else if (lower === 'family' || lower === 'kids' || lower === 'amusement_aqua' || lower === 'cinema') {
    return { category: 'entertainment', categoryLabel: 'ترفيه', subCategories: finalSubCategories };
  } else if (lower === 'quiet_places') {
    return { category: 'public_places', categoryLabel: 'أماكن عامة', subCategories: finalSubCategories };
  } else if (lower === 'work') {
    return { category: 'business', categoryLabel: 'أعمال', subCategories: finalSubCategories };
  } else if (lower === 'courses_study') {
    return { category: 'education', categoryLabel: 'تعليم', subCategories: finalSubCategories };
  } else if (lower === 'hotel') {
    return { category: 'tourism', categoryLabel: 'إقامة وسياحة', subCategories: finalSubCategories };
  } else if (lower === 'mall') {
    if (!finalSubCategories.includes('mall')) finalSubCategories.push('mall');
    return { category: 'shopping', categoryLabel: 'تسوق', subCategories: finalSubCategories };
  }

  return { category: rawCategory, categoryLabel: rawCategory, subCategories: finalSubCategories };
}

export function getMainCategory(category: string, subCategories: string[] = []): MainCategoryItem | undefined {
  if (!category) return undefined;
  const rawCat = category.trim().toLowerCase();

  // 1. Direct match on main category name or label
  let main = CATEGORIES_STRUCTURE.find(
    m => m.name.toLowerCase() === rawCat || m.label.trim().toLowerCase() === rawCat
  );
  if (main) return main;

  // 2. Check if rawCat matches any subcategory name or label
  main = CATEGORIES_STRUCTURE.find(m =>
    m.subCategories.some(s => s.name.toLowerCase() === rawCat || s.label.trim().toLowerCase() === rawCat)
  );
  if (main) return main;

  // 3. Check subCategories array if provided
  if (subCategories && subCategories.length > 0) {
    for (const sub of subCategories) {
      const subLower = sub.trim().toLowerCase();
      main = CATEGORIES_STRUCTURE.find(m =>
        m.subCategories.some(s => s.name.toLowerCase() === subLower || s.label.trim().toLowerCase() === subLower)
      );
      if (main) return main;
    }
  }

  // 4. Fallback to normalizePlaceCategory
  const normalized = normalizePlaceCategory(category, subCategories);
  if (normalized.category) {
    main = CATEGORIES_STRUCTURE.find(m => m.name.toLowerCase() === normalized.category.toLowerCase());
    if (main) return main;
  }

  return undefined;
}

export function getMainCategoryImage(category: string, subCategories: string[] = []): string {
  const main = getMainCategory(category, subCategories);
  if (main && main.image) {
    return `/images/threeD/${main.image}`;
  }
  return '/images/threeD/burger.webp';
}

export interface Branch {
  id: string;
  place_id: string;
  name: string;
  governorate?: string;
  city?: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
  phones: string[];
  googleMapsUrl: string;
  workingHours: string;
  media?: string[];
  isMain: boolean;
  website_url?: string;
  features?: string[];
  services?: string[];
}

export interface Place {
  id: string;
  name: string;
  name_en?: string;
  category: PlaceCategory;
  categoryLabel: string;
  subCategories?: string[];
  place_type?: string;
  place_type_icon?: string;
  governorate?: string;
  city?: string;
  briefLocation?: string;
  shortDescription?: string;
  fullAddress: string;
  phones: string[];
  googleMapsUrl: string;
  images: string[];
  menuImages?: string[];
  media?: string[];
  workingHours?: string;
  rating?: number;
  reviewsCount?: number;
  description?: string;
  latitude?: number;
  longitude?: number;
  branches?: Branch[];
  website_url?: string;
  features?: string[];
  services?: string[];
}

export interface FeatureItem {
  key: string;
  label: string;
  icon: string;
}

export const FEATURES_LIST: FeatureItem[] = [
  { key: "vegetarian_options", label: "خيارات نباتية متوفرة", icon: "🥗" },
  { key: "suitable_for_groups", label: "مناسب للمجموعات والعائلات", icon: "👥" },
  { key: "accepts_credit_cards", label: "يقبل الدفع بالبطاقات الائتمانية", icon: "💳" },
  { key: "free_wifi", label: "شبكة واي فاي مجانية", icon: "📶" },
  { key: "comfortable_facilities", label: "مرافق مريحة للزوار", icon: "✔️" },
  { key: "wheelchair_accessible", label: "مداخل سهلة للكراسي المتحركة", icon: "♿" },
  { key: "suitable_for_all_ages", label: "مناسب لجميع الأعمار", icon: "👨‍👩‍👧‍👦" },
  { key: "quiet_place", label: "أماكن هادئة", icon: "🤫" },
  { key: "kids_friendly", label: "أماكن مخصصة للأطفال", icon: "🧸" },
  { key: "family_friendly", label: "أماكن عائلية وكابلز", icon: "💑" },
];

export const initialPlaces: Place[] = [
  {
    id: "1",
    name: "مطعم البرنس - إمبابة",
    category: "food_drinks",
    categoryLabel: "أكل ومشروبات",
    subCategories: ["restaurant"],
    briefLocation: "إمبابة / الجيزة",
    fullAddress: "شارع طلعت حرب، إمبابة، الجيزة",
    phones: ["19123", "0233114455", "01099998877"],
    googleMapsUrl: "https://maps.app.goo.gl/r6aX7LgV79M36m4u5",
    images: ["/1.jpg", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"],
    menuImages: ["https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&auto=format&fit=crop&q=80"],
    workingHours: "12:00 م - 04:00 ص",
    rating: 4.6,
    description: "من أشهر مطاعم المأكولات الشرقية واللحوم وطواجن الكوارع والملوخية في مصر.",
    latitude: 30.0766, longitude: 31.2137,
    features: ["suitable_for_groups", "family_friendly"]
  },
  {
    id: "2",
    name: "كافيه سيلانترو - مصر الجديدة",
    category: "food_drinks",
    categoryLabel: "أكل ومشروبات",
    subCategories: ["cafe"],
    briefLocation: "مصر الجديدة / القاهرة",
    fullAddress: "15 شارع بغداد، الكوربة، مصر الجديدة، القاهرة",
    phones: ["16112", "01223456789"],
    googleMapsUrl: "https://maps.app.goo.gl/9yB7D5JvH7eF6L8a9",
    images: ["/2.jpg", "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80"],
    menuImages: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"],
    workingHours: "08:00 ص - 12:00 ص",
    rating: 4.3,
    description: "كافيه هادئ ومميز في منطقة الكوربة، يشتهر بأجود القهوة والمخبوزات الطازجة.",
    latitude: 30.0911, longitude: 31.3256,
    features: ["free_wifi", "quiet_place"]
  },
  {
    id: "3",
    name: "صيدليات العزبي - ألف مسكن",
    category: "health",
    categoryLabel: "صحة",
    subCategories: ["pharmacy"],
    briefLocation: "ألف مسكن / جسر السويس",
    fullAddress: "ميدان ألف مسكن، بجوار محطة مترو ألف مسكن، القاهرة",
    phones: ["19600", "01001960000"],
    googleMapsUrl: "https://maps.app.goo.gl/6pM8zXvH7eF6K9a1",
    images: ["https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=800&auto=format&fit=crop&q=80"],
    workingHours: "مفتوح 24 ساعة",
    rating: 4.5,
    description: "فرع صيدلية العزبي في ألف مسكن، يوفر جميع الأدوية مع خدمة التوصيل للمنازل.",
    latitude: 30.1171, longitude: 31.3418,
    features: ["comfortable_facilities"]
  },
  {
    id: "4",
    name: "مستشفى كليوباترا - هليوبوليس",
    category: "health",
    categoryLabel: "صحة",
    subCategories: ["hospital"],
    briefLocation: "مصر الجديدة / القاهرة",
    fullAddress: "39 شارع كليوباترا، صلاح سالم، مصر الجديدة، القاهرة",
    phones: ["19595", "0224178300"],
    googleMapsUrl: "https://maps.app.goo.gl/3yR8D5JvH7eF6L8a9",
    images: ["https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80"],
    workingHours: "مفتوح الطوارئ 24 ساعة",
    rating: 4.1,
    description: "من أعرق المستشفيات الخاصة بمصر الجديدة، تضم جميع التخصصات الطبية.",
    latitude: 30.0898, longitude: 31.3292,
    features: ["wheelchair_accessible"]
  },
  {
    id: "5",
    name: "حديقة الأزهر - صلاح سالم",
    category: "public_places",
    categoryLabel: "أماكن عامة",
    subCategories: ["park"],
    briefLocation: "الدراسة / صلاح سالم",
    fullAddress: "شارع صلاح سالم، الدراسة، القاهرة",
    phones: ["0225103868", "0225107378"],
    googleMapsUrl: "https://maps.app.goo.gl/4yT8D5JvH7eF6M8z7",
    images: ["https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80"],
    workingHours: "09:00 ص - 10:00 م",
    rating: 4.7,
    description: "من أجمل حدائق القاهرة بمساحة شاسعة تطل على قلعة صلاح سالم.",
    latitude: 30.0407, longitude: 31.2647,
    features: ["suitable_for_all_ages", "kids_friendly", "family_friendly"]
  }
];

export const OLD_CATEGORY_TO_MAIN_MAP: Record<string, string> = {
  restaurant: 'food_drinks',
  cafe: 'food_drinks',
  garden: 'public_places',
  outings: 'public_places',
  medicalCenter: 'health',
  hospital: 'health',
  pharmacy: 'health',
  health_beauty: 'services',
  family: 'entertainment',
  quiet_places: 'public_places',
  kids: 'entertainment',
  amusement_aqua: 'entertainment',
  work: 'business',
  courses_study: 'education',
  hotel: 'tourism',
  cinema: 'entertainment',
  mall: 'shopping',
};

export function formatBoxIcon(iconStr: string): string {
  if (!iconStr) return "bx bx-tag";
  let trimmed = iconStr.trim().toLowerCase();

  // Remove multiple spaces
  trimmed = trimmed.replace(/\s+/g, ' ');

  // Auto-heal corrupted Font Awesome icons saved as Boxicons (e.g. "bx bx-fa-...")
  if (
    trimmed.startsWith("bx bx-fa-") ||
    trimmed.startsWith("bx bx-fa ") ||
    trimmed.startsWith("bx bx-fas ") ||
    trimmed.startsWith("bx bx-far ") ||
    trimmed.startsWith("bx bx-fab ")
  ) {
    trimmed = trimmed.substring(6);
  }
  if (
    trimmed.startsWith("bx-fa-") ||
    trimmed.startsWith("bx-fa ") ||
    trimmed.startsWith("bx-fas ") ||
    trimmed.startsWith("bx-far ") ||
    trimmed.startsWith("bx-fab ")
  ) {
    trimmed = trimmed.substring(3);
  }

  // If it's a Font Awesome icon (starts with fa-, fa, fas, far, fab)
  if (
    trimmed.startsWith("fa-") ||
    trimmed.startsWith("fa ") ||
    trimmed.startsWith("fas ") ||
    trimmed.startsWith("far ") ||
    trimmed.startsWith("fab ")
  ) {
    return trimmed;
  }

  // If it already has "bx bx-something", return it
  if (trimmed.startsWith("bx bx-")) {
    return trimmed;
  }

  // If it's just "bx-something"
  if (trimmed.startsWith("bx-")) {
    return `bx ${trimmed}`;
  }

  // If they wrote "bx something" without hyphen
  if (trimmed.startsWith("bx ")) {
    const iconName = trimmed.substring(3);
    return `bx bx-${iconName}`;
  }

  // If they just wrote the name of the icon, e.g. "utensils"
  return `bx bx-${trimmed}`;
}


