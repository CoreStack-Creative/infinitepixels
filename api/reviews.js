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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get reviews for a game
      const { game_id } = req.query;
      
      if (!game_id) {
        return res.status(400).json({ error: 'Game ID is required' });
      }

      const { data: reviews, error } = await supabase
        .from('game_reviews')
        .select(`
          *,
          users!game_reviews_user_id_fkey(username)
        `)
        .eq('game_id', game_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Reviews fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch reviews' });
      }

      return res.status(200).json({ reviews });
    }

    if (req.method === 'POST') {
      // Create a new review
      const user = await authenticateUser(req);
      const { game_id, rating, review_text } = req.body;

      if (!game_id || !rating) {
        return res.status(400).json({ error: 'Game ID and rating are required' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      // Check if user already reviewed this game
      const { data: existing } = await supabase
        .from('game_reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('game_id', game_id)
        .single();

      if (existing) {
        // Update existing review
        const { data: review, error } = await supabase
          .from('game_reviews')
          .update({
            rating,
            review_text,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error('Review update error:', error);
          return res.status(500).json({ error: 'Failed to update review' });
        }

        return res.status(200).json({ review, updated: true });
      } else {
        // Create new review
        const { data: review, error } = await supabase
          .from('game_reviews')
          .insert([{
            user_id: user.id,
            game_id,
            rating,
            review_text,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) {
          console.error('Review creation error:', error);
          return res.status(500).json({ error: 'Failed to create review' });
        }

        return res.status(201).json({ review, created: true });
      }
    }

    if (req.method === 'DELETE') {
      // Delete a review
      const user = await authenticateUser(req);
      const { review_id } = req.body;

      if (!review_id) {
        return res.status(400).json({ error: 'Review ID is required' });
      }

      const { error } = await supabase
        .from('game_reviews')
        .delete()
        .eq('id', review_id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Review deletion error:', error);
        return res.status(500).json({ error: 'Failed to delete review' });
      }

      return res.status(200).json({ message: 'Review deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Reviews API error:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
