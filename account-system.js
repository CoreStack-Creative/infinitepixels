// Account System JavaScript
class AccountSystem {
    constructor() {
        this.user = null;
        this.session = null;
        this.baseURL = this.getServerURL();
        this.isReady = false;
        this.readyCallbacks = [];
        this.init();
    }

    // Determine the correct server URL based on environment
    getServerURL() {
        // Try port 3001 first (new simple server), then 3000 (original server)
        return 'http://localhost:3001';
    }

    // Auto-detect the best server URL by testing multiple options
    async findWorkingServerURL() {
        // Get current page's hostname to determine local IP
        const currentHostname = window.location.hostname;
        
        const possibleURLs = [
            'http://localhost:3001',
            'http://localhost:3000',
            'http://127.0.0.1:3001',
            'http://127.0.0.1:3000'
        ];

        // If we're not on localhost, try the current hostname with port 3001 and 3000
        if (currentHostname !== 'localhost' && currentHostname !== '127.0.0.1' && currentHostname !== '') {
            possibleURLs.push(`http://${currentHostname}:3001`);
            possibleURLs.push(`http://${currentHostname}:3000`);
        }
        
        // Add common local network IPs
        possibleURLs.push('http://192.168.11.26:3001');
        possibleURLs.push('http://192.168.11.26:3000');
        
        // If opening from file:// protocol, try to guess local IP
        if (window.location.protocol === 'file:') {
            // Add more potential local IPs
            for (let i = 1; i < 255; i++) {
                if (i === 26) continue; // Skip, already added
                possibleURLs.push(`http://192.168.11.${i}:3000`);
                if (possibleURLs.length > 10) break; // Limit to avoid too many requests
            }
        }

        console.log('🔍 Testing server URLs:', possibleURLs.slice(0, 5), '...');

        for (const url of possibleURLs) {
            try {
                console.log(`Testing: ${url}`);
                const response = await fetch(`${url}/`, {
                    method: 'GET',
                    signal: AbortSignal.timeout(2000) // 2 second timeout
                });
                
                if (response.ok) {
                    console.log(`✅ Found working server at: ${url}`);
                    this.baseURL = url;
                    return url;
                }
            } catch (error) {
                console.log(`❌ ${url} failed:`, error.message);
            }
        }
        
        console.error('❌ No working server URL found');
        return null;
    }

    init() {
        // Log configuration info for debugging
        this.logConfiguration();
        
        // Check for existing session
        this.checkExistingSession();
        // Add account UI to pages
        this.addAccountUI();
        // Setup event listeners
        this.setupEventListeners();
        // Setup session extension on user activity
        this.setupSessionExtension();
        // Mark as ready and notify callbacks
        this.setReady();
    }

    // Log configuration information for debugging
    logConfiguration() {
        console.log('🔧 Account System Configuration:');
        console.log('  Current URL:', window.location.href);
        console.log('  Hostname:', window.location.hostname);
        console.log('  Protocol:', window.location.protocol);
        console.log('  Server URL:', this.baseURL);
        console.log('  User Agent:', navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop');
        
        // Test server connectivity
        this.testServerConnection();
    }

    // Test if the server is reachable
    async testServerConnection() {
        try {
            console.log('🔍 Testing server connection...');
            
            // First try the configured URL
            let response;
            let serverFound = false;
            
            try {
                response = await fetch(`${this.baseURL}/`, {
                    method: 'GET',
                    signal: AbortSignal.timeout(5000) // 5 second timeout
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Server connection successful:', data);
                    console.log('📡 Using server URL:', this.baseURL);
                    serverFound = true;
                }
            } catch (error) {
                console.warn(`Initial URL ${this.baseURL} failed, trying auto-detection...`);
                const workingURL = await this.findWorkingServerURL();
                if (workingURL) {
                    console.log('✅ Server connection successful via auto-detection');
                    console.log('📡 Using server URL:', this.baseURL);
                    serverFound = true;
                }
            }
            
            if (!serverFound) {
                console.warn('⚠️ No server connection available');
                console.log('🔄 Account system will work in offline mode');
                console.log('� Data will be stored locally only');
                this.showMessage('Account system running in offline mode - data stored locally only', 'info');
            }
            
        } catch (error) {
            console.error('❌ Server connection failed:', error.message);
            console.log('💡 Possible solutions:');
            console.log('   1. Make sure the server is running (cd server && node server.js)');
            console.log('   2. Check if firewall allows connections on port 3000');
            console.log('   3. Try these URLs in your browser:');
            console.log('      - http://localhost:3000');
            console.log('      - http://192.168.11.26:3000');
            console.log('🔄 Account system will work in offline mode');
            this.showMessage('Account system running in offline mode - data stored locally only', 'info');
        }
    }

    // Method to register callbacks for when account system is ready
    onReady(callback) {
        if (this.isReady) {
            callback();
        } else {
            this.readyCallbacks.push(callback);
        }
    }

    // Mark system as ready and execute callbacks
    setReady() {
        this.isReady = true;
        this.readyCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Error in account system ready callback:', error);
            }
        });
        this.readyCallbacks = [];
    }

    checkExistingSession() {
        const sessionData = localStorage.getItem('infinitepixels_session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                if (session.expires_at && new Date(session.expires_at) > new Date()) {
                    this.session = session;
                    
                    // Load user data immediately if available in session
                    if (session.user) {
                        this.user = session.user;
                        this.updateAccountUI();
                        // Still fetch fresh profile to ensure data is up to date
                        this.fetchUserProfile();
                    } else {
                        // No user data in session, fetch from server
                        this.fetchUserProfile();
                    }
                    
                    // If session expires within 24 hours, extend it to 72 hours
                    const expirationTime = new Date(session.expires_at);
                    const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
                    
                    if (expirationTime < twentyFourHoursFromNow) {
                        console.log('Session expiring soon, extending to 72 hours');
                        const extendedSession = {
                            ...session,
                            expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
                        };
                        this.session = extendedSession;
                        localStorage.setItem('infinitepixels_session', JSON.stringify(extendedSession));
                    }
                } else {
                    console.log('Session expired, removing from storage');
                    localStorage.removeItem('infinitepixels_session');
                }
            } catch (error) {
                console.error('Error parsing session:', error);
                localStorage.removeItem('infinitepixels_session');
            }
        }
    }

    addAccountUI() {
        // Find the top bar
        const topBar = document.querySelector('.top-bar');
        if (!topBar) return;

        // Check if account container already exists
        if (document.getElementById('accountContainer')) return;

        // Create account container
        const accountContainer = document.createElement('div');
        accountContainer.className = 'account-container';
        accountContainer.id = 'accountContainer';
        accountContainer.innerHTML = `
            <div class="account-wrapper">
                <button class="account-btn" id="accountBtn">
                    <div class="account-avatar" id="accountAvatar">
                        <i class="fas fa-user"></i>
                    </div>
                </button>
                <div class="account-dropdown" id="accountDropdown">
                    <div class="account-dropdown-content">
                        <!-- Will be populated dynamically -->
                    </div>
                </div>
            </div>
        `;

        // Append to the end of the top bar (right side)
        topBar.appendChild(accountContainer);

        this.updateAccountUI();
    }

    updateAccountUI() {
        const accountBtn = document.getElementById('accountBtn');
        const accountAvatar = document.getElementById('accountAvatar');
        const accountDropdown = document.getElementById('accountDropdown');

        if (!accountBtn || !accountAvatar || !accountDropdown) return;

        if (this.user) {
            // User is logged in
            if (this.user.profile_image_url) {
                accountAvatar.innerHTML = `<img src="${this.user.profile_image_url}" alt="Profile" class="profile-image">`;
            } else {
                accountAvatar.innerHTML = `<div class="profile-initial">${this.user.username.charAt(0).toUpperCase()}</div>`;
            }

            accountDropdown.querySelector('.account-dropdown-content').innerHTML = `
                <div class="account-header">
                    <div class="account-info">
                        <span class="account-username">${this.user.username}</span>
                        <span class="account-email">${this.user.email}</span>
                    </div>
                </div>
                <div class="account-menu">
                    <a href="account.html" class="account-menu-item">
                        <i class="fas fa-user-cog"></i>
                        <span>My Account</span>
                    </a>
                    <a href="favorites.html" class="account-menu-item">
                        <i class="fas fa-heart"></i>
                        <span>Favorites</span>
                    </a>
                    <a href="recent.html" class="account-menu-item">
                        <i class="fas fa-clock"></i>
                        <span>Recent Games</span>
                    </a>
                    <a href="settings.html" class="account-menu-item">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                    <div class="account-menu-divider"></div>
                    <button class="account-menu-item logout-btn" onclick="accountSystem.logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            `;
        } else {
            // User is not logged in
            accountAvatar.innerHTML = `<i class="fas fa-user"></i>`;
            accountDropdown.querySelector('.account-dropdown-content').innerHTML = `
                <div class="auth-form-container">
                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="login">Login</button>
                        <button class="auth-tab" data-tab="signup">Sign Up</button>
                    </div>
                    
                    <div class="auth-form" id="loginForm">
                        <form onsubmit="accountSystem.login(event)">
                            <div class="form-group">
                                <input type="email" id="loginEmail" placeholder="Email" required>
                            </div>
                            <div class="form-group">
                                <input type="password" id="loginPassword" placeholder="Password" required>
                            </div>
                            <button type="submit" class="auth-submit-btn">Login</button>
                            <button type="button" class="forgot-password-btn" onclick="accountSystem.showForgotPassword()">
                                Forgot Password?
                            </button>
                        </form>
                    </div>
                    
                    <div class="auth-form hidden" id="signupForm">
                        <form onsubmit="accountSystem.signup(event)">
                            <div class="form-group">
                                <input type="text" id="signupUsername" placeholder="Username" required minlength="3" maxlength="30">
                            </div>
                            <div class="form-group">
                                <input type="email" id="signupEmail" placeholder="Email (use a real email format)" required>
                                <small class="form-hint">Use a valid email format (e.g., user@domain.com)</small>
                            </div>
                            <div class="form-group">
                                <input type="password" id="signupPassword" placeholder="Password" required minlength="6">
                            </div>
                            <button type="submit" class="auth-submit-btn">Sign Up</button>
                        </form>
                    </div>
                    
                    <div class="auth-form hidden" id="forgotPasswordForm">
                        <form onsubmit="accountSystem.forgotPassword(event)">
                            <div class="form-group">
                                <input type="email" id="forgotEmail" placeholder="Email" required>
                            </div>
                            <button type="submit" class="auth-submit-btn">Reset Password</button>
                            <button type="button" class="back-btn" onclick="accountSystem.showLogin()">
                                Back to Login
                            </button>
                        </form>
                    </div>
                </div>
            `;
        }
    }

    setupEventListeners() {
        // Toggle dropdown on account button click
        document.addEventListener('click', (e) => {
            const accountBtn = document.getElementById('accountBtn');
            const accountDropdown = document.getElementById('accountDropdown');
            
            if (!accountBtn || !accountDropdown) return;

            if (accountBtn.contains(e.target)) {
                accountDropdown.classList.toggle('show');
            } else if (!accountDropdown.contains(e.target)) {
                accountDropdown.classList.remove('show');
            }
        });

        // Auth tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth-tab')) {
                const tabs = document.querySelectorAll('.auth-tab');
                const forms = document.querySelectorAll('.auth-form');
                const targetTab = e.target.dataset.tab;

                tabs.forEach(tab => tab.classList.remove('active'));
                forms.forEach(form => form.classList.add('hidden'));

                e.target.classList.add('active');
                document.getElementById(targetTab + 'Form').classList.remove('hidden');
            }
        });
    }

    async login(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.session = data.session;
                this.user = data.profile;
                
                // Extend session to 72 hours and include user data
                const extendedSession = {
                    ...data.session,
                    expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72 hours from now
                    user: data.profile // Store user data with session
                };
                
                // Store extended session with user data
                localStorage.setItem('infinitepixels_session', JSON.stringify(extendedSession));
                
                this.updateAccountUI();
                this.showMessage('Welcome back!', 'success');
                
                // Sync local data to server
                this.syncLocalDataToServer();
                
                // Close dropdown
                document.getElementById('accountDropdown').classList.remove('show');
                
                // Clear form
                document.getElementById('loginEmail').value = '';
                document.getElementById('loginPassword').value = '';
            } else {
                if (data.error === 'Email not confirmed') {
                    this.showMessage('Please check your email and click the verification link before logging in.', 'error');
                } else if (data.error === 'Invalid login credentials') {
                    this.showMessage('Invalid email or password. Please try again.', 'error');
                } else {
                    this.showMessage(data.error || 'Login failed', 'error');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // Try offline mode for development/testing
            if (email === 'test@offline.com' && password === 'offline123') {
                console.log('🔄 Using offline test account');
                this.createOfflineUser(email, 'Test User');
                this.showMessage('Logged in with offline test account', 'success');
                
                // Close dropdown and clear form
                document.getElementById('accountDropdown').classList.remove('show');
                document.getElementById('loginEmail').value = '';
                document.getElementById('loginPassword').value = '';
            } else {
                this.showMessage('Network error. Server may be offline. Try test@offline.com / offline123 for offline mode.', 'error');
            }
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async signup(event) {
        event.preventDefault();
        
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showMessage('Please enter a valid email address (e.g., yourname@gmail.com)', 'error');
            return;
        }
        
        // Additional check for common test domains that might be rejected
        const testDomains = ['test.com', 'example.com', 'test.org'];
        const emailDomain = email.split('@')[1]?.toLowerCase();
        if (testDomains.includes(emailDomain)) {
            this.showMessage('Please use a real email address (Gmail, Yahoo, etc.) as test domains may be rejected.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${this.baseURL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                if (data.requiresVerification) {
                    this.showMessage('Account created! Please check your email for verification before logging in.', 'success');
                } else {
                    this.showMessage('Account created successfully! You can now log in.', 'success');
                }
                this.showLogin();
                // Clear form
                document.getElementById('signupUsername').value = '';
                document.getElementById('signupEmail').value = '';
                document.getElementById('signupPassword').value = '';
            } else {
                let errorMessage = data.error || 'Signup failed';
                
                // Provide helpful hints for common errors
                if (errorMessage.includes('invalid')) {
                    errorMessage += '. Please use a real email format (e.g., yourname@gmail.com)';
                } else if (errorMessage.includes('taken')) {
                    errorMessage += '. Please try a different username.';
                } else if (errorMessage.includes('weak')) {
                    errorMessage += '. Use at least 6 characters with letters and numbers.';
                }
                
                this.showMessage(errorMessage, 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            
            // Create offline account for testing
            console.log('🔄 Creating offline account');
            this.createOfflineUser(email, username);
            this.showMessage('Account created in offline mode. Data will be stored locally only.', 'success');
            
            // Switch to login tab and clear form
            this.showLogin();
            document.getElementById('signupUsername').value = '';
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPassword').value = '';
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Create offline user for when server is not available
    createOfflineUser(email, username) {
        const offlineUser = {
            id: 'offline_' + Date.now(),
            email: email,
            username: username,
            created_at: new Date().toISOString(),
            offline_mode: true
        };
        
        const offlineSession = {
            access_token: 'offline_token_' + Date.now(),
            expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
            user: offlineUser
        };
        
        this.user = offlineUser;
        this.session = offlineSession;
        
        // Store in localStorage
        localStorage.setItem('infinitepixels_session', JSON.stringify(offlineSession));
        localStorage.setItem('infinitepixels_offline_user', JSON.stringify(offlineUser));
        
        this.updateAccountUI();
    }

    async forgotPassword(event) {
        event.preventDefault();
        
        const email = document.getElementById('forgotEmail').value;
        
        try {
            const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('Password reset email sent!', 'success');
                this.showLogin();
            } else {
                this.showMessage(data.error, 'error');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            this.showMessage('An error occurred', 'error');
        }
    }

    async logout() {
        try {
            if (this.session) {
                await fetch(`${this.baseURL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.session.access_token}`
                    }
                });
            }

            this.user = null;
            this.session = null;
            localStorage.removeItem('infinitepixels_session');
            
            this.updateAccountUI();
            this.showMessage('Logged out successfully!', 'success');
            
            // Close dropdown
            document.getElementById('accountDropdown').classList.remove('show');
            
            // Refresh recent games page if we're on it to show local data
            if (window.location.pathname.includes('recent.html') && window.recentGamesManager) {
                setTimeout(() => {
                    window.recentGamesManager.loadRecentGames();
                }, 100);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async fetchUserProfile() {
        if (!this.session) return;

        try {
            const response = await fetch(`${this.baseURL}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${this.session.access_token}`
                }
            });

            if (response.ok) {
                this.user = await response.json();
                
                // Update the stored session with fresh user data
                const sessionData = localStorage.getItem('infinitepixels_session');
                if (sessionData) {
                    try {
                        const session = JSON.parse(sessionData);
                        const updatedSession = {
                            ...session,
                            user: this.user
                        };
                        localStorage.setItem('infinitepixels_session', JSON.stringify(updatedSession));
                        this.session = updatedSession;
                    } catch (error) {
                        console.error('Error updating session with user data:', error);
                    }
                }
                
                this.updateAccountUI();
            } else {
                // Session might be invalid
                this.user = null;
                this.session = null;
                localStorage.removeItem('infinitepixels_session');
                this.updateAccountUI();
            }
        } catch (error) {
            console.error('Fetch profile error:', error);
        }
    }

    // Setup session extension on user activity
    setupSessionExtension() {
        // Track user activity to extend session
        const activityEvents = ['click', 'scroll', 'keypress', 'mousemove'];
        let lastActivity = Date.now();
        
        // Throttle activity tracking to avoid excessive updates
        const throttleMs = 60000; // 1 minute
        
        const handleActivity = () => {
            const now = Date.now();
            if (this.session && (now - lastActivity) > throttleMs) {
                lastActivity = now;
                this.extendSession();
            }
        };
        
        // Add event listeners for user activity
        activityEvents.forEach(event => {
            document.addEventListener(event, handleActivity, { passive: true });
        });
        
        // Extend session every 30 minutes for active users
        setInterval(() => {
            if (this.session && (Date.now() - lastActivity) < 1800000) { // 30 minutes
                this.extendSession();
            }
        }, 1800000); // 30 minutes
    }

    // Extend session expiration time to 72 hours from now
    extendSession() {
        if (!this.session) return;
        
        try {
            const extendedSession = {
                ...this.session,
                expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72 hours from now
                user: this.user // Preserve user data
            };
            
            this.session = extendedSession;
            localStorage.setItem('infinitepixels_session', JSON.stringify(extendedSession));
            
            console.log('Session extended for 72 hours');
        } catch (error) {
            console.error('Error extending session:', error);
        }
    }

    async addToFavorites(gameId) {
        if (!this.session) {
            this.showMessage('Please login to add favorites', 'error');
            return false;
        }

        try {
            const response = await fetch(`${this.baseURL}/user/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.session.access_token}`
                },
                body: JSON.stringify({ game_id: gameId })
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('Added to favorites!', 'success');
                return true;
            } else {
                this.showMessage(data.error, 'error');
                return false;
            }
        } catch (error) {
            console.error('Add favorite error:', error);
            this.showMessage('Error adding to favorites', 'error');
            return false;
        }
    }

    async removeFromFavorites(gameId) {
        if (!this.session) return false;

        try {
            const response = await fetch(`${this.baseURL}/user/favorites/${gameId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.session.access_token}`
                }
            });

            if (response.ok) {
                this.showMessage('Removed from favorites!', 'success');
                return true;
            } else {
                const data = await response.json();
                this.showMessage(data.error, 'error');
                return false;
            }
        } catch (error) {
            console.error('Remove favorite error:', error);
            return false;
        }
    }

    async addToRecentGames(gameId) {
        // Always add to local storage for immediate feedback
        this.addToLocalRecentGames(gameId);

        // If logged in, also sync to server
        if (this.session) {
            try {
                await fetch(`${this.baseURL}/user/recent-games`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.session.access_token}`
                    },
                    body: JSON.stringify({ game_id: gameId })
                });
            } catch (error) {
                console.error('Add recent game error:', error);
            }
        }
    }

    addToLocalRecentGames(gameId) {
        try {
            const storageKey = 'infinitePixels_recentlyPlayed';
            const maxGames = 24;
            
            let recentGames = [];
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                recentGames = JSON.parse(stored);
            }
            
            // Remove the game if it already exists (to move it to the front)
            recentGames = recentGames.filter(g => g.slug !== gameId);
            
            // Add the game to the beginning with current timestamp
            const gameWithTimestamp = {
                slug: gameId,
                lastPlayed: Date.now()
            };
            
            recentGames.unshift(gameWithTimestamp);
            
            // Keep only the most recent games
            if (recentGames.length > maxGames) {
                recentGames = recentGames.slice(0, maxGames);
            }
            
            // Save to localStorage
            localStorage.setItem(storageKey, JSON.stringify(recentGames));
        } catch (error) {
            console.error('Error saving to local recent games:', error);
        }
    }

    showLogin() {
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');

        tabs.forEach(tab => tab.classList.remove('active'));
        forms.forEach(form => form.classList.add('hidden'));

        document.querySelector('[data-tab="login"]').classList.add('active');
        document.getElementById('loginForm').classList.remove('hidden');
    }

    showForgotPassword() {
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => form.classList.add('hidden'));
        document.getElementById('forgotPasswordForm').classList.remove('hidden');
    }

    showMessage(message, type = 'info') {
        // Create or update message container
        let messageContainer = document.getElementById('authMessage');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'authMessage';
            messageContainer.className = 'auth-message';
            document.body.appendChild(messageContainer);
        }

        messageContainer.textContent = message;
        messageContainer.className = `auth-message ${type} show`;

        // Auto hide after 3 seconds
        setTimeout(() => {
            messageContainer.classList.remove('show');
        }, 3000);
    }

    isLoggedIn() {
        return !!this.user && !!this.session;
    }

    getAuthHeaders() {
        if (!this.session) return {};
        return {
            'Authorization': `Bearer ${this.session.access_token}`
        };
    }

    async syncLocalDataToServer() {
        if (!this.session) return;

        try {
            // Sync local recent games to server
            const localRecent = localStorage.getItem('infinitePixels_recentlyPlayed');
            if (localRecent) {
                const recentGames = JSON.parse(localRecent);
                
                // Sync each game to server (most recent first)
                for (const game of recentGames.slice(0, 10)) { // Limit to 10 most recent
                    try {
                        await fetch(`${this.baseURL}/user/recent-games`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.session.access_token}`
                            },
                            body: JSON.stringify({ 
                                game_id: game.slug,
                                last_played: new Date(game.lastPlayed).toISOString()
                            })
                        });
                    } catch (error) {
                        console.warn('Failed to sync recent game:', game.slug, error);
                    }
                }
            }

            // You could also sync favorites here if they're stored locally
            // const localFavorites = localStorage.getItem('infinitepixels_favorites');
            // ... sync favorites logic ...

        } catch (error) {
            console.error('Error syncing local data to server:', error);
        }
    }
}

// Initialize account system
const accountSystem = new AccountSystem();
