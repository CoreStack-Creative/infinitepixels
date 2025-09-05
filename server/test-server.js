require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Simple signup route
app.post('/auth/signup', (req, res) => {
    console.log('Signup request received:', req.body);
    const { email, password, username } = req.body;
    
    if (!email || !password || !username) {
        return res.status(400).json({
            error: 'Email, password, and username are required'
        });
    }
    
    // For now, just return success
    res.status(201).json({
        message: 'Test: Account would be created successfully',
        user: { email, username }
    });
});

app.listen(PORT, () => {
    console.log('🚀 Test server running on http://localhost:3000');
});
