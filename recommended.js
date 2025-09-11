// Recommendations Engine - Client-side Implementation
class RecommendationsEngine {
    constructor() {
        this.baseURL = 'http://localhost:3000';
        this.recommendations = [];
        this.allGames = [];
        this.userProfile = null;
        this.modelCache = new Map();
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
        console.log('🎮 Recommendations Engine initialized');
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
                console.log(`📊 Loaded ${this.allGames.length} games for analysis`);
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
                console.log('👤 User profile loaded');
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
                
                console.log(`🎯 Generated ${this.recommendations.length} recommendations`);
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
        if (this.allGames.length === 0) {
            console.warn('No games loaded for fallback recommendations');
            return [];
        }

        const categories = ['action', 'puzzle', 'strategy', 'arcade', 'adventure', 'shooter', 'racing', 'sports'];
        const fallbackRecs = [];

        // Get games for each category
        categories.forEach((category, index) => {
            const categoryGames = this.allGames
                .filter(game => {
                    const gameTags = game.tags || [];
                    const gameCategory = game.category || '';
                    return gameTags.some(tag => tag.toLowerCase().includes(category.toLowerCase())) ||
                           gameCategory.toLowerCase().includes(category.toLowerCase());
                })
                .sort((a, b) => (b.plays || Math.random() * 1000) - (a.plays || Math.random() * 1000))
                .slice(0, 3);

            categoryGames.forEach((game, gameIndex) => {
                const confidence = 0.6 + (Math.random() * 0.3); // 60-90% confidence
                const score = 0.7 + (Math.random() * 0.25); // 70-95% score
                
                fallbackRecs.push({
                    game_id: game.id || game.slug,
                    recommendation_score: score,
                    model_confidence: confidence,
                    reasoning: this.generateFallbackReason(game, category),
                    algorithm_used: 'popularity_fallback',
                    category: category,
                    id: `fallback_${game.id}_${index}_${gameIndex}`
                });
            });
        });

        // Shuffle and return top recommendations
        const shuffled = fallbackRecs.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 20);
    }

    generateFallbackReason(game, category) {
        const reasons = [
            `Popular ${category} game with great reviews`,
            `Trending in the ${category} category`,
            `Highly rated ${category} experience`,
            `Community favorite in ${category} games`,
            `Top-rated ${category} game this month`,
            `Recommended for ${category} enthusiasts`,
            `Must-play ${category} adventure`,
            `Fan favorite in the ${category} genre`
        ];
        
        return reasons[Math.floor(Math.random() * reasons.length)];
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
                const game = this.allGames.find(g => g.id == rec.game_id);
                if (!game) return false;
                
                // Check game category or tags
                const gameCategory = this.getGameCategory(game).toLowerCase();
                const gameTags = game.tags || [];
                
                return gameCategory.includes(category.toLowerCase()) ||
                       gameTags.some(tag => tag.toLowerCase().includes(category.toLowerCase()));
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
                const game = this.allGames.find(g => g.id == rec.game_id);
                if (game) {
                    const gameCategory = this.getGameCategory(game);
                    if (!usedCategories.has(gameCategory) && diverseRecs.length < count) {
                        diverseRecs.push(rec);
                        usedCategories.add(gameCategory);
                    }
                }
            });

        // Second pass: fill remaining slots with highest scores
        const remaining = count - diverseRecs.length;
        if (remaining > 0) {
            const remainingRecs = this.recommendations
                .filter(rec => !diverseRecs.includes(rec))
                .sort((a, b) => b.recommendation_score - a.recommendation_score)
                .slice(0, remaining);
            
            diverseRecs.push(...remainingRecs);
        }

        return diverseRecs.slice(0, count);
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
                    ${recommendations.map(rec => this.renderRecommendationCard(rec, { showReasons, showFeedback: false })).join('')}
                </div>
                ${this.renderFeedbackSection()}
            </div>
        `;

        container.innerHTML = html;
        
        // Setup event listeners for the new content
        this.setupRecommendationListeners(container);
    }

    renderRecommendationCard(recommendation, options = {}) {
        const game = this.allGames.find(g => g.id === recommendation.game_id || g.id == recommendation.game_id);
        if (!game) {
            console.warn('Game not found for recommendation:', recommendation.game_id);
            return '';
        }

        const { showReasons, showFeedback } = options;
        const confidencePercent = Math.round(recommendation.model_confidence * 100);
        const scoreOutOfTen = Math.round(recommendation.recommendation_score * 10);

        return `
            <div class="ai-game-card" data-game-id="${game.id}" data-recommendation-id="${recommendation.id || ''}">
                <div class="ai-game-image-container">
                    <img src="${game.image}" alt="${game.name}" class="ai-game-image" loading="lazy">
                    <div class="ai-game-overlay">
                        <button class="ai-play-btn" onclick="recommendationsEngine.playRecommendedGame('${game.id}')">
                            <i class="fas fa-play"></i>
                        </button>
                        <div class="ai-score">${scoreOutOfTen}/10</div>
                        <div class="ai-confidence">${confidencePercent}% match</div>
                    </div>
                </div>
                
                <div class="ai-game-info">
                    <h3>${game.name}</h3>
                    <div class="ai-game-category">${this.getGameCategory(game)}</div>
                    
                    ${showReasons ? `
                        <div class="ai-recommendation-reason">
                            <i class="fas fa-lightbulb"></i>
                            <span>${recommendation.reasoning || 'Recommended based on your preferences'}</span>
                        </div>
                    ` : ''}
                    
                    <div class="ai-game-meta">
                        <span class="algorithm-badge">${this.getAlgorithmLabel(recommendation.algorithm_used)}</span>
                        <span class="confidence-badge" style="color: ${this.getConfidenceColor(recommendation.model_confidence)}">
                            ${confidencePercent}% confident
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    renderFeedbackSection() {
        return `
            <div class="ai-feedback-section">
                <div class="feedback-header">
                    <h4><i class="fas fa-comment-dots"></i> Help Improve Our Recommendations</h4>
                    <p>Your feedback helps us understand your preferences better and provide more personalized game suggestions.</p>
                </div>
                
                <form class="feedback-form" id="recommendationsFeedbackForm">
                    <div class="feedback-input-group">
                        <label for="feedbackText">What did you think of these recommendations?</label>
                        <textarea 
                            id="feedbackText" 
                            name="feedback" 
                            placeholder="Tell us what you liked or didn't like about these suggestions. Were they relevant to your interests? Did you discover any new games you enjoyed?"
                            rows="4"
                            maxlength="500"
                        ></textarea>
                        <small class="char-counter">0/500 characters</small>
                    </div>
                    
                    <div class="feedback-actions">
                        <button type="submit" class="submit-feedback-btn">
                            <i class="fas fa-paper-plane"></i>
                            Submit Feedback
                        </button>
                        <button type="button" class="clear-feedback-btn">
                            <i class="fas fa-eraser"></i>
                            Clear
                        </button>
                    </div>
                </form>
                
                <div class="feedback-success" id="feedbackSuccess" style="display: none;">
                    <i class="fas fa-check-circle"></i>
                    <span>Thank you for your feedback! It helps us improve our recommendations.</span>
                </div>
            </div>
        `;
    }

    getGameCategory(game) {
        // Try to get category from tags or category field
        if (game.category) return game.category;
        if (game.tags && game.tags.length > 0) {
            return game.tags[0].charAt(0).toUpperCase() + game.tags[0].slice(1);
        }
        return 'Game';
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

        // Setup feedback form listeners
        this.setupFeedbackFormListeners(container);
    }

    setupFeedbackFormListeners(container) {
        const feedbackForm = container.querySelector('#recommendationsFeedbackForm');
        const feedbackText = container.querySelector('#feedbackText');
        const charCounter = container.querySelector('.char-counter');
        const clearBtn = container.querySelector('.clear-feedback-btn');

        if (feedbackText && charCounter) {
            // Character counter
            feedbackText.addEventListener('input', () => {
                const length = feedbackText.value.length;
                charCounter.textContent = `${length}/500 characters`;
                charCounter.style.color = length > 450 ? '#ff4444' : '#666';
            });
        }

        if (clearBtn) {
            // Clear button
            clearBtn.addEventListener('click', () => {
                if (feedbackText) {
                    feedbackText.value = '';
                    charCounter.textContent = '0/500 characters';
                    charCounter.style.color = '#666';
                }
            });
        }

        if (feedbackForm) {
            // Form submission
            feedbackForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitRecommendationsFeedback(feedbackText.value);
            });
        }
    }

    async submitRecommendationsFeedback(feedbackText) {
        if (!feedbackText.trim()) {
            this.showFeedbackMessage('Please enter some feedback before submitting.', 'error');
            return;
        }

        if (!accountSystem.isLoggedIn()) {
            this.showFeedbackMessage('Please log in to submit feedback.', 'error');
            return;
        }

        const submitBtn = document.querySelector('.submit-feedback-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            if (!accountSystem.supabase) {
                this.showFeedbackMessage('Feedback submission requires online connection.', 'error');
                return;
            }

            // Submit to Supabase
            const { data, error } = await accountSystem.supabase
                .from('recommendation_feedback')
                .insert([
                    {
                        user_id: accountSystem.user.id,
                        feedback_text: feedbackText.trim(),
                        recommendation_count: this.recommendations.length,
                        created_at: new Date().toISOString(),
                        user_agent: navigator.userAgent,
                        session_id: accountSystem.session?.access_token || 'offline'
                    }
                ]);

            if (error) {
                console.error('Supabase error:', error);
                this.showFeedbackMessage('Error submitting feedback: ' + error.message, 'error');
                return;
            }

            console.log('✅ Feedback submitted successfully:', data);
            
            // Show success message
            this.showFeedbackSuccess();
            
            // Clear form
            const feedbackTextarea = document.querySelector('#feedbackText');
            const charCounter = document.querySelector('.char-counter');
            if (feedbackTextarea) {
                feedbackTextarea.value = '';
                charCounter.textContent = '0/500 characters';
                charCounter.style.color = '#666';
            }

        } catch (error) {
            console.error('Error submitting feedback:', error);
            this.showFeedbackMessage('An unexpected error occurred. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showFeedbackSuccess() {
        const successDiv = document.querySelector('#feedbackSuccess');
        const form = document.querySelector('#recommendationsFeedbackForm');
        
        if (successDiv && form) {
            form.style.display = 'none';
            successDiv.style.display = 'flex';
            
            // Hide success message after 5 seconds and show form again
            setTimeout(() => {
                successDiv.style.display = 'none';
                form.style.display = 'block';
            }, 5000);
        }
    }

    showFeedbackMessage(message, type = 'info') {
        // Use the account system's message system
        if (accountSystem && accountSystem.showMessage) {
            accountSystem.showMessage(message, type);
        } else {
            // Fallback to console
            console.log(`Feedback ${type}:`, message);
        }
    }

    // ===== GAME INTERACTION HANDLING ===== //
    playRecommendedGame(gameId) {
        const game = this.allGames.find(g => g.id === gameId);
        if (!game) {
            console.error('Game not found:', gameId);
            return;
        }

        // Track play action
        this.trackGamePlay(gameId);

        // Redirect to game page
        window.location.href = `/game.html?id=${gameId}`;
    }

    trackGamePlay(gameId) {
        // TODO: Implement game play tracking (e.g., send event to analytics)
        console.log('Game played:', gameId);
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
    window.recommendationsEngine = new RecommendationsEngine();
});

// Export for global access
window.recommendationsEngine = window.recommendationsEngine || null;