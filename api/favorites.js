import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const user = await authenticateUser(req);

    if (req.method === 'GET') {
      // Get user's favorites
      const { data: favorites, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Favorites fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch favorites' });
      }

      return res.status(200).json({ favorites });
    }

    if (req.method === 'POST') {
      // Add to favorites
      const { game_id, game_title, game_image } = req.body;

      if (!game_id) {
        return res.status(400).json({ error: 'Game ID is required' });
      }

      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('game_id', game_id)
        .single();

      if (existing) {
        return res.status(409).json({ error: 'Game already in favorites' });
      }

      // Add to favorites
      const { data: favorite, error } = await supabase
        .from('favorites')
        .insert([{
          user_id: user.id,
          game_id,
          game_title,
          game_image,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Favorite creation error:', error);
        return res.status(500).json({ error: 'Failed to add favorite' });
      }

      return res.status(201).json({ favorite });
    }

    if (req.method === 'DELETE') {
      // Remove from favorites
      const { game_id } = req.body;

      if (!game_id) {
        return res.status(400).json({ error: 'Game ID is required' });
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('game_id', game_id);

      if (error) {
        console.error('Favorite deletion error:', error);
        return res.status(500).json({ error: 'Failed to remove favorite' });
      }

      return res.status(200).json({ message: 'Favorite removed successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Favorites API error:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
