const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Middleware to verify user authentication
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

// Start a new game session
router.post('/start-session', authenticateUser, async (req, res) => {
    try {
        const { game_id, device_type, game_metadata } = req.body;
        
        // Create new session
        const { data: session, error } = await supabase
            .from('game_sessions')
            .insert([{
                user_id: req.user.id,
                game_id: game_id,
                device_type: device_type || 'desktop',
                session_start: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            console.error('Session creation error:', error);
            return res.status(500).json({ error: 'Failed to create session' });
        }

        // Update or create game metadata if provided
        if (game_metadata) {
            await updateGameMetadata(game_id, game_metadata);
        }

        res.json({ 
            success: true, 
            session: session 
        });

    } catch (error) {
        console.error('Start session error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// End a game session
router.post('/end-session', authenticateUser, async (req, res) => {
    try {
        const { session_id, duration_seconds, interactions_count, completion_rate, exit_reason } = req.body;
        
        const { error } = await supabase
            .from('game_sessions')
            .update({
                session_end: new Date().toISOString(),
                duration_seconds: duration_seconds,
                interactions_count: interactions_count,
                completion_rate: completion_rate,
                exit_reason: exit_reason
            })
            .eq('id', session_id)
            .eq('user_id', req.user.id);

        if (error) {
            console.error('Session update error:', error);
            return res.status(500).json({ error: 'Failed to end session' });
        }

        // Trigger user preferences recalculation
        await recalculateUserPreferences(req.user.id);

        res.json({ success: true });

    } catch (error) {
        console.error('End session error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update session during gameplay
router.post('/update-session', authenticateUser, async (req, res) => {
    try {
        const { session_id, duration_seconds, interactions_count } = req.body;
        
        const { error } = await supabase
            .from('game_sessions')
            .update({
                duration_seconds: duration_seconds,
                interactions_count: interactions_count
            })
            .eq('id', session_id)
            .eq('user_id', req.user.id);

        if (error) {
            return res.status(500).json({ error: 'Failed to update session' });
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Update session error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Track user interactions
router.post('/track-interactions', authenticateUser, async (req, res) => {
    try {
        const { interactions } = req.body;
        
        // Add user_id to each interaction and validate
        const validInteractions = interactions
            .filter(interaction => interaction.session_id && interaction.game_id)
            .map(interaction => ({
                ...interaction,
                user_id: req.user.id
            }));

        if (validInteractions.length === 0) {
            return res.json({ success: true, tracked: 0 });
        }

        const { error } = await supabase
            .from('user_interactions')
            .insert(validInteractions);

        if (error) {
            console.error('Interaction tracking error:', error);
            return res.status(500).json({ error: 'Failed to track interactions' });
        }

        res.json({ 
            success: true, 
            tracked: validInteractions.length 
        });

    } catch (error) {
        console.error('Track interactions error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user preferences
router.get('/user-preferences', authenticateUser, async (req, res) => {
    try {
        const { data: preferences, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', req.user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Preferences fetch error:', error);
            return res.status(500).json({ error: 'Failed to fetch preferences' });
        }

        res.json(preferences || {});

    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Generate AI recommendations
router.post('/generate-recommendations', authenticateUser, async (req, res) => {
    try {
        const { algorithm_version = '1.0', max_recommendations = 20, include_reasons = true } = req.body;
        
        // Get user preferences and gaming history
        const userPreferences = await getUserPreferences(req.user.id);
        const gameHistory = await getUserGameHistory(req.user.id);
        const allGames = await getAllGamesMetadata();
        
        // Generate recommendations using ML algorithm
        const recommendations = await generateMLRecommendations(
            req.user.id, 
            userPreferences, 
            gameHistory, 
            allGames, 
            {
                maxRecommendations: max_recommendations,
                includeReasons: include_reasons,
                algorithmVersion: algorithm_version
            }
        );

        // Store recommendations in database
        if (recommendations.length > 0) {
            await storeRecommendations(req.user.id, recommendations, algorithm_version);
        }

        res.json({
            success: true,
            recommendations: recommendations,
            algorithm_version: algorithm_version,
            generated_at: new Date().toISOString()
        });

    } catch (error) {
        console.error('Generate recommendations error:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

// Get existing recommendations
router.get('/recommendations', authenticateUser, async (req, res) => {
    try {
        const { data: recommendations, error } = await supabase
            .from('ai_recommendations')
            .select('*')
            .eq('user_id', req.user.id)
            .gt('expires_at', new Date().toISOString())
            .order('recommendation_score', { ascending: false });

        if (error) {
            console.error('Recommendations fetch error:', error);
            return res.status(500).json({ error: 'Failed to fetch recommendations' });
        }

        res.json({
            success: true,
            recommendations: recommendations || []
        });

    } catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Track recommendation feedback
router.post('/recommendation-feedback', authenticateUser, async (req, res) => {
    try {
        const { game_id, feedback_type, feedback_score, timestamp } = req.body;
        
        let updateData = {};
        
        switch (feedback_type) {
            case 'clicked':
                updateData.was_clicked = true;
                break;
            case 'played':
                updateData.was_played = true;
                break;
            case 'rating':
                updateData.feedback_score = feedback_score;
                break;
        }

        const { error } = await supabase
            .from('ai_recommendations')
            .update(updateData)
            .eq('user_id', req.user.id)
            .eq('game_id', game_id);

        if (error) {
            console.error('Feedback update error:', error);
            return res.status(500).json({ error: 'Failed to update feedback' });
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Recommendation feedback error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get recommendation analytics
router.get('/analytics', authenticateUser, async (req, res) => {
    try {
        // Get user's recommendation performance
        const { data: recStats, error: recError } = await supabase
            .from('ai_recommendations')
            .select('recommendation_score, was_clicked, was_played, feedback_score')
            .eq('user_id', req.user.id);

        if (recError) {
            return res.status(500).json({ error: 'Failed to fetch analytics' });
        }

        // Calculate analytics
        const analytics = {
            total_recommendations: recStats.length,
            click_rate: recStats.length > 0 ? (recStats.filter(r => r.was_clicked).length / recStats.length) * 100 : 0,
            play_rate: recStats.length > 0 ? (recStats.filter(r => r.was_played).length / recStats.length) * 100 : 0,
            average_score: recStats.length > 0 ? recStats.reduce((sum, r) => sum + r.recommendation_score, 0) / recStats.length : 0,
            positive_feedback: recStats.filter(r => r.feedback_score === 1).length,
            negative_feedback: recStats.filter(r => r.feedback_score === -1).length
        };

        res.json({
            success: true,
            analytics: analytics
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update model metrics
router.post('/model-metrics', authenticateUser, async (req, res) => {
    try {
        const { model_version, metrics } = req.body;
        
        const metricsToInsert = Object.entries(metrics).map(([name, value]) => ({
            model_version: model_version,
            metric_name: name,
            metric_value: value,
            user_segment: 'individual' // Could be extended for different segments
        }));

        const { error } = await supabase
            .from('ml_model_metrics')
            .insert(metricsToInsert);

        if (error) {
            console.error('Metrics insert error:', error);
            return res.status(500).json({ error: 'Failed to store metrics' });
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Model metrics error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Helper Functions

async function updateGameMetadata(gameId, metadata) {
    try {
        const { error } = await supabase
            .from('games_metadata')
            .upsert([{
                game_id: gameId,
                name: metadata.name,
                category: metadata.category,
                tags: metadata.tags || [],
                difficulty_level: metadata.difficulty_level || 3
            }]);

        if (error) {
            console.error('Game metadata update error:', error);
        }
    } catch (error) {
        console.error('Update game metadata error:', error);
    }
}

async function recalculateUserPreferences(userId) {
    try {
        const { error } = await supabase.rpc('calculate_user_preferences', {
            target_user_id: userId
        });

        if (error) {
            console.error('Preferences calculation error:', error);
        }
    } catch (error) {
        console.error('Recalculate preferences error:', error);
    }
}

async function getUserPreferences(userId) {
    const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

    return error ? null : data;
}

async function getUserGameHistory(userId) {
    const { data, error } = await supabase
        .from('game_sessions')
        .select(`
            *,
            games_metadata (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

    return error ? [] : data;
}

async function getAllGamesMetadata() {
    const { data, error } = await supabase
        .from('games_metadata')
        .select('*');

    return error ? [] : data;
}

async function generateMLRecommendations(userId, preferences, history, allGames, options) {
    // This is a simplified ML algorithm - in production you might use TensorFlow.js or call external ML service
    
    const playedGameIds = new Set(history.map(session => session.game_id));
    const candidateGames = allGames.filter(game => !playedGameIds.has(game.game_id));
    
    const recommendations = candidateGames.map(game => {
        let score = 0;
        let reasons = [];
        
        // Category preference scoring
        if (preferences?.preferred_categories?.includes(game.category)) {
            score += 3.0;
            reasons.push(`You enjoy ${game.category} games`);
        }
        
        // Tag preference scoring
        if (preferences?.preferred_tags && game.tags) {
            const matchingTags = game.tags.filter(tag => preferences.preferred_tags.includes(tag));
            const tagScore = (matchingTags.length / game.tags.length) * 2.0;
            score += tagScore;
            
            if (matchingTags.length > 0) {
                reasons.push(`Matches your interests: ${matchingTags.slice(0, 2).join(', ')}`);
            }
        }
        
        // Popularity scoring
        if (game.popularity_score) {
            score += (game.popularity_score / 10) * 1.0;
        }
        
        // Difficulty preference
        if (preferences?.preferred_difficulty) {
            const diffDifference = Math.abs(preferences.preferred_difficulty - (game.difficulty_level || 3));
            score += Math.max(0, 1.0 - (diffDifference * 0.3));
            
            if (diffDifference === 0) {
                reasons.push('Perfect difficulty match');
            }
        }
        
        // Similar games boost (collaborative filtering)
        const similarityBoost = calculateSimilarityBoost(game, history, allGames);
        score += similarityBoost;
        
        if (similarityBoost > 0.5) {
            reasons.push('Similar to games you enjoyed');
        }
        
        // Normalize score to 0-10 range
        score = Math.min(10, Math.max(0, score));
        
        return {
            game_id: game.game_id,
            recommendation_score: score,
            recommendation_reason: reasons,
            model_confidence: calculateConfidence(score, reasons.length),
            algorithm_version: options.algorithmVersion
        };
    });
    
    return recommendations
        .filter(rec => rec.recommendation_score > 2.0) // Filter out low scores
        .sort((a, b) => b.recommendation_score - a.recommendation_score)
        .slice(0, options.maxRecommendations);
}

function calculateSimilarityBoost(candidateGame, userHistory, allGames) {
    let maxSimilarity = 0;
    
    // Find the most similar game the user has played
    userHistory.forEach(session => {
        if (session.duration_seconds > 60) { // Only consider games played for more than 1 minute
            const playedGame = allGames.find(g => g.game_id === session.game_id);
            if (playedGame) {
                const similarity = calculateGameSimilarity(candidateGame, playedGame);
                maxSimilarity = Math.max(maxSimilarity, similarity);
            }
        }
    });
    
    return maxSimilarity * 2.0; // Boost factor
}

function calculateGameSimilarity(game1, game2) {
    let similarity = 0;
    
    // Category match
    if (game1.category === game2.category) {
        similarity += 0.4;
    }
    
    // Tag overlap
    if (game1.tags && game2.tags) {
        const tags1 = new Set(game1.tags);
        const tags2 = new Set(game2.tags);
        const intersection = new Set([...tags1].filter(tag => tags2.has(tag)));
        const union = new Set([...tags1, ...tags2]);
        
        if (union.size > 0) {
            similarity += (intersection.size / union.size) * 0.6;
        }
    }
    
    return Math.min(1, similarity);
}

function calculateConfidence(score, reasonCount) {
    // Confidence based on score and number of reasons
    const scoreConfidence = Math.min(1, score / 8.0);
    const reasonConfidence = Math.min(1, reasonCount / 3.0);
    
    return (scoreConfidence + reasonConfidence) / 2.0;
}

async function storeRecommendations(userId, recommendations, algorithmVersion) {
    try {
        // Clear old recommendations for this user
        await supabase
            .from('ai_recommendations')
            .delete()
            .eq('user_id', userId);
        
        // Insert new recommendations
        const recommendationsToStore = recommendations.map(rec => ({
            ...rec,
            user_id: userId,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        }));
        
        const { error } = await supabase
            .from('ai_recommendations')
            .insert(recommendationsToStore);
        
        if (error) {
            console.error('Store recommendations error:', error);
        }
    } catch (error) {
        console.error('Store recommendations error:', error);
    }
}

module.exports = router;