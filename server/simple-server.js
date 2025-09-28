#!/usr/bin/env node

require('dotenv').config({ path: __dirname + '/.env' });
console.log('🔧 Starting simple account server...');

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3001;

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseKey);

// Very permissive CORS for development
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*'
}));

app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'InfinitePixels Account Server',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// Simple login endpoint
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        // Try to sign in
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            return res.status(400).json({ error: error.message });
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
        res.status(500).json({ error: 'Server error' });
    }
});

// Simple signup endpoint
app.post('/auth/signup', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        
        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Email, password, and username required' });
        }
        
        // Sign up user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username: username }
            }
        });
        
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
        // Auto-confirm in development
        if (data.user && !data.user.email_confirmed_at && supabaseServiceKey) {
            try {
                await supabaseAdmin.auth.admin.updateUserById(
                    data.user.id,
                    { email_confirm: true }
                );
                data.user.email_confirmed_at = new Date().toISOString();
            } catch (confirmErr) {
                console.warn('Could not auto-confirm:', confirmErr.message);
            }
        }
        
        res.status(201).json({
            message: 'Account created successfully',
            user: data.user,
            requiresVerification: false
        });
        
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get local IP address
function getLocalIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

// Start server on all interfaces
const server = app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log('✅ Server started successfully!');
    console.log(`🔗 Local access: http://localhost:${PORT}`);
    console.log(`📱 Network access: http://${localIP}:${PORT}`);
    console.log(`🌐 Accessible from any device on your network`);
    console.log('📊 Server is ready to handle requests...');
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('💡 Try: pkill -f "server.js" or use a different port');
    } else {
        console.error('❌ Server error:', err);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

console.log(`📡 Server configuration:`);
console.log(`   Environment: development`);
console.log(`   CORS: enabled (all origins)`);
console.log(`   Supabase: ${supabaseUrl ? 'connected' : 'not configured'}`);
console.log('🚀 Ready for connections!');
