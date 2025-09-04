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

        if (!accountSystem || !accountSystem.isLoggedIn()) {
            // User not logged in
            recentGamesGrid.innerHTML = `
                <div class="not-logged-in-recent">
                    <div class="login-prompt">
                        <i class="fas fa-user-lock"></i>
                        <h2>Please Log In</h2>
                        <p>You need to be logged in to view your recently played games.</p>
                        <button class="login-btn" onclick="this.showLoginMessage()">
                            Log In to View Recent Games
                        </button>
                    </div>
                </div>
            `;
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
            const response = await fetch(`${accountSystem.baseURL}/user/recent-games`, {
                headers: accountSystem.getAuthHeaders()
            });

            if (response.ok) {
                this.recentGames = await response.json();
                this.renderRecentGames();
            } else {
                throw new Error('Failed to load recent games');
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
            const game = this.games.find(g => g.id === recentGame.game_id);
            if (!game) return null;

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
            <div class="recent-game-card" data-game-id="${game.id}">
                <div class="game-image-container">
                    <img src="${game.image}" alt="${game.name}" class="game-image">
                    <div class="game-overlay">
                        <button class="play-btn" onclick="this.playGame('${game.id}')">
                            <i class="fas fa-play"></i>
                            Play Again
                        </button>
                        <button class="favorite-btn ${this.isFavorited(game.id) ? 'favorited' : ''}" onclick="this.toggleFavorite('${game.id}', this)" title="Add to favorites">
                            <i class="${this.isFavorited(game.id) ? 'fas' : 'far'} fa-heart"></i>
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
        // This would need to be loaded from favorites - simplified for now
        return false;
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
    }

    async toggleFavorite(gameId, buttonElement) {
        const isFavorited = buttonElement.classList.contains('favorited');
        const heartIcon = buttonElement.querySelector('i');
        
        // Show loading state
        const originalIcon = heartIcon.className;
        heartIcon.className = 'fas fa-spinner fa-spin';
        buttonElement.disabled = true;

        try {
            let success;
            if (isFavorited) {
                success = await accountSystem.removeFromFavorites(gameId);
                if (success) {
                    buttonElement.classList.remove('favorited');
                    heartIcon.className = 'far fa-heart';
                }
            } else {
                success = await accountSystem.addToFavorites(gameId);
                if (success) {
                    buttonElement.classList.add('favorited');
                    heartIcon.className = 'fas fa-heart';
                }
            }
            
            if (!success) {
                heartIcon.className = originalIcon;
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            heartIcon.className = originalIcon;
        } finally {
            buttonElement.disabled = false;
        }
    }

    playGame(gameId) {
        // Track as recently played (will update the timestamp)
        if (accountSystem && accountSystem.isLoggedIn()) {
            accountSystem.addToRecentGames(gameId);
        }

        // Navigate to game page or open game
        window.location.href = `game.html?id=${gameId}`;
    }

    showLoginMessage() {
        accountSystem.showMessage('Please use the account button in the top navigation to log in', 'info');
    }

    async clearRecentGames() {
        if (!confirm('Are you sure you want to clear all recently played games?')) {
            return;
        }

        try {
            // This would require a new API endpoint to clear recent games
            // For now, we'll just show a message
            accountSystem.showMessage('Feature coming soon!', 'info');
        } catch (error) {
            console.error('Error clearing recent games:', error);
            accountSystem.showMessage('Error clearing recent games', 'error');
        }
    }
}

// Initialize recent games manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.recentGamesManager = new RecentGamesPageManager();
});
