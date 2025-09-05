require('dotenv').config({ path: __dirname + '/.env' });
console.log('🔧 Starting server...');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

console.log('📦 Packages loaded successfully');

const app = express();
const PORT = 3000;

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

console.log('🔐 Environment variables:', {
    supabaseUrl: supabaseUrl ? '✅ Loaded' : '❌ Missing',
    supabaseKey: supabaseKey ? '✅ Loaded' : '❌ Missing',
    supabaseServiceKey: supabaseServiceKey ? '✅ Loaded' : '⚠️ Missing (optional)'
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

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// POST /auth/signup - Register new user
app.post('/auth/signup', async (req, res) => {
    try {
        console.log('📝 Signup request received:', req.body);
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
        
        // Check if username is already taken (simplified check for now)
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
        
        // Get user profile
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
        
        console.log('✅ User logged in successfully:', data.user?.email);
        res.json({
            user: data.user,
            profile: profile,
            session: data.session
        });
    } catch (err) {
        console.error('💥 Login error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Server running on http://localhost:3000');
    console.log('✅ Account system ready for testing');
});
