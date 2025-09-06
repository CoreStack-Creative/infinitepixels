// AI Admin Dashboard - Performance Monitoring & Management
class AIAdminDashboard {
    constructor() {
        this.baseURL = 'http://localhost:3000';
        this.refreshInterval = null;
        this.charts = {};
        this.metrics = {};
        this.isAdmin = false;
        this.init();
    }

    async init() {
        // Check admin privileges
        await this.checkAdminAccess();
        
        if (!this.isAdmin) {
            this.showAccessDenied();
            return;
        }

        // Initialize dashboard components
        await this.loadInitialData();
        this.setupDashboard();
        this.startAutoRefresh();
        
        console.log('🔧 AI Admin Dashboard initialized');
    }

    async checkAdminAccess() {
        if (!accountSystem.isLoggedIn()) {
            this.isAdmin = false;
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/admin/check-access`, {
                headers: accountSystem.getAuthHeaders()
            });
            
            this.isAdmin = response.ok;
        } catch (error) {
            console.error('Error checking admin access:', error);
            this.isAdmin = false;
        }
    }

    showAccessDenied() {
        const mainContent = document.getElementById('adminContent');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="access-denied">
                    <div class="access-denied-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h2>Access Denied</h2>
                    <p>You don't have permission to access the AI Admin Dashboard.</p>
                    <button onclick="window.location.href='index.html'" class="return-home-btn">
                        Return to Homepage
                    </button>
                </div>
            `;
        }
    }

    async loadInitialData() {
        try {
            // Load all dashboard metrics in parallel
            const [metricsResponse, performanceResponse, usersResponse, modelsResponse] = await Promise.all([
                fetch(`${this.baseURL}/admin/ai/metrics`, { headers: accountSystem.getAuthHeaders() }),
                fetch(`${this.baseURL}/admin/ai/performance`, { headers: accountSystem.getAuthHeaders() }),
                fetch(`${this.baseURL}/admin/ai/users`, { headers: accountSystem.getAuthHeaders() }),
                fetch(`${this.baseURL}/admin/ai/models`, { headers: accountSystem.getAuthHeaders() })
            ]);

            this.metrics = {
                overview: metricsResponse.ok ? await metricsResponse.json() : {},
                performance: performanceResponse.ok ? await performanceResponse.json() : {},
                users: usersResponse.ok ? await usersResponse.json() : {},
                models: modelsResponse.ok ? await modelsResponse.json() : {}
            };

            console.log('📊 Dashboard data loaded');
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    setupDashboard() {
        this.renderOverviewCards();
        this.renderPerformanceCharts();
        this.renderUserEngagement();
        this.renderModelPerformance();
        this.renderRecentActivity();
        this.renderSystemHealth();
        this.setupEventListeners();
    }

    renderOverviewCards() {
        const container = document.getElementById('overviewCards');
        if (!container) return;

        const overview = this.metrics.overview;
        
        const cards = [
            {
                title: 'Total Recommendations',
                value: this.formatNumber(overview.totalRecommendations || 0),
                icon: 'fas fa-lightbulb',
                color: '#667eea',
                trend: this.calculateTrend(overview.recommendationsTrend)
            },
            {
                title: 'Active Users',
                value: this.formatNumber(overview.activeUsers || 0),
                icon: 'fas fa-users',
                color: '#4CAF50',
                trend: this.calculateTrend(overview.usersTrend)
            },
            {
                title: 'Click-through Rate',
                value: `${(overview.clickThroughRate || 0).toFixed(1)}%`,
                icon: 'fas fa-mouse-pointer',
                color: '#FF9800',
                trend: this.calculateTrend(overview.ctrTrend)
            },
            {
                title: 'Model Accuracy',
                value: `${(overview.modelAccuracy || 0).toFixed(1)}%`,
                icon: 'fas fa-target',
                color: '#E91E63',
                trend: this.calculateTrend(overview.accuracyTrend)
            }
        ];

        container.innerHTML = cards.map(card => `
            <div class="overview-card" style="border-top: 3px solid ${card.color}">
                <div class="card-header">
                    <div class="card-icon" style="background: ${card.color}">
                        <i class="${card.icon}"></i>
                    </div>
                    <div class="card-trend ${card.trend.direction}">
                        <i class="fas fa-arrow-${card.trend.direction}"></i>
                        ${card.trend.percentage}%
                    </div>
                </div>
                <div class="card-body">
                    <h3>${card.value}</h3>
                    <p>${card.title}</p>
                </div>
            </div>
        `).join('');
    }

    renderPerformanceCharts() {
        this.renderRecommendationChart();
        this.renderAccuracyChart();
        this.renderEngagementChart();
    }

    renderRecommendationChart() {
        const canvas = document.getElementById('recommendationsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.metrics.performance.recommendations || [];

        this.charts.recommendations = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => this.formatDate(d.date)),
                datasets: [{
                    label: 'Recommendations Generated',
                    data: data.map(d => d.count),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Daily Recommendations Generated'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    renderAccuracyChart() {
        const canvas = document.getElementById('accuracyChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.metrics.performance.accuracy || [];

        this.charts.accuracy = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => this.formatDate(d.date)),
                datasets: [
                    {
                        label: 'Model Accuracy',
                        data: data.map(d => d.accuracy),
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'User Satisfaction',
                        data: data.map(d => d.satisfaction),
                        borderColor: '#FF9800',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'AI Performance Over Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    renderEngagementChart() {
        const canvas = document.getElementById('engagementChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.metrics.performance.engagement || [];

        this.charts.engagement = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Played', 'Favorited', 'Viewed Only', 'Dismissed'],
                datasets: [{
                    data: [
                        data.played || 0,
                        data.favorited || 0,
                        data.viewed || 0,
                        data.dismissed || 0
                    ],
                    backgroundColor: [
                        '#4CAF50',
                        '#E91E63',
                        '#2196F3',
                        '#9E9E9E'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'User Engagement with Recommendations'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderUserEngagement() {
        const container = document.getElementById('userEngagement');
        if (!container) return;

        const users = this.metrics.users;
        const topUsers = users.mostEngaged || [];

        container.innerHTML = `
            <div class="user-engagement-section">
                <h3>User Engagement Metrics</h3>
                
                <div class="engagement-stats">
                    <div class="stat-item">
                        <span class="stat-value">${users.totalActive || 0}</span>
                        <span class="stat-label">Active Users (7d)</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${users.newUsers || 0}</span>
                        <span class="stat-label">New Users (7d)</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${(users.avgSessionTime || 0).toFixed(1)}m</span>
                        <span class="stat-label">Avg Session Time</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${(users.retentionRate || 0).toFixed(1)}%</span>
                        <span class="stat-label">7-day Retention</span>
                    </div>
                </div>

                <div class="top-users">
                    <h4>Most Engaged Users</h4>
                    <div class="users-list">
                        ${topUsers.map((user, index) => `
                            <div class="user-item">
                                <div class="user-rank">#${index + 1}</div>
                                <div class="user-info">
                                    <span class="username">${user.username}</span>
                                    <span class="user-stats">${user.gamesPlayed} games, ${user.recommendations} recommendations</span>
                                </div>
                                <div class="engagement-score">
                                    ${user.engagementScore}%
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderModelPerformance() {
        const container = document.getElementById('modelPerformance');
        if (!container) return;

        const models = this.metrics.models;
        
        container.innerHTML = `
            <div class="model-performance-section">
                <h3>AI Model Performance</h3>
                
                <div class="models-grid">
                    ${Object.entries(models.algorithms || {}).map(([algorithm, data]) => `
                        <div class="model-card">
                            <div class="model-header">
                                <h4>${this.formatAlgorithmName(algorithm)}</h4>
                                <div class="model-status ${data.status === 'active' ? 'active' : 'inactive'}">
                                    ${data.status}
                                </div>
                            </div>
                            <div class="model-metrics">
                                <div class="metric">
                                    <span class="metric-label">Accuracy</span>
                                    <span class="metric-value">${(data.accuracy || 0).toFixed(1)}%</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Usage</span>
                                    <span class="metric-value">${(data.usage || 0).toFixed(1)}%</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Avg Response</span>
                                    <span class="metric-value">${data.responseTime || 0}ms</span>
                                </div>
                            </div>
                            <div class="model-actions">
                                <button class="toggle-model-btn" data-algorithm="${algorithm}" 
                                        onclick="aiAdminDashboard.toggleModel('${algorithm}')">
                                    ${data.status === 'active' ? 'Disable' : 'Enable'}
                                </button>
                                <button class="retrain-model-btn" data-algorithm="${algorithm}"
                                        onclick="aiAdminDashboard.retrainModel('${algorithm}')">
                                    Retrain
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="training-history">
                    <h4>Recent Training Sessions</h4>
                    <div class="training-list">
                        ${(models.trainingHistory || []).map(session => `
                            <div class="training-item">
                                <div class="training-info">
                                    <span class="algorithm">${this.formatAlgorithmName(session.algorithm)}</span>
                                    <span class="training-date">${this.formatDateTime(session.date)}</span>
                                </div>
                                <div class="training-result ${session.status}">
                                    ${session.status} (${session.improvement > 0 ? '+' : ''}${session.improvement}%)
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;

        const activities = this.metrics.overview.recentActivity || [];

        container.innerHTML = `
            <div class="recent-activity-section">
                <h3>Recent AI Activity</h3>
                <div class="activity-feed">
                    ${activities.map(activity => `
                        <div class="activity-item">
                            <div class="activity-icon ${activity.type}">
                                <i class="${this.getActivityIcon(activity.type)}"></i>
                            </div>
                            <div class="activity-content">
                                <span class="activity-message">${activity.message}</span>
                                <span class="activity-time">${this.formatRelativeTime(activity.timestamp)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderSystemHealth() {
        const container = document.getElementById('systemHealth');
        if (!container) return;

        const health = this.metrics.overview.systemHealth || {};

        container.innerHTML = `
            <div class="system-health-section">
                <h3>System Health</h3>
                
                <div class="health-indicators">
                    <div class="health-item">
                        <div class="health-indicator ${this.getHealthStatus(health.apiResponse)}"></div>
                        <span class="health-label">API Response Time</span>
                        <span class="health-value">${health.apiResponse || 0}ms</span>
                    </div>
                    
                    <div class="health-item">
                        <div class="health-indicator ${this.getHealthStatus(health.databaseConnection)}"></div>
                        <span class="health-label">Database Connection</span>
                        <span class="health-value">${health.databaseConnection || 'Unknown'}</span>
                    </div>
                    
                    <div class="health-item">
                        <div class="health-indicator ${this.getHealthStatus(health.modelLatency)}"></div>
                        <span class="health-label">ML Model Latency</span>
                        <span class="health-value">${health.modelLatency || 0}ms</span>
                    </div>
                    
                    <div class="health-item">
                        <div class="health-indicator ${this.getHealthStatus(health.errorRate)}"></div>
                        <span class="health-label">Error Rate</span>
                        <span class="health-value">${(health.errorRate || 0).toFixed(2)}%</span>
                    </div>
                </div>

                <div class="system-actions">
                    <button class="action-btn" onclick="aiAdminDashboard.clearCache()">
                        <i class="fas fa-broom"></i>
                        Clear Cache
                    </button>
                    <button class="action-btn" onclick="aiAdminDashboard.retrainAllModels()">
                        <i class="fas fa-brain"></i>
                        Retrain All Models
                    </button>
                    <button class="action-btn" onclick="aiAdminDashboard.exportData()">
                        <i class="fas fa-download"></i>
                        Export Data
                    </button>
                    <button class="action-btn danger" onclick="aiAdminDashboard.resetSystem()">
                        <i class="fas fa-exclamation-triangle"></i>
                        Reset System
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshDashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }

        // Auto-refresh toggle
        const autoRefreshToggle = document.getElementById('autoRefreshToggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.startAutoRefresh();
                } else {
                    this.stopAutoRefresh();
                }
            });
        }

        // Export buttons
        document.querySelectorAll('[data-export]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exportType = e.target.dataset.export;
                this.exportData(exportType);
            });
        });
    }

    // ===== MODEL MANAGEMENT METHODS ===== //
    async toggleModel(algorithm) {
        try {
            const response = await fetch(`${this.baseURL}/admin/ai/models/${algorithm}/toggle`, {
                method: 'POST',
                headers: accountSystem.getAuthHeaders()
            });

            if (response.ok) {
                this.showNotification('Model status updated successfully', 'success');
                await this.loadInitialData();
                this.renderModelPerformance();
            } else {
                this.showNotification('Failed to update model status', 'error');
            }
        } catch (error) {
            console.error('Error toggling model:', error);
            this.showNotification('Error updating model status', 'error');
        }
    }

    async retrainModel(algorithm) {
        if (!confirm(`Are you sure you want to retrain the ${algorithm} model? This may take several minutes.`)) {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/admin/ai/models/${algorithm}/retrain`, {
                method: 'POST',
                headers: accountSystem.getAuthHeaders()
            });

            if (response.ok) {
                this.showNotification('Model retraining started. This may take a few minutes.', 'info');
                // Start polling for training status
                this.pollTrainingStatus(algorithm);
            } else {
                this.showNotification('Failed to start model retraining', 'error');
            }
        } catch (error) {
            console.error('Error retraining model:', error);
            this.showNotification('Error starting model retraining', 'error');
        }
    }

    async pollTrainingStatus(algorithm) {
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`${this.baseURL}/admin/ai/models/${algorithm}/training-status`, {
                    headers: accountSystem.getAuthHeaders()
                });

                if (response.ok) {
                    const status = await response.json();
                    
                    if (status.status === 'completed') {
                        clearInterval(pollInterval);
                        this.showNotification(`Model ${algorithm} retraining completed!`, 'success');
                        await this.loadInitialData();
                        this.renderModelPerformance();
                    } else if (status.status === 'failed') {
                        clearInterval(pollInterval);
                        this.showNotification(`Model ${algorithm} retraining failed`, 'error');
                    }
                }
            } catch (error) {
                console.error('Error polling training status:', error);
                clearInterval(pollInterval);
            }
        }, 5000); // Poll every 5 seconds

        // Stop polling after 10 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
        }, 600000);
    }

    // ===== SYSTEM ACTIONS ===== //
    async clearCache() {
        if (!confirm('Are you sure you want to clear all AI caches? This will temporarily slow down recommendations.')) {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/admin/ai/clear-cache`, {
                method: 'POST',
                headers: accountSystem.getAuthHeaders()
            });

            if (response.ok) {
                this.showNotification('Cache cleared successfully', 'success');
            } else {
                this.showNotification('Failed to clear cache', 'error');
            }
        } catch (error) {
            console.error('Error clearing cache:', error);
            this.showNotification('Error clearing cache', 'error');
        }
    }

    async retrainAllModels() {
        if (!confirm('Are you sure you want to retrain ALL AI models? This will take significant time and resources.')) {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/admin/ai/retrain-all`, {
                method: 'POST',
                headers: accountSystem.getAuthHeaders()
            });

            if (response.ok) {
                this.showNotification('All models retraining started. This will take some time.', 'info');
            } else {
                this.showNotification('Failed to start model retraining', 'error');
            }
        } catch (error) {
            console.error('Error retraining all models:', error);
            this.showNotification('Error starting model retraining', 'error');
        }
    }

    async resetSystem() {
        const confirmation = prompt('Type "RESET" to confirm you want to reset the AI system:');
        if (confirmation !== 'RESET') {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/admin/ai/reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...accountSystem.getAuthHeaders()
                },
                body: JSON.stringify({ confirmation: 'RESET' })
            });

            if (response.ok) {
                this.showNotification('AI system reset successfully', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                this.showNotification('Failed to reset AI system', 'error');
            }
        } catch (error) {
            console.error('Error resetting system:', error);
            this.showNotification('Error resetting AI system', 'error');
        }
    }

    // ===== DATA EXPORT ===== //
    async exportData(type = 'all') {
        try {
            const response = await fetch(`${this.baseURL}/admin/ai/export/${type}`, {
                headers: accountSystem.getAuthHeaders()
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ai-data-${type}-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                this.showNotification('Data exported successfully', 'success');
            } else {
                this.showNotification('Failed to export data', 'error');
            }
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showNotification('Error exporting data', 'error');
        }
    }

    // ===== DASHBOARD MANAGEMENT ===== //
    async refreshDashboard() {
        const refreshBtn = document.getElementById('refreshDashboard');
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        }

        try {
            await this.loadInitialData();
            this.setupDashboard();
            this.showNotification('Dashboard refreshed', 'success');
        } catch (error) {
            console.error('Error refreshing dashboard:', error);
            this.showNotification('Error refreshing dashboard', 'error');
        } finally {
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
            }
        }
    }

    startAutoRefresh() {
        this.stopAutoRefresh(); // Clear any existing interval
        this.refreshInterval = setInterval(() => {
            this.loadInitialData().then(() => {
                this.renderOverviewCards();
                this.renderUserEngagement();
                this.renderRecentActivity();
                this.renderSystemHealth();
            });
        }, 30000); // Refresh every 30 seconds
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // ===== UTILITY METHODS ===== //
    calculateTrend(trendData) {
        if (!trendData || trendData.length < 2) {
            return { direction: 'up', percentage: 0 };
        }

        const current = trendData[trendData.length - 1];
        const previous = trendData[trendData.length - 2];
        const change = ((current - previous) / previous) * 100;

        return {
            direction: change >= 0 ? 'up' : 'down',
            percentage: Math.abs(change).toFixed(1)
        };
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        return Math.floor(diff / 86400000) + 'd ago';
    }

    formatAlgorithmName(algorithm) {
        const names = {
            'collaborative_filtering': 'Collaborative Filtering',
            'content_based': 'Content-Based',
            'hybrid': 'Hybrid Model',
            'popularity_based': 'Popularity-Based',
            'deep_learning': 'Deep Learning'
        };
        return names[algorithm] || algorithm.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    getActivityIcon(type) {
        const icons = {
            'recommendation': 'fas fa-lightbulb',
            'training': 'fas fa-brain',
            'feedback': 'fas fa-comment',
            'error': 'fas fa-exclamation-triangle',
            'system': 'fas fa-cog'
        };
        return icons[type] || 'fas fa-info-circle';
    }

    getHealthStatus(value) {
        if (typeof value === 'string') {
            return value.toLowerCase() === 'healthy' ? 'healthy' : 'warning';
        }
        if (typeof value === 'number') {
            if (value < 100) return 'healthy';
            if (value < 500) return 'warning';
            return 'critical';
        }
        return 'unknown';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    showError(message) {
        const mainContent = document.getElementById('adminContent');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="dashboard-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Dashboard Error</h3>
                    <p>${message}</p>
                    <button onclick="aiAdminDashboard.refreshDashboard()" class="retry-btn">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    // ===== CLEANUP ===== //
    destroy() {
        this.stopAutoRefresh();
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        this.charts = {};
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiAdminDashboard = new AIAdminDashboard();
});

// Cleanup when page unloads
window.addEventListener('beforeunload', () => {
    if (window.aiAdminDashboard) {
        window.aiAdminDashboard.destroy();
    }
});