// Account Page JavaScript
class AccountPageManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Wait for account system to be ready
        if (window.accountSystem) {
            accountSystem.onReady(() => {
                this.currentUser = accountSystem.user;
                this.loadAccountPage();
            });
        } else {
            // Fallback for when account system isn't loaded yet
            setTimeout(() => {
                if (window.accountSystem) {
                    accountSystem.onReady(() => {
                        this.currentUser = accountSystem.user;
                        this.loadAccountPage();
                    });
                } else {
                    console.error('Account system not available');
                    this.loadAccountPage();
                }
            }, 100);
        }
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
                        <div class="password-info">
                            <p><i class="fas fa-info-circle"></i> Password changes are managed through Supabase authentication.</p>
                        </div>
                        <form id="changePasswordForm" onsubmit="accountPageManager.changePassword(event)">
                            <div class="password-form">
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
                                    <span class="stat-number favorites-count" id="favoritesCount">-</span>
                                    <span class="stat-label">Favorites</span>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="stat-info">
                                    <span class="stat-number time-played-count" id="timePlayedCount">-</span>
                                    <span class="stat-label">Time Played</span>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-gamepad"></i>
                                </div>
                                <div class="stat-info">
                                    <span class="stat-number games-played-count" id="gamesPlayedCount">-</span>
                                    <span class="stat-label">Games Played</span>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-star"></i>
                                </div>
                                <div class="stat-info">
                                    <span class="stat-number reviews-count" id="reviewsCount">-</span>
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
                            <button class="delete-account-btn" onclick="accountPageManager.deleteAccount()">
                                <i class="fas fa-trash-alt"></i>
                                Delete Account
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
            if (!accountSystem.user) {
                console.log('No user logged in');
                return;
            }

            // Get favorites count
            const favorites = accountSystem.getStoredData('favorites') || [];
            
            // Get recent games count and calculate time played
            const recentGames = accountSystem.getStoredData('recentGames') || [];
            const gameSession = accountSystem.getStoredData('gameSession') || {};
            
            // Calculate total time played (in minutes)
            let totalTimeMinutes = 0;
            
            // Add time from game sessions
            if (gameSession.totalPlayTime) {
                totalTimeMinutes += Math.floor(gameSession.totalPlayTime / 60000); // Convert from ms to minutes
            }
            
            // Add estimated time from recent games (assume 5 minutes per game session if no specific time recorded)
            recentGames.forEach(game => {
                if (game.playTime) {
                    totalTimeMinutes += Math.floor(game.playTime / 60000);
                } else {
                    totalTimeMinutes += 5; // Default 5 minutes per game
                }
            });
            
            // Format time played
            let timePlayedText = '';
            if (totalTimeMinutes < 60) {
                timePlayedText = `${totalTimeMinutes}m`;
            } else {
                const hours = Math.floor(totalTimeMinutes / 60);
                const minutes = totalTimeMinutes % 60;
                timePlayedText = `${hours}h ${minutes}m`;
            }
            
            // Get reviews count from local storage and Supabase if available
            let reviewsCount = 0;
            const localReviews = accountSystem.getStoredData('userReviews') || [];
            reviewsCount = localReviews.length;
            
            // Try to get reviews from Supabase if available
            if (accountSystem.supabase && accountSystem.user.id) {
                try {
                    const { data: reviews, error } = await accountSystem.supabase
                        .from('reviews')
                        .select('id')
                        .eq('user_id', accountSystem.user.id);
                    
                    if (!error && reviews) {
                        reviewsCount = Math.max(reviewsCount, reviews.length);
                    }
                } catch (dbError) {
                    console.log('Could not fetch reviews from database:', dbError);
                }
            }
            
            // Calculate unique games played
            const uniqueGames = new Set();
            recentGames.forEach(game => {
                if (game.id || game.name) {
                    uniqueGames.add(game.id || game.name);
                }
            });
            
            // Update UI with stats
            const statsContainer = document.querySelector('.stats-grid');
            if (statsContainer) {
                const favoritesCountElement = statsContainer.querySelector('.favorites-count');
                const timePlayedElement = statsContainer.querySelector('.time-played-count');
                const gamesPlayedCountElement = statsContainer.querySelector('.games-played-count');
                const reviewsCountElement = statsContainer.querySelector('.reviews-count');
                
                if (favoritesCountElement) {
                    favoritesCountElement.textContent = favorites.length;
                }
                
                if (timePlayedElement) {
                    timePlayedElement.textContent = timePlayedText;
                }
                
                if (gamesPlayedCountElement) {
                    gamesPlayedCountElement.textContent = uniqueGames.size;
                }
                
                if (reviewsCountElement) {
                    reviewsCountElement.textContent = reviewsCount;
                }
            }
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

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showMessage('Please select an image file', 'error');
            return;
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            this.showMessage('File size must be less than 2MB', 'error');
            return;
        }

        // Show loading state
        const changeBtn = document.querySelector('.change-avatar-btn');
        const originalText = changeBtn.innerHTML;
        changeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        changeBtn.disabled = true;

        try {
            if (!accountSystem.supabase) {
                this.showMessage('Profile images require account sync. Please enable online mode.', 'error');
                return;
            }

            // Get current user
            const user = accountSystem.user;
            if (!user || !user.id) {
                this.showMessage('User not found. Please log in again.', 'error');
                return;
            }

            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

            // Remove old avatar if exists
            if (user.profile_image_url) {
                const oldFileName = user.profile_image_url.split('/').pop();
                if (oldFileName) {
                    await accountSystem.supabase.storage
                        .from('avatars')
                        .remove([`${user.id}/${oldFileName}`]);
                }
            }

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await accountSystem.supabase.storage
                .from('avatars')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                this.showMessage('Error uploading image: ' + uploadError.message, 'error');
                return;
            }

            // Get public URL
            const { data: urlData } = accountSystem.supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            const publicUrl = urlData.publicUrl;

            // Update user profile in database
            const { error: updateError } = await accountSystem.supabase
                .from('users')
                .update({ profile_image_url: publicUrl })
                .eq('id', user.id);

            if (updateError) {
                console.error('Database update error:', updateError);
                this.showMessage('Error updating profile: ' + updateError.message, 'error');
                return;
            }

            // Update local user data and UI
            accountSystem.user.profile_image_url = publicUrl;
            
            // Update the current avatar display
            const currentAvatar = document.querySelector('.current-avatar');
            currentAvatar.innerHTML = `<img src="${publicUrl}" alt="Profile Picture" class="profile-pic">`;
            
            // Refresh the user profile to ensure consistency
            await accountSystem.refreshUserProfile();
            
            // Re-render the account interface to show remove button
            this.renderAccountInterface();
            
            this.showMessage('Profile picture updated successfully!', 'success');

        } catch (error) {
            console.error('Upload error:', error);
            this.showMessage('Error uploading image: ' + error.message, 'error');
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
            if (!accountSystem.supabase) {
                this.showMessage('Profile images require account sync. Please enable online mode.', 'error');
                return;
            }

            const user = accountSystem.user;
            if (!user || !user.id) {
                this.showMessage('User not found. Please log in again.', 'error');
                return;
            }

            // Remove from Supabase Storage if exists
            if (user.profile_image_url) {
                const fileName = user.profile_image_url.split('/').pop();
                if (fileName) {
                    await accountSystem.supabase.storage
                        .from('avatars')
                        .remove([`${user.id}/${fileName}`]);
                }
            }

            // Update user profile in database
            const { error: updateError } = await accountSystem.supabase
                .from('users')
                .update({ profile_image_url: null })
                .eq('id', user.id);

            if (updateError) {
                console.error('Database update error:', updateError);
                this.showMessage('Error updating profile: ' + updateError.message, 'error');
                return;
            }

            // Update local user data and UI
            accountSystem.user.profile_image_url = null;
            
            // Update UI
            const currentAvatar = document.querySelector('.current-avatar');
            currentAvatar.innerHTML = `<div class="default-avatar">${user.username.charAt(0).toUpperCase()}</div>`;
            
            // Refresh the user profile to ensure consistency
            await accountSystem.refreshUserProfile();
            
            this.showMessage('Profile picture removed', 'success');
            
            // Re-render to update buttons
            this.renderAccountInterface();

        } catch (error) {
            console.error('Remove avatar error:', error);
            this.showMessage('Error removing image: ' + error.message, 'error');
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
            if (!accountSystem.supabase) {
                this.showMessage('Profile updates require account sync. Please enable online mode.', 'error');
                return;
            }

            const user = accountSystem.user;
            if (!user || !user.id) {
                this.showMessage('User not found. Please log in again.', 'error');
                return;
            }

            // Update user profile in database
            const { error: updateError } = await accountSystem.supabase
                .from('users')
                .update({ username: newUsername })
                .eq('id', user.id);

            if (updateError) {
                console.error('Database update error:', updateError);
                this.showMessage('Error updating username: ' + updateError.message, 'error');
                usernameInput.value = accountSystem.user.username; // Reset to original
                return;
            }

            // Update local user data and UI
            accountSystem.user.username = newUsername;
            accountSystem.updateAccountUI();
            this.showMessage('Username updated successfully!', 'success');
            this.disableUsernameEdit();

        } catch (error) {
            console.error('Update username error:', error);
            this.showMessage('Error updating username: ' + error.message, 'error');
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
            if (!accountSystem.supabase) {
                this.showMessage('Password changes require account sync. Please enable online mode.', 'error');
                return;
            }

            // Use Supabase auth to update password
            const { error } = await accountSystem.supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                console.error('Password change error:', error);
                this.showMessage('Error changing password: ' + error.message, 'error');
            } else {
                this.showMessage('Password changed successfully!', 'success');
                document.getElementById('changePasswordForm').reset();
            }

        } catch (error) {
            console.error('Change password error:', error);
            this.showMessage('Error changing password: ' + error.message, 'error');
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

    async deleteAccount() {
        // First confirmation
        const firstConfirm = confirm('⚠️ WARNING: This will permanently delete your account and all associated data. This action cannot be undone. Are you sure you want to continue?');
        
        if (!firstConfirm) {
            return;
        }

        // Second confirmation with username verification
        const username = accountSystem.user?.username || '';
        const confirmText = prompt(`To confirm account deletion, please type your username: "${username}"`);
        
        if (confirmText !== username) {
            this.showMessage('Username confirmation failed. Account deletion cancelled.', 'error');
            return;
        }

        // Third and final confirmation
        const finalConfirm = confirm('FINAL WARNING: This will immediately and permanently delete your account. Click OK to proceed with deletion.');
        
        if (!finalConfirm) {
            return;
        }

        try {
            if (!accountSystem.supabase) {
                this.showMessage('Account deletion requires online connection. Please enable online mode.', 'error');
                return;
            }

            const user = accountSystem.user;
            if (!user || !user.id) {
                this.showMessage('User not found. Please log in again.', 'error');
                return;
            }

            this.showMessage('Deleting account... Please wait.', 'info');

            // Delete user's avatar from storage if exists
            if (user.profile_image_url) {
                const fileName = user.profile_image_url.split('/').pop();
                if (fileName) {
                    await accountSystem.supabase.storage
                        .from('avatars')
                        .remove([`${user.id}/${fileName}`]);
                }
            }

            // Delete user's reviews
            const { error: reviewsError } = await accountSystem.supabase
                .from('reviews')
                .delete()
                .eq('user_id', user.id);

            if (reviewsError) {
                console.error('Error deleting reviews:', reviewsError);
            }

            // Delete user profile from database
            const { error: deleteError } = await accountSystem.supabase
                .from('users')
                .delete()
                .eq('id', user.id);

            if (deleteError) {
                console.error('Database deletion error:', deleteError);
                this.showMessage('Error deleting account: ' + deleteError.message, 'error');
                return;
            }

            // Delete auth user
            const { error: authError } = await accountSystem.supabase.auth.admin.deleteUser(user.id);
            
            if (authError) {
                console.error('Auth deletion error:', authError);
                // Continue anyway as the profile is deleted
            }

            // Clear all local data
            accountSystem.clearAllUserData();
            accountSystem.logout();

            this.showMessage('Account permanently deleted. Redirecting to homepage...', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        } catch (error) {
            console.error('Delete account error:', error);
            this.showMessage('Error deleting account: ' + error.message, 'error');
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
