"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Users,
  Award,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import styles from "../../page.module.css";
import { supabase } from "@/lib/supabase";
import { fetchReferralSettings } from "@/lib/referrals";
import { ReferralSettings } from "@/types/referrals";

interface ProfileReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  referralCode?: string;
}

export const ProfileReferralModal: React.FC<ProfileReferralModalProps> = ({
  isOpen,
  onClose,
  userId,
  referralCode,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [settings, setSettings] = useState<ReferralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [referralsList, setReferralsList] = useState<any[]>([]);

  const code = referralCode || "QRB" + (userId ? userId.slice(0, 4).toUpperCase() : "PRO");
  const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/signup?ref=${code}` : `https://qareeb.app/signup?ref=${code}`;

  useEffect(() => {
    if (!isOpen || !userId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [settingsData] = await Promise.all([
          fetchReferralSettings(),
        ]);
        setSettings(settingsData);

        if (supabase) {
          const { data } = await supabase
            .from("referrals")
            .select("*, referred:referred_id(full_name, created_at, subscription_tier)")
            .eq("referrer_id", userId)
            .order("created_at", { ascending: false });

          if (data) setReferralsList(data);
        }
      } catch (e) {
        console.error("Error loading user referral stats:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `انضم إلى قريب (دليل وخرائط مواصلات مصر) عبر الرابط التالي واحصل على مكافأة ترحيبية: ${inviteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const totalRewarded = referralsList.filter((r) => r.status === "rewarded").length;
  const totalEarned = referralsList
    .filter((r) => r.status === "rewarded")
    .reduce((sum, r) => sum + Number(r.reward_amount || 0), 0);
  const unit = settings?.reward_type === "promo_balance" ? "ج.م" : "نقطة";

  return (
    <div className={styles.modalOverlay} onClick={onClose} style={{ zIndex: 99999 }}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "560px", width: "92%", borderRadius: "20px", padding: "24px", direction: "rtl" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "rgba(59, 130, 246, 0.15)",
                color: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Share2 size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>ادعُ أصدقاءك واربح المكافآت</h3>
              <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "#94a3b8" }}>
                شارك كودك مع أصدقائك واحصل على مكافآت فورية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>أصدقاء انضموا عبرك</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#38bdf8" }}>
              {referralsList.length} <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>شخص</span>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>أرباحك المكتسبة</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#10b981" }}>
              +{totalEarned} <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>{unit}</span>
            </div>
          </div>
        </div>

        {/* Referral Code Box */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(147, 51, 234, 0.12))",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "16px",
            padding: "18px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "10px" }}>
            كود الدعوة الخاص بك:
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "1.6rem",
                fontWeight: 900,
                letterSpacing: "4px",
                color: "#38bdf8",
              }}
            >
              {code}
            </span>

            <button
              onClick={handleCopyCode}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                background: copiedCode ? "#10b981" : "#2563eb",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
              {copiedCode ? "تم النسخ" : "نسخ الكود"}
            </button>
          </div>
        </div>

        {/* Share Actions */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={handleCopyLink}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#f8fafc",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {copiedLink ? <Check size={16} color="#10b981" /> : <ExternalLink size={16} />}
            {copiedLink ? "تم نسخ الرابط!" : "نسخ رابط الدعوة"}
          </button>

          <button
            onClick={handleWhatsAppShare}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background: "#25D366",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <i className="bx bxl-whatsapp" style={{ fontSize: "1.2rem" }} />
            مشاركة عبر واتساب
          </button>
        </div>

        {/* Condition Notice */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "12px",
            padding: "14px",
            fontSize: "0.8rem",
            color: "#94a3b8",
            lineHeight: "1.6",
          }}
        >
          <div style={{ fontWeight: 700, color: "#f8fafc", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={16} color="#f59e0b" />
            كيف تحتسب المكافأة؟
          </div>
          {settings?.require_subscription ? (
            <div>
              عندما يشترك صديقك في <strong>باقة المشوار (+{settings.reward_mishwar})</strong> أو <strong>الباقة الفضية (+{settings.reward_silver})</strong> أو <strong>الباقة الذهبية (+{settings.reward_gold})</strong> {unit}، تُضاف المكافأة لحسابك مباشرة!
            </div>
          ) : (
            <div>
              بمجرد تسجيل صديقك وتفعيل حسابه، تحصل أنت على <strong>+{settings?.reward_no_condition || 20} {unit}</strong> ويحصل صديقك على هدية ترحيبية فورية!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
