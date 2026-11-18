-- SQL Schema to create prices tables for Monorail and LRT in Supabase

-- 1. Monorail Prices Table
CREATE TABLE IF NOT EXISTS public.monorail_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_name TEXT NOT NULL,
    max_stations INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    discount_price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.monorail_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view monorail_prices" ON public.monorail_prices FOR SELECT USING (true);
CREATE POLICY "Admins can manage monorail_prices" ON public.monorail_prices FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Seed default monorail prices
INSERT INTO public.monorail_prices (tier_name, max_stations, price, discount_price) VALUES
('منطقة واحدة (حتى 5 محطات)', 5, 20, 10),
('منطقتان (من 6 إلى 10 محطات)', 10, 40, 20),
('ثلاث مناطق (من 11 إلى 15 محطة)', 15, 55, 27.5),
('أربع مناطق (أكثر من 15 محطة)', 30, 80, 40)
ON CONFLICT DO NOTHING;

-- 2. LRT Prices Table
CREATE TABLE IF NOT EXISTS public.lrt_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_name TEXT NOT NULL,
    max_stations INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.lrt_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view lrt_prices" ON public.lrt_prices FOR SELECT USING (true);
CREATE POLICY "Admins can manage lrt_prices" ON public.lrt_prices FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Seed default LRT prices
INSERT INTO public.lrt_prices (tier_name, max_stations, price) VALUES
('حتى 3 محطات', 3, 10),
('من 4 إلى 7 محطات', 7, 15),
('من 8 إلى 12 محطة', 12, 20),
('13 محطة فأكثر', 25, 25)
ON CONFLICT DO NOTHING;
