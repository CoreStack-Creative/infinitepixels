// Recent Games Page Manager
class RecentGamesPageManager {
    constructor() {
        this.games = [];
        this.recentGames = [];
        this.init();
    }

    async init() {
        // Load games data
        await this.loadGamesData();
        
        // Wait for account system to initialize
        setTimeout(() => {
            this.loadRecentGames();
        }, 500);
    }

    async loadGamesData() {
        try {
            const response = await fetch('games.json');
            this.games = await response.json();
        } catch (error) {
            console.error('Error loading games data:', error);
        }
    }

    async loadRecentGames() {
        const recentGamesGrid = document.getElementById('recentGamesGrid') || 
                                document.querySelector('.recent-games-grid') ||
                                document.querySelector('.games-grid');
        
        if (!recentGamesGrid) {
            console.error('Recent games container not found');
            return;
        }

        // Show loading state
        recentGamesGrid.innerHTML = `
            <div class="loading-recent">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading your recently played games...</p>
            </div>
        `;

        try {
            if (accountSystem && accountSystem.isLoggedIn()) {
                // User is logged in - load from server
                await this.loadServerRecentGames();
            } else {
                // User not logged in - load from localStorage
                this.loadLocalRecentGames();
            }
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
        }
    }

    async loadServerRecentGames() {
        const response = await fetch(`${accountSystem.baseURL}/user/recent-games`, {
            headers: accountSystem.getAuthHeaders()
        });

        if (response.ok) {
            this.recentGames = await response.json();
            this.renderRecentGames();
        } else {
            throw new Error('Failed to load recent games from server');
        }
    }

    loadLocalRecentGames() {
        try {
            const stored = localStorage.getItem('infinitePixels_recentlyPlayed');
            const localRecent = stored ? JSON.parse(stored) : [];
            
            // Convert local format to server format for consistency
            this.recentGames = localRecent.map(game => ({
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
            return;
        }

        // Create game cards for recent games
        const gameCards = this.recentGames.map(recentGame => {
            // Handle both server format (game_id) and local format (slug)
            const gameIdentifier = recentGame.game_id || recentGame.slug;
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
        const lastPlayed = new Date(recentGame.last_played);
        const timeAgo = this.getTimeAgo(lastPlayed);
        
        return `
            <div class="recent-game-card" data-game-id="${game.id || game.slug}">
                <div class="game-image-container">
                    <img src="${game.image}" alt="${game.name}" class="game-image">
                    <div class="game-overlay">
                        <button class="play-btn" title="Play Again">
                            <i class="fas fa-play"></i>
                            Play Again
                        </button>
                        <button class="favorite-btn ${this.isFavorited(game.id || game.slug) ? 'favorited' : ''}" title="Add to favorites">
                            <i class="${this.isFavorited(game.id || game.slug) ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                    </div>
                    <div class="last-played-badge">
                        <i class="fas fa-clock"></i>
                        ${timeAgo}
                    </div>
                </div>
                <div class="game-info">
                    <h3 class="game-title">${game.name}</h3>
                    <div class="game-meta">
                        <span class="game-category">${game.category}</span>
                        <span class="last-played-full">Last played: ${lastPlayed.toLocaleDateString()}</span>
                    </div>
                    ${game.description ? `<p class="game-description">${game.description}</p>` : ''}
                </div>
            </div>
        `;
    }

    isFavorited(gameId) {
        // Check both account-based and local favorites
        if (accountSystem && accountSystem.isLoggedIn()) {
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

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString();
    }

    addEventListeners() {
        // Add click handlers for game cards
        document.querySelectorAll('.recent-game-card').forEach(card => {
            const gameImage = card.querySelector('.game-image-container');
            const gameId = card.dataset.gameId;
            
            gameImage.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    this.playGame(gameId);
                }
            });
        });

        // Add click handlers for play buttons
        document.querySelectorAll('.recent-game-card .play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const gameId = btn.closest('.recent-game-card').dataset.gameId;
                this.playGame(gameId);
            });
        });

        // Add click handlers for favorite buttons
        document.querySelectorAll('.recent-game-card .favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const gameId = btn.closest('.recent-game-card').dataset.gameId;
                this.toggleFavorite(gameId, btn);
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
            
            if (accountSystem && accountSystem.isLoggedIn()) {
                // Use account system for favorites
                if (isFavorited) {
                    success = await accountSystem.removeFromFavorites(gameId);
                } else {
                    success = await accountSystem.addToFavorites(gameId);
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
                    
                    if (accountSystem) {
                        accountSystem.showMessage('Added to favorites!', 'success');
                    }
                }
            } else {
                // Remove from favorites
                const originalLength = favorites.length;
                favorites = favorites.filter(fav => fav.slug !== gameId);
                if (favorites.length < originalLength) {
                    localStorage.setItem('infinitepixels_favorites', JSON.stringify(favorites));
                    
                    if (accountSystem) {
                        accountSystem.showMessage('Removed from favorites!', 'success');
                    }
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error with local favorites:', error);
            if (accountSystem) {
                accountSystem.showMessage('Error updating favorites', 'error');
            }
            return false;
        }
    }

    playGame(gameId) {
        // Track as recently played (will update the timestamp)
        if (accountSystem) {
            accountSystem.addToRecentGames(gameId);
        } else if (window.recentlyPlayedManager) {
            // Fallback to global recently played manager
            window.recentlyPlayedManager.addGameToRecent(gameId);
        }

        // Navigate to game page or open game
        window.location.href = `game.html?id=${gameId}`;
    }

    showLoginMessage() {
        if (accountSystem) {
            accountSystem.showMessage('Please use the account button in the top navigation to log in', 'info');
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
            if (accountSystem && accountSystem.isLoggedIn()) {
                // For now, just clear local and reload - server endpoint would need to be created
                console.log('Server clear endpoint would be called here');
                // await fetch(`${accountSystem.baseURL}/user/recent-games`, { method: 'DELETE', headers: accountSystem.getAuthHeaders() });
            }

            // Reload the page to show empty state
            this.recentGames = [];
            this.renderRecentGames();
            
            if (accountSystem) {
                accountSystem.showMessage('Recent games cleared successfully!', 'success');
            } else {
                alert('Recent games cleared successfully!');
            }
        } catch (error) {
            console.error('Error clearing recent games:', error);
            if (accountSystem) {
                accountSystem.showMessage('Error clearing recent games', 'error');
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
