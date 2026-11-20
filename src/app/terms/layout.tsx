import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام | قريب",
  description: "شروط وأحكام استخدام منصة قريب.",
  alternates: { canonical: "https://qareebmap.vercel.app/terms" },
  openGraph: {
    title: "الشروط والأحكام | قريب",
    description: "شروط وأحكام استخدام منصة قريب.",
    url: "https://qareebmap.vercel.app/terms",
    siteName: "قريب",
    locale: "ar_EG",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
