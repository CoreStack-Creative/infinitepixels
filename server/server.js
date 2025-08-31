require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be provided in .env file');
    process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// GET /reviews/:gameId - Get all reviews for a specific game
app.get('/reviews/:gameId', async (req, res) => {
    try {
        const { gameId } = req.params;
        
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('game_id', gameId)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({
                error: 'Failed to fetch reviews'
            });
        }
        
        res.json(data || []);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /reviews - Add a new review
app.post('/reviews', async (req, res) => {
    try {
        const { game_id, user_id, rating, review_text } = req.body;
        
        // Validation
        if (!game_id) {
            return res.status(400).json({
                error: 'game_id is required'
            });
        }
        
        if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            return res.status(400).json({
                error: 'rating must be an integer between 1 and 5'
            });
        }
        
        if (!review_text || review_text.trim().length === 0) {
            return res.status(400).json({
                error: 'review_text is required'
            });
        }
        
        // Insert new review
        const { data, error } = await supabase
            .from('reviews')
            .insert([{
                game_id,
                user_id: user_id || null,
                rating: parseInt(rating),
                review_text: review_text.trim()
            }])
            .select()
            .single();
        
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({
                error: 'Failed to save review'
            });
        }
        
        res.status(201).json(data);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// GET /reviews/:gameId/average - Get average rating and total reviews
app.get('/reviews/:gameId/average', async (req, res) => {
    try {
        const { gameId } = req.params;
        
        const { data, error } = await supabase
            .from('reviews')
            .select('rating')
            .eq('game_id', gameId);
        
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({
                error: 'Failed to fetch review data'
            });
        }
        
        if (!data || data.length === 0) {
            return res.json({
                game_id: gameId,
                average_rating: 0,
                total_reviews: 0
            });
        }
        
        // Calculate average rating
        const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Number((totalRating / data.length).toFixed(1));
        
        res.json({
            game_id: gameId,
            average_rating: averageRating,
            total_reviews: data.length
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Server running on http://localhost:3000');
});
