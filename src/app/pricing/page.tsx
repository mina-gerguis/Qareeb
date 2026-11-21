import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "الأسعار والباقات | قريب",
  description:
    "اعرف أسعار باقات قريب: الباقة المجانية، باقة المشوار، الفضية والذهبية، وإيه اللي بتاخده في كل باقة.",
  alternates: { canonical: "https://qareebmap.vercel.app/pricing" },
};

export default function PricingPage() {
  return <PricingClient />;
}
