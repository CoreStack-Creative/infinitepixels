// Recent Games Page Manager
class RecentGamesPageManager {
    constructor() {
        this.games = [];
        this.recentGames = [];
        this.isLoading = false;
        this.hasLoaded = false;
        this.init();
    }

    async init() {
        // Load games data first
        await this.loadGamesData();
        
        // Setup clear history button
        this.setupClearHistoryButton();
        
        // Load recent games immediately
        this.loadRecentGames();
        
        // Also listen for account system changes
        if (window.accountSystem) {
            if (typeof window.accountSystem.onReady === 'function') {
                window.accountSystem.onReady(() => {
                    this.loadRecentGames();
                });
            }
        }
    }

    async loadGamesData() {
        try {
            const response = await fetch('games.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.games = await response.json();
        } catch (error) {
            console.error('Error loading games data:', error);
        }
    }

    setupClearHistoryButton() {
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                this.clearRecentGames();
            });
        }

        // Listen for recent games updates from other parts of the system
        window.addEventListener('recentGamesUpdated', (event) => {
            // Only refresh if we're not currently loading
            if (!this.isLoading) {
                this.loadRecentGames();
            }
        });

        // Listen for page visibility changes to refresh when user comes back
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.hasLoaded) {
                // Page became visible again, refresh recent games
                this.loadRecentGames();
            }
        });

        // Listen for focus events to refresh when window gets focus
        window.addEventListener('focus', () => {
            if (this.hasLoaded) {
                this.loadRecentGames();
            }
        });
    }

    // Public method that can be called by external systems
    refresh() {
        console.log('Refresh requested by external system');
        // Only refresh if we're not currently loading and it's been a reasonable time
        if (!this.isLoading) {
            this.loadRecentGames();
        }
    }

    async loadRecentGames() {
        // Prevent multiple simultaneous loads
        if (this.isLoading) {
            return;
        }
        
        this.isLoading = true;
        
        const recentGamesGrid = document.getElementById('recentGamesGrid') || 
                                document.querySelector('.recent-games-grid') ||
                                document.querySelector('.games-grid');
        
        if (!recentGamesGrid) {
            this.isLoading = false;
            return;
        }

        // Only show loading state if we haven't loaded before
        if (!this.hasLoaded) {
            recentGamesGrid.innerHTML = `
                <div class="loading-recent">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading your recently played games...</p>
                </div>
            `;
        }

        try {
            if (window.accountSystem && window.accountSystem.isLoggedIn()) {
                // User is logged in - load from server
                await this.loadServerRecentGames();
            } else {
                // User not logged in - load from localStorage
                this.loadLocalRecentGames();
            }
            this.hasLoaded = true;
        } catch (error) {
            console.error('Error loading recent games:', error);
            recentGamesGrid.innerHTML = `
                <div class="error-recent">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>Error Loading Recent Games</h2>
                    <p>There was an error loading your recently played games. Please try again.</p>
                    <button class="retry-btn" onclick="recentGamesManager.loadRecentGames()">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            `;
        } finally {
            this.isLoading = false;
        }
    }

    async loadServerRecentGames() {
        if (!window.accountSystem || !window.accountSystem.supabase) {
            throw new Error('Supabase not available');
        }

        try {
            const { data, error } = await window.accountSystem.supabase
                .from('user_recent_games')
                .select(`
                    game_id,
                    last_played
                `)
                .eq('user_id', window.accountSystem.user.id)
                .order('last_played', { ascending: false })
                .limit(24);

            if (error) {
                throw new Error(`Failed to load recent games: ${error.message}`);
            }

            // Filter out entries with invalid game_id values
            const validData = (data || []).filter(item => {
                const isValid = item.game_id && 
                               item.game_id !== 'undefined' && 
                               item.game_id !== 'null' && 
                               item.game_id.toString().trim() !== '';
                
                if (!isValid) {
                    console.warn('Filtering out invalid recent game entry:', item);
                }
                return isValid;
            });

            this.recentGames = validData;
            this.renderRecentGames();
        } catch (error) {
            console.error('Error loading server recent games:', error);
            throw error;
        }
    }

    loadLocalRecentGames() {
        try {
            const stored = localStorage.getItem('infinitePixels_recentlyPlayed');
            const localRecent = stored ? JSON.parse(stored) : [];
            
            if (localRecent.length === 0) {
                this.recentGames = [];
                this.renderRecentGames();
                return;
            }
            
            // Convert local format to server format for consistency and filter invalid entries
            this.recentGames = localRecent
                .filter(game => {
                    const isValid = game && 
                                   game.slug && 
                                   game.slug !== 'undefined' && 
                                   game.slug !== 'null' && 
                                   game.slug.toString().trim() !== '';
                    
                    if (!isValid) {
                        console.warn('Filtering out invalid local recent game entry:', game);
                    }
                    return isValid;
                })
                .map(game => ({
                    game_id: game.slug,
                    last_played: new Date(game.lastPlayed).toISOString()
                }));
            
            this.renderRecentGames();
        } catch (error) {
            console.error('Error loading local recent games:', error);
            this.recentGames = [];
            this.renderRecentGames();
        }
    }

    renderRecentGames() {
        const recentGamesGrid = document.getElementById('recentGamesGrid') || 
                                document.querySelector('.recent-games-grid') ||
                                document.querySelector('.games-grid');

        if (!recentGamesGrid) {
            return;
        }

        if (this.recentGames.length === 0) {
            recentGamesGrid.innerHTML = `
                <div class="no-recent-games">
                    <div class="no-recent-content">
                        <i class="fas fa-clock"></i>
                        <h2>No Recent Games</h2>
                        <p>You haven't played any games recently. Start playing to see them here!</p>
                        <a href="games.html" class="browse-games-btn">Browse Games</a>
                    </div>
                </div>
            `;
            
            // Also show the empty state from the HTML
            const emptyState = document.getElementById('emptyState');
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        // Hide empty state
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        // Create game cards for recent games
        const gameCards = this.recentGames.map(recentGame => {
            // Handle both server format (game_id) and local format (slug)
            const gameIdentifier = recentGame.game_id || recentGame.slug;
            
            // Skip entries with undefined/null/empty identifiers
            if (!gameIdentifier || gameIdentifier === 'undefined' || gameIdentifier === 'null') {
                console.warn('Skipping recent game with invalid identifier:', gameIdentifier, recentGame);
                return null;
            }
            
            const game = this.games.find(g => 
                g.id === gameIdentifier || 
                g.slug === gameIdentifier ||
                g.id === parseInt(gameIdentifier) // Handle numeric IDs
            );
            
            if (!game) {
                console.warn('Game not found for identifier:', gameIdentifier);
                return null;
            }

            return this.createGameCard(game, recentGame);
        }).filter(card => card !== null);

        recentGamesGrid.innerHTML = gameCards.join('');

        // Add event listeners
        this.addEventListeners();
    }

    createGameCard(game, recentGame) {
        // Get timestamp from recentGame object (either server or local format)
        const timestamp = recentGame.last_played ? new Date(recentGame.last_played).getTime() : recentGame.lastPlayed;
        const timeAgo = this.formatTimeAgo(timestamp);
        
        return `
            <div class="game-card" data-game-id="${game.slug}" onclick="window.location.href='game.html?game=${game.slug}'">
                <img src="${game.image}" alt="${game.name}" class="recent-game-image" 
                     onerror="this.src='images/placeholder-game.jpg'">
                <div class="game-info">
                    <h3 class="game-name">${game.name}</h3>
                    <div class="game-tags">
                        ${game.tags ? game.tags.map(tag => `<span class="game-tag">${tag}</span>`).join('') : ''}
                    </div>
                    <div class="last-played">
                        <i class="fas fa-clock"></i>
                        <span>Played ${timeAgo}</span>
                    </div>
                </div>
            </div>
        `;
    }

    isFavorited(gameId) {
        // Check both account-based and local favorites
        if (window.accountSystem && window.accountSystem.isLoggedIn()) {
            // For logged-in users, this would need to be populated from account favorites
            // For now, return false as this would need server data
            return false;
        } else {
            // Check local favorites
            try {
                const stored = localStorage.getItem('infinitepixels_favorites');
                const favorites = stored ? JSON.parse(stored) : [];
                return favorites.some(fav => fav.slug === gameId);
            } catch (error) {
                console.error('Error checking local favorites:', error);
                return false;
            }
        }
    }

    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        // For older dates, show actual date
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    }

    addEventListeners() {
        // Add click handlers for game cards (main card click)
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on buttons
                if (!e.target.closest('button')) {
                    const gameId = card.dataset.gameId;
                    if (gameId) {
                        this.playGame(gameId);
                    }
                }
            });
        });
    }

    async toggleFavorite(gameId, buttonElement) {
        const isFavorited = buttonElement.classList.contains('favorited');
        const heartIcon = buttonElement.querySelector('i');
        
        // Show loading state
        const originalIcon = heartIcon.className;
        heartIcon.className = 'fas fa-spinner fa-spin';
        buttonElement.disabled = true;

        try {
            let success = false;
            
            if (window.accountSystem && window.accountSystem.isLoggedIn()) {
                // Use account system for favorites
                if (isFavorited) {
                    success = await window.accountSystem.removeFromFavorites(gameId);
                } else {
                    success = await window.accountSystem.addToFavorites(gameId);
                }
            } else {
                // Use local storage for favorites
                success = this.toggleLocalFavorite(gameId, !isFavorited);
            }
            
            if (success) {
                if (isFavorited) {
                    buttonElement.classList.remove('favorited');
                    heartIcon.className = 'far fa-heart';
                } else {
                    buttonElement.classList.add('favorited');
                    heartIcon.className = 'fas fa-heart';
                }
            } else {
                heartIcon.className = originalIcon;
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            heartIcon.className = originalIcon;
        } finally {
            buttonElement.disabled = false;
        }
    }

    toggleLocalFavorite(gameId, addToFavorites) {
        try {
            const stored = localStorage.getItem('infinitepixels_favorites');
            let favorites = stored ? JSON.parse(stored) : [];
            
            if (addToFavorites) {
                // Add to favorites if not already there
                if (!favorites.some(fav => fav.slug === gameId)) {
                    favorites.push({
                        slug: gameId,
                        dateAdded: new Date().toISOString(),
                        timestamp: Date.now()
                    });
                    localStorage.setItem('infinitepixels_favorites', JSON.stringify(favorites));
                    
                    if (window.accountSystem) {
                        window.accountSystem.showMessage('Added to favorites!', 'success');
                    }
                }
            } else {
                // Remove from favorites
                const originalLength = favorites.length;
                favorites = favorites.filter(fav => fav.slug !== gameId);
                if (favorites.length < originalLength) {
                    localStorage.setItem('infinitepixels_favorites', JSON.stringify(favorites));
                    
                    if (window.accountSystem) {
                        window.accountSystem.showMessage('Removed from favorites!', 'success');
                    }
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error with local favorites:', error);
            if (window.accountSystem) {
                window.accountSystem.showMessage('Error updating favorites', 'error');
            }
            return false;
        }
    }

    playGame(gameId) {
        // Track as recently played (will update the timestamp)
        if (window.accountSystem) {
            window.accountSystem.addToRecentGames(gameId);
        } else if (window.recentlyPlayedManager) {
            // Fallback to global recently played manager
            window.recentlyPlayedManager.addGameToRecent(gameId);
        }

        // Navigate to game page or open game
        window.location.href = `game.html?game=${gameId}`;
    }

    showLoginMessage() {
        if (window.accountSystem) {
            window.accountSystem.showMessage('Please use the account button in the top navigation to log in', 'info');
        } else {
            alert('Please refresh the page and use the account button to log in');
        }
    }

    async clearRecentGames() {
        if (!confirm('Are you sure you want to clear all recently played games?')) {
            return;
        }

        try {
            // Clear local storage
            localStorage.removeItem('infinitePixels_recentlyPlayed');

            // If logged in, also clear server data
            if (window.accountSystem && window.accountSystem.isLoggedIn() && window.accountSystem.supabase) {
                const { error } = await window.accountSystem.supabase
                    .from('user_recent_games')
                    .delete()
                    .eq('user_id', window.accountSystem.user.id);
                
                if (error) {
                    console.error('Error clearing server recent games:', error);
                } else {
                    console.log('✅ Server recent games cleared');
                }
            }

            // Reload the page to show empty state
            this.recentGames = [];
            this.renderRecentGames();
            
            if (window.accountSystem) {
                window.accountSystem.showMessage('Recent games cleared successfully!', 'success');
            } else {
                alert('Recent games cleared successfully!');
            }
        } catch (error) {
            console.error('Error clearing recent games:', error);
            if (window.accountSystem) {
                window.accountSystem.showMessage('Error clearing recent games', 'error');
            } else {
                alert('Error clearing recent games');
            }
        }
    }
}

// Initialize recent games manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.recentGamesManager = new RecentGamesPageManager();
});

// Debug functions for browser console
window.debugRecentGames = function() {
    console.log('🔍 Recent Games Debug Information');
    console.log('================================');
    
    if (window.recentGamesManager) {
        console.log('✅ Recent Games Manager exists');
        console.log('📊 Recent games count:', window.recentGamesManager.recentGames ? window.recentGamesManager.recentGames.length : 'N/A');
        console.log('📋 Recent games data:', window.recentGamesManager.recentGames);
        console.log('🎮 Games database loaded:', window.recentGamesManager.games ? window.recentGamesManager.games.length : 'N/A');
    } else {
        console.log('❌ Recent Games Manager not found');
    }
    
    // Check localStorage
    const localRecent = localStorage.getItem('infinitePixels_recentlyPlayed');
    if (localRecent) {
        try {
            const parsed = JSON.parse(localRecent);
            console.log('💾 Local storage recent games:', parsed.length);
            console.log('💾 Local storage data:', parsed);
        } catch (e) {
            console.log('❌ Error parsing local storage data:', e);
        }
    } else {
        console.log('💾 No local storage recent games found');
    }
    
    // Check if user is logged in
    if (window.accountSystem) {
        console.log('👤 User logged in:', window.accountSystem.isLoggedIn());
        console.log('👤 User ID:', window.accountSystem.user?.id || 'N/A');
    }
};

// Function to manually refresh recent games
window.refreshRecentGames = function() {
    if (window.recentGamesManager) {
        console.log('🔄 Refreshing recent games...');
        window.recentGamesManager.loadRecentGames();
    } else {
        console.log('❌ Recent Games Manager not found');
    }
};
