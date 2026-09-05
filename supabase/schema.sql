-- MoneyTrack Cloud Database Schema (Supabase PostgreSQL)
-- Run this in the Supabase SQL Editor (https://app.supabase.com/project/_/sql)

-- 1. Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
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
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for high-speed date and month filtering
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- 5. Create Permissive Access Policies (allows read/write with anon key)
CREATE POLICY "Allow public read access on transactions"
    ON public.transactions FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert access on transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update access on transactions"
    ON public.transactions FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete access on transactions"
    ON public.transactions FOR DELETE
    USING (true);

CREATE POLICY "Allow public read access on budgets"
    ON public.budgets FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert/update access on budgets"
    ON public.budgets FOR ALL
    USING (true);

-- 6. Enable Realtime Replication for instant multi-device sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.budgets;
