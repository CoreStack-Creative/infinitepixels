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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const user = await authenticateUser(req);

    if (req.method === 'GET') {
      // Get user's game sessions
      const { limit = 50 } = req.query;
      
      const { data: sessions, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_start', { ascending: false })
        .limit(parseInt(limit));

      if (error) {
        console.error('Sessions fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch sessions' });
      }

      return res.status(200).json({ sessions });
    }

    if (req.method === 'POST') {
      // Start a new game session
      const { game_id, device_type = 'desktop', game_metadata } = req.body;
      
      if (!game_id) {
        return res.status(400).json({ error: 'Game ID is required' });
      }

      const { data: session, error } = await supabase
        .from('game_sessions')
        .insert([{
          user_id: user.id,
          game_id: game_id,
          device_type: device_type,
          session_start: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Session creation error:', error);
        return res.status(500).json({ error: 'Failed to create session' });
      }

      return res.status(201).json({ 
        success: true, 
        session: session 
      });
    }

    if (req.method === 'PUT') {
      // End a game session
      const { session_id, duration_seconds, interactions_count, completion_rate, exit_reason } = req.body;
      
      if (!session_id) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      const { error } = await supabase
        .from('game_sessions')
        .update({
          session_end: new Date().toISOString(),
          duration_seconds: duration_seconds,
          interactions_count: interactions_count,
          completion_rate: completion_rate,
          exit_reason: exit_reason
        })
        .eq('id', session_id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Session update error:', error);
        return res.status(500).json({ error: 'Failed to end session' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Game sessions API error:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
