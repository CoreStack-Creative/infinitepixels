// AI Homepage Widget Integration
class AIHomepageWidget {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    async init() {
        // Wait for dependencies to load
        await this.waitForDependencies();
        
        // Initialize AI widget on homepage
        if (this.isHomepage()) {
            await this.initializeHomepageWidget();
        }
        
        this.isInitialized = true;
    }

    async waitForDependencies() {
        return new Promise((resolve) => {
            const checkDependencies = () => {
                if (typeof accountSystem !== 'undefined' && typeof aiRecommendations !== 'undefined') {
                    resolve();
                } else {
                    setTimeout(checkDependencies, 100);
                }
            };
            checkDependencies();
        });
    }

    isHomepage() {
        return window.location.pathname === '/' || 
               window.location.pathname === '/index.html' || 
               window.location.pathname.endsWith('index.html');
    }

    async initializeHomepageWidget() {
        // Find the perfect spot to inject AI recommendations
        const targetContainer = this.findBestContainer();
        
        if (targetContainer) {
            // Create AI recommendations section
            this.createAISection(targetContainer);
            
            // Wait for AI system to be ready
            setTimeout(async () => {
                if (accountSystem.isLoggedIn() && aiRecommendations) {
                    await this.loadHomepageRecommendations();
                }
            }, 2000);
        }
    }

    findBestContainer() {
        // Look for existing game sections to insert AI recommendations
        const possibleContainers = [
            '.featured-games-section',
            '.main-games-grid',
            '.homepage-content',
            '.content-wrapper',
            '#mainContent',
            '.main-content',
            'main'
        ];

        for (const selector of possibleContainers) {
            const container = document.querySelector(selector);
            if (container) {
                return container;
            }
        }

        return null;
    }

    createAISection(parentContainer) {
        // Create AI recommendations container
        const aiSection = document.createElement('div');
        aiSection.className = 'ai-homepage-section';
        aiSection.id = 'aiHomepageRecommendations';
        aiSection.setAttribute('data-ai-recommendations', 'true');

        // Insert AI section at strategic position
        const firstGameSection = parentContainer.querySelector('.games-section, .game-grid, .featured-games');
        if (firstGameSection) {
            parentContainer.insertBefore(aiSection, firstGameSection.nextSibling);
        } else {
            parentContainer.appendChild(aiSection);
        }

        // Add some spacing
        aiSection.style.margin = '3rem 0';
    }

    async loadHomepageRecommendations() {
        if (!aiRecommendations || !accountSystem.isLoggedIn()) {
            this.showLoginPrompt();
            return;
        }

        try {
            // Show loading state
            this.showLoadingState();

            // Generate recommendations if needed
            await aiRecommendations.generateRecommendations();

            // Render recommendations with homepage-specific options
            aiRecommendations.renderRecommendations('aiHomepageRecommendations', {
                title: '🧠 AI Picks Just For You',
                showReasons: true,
                showFeedback: false, // Less clutter on homepage
                maxCount: 6,
                layout: 'grid'
            });

            // Add some enhancements
            this.enhanceHomepageWidget();

        } catch (error) {
            console.error('Error loading homepage AI recommendations:', error);
            this.showErrorState();
        }
    }

    showLoginPrompt() {
        const container = document.getElementById('aiHomepageRecommendations');
        if (!container) return;

        container.innerHTML = `
            <div class="ai-homepage-login-prompt">
                <div class="ai-prompt-content">
                    <div class="ai-prompt-icon">
                        <i class="fas fa-brain"></i>
                    </div>
                    <div class="ai-prompt-text">
                        <h3>Discover Your Perfect Games</h3>
                        <p>Our AI learns from your gaming habits to suggest games you'll love. Log in to unlock personalized recommendations!</p>
                    </div>
                    <div class="ai-prompt-features">
                        <div class="ai-feature">
                            <i class="fas fa-chart-line"></i>
                            <span>Smart Analytics</span>
                        </div>
                        <div class="ai-feature">
                            <i class="fas fa-heart"></i>
                            <span>Personal Preferences</span>
                        </div>
                        <div class="ai-feature">
                            <i class="fas fa-rocket"></i>
                            <span>Trending Games</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add styles for login prompt
        this.addPromptStyles();
    }

    showLoadingState() {
        const container = document.getElementById('aiHomepageRecommendations');
        if (!container) return;

        container.innerHTML = `
            <div class="ai-homepage-loading">
                <div class="ai-loading-content">
                    <div class="ai-loading-brain">
                        <i class="fas fa-brain"></i>
                        <div class="brain-waves">
                            <div class="wave wave-1"></div>
                            <div class="wave wave-2"></div>
                            <div class="wave wave-3"></div>
                        </div>
                    </div>
                    <h3>AI is Analyzing Your Gaming DNA...</h3>
                    <p>Personalizing recommendations based on your unique play style</p>
                    <div class="loading-steps">
                        <div class="step active">
                            <i class="fas fa-search"></i>
                            <span>Analyzing preferences</span>
                        </div>
                        <div class="step">
                            <i class="fas fa-cogs"></i>
                            <span>Processing data</span>
                        </div>
                        <div class="step">
                            <i class="fas fa-magic"></i>
                            <span>Creating magic</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Animate loading steps
        this.animateLoadingSteps();
    }

    showErrorState() {
        const container = document.getElementById('aiHomepageRecommendations');
        if (!container) return;

        container.innerHTML = `
            <div class="ai-homepage-error">
                <div class="ai-error-content">
                    <i class="fas fa-robot"></i>
                    <h3>AI Taking a Coffee Break</h3>
                    <p>Our recommendation engine is temporarily unavailable. Please try again in a moment!</p>
                    <button class="retry-ai-btn" onclick="aiHomepageWidget.loadHomepageRecommendations()">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }

    enhanceHomepageWidget() {
        const aiSection = document.getElementById('aiHomepageRecommendations');
        if (!aiSection) return;

        // Add "View More" button if there are more recommendations
        const viewMoreBtn = document.createElement('div');
        viewMoreBtn.className = 'view-more-container';
        viewMoreBtn.innerHTML = `
            <a href="recommended.html" class="view-more-btn">
                <span>View All Recommended Games</span>
                <i class="fas fa-arrow-right"></i>
            </a>
        `;
        aiSection.appendChild(viewMoreBtn);

        // Add AI badge/indicator
        this.addAIBadge(aiSection);

        // Add hover effects for better interactivity
        this.addInteractiveEffects(aiSection);
    }

    addAIBadge(container) {
        const header = container.querySelector('.ai-recommendations-header h2');
        if (header) {
            const badge = document.createElement('div');
            badge.className = 'ai-powered-badge';
            badge.innerHTML = `
                <i class="fas fa-bolt"></i>
                <span>AI Powered</span>
            `;
            header.appendChild(badge);
        }
    }

    addInteractiveEffects(container) {
        // Add subtle glow effect to AI cards on hover
        const cards = container.querySelectorAll('.ai-recommendation-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.boxShadow = '0 8px 25px rgba(64, 224, 208, 0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = '';
            });
        });
    }

    animateLoadingSteps() {
        const steps = document.querySelectorAll('.loading-steps .step');
        let currentStep = 0;

        const interval = setInterval(() => {
            // Remove active from current step
            if (steps[currentStep]) {
                steps[currentStep].classList.remove('active');
            }

            // Move to next step
            currentStep = (currentStep + 1) % steps.length;

            // Add active to new step
            if (steps[currentStep]) {
                steps[currentStep].classList.add('active');
            }

            // Stop if component is no longer loading
            if (!document.querySelector('.ai-homepage-loading')) {
                clearInterval(interval);
            }
        }, 1500);
    }

    addPromptStyles() {
        // Add custom styles for the login prompt
        const style = document.createElement('style');
        style.textContent = `
            .ai-homepage-login-prompt {
                background: linear-gradient(135deg, rgba(64, 224, 208, 0.1), rgba(100, 149, 237, 0.1));
                border: 2px dashed rgba(64, 224, 208, 0.3);
                border-radius: 16px;
                padding: 3rem 2rem;
                text-align: center;
                margin: 2rem 0;
            }

            .ai-prompt-content {
                max-width: 600px;
                margin: 0 auto;
            }

            .ai-prompt-icon i {
                font-size: 4rem;
                color: var(--accent-color);
                margin-bottom: 1.5rem;
                animation: brainPulse 2s ease-in-out infinite;
            }

            @keyframes brainPulse {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
            }

            .ai-prompt-text h3 {
                color: var(--text-primary);
                font-size: 1.8rem;
                margin-bottom: 1rem;
                font-weight: 600;
            }

            .ai-prompt-text p {
                color: var(--text-secondary);
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 2rem;
            }

            .ai-prompt-features {
                display: flex;
                justify-content: center;
                gap: 2rem;
                flex-wrap: wrap;
            }

            .ai-feature {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--accent-color);
                font-weight: 500;
            }

            .ai-feature i {
                font-size: 1.2rem;
            }

            @media (max-width: 768px) {
                .ai-prompt-features {
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .ai-prompt-text h3 {
                    font-size: 1.5rem;
                }
                
                .ai-prompt-text p {
                    font-size: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Public method to refresh homepage recommendations
    async refresh() {
        if (this.isHomepage() && accountSystem.isLoggedIn()) {
            await this.loadHomepageRecommendations();
        }
    }

    // Handle user login/logout events
    handleUserStateChange() {
        if (this.isHomepage()) {
            setTimeout(() => {
                if (accountSystem.isLoggedIn()) {
                    this.loadHomepageRecommendations();
                } else {
                    this.showLoginPrompt();
                }
            }, 1000);
        }
    }
}

// Initialize AI Homepage Widget
let aiHomepageWidget = null;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        aiHomepageWidget = new AIHomepageWidget();
        window.aiHomepageWidget = aiHomepageWidget;
    }, 2000);
});

// Listen for login state changes
document.addEventListener('userLoginStateChanged', () => {
    if (aiHomepageWidget) {
        aiHomepageWidget.handleUserStateChange();
    }
});

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIHomepageWidget;
}