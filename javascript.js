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
    mobileSidebarOverlayHandler();

    // Selected when menu is open, unselected when closed
    if (!sidebarCollapsed) {
        sidebarToggle.classList.add('selected'); // Selected when open
    } else {
        sidebarToggle.classList.remove('selected'); // Unselected when closed
    }
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Always show bars icon
});

// --- Mobile sidebar overlay and toggle logic ---
function mobileSidebarOverlayHandler() {
    if (window.innerWidth <= 900) {
        if (!sidebarCollapsed) {
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
        }
    } else {
        document.body.classList.remove('sidebar-open');
    }
}
window.addEventListener('resize', () => {
    handleResize();
    mobileSidebarOverlayHandler();
});
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
    mobileSidebarOverlayHandler();
});

// Close sidebar when clicking overlay on mobile
document.addEventListener('click', function(e) {
    if (
        window.innerWidth <= 900 &&
        document.body.classList.contains('sidebar-open') &&
        !sidebar.contains(e.target) &&
        !sidebarToggle.contains(e.target)
    ) {
        sidebarCollapsed = true;
        sidebar.classList.add('collapsed');
        mainContent.classList.remove('expanded');
        document.body.classList.remove('sidebar-open');
    }
}, true);

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
    mobileSidebarOverlayHandler();
});

// Window event listeners
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 100);
});

console.log('🎮 Paper.io page loaded successfully! Press "S" to toggle sidebar, "F" for fullscreen.'); 
// Settings Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings system
    initializeSettings();
    
    // Setup event listeners
    setupTabNavigation();
    setupSliders();
    setupKeybinds();
    setupColorPicker();
    setupSaveSystem();
    setupModalSystem();
    setupResetFunctionality();
    
    // Load saved settings
    loadSettings();
    
    console.log('🎮 Settings page initialized successfully!');
});

// Settings data structure
let settingsData = {
    display: {
        theme: 'dark',
        accentColor: '#8a2be2',
        dynamicBg: true,
        reducedMotion: false,
        uiScale: 100,
        fullscreenDefault: false,
        showFps: false
    },
    audio: {
        masterVolume: 80,
        gameVolume: 90,
        musicVolume: 60,
        sfxVolume: 85,
        spatialAudio: false,
        bassBoost: false,
        audioQuality: 'high'
    },
    controls: {
        keybinds: {
            moveUp: 'KeyW',
            moveLeft: 'KeyA',
            moveDown: 'KeyS',
            moveRight: 'KeyD',
            action: 'Space',
            pause: 'Escape'
        },
        gamepadEnabled: true,
        gamepadSensitivity: 1.0,
        gamepadVibration: true,
        deadzone: 15
    },
    gameplay: {
        targetFps: 60,
        graphicsQuality: 'medium',
        vsync: false,
        autoSave: true,
        skipIntros: false,
        streamerMode: false,
        difficulty: 'normal'
    },
    account: {
        username: 'GamerPro123',
        email: 'gamer@example.com',
        displayName: 'Pro Gamer',
        gameUpdates: true,
        friendRequests: true,
        achievements: true,
        promotions: false
    },
    privacy: {
        profileVisibility: 'friends',
        showOnlineStatus: true,
        showCurrentGame: true,
        allowMessages: true,
        analytics: true,
        crashReports: true
    },
    advanced: {
        devMode: false,
        showConsole: false,
        betaFeatures: false,
        serverRegion: 'auto',
        bandwidth: 'unlimited'
    }
};

// Initialize settings system
function initializeSettings() {
    // Apply initial theme
    applyTheme(settingsData.display.theme);
    
    // Apply accent color
    applyAccentColor(settingsData.display.accentColor);
    
    // Update all UI elements with current values
    updateAllUIElements();
}

// Tab navigation system
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.settings-tab');
    const panels = document.querySelectorAll('.settings-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.dataset.tab;
            
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            document.getElementById(`${targetPanel}-panel`).classList.add('active');
            
            // Add click animation
            tab.style.transform = 'scale(0.95)';
            setTimeout(() => {
                tab.style.transform = '';
            }, 150);
        });
    });
}

// Slider functionality
function setupSliders() {
    const sliders = document.querySelectorAll('.setting-slider');
    
    sliders.forEach(slider => {
        const valueDisplay = slider.parentElement.querySelector('.slider-value');
        
        // Update display on input
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            const id = e.target.id;
            
            // Format value based on slider type
            let displayValue;
            if (id === 'uiScale') {
                displayValue = `${value}%`;
            } else if (id === 'gamepadSensitivity') {
                displayValue = `${value.toFixed(1)}x`;
            } else if (id === 'deadzone') {
                displayValue = `${value}%`;
            } else {
                displayValue = `${value}%`;
            }
            
            valueDisplay.textContent = displayValue;
            
            // Update settings data
            updateSettingValue(id, value);
            
            // Apply immediate effects for certain settings
            if (id === 'uiScale') {
                applyUIScale(value);
            }
        });
        
        // Add hover effects
        slider.addEventListener('mouseenter', () => {
            slider.style.background = 'rgba(138, 43, 226, 0.2)';
        });
        
        slider.addEventListener('mouseleave', () => {
            slider.style.background = 'rgba(255, 255, 255, 0.1)';
        });
    });
}

// Keybind system
function setupKeybinds() {
    const keybindButtons = document.querySelectorAll('.keybind-btn');
    let listeningForKey = false;
    let currentButton = null;
    
    keybindButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (listeningForKey) return;
            
            listeningForKey = true;
            currentButton = button;
            button.classList.add('listening');
            button.textContent = 'Press key...';
        });
    });
    
    // Listen for keypress when setting keybinds
    document.addEventListener('keydown', (e) => {
        if (listeningForKey && currentButton) {
            e.preventDefault();
            
            const keyName = getKeyDisplayName(e.code);
            const action = currentButton.dataset.action;
            
            // Update button display
            currentButton.textContent = keyName;
            currentButton.classList.remove('listening');
            
            // Update settings data
            settingsData.controls.keybinds[action] = e.code;
            
            // Reset listening state
            listeningForKey = false;
            currentButton = null;
            
            // Show success animation
            currentButton.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            setTimeout(() => {
                currentButton.style.background = '';
            }, 1000);
        }
    });
}

// Color picker system
function setupColorPicker() {
    const colorPicker = document.getElementById('accentColor');
    const colorPresets = document.querySelectorAll('.color-preset');
    
    // Main color picker
    colorPicker.addEventListener('change', (e) => {
        const color = e.target.value;
        applyAccentColor(color);
        settingsData.display.accentColor = color;
        
        // Update preset selection
        updatePresetSelection(color);
    });
    
    // Color presets
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            colorPicker.value = color;
            applyAccentColor(color);
            settingsData.display.accentColor = color;
            
            // Update preset selection
            updatePresetSelection(color);
            
            // Animation
            preset.style.transform = 'scale(1.2)';
            setTimeout(() => {
                preset.style.transform = '';
            }, 200);
        });
    });
}

// Save system
function setupSaveSystem() {
    const saveButton = document.getElementById('saveBtn');
    const modal = document.getElementById('saveModal');
    
    saveButton.addEventListener('click', () => {
        // Add loading animation
        saveButton.style.opacity = '0.7';
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        // Simulate save delay
        setTimeout(() => {
            saveSettings();
            showSaveModal();
            
            // Reset button
            saveButton.style.opacity = '';
            saveButton.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        }, 1000);
    });
}

// Modal system
function setupModalSystem() {
    const modal = document.getElementById('saveModal');
    const modalOk = document.getElementById('modalOk');
    
    modalOk.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Reset functionality
function setupResetFunctionality() {
    const resetButton = document.getElementById('resetBtn');
    
    resetButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
            resetToDefaults();
            updateAllUIElements();
            showNotification('Settings reset to defaults', 'success');
        }
    });
}

// Helper Functions

function updateSettingValue(settingId, value) {
    // Map setting IDs to data structure
    const settingMap = {
        // Display
        'uiScale': () => settingsData.display.uiScale = value,
        // Audio
        'masterVolume': () => settingsData.audio.masterVolume = value,
        'gameVolume': () => settingsData.audio.gameVolume = value,
        'musicVolume': () => settingsData.audio.musicVolume = value,
        'sfxVolume': () => settingsData.audio.sfxVolume = value,
        // Controls
        'gamepadSensitivity': () => settingsData.controls.gamepadSensitivity = value,
        'deadzone': () => settingsData.controls.deadzone = value
    };
    
    if (settingMap[settingId]) {
        settingMap[settingId]();
    }
}

function getKeyDisplayName(keyCode) {
    const keyMap = {
        'KeyW': 'W', 'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D',
        'Space': 'Space', 'Escape': 'Escape', 'Enter': 'Enter',
        'ShiftLeft': 'L Shift', 'ShiftRight': 'R Shift',
        'ControlLeft': 'L Ctrl', 'ControlRight': 'R Ctrl',
        'AltLeft': 'L Alt', 'AltRight': 'R Alt',
        'ArrowUp': '↑', 'ArrowDown': '↓', 'ArrowLeft': '←', 'ArrowRight': '→'
    };
    
    return keyMap[keyCode] || keyCode.replace('Key', '').replace('Digit', '');
}

function applyTheme(theme) {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
    
    // Apply theme-specific styles
    const root = document.documentElement;
    
    switch (theme) {
        case 'light':
            root.style.setProperty('--bg-primary', '#f5f5f5');
            root.style.setProperty('--bg-secondary', '#ffffff');
            root.style.setProperty('--text-primary', '#333333');
            root.style.setProperty('--text-secondary', '#666666');
            break;
        case 'cyberpunk':
            root.style.setProperty('--bg-primary', '#0d0d0d');
            root.style.setProperty('--bg-secondary', '#1a1a1a');
            root.style.setProperty('--accent-color', '#00ffff');
            break;
        case 'neon':
            root.style.setProperty('--bg-primary', '#000012');
            root.style.setProperty('--bg-secondary', '#0a0a2e');
            root.style.setProperty('--accent-color', '#ff00ff');
            break;
        default: // dark
            root.style.setProperty('--bg-primary', '#0a0a23');
            root.style.setProperty('--bg-secondary', '#1e1e3f');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#b8b8d4');
    }
}

function applyAccentColor(color) {
    const root = document.documentElement;
    root.style.setProperty('--accent-color', color);
    
    // Update various accent elements
    const elements = document.querySelectorAll('.settings-tab.active, .btn-primary, .keybind-btn');
    elements.forEach(el => {
        el.style.background = `linear-gradient(45deg, ${color}, ${adjustBrightness(color, -20)})`;
    });
}

function adjustBrightness(hex, percent) {
    // Convert hex to RGB
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function applyUIScale(scale) {
    const root = document.documentElement;
    root.style.setProperty('--ui-scale', scale / 100);
    
    // Apply scale to main elements
    document.body.style.fontSize = `${16 * (scale / 100)}px`;
}

function updatePresetSelection(selectedColor) {
    const presets = document.querySelectorAll('.color-preset');
    presets.forEach(preset => {
        if (preset.dataset.color === selectedColor) {
            preset.style.border = '3px solid #ffffff';
            preset.style.transform = 'scale(1.1)';
        } else {
            preset.style.border = '2px solid rgba(255, 255, 255, 0.2)';
            preset.style.transform = 'scale(1)';
        }
    });
}

function updateAllUIElements() {
    // Update all sliders
    Object.keys(settingsData).forEach(category => {
        Object.keys(settingsData[category]).forEach(setting => {
            const element = document.getElementById(setting);
            if (element) {
                const value = settingsData[category][setting];
                
                if (element.type === 'range') {
                    element.value = value;
                    const valueDisplay = element.parentElement.querySelector('.slider-value');
                    if (valueDisplay) {
                        let displayValue;
                        if (setting === 'uiScale') {
                            displayValue = `${value}%`;
                        } else if (setting === 'gamepadSensitivity') {
                            displayValue = `${value.toFixed(1)}x`;
                        } else if (setting === 'deadzone') {
                            displayValue = `${value}%`;
                        } else {
                            displayValue = `${value}%`;
                        }
                        valueDisplay.textContent = displayValue;
                    }
                } else if (element.type === 'checkbox') {
                    element.checked = value;
                } else if (element.tagName === 'SELECT') {
                    element.value = value;
                } else if (element.type === 'text' || element.type === 'email') {
                    element.value = value;
                } else if (element.type === 'color') {
                    element.value = value;
                }
            }
        });
    });
    
    // Update keybind buttons
    Object.keys(settingsData.controls.keybinds).forEach(action => {
        const button = document.querySelector(`[data-action="${action}"]`);
        if (button) {
            button.textContent = getKeyDisplayName(settingsData.controls.keybinds[action]);
        }
    });
    
    // Update color presets
    updatePresetSelection(settingsData.display.accentColor);
}

function saveSettings() {
    try {
        // Save to localStorage (Note: In production, this would be sent to a server)
        const settingsJSON = JSON.stringify(settingsData);
        // Using a variable instead of localStorage for Claude.ai compatibility
        window.savedSettings = settingsJSON;
        
        // Apply all current settings
        applyTheme(settingsData.display.theme);
        applyAccentColor(settingsData.display.accentColor);
        applyUIScale(settingsData.display.uiScale);
        
        return true;
    } catch (error) {
        console.error('Failed to save settings:', error);
        showNotification('Failed to save settings', 'error');
        return false;
    }
}

function loadSettings() {
    try {
        // Load from localStorage (Note: In production, this would be fetched from a server)
        const savedData = window.savedSettings;
        if (savedData) {
            const parsed = JSON.parse(savedData);
            settingsData = { ...settingsData, ...parsed };
        }
        
        // Apply loaded settings
        applyTheme(settingsData.display.theme);
        applyAccentColor(settingsData.display.accentColor);
        applyUIScale(settingsData.display.uiScale);
        
        return true;
    } catch (error) {
        console.error('Failed to load settings:', error);
        return false;
    }
}

function resetToDefaults() {
    // Reset to default values
    settingsData = {
        display: {
            theme: 'dark',
            accentColor: '#8a2be2',
            dynamicBg: true,
            reducedMotion: false,
            uiScale: 100,
            fullscreenDefault: false,
            showFps: false
        },
        audio: {
            masterVolume: 80,
            gameVolume: 90,
            musicVolume: 60,
            sfxVolume: 85,
            spatialAudio: false,
            bassBoost: false,
            audioQuality: 'high'
        },
        controls: {
            keybinds: {
                moveUp: 'KeyW',
                moveLeft: 'KeyA',
                moveDown: 'KeyS',
                moveRight: 'KeyD',
                action: 'Space',
                pause: 'Escape'
            },
            gamepadEnabled: true,
            gamepadSensitivity: 1.0,
            gamepadVibration: true,
            deadzone: 15
        },
        gameplay: {
            targetFps: 60,
            graphicsQuality: 'medium',
            vsync: false,
            autoSave: true,
            skipIntros: false,
            streamerMode: false,
            difficulty: 'normal'
        },
        account: {
            username: 'GamerPro123',
            email: 'gamer@example.com',
            displayName: 'Pro Gamer',
            gameUpdates: true,
            friendRequests: true,
            achievements: true,
            promotions: false
        },
        privacy: {
            profileVisibility: 'friends',
            showOnlineStatus: true,
            showCurrentGame: true,
            allowMessages: true,
            analytics: true,
            crashReports: true
        },
        advanced: {
            devMode: false,
            showConsole: false,
            betaFeatures: false,
            serverRegion: 'auto',
            bandwidth: 'unlimited'
        }
    };
    
    // Apply default theme and colors
    applyTheme('dark');
    applyAccentColor('#8a2be2');
    applyUIScale(100);
}

function showSaveModal() {
    const modal = document.getElementById('saveModal');
    modal.classList.add('active');
    
    // Auto-close after 3 seconds
    setTimeout(() => {
        modal.classList.remove('active');
    }, 3000);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg, #4CAF50, #45a049)' : 'linear-gradient(45deg, #ff6b6b, #ee5a24)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-weight: 500;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Setup all checkbox event listeners
function setupCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.setting-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = e.target.id;
            const value = e.target.checked;
            
            // Update settings data based on checkbox ID
            updateCheckboxSetting(id, value);
            
            // Apply immediate effects for certain settings
            if (id === 'dynamicBg') {
                toggleDynamicBackground(value);
            } else if (id === 'reducedMotion') {
                toggleReducedMotion(value);
            } else if (id === 'devMode') {
                toggleDevMode(value);
            }
        });
    });
}

// Setup select dropdown listeners
function setupSelectListeners() {
    const selects = document.querySelectorAll('.setting-select');
    
    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            const id = e.target.id;
            const value = e.target.value;
            
            // Update settings data
            updateSelectSetting(id, value);
            
            // Apply immediate effects
            if (id === 'themeSelect') {
                applyTheme(value);
                settingsData.display.theme = value;
            }
        });
    });
}

function updateCheckboxSetting(settingId, value) {
    const settingMap = {
        // Display
        'dynamicBg': () => settingsData.display.dynamicBg = value,
        'reducedMotion': () => settingsData.display.reducedMotion = value,
        'fullscreenDefault': () => settingsData.display.fullscreenDefault = value,
        'showFps': () => settingsData.display.showFps = value,
        // Audio
        'spatialAudio': () => settingsData.audio.spatialAudio = value,
        'bassBoost': () => settingsData.audio.bassBoost = value,
        // Controls
        'gamepadEnabled': () => settingsData.controls.gamepadEnabled = value,
        'gamepadVibration': () => settingsData.controls.gamepadVibration = value,
        // Gameplay
        'vsync': () => settingsData.gameplay.vsync = value,
        'autoSave': () => settingsData.gameplay.autoSave = value,
        'skipIntros': () => settingsData.gameplay.skipIntros = value,
        'streamerMode': () => settingsData.gameplay.streamerMode = value,
        // Account
        'gameUpdates': () => settingsData.account.gameUpdates = value,
        'friendRequests': () => settingsData.account.friendRequests = value,
        'achievements': () => settingsData.account.achievements = value,
        'promotions': () => settingsData.account.promotions = value,
        // Privacy
        'showOnlineStatus': () => settingsData.privacy.showOnlineStatus = value,
        'showCurrentGame': () => settingsData.privacy.showCurrentGame = value,
        'allowMessages': () => settingsData.privacy.allowMessages = value,
        'analytics': () => settingsData.privacy.analytics = value,
        'crashReports': () => settingsData.privacy.crashReports = value,
        // Advanced
        'devMode': () => settingsData.advanced.devMode = value,
        'showConsole': () => settingsData.advanced.showConsole = value,
        'betaFeatures': () => settingsData.advanced.betaFeatures = value
    };
    
    if (settingMap[settingId]) {
        settingMap[settingId]();
    }
}

function updateSelectSetting(settingId, value) {
    const settingMap = {
        // Display
        'themeSelect': () => settingsData.display.theme = value,
        // Audio
        'audioQuality': () => settingsData.audio.audioQuality = value,
        // Gameplay
        'targetFps': () => settingsData.gameplay.targetFps = value,
        'graphicsQuality': () => settingsData.gameplay.graphicsQuality = value,
        'difficulty': () => settingsData.gameplay.difficulty = value,
        // Privacy
        'profileVisibility': () => settingsData.privacy.profileVisibility = value,
        // Advanced
        'serverRegion': () => settingsData.advanced.serverRegion = value,
        'bandwidth': () => settingsData.advanced.bandwidth = value
    };
    
    if (settingMap[settingId]) {
        settingMap[settingId]();
    }
}

function toggleDynamicBackground(enabled) {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        if (enabled) {
            heroSection.classList.add('dynamic-bg');
        } else {
            heroSection.classList.remove('dynamic-bg');
        }
    }
}

function toggleReducedMotion(enabled) {
    if (enabled) {
        document.body.classList.add('reduced-motion');
    } else {
        document.body.classList.remove('reduced-motion');
    }
}

function toggleDevMode(enabled) {
    if (enabled) {
        console.log('🔧 Developer mode enabled');
        // Add dev tools to page
        showNotification('Developer mode enabled', 'success');
    } else {
        console.log('🔧 Developer mode disabled');
        showNotification('Developer mode disabled', 'info');
    }
}

// Initialize additional listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setupCheckboxListeners();
    setupSelectListeners();
});

// Keyboard shortcuts for settings
document.addEventListener('keydown', (e) => {
    // Ctrl + S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        document.getElementById('saveBtn').click();
    }
    
    // Ctrl + R to reset (with confirmation)
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        document.getElementById('resetBtn').click();
    }
    
    // Tab navigation with numbers
    if (e.ctrlKey && e.key >= '1' && e.key <= '7') {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        const tabs = document.querySelectorAll('.settings-tab');
        if (tabs[tabIndex]) {
            tabs[tabIndex].click();
        }
    }
});

// Auto-save functionality (saves every 30 seconds if changes detected)
let settingsChanged = false;
let autoSaveInterval;

function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        if (settingsChanged) {
            saveSettings();
            settingsChanged = false;
            console.log('⚡ Settings auto-saved');
        }
    }, 30000); // 30 seconds
}

function markSettingsChanged() {
    settingsChanged = true;
}

// Track changes to mark for auto-save
document.addEventListener('change', (e) => {
    if (e.target.matches('.setting-slider, .setting-checkbox, .setting-select, .setting-input')) {
        markSettingsChanged();
    }
});

// Start auto-save when page loads
document.addEventListener('DOMContentLoaded', () => {
    startAutoSave();
});

// Clean up auto-save when page unloads
window.addEventListener('beforeunload', () => {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    
    // Save any pending changes
    if (settingsChanged) {
        saveSettings();
    }
});

console.log('🎮 Settings JavaScript loaded successfully!');

// Game Spotlight Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const trailerBtn = document.getElementById('trailerBtn');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const trailerVideo = document.getElementById('trailerVideo');
    
    // Open modal when trailer button is clicked
    trailerBtn.addEventListener('click', function() {
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Start playing the video
        trailerVideo.play().catch(error => {
            console.error('Error playing video:', error);
        });
    });
    
    // Close modal function
    function closeVideoModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
        
        // Pause and reset the video
        trailerVideo.pause();
        trailerVideo.currentTime = 0;
    }
    
    // Close modal when X button is clicked
    closeModal.addEventListener('click', closeVideoModal);
    
    // Close modal when clicking outside the modal content
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
    
    // Handle Play Now button click (if you want to add analytics or confirmation)
    const playNowBtn = document.querySelector('.btn-primary');
    if (playNowBtn) {
        playNowBtn.addEventListener('click', function(e) {
            // Optional: Add analytics tracking here
            console.log('Play Now button clicked');
            
            // Optional: Add a confirmation dialog
            // if (!confirm('Ready to enter the battlefield?')) {
            //     e.preventDefault();
            // }
        });
    }
    
    // Add hover effects for particles
    const spotlightImage = document.querySelector('.spotlight-image');
    const particles = document.querySelectorAll('.particle');
    
    if (spotlightImage && particles.length > 0) {
        spotlightImage.addEventListener('mouseenter', function() {
            particles.forEach((particle, index) => {
                particle.style.animationDuration = '1.5s';
                particle.style.transform = `translateY(-${5 + index * 2}px)`;
            });
        });
        
        spotlightImage.addEventListener('mouseleave', function() {
            particles.forEach((particle) => {
                particle.style.animationDuration = '3s';
                particle.style.transform = 'translateY(0px)';
            });
        });
    }
});