"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import adminStyles from "../admin.module.css";
import rStyles from "./referrals.module.css";
import {
  ReferralRecord,
  ReferralSettings,
  ReferralStatsSummary,
  ReferrerLeaderboardItem,
} from "@/types/referrals";
import {
  DEFAULT_REFERRAL_SETTINGS,
  fetchAdminReferralsList,
  fetchReferralSettings,
  fetchReferralsSummary,
  fetchTopReferrersLeaderboard,
  updateReferralSettings,
} from "@/lib/referrals";
import { useAuth } from "@/context/AuthContext";

export default function AdminReferralsPage() {
  const { user } = useAuth();

  // Active tab: 'settings' | 'records' | 'leaderboard'
  const [activeTab, setActiveTab] = useState<"settings" | "records" | "leaderboard">("settings");

  // Loading states
  const [loading, setLoading] = useState<boolean>(true);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Data states
  const [settings, setSettings] = useState<ReferralSettings>(DEFAULT_REFERRAL_SETTINGS);
  const [stats, setStats] = useState<ReferralStatsSummary>({
    totalReferrals: 0,
    rewardedCount: 0,
    pendingCount: 0,
    fraudBlockedCount: 0,
    maxReachedCount: 0,
    totalRewardsDistributed: 0,
    rewardType: "points",
  });
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [leaderboard, setLeaderboard] = useState<ReferrerLeaderboardItem[]>([]);

  // Filtering states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Initial load
  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedSettings, fetchedStats, fetchedList, fetchedTop] = await Promise.all([
        fetchReferralSettings(),
        fetchReferralsSummary(),
        fetchAdminReferralsList({ status: statusFilter, searchQuery }),
        fetchTopReferrersLeaderboard(),
      ]);

      setSettings(fetchedSettings);
      setStats(fetchedStats);
      setReferrals(fetchedList);
      setLeaderboard(fetchedTop);
    } catch (err) {
      console.error("Error loading referral admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Re-fetch list when filter or search changes
  useEffect(() => {
    const handler = setTimeout(async () => {
      const list = await fetchAdminReferralsList({ status: statusFilter, searchQuery });
      setReferrals(list);
    }, 250);

    return () => clearTimeout(handler);
  }, [statusFilter, searchQuery]);

  // Handle saving settings
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setActionMessage(null);

    const res = await updateReferralSettings(settings, user?.id);
    if (res.success) {
      setActionMessage({ type: "success", text: "تم حفظ إعدادات نظام الإحالات وشروط المكافأة بنجاح!" });
      // Update stats with current reward type
      setStats((prev) => ({ ...prev, rewardType: settings.reward_type }));
    } else {
      setActionMessage({ type: "error", text: res.error || "تعذر حفظ الإعدادات، يرجى المحاولة مرة أخرى." });
    }
    setSavingSettings(false);

    setTimeout(() => {
      setActionMessage(null);
    }, 4500);
  };

  const getRewardUnit = () => (settings.reward_type === "promo_balance" ? "ج.م" : "نقطة");

  return (
    <div className={rStyles.pageWrapper}>
      {/* Header */}
      <div className={rStyles.headerRow}>
        <div className={rStyles.headerText}>
          <h1>
            <i className="bx bx-share-alt" style={{ color: "#3b82f6" }} />
            إدارة نظام الإحالات والدعوات (Referrals Hub)
          </h1>
          <p>
            التحكم في شروط الدعوات، أقصى عدد لكل مستخدم، مكافآت الباقات، وحماية الـ IP التلقائية من التحايل.
          </p>
        </div>

        <div className={rStyles.headerActions}>
          <div
            className={`${rStyles.systemBadge} ${
              settings.is_enabled ? rStyles.systemBadgeActive : rStyles.systemBadgeInactive
            }`}
          >
            <span className={rStyles.pulseDot} />
            {settings.is_enabled ? "نظام الإحالات مفعّل" : "نظام الإحالات متوقف"}
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className={adminStyles.primaryBtn}
            style={{ padding: "8px 14px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.12)" }}
            title="تحديث البيانات"
          >
            <i className={`bx bx-refresh ${loading ? "bx-spin" : ""}`} />
            تحديث
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className={adminStyles.statsGrid}>
        {/* Total Referrals */}
        <div className={adminStyles.statCard}>
          <div className={adminStyles.statCardHeader}>
            <span className={adminStyles.statCardTitle}>إجمالي الدعوات المسجلة</span>
            <div className={adminStyles.statCardIcon} style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
              <i className="bx bx-group" />
            </div>
          </div>
          <div className={adminStyles.statCardValue}>{stats.totalReferrals.toLocaleString("ar-EG")}</div>
          <div className={adminStyles.statCardSub}>إجمالي من سجلوا عبر كود دعوة</div>
        </div>

        {/* Rewarded (Successful) */}
        <div className={adminStyles.statCard}>
          <div className={adminStyles.statCardHeader}>
            <span className={adminStyles.statCardTitle}>مكتملة ومكافأة</span>
            <div className={adminStyles.statCardIcon} style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
              <i className="bx bx-check-double" />
            </div>
          </div>
          <div className={adminStyles.statCardValue} style={{ color: "#10b981" }}>
            {stats.rewardedCount.toLocaleString("ar-EG")}
          </div>
          <div className={adminStyles.statCardSub}>استوفوا الشروط وحصلوا على المكافأة</div>
        </div>

        {/* Pending Subscriptions */}
        <div className={adminStyles.statCard}>
          <div className={adminStyles.statCardHeader}>
            <span className={adminStyles.statCardTitle}>في انتظار الاشتراك (Pending)</span>
            <div className={adminStyles.statCardIcon} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
              <i className="bx bx-time" />
            </div>
          </div>
          <div className={adminStyles.statCardValue} style={{ color: "#f59e0b" }}>
            {stats.pendingCount.toLocaleString("ar-EG")}
          </div>
          <div className={adminStyles.statCardSub}>بانتظار شراء باقة (مشوار/فضية/ذهبية)</div>
        </div>

        {/* Fraud Attempts Blocked */}
        <div className={adminStyles.statCard}>
          <div className={adminStyles.statCardHeader}>
            <span className={adminStyles.statCardTitle}>محاولات تحايل محظورة</span>
            <div className={adminStyles.statCardIcon} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
              <i className="bx bx-shield-x" />
            </div>
          </div>
          <div className={adminStyles.statCardValue} style={{ color: "#ef4444" }}>
            {stats.fraudBlockedCount.toLocaleString("ar-EG")}
          </div>
          <div className={adminStyles.statCardSub}>تم صدهم تلقائياً عبر فحص الـ IP</div>
        </div>

        {/* Total Rewards Given */}
        <div className={adminStyles.statCard}>
          <div className={adminStyles.statCardHeader}>
            <span className={adminStyles.statCardTitle}>إجمالي المكافآت المصروفة</span>
            <div className={adminStyles.statCardIcon} style={{ background: "rgba(168, 85, 247, 0.15)", color: "#a855f7" }}>
              <i className="bx bx-gift" />
            </div>
          </div>
          <div className={adminStyles.statCardValue}>
            {stats.totalRewardsDistributed.toLocaleString("ar-EG")}
            <span style={{ fontSize: "0.85rem", marginRight: "6px", color: "#94a3b8" }}>
              {stats.rewardType === "promo_balance" ? "ج.م" : "نقطة"}
            </span>
          </div>
          <div className={adminStyles.statCardSub}>إجمالي ما ربحه المستخدمون</div>
        </div>
      </div>

      {/* Tabs */}
      <div className={rStyles.tabsContainer}>
        <button
          className={`${rStyles.tabBtn} ${activeTab === "settings" ? rStyles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <i className="bx bx-slider-alt" />
          إعدادات وشروط النظام
        </button>

        <button
          className={`${rStyles.tabBtn} ${activeTab === "records" ? rStyles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("records")}
        >
          <i className="bx bx-list-ul" />
          سجل وتتبع الإحالات ({referrals.length})
        </button>

        <button
          className={`${rStyles.tabBtn} ${activeTab === "leaderboard" ? rStyles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("leaderboard")}
        >
          <i className="bx bx-trophy" />
          لوحة الشرف (أفضل الدعاة)
        </button>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          style={{
            padding: "12px 18px",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: actionMessage.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
            color: actionMessage.type === "success" ? "#10b981" : "#ef4444",
            border: `1px solid ${actionMessage.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
          }}
        >
          <i className={actionMessage.type === "success" ? "bx bx-check-circle" : "bx bx-error-circle"} style={{ fontSize: "1.2rem" }} />
          {actionMessage.text}
        </div>
      )}

      {/* TAB 1: SETTINGS */}
      {activeTab === "settings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className={rStyles.settingsGrid}>
            {/* 1. General Activation & Limits */}
            <div className={rStyles.settingsCard}>
              <div className={rStyles.cardHeader}>
                <div className={`${rStyles.cardIcon} ${rStyles.iconBlue}`}>
                  <i className="bx bx-toggle-right" />
                </div>
                <div>
                  <h3 className={rStyles.cardTitle}>التشغيل والحدود العامة</h3>
                  <p className={rStyles.cardSubtitle}>التحكم بحالة النظام والحد الأقصى لكل مستخدم</p>
                </div>
              </div>

              {/* Master Toggle */}
              <div className={rStyles.switchToggle}>
                <div className={rStyles.switchInfo}>
                  <h4>تفعيل نظام الإحالات</h4>
                  <p>إتاحة إنشاء ومشاركة أكواد الدعوة للمستخدمين</p>
                </div>
                <button
                  type="button"
                  className={`${rStyles.switchBtn} ${settings.is_enabled ? rStyles.switchBtnOn : ""}`}
                  onClick={() => setSettings({ ...settings, is_enabled: !settings.is_enabled })}
                >
                  <div className={rStyles.switchKnob} />
                </button>
              </div>

              {/* Max Referrals Per User */}
              <div className={rStyles.formGroup}>
                <label className={rStyles.formLabel}>
                  <span>أقصى عدد دعوات لكل مستخدم</span>
                  <span style={{ color: "#3b82f6", cursor: "pointer" }} onClick={() => setSettings({ ...settings, max_referrals_per_user: 0 })}>
                    (0 = غير محدود)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={settings.max_referrals_per_user}
                  onChange={(e) => setSettings({ ...settings, max_referrals_per_user: parseInt(e.target.value) || 0 })}
                  className={rStyles.formInput}
                  placeholder="مثال: 5 أو 10 دعوات فقط"
                />
                <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                  {settings.max_referrals_per_user === 0
                    ? "✨ مسموح للمستخدم بعدد دعوات ومكافآت غير محدود."
                    : `🔒 بمجرد وصول المستخدم إلى (${settings.max_referrals_per_user}) إحالات مكافأة، لن يحصل على مكافآت إضافية.`}
                </span>
              </div>

              {/* Reward Currency Type */}
              <div className={rStyles.formGroup}>
                <label className={rStyles.formLabel}>نوع المكافأة الممنوحة</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div
                    className={`${rStyles.radioOption} ${settings.reward_type === "points" ? rStyles.radioOptionActive : ""}`}
                    onClick={() => setSettings({ ...settings, reward_type: "points" })}
                  >
                    <i className="bx bx-coin" style={{ color: "#f59e0b", fontSize: "1.2rem" }} />
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: "700" }}>نقاط مكافآت</div>
                      <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>تضاف لرصيد النقاط (Points)</div>
                    </div>
                  </div>

                  <div
                    className={`${rStyles.radioOption} ${settings.reward_type === "promo_balance" ? rStyles.radioOptionActive : ""}`}
                    onClick={() => setSettings({ ...settings, reward_type: "promo_balance" })}
                  >
                    <i className="bx bx-wallet" style={{ color: "#10b981", fontSize: "1.2rem" }} />
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: "700" }}>رصيد ترويجي (EGP)</div>
                      <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>يستخدم للشراء والاشتراك</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Anti-Fraud & IP Protection */}
            <div className={rStyles.settingsCard}>
              <div className={rStyles.cardHeader}>
                <div className={`${rStyles.cardIcon} ${rStyles.iconRed}`}>
                  <i className="bx bx-shield-quarter" />
                </div>
                <div>
                  <h3 className={rStyles.cardTitle}>الأمان ومكافحة التحايل الذكية</h3>
                  <p className={rStyles.cardSubtitle}>فحص عناوين الـ IP ومنع التكرار والحسابات الوهمية</p>
                </div>
              </div>

              {/* IP Check Switch */}
              <div className={rStyles.switchToggle}>
                <div className={rStyles.switchInfo}>
                  <h4>فحص ومطابقة عنوان الـ IP</h4>
                  <p>منع الداعي من التسجيل لنفسه من نفس الشبكة أو تكرار نفس الـ IP</p>
                </div>
                <button
                  type="button"
                  className={`${rStyles.switchBtn} ${settings.block_same_ip ? rStyles.switchBtnOn : ""}`}
                  onClick={() => setSettings({ ...settings, block_same_ip: !settings.block_same_ip })}
                >
                  <div className={rStyles.switchKnob} />
                </button>
              </div>

              {/* Auto Suspend Fraudster */}
              <div className={rStyles.switchToggle}>
                <div className={rStyles.switchInfo}>
                  <h4>حظر الحساب المتلاعب تلقائياً</h4>
                  <p>تعليق الحساب فوراً وإلغاء جلساته عند رصد محاولة تحايل بتكرار الـ IP</p>
                </div>
                <button
                  type="button"
                  className={`${rStyles.switchBtn} ${settings.auto_suspend_fraud ? rStyles.switchBtnOn : ""}`}
                  onClick={() => setSettings({ ...settings, auto_suspend_fraud: !settings.auto_suspend_fraud })}
                >
                  <div className={rStyles.switchKnob} />
                </button>
              </div>

              <div
                style={{
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px dashed rgba(239, 68, 68, 0.25)",
                  borderRadius: "10px",
                  padding: "12px",
                  fontSize: "0.8rem",
                  color: "#fca5a5",
                  lineHeight: "1.5",
                }}
              >
                <i className="bx bx-info-circle" style={{ marginLeft: "6px" }} />
                عند رصد تطابق الـ IP بين المسجل وصاحب كود الدعوة، يتم إلغاء المكافأة فوراً وتسجيل المحاولة في جدول الإحالات كـ <strong>احتيال محظور (Fraud Blocked)</strong> دون أن يخسر موقعك أي مبالغ أو نقاط.
              </div>
            </div>
          </div>

          {/* 3. Reward Trigger Conditions */}
          <div className={rStyles.settingsCard}>
            <div className={rStyles.cardHeader}>
              <div className={`${rStyles.cardIcon} ${rStyles.iconAmber}`}>
                <i className="bx bx-award" />
              </div>
              <div>
                <h3 className={rStyles.cardTitle}>شروط احتساب وصرف المكافأة</h3>
                <p className={rStyles.cardSubtitle}>حدد متى تُصرف المكافأة وقيمتها لكل باقة اشتراك</p>
              </div>
            </div>

            <div className={rStyles.radioGroup}>
              {/* Option A: Require Subscription */}
              <div
                className={`${rStyles.radioOption} ${settings.require_subscription ? rStyles.radioOptionActive : ""}`}
                onClick={() => setSettings({ ...settings, require_subscription: true })}
              >
                <input
                  type="radio"
                  name="sub_rule"
                  checked={settings.require_subscription}
                  onChange={() => setSettings({ ...settings, require_subscription: true })}
                  style={{ marginTop: "4px" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#f8fafc" }}>
                    ⭐ يشترط اشتراك الشخص المدعو في باقة مدفوعة (موصى به)
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "2px" }}>
                    تظل الإحالة في حالة "معلقة" حتى يقوم المدعو بالاشتراك في (باقة المشوار، الفضية، أو الذهبية)، وتُصرف المكافأة المخصصة لكل باقة فوراً.
                  </div>
                </div>
              </div>

              {/* Option B: No Conditions */}
              <div
                className={`${rStyles.radioOption} ${!settings.require_subscription ? rStyles.radioOptionActive : ""}`}
                onClick={() => setSettings({ ...settings, require_subscription: false })}
              >
                <input
                  type="radio"
                  name="sub_rule"
                  checked={!settings.require_subscription}
                  onChange={() => setSettings({ ...settings, require_subscription: false })}
                  style={{ marginTop: "4px" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#f8fafc" }}>
                    🎁 بدون شروط خالص (بمجرد التسجيل وتفعيل الحساب)
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "2px" }}>
                    تُصرف المكافأة للداعي والمدعو مباشرة عند إنشاء الحساب دون اشتراط شراء أي باقة.
                  </div>
                </div>
              </div>
            </div>

            {/* If NO condition: Simple registration reward */}
            {!settings.require_subscription ? (
              <div className={rStyles.formGroup} style={{ marginTop: "10px" }}>
                <label className={rStyles.formLabel}>
                  مكافأة التسجيل المجاني للداعي ({getRewardUnit()})
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.reward_no_condition}
                  onChange={(e) => setSettings({ ...settings, reward_no_condition: parseFloat(e.target.value) || 0 })}
                  className={rStyles.formInput}
                  placeholder="مثال: 20"
                />
              </div>
            ) : (
              /* If REQUIRES subscription: Per-tier rewards */
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "#cbd5e1" }}>
                  حدد مكافأة الداعي بحسب الباقة التي يشترك بها صديقه:
                </div>

                <div className={rStyles.tierGrid}>
                  {/* Mishwar Plan */}
                  <div className={rStyles.tierCard}>
                    <div className={rStyles.tierTitle}>
                      <i className="bx bx-run" style={{ color: "#38bdf8" }} />
                      باقة المشوار (24 ساعة)
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="number"
                        min="0"
                        value={settings.reward_mishwar}
                        onChange={(e) => setSettings({ ...settings, reward_mishwar: parseFloat(e.target.value) || 0 })}
                        className={rStyles.formInput}
                      />
                      <span style={{ fontSize: "0.85rem", color: "#94a3b8", whiteSpace: "nowrap" }}>{getRewardUnit()}</span>
                    </div>
                  </div>

                  {/* Silver Plan */}
                  <div className={rStyles.tierCard}>
                    <div className={rStyles.tierTitle}>
                      <i className="bx bxs-badge" style={{ color: "#94a3b8" }} />
                      الباقة الفضية (شهر/سنة)
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="number"
                        min="0"
                        value={settings.reward_silver}
                        onChange={(e) => setSettings({ ...settings, reward_silver: parseFloat(e.target.value) || 0 })}
                        className={rStyles.formInput}
                      />
                      <span style={{ fontSize: "0.85rem", color: "#94a3b8", whiteSpace: "nowrap" }}>{getRewardUnit()}</span>
                    </div>
                  </div>

                  {/* Gold Plan */}
                  <div className={rStyles.tierCard}>
                    <div className={rStyles.tierTitle}>
                      <i className="bx bxs-crown" style={{ color: "#f59e0b" }} />
                      الباقة الذهبية (VIP)
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="number"
                        min="0"
                        value={settings.reward_gold}
                        onChange={(e) => setSettings({ ...settings, reward_gold: parseFloat(e.target.value) || 0 })}
                        className={rStyles.formInput}
                      />
                      <span style={{ fontSize: "0.85rem", color: "#94a3b8", whiteSpace: "nowrap" }}>{getRewardUnit()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Bonus for the new invited user */}
            <div className={rStyles.formGroup} style={{ marginTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "14px" }}>
              <label className={rStyles.formLabel}>
                هدية ترحيبية للمسجل الجديد ({getRewardUnit()}) - تشجيعاً له على قبول الدعوة
              </label>
              <input
                type="number"
                min="0"
                value={settings.reward_invited_user}
                onChange={(e) => setSettings({ ...settings, reward_invited_user: parseFloat(e.target.value) || 0 })}
                className={rStyles.formInput}
                placeholder="مثال: 15"
              />
            </div>
          </div>

          {/* Sticky Save Bar */}
          <div className={rStyles.saveFloatingBar}>
            <div>
              <div style={{ fontWeight: "700", color: "#f8fafc" }}>جاهز لحفظ التعديلات؟</div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>سيتم تطبيق الشروط والمكافآت فوراً على جميع الدعوات القادمة.</div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className={adminStyles.primaryBtn}
              style={{ padding: "10px 24px", fontSize: "0.95rem" }}
            >
              {savingSettings ? (
                <>
                  <i className="bx bx-loader-alt bx-spin" /> جاري الحفظ...
                </>
              ) : (
                <>
                  <i className="bx bx-check" /> حفظ وتطبيق الإعدادات
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: REFERRALS RECORDS & TRACKER */}
      {activeTab === "records" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Filter and Search Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
              background: "#111827",
              padding: "14px 18px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Search Input */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "260px" }}>
              <i className="bx bx-search" style={{ color: "#94a3b8", fontSize: "1.2rem" }} />
              <input
                type="text"
                placeholder="ابحث بالاسم، البريد، كود الدعوة، أو عنوان الـ IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#f8fafc",
                  fontSize: "0.9rem",
                  width: "100%",
                }}
              />
            </div>

            {/* Status Pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { key: "all", label: "الكل" },
                { key: "rewarded", label: "مكتملة ومكافأة" },
                { key: "pending", label: "معلقة" },
                { key: "fraud_blocked", label: "احتيال محظور" },
                { key: "max_reached", label: "تجاوز الحد" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setStatusFilter(item.key)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: statusFilter === item.key ? "#3b82f6" : "rgba(255, 255, 255, 0.08)",
                    background: statusFilter === item.key ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.03)",
                    color: statusFilter === item.key ? "#3b82f6" : "#94a3b8",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className={adminStyles.tableCard}>
            <div className={adminStyles.tableResponsive}>
              <table className={adminStyles.adminTable}>
                <thead>
                  <tr>
                    <th className={adminStyles.adminTh}>الداعي (صاحب الكود)</th>
                    <th className={adminStyles.adminTh}>المدعو (المسجل الجديد)</th>
                    <th className={adminStyles.adminTh}>كود الدعوة</th>
                    <th className={adminStyles.adminTh}>عنوان الـ IP</th>
                    <th className={adminStyles.adminTh}>الباقة المشترك بها</th>
                    <th className={adminStyles.adminTh}>قيمة المكافأة</th>
                    <th className={adminStyles.adminTh}>الحالة</th>
                    <th className={adminStyles.adminTh}>تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                        <i className="bx bx-inbox" style={{ fontSize: "2.5rem", display: "block", marginBottom: "8px", opacity: 0.5 }} />
                        لا توجد أي سجلات إحالة تطابق معايير البحث الحالية.
                      </td>
                    </tr>
                  ) : (
                    referrals.map((row) => (
                      <tr key={row.id}>
                        {/* Referrer */}
                        <td className={adminStyles.adminTd}>
                          <div className={rStyles.userTableCell}>
                            {row.referrer?.avatar_url ? (
                              <Image
                                src={row.referrer.avatar_url}
                                alt="avatar"
                                width={34}
                                height={34}
                                className={rStyles.userAvatar}
                              />
                            ) : (
                              <div className={rStyles.userAvatar} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="bx bx-user" style={{ color: "#94a3b8" }} />
                              </div>
                            )}
                            <div className={rStyles.userMeta}>
                              <span className={rStyles.userName}>{row.referrer?.full_name || "مستخدم"}</span>
                              <span className={rStyles.userEmail}>{row.referrer?.email || ""}</span>
                            </div>
                          </div>
                        </td>

                        {/* Referred User */}
                        <td className={adminStyles.adminTd}>
                          <div className={rStyles.userTableCell}>
                            {row.referred?.avatar_url ? (
                              <Image
                                src={row.referred.avatar_url}
                                alt="avatar"
                                width={34}
                                height={34}
                                className={rStyles.userAvatar}
                              />
                            ) : (
                              <div className={rStyles.userAvatar} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="bx bx-user-plus" style={{ color: "#94a3b8" }} />
                              </div>
                            )}
                            <div className={rStyles.userMeta}>
                              <span className={rStyles.userName}>{row.referred?.full_name || "مسجل جديد"}</span>
                              <span className={rStyles.userEmail}>{row.referred?.email || ""}</span>
                            </div>
                          </div>
                        </td>

                        {/* Referral Code */}
                        <td className={adminStyles.adminTd}>
                          <span style={{ fontFamily: "monospace", fontWeight: "700", color: "#38bdf8", direction: "ltr" }}>
                            {row.referral_code_used}
                          </span>
                        </td>

                        {/* IP Address */}
                        <td className={adminStyles.adminTd}>
                          <span className={rStyles.ipBadge}>
                            <i className="bx bx-network-chart" />
                            {row.ip_address || "غير مسجل"}
                          </span>
                        </td>

                        {/* Plan */}
                        <td className={adminStyles.adminTd}>
                          {row.plan_subscribed ? (
                            <span style={{ fontWeight: "600", color: "#f8fafc" }}>
                              {row.plan_subscribed === "gold"
                                ? "👑 الباقة الذهبية"
                                : row.plan_subscribed === "silver"
                                ? "🥈 الباقة الفضية"
                                : "⚡ باقة المشوار"}
                            </span>
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>باقة مجانية</span>
                          )}
                        </td>

                        {/* Reward Amount */}
                        <td className={adminStyles.adminTd}>
                          {row.reward_amount > 0 ? (
                            <span style={{ fontWeight: "700", color: "#10b981" }}>
                              +{row.reward_amount} {row.reward_type === "promo_balance" ? "ج.م" : "نقطة"}
                            </span>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>—</span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className={adminStyles.adminTd}>
                          {row.status === "rewarded" && (
                            <span className={`${rStyles.statusBadge} ${rStyles.statusRewarded}`}>
                              <i className="bx bx-check-circle" />
                              مكتملة ومكافأة
                            </span>
                          )}
                          {row.status === "pending" && (
                            <span className={`${rStyles.statusBadge} ${rStyles.statusPending}`}>
                              <i className="bx bx-time" />
                              في انتظار الاشتراك
                            </span>
                          )}
                          {row.status === "fraud_blocked" && (
                            <span className={`${rStyles.statusBadge} ${rStyles.statusFraud}`} title={row.rejection_reason || "محاولة تحايل بالـ IP"}>
                              <i className="bx bx-shield-x" />
                              احتيال محظور
                            </span>
                          )}
                          {row.status === "max_reached" && (
                            <span className={`${rStyles.statusBadge} ${rStyles.statusMax}`} title={row.rejection_reason || "تجاوز الحد الأقصى للدعوات"}>
                              <i className="bx bx-block" />
                              تجاوز الحد
                            </span>
                          )}
                        </td>

                        {/* Created At */}
                        <td className={adminStyles.adminTd} style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                          {new Date(row.created_at).toLocaleDateString("ar-EG", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEADERBOARD */}
      {activeTab === "leaderboard" && (
        <div className={adminStyles.tableCard}>
          <div className={adminStyles.tableHeaderBar}>
            <div className={adminStyles.tableTitleGroup}>
              <div className={adminStyles.tableIcon} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
                <i className="bx bx-trophy" />
              </div>
              <div>
                <h3 className={adminStyles.tableTitle}>لوحة شرف أكثر المستخدمين دعوة لأصدقائهم</h3>
                <p className={adminStyles.tableSubtitle}>ترتيب المستخدمين بحسب إجمالي الدعوات والاشتراكات الناجحة والمكافآت</p>
              </div>
            </div>
          </div>

          <div className={adminStyles.tableResponsive}>
            <table className={adminStyles.adminTable}>
              <thead>
                <tr>
                  <th className={adminStyles.adminTh}>المركز</th>
                  <th className={adminStyles.adminTh}>المستخدم</th>
                  <th className={adminStyles.adminTh}>كود الإحالة</th>
                  <th className={adminStyles.adminTh}>إجمالي المدعوين</th>
                  <th className={adminStyles.adminTh}>الاشتراكات الناجحة</th>
                  <th className={adminStyles.adminTh}>في انتظار الاشتراك</th>
                  <th className={adminStyles.adminTh}>إجمالي المكافآت المكتسبة</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                      لا يوجد دعوات مسجلة بعد.
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((item, idx) => (
                    <tr key={item.userId}>
                      <td className={adminStyles.adminTd}>
                        {idx === 0 && <span style={{ fontSize: "1.3rem" }}>🥇</span>}
                        {idx === 1 && <span style={{ fontSize: "1.3rem" }}>🥈</span>}
                        {idx === 2 && <span style={{ fontSize: "1.3rem" }}>🥉</span>}
                        {idx > 2 && <span style={{ fontWeight: "700", color: "#94a3b8" }}>#{idx + 1}</span>}
                      </td>

                      <td className={adminStyles.adminTd}>
                        <div className={rStyles.userTableCell}>
                          {item.avatarUrl ? (
                            <Image src={item.avatarUrl} alt="avatar" width={34} height={34} className={rStyles.userAvatar} />
                          ) : (
                            <div className={rStyles.userAvatar} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <i className="bx bx-user" style={{ color: "#94a3b8" }} />
                            </div>
                          )}
                          <div className={rStyles.userMeta}>
                            <span className={rStyles.userName}>{item.fullName}</span>
                            <span className={rStyles.userEmail}>{item.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className={adminStyles.adminTd}>
                        <span style={{ fontFamily: "monospace", fontWeight: "700", color: "#38bdf8", direction: "ltr" }}>
                          {item.referralCode}
                        </span>
                      </td>

                      <td className={adminStyles.adminTd} style={{ fontWeight: "700" }}>
                        {item.totalInvited} شخص
                      </td>

                      <td className={adminStyles.adminTd} style={{ fontWeight: "700", color: "#10b981" }}>
                        {item.successfulRewarded} مشترك
                      </td>

                      <td className={adminStyles.adminTd} style={{ color: "#f59e0b" }}>
                        {item.pendingCount} معلق
                      </td>

                      <td className={adminStyles.adminTd}>
                        <span style={{ fontWeight: "800", color: "#10b981" }}>
                          +{item.totalEarned.toLocaleString("ar-EG")} {settings.reward_type === "promo_balance" ? "ج.م" : "نقطة"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
