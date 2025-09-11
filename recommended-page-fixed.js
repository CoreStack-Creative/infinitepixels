// AI Recommendations Page Controller
class RecommendedPage {
    constructor() {
        this.isInitialized = false;
        this.feedbackModal = null;
        this.currentRating = 0;
        this.init();
    }

    async init() {
        // Wait for dependencies
        await this.waitForDependencies();
        
        // Only initialize if we're on the AI recommendations page
        if (!this.isRecommendedPage()) {
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
                if (typeof accountSystem !== 'undefined' && typeof recommendationsEngine !== 'undefined') {
                    setTimeout(resolve, 100);
                } else {
                    setTimeout(checkDependencies, 100);
                }
            };
            checkDependencies();
        });
    }

    isRecommendedPage() {
        return window.location.pathname.includes('recommended') || 
               document.getElementById('mainRecommendations');
    }

    setupEventListeners() {
        // Modal listeners (keeping for potential future use)
        this.setupModalListeners();
    }

    setupModalListeners() {
        // Modal listeners removed - no longer using feedback modals
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
            aiAccuracy: await this.getAIAccuracy(),
            discoveries: await this.getDiscoveryCount()
        };

        this.updateInsightCards(insights);
    }

    async calculateAveragePlayTime() {
        try {
            if (!accountSystem.isLoggedIn()) {
                return '-- min';
            }
            
            // Get actual total play time from the account system
            const totalTimeMs = accountSystem.getTotalPlayTime();
            const recentGames = accountSystem.getRecentGames();
            
            if (totalTimeMs === 0 || recentGames.length === 0) {
                return '0 min';
            }
            
            // Calculate average session time
            const avgSessionTime = totalTimeMs / recentGames.length;
            
            if (avgSessionTime < 60000) { // Less than 1 minute
                return `${Math.floor(avgSessionTime / 1000)}s avg`;
            } else if (avgSessionTime < 3600000) { // Less than 1 hour
                const minutes = Math.floor(avgSessionTime / 60000);
                return `${minutes} min avg`;
            } else {
                const hours = Math.floor(avgSessionTime / 3600000);
                const minutes = Math.floor((avgSessionTime % 3600000) / 60000);
                return `${hours}h ${minutes}m avg`;
            }
        } catch (error) {
            console.error('Error calculating play time:', error);
            return '-- min';
        }
    }

    async getAIAccuracy() {
        // Mock AI accuracy - in real app, this would be calculated from user feedback
        const accuracy = Math.floor(Math.random() * 20) + 80; // 80-100%
        return `${accuracy}%`;
    }

    async getDiscoveryCount() {
        try {
            if (!accountSystem.isLoggedIn()) {
                return '0';
            }
            
            // Get actual count of unique games played
            const recentGames = accountSystem.getRecentGames();
            const uniqueGames = new Set();
            recentGames.forEach(game => {
                if (game.slug) {
                    uniqueGames.add(game.slug);
                }
            });
            
            return uniqueGames.size.toString();
        } catch (error) {
            console.error('Error getting discovery count:', error);
            return '0';
        }
    }

    updateInsightCards(insights) {
        const playTimeCard = document.getElementById('playTimeInsight');
        const accuracyCard = document.getElementById('accuracyInsight');
        const discoveryCard = document.getElementById('discoveryInsight');

        if (playTimeCard) {
            playTimeCard.querySelector('.insight-value').textContent = insights.playTime;
        }
        if (accuracyCard) {
            accuracyCard.querySelector('.insight-value').textContent = insights.aiAccuracy;
        }
        if (discoveryCard) {
            discoveryCard.querySelector('.insight-value').textContent = insights.discoveries;
        }
    }

    updateHeaderStats() {
        const statsContainer = document.getElementById('headerStats');
        if (!statsContainer) return;

        const recentGamesCount = accountSystem.isLoggedIn() ? accountSystem.getRecentGames().length : 0;
        const recommendationsCount = recommendationsEngine && recommendationsEngine.recommendations ? 
                                     recommendationsEngine.recommendations.length : 0;

        const stats = [
            { label: 'Recommendations', value: recommendationsCount },
            { label: 'Accuracy', value: '94%' }, // This could be calculated from user feedback
            { label: 'Games Played', value: recentGamesCount }
        ];

        statsContainer.innerHTML = stats.map(stat => `
            <div class="ai-stat-item">
                <div class="ai-stat-value">${stat.value}</div>
                <div class="ai-stat-label">${stat.label}</div>
            </div>
        `).join('');
    }

    async loadRecommendations() {
        console.log('🔄 Loading AI recommendations...');
        
        if (!recommendationsEngine) {
            console.error('❌ AI Recommendations engine not available');
            return;
        }

        this.showLoadingState();

        try {
            // Wait for engine to be ready
            if (!recommendationsEngine.isInitialized) {
                console.log('⏳ Waiting for recommendations engine to initialize...');
                await new Promise(resolve => {
                    const checkInit = () => {
                        if (recommendationsEngine.isInitialized) {
                            resolve();
                        } else {
                            setTimeout(checkInit, 100);
                        }
                    };
                    checkInit();
                });
            }
            
            console.log('🎮 Generating recommendations...');
            // Generate fresh recommendations
            await recommendationsEngine.generateRecommendations();
            
            console.log(`✅ Generated ${recommendationsEngine.recommendations.length} recommendations`);
            
            // Render main recommendations
            this.renderMainRecommendations();
            
            // Render category recommendations
            this.renderCategoryRecommendations();
            
        } catch (error) {
            console.error('❌ Error loading recommendations:', error);
            this.showErrorState();
        }
    }

    renderMainRecommendations() {
        const container = document.getElementById('mainRecommendations');
        if (!container) return;

        const recommendations = recommendationsEngine.getTopRecommendations(12);
        
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
                    ${recommendations.map(rec => recommendationsEngine.renderRecommendationCard(rec)).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.setupCardListeners(container);
    }

    renderCategoryRecommendations() {
        // For now, this is a placeholder method
        // In a full implementation, this would render recommendations by category
        console.log('Category recommendations placeholder');
    }

    setupCardListeners(container) {
        // Set up click listeners for game cards
        const gameCards = container.querySelectorAll('.recommendation-card');
        gameCards.forEach(card => {
            const playButton = card.querySelector('.rec-play-btn');
            if (playButton && !playButton.hasAttribute('data-listener-added')) {
                playButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    const gameId = playButton.getAttribute('data-game-id');
                    if (gameId && recommendationsEngine) {
                        recommendationsEngine.playRecommendedGame(gameId);
                    }
                });
                playButton.setAttribute('data-listener-added', 'true');
            }

            // Set up feedback form listeners within this container
            this.setupFeedbackFormListeners(card);
        });
    }

    setupFeedbackFormListeners(container) {
        const feedbackForms = container.querySelectorAll('.feedback-form');
        feedbackForms.forEach(form => {
            const textarea = form.querySelector('.feedback-textarea');
            const charCount = form.querySelector('.char-count');
            const submitBtn = form.querySelector('.submit-feedback-btn');

            if (textarea && charCount && !textarea.hasAttribute('data-listener-added')) {
                textarea.addEventListener('input', () => {
                    const remaining = 500 - textarea.value.length;
                    charCount.textContent = `${remaining} characters remaining`;
                    charCount.style.color = remaining < 50 ? '#ff6b6b' : '#666';
                });
                textarea.setAttribute('data-listener-added', 'true');
            }

            if (submitBtn && !submitBtn.hasAttribute('data-listener-added')) {
                submitBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const gameId = submitBtn.getAttribute('data-game-id');
                    const feedbackText = textarea ? textarea.value.trim() : '';
                    
                    if (feedbackText && gameId && recommendationsEngine) {
                        const success = await recommendationsEngine.submitRecommendationsFeedback(gameId, feedbackText);
                        if (success) {
                            textarea.value = '';
                            textarea.dispatchEvent(new Event('input')); // Update character count
                            this.showNotification('Feedback submitted successfully!', 'success');
                        } else {
                            this.showNotification('Failed to submit feedback. Please try again.', 'error');
                        }
                    }
                });
                submitBtn.setAttribute('data-listener-added', 'true');
            }
        });
    }

    showLoadingState() {
        const container = document.getElementById('mainRecommendations');
        if (container) {
            container.innerHTML = `
                <div class="recommendations-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <h3>Finding great games for you...</h3>
                    <p>This may take a moment as we generate personalized recommendations</p>
                </div>
            `;
        }
    }

    showErrorState() {
        const container = document.getElementById('mainRecommendations');
        if (container) {
            container.innerHTML = `
                <div class="recommendations-empty">
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
        const container = document.getElementById('mainRecommendations');
        if (container) {
            container.innerHTML = `
                <div class="recommendations-login-prompt">
                    <i class="fas fa-user-circle"></i>
                    <h3>Sign In for Personalized Recommendations</h3>
                    <p>We need to learn your preferences to provide the best game recommendations</p>
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
        return recommendationsEngine ? recommendationsEngine.getSystemStats() : {};
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.aiRecommendationsPage = new RecommendedPage();
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
