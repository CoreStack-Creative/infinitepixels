import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read games.json file
    const gamesPath = path.join(process.cwd(), 'games.json');
    const gamesData = fs.readFileSync(gamesPath, 'utf8');
    const games = JSON.parse(gamesData);
    
    // Apply any filters from query parameters
    const { category, search, limit } = req.query;
    let filteredGames = games;
    
    if (category) {
      filteredGames = filteredGames.filter(game => 
        game.category?.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredGames = filteredGames.filter(game =>
        game.title?.toLowerCase().includes(searchTerm) ||
        game.description?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredGames = filteredGames.slice(0, limitNum);
      }
    }
    
    res.status(200).json({
      games: filteredGames,
      count: filteredGames.length,
      total: games.length
    });
    
  } catch (error) {
    console.error('Games API error:', error);
    res.status(500).json({ 
      error: 'Failed to load games',
      message: error.message 
    });
  }
}
