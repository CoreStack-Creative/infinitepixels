// Debug script for homepage games loading issues
// Add this temporarily to the end of index.html to debug

console.log('=== HOMEPAGE DEBUG START ===');

// Check if games database is loaded
console.log('Games database loaded:', typeof gamesDatabase !== 'undefined' && gamesDatabase ? gamesDatabase.length : 'NO');

// Check if DOM elements exist
const homepageGamesGrid = document.getElementById('homepageGamesGrid');
const featuredGamesGrid = document.getElementById('featuredGamesGrid');
const homepageCategoryGrid = document.getElementById('homepageCategoryGrid');
const homepageMultiplayerGrid = document.getElementById('homepageMultiplayerGrid');
const homepageNewGrid = document.getElementById('homepageNewGrid');
const homepageReviewsGrid = document.getElementById('homepageReviewsGrid');

console.log('DOM Elements found:');
console.log('- homepageGamesGrid:', !!homepageGamesGrid);
console.log('- featuredGamesGrid:', !!featuredGamesGrid);
console.log('- homepageCategoryGrid:', !!homepageCategoryGrid);
console.log('- homepageMultiplayerGrid:', !!homepageMultiplayerGrid);
console.log('- homepageNewGrid:', !!homepageNewGrid);
console.log('- homepageReviewsGrid:', !!homepageReviewsGrid);

// Check if manager is initialized
console.log('Homepage manager:', typeof homepageGamesManager !== 'undefined' ? 'EXISTS' : 'NOT FOUND');

// Check cookie consent status
if (typeof Cookiebot !== 'undefined') {
    console.log('Cookiebot consent status:');
    console.log('- Consent given:', Cookiebot.consent);
    console.log('- Statistics:', Cookiebot.consent.statistics);
    console.log('- Marketing:', Cookiebot.consent.marketing);
    console.log('- Preferences:', Cookiebot.consent.preferences);
} else {
    console.log('Cookiebot not found');
}

// Try to manually initialize if needed
setTimeout(() => {
    console.log('=== MANUAL INITIALIZATION ATTEMPT ===');
    if (typeof gamesDatabase !== 'undefined' && gamesDatabase && gamesDatabase.length > 0) {
        console.log('Games database available, trying manual init...');
        
        if (typeof initializeHomepageGamesManager === 'function') {
            const result = initializeHomepageGamesManager();
            console.log('Manual homepage manager init result:', result);
        }
        
        // Try to populate grids manually if manager failed
        if (homepageGamesGrid && homepageGamesGrid.children.length === 0) {
            console.log('Homepage grid empty, trying manual population...');
            const testGames = gamesDatabase.slice(0, 6);
            homepageGamesGrid.innerHTML = testGames.map(game => `
                <div class="game-card" style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
                    <h3>${game.name}</h3>
                    <img src="${game.image}" alt="${game.name}" style="width: 100%; height: 150px; object-fit: cover;">
                    <a href="game.html?game=${game.slug}" style="color: blue;">Play Now</a>
                </div>
            `).join('');
            console.log('Manual population complete');
        }
    } else {
        console.log('Games database not available for manual init');
    }
}, 2000);

console.log('=== HOMEPAGE DEBUG END ===');
