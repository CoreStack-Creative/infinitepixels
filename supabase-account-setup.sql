-- =====================================================
-- InfinitePixels Account System - Supabase SQL Setup
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table (extends auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    profile_image_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token UUID DEFAULT uuid_generate_v4(),
    password_reset_token UUID,
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User favorites table
CREATE TABLE public.user_favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    game_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

-- 3. User recently played table
CREATE TABLE public.user_recent_games (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    game_id VARCHAR(255) NOT NULL,
    last_played TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

-- 4. User settings table
CREATE TABLE public.user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    theme VARCHAR(20) DEFAULT 'dark',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    privacy_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 5. Update existing reviews table to link with users
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- 6. Create indexes for better performance
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_verification_token ON public.users(verification_token);
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_game_id ON public.user_favorites(game_id);
CREATE INDEX idx_user_recent_games_user_id ON public.user_recent_games(user_id);
CREATE INDEX idx_user_recent_games_last_played ON public.user_recent_games(last_played);
CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);

-- 7. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recent_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Favorites policies
CREATE POLICY "Users can view own favorites" ON public.user_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.user_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Recent games policies
CREATE POLICY "Users can view own recent games" ON public.user_recent_games
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recent games" ON public.user_recent_games
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recent games" ON public.user_recent_games
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recent games" ON public.user_recent_games
    FOR DELETE USING (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Reviews policies (allow viewing all, but only modify own)
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);

-- 10. Create a function to handle user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    -- Create user profile
    INSERT INTO public.users (id, email, username)
    VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
    );
    
    -- Create default settings
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- 13. Storage policies for profile images
CREATE POLICY "Users can view all profile images" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload own profile image" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profile-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own profile image" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'profile-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own profile image" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'profile-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- 14. Create function to clean up recent games (keep only last 50)
CREATE OR REPLACE FUNCTION cleanup_recent_games()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete old entries, keeping only the 50 most recent
    DELETE FROM public.user_recent_games 
    WHERE user_id = NEW.user_id 
    AND id NOT IN (
        SELECT id FROM public.user_recent_games 
        WHERE user_id = NEW.user_id 
        ORDER BY last_played DESC 
        LIMIT 50
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 15. Create trigger for cleanup
CREATE TRIGGER cleanup_recent_games_trigger
    AFTER INSERT OR UPDATE ON public.user_recent_games
    FOR EACH ROW EXECUTE FUNCTION cleanup_recent_games();

-- 16. Create function for profanity filtering (basic implementation)
CREATE OR REPLACE FUNCTION check_username_profanity(username_text TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    bad_words TEXT[] := ARRAY[
        'admin', 'administrator', 'moderator', 'staff', 'official',
        'fuck', 'shit', 'damn', 'bitch', 'ass', 'hell', 'crap',
        'bastard', 'piss', 'whore', 'slut', 'fag', 'gay', 'lesbian',
        'nazi', 'hitler', 'terrorist', 'suicide', 'kill', 'murder',
        'rape', 'sex', 'porn', 'xxx', 'nude', 'naked'
    ];
    word TEXT;
BEGIN
    -- Convert to lowercase for checking
    username_text := lower(username_text);
    
    -- Check each bad word
    FOREACH word IN ARRAY bad_words
    LOOP
        IF username_text LIKE '%' || word || '%' THEN
            RETURN TRUE; -- Contains profanity
        END IF;
    END LOOP;
    
    RETURN FALSE; -- Clean username
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- You're all set! Run this script in your Supabase SQL editor.
-- Make sure to update your environment variables with proper Supabase credentials.
-- =====================================================
