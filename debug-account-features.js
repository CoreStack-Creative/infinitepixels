// Debug script for account features
// Add this to any page to debug Recent and Favorites functionality

console.log('🔧 === ACCOUNT FEATURES DEBUG ===');

// Check if all required scripts are loaded
console.log('📚 Script Availability Check:');
console.log('- window.accountSystem:', !!window.accountSystem);
console.log('- window.favoritesManager:', !!window.favoritesManager);
console.log('- window.recentGamesManager:', !!window.recentGamesManager);
console.log('- window.recentlyPlayedManager:', !!window.recentlyPlayedManager);
console.log('- window.gamesDatabase:', !!window.gamesDatabase, window.gamesDatabase?.length || 'not loaded');

// Check localStorage data
console.log('💾 LocalStorage Data Check:');
const recentKey = 'infinitePixels_recentlyPlayed';
const favoritesKey = 'infinitepixels_favorites';

const recentData = localStorage.getItem(recentKey);
const favoritesData = localStorage.getItem(favoritesKey);

console.log('- Recent games storage key:', recentKey);
console.log('- Recent games data:', recentData ? JSON.parse(recentData).length + ' games' : 'empty');
console.log('- Favorites storage key:', favoritesKey);
console.log('- Favorites data:', favoritesData ? JSON.parse(favoritesData).length + ' games' : 'empty');

// Show all localStorage keys that might be related
console.log('🗂️ All Related LocalStorage Keys:');
Object.keys(localStorage).forEach(key => {
    if (key.toLowerCase().includes('infinite') || key.toLowerCase().includes('recent') || key.toLowerCase().includes('favorite')) {
        console.log(`- ${key}:`, localStorage.getItem(key) ? 'has data' : 'empty');
    }
});

// Check if account system is working
if (window.accountSystem) {
    console.log('👤 Account System Status:');
    console.log('- Is ready:', window.accountSystem.isReady);
    console.log('- Is logged in:', window.accountSystem.isLoggedIn());
    console.log('- User:', window.accountSystem.user?.email || 'not logged in');
    console.log('- Session:', !!window.accountSystem.session);
}

// Check current page
console.log('📍 Current Page:', window.location.pathname);

// Test functions
window.debugAccountFeatures = {
    testAddRecent: (gameSlug = 'cookieclicker') => {
        console.log('🧪 Testing add to recent:', gameSlug);
        if (window.accountSystem) {
            window.accountSystem.addToRecentGames(gameSlug);
        }
        if (window.recentlyPlayedManager) {
            window.recentlyPlayedManager.addGameToRecent(gameSlug);
        }
    },
    
    testAddFavorite: (gameSlug = 'cookieclicker') => {
        console.log('🧪 Testing add to favorites:', gameSlug);
        if (window.favoritesManager) {
            window.favoritesManager.addToFavorites(gameSlug);
        }
    },
    
    clearAll: () => {
        console.log('🧹 Clearing all data...');
        localStorage.removeItem(recentKey);
        localStorage.removeItem(favoritesKey);
        if (window.recentGamesManager?.loadRecentGames) {
            window.recentGamesManager.loadRecentGames();
        }
        if (window.favoritesManager?.renderFavoritesPage) {
            window.favoritesManager.renderFavoritesPage();
        }
    },
    
    testData: () => {
        console.log('🧪 Adding test data...');
        // Add test recent games
        const testRecent = [
            { slug: 'cookieclicker', lastPlayed: Date.now() - 1000 },
            { slug: '1v1lol', lastPlayed: Date.now() - 2000 },
            { slug: 'slope', lastPlayed: Date.now() - 3000 }
        ];
        localStorage.setItem(recentKey, JSON.stringify(testRecent));
        
        // Add test favorites
        const testFavorites = ['cookieclicker', '1v1lol', 'slope'];
        localStorage.setItem(favoritesKey, JSON.stringify(testFavorites));
        
        console.log('✅ Test data added. Refreshing pages...');
        
        // Refresh displays
        if (window.recentGamesManager?.loadRecentGames) {
            window.recentGamesManager.loadRecentGames();
        }
        if (window.favoritesManager?.renderFavoritesPage) {
            window.favoritesManager.renderFavoritesPage();
        }
    }
};

console.log('🔧 Debug functions available:');
console.log('- debugAccountFeatures.testAddRecent("gameSlug")');
console.log('- debugAccountFeatures.testAddFavorite("gameSlug")');
console.log('- debugAccountFeatures.clearAll()');
console.log('- debugAccountFeatures.testData()');
console.log('🔧 === END DEBUG ===');
