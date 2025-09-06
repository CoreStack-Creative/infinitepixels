// AI Game Tracking System
class AITrackingSystem {
    constructor() {
        this.baseURL = 'http://localhost:3000';
        this.currentSession = null;
        this.interactionBuffer = [];
        this.sessionStartTime = null;
        this.lastInteractionTime = null;
        this.isTracking = false;
        this.gameMetadata = null;
        this.heartbeatInterval = null;
        this.bufferFlushInterval = null;
        
        this.init();
    }

    init() {
        // Only track if user is logged in
        if (!accountSystem || !accountSystem.isLoggedIn()) {
            return;
        }

        // Set up interaction listeners
        this.setupInteractionListeners();
        
        // Flush interaction buffer every 10 seconds
        this.bufferFlushInterval = setInterval(() => {
            this.flushInteractionBuffer();
        }, 10000);

        // Auto-save session every 30 seconds
        this.heartbeatInterval = setInterval(() => {
            this.updateCurrentSession();
        }, 30000);

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseTracking();
            } else {
                this.resumeTracking();
            }
        });

        // Handle page unload
        window.addEventListener('beforeunload', () => {
            this.endCurrentSession('quit');
        });
    }

    async startGameSession(gameId, gameMetadata = null) {
        if (!accountSystem.isLoggedIn()) {
            console.log('AI Tracking: User not logged in, skipping session tracking');
            return;
        }

        // End any existing session first
        if (this.currentSession) {
            await this.endCurrentSession('new_game');
        }

        try {
            this.sessionStartTime = new Date();
            this.lastInteractionTime = this.sessionStartTime;
            this.gameMetadata = gameMetadata;
            this.isTracking = true;

            // Create new session
            const response = await fetch(`${this.baseURL}/ai/start-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...accountSystem.getAuthHeaders()
                },
                body: JSON.stringify({
                    game_id: gameId,
                    device_type: this.getDeviceType(),
                    game_metadata: gameMetadata
                })
            });

            if (response.ok) {
                const sessionData = await response.json();
                this.currentSession = sessionData.session;
                
                console.log('AI Tracking: Session started for game', gameId);
                
                // Track initial interaction
                this.trackInteraction('game_start', {
                    game_metadata: gameMetadata,
                    device_info: this.getDeviceInfo()
                });
            } else {
                console.error('Failed to start AI tracking session');
            }
        } catch (error) {
            console.error('Error starting AI tracking session:', error);
        }
    }

    async endCurrentSession(exitReason = 'completed') {
        if (!this.currentSession || !this.isTracking) {
            return;
        }

        try {
            // Flush any remaining interactions
            await this.flushInteractionBuffer();

            const duration = Math.round((Date.now() - this.sessionStartTime.getTime()) / 1000);
            const completionRate = this.calculateCompletionRate();

            const response = await fetch(`${this.baseURL}/ai/end-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...accountSystem.getAuthHeaders()
                },
                body: JSON.stringify({
                    session_id: this.currentSession.id,
                    duration_seconds: duration,
                    interactions_count: this.currentSession.interactions_count || 0,
                    completion_rate: completionRate,
                    exit_reason: exitReason
                })
            });

            if (response.ok) {
                console.log('AI Tracking: Session ended', {
                    duration: duration + 's',
                    interactions: this.currentSession.interactions_count,
                    completion: completionRate + '%',
                    reason: exitReason
                });
            }
        } catch (error) {
            console.error('Error ending AI tracking session:', error);
        } finally {
            this.currentSession = null;
            this.sessionStartTime = null;
            this.isTracking = false;
            this.gameMetadata = null;
        }
    }

    trackInteraction(interactionType, additionalData = {}) {
        if (!this.isTracking || !this.currentSession) {
            return;
        }

        const interaction = {
            session_id: this.currentSession.id,
            game_id: this.currentSession.game_id,
            interaction_type: interactionType,
            interaction_data: {
                ...additionalData,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                user_agent: navigator.userAgent.substring(0, 200)
            }
        };

        // Add to buffer
        this.interactionBuffer.push(interaction);
        this.lastInteractionTime = new Date();

        // Update session interaction count
        if (this.currentSession) {
            this.currentSession.interactions_count = (this.currentSession.interactions_count || 0) + 1;
        }

        // Flush buffer if it gets too large
        if (this.interactionBuffer.length >= 20) {
            this.flushInteractionBuffer();
        }
    }

    async flushInteractionBuffer() {
        if (this.interactionBuffer.length === 0 || !accountSystem.isLoggedIn()) {
            return;
        }

        try {
            const interactions = [...this.interactionBuffer];
            this.interactionBuffer = [];

            const response = await fetch(`${this.baseURL}/ai/track-interactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...accountSystem.getAuthHeaders()
                },
                body: JSON.stringify({
                    interactions: interactions
                })
            });

            if (!response.ok) {
                // Re-add interactions to buffer if request failed
                this.interactionBuffer.unshift(...interactions);
                console.error('Failed to flush interaction buffer');
            }
        } catch (error) {
            console.error('Error flushing interaction buffer:', error);
        }
    }

    pauseTracking() {
        if (this.isTracking) {
            this.trackInteraction('pause', {
                reason: 'visibility_change'
            });
        }
    }

    resumeTracking() {
        if (this.isTracking) {
            this.trackInteraction('resume', {
                reason: 'visibility_change'
            });
        }
    }

    async updateCurrentSession() {
        if (!this.currentSession || !this.isTracking) {
            return;
        }

        try {
            const duration = Math.round((Date.now() - this.sessionStartTime.getTime()) / 1000);
            
            await fetch(`${this.baseURL}/ai/update-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...accountSystem.getAuthHeaders()
                },
                body: JSON.stringify({
                    session_id: this.currentSession.id,
                    duration_seconds: duration,
                    interactions_count: this.currentSession.interactions_count || 0
                })
            });
        } catch (error) {
            console.error('Error updating session:', error);
        }
    }

    setupInteractionListeners() {
        // Mouse interactions
        document.addEventListener('click', (e) => {
            this.trackInteraction('click', {
                element: e.target.tagName,
                element_id: e.target.id,
                element_class: e.target.className,
                x: e.clientX,
                y: e.clientY
            });
        });

        // Keyboard interactions
        document.addEventListener('keydown', (e) => {
            this.trackInteraction('key_press', {
                key: e.key,
                code: e.code,
                ctrl: e.ctrlKey,
                alt: e.altKey,
                shift: e.shiftKey
            });
        });

        // Touch interactions for mobile
        document.addEventListener('touchstart', (e) => {
            this.trackInteraction('touch', {
                touches: e.touches.length,
                x: e.touches[0]?.clientX,
                y: e.touches[0]?.clientY
            });
        });

        // Game-specific events
        window.addEventListener('game-restart', () => {
            this.trackInteraction('restart');
        });

        window.addEventListener('game-pause', () => {
            this.trackInteraction('pause');
        });

        window.addEventListener('game-resume', () => {
            this.trackInteraction('resume');
        });

        window.addEventListener('game-level-complete', (e) => {
            this.trackInteraction('level_complete', {
                level: e.detail?.level,
                score: e.detail?.score,
                time: e.detail?.time
            });
        });

        window.addEventListener('game-over', (e) => {
            this.trackInteraction('game_over', {
                score: e.detail?.score,
                level: e.detail?.level,
                reason: e.detail?.reason
            });
        });
    }

    calculateCompletionRate() {
        // Basic completion rate calculation
        // This can be enhanced based on game-specific metrics
        if (!this.sessionStartTime || !this.gameMetadata) {
            return 0;
        }

        const sessionDuration = (Date.now() - this.sessionStartTime.getTime()) / 1000;
        const expectedDuration = this.gameMetadata.average_playtime_minutes * 60 || 300; // Default 5 minutes

        // Simple completion rate based on time spent
        const timeBasedRate = Math.min(100, (sessionDuration / expectedDuration) * 100);

        // Factor in interaction frequency
        const interactionRate = this.currentSession?.interactions_count || 0;
        const expectedInteractions = Math.max(10, sessionDuration / 5); // Expected interaction every 5 seconds
        const interactionBasedRate = Math.min(100, (interactionRate / expectedInteractions) * 100);

        // Weighted average
        return Math.round((timeBasedRate * 0.6 + interactionBasedRate * 0.4));
    }

    getDeviceType() {
        const width = window.innerWidth;
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }

    getDeviceInfo() {
        return {
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            pixel_ratio: window.devicePixelRatio,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language
        };
    }

    // Public methods for game developers to integrate
    setGameMetadata(metadata) {
        this.gameMetadata = metadata;
    }

    trackGameEvent(eventName, eventData = {}) {
        this.trackInteraction(`game_event_${eventName}`, eventData);
    }

    trackScore(score, level = null) {
        this.trackInteraction('score_update', {
            score: score,
            level: level,
            timestamp: Date.now()
        });
    }

    trackLevelProgress(level, progress) {
        this.trackInteraction('level_progress', {
            level: level,
            progress: progress,
            timestamp: Date.now()
        });
    }

    destroy() {
        // Clean up intervals
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        if (this.bufferFlushInterval) {
            clearInterval(this.bufferFlushInterval);
        }

        // End current session
        this.endCurrentSession('page_unload');

        console.log('AI Tracking System destroyed');
    }
}

// Initialize AI tracking system
let aiTracker = null;

// Initialize when account system is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        aiTracker = new AITrackingSystem();
        window.aiTracker = aiTracker;
    }, 1000);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AITrackingSystem;
}