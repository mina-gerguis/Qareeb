import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "خريطة الأماكن التفاعلية | قريب",
  description: "استكشف المطاعم والكافيهات والعيادات والخدمات على خريطة تفاعلية في القاهرة الكبرى.",
  alternates: { canonical: "https://qareebmap.vercel.app/map" },
  openGraph: {
    title: "خريطة الأماكن التفاعلية | قريب",
    description: "استكشف المطاعم والكافيهات والعيادات والخدمات على خريطة تفاعلية في القاهرة الكبرى.",
    url: "https://qareebmap.vercel.app/map",
    siteName: "قريب",
    locale: "ar_EG",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
