require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be provided in .env file');
    process.exit(1);
}

// Initialize Supabase clients
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseKey);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// ============ AUTHENTICATION ROUTES ============

// POST /auth/signup - Register new user
app.post('/auth/signup', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        
        // Validation
        if (!email || !password || !username) {
            return res.status(400).json({
                error: 'Email, password, and username are required'
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            });
        }
        
        if (username.length < 3 || username.length > 30) {
            return res.status(400).json({
                error: 'Username must be between 3 and 30 characters'
            });
        }
        
        // Check for profanity in username
        const { data: profanityCheck, error: profanityError } = await supabase
            .rpc('check_username_profanity', { username_text: username });
            
        if (profanityCheck) {
            return res.status(400).json({
                error: 'Username contains inappropriate content'
            });
        }
        
        // Check if username is already taken
        const { data: existingUser } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();
            
        if (existingUser) {
            return res.status(400).json({
                error: 'Username is already taken'
            });
        }
        
        // Sign up user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });
        
        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }
        
        res.status(201).json({
            message: 'User created successfully. Please check your email for verification.',
            user: data.user
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /auth/login - Login user
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }
        
        // Get user profile
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
        
        res.json({
            user: data.user,
            profile: profile,
            session: data.session
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /auth/logout - Logout user
app.post('/auth/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }
        
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /auth/forgot-password - Request password reset
app.post('/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                error: 'Email is required'
            });
        }
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${req.headers.origin}/reset-password`
        });
        
        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }
        
        res.json({
            message: 'Password reset email sent'
        });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /auth/reset-password - Reset password
app.post('/auth/reset-password', async (req, res) => {
    try {
        const { password, access_token, refresh_token } = req.body;
        
        if (!password || !access_token) {
            return res.status(400).json({
                error: 'Password and access token are required'
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            });
        }
        
        // Set session with the tokens
        const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token
        });
        
        if (sessionError) {
            return res.status(400).json({
                error: 'Invalid reset token'
            });
        }
        
        // Update password
        const { error } = await supabase.auth.updateUser({
            password: password
        });
        
        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }
        
        res.json({
            message: 'Password updated successfully'
        });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// ============ USER PROFILE ROUTES ============

// GET /user/profile - Get user profile
app.get('/user/profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
        
        res.json(profile);
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// PUT /user/profile - Update user profile
app.put('/user/profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { username } = req.body;
        
        if (username) {
            // Check for profanity
            const { data: profanityCheck } = await supabase
                .rpc('check_username_profanity', { username_text: username });
                
            if (profanityCheck) {
                return res.status(400).json({
                    error: 'Username contains inappropriate content'
                });
            }
            
            // Check if username is already taken by another user
            const { data: existingUser } = await supabase
                .from('users')
                .select('username')
                .eq('username', username)
                .neq('id', user.id)
                .single();
                
            if (existingUser) {
                return res.status(400).json({
                    error: 'Username is already taken'
                });
            }
        }
        
        const { data, error: updateError } = await supabase
            .from('users')
            .update({ username })
            .eq('id', user.id)
            .select()
            .single();
        
        if (updateError) {
            return res.status(400).json({
                error: updateError.message
            });
        }
        
        res.json(data);
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /user/upload-avatar - Upload profile image
app.post('/user/upload-avatar', upload.single('avatar'), async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true
            });
        
        if (uploadError) {
            return res.status(400).json({
                error: uploadError.message
            });
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('profile-images')
            .getPublicUrl(fileName);
        
        // Update user profile with new image URL
        const { data, error: updateError } = await supabase
            .from('users')
            .update({ profile_image_url: publicUrl })
            .eq('id', user.id)
            .select()
            .single();
        
        if (updateError) {
            return res.status(400).json({
                error: updateError.message
            });
        }
        
        res.json({
            message: 'Profile image updated successfully',
            profile_image_url: publicUrl
        });
    } catch (err) {
        console.error('Upload avatar error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /user/change-password - Change password
app.post('/user/change-password', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Current password and new password are required'
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({
                error: 'New password must be at least 6 characters long'
            });
        }
        
        // Verify current password by attempting to sign in
        const { error: verifyError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword
        });
        
        if (verifyError) {
            return res.status(400).json({
                error: 'Current password is incorrect'
            });
        }
        
        // Update password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
        });
        
        if (updateError) {
            return res.status(400).json({
                error: updateError.message
            });
        }
        
        res.json({
            message: 'Password changed successfully'
        });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// ============ USER DATA ROUTES ============

// GET /user/favorites - Get user favorites
app.get('/user/favorites', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { data, error: fetchError } = await supabase
            .from('user_favorites')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (fetchError) {
            return res.status(400).json({
                error: fetchError.message
            });
        }
        
        res.json(data || []);
    } catch (err) {
        console.error('Get favorites error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /user/favorites - Add to favorites
app.post('/user/favorites', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { game_id } = req.body;
        
        if (!game_id) {
            return res.status(400).json({
                error: 'Game ID is required'
            });
        }
        
        const { data, error: insertError } = await supabase
            .from('user_favorites')
            .insert([{
                user_id: user.id,
                game_id: game_id
            }])
            .select()
            .single();
        
        if (insertError) {
            if (insertError.code === '23505') { // Unique constraint violation
                return res.status(400).json({
                    error: 'Game is already in favorites'
                });
            }
            return res.status(400).json({
                error: insertError.message
            });
        }
        
        res.status(201).json(data);
    } catch (err) {
        console.error('Add favorite error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// DELETE /user/favorites/:gameId - Remove from favorites
app.delete('/user/favorites/:gameId', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { gameId } = req.params;
        
        const { error: deleteError } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('game_id', gameId);
        
        if (deleteError) {
            return res.status(400).json({
                error: deleteError.message
            });
        }
        
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        console.error('Remove favorite error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// GET /user/recent-games - Get recently played games
app.get('/user/recent-games', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { data, error: fetchError } = await supabase
            .from('user_recent_games')
            .select('*')
            .eq('user_id', user.id)
            .order('last_played', { ascending: false })
            .limit(50);
        
        if (fetchError) {
            return res.status(400).json({
                error: fetchError.message
            });
        }
        
        res.json(data || []);
    } catch (err) {
        console.error('Get recent games error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /user/recent-games - Add/update recently played game
app.post('/user/recent-games', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const { game_id } = req.body;
        
        if (!game_id) {
            return res.status(400).json({
                error: 'Game ID is required'
            });
        }
        
        // Use upsert to insert or update
        const { data, error: upsertError } = await supabase
            .from('user_recent_games')
            .upsert([{
                user_id: user.id,
                game_id: game_id,
                last_played: new Date().toISOString()
            }], {
                onConflict: 'user_id,game_id'
            })
            .select()
            .single();
        
        if (upsertError) {
            return res.status(400).json({
                error: upsertError.message
            });
        }
        
        res.json(data);
    } catch (err) {
        console.error('Add recent game error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// ============ EXISTING REVIEW ROUTES ============

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
