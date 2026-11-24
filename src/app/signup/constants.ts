import { OnboardingSlide, StepInfo, SignupFormData, SignupFieldErrors } from "./types";
import { blobatarUri } from "blobatar/uri";

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    imageUrl: "",
    title: "يلا نعمل حساب جديد",
    desc: "أنشئ حسابك الآن مجاناً واستمتع بتجربة فريدة ومخصصة لحفظ أماكنك المفضلة وملاحظاتك الشخصية.",
  },
  {
    imageUrl: "",
    title: "كل موصلات مصر والاماكن هنا",
    desc: "هنا هتلاقي كل حاجة تخص التنقل في مصر سواء مواصلات عامة او اماكن خاصة.",
  },
  {
    imageUrl: "",
    title: "متستناش تتوه، اسأل قريب",
    desc: "  هتعرف الطرق والمواصلات وأي معلومة بتحتاجها بسهولة.",
  },
];

export const AVATARS_LIST: string[] = [
  blobatarUri("Ahmed"),
  blobatarUri("Omar"),
  blobatarUri("Tarek"),
  blobatarUri("Youssef"),
  blobatarUri("Ali"),
  blobatarUri("Sara"),
  blobatarUri("Nour"),
  blobatarUri("Layla"),
  blobatarUri("Hala"),
  blobatarUri("Mona"),
];

export const STEP_INFO: Record<number, StepInfo> = {
  1: {
    label: "عرفنا بنفسك",
    headerTitle: "عرفنا بنفسك؟",
    subTitle: "أدخل بياناتك الشخصية الأساسية",
    gradient: "linear-gradient(135deg, #6c63ff, #3b82f6)",
  },
  2: {
    label: "رقم الهاتف",
    headerTitle: "إيه هو رقم تليفونك؟",
    subTitle: "سنحتاج رقم هاتفك للتحقق والتواصل",
    gradient: "linear-gradient(135deg, #3b82f6, #00d4aa)",
  },
  3: {
    label: "الإقامة والسِن",
    headerTitle: "منين وعندك كام سنه؟",
    subTitle: "حدد تاريخ ميلادك ومكان إقامتك",
    gradient: "linear-gradient(135deg, #00d4aa, #ffa500)",
  },
  4: {
    label: "الصورة الشخصية",
    headerTitle: "الصورة الشخصية",
    subTitle: "اختر صورتك المفضلة أو ارفع صورة جديدة",
    gradient: "linear-gradient(135deg, #ff3f8e, #6c63ff)",
  },
  5: {
    label: "حماية الحساب",
    headerTitle: "حماية الحساب",
    subTitle: "أنشئ كلمة مرور قوية لحماية حسابك",
    gradient: "linear-gradient(135deg, #6c63ff, #10b981)",
  },
};

export const INITIAL_FORM_DATA: SignupFormData = {
  firstName: "",
  lastName: "",
  username: "",
  phone: "",
  email: "",
  dob: "",
  gender: "ذكر",
  governorate: "",
  city: "",
  avatarUrl: "",
  password: "",
  confirmPassword: "",
};

export const INITIAL_FIELD_ERRORS: SignupFieldErrors = {
  firstName: "",
  lastName: "",
  username: "",
  phone: "",
  email: "",
};
