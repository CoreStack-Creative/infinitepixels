#!/usr/bin/env python3
"""
Simple HTTP server to serve files over the network
Run with: python3 simple-server.py
"""

import http.server
import socketserver
import os
import webbrowser
from threading import Timer

# Change to the current directory
os.chdir('/Users/velo/webhtml/infinitepixels')

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def open_browser():
    webbrowser.open(f'http://localhost:{PORT}')

if __name__ == "__main__":
    # Get local IP more reliably
    import socket
    
    # Connect to a remote server to determine local IP
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Connect to Google DNS to get local IP
        s.connect(('8.8.8.8', 80))
        local_ip = s.getsockname()[0]
        s.close()
    except Exception:
        # Fallback method
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
    
    print(f"🌐 Starting file server...")
    print(f"📁 Serving files from: {os.getcwd()}")
    print(f"🔗 Local access: http://localhost:{PORT}")
    print(f"📱 Network access: http://{local_ip}:{PORT}")
    print(f"🎯 Test page: http://{local_ip}:{PORT}/test-account-system.html")
    print(f"🏠 Main site: http://{local_ip}:{PORT}/index.html")
    print(f"⚠️  Make sure your account server is running on port 3000!")
    print("")
    print(f"📋 FOR OTHER DEVICES:")
    print(f"   1. Connect to the same WiFi network")
    print(f"   2. Open browser and go to: http://{local_ip}:{PORT}")
    print(f"   3. The account system will auto-detect the server")
    print("")
    print(f"📊 Server logs will appear below...")
    print("-" * 60)
    
    # Start server
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        try:
            # Open browser after a short delay
            Timer(1.0, open_browser).start()
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")
            httpd.shutdown()
