"use client";

import React from "react";
import styles from "../subscriptions.module.css";
import {
  NewUserTrialConfig,
  OpenPageAccessOffer,
  PROTECTED_PAGE_OPTIONS,
} from "../types";
import { getDaysRemainingInfo } from "./AdminSubscriptionsUsersTab";

interface AdminSubscriptionsPromotionsTabProps {
  // Trial Config
  trialConfig: NewUserTrialConfig;
  setTrialConfig: React.Dispatch<React.SetStateAction<NewUserTrialConfig>>;
  trialPreset: "7" | "30" | "90" | "custom";
  setTrialPreset: (p: "7" | "30" | "90" | "custom") => void;
  savingTrial: boolean;
  onSaveTrial: (e?: React.FormEvent) => void;
  // Open Offers
  openOffers: OpenPageAccessOffer[];
  loadingOffers: boolean;
  onOpenAddOffer: () => void;
  onEditOffer: (offer: OpenPageAccessOffer) => void;
  onToggleOfferStatus: (offer: OpenPageAccessOffer) => void;
  onDeleteOffer: (id: string, title: string) => void;
}

export function AdminSubscriptionsPromotionsTab({
  trialConfig,
  setTrialConfig,
  trialPreset,
  setTrialPreset,
  savingTrial,
  onSaveTrial,
  openOffers,
  loadingOffers,
  onOpenAddOffer,
  onEditOffer,
  onToggleOfferStatus,
  onDeleteOffer,
}: AdminSubscriptionsPromotionsTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* ── SECTION A: Automatic Free Trial for New Signups ── */}
      <div className={styles.promoCard}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: trialConfig.is_active
              ? "linear-gradient(90deg, #10b981, #3b82f6)"
              : "rgba(148, 163, 184, 0.3)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5rem" }}>🎁</span>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>
                العرض الترحيبي: اشتراك مجاني تلقائي للحسابات الجديدة
              </h3>
            </div>
            <p className={styles.headerText} style={{ marginTop: "6px", maxWidth: "720px", fontSize: "0.88rem" }}>
              عند تفعيل هذا العرض، أي مستخدم ينشئ حساباً جديداً في الموقع يحصل تلقائياً وبشكل فوري على باقة اشتراك مجانية للمدة المحددة مع رسالة ترحيبية في حسابه.
            </p>
          </div>

          {/* Toggle Switch */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: trialConfig.is_active
                ? "rgba(16, 185, 129, 0.15)"
                : "rgba(148, 163, 184, 0.15)",
              padding: "8px 16px",
              borderRadius: "14px",
              border: `1px solid ${
                trialConfig.is_active
                  ? "rgba(16, 185, 129, 0.3)"
                  : "rgba(148, 163, 184, 0.2)"
              }`,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              <input
                type="checkbox"
                checked={trialConfig.is_active}
                onChange={(e) =>
                  setTrialConfig({ ...trialConfig, is_active: e.target.checked })
                }
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#10b981",
                  cursor: "pointer",
                }}
              />
              <span>{trialConfig.is_active ? "العرض نشط حالياً 🟢" : "العرض معطّل ⚪"}</span>
            </label>
          </div>
        </div>

        <form onSubmit={onSaveTrial}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              background: "rgba(0, 0, 0, 0.15)",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid var(--border-glass, rgba(255, 255, 255, 0.08))",
            }}
          >
            {/* 1. Target Tier */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <i className="bx bx-crown" style={{ color: "#fbbf24" }} />
                <span>نوع باقة الهدية الترحيبية</span>
              </label>
              <select
                value={trialConfig.target_tier}
                onChange={(e) =>
                  setTrialConfig({
                    ...trialConfig,
                    target_tier: e.target.value as any,
                  })
                }
                className={styles.formSelect}
                style={{ fontWeight: 700 }}
              >
                <option value="gold">🥇 الباقة الذهبية (كل المميزات والخدمات مفتوحة)</option>
                <option value="silver">🥈 الباقة الفضية (المميزات المتقدمة)</option>
                <option value="mishwar">⚡ باقة المشوار (الوصول السريع)</option>
              </select>
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--color-text-muted, #94a3b8)",
                  marginTop: "4px",
                }}
              >
                سيتم منح المستخدم الجديد هذه الباقة فور استكمال التسجيل.
              </span>
            </div>

            {/* 2. Duration Presets */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <i className="bx bx-time" style={{ color: "#38bdf8" }} />
                <span>مدة الاشتراك المجاني</span>
              </label>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setTrialPreset("7");
                    setTrialConfig({ ...trialConfig, duration_days: 7 });
                  }}
                  className={`${styles.quickDurationBtn} ${
                    trialPreset === "7" ? styles.quickDurationBtnActive : ""
                  }`}
                >
                  أسبوع (7 أيام)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTrialPreset("30");
                    setTrialConfig({ ...trialConfig, duration_days: 30 });
                  }}
                  className={`${styles.quickDurationBtn} ${
                    trialPreset === "30" ? styles.quickDurationBtnActive : ""
                  }`}
                >
                  شهر (30 يوم)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTrialPreset("90");
                    setTrialConfig({ ...trialConfig, duration_days: 90 });
                  }}
                  className={`${styles.quickDurationBtn} ${
                    trialPreset === "90" ? styles.quickDurationBtnActive : ""
                  }`}
                >
                  3 شهور (90 يوم)
                </button>

                <button
                  type="button"
                  onClick={() => setTrialPreset("custom")}
                  className={`${styles.quickDurationBtn} ${
                    trialPreset === "custom" ? styles.quickDurationBtnActive : ""
                  }`}
                >
                  مخصص
                </button>
              </div>

              {trialPreset === "custom" && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="number"
                    min="1"
                    max="3650"
                    value={trialConfig.duration_days}
                    onChange={(e) =>
                      setTrialConfig({
                        ...trialConfig,
                        duration_days: Number(e.target.value),
                      })
                    }
                    className={styles.formInput}
                    placeholder="عدد الأيام..."
                    style={{ width: "140px" }}
                  />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-muted, #94a3b8)",
                      fontWeight: 600,
                    }}
                  >
                    يوم
                  </span>
                </div>
              )}
            </div>

            {/* 3. Welcome Notification Message */}
            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.formLabel}>
                نص رسالة الإشعار الترحيبي للمستخدمين الجدد
              </label>
              <textarea
                rows={2}
                value={trialConfig.welcome_message}
                onChange={(e) =>
                  setTrialConfig({
                    ...trialConfig,
                    welcome_message: e.target.value,
                  })
                }
                className={styles.formTextarea}
                placeholder="🎉 تهانينا! حصلت على اشتراك مجاني كهدية ترحيبية لتسجيل حسابك الجديد."
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
            <button
              type="submit"
              disabled={savingTrial}
              className={styles.primaryBtn}
              style={{
                background: trialConfig.is_active
                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  : undefined,
              }}
            >
              <i className="bx bx-save" />
              <span>{savingTrial ? "جاري الحفظ..." : "حفظ إعدادات العرض الترحيبي"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── SECTION B: Temporary Open Access for Protected Pages ── */}
      <div className={styles.promoCard}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5rem" }}>🔓</span>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>
                فتح الصفحات والخدمات المدفوعة مجاناً للجميع
              </h3>
            </div>
            <p className={styles.headerText} style={{ marginTop: "6px", fontSize: "0.88rem" }}>
              إتاحة صفحة أو خدمة تتطلب اشتراكاً (مثل ازاي اروح، المساعد الذكي، المطارات) للوصول المجاني لكل الزوار والمستخدمين لفترة زمنية محددة.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddOffer}
            className={styles.primaryBtn}
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            }}
          >
            <i className="bx bx-plus-circle" style={{ fontSize: "1.15rem" }} />
            <span>إضافة عرض فتح صفحة +</span>
          </button>
        </div>

        {loadingOffers ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                border: "2.5px solid var(--border-glass, rgba(255,255,255,0.1))",
                borderTop: "2.5px solid #f59e0b",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            <p style={{ color: "var(--color-text-muted, #94a3b8)", margin: 0 }}>
              جاري تحميل عروض الصفحات...
            </p>
          </div>
        ) : openOffers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
            <i className="bx bx-lock-open" style={{ fontSize: "3rem", opacity: 0.4 }} />
            <h4 style={{ margin: "10px 0 6px", color: "var(--color-fg, #ffffff)" }}>
              لا توجد عروض فتح مؤقتة حالياً
            </h4>
            <p style={{ margin: 0, fontSize: "0.88rem" }}>
              يمكنك النقر على زر «إضافة عرض فتح صفحة» لإتاحة أي خدمة مجاناً لفترة محددة.
            </p>
          </div>
        ) : (
          <div className={styles.table05Container}>
            <div className={styles.table05Scroll}>
              <table className={styles.table05}>
                <thead>
                  <tr>
                    <th className={styles.table05Th} style={{ minWidth: "200px" }}>
                      عنوان العرض
                    </th>
                    <th className={styles.table05Th} style={{ minWidth: "150px" }}>
                      الصفحة / الخدمة
                    </th>
                    <th className={styles.table05Th} style={{ minWidth: "170px" }}>
                      فترة الإتاحة والانتهاء
                    </th>
                    <th className={styles.table05Th} style={{ minWidth: "130px" }}>
                      الحالة
                    </th>
                    <th
                      className={styles.table05Th}
                      style={{ width: "120px", textAlign: "center" }}
                    >
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {openOffers.map((offer) => {
                    const isExpired =
                      offer.end_date && new Date(offer.end_date) < new Date();
                    const pageOption = PROTECTED_PAGE_OPTIONS.find(
                      (p) => p.value === offer.target_page
                    );
                    const pageLabel = pageOption ? pageOption.label : offer.target_page;

                    return (
                      <tr key={offer.id} className={styles.table05Tr}>
                        <td className={styles.table05Td}>
                          <div style={{ fontWeight: 700, color: "var(--color-fg, #ffffff)" }}>
                            {offer.title}
                          </div>
                          {offer.banner_message && (
                            <div
                              style={{
                                fontSize: "0.78rem",
                                color: "var(--color-text-muted, #94a3b8)",
                                marginTop: "3px",
                                maxWidth: "280px",
                              }}
                            >
                              {offer.banner_message}
                            </div>
                          )}
                        </td>

                        <td className={styles.table05Td}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 10px",
                              borderRadius: "10px",
                              background: "rgba(59, 130, 246, 0.15)",
                              color: "#60a5fa",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                            }}
                          >
                            {pageLabel}
                          </span>
                        </td>

                        <td className={styles.table05Td}>
                          <div style={{ fontWeight: 700 }}>
                            {offer.end_date
                              ? new Date(offer.end_date).toLocaleDateString("ar-EG")
                              : "مفتوح دائم حتى الإيقاف"}
                          </div>
                          {getDaysRemainingInfo(
                            offer.end_date,
                            offer.is_active ? "active" : "expired"
                          )}
                        </td>

                        <td className={styles.table05Td}>
                          <span
                            className={
                              !offer.is_active || isExpired
                                ? styles.statusBadgeExpired
                                : styles.statusBadgeActive
                            }
                          >
                            {isExpired
                              ? "منتهي 🔴"
                              : offer.is_active
                              ? "مفتوح للجميع 🟢"
                              : "معطّل ⚪"}
                          </span>
                        </td>

                        <td className={styles.table05Td} style={{ textAlign: "center" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => onToggleOfferStatus(offer)}
                              className={styles.secondaryBtn}
                              style={{
                                padding: "6px 9px",
                                borderRadius: "8px",
                                color: offer.is_active ? "#f87171" : "#34d399",
                              }}
                              title={offer.is_active ? "إيقاف مؤقت" : "تشغيل العرض"}
                            >
                              <i
                                className={`bx ${offer.is_active ? "bx-pause" : "bx-play"}`}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() => onEditOffer(offer)}
                              className={styles.secondaryBtn}
                              style={{ padding: "6px 9px", borderRadius: "8px" }}
                              title="تعديل العرض"
                            >
                              <i className="bx bx-edit" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteOffer(offer.id, offer.title)}
                              className={styles.secondaryBtn}
                              style={{
                                padding: "6px 9px",
                                borderRadius: "8px",
                                color: "#f87171",
                              }}
                              title="حذف العرض"
                            >
                              <i className="bx bx-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
