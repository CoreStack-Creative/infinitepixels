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
        
        // Resize canvas for fullscreen
        gameCanvas.style.width = '100vw';
        gameCanvas.style.height = 'calc(100vh - 60px)';
    } else {
        gameContainer.classList.remove('fullscreen');
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i><span>Fullscreen</span>';
        barCollapsed = false;
        gameControlBar.classList.remove('collapsed');
        collapseArrow.classList.remove('rotated');
        
        // Reset canvas size
        gameCanvas.style.width = '100%';
        gameCanvas.style.height = 'auto';
    }
}

// Collapse arrow functionality
collapseArrow.addEventListener('click', () => {
    barCollapsed = !barCollapsed;
    
    if (barCollapsed) {
        gameControlBar.classList.add('collapsed');
        collapseArrow.classList.add('rotated');
    } else {
        gameControlBar.classList.remove('collapsed');
        collapseArrow.classList.remove('rotated');
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
    });
});

// Game item interactions
gameItems.forEach(item => {
    item.addEventListener('click', () => {
        const gameName = item.dataset.game;
        console.log(`Loading ${gameName}...`);
        
        // Add click animation
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
        if (isFullscreen && e.ctrlKey) {
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