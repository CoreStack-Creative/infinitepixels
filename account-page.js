// Account Page JavaScript
class AccountPageManager {
    constructor() {
        this.currentUser = null;
        this.baseURL = 'http://localhost:3000';
        this.init();
    }

    init() {
        // Wait for account system to initialize
        setTimeout(() => {
            this.currentUser = accountSystem.user;
            this.loadAccountPage();
        }, 100);
    }

    loadAccountPage() {
        const accountContent = document.getElementById('accountContent');
        
        if (!accountSystem.isLoggedIn()) {
            // User not logged in
            accountContent.innerHTML = `
                <div class="not-logged-in">
                    <div class="not-logged-in-icon">
                        <i class="fas fa-user-slash"></i>
                    </div>
                    <h2>Please Log In</h2>
                    <p>You need to be logged in to access your account page.</p>
                    <button class="login-redirect-btn" onclick="this.showLoginPrompt()">
                        <i class="fas fa-sign-in-alt"></i>
                        Log In Now
                    </button>
                </div>
            `;
            return;
        }

        // User is logged in, show account interface
        this.renderAccountInterface();
    }

    renderAccountInterface() {
        const accountContent = document.getElementById('accountContent');
        const user = accountSystem.user;

        accountContent.innerHTML = `
            <div class="account-sections">
                <!-- Profile Section -->
                <div class="account-section">
                    <div class="section-header">
                        <h2><i class="fas fa-user"></i> Profile Information</h2>
                    </div>
                    <div class="section-content">
                        <div class="profile-avatar-section">
                            <div class="current-avatar">
                                ${user.profile_image_url ? 
                                    `<img src="${user.profile_image_url}" alt="Profile Picture" class="profile-pic">` :
                                    `<div class="default-avatar">${user.username.charAt(0).toUpperCase()}</div>`
                                }
                            </div>
                            <div class="avatar-controls">
                                <input type="file" id="avatarUpload" accept="image/*" style="display: none;">
                                <button class="change-avatar-btn" onclick="accountPageManager.selectAvatar()">
                                    <i class="fas fa-camera"></i>
                                    Change Photo
                                </button>
                                ${user.profile_image_url ? 
                                    `<button class="remove-avatar-btn" onclick="accountPageManager.removeAvatar()">
                                        <i class="fas fa-trash"></i>
                                        Remove
                                    </button>` : ''
                                }
                            </div>
                        </div>

                        <div class="profile-info">
                            <div class="info-group">
                                <label>Username</label>
                                <div class="input-with-edit">
                                    <input type="text" id="usernameInput" value="${user.username}" disabled>
                                    <button class="edit-btn" onclick="accountPageManager.enableUsernameEdit()">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="info-group">
                                <label>Email</label>
                                <input type="email" value="${user.email}" disabled>
                                <small class="help-text">Email cannot be changed. Contact support if needed.</small>
                            </div>
                            
                            <div class="info-group">
                                <label>Member Since</label>
                                <input type="text" value="${new Date(user.created_at).toLocaleDateString()}" disabled>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Password Section -->
                <div class="account-section">
                    <div class="section-header">
                        <h2><i class="fas fa-lock"></i> Password & Security</h2>
                    </div>
                    <div class="section-content">
                        <form id="changePasswordForm" onsubmit="accountPageManager.changePassword(event)">
                            <div class="password-form">
                                <div class="info-group">
                                    <label>Current Password</label>
                                    <input type="password" id="currentPassword" required>
                                </div>
                                
                                <div class="info-group">
                                    <label>New Password</label>
                                    <input type="password" id="newPassword" minlength="6" required>
                                    <small class="help-text">Minimum 6 characters</small>
                                </div>
                                
                                <div class="info-group">
                                    <label>Confirm New Password</label>
                                    <input type="password" id="confirmPassword" minlength="6" required>
                                </div>
                                
                                <button type="submit" class="change-password-btn">
                                    <i class="fas fa-key"></i>
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Account Stats Section -->
                <div class="account-section">
                    <div class="section-header">
                        <h2><i class="fas fa-chart-bar"></i> Account Statistics</h2>
                    </div>
                    <div class="section-content">
                        <div class="stats-grid" id="accountStats">
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-heart"></i>
                                </div>
                                <div class="stat-info">
                                    <span class="stat-number" id="favoritesCount">-</span>
                                    <span class="stat-label">Favorites</span>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="stat-info">
                                    <span class="stat-number" id="recentGamesCount">-</span>
                                    <span class="stat-label">Games Played</span>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-star"></i>
                                </div>
                                <div class="stat-info">
                                    <span class="stat-number" id="reviewsCount">-</span>
                                    <span class="stat-label">Reviews Written</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions Section -->
                <div class="account-section">
                    <div class="section-header">
                        <h2><i class="fas fa-bolt"></i> Quick Actions</h2>
                    </div>
                    <div class="section-content">
                        <div class="quick-actions">
                            <a href="favorites.html" class="action-btn">
                                <i class="fas fa-heart"></i>
                                <span>View Favorites</span>
                            </a>
                            <a href="recent.html" class="action-btn">
                                <i class="fas fa-clock"></i>
                                <span>Recent Games</span>
                            </a>
                            <a href="game-reviews.html" class="action-btn">
                                <i class="fas fa-star"></i>
                                <span>My Reviews</span>
                            </a>
                            <a href="settings.html" class="action-btn">
                                <i class="fas fa-cog"></i>
                                <span>Settings</span>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Danger Zone -->
                <div class="account-section danger-section">
                    <div class="section-header">
                        <h2><i class="fas fa-exclamation-triangle"></i> Account Actions</h2>
                    </div>
                    <div class="section-content">
                        <div class="danger-actions">
                            <button class="danger-btn" onclick="accountPageManager.confirmLogout()">
                                <i class="fas fa-sign-out-alt"></i>
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Setup avatar upload listener
        document.getElementById('avatarUpload').addEventListener('change', (e) => {
            this.handleAvatarUpload(e);
        });

        // Load account stats
        this.loadAccountStats();
    }

    async loadAccountStats() {
        try {
            // Load favorites count
            const favoritesResponse = await fetch(`${this.baseURL}/user/favorites`, {
                headers: accountSystem.getAuthHeaders()
            });
            if (favoritesResponse.ok) {
                const favorites = await favoritesResponse.json();
                document.getElementById('favoritesCount').textContent = favorites.length;
            }

            // Load recent games count
            const recentResponse = await fetch(`${this.baseURL}/user/recent-games`, {
                headers: accountSystem.getAuthHeaders()
            });
            if (recentResponse.ok) {
                const recentGames = await recentResponse.json();
                document.getElementById('recentGamesCount').textContent = recentGames.length;
            }

            // Load reviews count (placeholder - you might need to add this endpoint)
            document.getElementById('reviewsCount').textContent = '0';

        } catch (error) {
            console.error('Error loading account stats:', error);
        }
    }

    selectAvatar() {
        document.getElementById('avatarUpload').click();
    }

    async handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            this.showMessage('File size must be less than 5MB', 'error');
            return;
        }

        // Show loading state
        const changeBtn = document.querySelector('.change-avatar-btn');
        const originalText = changeBtn.innerHTML;
        changeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        changeBtn.disabled = true;

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${this.baseURL}/user/upload-avatar`, {
                method: 'POST',
                headers: accountSystem.getAuthHeaders(),
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // Update the UI with new avatar
                const currentAvatar = document.querySelector('.current-avatar');
                currentAvatar.innerHTML = `<img src="${data.profile_image_url}" alt="Profile Picture" class="profile-pic">`;
                
                // Update account system user data
                accountSystem.user.profile_image_url = data.profile_image_url;
                accountSystem.updateAccountUI();
                
                this.showMessage('Profile picture updated successfully!', 'success');
            } else {
                this.showMessage(data.error, 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showMessage('Error uploading image', 'error');
        } finally {
            changeBtn.innerHTML = originalText;
            changeBtn.disabled = false;
        }
    }

    async removeAvatar() {
        if (!confirm('Are you sure you want to remove your profile picture?')) {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...accountSystem.getAuthHeaders()
                },
                body: JSON.stringify({ profile_image_url: null })
            });

            if (response.ok) {
                // Update UI
                const currentAvatar = document.querySelector('.current-avatar');
                const user = accountSystem.user;
                currentAvatar.innerHTML = `<div class="default-avatar">${user.username.charAt(0).toUpperCase()}</div>`;
                
                // Update account system user data
                accountSystem.user.profile_image_url = null;
                accountSystem.updateAccountUI();
                
                this.showMessage('Profile picture removed', 'success');
                
                // Re-render to update buttons
                this.renderAccountInterface();
            } else {
                const data = await response.json();
                this.showMessage(data.error, 'error');
            }
        } catch (error) {
            console.error('Remove avatar error:', error);
            this.showMessage('Error removing image', 'error');
        }
    }

    enableUsernameEdit() {
        const usernameInput = document.getElementById('usernameInput');
        const editBtn = usernameInput.parentElement.querySelector('.edit-btn');
        
        usernameInput.disabled = false;
        usernameInput.focus();
        usernameInput.select();
        
        editBtn.innerHTML = '<i class="fas fa-check"></i>';
        editBtn.onclick = () => this.saveUsername();
        
        // Add cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.innerHTML = '<i class="fas fa-times"></i>';
        cancelBtn.onclick = () => this.cancelUsernameEdit();
        editBtn.parentElement.appendChild(cancelBtn);
    }

    async saveUsername() {
        const usernameInput = document.getElementById('usernameInput');
        const newUsername = usernameInput.value.trim();
        
        if (!newUsername || newUsername.length < 3) {
            this.showMessage('Username must be at least 3 characters', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...accountSystem.getAuthHeaders()
                },
                body: JSON.stringify({ username: newUsername })
            });

            const data = await response.json();

            if (response.ok) {
                accountSystem.user.username = newUsername;
                accountSystem.updateAccountUI();
                this.showMessage('Username updated successfully!', 'success');
                this.disableUsernameEdit();
            } else {
                this.showMessage(data.error, 'error');
                usernameInput.value = accountSystem.user.username; // Reset to original
            }
        } catch (error) {
            console.error('Update username error:', error);
            this.showMessage('Error updating username', 'error');
            usernameInput.value = accountSystem.user.username; // Reset to original
        }
    }

    cancelUsernameEdit() {
        const usernameInput = document.getElementById('usernameInput');
        usernameInput.value = accountSystem.user.username; // Reset to original
        this.disableUsernameEdit();
    }

    disableUsernameEdit() {
        const usernameInput = document.getElementById('usernameInput');
        const editBtn = usernameInput.parentElement.querySelector('.edit-btn');
        const cancelBtn = usernameInput.parentElement.querySelector('.cancel-btn');
        
        usernameInput.disabled = true;
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.onclick = () => this.enableUsernameEdit();
        
        if (cancelBtn) {
            cancelBtn.remove();
        }
    }

    async changePassword(event) {
        event.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            this.showMessage('New passwords do not match', 'error');
            return;
        }

        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Changing...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${this.baseURL}/user/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...accountSystem.getAuthHeaders()
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('Password changed successfully!', 'success');
                document.getElementById('changePasswordForm').reset();
            } else {
                this.showMessage(data.error, 'error');
            }
        } catch (error) {
            console.error('Change password error:', error);
            this.showMessage('Error changing password', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    confirmLogout() {
        if (confirm('Are you sure you want to log out?')) {
            accountSystem.logout();
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    showLoginPrompt() {
        this.showMessage('Please use the account button in the top bar to log in', 'info');
    }

    showMessage(message, type = 'info') {
        accountSystem.showMessage(message, type);
    }
}

// Initialize account page manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.accountPageManager = new AccountPageManager();
});
