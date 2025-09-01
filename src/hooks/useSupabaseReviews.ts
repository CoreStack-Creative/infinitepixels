import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Review, ReviewsState } from '../types/reviews';

export function useSupabaseReviews(gameIds: string[]) {
  const [state, setState] = useState<ReviewsState>({
    reviews: {},
    loading: false,
    error: null,
  });

  const fetchReviews = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .in('game_id', ids)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Normalize by game_id
      const normalized = data.reduce((acc, review) => {
        if (!acc[review.game_id]) acc[review.game_id] = [];
        acc[review.game_id].push(review);
        return acc;
      }, {} as Record<string, Review[]>);

      setState(prev => ({
        ...prev,
        reviews: { ...prev.reviews, ...normalized },
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch reviews',
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    const newGameIds = gameIds.filter(id => !state.reviews[id]);
    if (newGameIds.length > 0) {
      fetchReviews(newGameIds);
    }
  }, [gameIds, fetchReviews, state.reviews]);

  const getReviewsByGameId = useCallback((gameId: string): Review[] => {
    return state.reviews[gameId] || [];
  }, [state.reviews]);

  const getReviewById = useCallback((reviewId: string): Review | null => {
    for (const reviews of Object.values(state.reviews)) {
      const review = reviews.find(r => r.review_id === reviewId);
      if (review) return review;
    }
    return null;
  }, [state.reviews]);

  return {
    ...state,
    getReviewsByGameId,
    getReviewById,
    refetch: () => fetchReviews(gameIds),
  };
}
