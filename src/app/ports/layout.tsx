import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "دليل الموانئ المصرية | قريب",
  description: "دليل الموانئ البحرية التجارية والسياحية في مصر ومعلومات السفر.",
  alternates: { canonical: "https://qareebmap.vercel.app/ports" },
  openGraph: {
    title: "دليل الموانئ المصرية | قريب",
    description: "دليل الموانئ البحرية التجارية والسياحية في مصر ومعلومات السفر.",
    url: "https://qareebmap.vercel.app/ports",
    siteName: "قريب",
    locale: "ar_EG",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
