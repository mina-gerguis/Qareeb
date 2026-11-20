import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | قريب",
  description: "إزاي قريب بيجمع بياناتك ويحميها.",
  alternates: { canonical: "https://qareebmap.vercel.app/privacy" },
  openGraph: {
    title: "سياسة الخصوصية | قريب",
    description: "إزاي قريب بيجمع بياناتك ويحميها.",
    url: "https://qareebmap.vercel.app/privacy",
    siteName: "قريب",
    locale: "ar_EG",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
