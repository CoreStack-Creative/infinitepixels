require('dotenv').config({ path: __dirname + '/.env' });
console.log('🔧 Starting server...');
console.log('📁 Loading .env from:', __dirname + '/.env');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
// const multer = require('multer'); // Temporarily disabled
const crypto = require('crypto');

console.log('📦 Packages loaded successfully');

const app = express();
const PORT = 3000;
const isDevelopment = process.env.NODE_ENV !== 'production';

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

console.log('🔐 Environment variables:', {
    supabaseUrl: supabaseUrl ? '✅ Loaded' : '❌ Missing',
    supabaseKey: supabaseKey ? '✅ Loaded' : '❌ Missing',
    supabaseServiceKey: supabaseServiceKey ? '✅ Loaded' : '⚠️ Missing (optional)',
    environment: isDevelopment ? '🔧 Development' : '🚀 Production'
});

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be provided in .env file');
    process.exit(1);
}

// Initialize Supabase clients
console.log('🔗 Initializing Supabase clients...');
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseKey);
console.log('✅ Supabase clients initialized');

// Configure multer for file uploads - TEMPORARILY DISABLED
// const storage = multer.memoryStorage();
// const upload = multer({ 
//     storage: storage,
//     limits: {
//         fileSize: 5 * 1024 * 1024 // 5MB limit
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only image files are allowed!'), false);
//         }
//     }
// });

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'InfinitePixels Account Server',
        status: 'running',
        environment: isDevelopment ? 'development' : 'production',
        version: '1.0.0'
    });
});

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
        
        // Sign up user - in development, disable email confirmation
        const signupOptions = {
            data: {
                username: username
            }
        };
        
        // In development, don't require email confirmation
        if (isDevelopment) {
            signupOptions.emailRedirectTo = undefined;
        } else {
            signupOptions.emailRedirectTo = `${req.headers.origin || 'http://localhost:3000'}/auth/callback`;
        }
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: signupOptions
        });
        
        if (error) {
            console.error('Supabase signup error:', error);
            return res.status(400).json({
                error: error.message
            });
        }
        
        // In development, try to auto-confirm user if service key is available
        if (isDevelopment && data.user && !data.user.email_confirmed_at && supabaseServiceKey) {
            try {
                console.log('🔧 Development mode: Auto-confirming user email...');
                const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
                    data.user.id,
                    { email_confirm: true }
                );
                
                if (!confirmError) {
                    console.log('✅ User email auto-confirmed for development');
                    // Update the returned user object
                    data.user.email_confirmed_at = new Date().toISOString();
                } else {
                    console.warn('⚠️ Could not auto-confirm email:', confirmError.message);
                }
            } catch (confirmErr) {
                console.warn('⚠️ Auto-confirm failed:', confirmErr.message);
            }
        }
        
        res.status(201).json({
            message: 'Account created successfully! You can now log in.',
            user: data.user,
            requiresVerification: false // Always false in development
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
            // In development, if email not confirmed, try to auto-confirm and retry
            if (isDevelopment && error.message === 'Email not confirmed' && supabaseServiceKey) {
                try {
                    console.log('🔧 Development mode: Auto-confirming email for login...');
                    
                    // Find user by email
                    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
                    if (!getUserError) {
                        const user = users.users.find(u => u.email === email);
                        if (user) {
                            // Confirm the user
                            const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
                                user.id,
                                { email_confirm: true }
                            );
                            
                            if (!confirmError) {
                                console.log('✅ Email auto-confirmed, retrying login...');
                                // Retry login
                                const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                                    email,
                                    password
                                });
                                
                                if (!retryError) {
                                    // Success! Use the retry data
                                    const { data: profile } = await supabase
                                        .from('users')
                                        .select('*')
                                        .eq('id', retryData.user.id)
                                        .single();
                                    
                                    return res.json({
                                        user: retryData.user,
                                        profile: profile,
                                        session: retryData.session
                                    });
                                }
                            }
                        }
                    }
                } catch (autoConfirmErr) {
                    console.warn('⚠️ Auto-confirm failed:', autoConfirmErr.message);
                }
            }
            
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

// POST /auth/dev-confirm - Development only: manually confirm user email
app.post('/auth/dev-confirm', async (req, res) => {
    if (!isDevelopment) {
        return res.status(404).json({ error: 'Not found' });
    }
    
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                error: 'Email is required'
            });
        }
        
        // Use admin client to confirm user
        const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (getUserError) {
            return res.status(400).json({
                error: 'Error finding user: ' + getUserError.message
            });
        }
        
        const user = users.users.find(u => u.email === email);
        
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        
        const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
        );
        
        if (confirmError) {
            return res.status(400).json({
                error: 'Error confirming user: ' + confirmError.message
            });
        }
        
        res.json({
            message: 'User email confirmed successfully',
            user_id: user.id
        });
    } catch (err) {
        console.error('Dev confirm error:', err);
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

// POST /user/upload-avatar - Upload profile image - TEMPORARILY DISABLED
app.post('/user/upload-avatar', async (req, res) => {
    res.status(501).json({ error: 'Avatar upload temporarily disabled' });
});

/*
// Original upload avatar function - commented out due to multer dependency
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
*/

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

// GET /reviews/:gameId - Get all reviews for a specific game (enhanced)
app.get('/reviews/:gameId', async (req, res) => {
    try {
        const { gameId } = req.params;
        const { limit = 50, offset = 0 } = req.query;
        
        // Use the enhanced view for better data
        const { data, error } = await supabase
            .from('review_details')
            .select('*')
            .eq('game_id', gameId)
            .order('created_at', { ascending: false })
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
        
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({
                error: 'Failed to fetch reviews'
            });
        }
        
        // Add user authentication context if available
        const authHeader = req.headers.authorization;
        let currentUserId = null;
        
        if (authHeader) {
            try {
                const token = authHeader.replace('Bearer ', '');
                const { data: { user } } = await supabase.auth.getUser(token);
                if (user) currentUserId = user.id;
            } catch (authError) {
                // Continue without user context
            }
        }
        
        // Enhance reviews with user context
        const enhancedReviews = (data || []).map(review => ({
            ...review,
            is_own_review: currentUserId === review.user_id,
            can_edit: currentUserId === review.user_id,
            display_name: review.username || 'Anonymous'
        }));
        
        res.json(enhancedReviews);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /reviews - Add a new review (enhanced with account system)
app.post('/reviews', async (req, res) => {
    try {
        const { game_id, rating, review_text } = req.body;
        let user_id = null;
        
        // Check if user is authenticated (optional for reviews)
        const authHeader = req.headers.authorization;
        if (authHeader) {
            try {
                const token = authHeader.replace('Bearer ', '');
                const { data: { user }, error } = await supabase.auth.getUser(token);
                if (!error && user) {
                    user_id = user.id;
                }
            } catch (authError) {
                // Continue without user_id if auth fails (allows anonymous reviews)
                console.log('Auth check failed, allowing anonymous review');
            }
        }
        
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
        
        if (review_text.trim().length > 1000) {
            return res.status(400).json({
                error: 'review_text must be less than 1000 characters'
            });
        }
        
        // If user is authenticated, check if they already reviewed this game
        if (user_id) {
            const { data: existingReview } = await supabase
                .from('reviews')
                .select('id')
                .eq('user_id', user_id)
                .eq('game_id', game_id)
                .single();
                
            if (existingReview) {
                return res.status(400).json({
                    error: 'You have already reviewed this game. Please update your existing review instead.'
                });
            }
        }
        
        // Insert new review
        const reviewData = {
            game_id,
            rating: parseInt(rating),
            review_text: review_text.trim()
        };
        
        // Add user_id only if user is authenticated
        if (user_id) {
            reviewData.user_id = user_id;
        }
        
        const { data, error } = await supabase
            .from('reviews')
            .insert([reviewData])
            .select(`
                *,
                username
            `)
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

// ============ ENHANCED REVIEW ROUTES WITH ACCOUNT SYSTEM ============

// GET /user/reviews - Get user's own reviews
app.get('/user/reviews', async (req, res) => {
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
            .from('reviews')
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
        console.error('Get user reviews error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// GET /reviews/:gameId/user - Check if current user has reviewed this game
app.get('/reviews/:gameId/user', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.json({ hasReviewed: false, review: null });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.json({ hasReviewed: false, review: null });
        }
        
        const { gameId } = req.params;
        
        const { data, error: fetchError } = await supabase
            .from('reviews')
            .select('*')
            .eq('game_id', gameId)
            .eq('user_id', user.id)
            .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
            return res.status(400).json({
                error: fetchError.message
            });
        }
        
        res.json({
            hasReviewed: !!data,
            review: data || null
        });
    } catch (err) {
        console.error('Check user review error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// PUT /reviews/:reviewId - Update user's own review
app.put('/reviews/:reviewId', async (req, res) => {
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
        
        const { reviewId } = req.params;
        const { rating, review_text } = req.body;
        
        // Validation
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
        
        // Update review (RLS will ensure user can only update their own)
        const { data, error: updateError } = await supabase
            .from('reviews')
            .update({
                rating: parseInt(rating),
                review_text: review_text.trim(),
                updated_at: new Date().toISOString()
            })
            .eq('id', reviewId)
            .eq('user_id', user.id) // Extra safety check
            .select()
            .single();
        
        if (updateError) {
            return res.status(400).json({
                error: updateError.message
            });
        }
        
        if (!data) {
            return res.status(404).json({
                error: 'Review not found or you do not have permission to update it'
            });
        }
        
        res.json(data);
    } catch (err) {
        console.error('Update review error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// DELETE /reviews/:reviewId - Delete user's own review
app.delete('/reviews/:reviewId', async (req, res) => {
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
        
        const { reviewId } = req.params;
        
        // Delete review (RLS will ensure user can only delete their own)
        const { error: deleteError } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId)
            .eq('user_id', user.id); // Extra safety check
        
        if (deleteError) {
            return res.status(400).json({
                error: deleteError.message
            });
        }
        
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        console.error('Delete review error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// GET /reviews/:gameId/stats - Get comprehensive game review statistics
app.get('/reviews/:gameId/stats', async (req, res) => {
    try {
        const { gameId } = req.params;
        
        // Use the SQL function we created for comprehensive stats
        const { data, error } = await supabase
            .rpc('get_game_review_stats', { game_id_param: gameId });
        
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({
                error: 'Failed to fetch review statistics'
            });
        }
        
        const stats = data && data.length > 0 ? data[0] : {
            average_rating: 0,
            total_reviews: 0,
            rating_breakdown: {
                '5_star': 0,
                '4_star': 0,
                '3_star': 0,
                '2_star': 0,
                '1_star': 0
            }
        };
        
        res.json({
            game_id: gameId,
            ...stats
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /reviews/:reviewId/helpful - Mark a review as helpful
app.post('/reviews/:reviewId/helpful', async (req, res) => {
    try {
        const { reviewId } = req.params;
        
        // Call the SQL function to increment helpful count
        const { error } = await supabase
            .rpc('mark_review_helpful', { review_id: parseInt(reviewId) });
        
        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }
        
        res.json({ message: 'Review marked as helpful' });
    } catch (err) {
        console.error('Mark helpful error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// GET /user/review-count - Get total review count for authenticated user
app.get('/user/review-count', async (req, res) => {
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
        
        // Use the SQL function to get review count
        const { data, error: countError } = await supabase
            .rpc('get_user_review_count', { user_uuid: user.id });
        
        if (countError) {
            return res.status(400).json({
                error: countError.message
            });
        }
        
        res.json({ 
            user_id: user.id,
            review_count: data || 0 
        });
    } catch (err) {
        console.error('Get review count error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// ============ END ENHANCED REVIEW ROUTES ============

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
    console.log('✅ Account system ready for testing');
});
