// Account System JavaScript with Supabase Integration
class AccountSystem {
    constructor() {
        this.user = null;
        this.session = null;
        
        // Initialize Supabase client
        if (typeof window !== 'undefined' && window.supabase && SUPABASE_CONFIG.enabled) {
            this.supabase = window.supabase;
            console.log('✅ Supabase client initialized for accounts');
        } else {
            this.supabase = null;
            console.log('📱 Account system running in offline mode');
        }
        
        this.init();
    }

    async init() {
        // Initialize Supabase
        await this.initSupabase();
        
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

    async initSupabase() {
        try {
            // Check if Supabase is available
            if (typeof window !== 'undefined' && window.supabase && SUPABASE_CONFIG.enabled) {
                this.supabase = window.supabase;
                console.log('✅ Supabase client initialized for accounts');
                
                // Listen for auth state changes
                this.supabase.auth.onAuthStateChange((event, session) => {
                    console.log('Auth state changed:', event, session);
                    
                    if (event === 'SIGNED_IN' && session) {
                        this.handleAuthStateChange(session);
                    } else if (event === 'SIGNED_OUT') {
                        this.handleSignOut();
                    }
                });
                
            } else {
                console.log('📱 Account system running in offline mode');
            }
        } catch (error) {
            console.warn('⚠️ Supabase initialization failed, using offline mode:', error);
        }
    }

    async handleAuthStateChange(session) {
        if (session && session.user) {
            // User signed in (including from email verification)
            this.session = session;
            
            // Fetch or create user profile
            try {
                const { data: profile, error } = await this.supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                
                if (error && error.code === 'PGRST116') {
                    // User profile doesn't exist, create it
                    await this.createUserProfile(session.user);
                } else if (profile) {
                    this.user = profile;
                }
            } catch (error) {
                console.error('Error handling auth state change:', error);
            }
            
            // Update session storage and UI
            const extendedSession = {
                ...session,
                expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
                user: this.user
            };
            
            localStorage.setItem('infinitepixels_session', JSON.stringify(extendedSession));
            this.updateAccountUI();
            
            // Sync data if this is a new login
            await this.syncLocalDataToServer();
            await this.loadServerDataToDevice();
        }
    }

    handleSignOut() {
        this.user = null;
        this.session = null;
        localStorage.removeItem('infinitepixels_session');
        this.updateAccountUI();
    }

    // Log configuration information for debugging
    logConfiguration() {
        console.log('🔧 Account System Configuration:');
        console.log('  Current URL:', window.location.href);
        console.log('  Hostname:', window.location.hostname);
        console.log('  Protocol:', window.location.protocol);
        console.log('  Mode:', this.supabase ? 'Online (Supabase)' : 'Offline');
        console.log('  User Agent:', navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop');
        console.log('  Device:', this.getDeviceInfo());
        
        // Additional sync status info
        if (this.supabase) {
            console.log('  ✅ Supabase Status: Connected');
            console.log('  🔄 Cross-device sync: ENABLED');
        } else {
            console.log('  ❌ Supabase Status: Not configured');
            console.log('  📱 Cross-device sync: DISABLED (offline mode)');
            console.log('  💡 To enable sync: Configure supabase-config.js');
        }
    }

    getDeviceInfo() {
        const ua = navigator.userAgent;
        if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
            return 'Mobile';
        } else if (/Tablet|iPad/i.test(ua)) {
            return 'Tablet';
        } else {
            return 'Desktop';
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
                        
                        // If online, verify session with Supabase
                        if (this.supabase) {
                            this.verifySupabaseSession();
                        }
                    }
                    
                    // Extend session if it expires within 24 hours
                    const expirationTime = new Date(session.expires_at);
                    const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
                    
                    if (expirationTime < twentyFourHoursFromNow) {
                        console.log('Session expiring soon, extending to 72 hours');
                        this.extendSession();
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

    async verifySupabaseSession() {
        if (!this.supabase || !this.session) return;

        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            
            if (error || !user) {
                // Session is invalid, clear it
                this.logout();
            } else {
                // Update user data if different
                if (user.id !== this.user.id) {
                    await this.fetchUserProfile();
                }
            }
        } catch (error) {
            console.error('Error verifying Supabase session:', error);
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

            const offlineIndicator = this.user.offline_mode ? '<span class="offline-indicator">📱 Offline</span>' : '';
            const syncStatus = this.supabase ? '<span class="sync-indicator">🔄 Sync Enabled</span>' : '<span class="offline-indicator">📱 Device Only</span>';
            
            accountDropdown.querySelector('.account-dropdown-content').innerHTML = `
                <div class="account-header">
                    <div class="account-info">
                        <span class="account-username">${this.user.username}</span>
                        <span class="account-email">${this.user.email}</span>
                        ${offlineIndicator}
                        ${syncStatus}
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
            
            const modeIndicator = this.supabase ? '' : '<div class="mode-indicator">📱 Offline Mode</div>';
            
            accountDropdown.querySelector('.account-dropdown-content').innerHTML = `
                <div class="auth-form-container">
                    ${modeIndicator}
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
                            ${this.supabase ? '<button type="button" class="forgot-password-btn" onclick="accountSystem.showForgotPassword()">Forgot Password?</button>' : ''}
                        </form>
                    </div>
                    
                    <div class="auth-form hidden" id="signupForm">
                        <form onsubmit="accountSystem.signup(event)">
                            <div class="form-group">
                                <input type="text" id="signupUsername" placeholder="Username" required minlength="3" maxlength="30">
                            </div>
                            <div class="form-group">
                                <input type="email" id="signupEmail" placeholder="Email" required>
                                <small class="form-hint">${this.supabase ? 'Use a valid email address' : 'Any email format works in offline mode'}</small>
                            </div>
                            <div class="form-group">
                                <input type="password" id="signupPassword" placeholder="Password" required minlength="6">
                            </div>
                            <button type="submit" class="auth-submit-btn">Sign Up</button>
                        </form>
                    </div>
                    
                    ${this.supabase ? `
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
                    ` : ''}
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
            if (this.supabase) {
                // Online mode - use Supabase
                await this.loginWithSupabase(email, password);
            } else {
                // Offline mode
                await this.loginOffline(email, password);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Login failed. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async loginWithSupabase(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                this.showMessage('Invalid email or password. Please try again.', 'error');
            } else if (error.message.includes('Email not confirmed')) {
                this.showMessage('Please check your email and click the verification link before logging in.', 'error');
            } else {
                this.showMessage(error.message, 'error');
            }
            return;
        }

        if (data.user) {
            await this.handleSuccessfulLogin(data.user, data.session);
        }
    }

    async loginOffline(email, password) {
        // Check for stored offline user
        const offlineUsers = JSON.parse(localStorage.getItem('infinitepixels_offline_users') || '[]');
        const user = offlineUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Remove password from user object for security
            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password;
            
            const offlineSession = {
                access_token: 'offline_token_' + Date.now(),
                expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
                user: userWithoutPassword
            };
            
            await this.handleSuccessfulLogin(userWithoutPassword, offlineSession);
        } else {
            this.showMessage('Invalid email or password. Create an account first.', 'error');
        }
    }

    async handleSuccessfulLogin(user, session) {
        // Fetch full user profile if using Supabase
        if (this.supabase) {
            try {
                const { data: profile, error } = await this.supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                
                if (!error && profile) {
                    this.user = profile;
                } else {
                    // Create user profile if it doesn't exist
                    await this.createUserProfile(user);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                this.user = user;
            }
        } else {
            this.user = user;
        }

        this.session = session;
        
        // Store session with user data
        const extendedSession = {
            ...session,
            expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
            user: this.user
        };
        
        localStorage.setItem('infinitepixels_session', JSON.stringify(extendedSession));
        
        this.updateAccountUI();
        this.showMessage('Welcome back!', 'success');
        
        // Close dropdown and clear form
        document.getElementById('accountDropdown').classList.remove('show');
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
        // Sync local data to server if online
        if (this.supabase) {
            this.syncLocalDataToServer();
            // Load server data to this device
            await this.loadServerDataToDevice();
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
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Username validation
        if (username.length < 3 || username.length > 30) {
            this.showMessage('Username must be between 3-30 characters', 'error');
            return;
        }
        
        // Password validation
        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        try {
            if (this.supabase) {
                // Online mode - use Supabase
                await this.signupWithSupabase(username, email, password);
            } else {
                // Offline mode
                await this.signupOffline(username, email, password);
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showMessage('Signup failed. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async signupWithSupabase(username, email, password) {
        // First check if username is available
        const { data: existingUser, error: checkError } = await this.supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();
        
        if (existingUser) {
            this.showMessage('Username is already taken. Please choose another.', 'error');
            return;
        }

        // Create auth user with proper redirect URL
        const { data, error } = await this.supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (error) {
            this.showMessage(error.message, 'error');
            return;
        }

        if (data.user) {
            // Don't create profile here - it will be created when user verifies email
            this.showMessage('Account created! Please check your email for verification link.', 'success');
            this.showLogin();
            this.clearSignupForm();
        }
    }

    async signupOffline(username, email, password) {
        // Check for existing offline users
        const offlineUsers = JSON.parse(localStorage.getItem('infinitepixels_offline_users') || '[]');
        
        // Check if username or email already exists
        if (offlineUsers.find(u => u.username === username)) {
            this.showMessage('Username is already taken. Please choose another.', 'error');
            return;
        }
        
        if (offlineUsers.find(u => u.email === email)) {
            this.showMessage('Email is already registered. Please use another email.', 'error');
            return;
        }
        
        // Create offline user
        const offlineUser = {
            id: 'offline_' + Date.now(),
            username: username,
            email: email,
            password: password, // Store password for offline mode (not recommended for production)
            created_at: new Date().toISOString(),
            offline_mode: true,
            email_verified: true
        };
        
        // Add to offline users list
        offlineUsers.push(offlineUser);
        localStorage.setItem('infinitepixels_offline_users', JSON.stringify(offlineUsers));
        
        this.showMessage('Account created successfully! You can now log in.', 'success');
        this.showLogin();
        this.clearSignupForm();
    }

    async createUserProfile(user) {
        if (!this.supabase) return;
        
        try {
            const { data, error } = await this.supabase
                .from('users')
                .insert([
                    {
                        id: user.id,
                        username: user.email.split('@')[0], // Default username from email
                        email: user.email,
                        email_verified: user.email_confirmed_at ? true : false
                    }
                ])
                .select()
                .single();

            if (!error && data) {
                this.user = data;
                console.log('✅ User profile created:', data);
            }
        } catch (error) {
            console.error('Error creating user profile:', error);
        }
    }

    clearSignupForm() {
        document.getElementById('signupUsername').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
    }

    async forgotPassword(event) {
        event.preventDefault();
        
        if (!this.supabase) {
            this.showMessage('Password reset is not available in offline mode', 'error');
            return;
        }
        
        const email = document.getElementById('forgotEmail').value;
        
        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password.html`
            });
            
            if (error) {
                this.showMessage(error.message, 'error');
            } else {
                this.showMessage('Password reset email sent! Check your inbox.', 'success');
                this.showLogin();
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            this.showMessage('An error occurred', 'error');
        }
    }

    async logout() {
        try {
            if (this.supabase && this.session) {
                await this.supabase.auth.signOut();
            }

            this.user = null;
            this.session = null;
            localStorage.removeItem('infinitepixels_session');
            
            this.updateAccountUI();
            this.showMessage('Logged out successfully!', 'success');
            
            // Close dropdown
            document.getElementById('accountDropdown').classList.remove('show');
            
            // Refresh recent games page if we're on it
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
            if (this.supabase) {
                const { data: profile, error } = await this.supabase
                    .from('users')
                    .select('*')
                    .eq('id', this.session.user?.id)
                    .single();
                
                if (!error && profile) {
                    this.user = profile;
                    
                    // Update stored session with fresh user data
                    const sessionData = localStorage.getItem('infinitepixels_session');
                    if (sessionData) {
                        const session = JSON.parse(sessionData);
                        const updatedSession = { ...session, user: this.user };
                        localStorage.setItem('infinitepixels_session', JSON.stringify(updatedSession));
                        this.session = updatedSession;
                    }
                    
                    this.updateAccountUI();
                }
            }
        } catch (error) {
            console.error('Fetch profile error:', error);
        }
    }

    // Setup session extension on user activity
    setupSessionExtension() {
        const activityEvents = ['click', 'scroll', 'keypress', 'mousemove'];
        let lastActivity = Date.now();
        const throttleMs = 60000; // 1 minute
        
        const handleActivity = () => {
            const now = Date.now();
            if (this.session && (now - lastActivity) > throttleMs) {
                lastActivity = now;
                this.extendSession();
            }
        };
        
        activityEvents.forEach(event => {
            document.addEventListener(event, handleActivity, { passive: true });
        });
        
        // Extend session every 30 minutes for active users
        setInterval(() => {
            if (this.session && (Date.now() - lastActivity) < 1800000) {
                this.extendSession();
            }
        }, 1800000);
    }

    extendSession() {
        if (!this.session) return;
        
        try {
            const extendedSession = {
                ...this.session,
                expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
                user: this.user
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
            if (this.supabase) {
                // Online mode - save to server
                const { error } = await this.supabase
                    .from('user_favorites')
                    .upsert({
                        user_id: this.user.id,
                        game_id: gameId
                    }, {
                        onConflict: 'user_id,game_id'
                    });

                if (error) throw error;

                // Also save to local storage for immediate feedback
                const favorites = JSON.parse(localStorage.getItem('infinitePixels_favorites') || '[]');
                if (!favorites.includes(gameId)) {
                    favorites.push(gameId);
                    localStorage.setItem('infinitePixels_favorites', JSON.stringify(favorites));
                }

                this.showMessage('Added to favorites!', 'success');
                return true;
            } else {
                // Offline mode
                const favorites = JSON.parse(localStorage.getItem('infinitePixels_favorites') || '[]');
                if (!favorites.includes(gameId)) {
                    favorites.push(gameId);
                    localStorage.setItem('infinitePixels_favorites', JSON.stringify(favorites));
                    this.showMessage('Added to favorites!', 'success');
                    return true;
                }
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
            if (this.supabase) {
                // Online mode - remove from server
                const { error } = await this.supabase
                    .from('user_favorites')
                    .delete()
                    .eq('user_id', this.user.id)
                    .eq('game_id', gameId);

                if (error) throw error;

                // Also remove from local storage
                const favorites = JSON.parse(localStorage.getItem('infinitePixels_favorites') || '[]');
                const index = favorites.indexOf(gameId);
                if (index > -1) {
                    favorites.splice(index, 1);
                    localStorage.setItem('infinitePixels_favorites', JSON.stringify(favorites));
                }

                this.showMessage('Removed from favorites!', 'success');
                return true;
            } else {
                // Offline mode
                const favorites = JSON.parse(localStorage.getItem('infinitePixels_favorites') || '[]');
                const index = favorites.indexOf(gameId);
                if (index > -1) {
                    favorites.splice(index, 1);
                    localStorage.setItem('infinitePixels_favorites', JSON.stringify(favorites));
                    this.showMessage('Removed from favorites!', 'success');
                    return true;
                }
            }
        } catch (error) {
            console.error('Remove favorite error:', error);
            return false;
        }
    }

    async addToRecentGames(gameId) {
        // Always add to local storage for immediate feedback
        this.addToLocalRecentGames(gameId);

        // If online and logged in, sync to server
        if (this.supabase && this.session) {
            try {
                await this.supabase
                    .from('user_recent_games')
                    .upsert({
                        user_id: this.user.id,
                        game_id: gameId,
                        last_played: new Date().toISOString()
                    }, {
                        onConflict: 'user_id,game_id'
                    });
                
                console.log('✅ Recent game synced to server:', gameId);
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
            
            // Remove the game if it already exists
            recentGames = recentGames.filter(g => g.slug !== gameId);
            
            // Add the game to the beginning
            const gameWithTimestamp = {
                slug: gameId,
                lastPlayed: Date.now()
            };
            
            recentGames.unshift(gameWithTimestamp);
            
            // Keep only the most recent games
            if (recentGames.length > maxGames) {
                recentGames = recentGames.slice(0, maxGames);
            }
            
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
        let messageContainer = document.getElementById('authMessage');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'authMessage';
            messageContainer.className = 'auth-message';
            document.body.appendChild(messageContainer);
        }

        messageContainer.textContent = message;
        messageContainer.className = `auth-message ${type} show`;

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
        if (!this.supabase || !this.session) return;

        try {
            // Sync local recent games
            const localRecent = localStorage.getItem('infinitePixels_recentlyPlayed');
            if (localRecent) {
                const recentGames = JSON.parse(localRecent);
                console.log('Syncing recent games to server:', recentGames.length);
                
                for (const game of recentGames) {
                    await this.supabase
                        .from('user_recent_games')
                        .upsert({
                            user_id: this.user.id,
                            game_id: game.slug,
                            last_played: new Date(game.lastPlayed).toISOString()
                        }, {
                            onConflict: 'user_id,game_id'
                        });
                }
            }

            // Sync local favorites
            const localFavorites = localStorage.getItem('infinitePixels_favorites');
            if (localFavorites) {
                const favorites = JSON.parse(localFavorites);
                console.log('Syncing favorites to server:', favorites.length);
                
                for (const gameId of favorites) {
                    await this.supabase
                        .from('user_favorites')
                        .upsert({
                            user_id: this.user.id,
                            game_id: gameId
                        }, {
                            onConflict: 'user_id,game_id'
                        });
                }
            }

            console.log('✅ Local data synced to server successfully');
        } catch (error) {
            console.error('Error syncing local data to server:', error);
        }
    }

    async loadServerDataToDevice() {
        if (!this.supabase || !this.session) return;

        try {
            // Load recent games from server
            const { data: recentGames, error: recentError } = await this.supabase
                .from('user_recent_games')
                .select('game_id, last_played')
                .eq('user_id', this.user.id)
                .order('last_played', { ascending: false })
                .limit(24);

            if (!recentError && recentGames) {
                const formattedRecent = recentGames.map(game => ({
                    slug: game.game_id,
                    lastPlayed: new Date(game.last_played).getTime()
                }));
                
                // Merge with local data, keeping the most recent timestamps
                const localRecent = JSON.parse(localStorage.getItem('infinitePixels_recentlyPlayed') || '[]');
                const mergedRecent = this.mergeGameLists(localRecent, formattedRecent);
                
                localStorage.setItem('infinitePixels_recentlyPlayed', JSON.stringify(mergedRecent));
                console.log('✅ Recent games loaded from server:', recentGames.length);
            }

            // Load favorites from server
            const { data: favorites, error: favError } = await this.supabase
                .from('user_favorites')
                .select('game_id')
                .eq('user_id', this.user.id);

            if (!favError && favorites) {
                const serverFavorites = favorites.map(fav => fav.game_id);
                
                // Merge with local favorites
                const localFavorites = JSON.parse(localStorage.getItem('infinitePixels_favorites') || '[]');
                const mergedFavorites = [...new Set([...localFavorites, ...serverFavorites])];
                
                localStorage.setItem('infinitePixels_favorites', JSON.stringify(mergedFavorites));
                console.log('✅ Favorites loaded from server:', favorites.length);
            }

        } catch (error) {
            console.error('Error loading server data to device:', error);
        }
    }

    mergeGameLists(localGames, serverGames) {
        const gameMap = new Map();
        
        // Add local games first
        localGames.forEach(game => {
            gameMap.set(game.slug, game);
        });
        
        // Add or update with server games (keeping most recent timestamp)
        serverGames.forEach(game => {
            const existing = gameMap.get(game.slug);
            if (!existing || game.lastPlayed > existing.lastPlayed) {
                gameMap.set(game.slug, game);
            }
        });
        
        // Convert back to array and sort by lastPlayed (most recent first)
        return Array.from(gameMap.values())
            .sort((a, b) => b.lastPlayed - a.lastPlayed)
            .slice(0, 24); // Keep only the most recent 24 games
    }
}

// Initialize account system
const accountSystem = new AccountSystem();
