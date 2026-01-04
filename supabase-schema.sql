-- Supabase SQL Schema for Planner App
-- გაუშვით ეს SQL Supabase Dashboard-ში: SQL Editor > New Query

-- ===================================
-- ACTIVITIES TABLE (ყოველდღიური აქტივობები)
-- ===================================
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    task TEXT NOT NULL,
    time TEXT NOT NULL,
    phase TEXT NOT NULL,
    detail TEXT,
    type TEXT DEFAULT 'Zap',
    enabled BOOLEAN DEFAULT true,
    is_swimming BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- HISTORY TABLE (შესრულების ისტორია)
-- ===================================
CREATE TABLE IF NOT EXISTS history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id TEXT NOT NULL,
    completed_at DATE NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- SETTINGS TABLE (მომხმარებლის პარამეტრები)
-- ===================================
CREATE TABLE IF NOT EXISTS settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    swimming_enabled BOOLEAN DEFAULT true,
    holiday_mode BOOLEAN DEFAULT false,
    holiday_start DATE,
    holiday_end DATE,
    notifications_enabled BOOLEAN DEFAULT false,
    reminder_minutes INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Enable RLS on all tables
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Activities policies
CREATE POLICY "Users can view own activities" ON activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities" ON activities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities" ON activities
    FOR DELETE USING (auth.uid() = user_id);

-- History policies
CREATE POLICY "Users can view own history" ON history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history" ON history
    FOR DELETE USING (auth.uid() = user_id);

-- Settings policies  
CREATE POLICY "Users can view own settings" ON settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON settings
    FOR UPDATE USING (auth.uid() = user_id);

-- ===================================
-- CREATE INDEX FOR PERFORMANCE
-- ===================================
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_completed_at ON history(completed_at);

-- ===================================
-- HELPER FUNCTION: Update timestamp
-- ===================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
