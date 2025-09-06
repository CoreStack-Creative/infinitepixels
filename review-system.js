class ReviewSystem {
    constructor() {
        this.baseURL = 'http://localhost:3000';
        this.currentGameSlug = null;
        this.currentUserId = null;
        this.reviews = [];
        this.currentPage = 1;
        this.reviewsPerPage = 10;
        this.totalReviews = 0;
    }

    // Initialize the review system
    async init(gameSlug) {
        this.currentGameSlug = gameSlug;
        this.currentUserId = accountSystem ? accountSystem.getCurrentUserId() : null;
        
        await this.loadReviews();
        this.setupEventListeners();
    }

    // Load reviews for the current game
    async loadReviews(page = 1) {
        try {
            const headers = this.currentUserId ? accountSystem.getAuthHeaders() : {};
            const response = await fetch(
                `${this.baseURL}/reviews/game/${this.currentGameSlug}?page=${page}&limit=${this.reviewsPerPage}`,
                { headers }
            );

            if (response.ok) {
                const data = await response.json();
                this.reviews = data.reviews || [];
                this.totalReviews = data.total || 0;
                this.currentPage = page;
                this.renderReviews();
                this.renderPagination();
            } else {
                console.error('Failed to load reviews:', response.statusText);
                this.renderEmptyState();
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.renderEmptyState();
        }
    }

    // Render all reviews
    renderReviews() {
        const container = document.querySelector('.reviews-list');
        if (!container) return;

        if (this.reviews.length === 0) {
            this.renderEmptyState();
            return;
        }

        container.innerHTML = this.reviews.map(review => 
            this.renderReview(review)
        ).join('');
    }

    // Render a single review
    renderReview(review) {
        const isCurrentUser = this.currentUserId && review.user_id === this.currentUserId;
        const starsHTML = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        return `
            <div class="review-item ${isCurrentUser ? 'current-user-review' : ''}" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="review-author">
                        <strong>${review.username || 'Anonymous'}</strong>
                        ${isCurrentUser ? '<span class="review-badge">Your Review</span>' : ''}
                    </div>
                    <div class="review-rating">${starsHTML}</div>
                    <div class="review-date">${new Date(review.created_at).toLocaleDateString()}</div>
                </div>
                <div class="review-content">${this.escapeHtml(review.review_text)}</div>
                <div class="review-actions">
                    <button class="helpful-btn ${review.user_found_helpful ? 'helpful-active' : ''}" 
                            onclick="reviewSystem.toggleHelpful('${review.id}', this)" 
                            ${!this.currentUserId ? 'disabled title="Login to vote"' : ''}>
                        👍 Helpful (${review.helpful_count || 0})
                    </button>
                    ${isCurrentUser ? `
                        <button class="edit-review-btn" onclick="reviewSystem.editReview('${review.id}')">
                            Edit
                        </button>
                        <button class="delete-review-btn" onclick="reviewSystem.deleteReview('${review.id}')">
                            Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Render empty state when no reviews
    renderEmptyState() {
        const container = document.querySelector('.reviews-list');
        if (!container) return;

        container.innerHTML = `
            <div class="reviews-empty">
                <h3>No reviews yet</h3>
                <p>Be the first to share your thoughts about this game!</p>
                ${this.currentUserId ? 
                    '<button onclick="reviewSystem.showReviewForm()" class="btn btn-primary">Write a Review</button>' :
                    '<p>Please <a href="#" onclick="accountSystem.showLoginPopup()">login</a> to write a review.</p>'
                }
            </div>
        `;
    }

    // Render pagination controls
    renderPagination() {
        const container = document.querySelector('.review-pagination');
        if (!container) return;

        const totalPages = Math.ceil(this.totalReviews / this.reviewsPerPage);
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button onclick="reviewSystem.loadReviews(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                Previous
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button onclick="reviewSystem.loadReviews(${i})" 
                        ${i === this.currentPage ? 'class="current-page"' : ''}>
                    ${i}
                </button>
            `;
        }

        // Next button
        paginationHTML += `
            <button onclick="reviewSystem.loadReviews(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                Next
            </button>
        `;

        container.innerHTML = paginationHTML;
    }

    // Toggle helpful vote on a review
    async toggleHelpful(reviewId, buttonElement) {
        if (!this.currentUserId) {
            alert('Please login to vote on reviews');
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/reviews/${reviewId}/helpful`, {
                method: 'POST',
                headers: accountSystem.getAuthHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                
                // Update button state
                buttonElement.classList.toggle('helpful-active');
                buttonElement.innerHTML = `👍 Helpful (${data.helpful_count})`;
                
                // Update the review in our local data
                const review = this.reviews.find(r => r.id === reviewId);
                if (review) {
                    review.helpful_count = data.helpful_count;
                    review.user_found_helpful = data.user_found_helpful;
                }
            } else {
                console.error('Failed to toggle helpful vote:', response.statusText);
                alert('Failed to update vote. Please try again.');
            }
        } catch (error) {
            console.error('Error toggling helpful vote:', error);
            alert('Network error. Please try again.');
        }
    }

    // Show review form
    showReviewForm(editReviewId = null) {
        if (!this.currentUserId) {
            accountSystem.showLoginPopup();
            return;
        }

        const existingForm = document.querySelector('.review-form');
        if (existingForm) {
            existingForm.remove();
        }

        const reviewToEdit = editReviewId ? this.reviews.find(r => r.id === editReviewId) : null;
        
        const formHTML = `
            <div class="review-form">
                <h3>${editReviewId ? 'Edit Your Review' : 'Write a Review'}</h3>
                <div class="star-rating-input">
                    <label>Rating:</label>
                    <div class="star-rating">
                        ${[1, 2, 3, 4, 5].map(rating => `
                            <span class="star ${reviewToEdit && reviewToEdit.rating >= rating ? 'selected' : ''}" 
                                  data-rating="${rating}" 
                                  onclick="reviewSystem.setRating(${rating})">★</span>
                        `).join('')}
                    </div>
                </div>
                <textarea id="reviewText" placeholder="Share your thoughts about this game..." 
                          maxlength="1000">${reviewToEdit ? reviewToEdit.review_text : ''}</textarea>
                <div class="review-form-actions">
                    <button onclick="reviewSystem.submitReview('${editReviewId || ''}')" id="submitReviewBtn">
                        ${editReviewId ? 'Update Review' : 'Submit Review'}
                    </button>
                    <button onclick="reviewSystem.hideReviewForm()" class="btn-secondary">Cancel</button>
                </div>
            </div>
        `;

        const container = document.querySelector('.reviews-container');
        if (container) {
            container.insertAdjacentHTML('afterbegin', formHTML);
            this.selectedRating = reviewToEdit ? reviewToEdit.rating : 0;
        }
    }

    // Hide review form
    hideReviewForm() {
        const form = document.querySelector('.review-form');
        if (form) {
            form.remove();
        }
    }

    // Set rating in the form
    setRating(rating) {
        this.selectedRating = rating;
        document.querySelectorAll('.star-rating .star').forEach((star, index) => {
            star.classList.toggle('selected', index < rating);
        });
    }

    // Submit a new review or edit existing one
    async submitReview(editReviewId = '') {
        if (!this.currentUserId) {
            alert('Please login to submit a review');
            return;
        }

        const reviewText = document.getElementById('reviewText').value.trim();
        if (!reviewText || !this.selectedRating) {
            alert('Please provide both a rating and review text');
            return;
        }

        const submitBtn = document.getElementById('submitReviewBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = editReviewId ? 'Updating...' : 'Submitting...';

        try {
            const url = editReviewId ? 
                `${this.baseURL}/reviews/${editReviewId}` : 
                `${this.baseURL}/reviews`;
            
            const method = editReviewId ? 'PUT' : 'POST';
            
            const body = {
                rating: this.selectedRating,
                review_text: reviewText
            };

            if (!editReviewId) {
                body.game_slug = this.currentGameSlug;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    ...accountSystem.getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                this.hideReviewForm();
                await this.loadReviews(this.currentPage);
                alert(editReviewId ? 'Review updated successfully!' : 'Review submitted successfully!');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Network error. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = editReviewId ? 'Update Review' : 'Submit Review';
        }
    }

    // Edit a review
    editReview(reviewId) {
        this.showReviewForm(reviewId);
    }

    // Delete a review
    async deleteReview(reviewId) {
        if (!confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: accountSystem.getAuthHeaders()
            });

            if (response.ok) {
                await this.loadReviews(this.currentPage);
                alert('Review deleted successfully');
            } else {
                alert('Failed to delete review');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Network error. Please try again.');
        }
    }

    // Load review statistics for the current game
    async loadReviewStats() {
        try {
            const response = await fetch(`${this.baseURL}/reviews/game/${this.currentGameSlug}/stats`);
            if (response.ok) {
                const stats = await response.json();
                this.renderReviewStats(stats);
            }
        } catch (error) {
            console.error('Error loading review stats:', error);
        }
    }

    // Render review statistics
    renderReviewStats(stats) {
        const container = document.querySelector('.review-stats');
        if (!container) return;

        container.innerHTML = `
            <div class="review-stat-card">
                <span class="review-stat-number">${stats.total_reviews || 0}</span>
                <span class="review-stat-label">Total Reviews</span>
            </div>
            <div class="review-stat-card">
                <span class="review-stat-number">${stats.average_rating ? stats.average_rating.toFixed(1) : '0.0'}</span>
                <span class="review-stat-label">Average Rating</span>
            </div>
            <div class="review-stat-card">
                <span class="review-stat-number">${stats.helpful_reviews || 0}</span>
                <span class="review-stat-label">Helpful Reviews</span>
            </div>
        `;
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for account system changes
        document.addEventListener('accountStatusChanged', () => {
            this.currentUserId = accountSystem ? accountSystem.getCurrentUserId() : null;
            this.loadReviews(this.currentPage);
        });

        // Add write review button if user is logged in
        if (this.currentUserId) {
            const writeBtn = document.querySelector('.write-review-btn');
            if (writeBtn) {
                writeBtn.style.display = 'block';
                writeBtn.onclick = () => this.showReviewForm();
            }
        }
    }

    // Utility function to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Get current user ID
    getCurrentUserId() {
        return this.currentUserId;
    }

    // Refresh reviews (useful after login/logout)
    async refresh() {
        this.currentUserId = accountSystem ? accountSystem.getCurrentUserId() : null;
        await this.loadReviews(1);
        await this.loadReviewStats();
    }
}

// Initialize global review system instance
const reviewSystem = new ReviewSystem();

// Auto-initialize on page load if game slug is available
document.addEventListener('DOMContentLoaded', () => {
    // Try to get game slug from URL or page data
    const gameSlug = window.location.pathname.split('/').pop().replace('.html', '') || 
                    document.querySelector('[data-game-slug]')?.dataset.gameSlug;
    
    if (gameSlug && gameSlug !== 'index') {
        reviewSystem.init(gameSlug);
    }
});
