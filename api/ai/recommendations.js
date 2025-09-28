import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

// Middleware to verify user authentication
async function authenticateUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new Error('No token provided');
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw new Error('Invalid token');
  }

  return user;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await authenticateUser(req);
    const { limit = 10 } = req.query;

    // Get user's game preferences and history
    const { data: gameHistory, error: historyError } = await supabase
      .from('game_sessions')
      .select('game_id, duration_seconds, completion_rate')
      .eq('user_id', user.id)
      .order('session_start', { ascending: false })
      .limit(50);

    if (historyError) {
      console.error('History fetch error:', historyError);
      return res.status(500).json({ error: 'Failed to fetch game history' });
    }

    // Get user's favorites
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select('game_id')
      .eq('user_id', user.id);

    if (favoritesError) {
      console.error('Favorites fetch error:', favoritesError);
      return res.status(500).json({ error: 'Failed to fetch favorites' });
    }

    // Simple recommendation algorithm based on:
    // 1. Games similar to favorites
    // 2. Games in categories the user plays most
    // 3. Popular games the user hasn't played
    
    const playedGameIds = [...new Set(gameHistory.map(session => session.game_id))];
    const favoriteGameIds = favorites.map(fav => fav.game_id);
    
    // Get category preferences from game history
    const categoryCount = {};
    gameHistory.forEach(session => {
      // This would need game metadata to determine categories
      // For now, we'll use a simple popularity-based approach
    });

    // Get popular games that the user hasn't played
    const { data: popularGames, error: popularError } = await supabase
      .from('game_sessions')
      .select('game_id, COUNT(*) as play_count')
      .not('game_id', 'in', `(${playedGameIds.join(',')})`)
      .group('game_id')
      .order('play_count', { ascending: false })
      .limit(parseInt(limit));

    if (popularError) {
      console.error('Popular games fetch error:', popularError);
      // Return empty recommendations if query fails
      return res.status(200).json({ 
        recommendations: [],
        algorithm: 'fallback'
      });
    }

    const recommendations = popularGames.map(game => ({
      game_id: game.game_id,
      reason: 'Popular among other players',
      confidence: 0.7
    }));

    return res.status(200).json({
      recommendations,
      algorithm: 'popularity_based',
      user_id: user.id
    });

  } catch (error) {
    console.error('AI recommendations error:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ 
      error: 'Internal server error',
      recommendations: [] // Return empty array as fallback
    });
  }
}
