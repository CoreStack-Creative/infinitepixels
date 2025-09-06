// Favorites Page Manager - Updated to work with improved FavoritesManager
// This file now serves as a bridge to the main FavoritesManager in javascript.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 DEBUG: Favorites page script loaded');
    
    // Check if the main FavoritesManager is available
    if (window.favoritesManager) {
        console.log('✅ Using existing FavoritesManager');
        // The main FavoritesManager handles everything now
    } else {
        console.log('⏳ Waiting for FavoritesManager to be ready...');
        
        // Wait for the FavoritesManager to be initialized
        const waitForFavoritesManager = () => {
            if (window.favoritesManager) {
                console.log('✅ FavoritesManager now available');
                // The initialization is handled in javascript.js
            } else {
                setTimeout(waitForFavoritesManager, 100);
            }
        };
        
        waitForFavoritesManager();
    }
    
    // Set up global functions that might be called from HTML
    window.removeFavoriteFromGrid = async function(gameSlug) {
        if (window.favoritesManager) {
            try {
                await window.favoritesManager.removeFromFavorites(gameSlug);
                // The page will refresh automatically through the existing system
                if (typeof window.favoritesManager.initFavoritesPage === 'function') {
                    window.favoritesManager.initFavoritesPage();
                }
            } catch (error) {
                console.error('Error removing favorite:', error);
            }
        }
    };
    
    // Provide a fallback function for login prompts
    window.showLoginMessage = function() {
        alert('Please log in to manage your favorite games.');
    };
});
