// Account System JavaScript with Supabase Integration
class AccountSystem {
    constructor() {
        this.user = null;
        this.session = null;
        this.isReady = false;
        this.readyCallbacks = [];
        
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
            // Get username from user metadata or default to email prefix
            const username = user.user_metadata?.username || user.email.split('@')[0];
            
            const { data, error } = await this.supabase
                .from('users')
                .insert([
                    {
                        id: user.id,
                        username: username,
                        email: user.email,
                        email_verified: user.email_confirmed_at ? true : false
                    }
                ])
                .select()
                .single();

            if (!error && data) {
                this.user = data;
                console.log('✅ User profile created:', data);
            } else if (error) {
                console.error('Error creating user profile:', error);
                // If it's a username conflict, try with a random suffix
                if (error.code === '23505') {
                    const randomUsername = username + '_' + Math.floor(Math.random() * 1000);
                    const { data: retryData, error: retryError } = await this.supabase
                        .from('users')
                        .insert([
                            {
                                id: user.id,
                                username: randomUsername,
                                email: user.email,
                                email_verified: user.email_confirmed_at ? true : false
                            }
                        ])
                        .select()
                        .single();
                    
                    if (!retryError && retryData) {
                        this.user = retryData;
                        console.log('✅ User profile created with modified username:', retryData);
                    }
                }
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
        try {
            // If user is logged in with Supabase, sync to server
            if (this.supabase && this.user && this.session) {
                const { error } = await this.supabase
                    .from('user_favorites')
                    .upsert({
                        user_id: this.user.id,
                        game_id: gameId
                    }, {
                        onConflict: 'user_id,game_id'
                    });

                if (error) throw error;
                console.log('✅ Favorite saved to server:', gameId);
            }

            // Always save to local storage (works for both logged-in and offline users)
            let favorites = JSON.parse(localStorage.getItem('infinitepixels_favorites') || '[]');
            
            // Normalize favorites to simple strings
            favorites = favorites.map(item => {
                if (typeof item === 'string') {
                    try {
                        const parsed = JSON.parse(item);
                        return parsed.slug || item;
                    } catch (e) {
                        return item;
                    }
                } else if (item && item.slug) {
                    return item.slug;
                }
                return item;
            });
            
            // Remove duplicates and add new favorite
            favorites = [...new Set(favorites)];
            if (!favorites.includes(gameId)) {
                favorites.push(gameId);
                localStorage.setItem('infinitepixels_favorites', JSON.stringify(favorites));
                console.log('✅ Favorite saved locally:', gameId);
            }

            // Trigger a custom event to notify other components
            window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
                detail: { 
                    action: 'added', 
                    gameId: gameId,
                    favorites: favorites 
                } 
            }));

            this.showMessage('Added to favorites!', 'success');
            return true;

        } catch (error) {
            console.error('Add favorite error:', error);
            this.showMessage('Error adding to favorites', 'error');
            return false;
        }
    }

    async removeFromFavorites(gameId) {
        try {
            console.log('🗑️ Removing favorite:', gameId);
            console.log('  User logged in:', !!(this.supabase && this.user && this.session));
            console.log('  User ID:', this.user?.id);
            
            // If user is logged in with Supabase, remove from server
            if (this.supabase && this.user && this.session) {
                console.log('  Attempting to remove from server...');
                const { error } = await this.supabase
                    .from('user_favorites')
                    .delete()
                    .eq('user_id', this.user.id)
                    .eq('game_id', gameId);

                if (error) {
                    console.error('❌ Server removal failed:', error);
                    throw error;
                }
                console.log('✅ Favorite removed from server:', gameId);
            } else {
                console.log('  Skipping server removal (not logged in)');
            }

            // Always remove from local storage (works for both logged-in and offline users)
            let favorites = JSON.parse(localStorage.getItem('infinitepixels_favorites') || '[]');
            console.log('  Local favorites before removal:', favorites);
            
            // Normalize favorites to simple strings
            favorites = favorites.map(item => {
                if (typeof item === 'string') {
                    try {
                        const parsed = JSON.parse(item);
                        return parsed.slug || item;
                    } catch (e) {
                        return item;
                    }
                } else if (item && item.slug) {
                    return item.slug;
                }
                return item;
            });
            
            // Remove duplicates and remove target favorite
            favorites = [...new Set(favorites)];
            const index = favorites.indexOf(gameId);
            console.log('  Index of game to remove:', index);
            
            if (index > -1) {
                favorites.splice(index, 1);
                localStorage.setItem('infinitepixels_favorites', JSON.stringify(favorites));
                console.log('✅ Favorite removed locally:', gameId);
                console.log('  Local favorites after removal:', favorites);
            } else {
                console.log('⚠️ Game not found in local favorites:', gameId);
            }

            // Clean up any legacy favorite storage keys that might cause conflicts
            this.cleanupLegacyFavoriteStorage(gameId);

            // Trigger a custom event to notify other components
            window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
                detail: { 
                    action: 'removed', 
                    gameId: gameId,
                    favorites: favorites 
                } 
            }));

            this.showMessage('Removed from favorites!', 'success');
            return true;

        } catch (error) {
            console.error('Remove favorite error:', error);
            return false;
        }
    }

    // Helper method to clean up legacy favorite storage
    cleanupLegacyFavoriteStorage(gameId) {
        try {
            // Check and clean up other potential favorite storage keys
            const legacyKeys = ['userFavorites', 'favorites', 'infinitepixels_offline_favorites'];
            
            legacyKeys.forEach(key => {
                const stored = localStorage.getItem(key);
                if (stored) {
                    try {
                        let legacyFavorites = JSON.parse(stored);
                        if (Array.isArray(legacyFavorites)) {
                            // Remove the game from legacy storage too
                            const originalLength = legacyFavorites.length;
                            legacyFavorites = legacyFavorites.filter(item => {
                                if (typeof item === 'string') {
                                    return item !== gameId;
                                } else if (item && item.slug) {
                                    return item.slug !== gameId;
                                }
                                return true;
                            });
                            
                            if (legacyFavorites.length !== originalLength) {
                                localStorage.setItem(key, JSON.stringify(legacyFavorites));
                                console.log(`🧹 Cleaned up legacy favorite from ${key}:`, gameId);
                            }
                        }
                    } catch (e) {
                        console.log(`⚠️ Could not parse legacy favorites in ${key}:`, e);
                    }
                }
            });
        } catch (error) {
            console.error('Error cleaning up legacy favorite storage:', error);
        }
    }

    async addToRecentGames(gameId) {
        // Validate gameId before processing
        if (!gameId || gameId === 'undefined' || gameId === 'null' || typeof gameId !== 'string' || gameId.trim() === '') {
            console.warn('addToRecentGames called with invalid gameId:', gameId);
            return;
        }

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

        // Notify recent games page if it exists
        if (window.recentGamesManager) {
            window.recentGamesManager.refresh();
        }

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('recentGamesUpdated', { 
            detail: { 
                action: 'added', 
                gameId: gameId 
            } 
        }));
    }

    addToLocalRecentGames(gameId) {
        try {
            // Additional validation for gameId
            if (!gameId || gameId === 'undefined' || gameId === 'null' || typeof gameId !== 'string' || gameId.trim() === '') {
                console.warn('addToLocalRecentGames called with invalid gameId:', gameId);
                return;
            }

            const storageKey = 'infinitePixels_recentlyPlayed';
            const maxGames = 24;
            
            let recentGames = [];
            const stored = localStorage.getItem(storageKey);
            
            if (stored) {
                recentGames = JSON.parse(stored);
                
                // Filter out any invalid entries that might exist
                recentGames = recentGames.filter(game => 
                    game && 
                    game.slug && 
                    game.slug !== 'undefined' && 
                    game.slug !== 'null' && 
                    typeof game.slug === 'string' && 
                    game.slug.trim() !== ''
                );
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
                
                // Filter out invalid entries before syncing
                const validRecentGames = recentGames.filter(game => 
                    game && 
                    game.slug && 
                    game.slug !== 'undefined' && 
                    game.slug !== 'null' && 
                    typeof game.slug === 'string' && 
                    game.slug.trim() !== ''
                );
                
                console.log('📤 Syncing recent games to server:', validRecentGames.length);
                
                for (const game of validRecentGames) {
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
                
                // Update localStorage with cleaned data if we filtered anything out
                if (validRecentGames.length !== recentGames.length) {
                    console.log(`🧹 Cleaned local recent games: ${recentGames.length} -> ${validRecentGames.length}`);
                    localStorage.setItem('infinitePixels_recentlyPlayed', JSON.stringify(validRecentGames));
                }
            }

            // Debug: Check all localStorage keys for favorites
            console.log('🔍 DEBUG: Checking localStorage for favorites...');
            console.log('  infinitepixels_favorites:', localStorage.getItem('infinitepixels_favorites'));
            console.log('  infinitepixels_offline_favorites:', localStorage.getItem('infinitepixels_offline_favorites'));
            console.log('  userFavorites:', localStorage.getItem('userFavorites'));
            console.log('  favorites:', localStorage.getItem('favorites'));
            
            // Check what keys exist in localStorage
            const allKeys = Object.keys(localStorage).filter(key => key.toLowerCase().includes('favorite'));
            console.log('  All favorite-related keys:', allKeys);
            
            // Check each key's value
            console.log('🔍 DETAILED CHECK: All favorite storage keys and values:');
            allKeys.forEach(key => {
                const value = localStorage.getItem(key);
                console.log(`  ${key}:`, value);
                if (value && value !== 'null' && value !== '[]') {
                    try {
                        const parsed = JSON.parse(value);
                        console.log(`    -> Parsed ${key}:`, parsed, `(${Array.isArray(parsed) ? parsed.length : 'not array'} items)`);
                    } catch (e) {
                        console.log(`    -> Raw ${key}:`, value);
                    }
                }
            });

            // Sync local favorites
            const localFavorites = localStorage.getItem('infinitepixels_favorites');
            console.log('📤 Syncing favorites to server:', localFavorites ? JSON.parse(localFavorites).length : 0);
            console.log('  Favorites to sync:', localFavorites ? JSON.parse(localFavorites) : []);
            
            if (localFavorites) {
                const rawFavorites = JSON.parse(localFavorites);
                
                // Normalize favorites - extract just the game IDs/slugs
                const normalizedFavorites = [];
                rawFavorites.forEach(item => {
                    if (typeof item === 'string') {
                        try {
                            // Try parsing if it's a JSON string
                            const parsed = JSON.parse(item);
                            if (parsed.slug) {
                                normalizedFavorites.push(parsed.slug);
                            } else {
                                // It's just a plain game ID
                                normalizedFavorites.push(item);
                            }
                        } catch (e) {
                            // It's just a plain game ID
                            normalizedFavorites.push(item);
                        }
                    } else if (item && item.slug) {
                        // It's an object with slug property
                        normalizedFavorites.push(item.slug);
                    } else if (typeof item === 'string') {
                        // It's a plain string game ID
                        normalizedFavorites.push(item);
                    }
                });
                
                // Remove duplicates
                const uniqueFavorites = [...new Set(normalizedFavorites)];
                console.log('🔧 Normalized favorites for sync:', uniqueFavorites);
                
                // Update localStorage with clean format
                localStorage.setItem('infinitepixels_favorites', JSON.stringify(uniqueFavorites));
                
                // Sync to server
                for (const gameId of uniqueFavorites) {
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

            console.log('✅ Favorites synced successfully');
            
            // Run cleanup to remove any invalid entries that might exist on server
            await this.cleanupInvalidServerEntries();
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
                // Filter out invalid entries from server data
                const validRecentGames = recentGames.filter(game => 
                    game && 
                    game.game_id && 
                    game.game_id !== 'undefined' && 
                    game.game_id !== 'null' && 
                    typeof game.game_id === 'string' && 
                    game.game_id.trim() !== ''
                );
                
                if (validRecentGames.length !== recentGames.length) {
                    console.warn(`🧹 Filtered out ${recentGames.length - validRecentGames.length} invalid recent games from server`);
                }
                
                const formattedRecent = validRecentGames.map(game => ({
                    slug: game.game_id,
                    lastPlayed: new Date(game.last_played).getTime()
                }));
                
                // Merge with local data, keeping the most recent timestamps
                const localRecent = JSON.parse(localStorage.getItem('infinitePixels_recentlyPlayed') || '[]');
                const mergedRecent = this.mergeGameLists(localRecent, formattedRecent);
                
                localStorage.setItem('infinitePixels_recentlyPlayed', JSON.stringify(mergedRecent));
                console.log('✅ Recent games loaded from server:', validRecentGames.length);
            }

            // Load favorites from server
            const { data: favorites, error: favError } = await this.supabase
                .from('user_favorites')
                .select('game_id')
                .eq('user_id', this.user.id);

            if (!favError && favorites) {
                const serverFavorites = favorites.map(fav => fav.game_id);
                console.log('✅ Favorites loaded from server:', serverFavorites.length);
                console.log('  Server favorites:', serverFavorites);
                
                // Get and normalize local favorites
                let localFavorites = JSON.parse(localStorage.getItem('infinitepixels_favorites') || '[]');
                
                // Normalize local favorites to simple strings
                localFavorites = localFavorites.map(item => {
                    if (typeof item === 'string') {
                        try {
                            const parsed = JSON.parse(item);
                            return parsed.slug || item;
                        } catch (e) {
                            return item;
                        }
                    } else if (item && item.slug) {
                        return item.slug;
                    }
                    return item;
                });
                
                console.log('  Local favorites before merge:', localFavorites);
                
                // Merge and remove duplicates - keep only simple game ID strings
                const mergedFavorites = [...new Set([...localFavorites, ...serverFavorites])];
                console.log('  Merged favorites (cleaned):', mergedFavorites);
                
                // Store clean format
                localStorage.setItem('infinitepixels_favorites', JSON.stringify(mergedFavorites));
            }

        } catch (error) {
            console.error('Error loading server data to device:', error);
        }
    }

    mergeGameLists(localGames, serverGames) {
        const gameMap = new Map();
        
        // Helper function to validate game entry
        const isValidGame = (game) => {
            return game && 
                   game.slug && 
                   game.slug !== 'undefined' && 
                   game.slug !== 'null' && 
                   typeof game.slug === 'string' && 
                   game.slug.trim() !== '';
        };
        
        // Add local games first (with validation)
        localGames.filter(isValidGame).forEach(game => {
            gameMap.set(game.slug, game);
        });
        
        // Add or update with server games (keeping most recent timestamp)
        serverGames.filter(isValidGame).forEach(game => {
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

    // Add this new method to check if a game is favorited
    isFavorited(gameId) {
        let favorites = JSON.parse(localStorage.getItem('infinitepixels_favorites') || '[]');
        
        // Normalize favorites to simple strings
        favorites = favorites.map(item => {
            if (typeof item === 'string') {
                try {
                    const parsed = JSON.parse(item);
                    return parsed.slug || item;
                } catch (e) {
                    return item;
                }
            } else if (item && item.slug) {
                return item.slug;
            }
            return item;
        });
        
        return favorites.includes(gameId);
    }

    // Add this method to get all local favorites
    getLocalFavorites() {
        let favorites = JSON.parse(localStorage.getItem('infinitepixels_favorites') || '[]');
        
        // Normalize favorites to simple strings
        favorites = favorites.map(item => {
            if (typeof item === 'string') {
                try {
                    const parsed = JSON.parse(item);
                    return parsed.slug || item;
                } catch (e) {
                    return item;
                }
            } else if (item && item.slug) {
                return item.slug;
            }
            return item;
        });
        
        return [...new Set(favorites)]; // Remove duplicates
    }

    // Debug method to check current state of favorites
    debugFavorites() {
        console.log('🔍 DEBUG: Current favorites state:');
        console.log('  localStorage infinitepixels_favorites:', localStorage.getItem('infinitepixels_favorites'));
        console.log('  Account system user:', this.user?.username);
        console.log('  Account system logged in:', this.isLoggedIn());
        console.log('  Supabase available:', !!this.supabase);
        
        // Check other storage keys
        const allKeys = Object.keys(localStorage).filter(key => key.toLowerCase().includes('favorite'));
        console.log('  All favorite-related keys:', allKeys);
        allKeys.forEach(key => {
            console.log(`    ${key}:`, localStorage.getItem(key));
        });
        
        // Check if favoritesManager is available
        console.log('  window.favoritesManager:', !!window.favoritesManager);
        if (window.favoritesManager) {
            console.log('  favoritesManager.favorites:', window.favoritesManager.favorites);
        }
    }

    // Add method to refresh user profile (including profile image)
    async refreshUserProfile() {
        if (!this.supabase || !this.session) return;

        try {
            const { data: profile, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', this.session.user?.id)
                .single();
            
            if (!error && profile) {
                // Update local user data
                this.user = profile;
                
                // Update stored session with fresh user data
                const sessionData = localStorage.getItem('infinitepixels_session');
                if (sessionData) {
                    const session = JSON.parse(sessionData);
                    const updatedSession = { ...session, user: this.user };
                    localStorage.setItem('infinitepixels_session', JSON.stringify(updatedSession));
                    this.session = updatedSession;
                }
                
                // Update UI everywhere
                this.updateAccountUI();
                
                // Trigger custom event for other components to update
                window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
                    detail: { user: this.user } 
                }));
                
                console.log('✅ User profile refreshed');
            }
        } catch (error) {
            console.error('Error refreshing user profile:', error);
        }
    }

    // Add cleanup function for server database
    async cleanupInvalidServerEntries() {
        if (!this.supabase || !this.session) {
            console.log('Cannot cleanup: not logged in or no Supabase connection');
            return;
        }

        try {
            console.log('🧹 Starting cleanup of invalid server entries...');
            
            // Clean up recent games with invalid game_id
            const { data: invalidRecent, error: recentError } = await this.supabase
                .from('user_recent_games')
                .select('id, game_id')
                .eq('user_id', this.user.id)
                .or('game_id.is.null,game_id.eq.undefined,game_id.eq.null');

            if (!recentError && invalidRecent && invalidRecent.length > 0) {
                console.log(`🗑️ Found ${invalidRecent.length} invalid recent game entries`);
                
                const idsToDelete = invalidRecent.map(entry => entry.id);
                const { error: deleteError } = await this.supabase
                    .from('user_recent_games')
                    .delete()
                    .in('id', idsToDelete);

                if (!deleteError) {
                    console.log(`✅ Cleaned up ${invalidRecent.length} invalid recent game entries`);
                } else {
                    console.error('Error deleting invalid recent games:', deleteError);
                }
            }

            // Clean up favorites with invalid game_id
            const { data: invalidFavorites, error: favError } = await this.supabase
                .from('user_favorites')
                .select('id, game_id')
                .eq('user_id', this.user.id)
                .or('game_id.is.null,game_id.eq.undefined,game_id.eq.null');

            if (!favError && invalidFavorites && invalidFavorites.length > 0) {
                console.log(`🗑️ Found ${invalidFavorites.length} invalid favorite entries`);
                
                const idsToDelete = invalidFavorites.map(entry => entry.id);
                const { error: deleteError } = await this.supabase
                    .from('user_favorites')
                    .delete()
                    .in('id', idsToDelete);

                if (!deleteError) {
                    console.log(`✅ Cleaned up ${invalidFavorites.length} invalid favorite entries`);
                } else {
                    console.error('Error deleting invalid favorites:', deleteError);
                }
            }

            console.log('🎉 Server cleanup completed');
            
            // Refresh recent games page after cleanup
            if (window.recentGamesManager) {
                window.recentGamesManager.loadRecentGames();
            }
        } catch (error) {
            console.error('Error during server cleanup:', error);
        }
    }
}

// Initialize account system
const accountSystem = new AccountSystem();

// Make account system available globally
window.accountSystem = accountSystem;

// Debug function to manually clean up invalid server entries (call from browser console)
window.debugCleanupServer = async function() {
    if (window.accountSystem && window.accountSystem.cleanupInvalidServerEntries) {
        console.log('🔧 Manual server cleanup requested...');
        await window.accountSystem.cleanupInvalidServerEntries();
        console.log('✅ Manual cleanup completed');
    } else {
        console.log('❌ Account system not available or cleanup function not found');
    }
};
