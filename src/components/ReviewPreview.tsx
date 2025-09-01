import React from 'react';
import { Review } from '../types/reviews';
import { ReviewOverlay } from './ReviewOverlay';
import { useReviewOverlay } from '../hooks/useReviewOverlay';

interface ReviewPreviewProps {
  review: Review;
  className?: string;
}

export function ReviewPreview({ review, className = '' }: ReviewPreviewProps) {
  const overlay = useReviewOverlay();
  const overlayId = `review-overlay-${review.review_id}`;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        aria-hidden="true"
      >
        ★
      </span>
    ));
  };

  return (
    <>
      <article
        ref={overlay.refs.setReference}
        className={`
          bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border 
          border-gray-200 dark:border-gray-700 cursor-pointer
          hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-all duration-200 ${className}
        `}
        tabIndex={0}
        role="button"
        aria-expanded={overlay.isOpen}
        aria-controls={overlayId}
        aria-label={`Review by ${review.author}, ${review.rating} stars. Click to expand.`}
        {...overlay.handlers.trigger}
      >
        <header className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {review.author}
            </h3>
            <div className="flex items-center gap-1" aria-label={`Rating: ${review.rating} out of 5 stars`}>
              {renderStars(review.rating)}
              <span className="sr-only">{review.rating} out of 5 stars</span>
            </div>
          </div>
          <time 
            className="text-sm text-gray-500 dark:text-gray-400"
            dateTime={review.created_at}
          >
            {new Date(review.created_at).toLocaleDateString()}
          </time>
        </header>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
          {review.excerpt}
        </p>
        
        <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
          Read full review →
        </div>
      </article>

      {overlay.isOpen && (
        <ReviewOverlay
          review={review}
          overlayId={overlayId}
          overlay={overlay}
        />
      )}
    </>
  );
}
