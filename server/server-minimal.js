require('dotenv').config({ path: __dirname + '/.env' });
console.log('🔧 Starting server...');

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://infinitepixels.net'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Supabase client initialized');

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Infinite Pixels Account System API',
        status: 'running',
        endpoints: ['/auth/signup', '/auth/login', '/auth/refresh', '/auth/logout']
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// POST /auth/signup - Create new user account
app.post('/auth/signup', async (req, res) => {
    try {
        console.log('�� Signup request received for:', req.body.email);
        const { email, password, username } = req.body;
        
        if (!email || !password || !username) {
            return res.status(400).json({
                error: 'Email, password, and username are required'
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
            console.error('❌ Supabase signup error:', error);
            return res.status(400).json({
                error: error.message
            });
        }
        
        console.log('✅ User created successfully:', data.user?.email);
        res.status(201).json({
            message: 'User created successfully. Please check your email for verification.',
            user: data.user
        });
    } catch (err) {
        console.error('💥 Signup error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /auth/login - Login user
app.post('/auth/login', async (req, res) => {
    try {
        console.log('🔑 Login request received for:', req.body.email);
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
            console.error('❌ Login error:', error);
            return res.status(400).json({
                error: error.message
            });
        }
        
        // Enhance session with extended expiry for 72-hour persistence
        const enhancedSession = {
            ...data.session,
            extended_expiry: new Date(Date.now() + (72 * 60 * 60 * 1000)).toISOString(), // 72 hours
            device_info: {
                ip: req.ip || req.connection.remoteAddress,
                user_agent: req.headers['user-agent'],
                device_id: req.body.device_id
            }
        };
        
        console.log('✅ User logged in successfully:', data.user?.email);
        res.json({
            user: data.user,
            session: enhancedSession
        });
    } catch (err) {
        console.error('💥 Login error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /auth/refresh - Refresh authentication token
app.post('/auth/refresh', async (req, res) => {
    try {
        console.log('�� Token refresh request received');
        const { refresh_token, device_id } = req.body;
        
        if (!refresh_token) {
            return res.status(400).json({
                error: 'Refresh token is required'
            });
        }
        
        // Refresh the session with Supabase
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refresh_token
        });
        
        if (error) {
            console.error('❌ Token refresh error:', error);
            return res.status(401).json({
                error: 'Invalid refresh token'
            });
        }
        
        // Enhance refreshed session with extended expiry
        const enhancedSession = {
            ...data.session,
            extended_expiry: new Date(Date.now() + (72 * 60 * 60 * 1000)).toISOString(), // 72 hours
            device_info: {
                ip: req.ip || req.connection.remoteAddress,
                user_agent: req.headers['user-agent'],
                device_id: device_id
            }
        };
        
        console.log('✅ Token refreshed successfully');
        res.json({
            session: enhancedSession,
            user: data.user
        });
    } catch (err) {
        console.error('💥 Token refresh error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST /auth/logout - Logout user  
app.post('/auth/logout', async (req, res) => {
    try {
        console.log('👋 Logout request received');
        const { access_token } = req.body;
        
        if (access_token) {
            await supabase.auth.signOut(access_token);
        }
        
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('💥 Logout error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Server running on http://localhost:' + PORT);
    console.log('✅ Account system ready for testing');
});
