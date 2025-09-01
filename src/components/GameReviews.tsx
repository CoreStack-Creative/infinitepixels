import React from 'react';
import { ReviewPreview } from './ReviewPreview';
import { useSupabaseReviews } from '../hooks/useSupabaseReviews';

interface GameReviewsProps {
  gameId: string;
  gameTitle: string;
  className?: string;
}

export function GameReviews({ gameId, gameTitle, className = '' }: GameReviewsProps) {
  const { getReviewsByGameId, loading, error } = useSupabaseReviews([gameId]);
  const reviews = getReviewsByGameId(gameId);

  if (loading) {
    return (
      <section className={`space-y-4 ${className}`} aria-label={`Reviews for ${gameTitle}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Reviews
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse text-gray-500">Loading reviews...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`space-y-4 ${className}`} aria-label={`Reviews for ${gameTitle}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Reviews
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">
            Failed to load reviews: {error}
          </p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className={`space-y-4 ${className}`} aria-label={`Reviews for ${gameTitle}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Reviews
        </h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No reviews yet. Be the first to review this game!
        </div>
      </section>
    );
  }

  return (
    <section className={`space-y-4 ${className}`} aria-label={`Reviews for ${gameTitle}`}>
      <header>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Reviews ({reviews.length})
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Hover or focus on a review to see the full content
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="feed" aria-label="Review previews">
        {reviews.map((review) => (
          <ReviewPreview
            key={review.review_id}
            review={review}
            className="h-fit"
          />
        ))}
      </div>
    </section>
  );
}
