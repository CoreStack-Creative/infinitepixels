-- Game Sessions Table Setup for Enhanced Time Tracking
-- Run this SQL in your Supabase SQL editor to create/update the game_sessions table

-- Create game_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    session_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    session_end TIMESTAMPTZ,
    duration_seconds INTEGER,
    device_type TEXT DEFAULT 'desktop',
    exit_reason TEXT DEFAULT 'normal',
    interactions_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if they don't exist (for existing tables)
DO $$ 
BEGIN
    -- Add last_activity column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='game_sessions' AND column_name='last_activity') THEN
        ALTER TABLE game_sessions ADD COLUMN last_activity TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- Add session_data column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='game_sessions' AND column_name='session_data') THEN
        ALTER TABLE game_sessions ADD COLUMN session_data JSONB DEFAULT '{}';
    END IF;
    
    -- Update device_type constraint if it exists
    BEGIN
        ALTER TABLE game_sessions DROP CONSTRAINT IF EXISTS game_sessions_device_type_check;
        ALTER TABLE game_sessions ADD CONSTRAINT game_sessions_device_type_check 
            CHECK (device_type IN ('desktop', 'mobile', 'tablet'));
    EXCEPTION WHEN OTHERS THEN
        -- Ignore if constraint doesn't exist
    END;
    
    -- Update exit_reason constraint if it exists
    BEGIN
        ALTER TABLE game_sessions DROP CONSTRAINT IF EXISTS game_sessions_exit_reason_check;
        ALTER TABLE game_sessions ADD CONSTRAINT game_sessions_exit_reason_check 
            CHECK (exit_reason IN ('normal', 'quit', 'new_game', 'timeout', 'error'));
    EXCEPTION WHEN OTHERS THEN
        -- Ignore if constraint doesn't exist
    END;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_session_start ON game_sessions(session_start);
CREATE INDEX IF NOT EXISTS idx_game_sessions_duration ON game_sessions(duration_seconds) WHERE duration_seconds IS NOT NULL;

-- Add RLS (Row Level Security) policies
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON game_sessions;

-- Policy: Users can only see their own sessions
CREATE POLICY "Users can view own sessions" ON game_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own sessions
CREATE POLICY "Users can insert own sessions" ON game_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own sessions
CREATE POLICY "Users can update own sessions" ON game_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own sessions
CREATE POLICY "Users can delete own sessions" ON game_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_game_sessions_updated_at ON game_sessions;
CREATE TRIGGER update_game_sessions_updated_at
    BEFORE UPDATE ON game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for session analytics (optional)
CREATE OR REPLACE VIEW user_game_stats AS
SELECT 
    user_id,
    game_id,
    COUNT(*) as session_count,
    SUM(duration_seconds) as total_duration_seconds,
    AVG(duration_seconds) as avg_duration_seconds,
    MAX(duration_seconds) as max_duration_seconds,
    MIN(session_start) as first_played,
    MAX(session_start) as last_played,
    COUNT(CASE WHEN duration_seconds >= 300 THEN 1 END) as sessions_over_5min
FROM game_sessions 
WHERE duration_seconds IS NOT NULL AND duration_seconds > 0
GROUP BY user_id, game_id;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON game_sessions TO authenticated;
GRANT SELECT ON user_game_stats TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE game_sessions IS 'Tracks individual game playing sessions for time analytics';
COMMENT ON COLUMN game_sessions.user_id IS 'Reference to the user playing the game';
COMMENT ON COLUMN game_sessions.game_id IS 'Game identifier (slug or ID)';
COMMENT ON COLUMN game_sessions.session_start IS 'When the game session started';
COMMENT ON COLUMN game_sessions.session_end IS 'When the game session ended';
COMMENT ON COLUMN game_sessions.last_activity IS 'Last recorded activity timestamp';
COMMENT ON COLUMN game_sessions.duration_seconds IS 'Total active play time in seconds';
COMMENT ON COLUMN game_sessions.device_type IS 'Device used to play (desktop, mobile, tablet)';
COMMENT ON COLUMN game_sessions.exit_reason IS 'How the session ended';
COMMENT ON COLUMN game_sessions.session_data IS 'Additional session metadata (browser info, etc.)';
