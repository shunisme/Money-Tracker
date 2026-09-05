-- MoneyTrack Cloud Database Schema (Supabase PostgreSQL)
-- Run this in the Supabase SQL Editor (https://app.supabase.com/project/_/sql)

-- 1. Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create budgets table
CREATE TABLE IF NOT EXISTS public.budgets (
    month TEXT PRIMARY KEY, -- format: 'YYYY-MM'
    user_id UUID DEFAULT auth.uid(),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id TEXT PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    name TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    billing_cycle TEXT NOT NULL DEFAULT 'monthly',
    billing_day INT NOT NULL CHECK (billing_day >= 1 AND billing_day <= 31),
    category TEXT NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create indexes for high-speed queries
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 6. Access Policies: allows both authenticated multi-user isolation and guest access
DROP POLICY IF EXISTS "Allow all transactions access" ON public.transactions;
CREATE POLICY "Allow all transactions access"
    ON public.transactions FOR ALL
    USING (auth.uid() = user_id OR user_id IS NULL OR auth.uid() IS NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Allow all budgets access" ON public.budgets;
CREATE POLICY "Allow all budgets access"
    ON public.budgets FOR ALL
    USING (auth.uid() = user_id OR user_id IS NULL OR auth.uid() IS NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Allow all subscriptions access" ON public.subscriptions;
CREATE POLICY "Allow all subscriptions access"
    ON public.subscriptions FOR ALL
    USING (auth.uid() = user_id OR user_id IS NULL OR auth.uid() IS NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR auth.uid() IS NULL);

-- 7. Enable Realtime Replication for instant multi-device sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.budgets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
