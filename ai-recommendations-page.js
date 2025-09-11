// AI Recommendations Page Controller
class AIRecommendationsPage {
    constructor() {
        this.isInitialized = false;
        this.currentCategory = 'all';
        this.feedbackModal = null;
        this.currentRating = 0;
        this.init();
    }

    async init() {
        // Wait for dependencies
        await this.waitForDependencies();
        
        // Only initialize if we're on the AI recommendations page
        if (!this.isAIRecommendationsPage()) {
            return;
        }

        // Initialize page components
        this.setupEventListeners();
        this.initializeInsights();
        await this.loadRecommendations();
        
        this.isInitialized = true;
        console.log('🤖 AI Recommendations Page initialized');
    }

    async waitForDependencies() {
        return new Promise((resolve) => {
            const checkDependencies = () => {
                if (typeof accountSystem !== 'undefined' && typeof aiRecommendations !== 'undefined') {
                    setTimeout(resolve, 100);
                } else {
                    setTimeout(checkDependencies, 100);
                }
            };
            checkDependencies();
        });
    }

    isAIRecommendationsPage() {
        return window.location.pathname.includes('ai-recommendations') || 
               document.getElementById('mainAIRecommendations');
    }

    setupEventListeners() {
        // Category tab listeners
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.switchCategory(category);
            });
        });

        // Star rating listeners
        document.addEventListener('click', (e) => {
            if (e.target.closest('.star')) {
                const star = e.target.closest('.star');
                const rating = parseInt(star.dataset.rating);
                this.setStarRating(star.parentElement, rating);
            }
        });

        // Modal listeners
        this.setupModalListeners();
    }

    setupModalListeners() {
        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeFeedbackModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeFeedbackModal();
            }
        });
    }

    async initializeInsights() {
        if (!accountSystem.isLoggedIn()) {
            this.showLoginPrompt();
            return;
        }

        // Load user insights
        await this.loadUserInsights();
        
        // Update header stats
        this.updateHeaderStats();
    }

    async loadUserInsights() {
        const insights = {
            playTime: await this.calculateAveragePlayTime(),
            favoriteGenre: await this.getFavoriteGenre(),
            aiAccuracy: await this.getAIAccuracy(),
            discoveries: await this.getDiscoveryCount()
        };

        this.updateInsightCards(insights);
    }

    async calculateAveragePlayTime() {
        try {
            const recentGames = accountSystem.getRecentGames();
            if (recentGames.length === 0) return '0 min';
            
            // Mock calculation - in real app, this would come from tracking data
            const avgMinutes = Math.floor(Math.random() * 45) + 15; // 15-60 minutes
            return `${avgMinutes} min`;
        } catch (error) {
            console.error('Error calculating play time:', error);
            return '-- min';
        }
    }

    async getFavoriteGenre() {
        try {
            const favorites = accountSystem.getFavorites();
            if (favorites.length === 0) return 'None yet';
            
            // Count categories
            const categoryCount = {};
            favorites.forEach(gameId => {
                const game = aiRecommendations.allGames.find(g => g.id === gameId);
                if (game && game.category) {
                    categoryCount[game.category] = (categoryCount[game.category] || 0) + 1;
                }
            });
            
            // Find most common category
            let maxCategory = 'Action';
            let maxCount = 0;
            Object.entries(categoryCount).forEach(([category, count]) => {
                if (count > maxCount) {
                    maxCategory = category;
                    maxCount = count;
                }
            });
            
            return maxCategory;
        } catch (error) {
            console.error('Error getting favorite genre:', error);
            return 'Action';
        }
    }

    async getAIAccuracy() {
        // Mock AI accuracy - in real app, this would be calculated from user feedback
        const accuracy = Math.floor(Math.random() * 20) + 80; // 80-100%
        return `${accuracy}%`;
    }

    async getDiscoveryCount() {
        // Mock discovery count
        const count = Math.floor(Math.random() * 25) + 5; // 5-30 games
        return count.toString();
    }

    updateInsightCards(insights) {
        const playTimeCard = document.getElementById('playTimeInsight');
        const categoryCard = document.getElementById('categoryInsight');
        const accuracyCard = document.getElementById('accuracyInsight');
        const discoveryCard = document.getElementById('discoveryInsight');

        if (playTimeCard) {
            playTimeCard.querySelector('.insight-value').textContent = insights.playTime;
        }
        if (categoryCard) {
            categoryCard.querySelector('.insight-value').textContent = insights.favoriteGenre;
        }
        if (accuracyCard) {
            accuracyCard.querySelector('.insight-value').textContent = insights.aiAccuracy;
        }
        if (discoveryCard) {
            discoveryCard.querySelector('.insight-value').textContent = insights.discoveries;
        }
    }

    updateHeaderStats() {
        const statsContainer = document.getElementById('aiHeaderStats');
        if (!statsContainer) return;

        const stats = [
            { label: 'Recommendations', value: aiRecommendations.recommendations.length },
            { label: 'Accuracy', value: '94%' },
            { label: 'Games Played', value: accountSystem.getRecentGames().length }
        ];

        statsContainer.innerHTML = stats.map(stat => `
            <div class="ai-stat-item">
                <div class="ai-stat-value">${stat.value}</div>
                <div class="ai-stat-label">${stat.label}</div>
            </div>
        `).join('');
    }

    async loadRecommendations() {
        if (!aiRecommendations) {
            console.error('AI Recommendations engine not available');
            return;
        }

        this.showLoadingState();

        try {
            // Generate fresh recommendations
            await aiRecommendations.generateRecommendations();
            
            // Render main recommendations
            this.renderMainRecommendations();
            
            // Render category recommendations
            this.renderCategoryRecommendations();
            
        } catch (error) {
            console.error('Error loading recommendations:', error);
            this.showErrorState();
        }
    }

    renderMainRecommendations() {
        const container = document.getElementById('mainAIRecommendations');
        if (!container) return;

        const recommendations = aiRecommendations.getTopRecommendations(12);
        
        if (recommendations.length === 0) {
            this.showEmptyState(container);
            return;
        }

        const html = `
            <div class="ai-recommendations-section">
                <h3 class="recommendations-title">
                    <i class="fas fa-brain"></i>
                    AI Recommendations for You
                </h3>
                <div class="ai-recommendations-grid">
                    ${recommendations.map(rec => this.renderRecommendationCard(rec)).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.setupCardListeners(container);
    }

    renderCategoryRecommendations() {
        const container = document.getElementById('categoryContent');
        if (!container) return;

        this.switchCategory(this.currentCategory);
    }

    switchCategory(category) {
        this.currentCategory = category;
        
        // Update tab states
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            }
        });

        // Render category content
        const container = document.getElementById('categoryContent');
        if (!container) return;

        let recommendations;
        if (category === 'all') {
            recommendations = aiRecommendations.getDiverseRecommendations(12);
        } else {
            recommendations = aiRecommendations.getRecommendationsByCategory(category, 12);
        }

        if (recommendations.length === 0) {
            container.innerHTML = `
                <div class="ai-empty-recommendations">
                    <div class="empty-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>No recommendations for ${category}</h3>
                    <p>Try playing some ${category} games to get personalized recommendations!</p>
                </div>
            `;
            return;
        }

        const html = `
            <div class="ai-recommendations-grid">
                ${recommendations.map(rec => this.renderRecommendationCard(rec, { showReasons: true })).join('')}
            </div>
        `;

        container.innerHTML = html;
        this.setupCardListeners(container);
    }

    renderRecommendationCard(recommendation, options = {}) {
        const game = aiRecommendations.allGames.find(g => g.id === recommendation.game_id);
        if (!game) return '';

        const { showReasons = false } = options;
        const confidencePercent = Math.round(recommendation.model_confidence * 100);
        const scoreOutOfTen = Math.round(recommendation.recommendation_score * 10);

        return `
            <div class="ai-game-card" data-game-id="${game.id}" data-recommendation-id="${recommendation.id || ''}">
                <div class="ai-game-image-container">
                    <img src="${game.image}" alt="${game.name}" class="ai-game-image" loading="lazy">
                    <div class="ai-game-overlay">
                        <button class="ai-play-btn" onclick="aiRecommendations.playRecommendedGame('${game.id}')">
                            <i class="fas fa-play"></i>
                            Play Now
                        </button>
                    </div>
                    <div class="ai-score">${scoreOutOfTen}/10</div>
                    <div class="ai-confidence">${confidencePercent}% match</div>
                </div>
                
                <div class="ai-game-info">
                    <h3>${game.name}</h3>
                    <div class="ai-game-category">${game.category}</div>
                    
                    ${showReasons ? `
                        <div class="ai-recommendation-reason">
                            <i class="fas fa-lightbulb"></i>
                            <span>${recommendation.reasoning || 'Recommended based on your preferences'}</span>
                        </div>
                    ` : ''}
                    
                    <div class="ai-game-meta">
                        <span class="algorithm-badge">${aiRecommendations.getAlgorithmLabel(recommendation.algorithm_used)}</span>
                        <span class="confidence-badge" style="color: ${aiRecommendations.getConfidenceColor(recommendation.model_confidence)}">
                            ${confidencePercent}% confident
                        </span>
                    </div>
                    
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
                </div>
            </div>
        `;
    }

    setupCardListeners(container) {
        // Setup intersection observer for view tracking
        const cards = container.querySelectorAll('.ai-game-card');
        cards.forEach((card, index) => {
            const gameId = card.dataset.gameId;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        aiRecommendations.trackRecommendationView(gameId, index);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(card);
        });

        // Setup star rating listeners
        const starRatings = container.querySelectorAll('.star-rating');
        starRatings.forEach(rating => {
            const stars = rating.querySelectorAll('.star-rating-star');
            stars.forEach(star => {
                star.addEventListener('click', () => {
                    const ratingValue = parseInt(star.dataset.rating);
                    const gameId = rating.dataset.gameId;
                    this.submitStarRating(gameId, ratingValue);
                    this.setStarRating(rating, ratingValue);
                });
            });
        });
    }

    setStarRating(container, rating) {
        const stars = container.querySelectorAll('.star-rating-star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    async submitStarRating(gameId, rating) {
        try {
            await aiRecommendations.submitFeedback(gameId, rating);
            this.showNotification('Thanks for your feedback!', 'success');
        } catch (error) {
            console.error('Error submitting rating:', error);
            this.showNotification('Failed to submit rating', 'error');
        }
    }

    showFeedbackModal(gameId) {
        const modal = document.getElementById('feedbackModal');
        if (!modal) return;

        // Store game ID for later use
        modal.dataset.gameId = gameId;
        
        // Reset modal state
        this.currentRating = 0;
        this.resetModalStars();
        document.getElementById('feedbackText').value = '';

        // Show modal
        modal.classList.add('show');
        this.feedbackModal = modal;
    }

    closeFeedbackModal() {
        const modal = document.getElementById('feedbackModal');
        if (modal) {
            modal.classList.remove('show');
            this.feedbackModal = null;
        }
    }

    resetModalStars() {
        const stars = document.querySelectorAll('#feedbackModal .star');
        stars.forEach(star => star.classList.remove('active'));
    }

    async submitFeedback() {
        const modal = this.feedbackModal;
        if (!modal) return;

        const gameId = modal.dataset.gameId;
        const feedbackText = document.getElementById('feedbackText').value;

        if (this.currentRating === 0) {
            this.showNotification('Please select a rating', 'warning');
            return;
        }

        try {
            await aiRecommendations.submitFeedback(gameId, this.currentRating, {
                text: feedbackText,
                type: 'detailed_feedback'
            });

            this.showNotification('Thank you for your detailed feedback!', 'success');
            this.closeFeedbackModal();
        } catch (error) {
            console.error('Error submitting detailed feedback:', error);
            this.showNotification('Failed to submit feedback', 'error');
        }
    }

    exportPreferences() {
        if (!accountSystem.isLoggedIn()) {
            this.showNotification('Please log in to export preferences', 'warning');
            return;
        }

        const data = {
            favorites: accountSystem.getFavorites(),
            recent: accountSystem.getRecentGames(),
            recommendations: aiRecommendations.recommendations,
            exported_at: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `infinitepixels-preferences-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Preferences exported successfully!', 'success');
    }

    showLoadingState() {
        const container = document.getElementById('mainAIRecommendations');
        if (container) {
            container.innerHTML = `
                <div class="ai-recommendations-loading">
                    <i class="fas fa-brain fa-spin"></i>
                    <h3>AI is analyzing your preferences...</h3>
                    <p>This may take a moment as we generate personalized recommendations</p>
                </div>
            `;
        }
    }

    showErrorState() {
        const container = document.getElementById('mainAIRecommendations');
        if (container) {
            container.innerHTML = `
                <div class="ai-recommendations-empty">
                    <div class="empty-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Unable to Load Recommendations</h3>
                    <p>There was a problem loading your AI recommendations. Please try again later.</p>
                    <button class="browse-games-btn" onclick="window.location.reload()">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    showEmptyState(container) {
        container.innerHTML = `
            <div class="ai-empty-recommendations">
                <div class="empty-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <h3>Learning Your Preferences</h3>
                <p>Play a few games to help our AI understand what you like!</p>
                <button class="browse-games-btn" onclick="window.location.href='games.html'">
                    <i class="fas fa-gamepad"></i>
                    Browse Games
                </button>
            </div>
        `;
    }

    showLoginPrompt() {
        const container = document.getElementById('mainAIRecommendations');
        if (container) {
            container.innerHTML = `
                <div class="ai-recommendations-login-prompt">
                    <i class="fas fa-user-circle"></i>
                    <h3>Sign In for Personalized Recommendations</h3>
                    <p>Our AI needs to learn your preferences to provide the best game recommendations</p>
                    <button class="browse-games-btn" onclick="window.location.href='account.html'">
                        <i class="fas fa-sign-in-alt"></i>
                        Sign In Now
                    </button>
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // Public API methods
    refreshRecommendations() {
        return this.loadRecommendations();
    }

    getSystemStats() {
        return aiRecommendations ? aiRecommendations.getSystemStats() : {};
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.aiRecommendationsPage = new AIRecommendationsPage();
});

// Add notification styles
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 10001;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 300px;
}

.notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.notification-success {
    border-left: 4px solid var(--ai-success);
}

.notification-error {
    border-left: 4px solid var(--ai-accent);
}

.notification-warning {
    border-left: 4px solid var(--ai-warning);
}

.notification-info {
    border-left: 4px solid var(--ai-primary);
}

.notification i {
    flex-shrink: 0;
}

.notification-success i {
    color: var(--ai-success);
}

.notification-error i {
    color: var(--ai-accent);
}

.notification-warning i {
    color: var(--ai-warning);
}

.notification-info i {
    color: var(--ai-primary);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);

// Export for global access
window.aiRecommendationsPage = window.aiRecommendationsPage || null;
