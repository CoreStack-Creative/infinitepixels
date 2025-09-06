// AI Recommendations Engine - Client-side Implementation
class AIRecommendationsEngine {
    constructor() {
        this.baseURL = 'http://localhost:3000';
        this.recommendations = [];
        this.allGames = [];
        this.userProfile = null;
        this.modelCache = new Map();
        this.isInitialized = false;
        this.init();
    }

    async init() {
        // Wait for dependencies
        await this.waitForDependencies();
        
        // Load initial data
        await this.loadGamesData();
        
        // Initialize user profile if logged in
        if (accountSystem.isLoggedIn()) {
            await this.initializeUserProfile();
        }
        
        this.isInitialized = true;
        console.log('🤖 AI Recommendations Engine initialized');
    }

    async waitForDependencies() {
        return new Promise((resolve) => {
            const checkDependencies = () => {
                if (typeof accountSystem !== 'undefined') {
                    setTimeout(resolve, 100);
                } else {
                    setTimeout(checkDependencies, 100);
                }
            };
            checkDependencies();
        });
    }

    async loadGamesData() {
        try {
            const response = await fetch('/games.json');
            if (response.ok) {
                this.allGames = await response.json();
                console.log(`📊 Loaded ${this.allGames.length} games for AI analysis`);
            }
        } catch (error) {
            console.error('Error loading games data:', error);
            // Fallback to empty array
            this.allGames = [];
        }
    }

    async initializeUserProfile() {
        try {
            const response = await fetch(`${this.baseURL}/ai/profile`, {
                headers: accountSystem.getAuthHeaders()
            });
            
            if (response.ok) {
                this.userProfile = await response.json();
                console.log('👤 User AI profile loaded');
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    // ===== MAIN RECOMMENDATION GENERATION ===== //
    async generateRecommendations(options = {}) {
        if (!accountSystem.isLoggedIn()) {
            console.log('🔒 User not logged in, using fallback recommendations');
            this.recommendations = this.generateFallbackRecommendations();
            return this.recommendations;
        }

        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...accountSystem.getAuthHeaders()
                },
                body: JSON.stringify({
                    count: options.count || 20,
                    categories: options.categories || null,
                    algorithm: options.algorithm || 'hybrid',
                    diversityFactor: options.diversityFactor || 0.3
                })
            };

            const response = await fetch(`${this.baseURL}/ai/recommendations`, requestOptions);
            
            if (response.ok) {
                const data = await response.json();
                this.recommendations = data.recommendations;
                
                // Store recommendations locally for offline access
                this.storeRecommendationsLocally(this.recommendations);
                
                console.log(`🎯 Generated ${this.recommendations.length} AI recommendations`);
                return this.recommendations;
            } else {
                console.error('Failed to generate recommendations, using fallback');
                this.recommendations = this.generateFallbackRecommendations();
                return this.recommendations;
            }
        } catch (error) {
            console.error('Error generating recommendations:', error);
            this.recommendations = this.generateFallbackRecommendations();
            return this.recommendations;
        }
    }

    generateFallbackRecommendations() {
        // Generate basic recommendations based on popular games and categories
        const categories = ['action', 'puzzle', 'strategy', 'arcade', 'adventure'];
        const fallbackRecs = [];

        categories.forEach((category, index) => {
            const categoryGames = this.allGames
                .filter(game => game.category?.toLowerCase() === category)
                .sort((a, b) => (b.plays || 0) - (a.plays || 0))
                .slice(0, 4);

            categoryGames.forEach((game, gameIndex) => {
                fallbackRecs.push({
                    game_id: game.id || game.slug,
                    recommendation_score: 0.8 - (index * 0.1) - (gameIndex * 0.05),
                    model_confidence: 0.6,
                    reasoning: `Popular ${category} game`,
                    algorithm_used: 'popularity_fallback',
                    category: category
                });
            });
        });

        return fallbackRecs.slice(0, 20);
    }

    // ===== RECOMMENDATION FILTERING & SORTING ===== //
    getTopRecommendations(count = 10) {
        return this.recommendations
            .sort((a, b) => b.recommendation_score - a.recommendation_score)
            .slice(0, count);
    }

    getRecommendationsByCategory(category, count = 12) {
        return this.recommendations
            .filter(rec => {
                const game = this.allGames.find(g => g.id === rec.game_id);
                return game && game.category?.toLowerCase() === category.toLowerCase();
            })
            .sort((a, b) => b.recommendation_score - a.recommendation_score)
            .slice(0, count);
    }

    getRecommendationsByConfidence(minConfidence = 0.7) {
        return this.recommendations
            .filter(rec => rec.model_confidence >= minConfidence)
            .sort((a, b) => b.model_confidence - a.model_confidence);
    }

    getDiverseRecommendations(count = 10) {
        const diverseRecs = [];
        const usedCategories = new Set();

        // First pass: one from each category
        this.recommendations
            .sort((a, b) => b.recommendation_score - a.recommendation_score)
            .forEach(rec => {
                const game = this.allGames.find(g => g.id === rec.game_id);
                if (game && !usedCategories.has(game.category)) {
                    diverseRecs.push(rec);
                    usedCategories.add(game.category);
                }
            });

        // Second pass: fill remaining slots with highest scores
        const remaining = count - diverseRecs.length;
        const remainingRecs = this.recommendations
            .filter(rec => !diverseRecs.includes(rec))
            .sort((a, b) => b.recommendation_score - a.recommendation_score)
            .slice(0, remaining);

        return [...diverseRecs, ...remainingRecs].slice(0, count);
    }

    // ===== RECOMMENDATION RENDERING ===== //
    renderRecommendations(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        const {
            title = 'Recommendations',
            showReasons = false,
            showFeedback = false,
            maxCount = 12,
            layout = 'grid'
        } = options;

        const recommendations = this.getTopRecommendations(maxCount);
        
        if (recommendations.length === 0) {
            this.renderEmptyState(container);
            return;
        }

        const html = `
            <div class="ai-recommendations-section">
                ${title ? `<h3 class="recommendations-title">${title}</h3>` : ''}
                <div class="ai-recommendations-${layout}">
                    ${recommendations.map(rec => this.renderRecommendationCard(rec, { showReasons, showFeedback })).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
        
        // Setup event listeners for the new content
        this.setupRecommendationListeners(container);
    }

    renderRecommendationCard(recommendation, options = {}) {
        const game = this.allGames.find(g => g.id === recommendation.game_id);
        if (!game) return '';

        const { showReasons, showFeedback } = options;
        const confidencePercent = Math.round(recommendation.model_confidence * 100);
        const scoreOutOfTen = Math.round(recommendation.recommendation_score * 10);

        return `
            <div class="ai-game-card" data-game-id="${game.id}" data-recommendation-id="${recommendation.id || ''}">
                <div class="ai-game-image-container">
                    <img src="${game.image}" alt="${game.name}" class="ai-game-image" loading="lazy">
                    <div class="ai-game-overlay">
                        <button class="ai-play-btn" onclick="aiRecommendations.playRecommendedGame('${game.id}')">
                            <i class="fas fa-play"></i>
                        </button>
                        <div class="ai-score">${scoreOutOfTen}/10</div>
                        <div class="ai-confidence">${confidencePercent}% match</div>
                    </div>
                </div>
                
                <div class="ai-game-info">
                    <h3>${game.name}</h3>
                    <div class="ai-game-category">${game.category}</div>
                    
                    ${showReasons ? `
                        <div class="ai-recommendation-reason">
                            <i class="fas fa-lightbulb"></i>
                            ${recommendation.reasoning || 'Recommended based on your preferences'}
                        </div>
                    ` : ''}
                    
                    <div class="ai-game-meta">
                        <span class="algorithm-badge">${this.getAlgorithmLabel(recommendation.algorithm_used)}</span>
                        <span class="confidence-badge" style="color: ${this.getConfidenceColor(recommendation.model_confidence)}">
                            ${confidencePercent}% confident
                        </span>
                    </div>
                    
                    ${showFeedback ? `
                        <div class="ai-feedback-section">
                            <div class="star-rating" data-game-id="${game.id}">
                                ${[1,2,3,4,5].map(rating => `
                                    <span class="star-rating-star" data-rating="${rating}">
                                        <i class="fas fa-star"></i>
                                    </span>
                                `).join('')}
                            </div>
                            <button class="feedback-details-btn" onclick="aiRecommendationsPage.showFeedbackModal('${game.id}')">
                                <i class="fas fa-comment"></i>
                                Tell us more
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderEmptyState(container) {
        container.innerHTML = `
            <div class="ai-empty-recommendations">
                <div class="empty-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <h3>Learning Your Preferences</h3>
                <p>Play a few games to help our AI understand what you like!</p>
                <button class="browse-games-btn" onclick="window.location.href='/games.html'">
                    <i class="fas fa-gamepad"></i>
                    Browse Games
                </button>
            </div>
        `;
    }

    setupRecommendationListeners(container) {
        // Track recommendation views
        const cards = container.querySelectorAll('.ai-game-card');
        cards.forEach((card, index) => {
            const gameId = card.dataset.gameId;
            
            // Track when recommendation comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.trackRecommendationView(gameId, index);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(card);
        });
    }

    // ===== GAME INTERACTION HANDLING ===== //
    async playRecommendedGame(gameId) {
        // Track the click
        this.trackRecommendationClick(gameId);
        
        // Find the game
        const game = this.allGames.find(g => g.id === gameId);
        if (!game) {
            console.error('Game not found:', gameId);
            return;
        }

        // Add to recent games
        if (accountSystem.isLoggedIn()) {
            accountSystem.addToRecentGames(gameId);
        }

        // Track with AI tracking system
        if (window.aiTracking) {
            aiTracking.startGameSession(gameId);
        }

        // Navigate to game or open in new window
        if (game.url) {
            window.open(game.url, '_blank');
        } else {
            window.location.href = `game.html?id=${gameId}`;
        }
    }

    async trackRecommendationView(gameId, position) {
        if (!accountSystem.isLoggedIn()) return;

        try {
            await fetch(`${this.baseURL}/ai/track-view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...accountSystem.getAuthHeaders()
                },
                body: JSON.stringify({
                    game_id: gameId,
                    position: position,
                    timestamp: Date.now(),
                    context: 'recommendation_view'
                })
            });
        } catch (error) {
            console.error('Error tracking recommendation view:', error);
        }
    }

    async trackRecommendationClick(gameId) {
        if (!accountSystem.isLoggedIn()) return;

        try {
            await fetch(`${this.baseURL}/ai/track-click`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...accountSystem.getAuthHeaders()
                },
                body: JSON.stringify({
                    game_id: gameId,
                    timestamp: Date.now(),
                    context: 'recommendation_click'
                })
            });
        } catch (error) {
            console.error('Error tracking recommendation click:', error);
        }
    }

    // ===== FEEDBACK HANDLING ===== //
    async submitFeedback(gameId, rating, feedbackData = {}) {
        if (!accountSystem.isLoggedIn()) {
            console.log('User not logged in, cannot submit feedback');
            return false;
        }

        try {
            const response = await fetch(`${this.baseURL}/ai/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...accountSystem.getAuthHeaders()
                },
                body: JSON.stringify({
                    game_id: gameId,
                    rating: rating,
                    feedback_type: feedbackData.type || 'star_rating',
                    feedback_text: feedbackData.text || '',
                    tags: feedbackData.tags || {},
                    timestamp: Date.now()
                })
            });

            if (response.ok) {
                console.log('✅ Feedback submitted successfully');
                
                // Update local recommendations cache
                this.updateRecommendationCache(gameId, rating);
                
                return true;
            } else {
                console.error('Failed to submit feedback');
                return false;
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            return false;
        }
    }

    updateRecommendationCache(gameId, rating) {
        // Find and update the recommendation in our local cache
        const recIndex = this.recommendations.findIndex(rec => rec.game_id === gameId);
        if (recIndex !== -1) {
            this.recommendations[recIndex].user_rating = rating;
            this.recommendations[recIndex].has_feedback = true;
        }
    }

    // ===== UTILITY METHODS ===== //
    getAlgorithmLabel(algorithm) {
        const labels = {
            'collaborative_filtering': 'Similar Users',
            'content_based': 'Game Features',
            'hybrid': 'AI Hybrid',
            'popularity_fallback': 'Popular',
            'category_based': 'Category Match'
        };
        return labels[algorithm] || 'AI Recommended';
    }

    getConfidenceColor(confidence) {
        if (confidence >= 0.8) return '#4CAF50'; // Green
        if (confidence >= 0.6) return '#FF9800'; // Orange
        if (confidence >= 0.4) return '#2196F3'; // Blue
        return '#9E9E9E'; // Gray
    }

    // ===== LOCAL STORAGE MANAGEMENT ===== //
    storeRecommendationsLocally(recommendations) {
        try {
            localStorage.setItem('ai_recommendations_cache', JSON.stringify({
                recommendations: recommendations,
                timestamp: Date.now(),
                userId: accountSystem.user?.id
            }));
        } catch (error) {
            console.error('Error storing recommendations locally:', error);
        }
    }

    loadRecommendationsFromCache() {
        try {
            const cached = localStorage.getItem('ai_recommendations_cache');
            if (cached) {
                const data = JSON.parse(cached);
                
                // Check if cache is still valid (24 hours)
                const cacheAge = Date.now() - data.timestamp;
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours
                
                if (cacheAge < maxAge && data.userId === accountSystem.user?.id) {
                    this.recommendations = data.recommendations;
                    return true;
                }
            }
        } catch (error) {
            console.error('Error loading recommendations from cache:', error);
        }
        return false;
    }

    clearRecommendationsCache() {
        localStorage.removeItem('ai_recommendations_cache');
    }

    // ===== API METHODS FOR OTHER COMPONENTS ===== //
    async refreshRecommendations() {
        this.clearRecommendationsCache();
        return await this.generateRecommendations();
    }

    getRecommendationForGame(gameId) {
        return this.recommendations.find(rec => rec.game_id === gameId);
    }

    isGameRecommended(gameId) {
        return this.recommendations.some(rec => rec.game_id === gameId);
    }

    getRecommendationScore(gameId) {
        const rec = this.getRecommendationForGame(gameId);
        return rec ? rec.recommendation_score : 0;
    }

    // ===== PERFORMANCE OPTIMIZATION ===== //
    preloadRecommendationImages() {
        const topRecommendations = this.getTopRecommendations(8);
        topRecommendations.forEach(rec => {
            const game = this.allGames.find(g => g.id === rec.game_id);
            if (game && game.image) {
                const img = new Image();
                img.src = game.image;
            }
        });
    }

    // ===== DEBUG METHODS ===== //
    getSystemStats() {
        return {
            totalRecommendations: this.recommendations.length,
            totalGames: this.allGames.length,
            isInitialized: this.isInitialized,
            userProfile: this.userProfile ? 'Loaded' : 'Not loaded',
            cacheSize: this.modelCache.size,
            avgConfidence: this.recommendations.length > 0 
                ? this.recommendations.reduce((sum, rec) => sum + rec.model_confidence, 0) / this.recommendations.length 
                : 0,
            avgScore: this.recommendations.length > 0
                ? this.recommendations.reduce((sum, rec) => sum + rec.recommendation_score, 0) / this.recommendations.length
                : 0
        };
    }

    logRecommendationStats() {
        const stats = this.getSystemStats();
        console.table(stats);
    }
}

// Initialize the AI Recommendations Engine
document.addEventListener('DOMContentLoaded', () => {
    window.aiRecommendations = new AIRecommendationsEngine();
});

// Export for global access
window.aiRecommendations = window.aiRecommendations || null;