import React from "react";
import { MonorailPrice } from "../types";
import monorailStyles from "../admin-monorail.module.css";
import { IconArchiveFilled } from "@tabler/icons-react";

interface AdminMonorailPricingFormProps {
  ticketPrices: MonorailPrice[];
  onPriceChange: (index: number, field: keyof MonorailPrice, val: unknown) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminMonorailPricingForm({
  ticketPrices,
  onPriceChange,
  onSubmit,
}: AdminMonorailPricingFormProps) {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 className="fs-3xl fw-900 color-fg">إدارة أسعار تذاكر المونوريل</h2>
        <p className={monorailStyles.headerSubtitle}>
          تعديل شرائح أسعار التذاكر بناءً على عدد محطات الرحلة التي يقطعها الراكب.
        </p>
      </div>

      <form onSubmit={onSubmit} className={monorailStyles.pricingCard}>
        <div className={monorailStyles.pricingTiersList}>
          {ticketPrices.map((tier, idx) => (
            <div key={tier.id || idx} className={monorailStyles.pricingTierRow}>
              <div className={monorailStyles.pricingTierNameCol}>
                <label className="help-label" style={{ display: "block", marginBottom: "6px" }}>
                  اسم الشريحة / المنطقة
                </label>
                <input
                  type="text"
                  disabled
                  value={tier.tier_name || ""}
                  className="input-fields"
                  style={{ width: "100%", background: "rgba(255,255,255,0.02)", color: "var(--text-secondary)" }}
                />
              </div>
              <div>
                <label className="help-label" style={{ display: "block", marginBottom: "6px" }}>
                  أقصى عدد محطات
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={tier.max_stations || 1}
                  onChange={e => onPriceChange(idx, "max_stations", parseInt(e.target.value) || 1)}
                  className="input-fields"
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label className="help-label" style={{ display: "block", marginBottom: "6px" }}>
                  السعر (ج.م)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={tier.price || 0}
                  onChange={e => onPriceChange(idx, "price", parseInt(e.target.value) || 0)}
                  className="input-fields"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={monorailStyles.pricingSubmitRow}>
          <button type="submit" className="btn btn-blue w-full">
            <IconArchiveFilled size={20} />
            حفظ تعديلات أسعار تذاكر المونوريل
          </button>
        </div>
      </form>
    </div>
  );
}
