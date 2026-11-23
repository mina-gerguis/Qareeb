-- =========================================================================
-- Cairo Map / Qareeb: Complete Referral System & Anti-Fraud Security Schema
-- نظام الإحالات والمكافآت المتكامل مع لوحة التحكم وحماية الـ IP من التحايل
-- =========================================================================

-- 1. إضافة أعمدة الإحالة إلى جدول المستخدمين (public.profiles)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS registration_ip TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_profiles_registration_ip ON public.profiles(registration_ip);

-- 2. جدول إعدادات نظام الإحالات (يتحكم به المسؤول من لوحة التحكم)
CREATE TABLE IF NOT EXISTS public.referral_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  is_enabled BOOLEAN DEFAULT true,                      -- تفعيل/إيقاف النظام كلياً
  max_referrals_per_user INT DEFAULT 10,                -- أقصى عدد دعوات لكل مستخدم (0 = غير محدود)
  reward_type TEXT DEFAULT 'points' CHECK (reward_type IN ('points', 'promo_balance')), -- نوع المكافأة: نقاط أو رصيد ترويجي
  require_subscription BOOLEAN DEFAULT true,            -- هل يشترط الاشتراك في باقة لصرف المكافأة؟
  
  -- المكافآت المحددة لكل باقة أو حالة
  reward_no_condition NUMERIC(10,2) DEFAULT 20.00,      -- المكافأة إذا كان بدون شروط (تسجيل فقط)
  reward_mishwar NUMERIC(10,2) DEFAULT 30.00,           -- مكافأة اشتراك باقة المشوار
  reward_silver NUMERIC(10,2) DEFAULT 70.00,            -- مكافأة اشتراك الباقة الفضية
  reward_gold NUMERIC(10,2) DEFAULT 120.00,             -- مكافأة اشتراك الباقة الذهبية
  reward_invited_user NUMERIC(10,2) DEFAULT 15.00,      -- مكافأة ترحيبية للمسجل الجديد نفسه
  
  -- إعدادات الأمان والحماية من التحايل
  block_same_ip BOOLEAN DEFAULT true,                   -- حظر ومنع احتساب المكافأة إذا تطابق الـ IP
  auto_suspend_fraud BOOLEAN DEFAULT true,              -- حظر حساب المستخدم تلقائياً عند كشف تلاعب بالـ IP
  
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_by UUID REFERENCES public.profiles(id)
);

-- إدراج صف الإعدادات الافتراضية
INSERT INTO public.referral_settings (id) 
VALUES ('default') 
ON CONFLICT (id) DO NOTHING;

-- 3. جدول تتبع وسجل الإحالات (public.referrals)
DROP TABLE IF EXISTS public.referrals CASCADE;

CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  referral_code_used TEXT NOT NULL DEFAULT '',
  ip_address TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'rewarded', 'max_reached', 'fraud_blocked')),
  plan_subscribed TEXT REFERENCES public.subscription_plans(id),
  reward_amount NUMERIC(10,2) DEFAULT 0.00,
  reward_type TEXT DEFAULT 'points',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  rewarded_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_ip ON public.referrals(ip_address);

-- 4. إعداد سياسات الحماية RLS (Row Level Security)
ALTER TABLE public.referral_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- الإعدادات: القراءة للجميع، والتعديل للمشرفين فقط
DROP POLICY IF EXISTS "Anyone can read referral settings" ON public.referral_settings;
CREATE POLICY "Anyone can read referral settings" ON public.referral_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update referral settings" ON public.referral_settings;
CREATE POLICY "Admins can update referral settings" ON public.referral_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- الإحالات: المستخدم يرى إحالاته فقط، والأدمن يرى ويتحكم بالكل
DROP POLICY IF EXISTS "Users can view their own referrals" ON public.referrals;
CREATE POLICY "Users can view their own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

DROP POLICY IF EXISTS "Admins full control on referrals" ON public.referrals;
CREATE POLICY "Admins full control on referrals" ON public.referrals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 5. دالة توليد كود إحالة فريد لكل مستخدم
CREATE OR REPLACE FUNCTION public.generate_unique_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INT;
  is_unique BOOLEAN := FALSE;
BEGIN
  WHILE NOT is_unique LOOP
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::INT, 1);
    END LOOP;
    SELECT NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = result) INTO is_unique;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 6. التأكد من وجود كود إحالة لجميع المستخدمين الحاليين والجدد
UPDATE public.profiles 
SET referral_code = public.generate_unique_referral_code() 
WHERE referral_code IS NULL;

-- 7. دالة معالجة الإحالة عند تسجيل مستخدم جديد مع فحص الأمان والـ IP
CREATE OR REPLACE FUNCTION public.handle_referral_on_signup(
  p_referred_user_id UUID,
  p_referral_code TEXT,
  p_client_ip TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_settings RECORD;
  v_referrer RECORD;
  v_referrer_reward_count INT;
  v_is_fraud BOOLEAN := FALSE;
  v_fraud_reason TEXT := NULL;
  v_reward_amount NUMERIC(10,2) := 0;
  v_clean_code TEXT;
BEGIN
  -- جلب إعدادات النظام
  SELECT * INTO v_settings FROM public.referral_settings WHERE id = 'default';
  
  -- التأكد من توليد كود إحالة للمستخدم الجديد
  UPDATE public.profiles 
  SET 
    referral_code = COALESCE(referral_code, public.generate_unique_referral_code()),
    registration_ip = COALESCE(registration_ip, p_client_ip)
  WHERE id = p_referred_user_id;

  -- إذا كان النظام معطلاً أو لم يُرسل كود دعوة نخرج بنجاح
  IF v_settings.is_enabled IS NOT TRUE OR p_referral_code IS NULL OR trim(p_referral_code) = '' THEN
    RETURN jsonb_build_object('success', true, 'status', 'no_referral');
  END IF;

  v_clean_code := upper(trim(p_referral_code));

  -- البحث عن صاحب الكود
  SELECT * INTO v_referrer FROM public.profiles WHERE upper(referral_code) = v_clean_code;
  IF v_referrer.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'status', 'invalid_code', 'message', 'كود الإحالة غير صحيح.');
  END IF;

  -- فحص منع دعوة النفس (Self Referral)
  IF v_referrer.id = p_referred_user_id THEN
    RETURN jsonb_build_object('success', false, 'status', 'self_referral', 'message', 'لا يمكنك دعوة نفسك.');
  END IF;

  -- فحص مكافحة التحايل عبر الـ IP (Anti-Fraud IP Check)
  IF v_settings.block_same_ip AND p_client_ip IS NOT NULL AND p_client_ip <> '' AND p_client_ip <> 'unknown' THEN
    -- فحص 1: هل الـ IP يطابق نفس IP التسجيل الخاص بالداعي؟
    IF v_referrer.registration_ip IS NOT NULL AND v_referrer.registration_ip = p_client_ip THEN
      v_is_fraud := TRUE;
      v_fraud_reason := 'تم رصد تطابق عنوان الشبكة (IP) مع حساب الداعي (محاولة تسجيل ذاتي).';
    END IF;

    -- فحص 2: هل نفس الـ IP تم استخدامه مسبقاً في دعوة لنفس الداعي؟
    IF NOT v_is_fraud THEN
      IF EXISTS (
        SELECT 1 FROM public.referrals 
        WHERE referrer_id = v_referrer.id AND ip_address = p_client_ip
      ) THEN
        v_is_fraud := TRUE;
        v_fraud_reason := 'تم تكرار التسجيل من نفس عنوان الشبكة (IP) أكثر من مرة لنفس الداعي.';
      END IF;
    END IF;
  END IF;

  -- إذا ثبت التحايل:
  IF v_is_fraud THEN
    -- تسجيل المحاولة في جدول الإحالات كـ fraud_blocked
    INSERT INTO public.referrals (
      referrer_id,
      referred_id,
      referral_code_used,
      ip_address,
      status,
      rejection_reason
    ) VALUES (
      v_referrer.id,
      p_referred_user_id,
      v_clean_code,
      p_client_ip,
      'fraud_blocked',
      v_fraud_reason
    );

    -- إذا كان خيار الحظر التلقائي مفعلاً: يتم حظر الحساب المتلاعب
    IF v_settings.auto_suspend_fraud THEN
      UPDATE public.profiles 
      SET 
        is_suspended = TRUE,
        suspended_at = timezone('utc'::text, now()),
        suspended_reason = 'تم تعليق الحساب تلقائياً لرصد محاولة تلاعب وسجلات وهمية عبر الـ IP بنظام الإحالات.'
      WHERE id = p_referred_user_id;
    END IF;

    RETURN jsonb_build_object('success', false, 'status', 'fraud_blocked', 'reason', v_fraud_reason);
  END IF;

  -- ربط المدعو بالداعي في جدول profiles
  UPDATE public.profiles SET referred_by = v_referrer.id WHERE id = p_referred_user_id;

  -- حساب عدد الدعوات الناجحة السابقة للداعي
  SELECT COUNT(*) INTO v_referrer_reward_count 
  FROM public.referrals 
  WHERE referrer_id = v_referrer.id AND status = 'rewarded';

  -- التحقق من أقصى عدد دعوات
  IF v_settings.max_referrals_per_user > 0 AND v_referrer_reward_count >= v_settings.max_referrals_per_user THEN
    INSERT INTO public.referrals (
      referrer_id,
      referred_id,
      referral_code_used,
      ip_address,
      status,
      rejection_reason
    ) VALUES (
      v_referrer.id,
      p_referred_user_id,
      v_clean_code,
      p_client_ip,
      'max_reached',
      'تجاوز الداعي الحد الأقصى المسموح به للدعوات (' || v_settings.max_referrals_per_user || ').'
    );
    RETURN jsonb_build_object('success', true, 'status', 'max_reached');
  END IF;

  -- هل المكافأة بدون شروط (فقط تسجيل وتفعيل)؟
  IF NOT v_settings.require_subscription THEN
    v_reward_amount := COALESCE(v_settings.reward_no_condition, 0);

    -- منح المكافأة للداعي
    IF v_settings.reward_type = 'promo_balance' THEN
      UPDATE public.profiles SET promo_balance = promo_balance + v_reward_amount WHERE id = v_referrer.id;
      IF COALESCE(v_settings.reward_invited_user, 0) > 0 THEN
        UPDATE public.profiles SET promo_balance = promo_balance + v_settings.reward_invited_user WHERE id = p_referred_user_id;
      END IF;
    ELSE
      UPDATE public.profiles SET points = points + v_reward_amount::INT WHERE id = v_referrer.id;
      IF COALESCE(v_settings.reward_invited_user, 0) > 0 THEN
        UPDATE public.profiles SET points = points + v_settings.reward_invited_user::INT WHERE id = p_referred_user_id;
      END IF;
    END IF;

    -- تسجيل الإحالة كمكتملة
    INSERT INTO public.referrals (
      referrer_id,
      referred_id,
      referral_code_used,
      ip_address,
      status,
      reward_amount,
      reward_type,
      rewarded_at
    ) VALUES (
      v_referrer.id,
      p_referred_user_id,
      v_clean_code,
      p_client_ip,
      'rewarded',
      v_reward_amount,
      v_settings.reward_type,
      timezone('utc'::text, now())
    );

    RETURN jsonb_build_object('success', true, 'status', 'rewarded', 'amount', v_reward_amount);
  ELSE
    -- يشترط الاشتراك في باقة: تسجل كـ معلقة (pending)
    INSERT INTO public.referrals (
      referrer_id,
      referred_id,
      referral_code_used,
      ip_address,
      status,
      reward_type
    ) VALUES (
      v_referrer.id,
      p_referred_user_id,
      v_clean_code,
      p_client_ip,
      'pending',
      v_settings.reward_type
    );

    -- إعطاء المستخدم الجديد هديته الترحيبية إن وجدت
    IF COALESCE(v_settings.reward_invited_user, 0) > 0 THEN
      IF v_settings.reward_type = 'promo_balance' THEN
        UPDATE public.profiles SET promo_balance = promo_balance + v_settings.reward_invited_user WHERE id = p_referred_user_id;
      ELSE
        UPDATE public.profiles SET points = points + v_settings.reward_invited_user::INT WHERE id = p_referred_user_id;
      END IF;
    END IF;

    RETURN jsonb_build_object('success', true, 'status', 'pending');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. دالة معالجة الإحالة المعلقة عند اشتراك المستخدم في باقة
CREATE OR REPLACE FUNCTION public.process_referral_on_subscription()
RETURNS TRIGGER AS $$
DECLARE
  v_ref RECORD;
  v_settings RECORD;
  v_reward NUMERIC(10,2) := 0;
  v_referrer_reward_count INT;
  v_plan_id TEXT;
BEGIN
  v_plan_id := NEW.subscription_tier;

  -- فحص ما إذا كان هناك تغيير إلى باقة مدفوعة (مكرر أو جديد)
  IF v_plan_id IS NULL OR v_plan_id = 'free' THEN
    RETURN NEW;
  END IF;

  -- جلب الإعدادات
  SELECT * INTO v_settings FROM public.referral_settings WHERE id = 'default';
  IF v_settings.is_enabled IS NOT TRUE THEN
    RETURN NEW;
  END IF;

  -- البحث عن إحالة معلقة لهذا المستخدم
  SELECT * INTO v_ref FROM public.referrals 
  WHERE referred_id = NEW.id AND status = 'pending';

  IF v_ref.id IS NOT NULL THEN
    -- التحقق من الحد الأقصى للمكافآت لدى الداعي
    SELECT COUNT(*) INTO v_referrer_reward_count 
    FROM public.referrals 
    WHERE referrer_id = v_ref.referrer_id AND status = 'rewarded';

    IF v_settings.max_referrals_per_user > 0 AND v_referrer_reward_count >= v_settings.max_referrals_per_user THEN
      UPDATE public.referrals 
      SET 
        status = 'max_reached', 
        rejection_reason = 'تجاوز الداعي الحد الأقصى المسموح به للدعوات المكافأة (' || v_settings.max_referrals_per_user || ').',
        plan_subscribed = v_plan_id
      WHERE id = v_ref.id;
      RETURN NEW;
    END IF;

    -- حساب المكافأة بحسب الباقة
    IF v_plan_id = 'mishwar' THEN
      v_reward := COALESCE(v_settings.reward_mishwar, 0);
    ELSIF v_plan_id = 'silver' THEN
      v_reward := COALESCE(v_settings.reward_silver, 0);
    ELSIF v_plan_id = 'gold' THEN
      v_reward := COALESCE(v_settings.reward_gold, 0);
    END IF;

    IF v_reward > 0 THEN
      -- إضافة المكافأة للداعي
      IF v_settings.reward_type = 'promo_balance' THEN
        UPDATE public.profiles SET promo_balance = promo_balance + v_reward WHERE id = v_ref.referrer_id;
      ELSE
        UPDATE public.profiles SET points = points + v_reward::INT WHERE id = v_ref.referrer_id;
      END IF;

      -- تحديث حالة الإحالة إلى مكتملة ومكافأة
      UPDATE public.referrals 
      SET 
        status = 'rewarded',
        plan_subscribed = v_plan_id,
        reward_amount = v_reward,
        reward_type = v_settings.reward_type,
        rewarded_at = timezone('utc'::text, now())
      WHERE id = v_ref.id;

      -- إرسال إشعار للداعي بمكافأته
      INSERT INTO public.notifications (
        user_id,
        title,
        message,
        type,
        link
      ) VALUES (
        v_ref.referrer_id,
        '🎉 مبروك! مكافأة دعوة جديدة',
        'اشترك صديقك الذي قمت بدعوته في ' || 
          CASE 
            WHEN v_plan_id = 'gold' THEN 'الباقة الذهبية' 
            WHEN v_plan_id = 'silver' THEN 'الباقة الفضية' 
            ELSE 'باقة المشوار' 
          END || '، وتمت إضافة ' || v_reward || ' ' || 
          CASE WHEN v_settings.reward_type = 'promo_balance' THEN 'ج.م رصيد ترويجي' ELSE 'نقطة' END || ' إلى حسابك!',
        'success',
        '/profile'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ربط التريجر بجدول profiles عند تحديث subscription_tier
DROP TRIGGER IF EXISTS trigger_referral_on_subscription ON public.profiles;
CREATE TRIGGER trigger_referral_on_subscription
  AFTER UPDATE OF subscription_tier ON public.profiles
  FOR EACH ROW
  WHEN (OLD.subscription_tier IS DISTINCT FROM NEW.subscription_tier)
  EXECUTE FUNCTION public.process_referral_on_subscription();
