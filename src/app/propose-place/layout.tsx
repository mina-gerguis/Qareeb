import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اقترح مكان جديد | قريب",
  description: "عارف مكان مش موجود على قريب؟ اقترحه وهنراجعه ونضيفه.",
  alternates: { canonical: "https://qareebmap.vercel.app/propose-place" },
  openGraph: {
    title: "اقترح مكان جديد | قريب",
    description: "عارف مكان مش موجود على قريب؟ اقترحه وهنراجعه ونضيفه.",
    url: "https://qareebmap.vercel.app/propose-place",
    siteName: "قريب",
    locale: "ar_EG",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
