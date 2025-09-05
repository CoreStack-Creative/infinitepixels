// Favorites Page Manager
class FavoritesPageManager {
    constructor() {
        this.games = [];
        this.favorites = [];
        this.init();
    }

    async init() {
        // Load games data
        await this.loadGamesData();
        
        // Wait for account system to be ready
        if (window.accountSystem) {
            accountSystem.onReady(() => {
                this.loadFavorites();
            });
        } else {
            // Fallback for when account system isn't loaded yet
            setTimeout(() => {
                if (window.accountSystem) {
                    accountSystem.onReady(() => {
                        this.loadFavorites();
                    });
                } else {
                    console.error('Account system not available');
                    this.loadFavorites();
                }
            }, 100);
        }
    }

    async loadGamesData() {
        try {
            const response = await fetch('games.json');
            this.games = await response.json();
        } catch (error) {
            console.error('Error loading games data:', error);
        }
    }

    async loadFavorites() {
        console.log('🔍 Loading favorites...');
        const favoritesGrid = document.getElementById('favoritesGrid');
        const noFavorites = document.getElementById('noFavorites');

        if (!accountSystem || !accountSystem.isLoggedIn()) {
            console.log('❌ User not logged in');
            // User not logged in
            favoritesGrid.innerHTML = `
                <div class="not-logged-in-favorites">
                    <div class="login-prompt">
                        <i class="fas fa-user-lock"></i>
                        <h2>Please Log In</h2>
                        <p>You need to be logged in to view your favorite games.</p>
                        <button class="login-btn" onclick="favoritesManager.showLoginMessage()">
                            Log In to View Favorites
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        console.log('✅ User is logged in, fetching favorites...');
        console.log('🔗 Account system base URL:', accountSystem.baseURL);
        console.log('🔑 Auth headers:', accountSystem.getAuthHeaders());

        // Show loading state
        favoritesGrid.innerHTML = `
            <div class="loading-favorites">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading your favorite games...</p>
            </div>
        `;

        try {
            console.log('🚀 Making request to:', `${accountSystem.baseURL}/user/favorites`);
            const response = await fetch(`${accountSystem.baseURL}/user/favorites`, {
                headers: accountSystem.getAuthHeaders()
            });

            console.log('📥 Response status:', response.status);
            
            if (response.ok) {
                this.favorites = await response.json();
                console.log('✅ Favorites loaded successfully:', this.favorites);
                this.renderFavorites();
            } else {
                const errorText = await response.text();
                console.error('❌ Response error:', response.status, errorText);
                throw new Error('Failed to load favorites');
            }
        } catch (error) {
            console.error('💥 Error loading favorites:', error);
            favoritesGrid.innerHTML = `
                <div class="error-favorites">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>Error Loading Favorites</h2>
                    <p>There was an error loading your favorite games. Please try again.</p>
                    <button class="retry-btn" onclick="favoritesManager.loadFavorites()">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    renderFavorites() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        const noFavorites = document.getElementById('noFavorites');

        if (this.favorites.length === 0) {
            favoritesGrid.style.display = 'none';
            noFavorites.style.display = 'block';
            return;
        }

        favoritesGrid.style.display = 'grid';
        noFavorites.style.display = 'none';

        // Create game cards for favorites
        const gameCards = this.favorites.map(favorite => {
            const game = this.games.find(g => g.id === favorite.game_id);
            if (!game) return null;

            return this.createGameCard(game, favorite);
        }).filter(card => card !== null);

        favoritesGrid.innerHTML = gameCards.join('');

        // Add event listeners
        this.addEventListeners();
    }

    createGameCard(game, favorite) {
        const addedDate = new Date(favorite.created_at).toLocaleDateString();
        
        return `
            <div class="favorite-game-card" data-game-id="${game.id}">
                <div class="game-image-container">
                    <img src="${game.image}" alt="${game.name}" class="game-image">
                    <div class="game-overlay">
                        <button class="play-btn" onclick="favoritesManager.playGame('${game.id}')">
                            <i class="fas fa-play"></i>
                            Play Now
                        </button>
                        <button class="remove-favorite-btn" onclick="favoritesManager.removeFavorite('${game.id}', this)" title="Remove from favorites">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="game-info">
                    <h3 class="game-title">${game.name}</h3>
                    <div class="game-meta">
                        <span class="game-category">${game.category}</span>
                        <span class="added-date">Added ${addedDate}</span>
                    </div>
                    ${game.description ? `<p class="game-description">${game.description}</p>` : ''}
                </div>
            </div>
        `;
    }

    addEventListeners() {
        // Add click handlers for game cards
        document.querySelectorAll('.favorite-game-card').forEach(card => {
            const gameImage = card.querySelector('.game-image-container');
            const gameId = card.dataset.gameId;
            
            gameImage.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    this.playGame(gameId);
                }
            });
        });
    }

    async removeFavorite(gameId, buttonElement) {
        if (!confirm('Remove this game from your favorites?')) {
            return;
        }

        // Show loading state
        const originalIcon = buttonElement.innerHTML;
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        buttonElement.disabled = true;

        try {
            const success = await accountSystem.removeFromFavorites(gameId);
            
            if (success) {
                // Remove the card from the DOM with animation
                const gameCard = buttonElement.closest('.favorite-game-card');
                gameCard.style.transform = 'scale(0.8)';
                gameCard.style.opacity = '0';
                
                setTimeout(() => {
                    gameCard.remove();
                    
                    // Update favorites array
                    this.favorites = this.favorites.filter(fav => fav.game_id !== gameId);
                    
                    // Check if no favorites left
                    if (this.favorites.length === 0) {
                        document.getElementById('favoritesGrid').style.display = 'none';
                        document.getElementById('noFavorites').style.display = 'block';
                    }
                }, 300);
            } else {
                // Reset button state on error
                buttonElement.innerHTML = originalIcon;
                buttonElement.disabled = false;
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            buttonElement.innerHTML = originalIcon;
            buttonElement.disabled = false;
        }
    }

    playGame(gameId) {
        // Track as recently played
        if (accountSystem && accountSystem.isLoggedIn()) {
            accountSystem.addToRecentGames(gameId);
        }

        // Navigate to game page or open game
        // This depends on your existing game playing implementation
        window.location.href = `game.html?id=${gameId}`;
    }

    showLoginMessage() {
        accountSystem.showMessage('Please use the account button in the top navigation to log in', 'info');
    }
}

// Initialize favorites manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.favoritesManager = new FavoritesPageManager();
});
