import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Review } from '../types/reviews';

interface ReviewOverlayProps {
  review: Review;
  overlayId: string;
  overlay: {
    refs: any;
    floatingStyles: React.CSSProperties;
    arrowRef: React.RefObject<HTMLDivElement>;
    middlewareData: any;
    handlers: {
      overlay: {
        onMouseEnter: () => void;
        onMouseLeave: () => void;
      };
    };
  };
}

export function ReviewOverlay({ review, overlayId, overlay }: ReviewOverlayProps) {
  const { refs, floatingStyles, arrowRef, middlewareData, handlers } = overlay;

  // Focus management for accessibility
  useEffect(() => {
    const overlayElement = refs.floating.current;
    if (overlayElement) {
      // Don't steal focus, but ensure it's focusable for screen readers
      overlayElement.setAttribute('tabindex', '-1');
    }
  }, [refs.floating]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        aria-hidden="true"
      >
        ★
      </span>
    ));
  };

  const arrowStyles: React.CSSProperties = middlewareData.arrow ? {
    left: middlewareData.arrow.x != null ? `${middlewareData.arrow.x}px` : '',
    top: middlewareData.arrow.y != null ? `${middlewareData.arrow.y}px` : '',
  } : {};

  return createPortal(
    <div
      ref={refs.setFloating}
      id={overlayId}
      style={floatingStyles}
      className="z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-md animate-in fade-in zoom-in-95 duration-200"
      role="region"
      aria-labelledby={`${overlayId}-title`}
      {...handlers.overlay}
    >
      {/* Arrow */}
      <div
        ref={arrowRef}
        style={arrowStyles}
        className="absolute w-3 h-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rotate-45 -translate-y-1/2"
      />

      <article className="relative">
        <header className="mb-4">
          <h2
            id={`${overlayId}-title`}
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            Review by {review.author}
          </h2>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1" aria-label={`Rating: ${review.rating} out of 5 stars`}>
              {renderStars(review.rating)}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {review.rating}/5
              </span>
            </div>
            
            <time 
              className="text-sm text-gray-500 dark:text-gray-400"
              dateTime={review.created_at}
            >
              {new Date(review.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {review.body}
          </p>
        </div>

        <footer className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <a
            href={`/games/${review.game_id}/reviews/${review.review_id}`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            View full review page →
          </a>
        </footer>
      </article>
    </div>,
    document.body
  );
}
