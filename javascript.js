// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.getElementById('mainContent');
const gameCards = document.querySelectorAll('.game-card');
const navLinks = document.querySelectorAll('.nav-links a');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Sample Game Data (Replace with your actual data source)
const gameData = [
    { name: "Stellar Odyssey", category: "Space" },
    { name: "Cyber Runner", category: "Cyberpunk" },
    { name: "Mystic Realms", category: "Fantasy" },
    { name: "Pixel Warriors", category: "Retro" },
    { name: "Neon Strike", category: "Action" },
    { name: "Quantum Puzzle", category: "Puzzle" },
    { name: "Dragon Quest", category: "RPG" },
    { name: "Space Colony", category: "Strategy" },
    { name: "Cosmic Legends", category: "MMORPG" }
];

// Sidebar functionality
let sidebarCollapsed = false;

// DOM references for Paper.io simulation
const gameCanvas = document.getElementById('gameCanvas');
const gameContainer = document.getElementById('gameContainer');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const gameControlBar = document.getElementById('gameControlBar');
const collapseArrow = document.getElementById('collapseArrow');
const shareBtn = document.getElementById('shareBtn');
const shareModal = document.getElementById('shareModal');
const closeModal = document.getElementById('closeModal');
const copyBtn = document.getElementById('copyBtn');
const shareLink = document.getElementById('shareLink');
const shareMessage = document.getElementById('shareMessage');
const gameItems = document.querySelectorAll('.game-item');

let isFullscreen = false;
let barCollapsed = false;

// Initialize Paper.io game simulation
function initializeGame() {
    const canvas = gameCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Game state
    let player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        trail: [],
        territory: [],
        color: '#8a2be2'
    };
    
    let particles = [];
    let gameRunning = true;
    
    // Create background particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    // Game loop
    function gameLoop() {
        // Clear canvas
        ctx.fillStyle = 'rgba(26, 26, 62, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw background particles
        particles.forEach(particle => {
            ctx.fillStyle = `rgba(138, 43, 226, ${particle.opacity})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            particle.y += particle.speed;
            if (particle.y > canvas.height) {
                particle.y = -10;
                particle.x = Math.random() * canvas.width;
            }
        });
        
        // Draw game title
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Paper.io', canvas.width / 2, canvas.height / 2 - 50);
        
        ctx.fillStyle = 'rgba(184, 184, 212, 0.8)';
        ctx.font = '20px Arial';
        ctx.fillText('Click to start playing!', canvas.width / 2, canvas.height / 2 + 20);
        
        // Draw animated border
        const time = Date.now() * 0.005;
        ctx.strokeStyle = `hsl(${270 + Math.sin(time) * 30}, 70%, 60%)`;
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        if (gameRunning) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    // Start game loop
    gameLoop();
    
    // Canvas click handler
    canvas.addEventListener('click', () => {
        // Simulate game start
        ctx.fillStyle = 'rgba(26, 26, 62, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Starting...', canvas.width / 2, canvas.height / 2);
        
        setTimeout(() => {
            gameLoop();
        }, 2000);
    });
}

// Sidebar toggle functionality
sidebarToggle.addEventListener('click', () => {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');

    // Selected when menu is open, unselected when closed
    if (!sidebarCollapsed) {
        sidebarToggle.classList.add('selected'); // Selected when open
    } else {
        sidebarToggle.classList.remove('selected'); // Unselected when closed
    }
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Always show bars icon
});

// Search functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();

    if (searchTerm.trim() === '') {
        // Hide results if input is empty
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
        return;
    }

    const filteredGames = gameData.filter(game => 
        game.name.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(filteredGames);
});

function displaySearchResults(results) {
    searchResults.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        // Show "No results found" message
        searchResults.innerHTML = '<p class="no-results">No results found.</p>';
        searchResults.classList.add('active');
    } else {
        // Display results
        results.forEach(game => {
            const resultElement = document.createElement('p');
            resultElement.textContent = game.name;
            resultElement.addEventListener('click', () => {
                // Navigate to game
                console.log(`Navigating to ${game.name}`);
                searchResults.classList.remove('active');
                searchInput.value = '';
            });
            searchResults.appendChild(resultElement);
        });
        searchResults.classList.add('active');
    }
}

// Fullscreen functionality
fullscreenBtn.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
    isFullscreen = !isFullscreen;

    if (isFullscreen) {
        gameContainer.classList.add('fullscreen');
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i><span>Exit Fullscreen</span>';
        gameCanvas.style.width = '100vw';
        gameCanvas.style.height = 'calc(100vh - 60px)';
        collapseArrow.style.display = 'block';
        gameContainer.classList.remove('bar-collapsed');
        barCollapsed = false;

        // Show fullscreen exit message
        showFullscreenMessage();
    } else {
        gameContainer.classList.remove('fullscreen');
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i><span>Fullscreen</span>';
        barCollapsed = false;
        gameControlBar.classList.remove('collapsed');
        collapseArrow.classList.remove('rotated');
        collapseArrow.style.display = '';
        gameContainer.classList.remove('bar-collapsed');
        gameCanvas.style.width = '100%';
        gameCanvas.style.height = 'auto';
        removeFullscreenMessage();
    }
}

// Show fullscreen exit message overlay
function showFullscreenMessage() {
    // Remove any existing overlay first
    removeFullscreenMessage();

    const overlay = document.createElement('div');
    overlay.id = 'fullscreenMessageOverlay';
    overlay.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(30,30,63,0.95);
        color: #fff;
        padding: 16px 32px;
        border-radius: 24px;
        font-size: 1.1rem;
        font-weight: 500;
        z-index: 10010;
        box-shadow: 0 4px 20px rgba(138,43,226,0.25);
        opacity: 0;
        transition: opacity 0.4s;
        pointer-events: none;
    `;
    overlay.textContent = 'To exit fullscreen, press the Escape key';
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 50);

    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            removeFullscreenMessage();
        }, 400);
    }, 3500);
}

function removeFullscreenMessage() {
    const overlay = document.getElementById('fullscreenMessageOverlay');
    if (overlay) {
        overlay.parentNode.removeChild(overlay);
    }
}

// Collapse arrow functionality
collapseArrow.addEventListener('click', () => {
    barCollapsed = !barCollapsed;

    if (isFullscreen) {
        if (barCollapsed) {
            gameContainer.classList.add('bar-collapsed');
            collapseArrow.classList.add('rotated');
            // Arrow stays visible
        } else {
            gameContainer.classList.remove('bar-collapsed');
            collapseArrow.classList.remove('rotated');
        }
    } else {
        if (barCollapsed) {
            gameControlBar.classList.add('collapsed');
            collapseArrow.classList.add('rotated');
        } else {
            gameControlBar.classList.remove('collapsed');
            collapseArrow.classList.remove('rotated');
        }
    }
});

// Share functionality
shareBtn.addEventListener('click', () => {
    shareModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    shareModal.classList.remove('active');
});

shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
        shareModal.classList.remove('active');
    }
});

copyBtn.addEventListener('click', () => {
    shareLink.select();
    shareLink.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        shareMessage.classList.add('show');
        copyBtn.textContent = 'Copied!';
        
        setTimeout(() => {
            shareMessage.classList.remove('show');
            copyBtn.textContent = 'Copy';
        }, 2000);
    } catch (err) {
        console.error('Copy failed:', err);
    }
});

// Navigation link functionality
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Only animate if href is "#" or missing, otherwise let browser navigate
        const href = link.getAttribute('href');
        if (!href || href === '#') {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Add click animation
            link.style.transform = 'translateX(10px)';
            setTimeout(() => {
                link.style.transform = '';
            }, 200);
        }
        // If href is present and not "#", let browser handle navigation
    });
});

// Game item interactions
gameItems.forEach(item => {
    item.addEventListener('click', () => {
        const gameName = item.dataset.game;
        // Try to navigate to the corresponding game page if it exists
        let page = '';
        switch (gameName) {
            case 'slither-io': page = 'slither-io.html'; break;
            case 'agar-io': page = 'agar-io.html'; break;
            case 'hole-io': page = 'hole-io.html'; break;
            case 'wings-io': page = 'wings-io.html'; break;
            case 'zombs-io': page = 'zombs-io.html'; break;
            default: page = '';
        }
        if (page) {
            window.location.href = page;
            return;
        }

        // If no page, just animate
        item.style.transform = 'translateX(10px) scale(0.98)';
        setTimeout(() => {
            item.style.transform = '';
        }, 200);

        // Simulate game navigation
        showGameTransition(gameName);
    });
    
    // Hover effects
    item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = 'rgba(138, 43, 226, 0.15)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = '';
    });
});

// Game transition animation
function showGameTransition(gameName) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(45deg, rgba(138, 43, 226, 0.95), rgba(75, 0, 130, 0.95));
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        opacity: 0;
        transition: opacity 0.4s ease;
    `;

    const loadingText = document.createElement('h2');
    loadingText.textContent = `Loading ${formatGameName(gameName)}...`;
    loadingText.style.cssText = `
        color: white;
        font-size: 2.5rem;
        margin-bottom: 30px;
        animation: pulse 1.5s ease-in-out infinite;
    `;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 300px;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 20px;
    `;

    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #8a2be2, #4b0082);
        border-radius: 3px;
        transition: width 2s ease;
    `;

    progressBar.appendChild(progressFill);
    overlay.appendChild(loadingText);
    overlay.appendChild(progressBar);
    document.body.appendChild(overlay);

    // Animate overlay
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);

    // Animate progress bar
    setTimeout(() => {
        progressFill.style.width = '100%';
    }, 100);

    // Remove overlay
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 400);
    }, 2500);
}

// Format game names
function formatGameName(gameName) {
    return gameName.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    const pixels = document.querySelectorAll('.pixel');

    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }

    pixels.forEach((pixel, index) => {
        const speed = 0.1 + (index * 0.05);
        pixel.style.transform += ` translateY(${scrolled * speed}px)`;
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.game-card, .section-title, .spotlight-text').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Button interactions
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        if (!button.classList.contains('sidebar-toggle')) {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        }
    });

    button.addEventListener('mouseleave', () => {
        if (!button.classList.contains('sidebar-toggle')) {
            button.style.transform = '';
        }
    });

    button.addEventListener('mousedown', () => {
        if (!button.classList.contains('sidebar-toggle')) {
            button.style.transform = 'translateY(0) scale(0.98)';
        }
    });

    button.addEventListener('mouseup', () => {
        if (!button.classList.contains('sidebar-toggle')) {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Toggle sidebar with 'S' key
    if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.altKey && 
        document.activeElement !== searchInput) {
        sidebarToggle.click();
    }

    // Toggle fullscreen with 'F' key
    if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.altKey && 
        document.activeElement !== searchInput) {
        fullscreenBtn.click();
    }

    // Close modals with Escape key
    if (e.key === 'Escape') {
        if (shareModal.classList.contains('active')) {
            shareModal.classList.remove('active');
        }
        // Exit fullscreen if active
        if (isFullscreen) {
            toggleFullscreen();
        }
    }
});

// Window resize handler
function handleResize() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile && !sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
        sidebarCollapsed = true;
        sidebarToggle.classList.remove('selected');
    }

    // Adjust canvas size
    if (!isFullscreen) {
        const container = gameContainer.getBoundingClientRect();
        if (container.width > 0) {
            gameCanvas.style.width = '100%';
            gameCanvas.style.height = 'auto';
        }
    }
}

// Mobile touch gestures
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 100;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && !sidebarCollapsed) {
            // Swipe left - close sidebar
            sidebarToggle.click();
        } else if (diff < 0 && sidebarCollapsed && touchStartX < 50) {
            // Swipe right from left edge - open sidebar
            sidebarToggle.click();
        }
    }
}

// Scroll effects
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const gameSection = document.querySelector('.game-section');
    
    if (gameSection && !isFullscreen) {
        gameSection.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Prevent accidental interactions
searchInput.addEventListener('focus', (e) => {
    e.stopPropagation();
});

searchInput.addEventListener('mousedown', (e) => {
    e.stopPropagation();
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    initializeGame();
    
    // Handle initial responsive state
    handleResize();
    
    // Add load animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Stagger animation of game items
    gameItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 300 + (index * 100));
    });
});

// Window event listeners
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 100);
});

console.log('🎮 Paper.io page loaded successfully! Press "S" to toggle sidebar, "F" for fullscreen.');
// Categories Page JavaScript - Add to end of javascript.js

// Category data for search functionality
const categoryData = [
    { name: "IO Games", category: "io", description: "Multiplayer online games" },
    { name: "Clicker Games", category: "clicker", description: "Addictive idle games" },
    { name: "Action Games", category: "action", description: "Fast-paced games" },
    { name: "Puzzle Games", category: "puzzle", description: "Brain-teasing challenges" },
    { name: "Racing Games", category: "racing", description: "Speed through tracks" },
    { name: "RPG Games", category: "rpg", description: "Role-playing adventures" },
    { name: "Strategy Games", category: "strategy", description: "Plan your moves" },
    { name: "Arcade Games", category: "arcade", description: "Classic arcade-style" },
    { name: "Sports Games", category: "sports", description: "Sports simulation" }
];

// Category card interactions
document.addEventListener('DOMContentLoaded', () => {
    const categoryCards = document.querySelectorAll('.category-card');
    const trendingItems = document.querySelectorAll('.trending-item');

    // Category card click handlers
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            handleCategoryClick(category, card);
        });

        // Hover sound effect simulation
        card.addEventListener('mouseenter', () => {
            card.style.filter = 'brightness(1.1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.filter = '';
        });
    });

    // Trending item click handlers
    trendingItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.dataset.category;
            handleCategoryClick(category, item);
        });
    });

    // Enhanced search for categories
    if (searchInput) {
        const originalSearchHandler = searchInput.oninput;
        
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            
            if (searchTerm.trim() === '') {
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                return;
            }

            // Search in categories
            const filteredCategories = categoryData.filter(cat => 
                cat.name.toLowerCase().includes(searchTerm) ||
                cat.description.toLowerCase().includes(searchTerm)
            );

            // Also search in games if gameData exists
            let filteredGames = [];
            if (typeof gameData !== 'undefined') {
                filteredGames = gameData.filter(game => 
                    game.name.toLowerCase().includes(searchTerm)
                );
            }

            displayCategorySearchResults(filteredCategories, filteredGames);
        });
    }
});

// Handle category click
function handleCategoryClick(category, element) {
    // Add click animation
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 150);

    // Show loading animation
    showCategoryTransition(category);

    // Try to navigate to category page
    const categoryPages = {
        'io': 'categories/io-games.html',
        'clicker': 'categories/clicker-games.html',
        'action': 'categories/action-games.html',
        'puzzle': 'categories/puzzle-games.html',
        'racing': 'categories/racing-games.html',
        'rpg': 'categories/rpg-games.html',
        'strategy': 'categories/strategy-games.html',
        'arcade': 'categories/arcade-games.html',
        'sports': 'categories/sports-games.html'
    };

    setTimeout(() => {
        if (categoryPages[category]) {
            // Try to navigate to specific category page
            window.location.href = categoryPages[category];
        } else {
            // Fallback: navigate to games page with category filter
            window.location.href = `games.html?category=${category}`;
        }
    }, 1000);
}

// Category transition animation
function showCategoryTransition(category) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(45deg, rgba(138, 43, 226, 0.95), rgba(75, 0, 130, 0.95));
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        opacity: 0;
        transition: opacity 0.4s ease;
    `;

    const loadingText = document.createElement('h2');
    loadingText.textContent = `Loading ${formatCategoryName(category)}...`;
    loadingText.style.cssText = `
        color: white;
        font-size: 2.5rem;
        margin-bottom: 30px;
        animation: pulse 1.5s ease-in-out infinite;
        text-align: center;
    `;

    const categoryIcon = document.createElement('div');
    categoryIcon.innerHTML = getCategoryIcon(category);
    categoryIcon.style.cssText = `
        font-size: 4rem;
        color: white;
        margin-bottom: 20px;
        animation: spin 2s linear infinite;
    `;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 300px;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 20px;
    `;

    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #ffffff, #b8b8d4);
        border-radius: 3px;
        transition: width 1s ease;
    `;

    progressBar.appendChild(progressFill);
    overlay.appendChild(categoryIcon);
    overlay.appendChild(loadingText);
    overlay.appendChild(progressBar);
    document.body.appendChild(overlay);

    // Animate overlay
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);

    // Animate progress bar
    setTimeout(() => {
        progressFill.style.width = '100%';
    }, 100);

    // Remove overlay
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 400);
    }, 1200);
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'io': '<i class="fas fa-globe"></i>',
        'clicker': '<i class="fas fa-mouse-pointer"></i>',
        'action': '<i class="fas fa-rocket"></i>',
        'puzzle': '<i class="fas fa-puzzle-piece"></i>',
        'racing': '<i class="fas fa-car"></i>',
        'rpg': '<i class="fas fa-dragon"></i>',
        'strategy': '<i class="fas fa-chess"></i>',
        'arcade': '<i class="fas fa-gamepad"></i>',
        'sports': '<i class="fas fa-futbol"></i>'
    };
    return icons[category] || '<i class="fas fa-gamepad"></i>';
}

// Format category name
function formatCategoryName(category) {
    const names = {
        'io': 'IO Games',
        'clicker': 'Clicker Games',
        'action': 'Action Games',
        'puzzle': 'Puzzle Games',
        'racing': 'Racing Games',
        'rpg': 'RPG Games',
        'strategy': 'Strategy Games',
        'arcade': 'Arcade Games',
        'sports': 'Sports Games'
    };
    return names[category] || 'Games';
}

// Display search results for categories
function displayCategorySearchResults(categories, games) {
    searchResults.innerHTML = '';

    const totalResults = categories.length + (games ? games.length : 0);

    if (totalResults === 0) {
        searchResults.innerHTML = '<p class="no-results">No categories or games found.</p>';
        searchResults.classList.add('active');
        return;
    }

    // Add categories to results
    categories.forEach(category => {
        const resultElement = document.createElement('p');
        resultElement.innerHTML = `<i class="fas fa-folder"></i> ${category.name}`;
        resultElement.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(138, 43, 226, 0.1);
        `;
        resultElement.addEventListener('click', () => {
            handleCategoryClick(category.category, resultElement);
            searchResults.classList.remove('active');
            searchInput.value = '';
        });
        searchResults.appendChild(resultElement);
    });

    // Add games to results if they exist
    if (games && games.length > 0) {
        games.forEach(game => {
            const resultElement = document.createElement('p');
            resultElement.innerHTML = `<i class="fas fa-gamepad"></i> ${game.name}`;
            resultElement.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 0;
                opacity: 0.8;
            `;
            resultElement.addEventListener('click', () => {
                console.log(`Navigating to ${game.name}`);
                searchResults.classList.remove('active');
                searchInput.value = '';
            });
            searchResults.appendChild(resultElement);
        });
    }

    searchResults.classList.add('active');
}

// Animate category cards on scroll
const categoryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Initialize category animations
if (document.querySelector('.category-card')) {
    document.querySelectorAll('.category-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        categoryObserver.observe(card);
    });
}

// Category hover effects with particles
function createCategoryParticles(card) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #8a2be2;
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
        `;
        
        const rect = card.getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        document.body.appendChild(particle);
        
        // Animate particle
        const animation = particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)', 
                opacity: 1 
            },
            { 
                transform: `translate(${(Math.random() - 0.5) * 100}px, ${-50 - Math.random() * 50}px) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        animation.onfinish = () => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        };
    }
}

// Enhanced category card interactions
document.addEventListener('DOMContentLoaded', () => {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            createCategoryParticles(card);
        });
    });
});

console.log('🎮 Categories page loaded successfully!');