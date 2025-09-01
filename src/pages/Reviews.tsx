import React from 'react';
import { GameReviews } from '../components/GameReviews';
import { useSupabaseReviews } from '../hooks/useSupabaseReviews';

// Mock data - replace with your actual game data source
const games = [
  { id: 'game-1', title: 'Pixel Adventure' },
  { id: 'game-2', title: 'Neon Racing' },
  { id: 'game-3', title: 'Space Explorer' },
];

export function ReviewsPage() {
  const gameIds = games.map(game => game.id);
  
  // Pre-fetch all reviews for visible games (batch query)
  useSupabaseReviews(gameIds);

  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Game Reviews
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover what players think about our games. Hover over reviews to read the full content.
        </p>
      </header>

      {games.map((game) => (
        <GameReviews
          key={game.id}
          gameId={game.id}
          gameTitle={game.title}
        />
      ))}
    </main>
  );
}
