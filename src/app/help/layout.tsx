import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المساعدة والدعم | قريب",
  description: "الأسئلة الشائعة وطريقة استخدام قريب: المترو، الاتجاهات، الاشتراكات والدعم الفني.",
  alternates: { canonical: "https://qareebmap.vercel.app/help" },
  openGraph: {
    title: "المساعدة والدعم | قريب",
    description: "الأسئلة الشائعة وطريقة استخدام قريب: المترو، الاتجاهات، الاشتراكات والدعم الفني.",
    url: "https://qareebmap.vercel.app/help",
    siteName: "قريب",
    locale: "ar_EG",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
