import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا | قريب",
  description: "ابعتلنا استفسارك أو اقتراحك أو بلاغ عن معلومة غلط، وفريق قريب هيرد عليك.",
  alternates: { canonical: "https://qareebmap.vercel.app/contact" },
  openGraph: {
    title: "تواصل معنا | قريب",
    description: "ابعتلنا استفسارك أو اقتراحك أو بلاغ عن معلومة غلط، وفريق قريب هيرد عليك.",
    url: "https://qareebmap.vercel.app/contact",
    siteName: "قريب",
    locale: "ar_EG",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
