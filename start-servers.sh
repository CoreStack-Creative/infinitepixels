#!/bin/bash

echo "🔧 InfinitePixels Network Setup"
echo "==============================="

# Get the local IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo "🌐 Local IP: $LOCAL_IP"

# Kill any existing servers
echo "🛑 Stopping existing servers..."
pkill -f "simple-server" 2>/dev/null
pkill -f "server.js" 2>/dev/null
pkill -f "python.*simple-server" 2>/dev/null

# Wait a moment
sleep 2

echo ""
echo "🚀 Starting servers..."

# Start the account server
echo "📊 Starting account server on port 3001..."
cd server && node simple-server.js &
SERVER_PID=$!
cd ..

# Start the file server
echo "📁 Starting file server on port 8080..."
python3 simple-server.py &
FILE_SERVER_PID=$!

# Wait for servers to start
sleep 3

echo ""
echo "🧪 Testing connectivity..."

# Test localhost
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Account server responding on localhost:3001"
else
    echo "❌ Account server not responding on localhost:3001"
fi

if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ File server responding on localhost:8080"
else
    echo "❌ File server not responding on localhost:8080"
fi

echo ""
echo "📱 INSTRUCTIONS FOR OTHER DEVICES:"
echo "=================================="
echo ""
echo "1. Make sure your device is on the same WiFi network"
echo "2. Open a web browser on your phone/tablet/other computer"
echo "3. Go to: http://$LOCAL_IP:8080"
echo "4. Navigate to your HTML files (e.g., index.html)"
echo ""
echo "🎯 Direct links:"
echo "   Main site: http://$LOCAL_IP:8080/index.html"
echo "   Test page: http://$LOCAL_IP:8080/test-account-system.html"
echo ""
echo "💡 If the account system shows 'offline mode':"
echo "   - This is normal if macOS firewall is blocking the Node.js server"
echo "   - The account system will still work, just storing data locally"
echo "   - You can create accounts with any email/username"
echo ""
echo "🛑 Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $SERVER_PID 2>/dev/null
    kill $FILE_SERVER_PID 2>/dev/null
    pkill -f "simple-server" 2>/dev/null
    pkill -f "python.*simple-server" 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT

# Keep script running
echo "⏳ Servers running... Press Ctrl+C to stop"
wait
