export interface Review {
  review_id: string;
  game_id: string;
  author: string;
  rating: number;
  excerpt: string;
  body: string;
  created_at: string;
}

export interface ReviewsState {
  reviews: Record<string, Review[]>; // gameId -> Review[]
  loading: boolean;
  error: string | null;
}

export interface OverlayPosition {
  x: number;
  y: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}
