// Simple games endpoint that returns games data directly
// This avoids file system issues in serverless environments

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
    // For now, we'll use a simple approach: try to import or fallback to sample data
    // This will be updated once we confirm the file structure
    
    const sampleGames = [
      {
        id: 1,
        name: "1v1 Lol",
        image: "images/1v1lolimage.jpg",
        slug: "1v1lol",
        gameurl: "https://1v1.lol/",
        tags: ["shooter", "action", "multiplayer"],
        category: "action",
        featured: true
      },
      {
        id: 2,
        name: "2048 Legend",
        image: "images/2048legendimage.jpg", 
        slug: "2048legend",
        gameurl: "https://2048legend.com/",
        tags: ["puzzle", "numbers"],
        category: "puzzle"
      },
      {
        id: 3,
        name: "Cookie Clicker",
        image: "images/cookieclickerimage.jpg",
        slug: "cookieclicker", 
        gameurl: "https://orteil.dashnet.org/cookieclicker/",
        tags: ["idle", "clicker"],
        category: "idle"
      }
    ];

    // Apply filters from query parameters
    const { category, search, limit } = req.query;
    let filteredGames = sampleGames;
    
    if (category) {
      filteredGames = filteredGames.filter(game => 
        game.category?.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredGames = filteredGames.filter(game =>
        game.name?.toLowerCase().includes(searchTerm) ||
        game.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
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
      total: sampleGames.length,
      status: "working_with_sample_data"
    });
    
  } catch (error) {
    console.error('Games API error:', error);
    res.status(500).json({ 
      error: 'Failed to load games',
      message: error.message 
    });
  }
}
