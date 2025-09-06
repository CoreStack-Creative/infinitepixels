#!/bin/bash

# InfinitePixels Account System Network Setup Script
# This script sets up both the file server and account server for network access

echo "🚀 InfinitePixels Network Setup"
echo "================================"

# Check if Node.js server is running
if pgrep -f "server/server.js" > /dev/null; then
    echo "✅ Account server is running"
else
    echo "❌ Account server is not running"
    echo "📝 Starting account server..."
    cd server && node server.js &
    sleep 2
    cd ..
fi

# Get local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo "🌐 Local IP address: $LOCAL_IP"

# Test account server
echo "🔍 Testing account server..."
if curl -s "http://localhost:3000" > /dev/null; then
    echo "✅ Account server responding on localhost"
else
    echo "❌ Account server not responding on localhost"
fi

if curl -s "http://$LOCAL_IP:3000" > /dev/null; then
    echo "✅ Account server responding on network"
else
    echo "❌ Account server not responding on network"
    echo "⚠️  This might be a firewall issue"
fi

# Start file server
echo "📁 Starting file server on port 8080..."
echo "🔗 Local access: http://localhost:8080"
echo "📱 Network access: http://$LOCAL_IP:8080"
echo "🎯 Test page: http://$LOCAL_IP:8080/test-account-system.html"
echo "🏠 Main site: http://$LOCAL_IP:8080/index.html"
echo ""
echo "📋 Instructions for other devices:"
echo "   1. Connect to the same WiFi network"
echo "   2. Open browser and go to: http://$LOCAL_IP:8080"
echo "   3. If the account system shows 'network error', the Node.js server"
echo "      might be blocked by firewall. The account system will still work"
echo "      but won't sync between devices."
echo ""
echo "🛑 Press Ctrl+C to stop both servers"
echo "================================"

# Start Python file server
python3 simple-server.py
