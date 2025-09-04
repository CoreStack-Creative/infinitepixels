-- =====================================================
-- Update Existing Reviews Table for Account System
-- =====================================================

-- 1. First, let's update the existing reviews table structure
-- Change user_id from TEXT to UUID to match the users table
ALTER TABLE reviews 
ALTER COLUMN user_id TYPE UUID USING user_id::uuid;

-- 2. Add foreign key constraint to link with users table
ALTER TABLE reviews 
ADD CONSTRAINT fk_reviews_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. Add new columns for enhanced functionality
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reported BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Enable Row Level Security for proper user data protection
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for reviews

-- Allow anyone to view reviews (public read access)
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

-- Allow authenticated users to insert reviews
CREATE POLICY "Authenticated users can insert reviews" ON reviews
    FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE TO authenticated 
    USING (auth.uid() = user_id);

-- Allow users to delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
    FOR DELETE TO authenticated 
    USING (auth.uid() = user_id);

-- Allow anonymous users to insert reviews (for backward compatibility)
CREATE POLICY "Anonymous users can insert reviews" ON reviews
    FOR INSERT TO anon 
    WITH CHECK (user_id IS NULL);

-- 6. Create function to automatically populate username from users table
CREATE OR REPLACE FUNCTION populate_review_username()
RETURNS TRIGGER AS $$
BEGIN
    -- If user_id is provided, get username from users table
    IF NEW.user_id IS NOT NULL THEN
        SELECT username INTO NEW.username
        FROM public.users 
        WHERE id = NEW.user_id;
    END IF;
    
    -- Set updated_at for updates
    IF TG_OP = 'UPDATE' THEN
        NEW.updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create triggers for the username population
DROP TRIGGER IF EXISTS populate_review_username_trigger ON reviews;
CREATE TRIGGER populate_review_username_trigger
    BEFORE INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION populate_review_username();

-- 8. Update existing reviews to populate usernames where possible
-- This will only work if user_id values match existing users
UPDATE reviews 
SET username = u.username
FROM public.users u 
WHERE reviews.user_id = u.id 
AND reviews.username IS NULL;

-- 9. Add additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_username ON reviews(username);
CREATE INDEX IF NOT EXISTS idx_reviews_helpful_count ON reviews(helpful_count);
CREATE INDEX IF NOT EXISTS idx_reviews_updated_at ON reviews(updated_at);

-- 10. Create view for enhanced review data with user info
CREATE OR REPLACE VIEW review_details AS
SELECT 
    r.id,
    r.game_id,
    r.user_id,
    r.username,
    r.rating,
    r.review_text,
    r.helpful_count,
    r.reported,
    r.created_at,
    r.updated_at,
    CASE 
        WHEN u.profile_image_url IS NOT NULL THEN u.profile_image_url
        ELSE NULL
    END as profile_image_url,
    CASE 
        WHEN u.id IS NOT NULL THEN TRUE
        ELSE FALSE
    END as is_verified_user
FROM reviews r
LEFT JOIN public.users u ON r.user_id = u.id
ORDER BY r.created_at DESC;

-- 11. Create function to get user's review count
CREATE OR REPLACE FUNCTION get_user_review_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM reviews 
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create function to check if user has reviewed a specific game
CREATE OR REPLACE FUNCTION user_has_reviewed_game(user_uuid UUID, game_id_param TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM reviews 
        WHERE user_id = user_uuid 
        AND game_id = game_id_param
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create function for helpful review voting (future feature)
CREATE OR REPLACE FUNCTION mark_review_helpful(review_id BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE reviews 
    SET helpful_count = helpful_count + 1 
    WHERE id = review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Create function to get average rating and review stats for a game
CREATE OR REPLACE FUNCTION get_game_review_stats(game_id_param TEXT)
RETURNS TABLE(
    average_rating NUMERIC,
    total_reviews INTEGER,
    rating_breakdown JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROUND(AVG(rating)::NUMERIC, 2) as average_rating,
        COUNT(*)::INTEGER as total_reviews,
        jsonb_build_object(
            '5_star', COUNT(*) FILTER (WHERE rating = 5),
            '4_star', COUNT(*) FILTER (WHERE rating = 4),
            '3_star', COUNT(*) FILTER (WHERE rating = 3),
            '2_star', COUNT(*) FILTER (WHERE rating = 2),
            '1_star', COUNT(*) FILTER (WHERE rating = 1)
        ) as rating_breakdown
    FROM reviews 
    WHERE game_id = game_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Create function to prevent duplicate reviews per user per game
CREATE OR REPLACE FUNCTION prevent_duplicate_reviews()
RETURNS TRIGGER AS $$
BEGIN
    -- Only check for duplicates if user_id is provided
    IF NEW.user_id IS NOT NULL THEN
        -- Check if user already has a review for this game
        IF EXISTS (
            SELECT 1 FROM reviews 
            WHERE user_id = NEW.user_id 
            AND game_id = NEW.game_id 
            AND id != COALESCE(NEW.id, 0)
        ) THEN
            RAISE EXCEPTION 'User has already reviewed this game. Please update your existing review instead.';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 16. Create trigger to prevent duplicate reviews
DROP TRIGGER IF EXISTS prevent_duplicate_reviews_trigger ON reviews;
CREATE TRIGGER prevent_duplicate_reviews_trigger
    BEFORE INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION prevent_duplicate_reviews();

-- =====================================================
-- Migration Complete!
-- 
-- Your reviews table is now fully integrated with the account system:
-- ✅ Linked to user accounts with proper foreign keys
-- ✅ Row Level Security enabled for data protection  
-- ✅ Automatic username population from user profiles
-- ✅ Enhanced with helpful voting and reporting features
-- ✅ Prevents duplicate reviews per user per game
-- ✅ Includes comprehensive review statistics functions
-- ✅ Maintains backward compatibility with anonymous reviews
-- =====================================================
