// Account System JavaScript
class AccountSystem {
    constructor() {
        this.user = null;
        this.session = null;
        this.baseURL = 'http://localhost:3000';
        this.deviceId = this.generateDeviceId();
        this.init();
    }

    init() {
        // Check for existing session
        this.checkExistingSession();
        // Add account UI to pages
        this.addAccountUI();
        // Setup event listeners
        this.setupEventListeners();
    }

    checkExistingSession() {
        const sessionData = localStorage.getItem('infinitepixels_session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                
                // Check if session is expired (72 hours = 72 * 60 * 60 * 1000 = 259,200,000 ms)
                const now = new Date();
                const sessionExpiry = new Date(session.expires_at || session.created_at);
                const maxSessionDuration = 72 * 60 * 60 * 1000; // 72 hours in milliseconds
                
                // Check if session is still valid (either not expired or within 72 hours)
                const isSessionValid = sessionExpiry > now || 
                    (session.created_at && (now - new Date(session.created_at)) < maxSessionDuration);
                
                if (isSessionValid && session.access_token) {
                    this.session = session;
                    this.fetchUserProfile();
                    
                    // Refresh session if it's close to expiring (within 6 hours)
                    const sixHours = 6 * 60 * 60 * 1000;
                    if (sessionExpiry - now < sixHours) {
                        this.refreshSession();
                    }
                } else {
                    console.log('Session expired or invalid, clearing local storage');
                    localStorage.removeItem('infinitepixels_session');
                    this.clearDeviceSession();
                }
            } catch (error) {
                console.error('Error parsing session:', error);
                localStorage.removeItem('infinitepixels_session');
                this.clearDeviceSession();
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
                                <input type="email" id="signupEmail" placeholder="Email" required>
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
                
                // Enhance session with device info and extended expiry
                const enhancedSession = {
                    ...data.session,
                    device_id: this.deviceId,
                    created_at: new Date().toISOString(),
                    last_refresh: new Date().toISOString(),
                    extended_expiry: new Date(Date.now() + (72 * 60 * 60 * 1000)).toISOString() // 72 hours
                };
                
                // Store enhanced session
                localStorage.setItem('infinitepixels_session', JSON.stringify(enhancedSession));
                this.session = enhancedSession;
                
                // Store device session info
                this.storeDeviceSession();
                
                this.updateAccountUI();
                this.showMessage('Logged in successfully!', 'success');
                
                // Sync local data to server
                this.syncLocalDataToServer();
                
                // Close dropdown
                document.getElementById('accountDropdown').classList.remove('show');
            } else {
                this.showMessage(data.error, 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('An error occurred during login', 'error');
        }
    }

    async signup(event) {
        event.preventDefault();
        
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
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
                this.showMessage('Account created! Please check your email for verification.', 'success');
                this.showLogin();
            } else {
                this.showMessage(data.error, 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showMessage('An error occurred during signup', 'error');
        }
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

    // Generate a unique device ID for session tracking
    generateDeviceId() {
        let deviceId = localStorage.getItem('infinitepixels_device_id');
        if (!deviceId) {
            // Generate a unique device ID based on browser fingerprint
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('Device fingerprint', 2, 2);
            
            const fingerprint = [
                navigator.userAgent,
                navigator.language,
                screen.width + 'x' + screen.height,
                new Date().getTimezoneOffset(),
                canvas.toDataURL()
            ].join('|');
            
            deviceId = btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
            localStorage.setItem('infinitepixels_device_id', deviceId);
        }
        return deviceId;
    }

    // Store device session information
    storeDeviceSession() {
        if (!this.session || !this.user) return;
        
        const deviceSession = {
            device_id: this.deviceId,
            user_id: this.user.id,
            last_active: new Date().toISOString(),
            browser: navigator.userAgent,
            platform: navigator.platform
        };
        
        localStorage.setItem('infinitepixels_device_session', JSON.stringify(deviceSession));
    }

    // Clear device session
    clearDeviceSession() {
        localStorage.removeItem('infinitepixels_device_session');
    }

    // Refresh session token
    async refreshSession() {
        if (!this.session || !this.session.refresh_token) return false;

        try {
            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    refresh_token: this.session.refresh_token,
                    device_id: this.deviceId
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Update session with new tokens
                const enhancedSession = {
                    ...data.session,
                    device_id: this.deviceId,
                    created_at: this.session.created_at || new Date().toISOString(),
                    last_refresh: new Date().toISOString(),
                    extended_expiry: new Date(Date.now() + (72 * 60 * 60 * 1000)).toISOString()
                };
                
                this.session = enhancedSession;
                localStorage.setItem('infinitepixels_session', JSON.stringify(enhancedSession));
                
                console.log('Session refreshed successfully');
                return true;
            } else {
                console.error('Failed to refresh session');
                this.logout();
                return false;
            }
        } catch (error) {
            console.error('Error refreshing session:', error);
            return false;
        }
    }

    // Check if user is on a different device
    isNewDevice() {
        const lastDeviceSession = localStorage.getItem('infinitepixels_device_session');
        if (!lastDeviceSession) return true;
        
        try {
            const deviceSession = JSON.parse(lastDeviceSession);
            return deviceSession.device_id !== this.deviceId;
        } catch (error) {
            return true;
        }
    }
}

// Initialize account system
const accountSystem = new AccountSystem();
