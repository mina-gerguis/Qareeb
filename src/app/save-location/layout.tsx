import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "أحفظ مكاني | قريب",
  description: "احفظ موقعك الحالي بدقة وشاركه برابط خرائط جوجل.",
  alternates: { canonical: "https://qareebmap.vercel.app/save-location" },
  openGraph: {
    title: "أحفظ مكاني | قريب",
    description: "احفظ موقعك الحالي بدقة وشاركه برابط خرائط جوجل.",
    url: "https://qareebmap.vercel.app/save-location",
    siteName: "قريب",
    locale: "ar_EG",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
