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
   { name: "1v1 Lol", link: "games/1v1lol.html" },
   { name: "3D Formula Racing", link: "games/3dformularacing.html" },
   { name: "Basket Random", link: "games/basketrandom.html" },
   { name: "Cookie Clicker", link: "games/cookieclicker.html" },
   { name: "Cube Arena 2048", link: "games/cubearena2048.html" },
   { name: "Draw Climber", link: "games/drawclimber.html" },
   { name: "Fruit Merge", link: "games/fruitmerge.html" },
   { name: "Helix Jump", link: "games/helixjump.html" },
   { name: "Masked Special Forces", link: "games/maskedspecialforces.html" },
   { name: "Paper Io", link: "games/paperio.html" },
   { name: "Parkour Block 3D", link: "games/parkourblock3d.html" },
   { name: "Poly Track", link: "games/polytrack.html" },
   { name: "Rodeo Stampede", link: "games/rodeoStampede.html" },
   { name: "Spiral Roll", link: "games/spiralroll.html" },
   { name: "Subway Surfers", link: "games/subwaysurfers.html" },
   { name: "Tiny Fishing", link: "games/tinyfishing.html" },
   { name: "Bloxd io", link: "games/bloxdio.html" },
   { name: "Moto X3M", link: "games/motox3m.html" }
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
  
   // Add null check to prevent errors
   if (!canvas) {
       console.log('Canvas not found, skipping game initialization');
       return;
   }
  
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
if (sidebarToggle) {
   sidebarToggle.addEventListener('click', () => {
       sidebarCollapsed = !sidebarCollapsed;
       if (sidebar) sidebar.classList.toggle('collapsed');
       if (mainContent) mainContent.classList.toggle('expanded');
       mobileSidebarOverlayHandler();


       // Selected when menu is open, unselected when closed
       if (!sidebarCollapsed) {
           sidebarToggle.classList.add('selected'); // Selected when open
       } else {
           sidebarToggle.classList.remove('selected'); // Unselected when closed
       }
       sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Always show bars icon
   });
}


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
   // Initialize game only if canvas exists
   if (gameCanvas) {
       initializeGame();
   } else {
       console.log('Game canvas not found, skipping game initialization');
   }
  
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
       sidebar && !sidebar.contains(e.target) &&
       sidebarToggle && !sidebarToggle.contains(e.target)
   ) {
       sidebarCollapsed = true;
       sidebar.classList.add('collapsed');
       if (mainContent) mainContent.classList.remove('expanded');
       document.body.classList.remove('sidebar-open');
   }
}, true);


// Search functionality
if (searchInput) {
   searchInput.addEventListener('input', () => {
       const searchTerm = searchInput.value.toLowerCase();


       if (searchTerm.trim() === '') {
           // Hide results if input is empty
           if (searchResults) {
               searchResults.classList.remove('active');
               searchResults.innerHTML = '';
           }
           return;
       }


       const filteredGames = gameData.filter(game =>
           game.name.toLowerCase().includes(searchTerm)
       );


       displaySearchResults(filteredGames);
   });
}


function displaySearchResults(results) {
   if (!searchResults) return;
  
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
           resultElement.style.cursor = 'pointer';
           resultElement.addEventListener('click', () => {
               if (game.link) {
                   window.location.href = game.link;
               }
               searchResults.classList.remove('active');
               searchInput.value = '';
           });
           searchResults.appendChild(resultElement);
       });
       searchResults.classList.add('active');
   }
}


// Fullscreen functionality - with null check
if (fullscreenBtn) {
   fullscreenBtn.addEventListener('click', toggleFullscreen);
} else {
   console.log('Fullscreen button not found');
}


function toggleFullscreen() {
   if (!gameContainer || !fullscreenBtn) {
       console.log('Required elements for fullscreen not found');
       return;
   }
  
   isFullscreen = !isFullscreen;


   if (isFullscreen) {
       gameContainer.classList.add('fullscreen');
       fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i><span>Exit Fullscreen</span>';
       if (gameCanvas) {
           gameCanvas.style.width = '100vw';
           gameCanvas.style.height = 'calc(100vh - 60px)';
       }
       if (collapseArrow) collapseArrow.style.display = 'block';
       gameContainer.classList.remove('bar-collapsed');
       barCollapsed = false;


       // Show fullscreen exit message
       showFullscreenMessage();
   } else {
       gameContainer.classList.remove('fullscreen');
       fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i><span>Fullscreen</span>';
       barCollapsed = false;
       if (gameControlBar) gameControlBar.classList.remove('collapsed');
       if (collapseArrow) {
           collapseArrow.classList.remove('rotated');
           collapseArrow.style.display = '';
       }
       gameContainer.classList.remove('bar-collapsed');
       if (gameCanvas) {
           gameCanvas.style.width = '100%';
           gameCanvas.style.height = 'auto';
       }
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
if (collapseArrow) {
   collapseArrow.addEventListener('click', () => {
       barCollapsed = !barCollapsed;


       if (isFullscreen && gameContainer) {
           if (barCollapsed) {
               gameContainer.classList.add('bar-collapsed');
               collapseArrow.classList.add('rotated');
               // Arrow stays visible
           } else {
               gameContainer.classList.remove('bar-collapsed');
               collapseArrow.classList.remove('rotated');
           }
       } else {
           if (barCollapsed && gameControlBar) {
               gameControlBar.classList.add('collapsed');
               collapseArrow.classList.add('rotated');
           } else if (gameControlBar) {
               gameControlBar.classList.remove('collapsed');
               collapseArrow.classList.remove('rotated');
           }
       }
   });
}


// Share functionality
if (shareBtn) {
   shareBtn.addEventListener('click', () => {
       if (shareModal) shareModal.classList.add('active');
   });
}


if (closeModal) {
   closeModal.addEventListener('click', () => {
       if (shareModal) shareModal.classList.remove('active');
   });
}


if (shareModal) {
   shareModal.addEventListener('click', (e) => {
       if (e.target === shareModal) {
           shareModal.classList.remove('active');
       }
   });
}


if (copyBtn) {
   copyBtn.addEventListener('click', () => {
       if (shareLink) shareLink.select();
       if (shareLink) shareLink.setSelectionRange(0, 99999);
      
       try {
           document.execCommand('copy');
           if (shareMessage) shareMessage.classList.add('show');
           copyBtn.textContent = 'Copied!';
          
           setTimeout(() => {
               if (shareMessage) shareMessage.classList.remove('show');
               copyBtn.textContent = 'Copy';
           }, 2000);
       } catch (err) {
           console.error('Copy failed:', err);
       }
   });
}


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
       if (sidebarToggle) sidebarToggle.click();
   }


   // Toggle fullscreen with 'F' key
   if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.altKey &&
       document.activeElement !== searchInput) {
       if (fullscreenBtn) fullscreenBtn.click();
   }


   // Close modals with Escape key
   if (e.key === 'Escape') {
       if (shareModal && shareModal.classList.contains('active')) {
           shareModal.classList.remove('active');
       }
       // Exit fullscreen if active
       if (isFullscreen) {
           toggleFullscreen();
       }
      
       // Close video modal if active
       const videoModal = document.getElementById('videoModal');
       if (videoModal && videoModal.classList.contains('active')) {
           closeVideoModal();
       }
   }
});


// Window resize handler
function handleResize() {
   const isMobile = window.innerWidth <= 768;


   if (isMobile && !sidebarCollapsed && sidebar && mainContent && sidebarToggle) {
       sidebar.classList.add('collapsed');
       mainContent.classList.add('expanded');
       sidebarCollapsed = true;
       sidebarToggle.classList.remove('selected');
   }


   // Adjust canvas size
   if (!isFullscreen && gameContainer && gameCanvas) {
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
       if (diff > 0 && !sidebarCollapsed && sidebarToggle) {
           // Swipe left - close sidebar
           sidebarToggle.click();
       } else if (diff < 0 && sidebarCollapsed && touchStartX < 50 && sidebarToggle) {
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
if (searchInput) {
   searchInput.addEventListener('focus', (e) => {
       e.stopPropagation();
   });


   searchInput.addEventListener('mousedown', (e) => {
       e.stopPropagation();
   });
}


// Settings Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
   // Only initialize settings if we're on the settings page
   if (document.querySelector('.settings-container')) {
       initializeSettings();
       setupTabNavigation();
       setupSliders();
       setupKeybinds();
       setupColorPicker();
       setupSaveSystem();
       setupModalSystem();
       setupResetFunctionality();
       loadSettings();
       console.log('🎮 Settings page initialized successfully!');
   }
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


// Settings functions (only run if on settings page)
function initializeSettings() {
   if (!document.querySelector('.settings-container')) return;
  
   applyTheme(settingsData.display.theme);
   applyAccentColor(settingsData.display.accentColor);
   updateAllUIElements();
}


function setupTabNavigation() {
   const tabs = document.querySelectorAll('.settings-tab');
   const panels = document.querySelectorAll('.settings-panel');
  
   tabs.forEach(tab => {
       tab.addEventListener('click', () => {
           const targetPanel = tab.dataset.tab;
          
           tabs.forEach(t => t.classList.remove('active'));
           panels.forEach(p => p.classList.remove('active'));
          
           tab.classList.add('active');
           const panel = document.getElementById(`${targetPanel}-panel`);
           if (panel) panel.classList.add('active');
          
           tab.style.transform = 'scale(0.95)';
           setTimeout(() => {
               tab.style.transform = '';
           }, 150);
       });
   });
}


function setupSliders() {
   const sliders = document.querySelectorAll('.setting-slider');
  
   sliders.forEach(slider => {
       const valueDisplay = slider.parentElement.querySelector('.slider-value');
      
       slider.addEventListener('input', (e) => {
           const value = parseFloat(e.target.value);
           const id = e.target.id;
          
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
          
           if (valueDisplay) valueDisplay.textContent = displayValue;
           updateSettingValue(id, value);
          
           if (id === 'uiScale') {
               applyUIScale(value);
           }
       });
   });
}


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
          
           currentButton.textContent = keyName;
           currentButton.classList.remove('listening');
          
           settingsData.controls.keybinds[action] = e.code;
          
           listeningForKey = false;
           currentButton = null;
          
           currentButton.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
           setTimeout(() => {
               currentButton.style.background = '';
           }, 1000);
       }
   });
}


function setupColorPicker() {
   const colorPicker = document.getElementById('accentColor');
   const colorPresets = document.querySelectorAll('.color-preset');
  
   if (colorPicker) {
       colorPicker.addEventListener('change', (e) => {
           const color = e.target.value;
           applyAccentColor(color);
           settingsData.display.accentColor = color;
           updatePresetSelection(color);
       });
   }
  
   colorPresets.forEach(preset => {
       preset.addEventListener('click', () => {
           const color = preset.dataset.color;
           if (colorPicker) colorPicker.value = color;
           applyAccentColor(color);
           settingsData.display.accentColor = color;
           updatePresetSelection(color);
          
           preset.style.transform = 'scale(1.2)';
           setTimeout(() => {
               preset.style.transform = '';
           }, 200);
       });
   });
}


function setupSaveSystem() {
   const saveButton = document.getElementById('saveBtn');
  
   if (saveButton) {
       saveButton.addEventListener('click', () => {
           saveButton.style.opacity = '0.7';
           saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
          
           setTimeout(() => {
               saveSettings();
               showSaveModal();
              
               saveButton.style.opacity = '';
               saveButton.innerHTML = '<i class="fas fa-save"></i> Save Changes';
           }, 1000);
       });
   }
}


function setupModalSystem() {
   const modal = document.getElementById('saveModal');
   const modalOk = document.getElementById('modalOk');
  
   if (modalOk) {
       modalOk.addEventListener('click', () => {
           if (modal) modal.classList.remove('active');
       });
   }
  
   if (modal) {
       modal.addEventListener('click', (e) => {
           if (e.target === modal) {
               modal.classList.remove('active');
           }
       });
   }
}


function setupResetFunctionality() {
   const resetButton = document.getElementById('resetBtn');
  
   if (resetButton) {
       resetButton.addEventListener('click', () => {
           if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
               resetToDefaults();
               updateAllUIElements();
               showNotification('Settings reset to defaults', 'success');
           }
       });
   }
}


// Settings helper functions
function updateSettingValue(settingId, value) {
   const settingMap = {
       'uiScale': () => settingsData.display.uiScale = value,
       'masterVolume': () => settingsData.audio.masterVolume = value,
       'gameVolume': () => settingsData.audio.gameVolume = value,
       'musicVolume': () => settingsData.audio.musicVolume = value,
       'sfxVolume': () => settingsData.audio.sfxVolume = value,
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
  
   const elements = document.querySelectorAll('.settings-tab.active, .btn-primary, .keybind-btn');
   elements.forEach(el => {
       el.style.background = `linear-gradient(45deg, ${color}, ${adjustBrightness(color, -20)})`;
   });
}


function adjustBrightness(hex, percent) {
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
  
   Object.keys(settingsData.controls.keybinds).forEach(action => {
       const button = document.querySelector(`[data-action="${action}"]`);
       if (button) {
           button.textContent = getKeyDisplayName(settingsData.controls.keybinds[action]);
       }
   });
  
   updatePresetSelection(settingsData.display.accentColor);
}


function saveSettings() {
   try {
       const settingsJSON = JSON.stringify(settingsData);
       window.savedSettings = settingsJSON;
      
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
       const savedData = window.savedSettings;
       if (savedData) {
           const parsed = JSON.parse(savedData);
           settingsData = { ...settingsData, ...parsed };
       }
      
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
  
   applyTheme('dark');
   applyAccentColor('#8a2be2');
   applyUIScale(100);
}


function showSaveModal() {
   const modal = document.getElementById('saveModal');
   if (modal) {
       modal.classList.add('active');
      
       setTimeout(() => {
           modal.classList.remove('active');
       }, 3000);
   }
}


function showNotification(message, type = 'info') {
   const notification = document.createElement('div');
   notification.className = `notification notification-${type}`;
   notification.innerHTML = `
       <div class="notification-content">
           <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
           <span>${message}</span>
       </div>
   `;
  
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
  
   document.body.appendChild(notification);
  
   setTimeout(() => {
       notification.style.opacity = '1';
       notification.style.transform = 'translateX(0)';
   }, 100);
  
   setTimeout(() => {
       notification.style.opacity = '0';
       notification.style.transform = 'translateX(100%)';
       setTimeout(() => {
           document.body.removeChild(notification);
       }, 300);
   }, 3000);
}


// Game Spotlight Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
   const trailerBtn = document.getElementById('trailerBtn');
   const videoModal = document.getElementById('videoModal');
   const closeModalBtn = document.getElementById('closeModal');
   const trailerVideo = document.getElementById('trailerVideo');


   // Only proceed if all elements exist
   if (!trailerBtn || !videoModal || !closeModalBtn || !trailerVideo) return;


   // Open modal when trailer button is clicked
   trailerBtn.addEventListener('click', function(e) {
       e.preventDefault();
       videoModal.classList.add('active');
       document.body.style.overflow = 'hidden';
       // Always reset and play the video
       trailerVideo.pause();
       trailerVideo.currentTime = 0;
       trailerVideo.load();
       // Try to play, fallback for autoplay restrictions
       const playPromise = trailerVideo.play();
       if (playPromise && typeof playPromise.then === 'function') {
           playPromise.catch(() => {
               trailerVideo.setAttribute('controls', 'controls');
           });
       }
       // Ensure video is visible
       trailerVideo.style.display = 'block';
   });


   // Close modal function
   function closeVideoModal() {
       videoModal.classList.remove('active');
       document.body.style.overflow = 'auto';
       trailerVideo.pause();
       trailerVideo.currentTime = 0;
       trailerVideo.load();
       trailerVideo.style.display = 'block';
   }


   window.closeVideoModal = closeVideoModal;


   closeModalBtn.addEventListener('click', closeVideoModal);
   videoModal.addEventListener('click', function(e) {
       if (e.target === videoModal) {
           closeVideoModal();
       }
   });


   // Handle Play Now button click (if you want to add analytics or confirmation)
   const playNowBtn = document.querySelector('.btn-primary');
   if (playNowBtn) {
       playNowBtn.addEventListener('click', function(e) {
           // Optional: Add analytics tracking here
           console.log('Play Now button clicked');
       });
   }
  
   // Add hover effects for particles (only if elements exist)
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
   } else {
       console.log('Spotlight image or particles not found - skipping hover effects');
   }
  
   // Additional video debugging
   if (trailerVideo) {
       trailerVideo.addEventListener('loadstart', () => console.log('Video load started'));
       trailerVideo.addEventListener('canplay', () => console.log('Video can play'));
       trailerVideo.addEventListener('error', (e) => console.error('Video error:', e));
   }
});


console.log('🎮 JavaScript loaded successfully!');

// List of URLs to randomly redirect to
const urls = [
   'games/1v1lol.html',
   'games/3dformularacing.html',
   'games/basketrandom.html',
   'games/cookieclicker.html',
   'games/cubearena2048.html',
   'games/drawclimber.html',
   'games/fruitmerge.html',
   'games/helixjump.html',
   'games/maskedspecialforces.html',
   'games/paperio.html',
   'games/parkourblock3d.html',
   'games/polytrack.html',
   'games/rodeoStampede.html',
   'games/spiralroll.html',
   'games/subwaysurfers.html',
   'games/tinyfishing.html',
   'games/bloxdio.html',
   'games/motox3m.html'
];

// Function to get a random URL from the list
function getRandomUrl() {
    const randomIndex = Math.floor(Math.random() * urls.length);
    return urls[randomIndex];
}

// Function to show redirect overlay and redirect
function showRedirectAndGo() {
    const overlay = document.getElementById('redirectOverlay');
    
    // Show the overlay
    overlay.classList.add('show');
    
    // Redirect after a very short delay (500ms)
    setTimeout(() => {
        window.location.href = getRandomUrl();
    }, 900);
}

// Start redirect process when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Show redirect overlay almost immediately (100ms delay for smooth animation)
    setTimeout(showRedirectAndGo, 100);
});

// Games data - Add your games here
const allGamesDatabase = [
    {
        id: 1,
        name: "1v1 Lol",
        image: "images/1v1lolimage.jpg",
        url: "games/1v1lol.html",
        tags: ["shooter", "action", "multiplayer"]
    },
    {
        id: 2,
        name: "3D Formula Racing",
        image: "images/3dformularacingimage.jpg",
        url: "games/3dformularacing.html",
        tags: ["racing", "cars", "3d"]
    },
    {
        id: 3,
        name: "Basket Random",
        image: "images/basketrandomimage.jpg",
        url: "games/basketrandom.html",
        tags: ["2 player", "basketball", "sports"]
    },
    {
        id: 4,
        name: "Cookie Clicker",
        image: "images/cookieclickerimage.jpg",
        url: "games/cookieclicker.html",
        tags: ["clicker", "idle", "cooking"]
    },
    {
        id: 5,
        name: "Cube Arena 2048",
        image: "images/cubearenaimage.jpg",
        url: "games/cubearena2048.html",
        tags: ["3d", "2048", "io"]
    },
    {
        id: 6,
        name: "Draw Climber",
        image: "images/drawclimberimage.jpg",
        url: "games/drawclimber.html",
        tags: ["puzzle", "drawing", "runner"]
    },
    {
        id: 7,
        name: "Fruit Merge",
        image: "images/fruitmergeimage.jpg",
        url: "games/fruitmerge.html",
        tags: ["watermelon", "puzzle", "fruit"]
    },
    {
        id: 8,
        name: "Helix Jump",
        image: "images/helixjumpimage.jpg",
        url: "games/helixjump.html",
        tags: ["arcade", "jumping", "platformer"]
    },
    {
        id: 9,
        name: "Masked Special Forces",
        image: "images/maskedspecialforcesimage.jpg",
        url: "games/maskedspecialforces.html",
        tags: ["shooter", "online", "multiplayer"]
    },
    {
        id: 10,
        name: "Paper Io",
        image: "images/paperioimage.jpg",
        url: "games/paperio.html",
        tags: ["io", "strategy", "multiplayer"]
    },
    {
        id: 11,
        name: "Parkour Block 3D",
        image: "images/parkourblock3dimage.jpg",
        url: "games/parkourblock3d.html",
        tags: ["parkour", "3d", "platformer"]
    },
    {
        id: 12,
        name: "Poly Track",
        image: "images/polytrackimage.jpg",
        url: "games/polytrack.html",
        tags: ["racing", "cars", "online"]
    },
    {
        id: 13,
        name: "Rodeo Stampede",
        image: "images/rodeostampedeimage.jpg",
        url: "games/rodeoStampede.html",
        tags: ["adventure", "animal", "racing"]
    },
    {
        id: 14,
        name: "Spiral Roll",
        image: "images/spiralrollimage.jpg",
        url: "games/spiralroll.html",
        tags: ["platformer", "satisfying", "3d"]
    },
    {
        id: 15,
        name: "Subway Surfers",
        image: "images/subwaysurfersimage.jpg",
        url: "games/subwaysurfers.html",
        tags: ["endless", "platformer", "parkour"]
    },
    {
        id: 16,
        name: "Tiny Fishing",
        image: "images/tinyfishingimage.jpg",
        url: "games/tinyfishing.html",
        tags: ["idle", "fishing", "clicker"]
    },
    {
        id: 17,
        name: "Bloxd io",
        image: "images/bloxdioimage.jpg",
        url: "games/bloxdio.html",
        tags: ["io", "parkour", "multiplayer"]
    },
    {
        id: 18,
        name: "Moto X3M",
        image: "images/motox3mimage.jpg",
        url: "games/motox3m.html",
        tags: ["bike", "racing", "levels"]
    },
{
        id: 19,
        name: "Tall Man Run",
        image: "images/tallmanrunimage.jpg",
        url: "games/tallmanrun.html",
        tags: ["3d", "platformer", "runner"]
    }
];

// All Games Management System - Unique class name
class AllGamesController {
    constructor() {
        this.gamesList = allGamesDatabase;
        this.filteredGamesList = [...this.gamesList];
        this.currentPageNumber = 1;
        this.itemsPerPage = 9;
        this.selectedFilterTags = new Set();
        this.currentSearchTerm = '';
        
        this.initializeAllGamesPage();
    }
    
    initializeAllGamesPage() {
        this.setupAllEventHandlers();
        this.createFilterTagsDisplay();
        this.renderGameCards();
        this.renderPaginationControls();
        this.updateGameCountDisplay();
    }
    
    setupAllEventHandlers() {
        // Search functionality with unique IDs
        const searchInputField = document.getElementById('gameSearchField');
        const clearSearchButton = document.getElementById('searchClearBtn');
        
        searchInputField.addEventListener('input', (e) => {
            this.currentSearchTerm = e.target.value.toLowerCase();
            this.applyFiltersAndSearch();
            this.toggleSearchClearVisibility();
        });
        
        clearSearchButton.addEventListener('click', () => {
            searchInputField.value = '';
            this.currentSearchTerm = '';
            this.applyFiltersAndSearch();
            this.toggleSearchClearVisibility();
            searchInputField.focus();
        });
        
        // Filter functionality with unique IDs
        const tagFilterButton = document.getElementById('tagFilterBtn');
        const filterOptionsPanel = document.getElementById('filterOptionsPanel');
        const resetFiltersButton = document.getElementById('resetFiltersBtn');
        
        tagFilterButton.addEventListener('click', (e) => {
            e.stopPropagation();
            filterOptionsPanel.classList.toggle('active');
            tagFilterButton.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!filterOptionsPanel.contains(e.target) && !tagFilterButton.contains(e.target)) {
                filterOptionsPanel.classList.remove('active');
                tagFilterButton.classList.remove('active');
            }
        });
        
        resetFiltersButton.addEventListener('click', () => {
            this.selectedFilterTags.clear();
            this.refreshFilterTagsDisplay();
            this.applyFiltersAndSearch();
        });
    }
    
    toggleSearchClearVisibility() {
        const clearSearchButton = document.getElementById('searchClearBtn');
        const searchInputField = document.getElementById('gameSearchField');
        
        if (searchInputField.value.length > 0) {
            clearSearchButton.classList.add('visible');
        } else {
            clearSearchButton.classList.remove('visible');
        }
    }
    
    createFilterTagsDisplay() {
        const uniqueTagsSet = new Set();
        this.gamesList.forEach(gameItem => {
            gameItem.tags.forEach(tagName => uniqueTagsSet.add(tagName));
        });
        
        const filterTagsContainer = document.getElementById('availableFilterTags');
        filterTagsContainer.innerHTML = '';
        
        Array.from(uniqueTagsSet).sort().forEach(tagName => {
            const tagElement = document.createElement('div');
            tagElement.className = 'selectable-tag';
            tagElement.textContent = tagName;
            tagElement.addEventListener('click', () => this.handleFilterTagToggle(tagName, tagElement));
            filterTagsContainer.appendChild(tagElement);
        });
    }
    
    handleFilterTagToggle(tagName, tagElement) {
        if (this.selectedFilterTags.has(tagName)) {
            this.selectedFilterTags.delete(tagName);
            tagElement.classList.remove('active');
        } else {
            this.selectedFilterTags.add(tagName);
            tagElement.classList.add('active');
        }
        
        this.applyFiltersAndSearch();
    }
    
    refreshFilterTagsDisplay() {
        const selectableTags = document.querySelectorAll('.selectable-tag');
        selectableTags.forEach(tagElement => {
            const tagText = tagElement.textContent;
            if (this.selectedFilterTags.has(tagText)) {
                tagElement.classList.add('active');
            } else {
                tagElement.classList.remove('active');
            }
        });
    }
    
    applyFiltersAndSearch() {
        this.filteredGamesList = this.gamesList.filter(gameItem => {
            // Search filter logic
            const matchesSearchQuery = this.currentSearchTerm === '' || 
                gameItem.name.toLowerCase().includes(this.currentSearchTerm) ||
                gameItem.tags.some(tagName => tagName.toLowerCase().includes(this.currentSearchTerm));
            
            // Tag filter logic
            const matchesTagFilters = this.selectedFilterTags.size === 0 ||
                Array.from(this.selectedFilterTags).every(selectedTag => 
                    gameItem.tags.includes(selectedTag)
                );
            
            return matchesSearchQuery && matchesTagFilters;
        });
        
        this.currentPageNumber = 1;
        this.renderGameCards();
        this.renderPaginationControls();
        this.updateGameCountDisplay();
    }
    
    renderGameCards() {
        const gameCardsContainer = document.getElementById('gameCardsGrid');
        const startIndex = (this.currentPageNumber - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentPageGames = this.filteredGamesList.slice(startIndex, endIndex);
        
        if (currentPageGames.length === 0) {
            gameCardsContainer.innerHTML = `
                <div class="no-games-message">
                    <i class="fas fa-gamepad"></i>
                    <h3>No games found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        gameCardsContainer.innerHTML = currentPageGames.map(gameItem => `
            <div class="individual-game-card" data-game="${gameItem.name.toLowerCase().replace(/\s+/g, '-')}">
                <div class="game-preview-image">
                    <img src="${gameItem.image}" alt="${gameItem.name}" />
                    <div class="game-hover-overlay">
                        <a href="${gameItem.url}">
                            <button class="game-play-button">Play Now</button>
                        </a>
                    </div>
                </div>
                <div class="game-details-section">
                    <h3>${gameItem.name}</h3>
                    <div class="game-category-tags">
                        ${gameItem.tags.map(tagName => `<span class="category-tag-item">${tagName}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers for individual game cards
        document.querySelectorAll('.individual-game-card').forEach(cardElement => {
            cardElement.addEventListener('click', (e) => {
                if (!e.target.closest('.game-play-button')) {
                    const playButton = cardElement.querySelector('.game-play-button');
                    if (playButton) {
                        playButton.click();
                    }
                }
            });
        });
    }
    
    renderPaginationControls() {
        const totalPagesCount = Math.ceil(this.filteredGamesList.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('pageNavigationControls');
        
        if (totalPagesCount <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous navigation button
        paginationHTML += `
            <button class="nav-page-button" ${this.currentPageNumber === 1 ? 'disabled' : ''} 
                    onclick="allGamesController.navigateToPage(${this.currentPageNumber - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page number buttons logic
        const maxVisiblePageNumbers = 5;
        let startPageNumber = Math.max(1, this.currentPageNumber - Math.floor(maxVisiblePageNumbers / 2));
        let endPageNumber = Math.min(totalPagesCount, startPageNumber + maxVisiblePageNumbers - 1);
        
        if (endPageNumber - startPageNumber + 1 < maxVisiblePageNumbers) {
            startPageNumber = Math.max(1, endPageNumber - maxVisiblePageNumbers + 1);
        }
        
        if (startPageNumber > 1) {
            paginationHTML += `<button class="nav-page-button" onclick="allGamesController.navigateToPage(1)">1</button>`;
            if (startPageNumber > 2) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
        }
        
        for (let pageNum = startPageNumber; pageNum <= endPageNumber; pageNum++) {
            paginationHTML += `
                <button class="nav-page-button ${pageNum === this.currentPageNumber ? 'current-page' : ''}" 
                        onclick="allGamesController.navigateToPage(${pageNum})">${pageNum}</button>
            `;
        }
        
        if (endPageNumber < totalPagesCount) {
            if (endPageNumber < totalPagesCount - 1) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
            paginationHTML += `<button class="nav-page-button" onclick="allGamesController.navigateToPage(${totalPagesCount})">${totalPagesCount}</button>`;
        }
        
        // Next navigation button
        paginationHTML += `
            <button class="nav-page-button" ${this.currentPageNumber === totalPagesCount ? 'disabled' : ''} 
                    onclick="allGamesController.navigateToPage(${this.currentPageNumber + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }
    
    navigateToPage(pageNumber) {
        const totalPagesCount = Math.ceil(this.filteredGamesList.length / this.itemsPerPage);
        if (pageNumber >= 1 && pageNumber <= totalPagesCount) {
            this.currentPageNumber = pageNumber;
            this.renderGameCards();
            this.renderPaginationControls();
            this.updateGameCountDisplay();
            
            // Smooth scroll to top of games grid
            document.getElementById('gameCardsGrid').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
    
    updateGameCountDisplay() {
        const gameCountElement = document.getElementById('totalGameCount');
        gameCountElement.textContent = this.filteredGamesList.length;
    }
    
    // Method to dynamically add new games
    addSingleGame(gameData) {
        const newGameEntry = {
            id: this.gamesList.length + 1,
            ...gameData
        };
        this.gamesList.push(newGameEntry);
        this.applyFiltersAndSearch();
        this.createFilterTagsDisplay();
    }
    
    // Method to add multiple games at once
    addMultipleGames(gamesArray) {
        gamesArray.forEach(gameData => {
            const newGameEntry = {
                id: this.gamesList.length + 1,
                ...gameData
            };
            this.gamesList.push(newGameEntry);
        });
        this.applyFiltersAndSearch();
        this.createFilterTagsDisplay();
    }
}

// Initialize the all games controller when page loads
let allGamesController;

document.addEventListener('DOMContentLoaded', () => {
    allGamesController = new AllGamesController();
});

// Utility functions to add games from external scripts
function addNewGameToCollection(name, image, url, tags) {
    if (allGamesController) {
        allGamesController.addSingleGame({ name, image, url, tags });
    }
}

function addMultipleGamesToCollection(gamesArray) {
    if (allGamesController) {
        allGamesController.addMultipleGames(gamesArray);
    }
}

// Example usage for adding more games:
/*
// Add a single game
addNewGameToCollection("Super Mario Bros", "images/mario.jpg", "games/mario.html", ["platformer", "classic", "adventure"]);

// Add multiple games at once
addMultipleGamesToCollection([
    {
        name: "Tetris Classic",
        image: "images/tetris.jpg",
        url: "games/tetris.html",
        tags: ["puzzle", "classic", "blocks"]
    },
    {
        name: "Pac-Man Arcade",
        image: "images/pacman.jpg",
        url: "games/pacman.html",
        tags: ["arcade", "classic", "maze"]
    },
    {
        name: "Street Fighter",
        image: "images/streetfighter.jpg",
        url: "games/streetfighter.html",
        tags: ["fighting", "action", "multiplayer"]
    }
]);
*/

// Settings.js - Handle all settings functionality
class SettingsManager {
    constructor() {
        this.defaultSettings = {
            theme: 'dark',
            audioMuted: false
        };
        
        this.settings = this.loadSettings();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.applySettings();
        this.updateUI();
    }
    
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Audio toggle
        const audioToggle = document.getElementById('audioToggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => this.toggleAudio());
        }
        
        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }
        
        // Fullscreen controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' || e.key === 'F') {
                this.toggleFullscreen();
            }
            if (e.key === 'Escape') {
                this.exitFullscreen();
            }
        });
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('infinitePixelsSettings');
            return saved ? JSON.parse(saved) : { ...this.defaultSettings };
        } catch (error) {
            console.warn('Error loading settings:', error);
            return { ...this.defaultSettings };
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('infinitePixelsSettings', JSON.stringify(this.settings));
            this.showStatusMessage('Settings Saved', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showStatusMessage('Save Failed', 'error');
        }
    }
    
    toggleTheme() {
        this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.updateThemeUI();
        this.saveSettings();
    }
    
    applyTheme() {
        if (this.settings.theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }
    
    updateThemeUI() {
        const themeToggle = document.getElementById('themeToggle');
        const themeLabel = document.getElementById('themeLabel');
        
        if (themeToggle && themeLabel) {
            if (this.settings.theme === 'light') {
                themeToggle.classList.add('light');
                themeLabel.textContent = 'Light Mode';
            } else {
                themeToggle.classList.remove('light');
                themeLabel.textContent = 'Dark Mode';
            }
        }
    }
    
    toggleAudio() {
        this.settings.audioMuted = !this.settings.audioMuted;
        this.applyAudio();
        this.updateAudioUI();
        this.saveSettings();
    }
    
    applyAudio() {
        // Get all audio elements on the page
        const audioElements = document.querySelectorAll('audio, video');
        audioElements.forEach(element => {
            element.muted = this.settings.audioMuted;
        });
        
        // Apply to Web Audio API contexts if they exist
        if (window.audioContext) {
            if (this.settings.audioMuted) {
                window.audioContext.suspend();
            } else {
                window.audioContext.resume();
            }
        }
    }
    
    updateAudioUI() {
        const audioToggle = document.getElementById('audioToggle');
        const audioIcon = document.getElementById('audioIcon');
        const audioLabel = document.getElementById('audioLabel');
        
        if (audioToggle && audioIcon && audioLabel) {
            if (this.settings.audioMuted) {
                audioToggle.classList.add('muted');
                audioIcon.className = 'fas fa-volume-mute';
                audioLabel.textContent = 'Muted';
            } else {
                audioToggle.classList.remove('muted');
                audioIcon.className = 'fas fa-volume-up';
                audioLabel.textContent = 'Unmuted';
            }
        }
    }
    
    resetSettings() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to reset all settings to default?')) {
            this.settings = { ...this.defaultSettings };
            this.applySettings();
            this.updateUI();
            this.saveSettings();
            this.showStatusMessage('Settings Reset', 'success');
        }
    }
    
    applySettings() {
        this.applyTheme();
        this.applyAudio();
    }
    
    updateUI() {
        this.updateThemeUI();
        this.updateAudioUI();
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    showStatusMessage(message, type = 'success') {
        const statusText = document.getElementById('statusText');
        const statusDot = document.querySelector('.status-dot');
        
        if (statusText && statusDot) {
            statusText.textContent = message;
            
            // Update status dot color based on type
            statusDot.style.background = type === 'success' ? '#2ed573' : '#ff4757';
            
            // Reset after 3 seconds
            setTimeout(() => {
                statusText.textContent = 'Settings Saved';
                statusDot.style.background = '#2ed573';
            }, 3000);
        }
    }
    
    // Method to get current settings (useful for other parts of the site)
    getSettings() {
        return { ...this.settings };
    }
    
    // Method to update settings programmatically
    updateSetting(key, value) {
        if (this.settings.hasOwnProperty(key)) {
            this.settings[key] = value;
            this.applySettings();
            this.updateUI();
            this.saveSettings();
        }
    }
}

// Initialize settings when the page loads
let settingsManager;

document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
});

// Make settings manager globally available
window.getSettingsManager = () => settingsManager;

// Enhanced keyboard controls
document.addEventListener('keydown', (e) => {
    // WASD movement (example implementation - you can modify this for your specific needs)
    const key = e.key.toLowerCase();
    
    if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
        // Highlight the corresponding key in the UI
        highlightKey(key.toUpperCase());
    }
    
    if (key === ' ') {
        // Spacebar action
        e.preventDefault();
        highlightKey('SPACE');
    }
});

function highlightKey(keyName) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        if (key.textContent === keyName) {
            key.style.transform = 'translateY(-4px)';
            key.style.boxShadow = '0 8px 16px rgba(138, 43, 226, 0.5)';
            key.style.borderColor = '#8a2be2';
            
            setTimeout(() => {
                key.style.transform = '';
                key.style.boxShadow = '';
                key.style.borderColor = '';
            }, 200);
        }
    });
}

// Audio context setup for Web Audio API compatibility
function setupAudioContext() {
    if (!window.audioContext && (window.AudioContext || window.webkitAudioContext)) {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Initialize audio context on user interaction
document.addEventListener('click', setupAudioContext, { once: true });
document.addEventListener('keydown', setupAudioContext, { once: true });

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
} 
// News Page JavaScript - Updated for InfinitePixels
class NewsManager {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentFilter = 'all';
        this.currentTag = 'all';
        this.currentSort = 'newest';
        this.currentView = 'grid';
        this.articlesPerPage = 9;
        this.currentPage = 1;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.generateSampleData();
        this.setupEventListeners();
        this.renderArticles();
        this.renderSidebarContent();
        this.setupSearch();
    }

    generateSampleData() {
        const categories = ['updates', 'patch-notes', 'events', 'community', 'esports'];
        const tags = ['update', 'patch', 'event', 'community', 'esports', 'beta'];
        
        const sampleArticles = [
            {
                id: 1,
                title: "Major Update 2.5 Now Live",
                summary: "Experience the biggest content update yet with new maps, characters, and game modes. Plus enhanced graphics and performance improvements.",
                content: "This is the full article content for Major Update 2.5...",
                category: "updates",
                tags: ["update", "patch"],
                date: new Date('2025-08-01'),
                author: "Dev Team",
                featured: true,
                views: 15420,
                likes: 892,
                image: null
            },
            {
                id: 2,
                title: "Summer Championship Tournament Announcement",
                summary: "Join us for the biggest esports tournament of the year with a $500,000 prize pool and teams from around the world.",
                content: "Full tournament details...",
                category: "esports",
                tags: ["event", "esports"],
                date: new Date('2025-07-30'),
                author: "Tournament Team",
                featured: false,
                views: 8745,
                likes: 543,
                image: null
            },
            {
                id: 3,
                title: "Community Spotlight: Player Creations",
                summary: "Check out amazing player-created content, custom maps, and mods that are taking the community by storm.",
                content: "Community content showcase...",
                category: "community",
                tags: ["community"],
                date: new Date('2025-07-28'),
                author: "Community Team",
                featured: false,
                views: 12350,
                likes: 734,
                image: null
            },
            {
                id: 4,
                title: "Hotfix 2.4.3 - Bug Fixes and Improvements",
                summary: "Quick hotfix addressing several reported issues including connection problems and UI glitches.",
                content: "Hotfix details and patch notes...",
                category: "patch-notes",
                tags: ["patch"],
                date: new Date('2025-07-25'),
                author: "Dev Team",
                featured: false,
                views: 6890,
                likes: 234,
                image: null
            },
            {
                id: 5,
                title: "New Seasonal Event: Cyber Nexus",
                summary: "Dive into a cyberpunk-themed seasonal event with exclusive rewards, new game modes, and limited-time cosmetics.",
                content: "Seasonal event details...",
                category: "events",
                tags: ["event", "update"],
                date: new Date('2025-07-22'),
                author: "Event Team",
                featured: false,
                views: 18765,
                likes: 1203,
                image: null
            },
            {
                id: 6,
                title: "Beta Testing Program Now Open",
                summary: "Sign up for our exclusive beta testing program and get early access to upcoming features and content.",
                content: "Beta program information...",
                category: "community",
                tags: ["community", "beta"],
                date: new Date('2025-07-20'),
                author: "Beta Team",
                featured: false,
                views: 9432,
                likes: 567,
                image: null
            },
            {
                id: 7,
                title: "Performance Optimization Update",
                summary: "Significant performance improvements across all platforms, reducing load times and increasing frame rates.",
                content: "Performance update details...",
                category: "updates",
                tags: ["update", "patch"],
                date: new Date('2025-07-18'),
                author: "Tech Team",
                featured: false,
                views: 11200,
                likes: 678,
                image: null
            },
            {
                id: 8,
                title: "New Character Reveal: Echo",
                summary: "Meet Echo, the latest addition to our roster with unique abilities and a compelling backstory.",
                content: "Character reveal and abilities...",
                category: "updates",
                tags: ["update"],
                date: new Date('2025-07-15'),
                author: "Design Team",
                featured: false,
                views: 22100,
                likes: 1456,
                image: null
            },
            {
                id: 9,
                title: "Server Maintenance Schedule",
                summary: "Scheduled maintenance windows for the upcoming week to improve server stability and performance.",
                content: "Maintenance schedule details...",
                category: "updates",
                tags: ["update"],
                date: new Date('2025-07-12'),
                author: "Infrastructure Team",
                featured: false,
                views: 5430,
                likes: 123,
                image: null
            },
            {
                id: 10,
                title: "Community Art Contest Winners",
                summary: "Congratulations to the winners of our community art contest! Check out these amazing submissions.",
                content: "Art contest results and gallery...",
                category: "community",
                tags: ["community", "event"],
                date: new Date('2025-07-10'),
                author: "Community Team",
                featured: false,
                views: 7890,
                likes: 445,
                image: null
            }
        ];

        this.articles = sampleArticles;
        this.filteredArticles = [...this.articles];
    }

    setupEventListeners() {
        // View toggles
        document.querySelectorAll('.news-view-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.news-view-toggle').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.updateViewMode();
            });
        });

        // Filter dropdown
        const filterBtn = document.querySelector('.news-filter-btn');
        const filterMenu = document.querySelector('.news-filter-menu');
        
        if (filterBtn && filterMenu) {
            filterBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                filterMenu.classList.toggle('active');
            });

            document.querySelectorAll('.news-filter-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    document.querySelectorAll('.news-filter-option').forEach(o => o.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentFilter = e.target.dataset.filter;
                    filterBtn.querySelector('span').textContent = e.target.textContent;
                    filterMenu.classList.remove('active');
                    this.applyFilters();
                });
            });
        }

        // Sort dropdown
        const sortBtn = document.querySelector('.news-sort-btn');
        const sortMenu = document.querySelector('.news-sort-menu');
        
        if (sortBtn && sortMenu) {
            sortBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sortMenu.classList.toggle('active');
            });

            document.querySelectorAll('.news-sort-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    document.querySelectorAll('.news-sort-option').forEach(o => o.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentSort = e.target.dataset.sort;
                    sortBtn.querySelector('span').textContent = e.target.textContent;
                    sortMenu.classList.remove('active');
                    this.applyFilters();
                });
            });
        }

        // Tags
        document.querySelectorAll('.news-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                document.querySelectorAll('.news-tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTag = e.target.dataset.tag;
                this.applyFilters();
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }

        // Featured banner click
        const featuredBanner = document.getElementById('featuredBanner');
        if (featuredBanner) {
            featuredBanner.addEventListener('click', () => {
                const featuredArticle = this.articles.find(article => article.featured);
                if (featuredArticle) {
                    this.openArticleModal(featuredArticle);
                }
            });
        }

        // Modal close
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.querySelector('.news-modal-overlay');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeArticleModal());
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeArticleModal());
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            if (filterMenu) filterMenu.classList.remove('active');
            if (sortMenu) sortMenu.classList.remove('active');
        });

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = e.target.querySelector('input[type="email"]').value;
                if (email) {
                    this.showNotification('Thanks for subscribing! You\'ll receive updates soon.', 'success');
                    e.target.reset();
                }
            });
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('globalSearch');
        const searchResults = document.getElementById('searchResults');
        
        if (!searchInput || !searchResults) return;
        
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length === 0) {
                searchResults.classList.remove('active');
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        searchInput.addEventListener('focus', (e) => {
            if (e.target.value.trim().length > 0) {
                searchResults.classList.add('active');
            }
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                searchResults.classList.remove('active');
            }, 200);
        });
    }

    performSearch(query) {
        const searchResults = document.getElementById('searchResults');
        const results = this.articles.filter(article => 
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.summary.toLowerCase().includes(query.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No articles found</p>';
        } else {
            searchResults.innerHTML = results.slice(0, 5).map(article => 
                `<p onclick="newsManager.openArticleModal(newsManager.articles.find(a => a.id === ${article.id}))">${article.title}</p>`
            ).join('');
        }
        
        searchResults.classList.add('active');
    }

    applyFilters() {
        let filtered = [...this.articles];

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(article => article.category === this.currentFilter);
        }

        // Apply tag filter
        if (this.currentTag !== 'all') {
            filtered = filtered.filter(article => article.tags.includes(this.currentTag));
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'oldest':
                    return a.date - b.date;
                case 'popular':
                    return b.views - a.views;
                case 'trending':
                    return b.likes - a.likes;
                case 'newest':
                default:
                    return b.date - a.date;
            }
        });

        this.filteredArticles = filtered;
        this.currentPage = 1;
        this.renderArticles();
    }

    updateViewMode() {
        const newsGrid = document.getElementById('newsGrid');
        if (this.currentView === 'list') {
            newsGrid.classList.add('list-view');
        } else {
            newsGrid.classList.remove('list-view');
        }
    }

    renderArticles() {
        const newsGrid = document.getElementById('newsGrid');
        const loadingSpinner = document.getElementById('loadingSpinner');
        
        if (!newsGrid) return;
        
        // Show loading
        if (loadingSpinner) {
            loadingSpinner.style.display = 'flex';
        }
        
        setTimeout(() => {
            const articlesToShow = this.filteredArticles.slice(0, this.currentPage * this.articlesPerPage);
            
            if (articlesToShow.length === 0) {
                newsGrid.innerHTML = `
                    <div class="news-no-results">
                        <i class="fas fa-search"></i>
                        <h3>No articles found</h3>
                        <p>Try adjusting your filters or search terms</p>
                    </div>
                `;
            } else {
                newsGrid.innerHTML = articlesToShow.map(article => this.createArticleCard(article)).join('');
            }
            
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
            this.updateLoadMoreButton();
        }, 500);
    }

    createArticleCard(article) {
        const timeAgo = this.getTimeAgo(article.date);
        const categoryDisplay = article.category.replace('-', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        return `
            <div class="news-card" onclick="newsManager.openArticleModal(newsManager.articles.find(a => a.id === ${article.id}))">
                <div class="news-card-image"></div>
                <div class="news-card-content">
                    <div class="news-card-meta">
                        <div class="news-card-date">
                            <i class="fas fa-calendar"></i>
                            ${timeAgo}
                        </div>
                        <div class="news-card-category">${categoryDisplay}</div>
                    </div>
                    <h3 class="news-card-title">${article.title}</h3>
                    <p class="news-card-summary">${article.summary}</p>
                    <div class="news-card-tags">
                        ${article.tags.map(tag => `<span class="news-card-tag" onclick="event.stopPropagation(); newsManager.filterByTag('${tag}')">#${tag}</span>`).join('')}
                    </div>
                    <div class="news-card-footer">
                        <button class="news-read-more-btn" onclick="event.stopPropagation(); newsManager.openArticleModal(newsManager.articles.find(a => a.id === ${article.id}))">
                            <span>Read More</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <div class="news-card-stats">
                            <div class="news-card-stat">
                                <i class="fas fa-eye"></i>
                                <span>${this.formatNumber(article.views)}</span>
                            </div>
                            <div class="news-card-stat">
                                <i class="fas fa-heart"></i>
                                <span>${this.formatNumber(article.likes)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    filterByTag(tag) {
        document.querySelectorAll('.news-tag').forEach(t => t.classList.remove('active'));
        const tagElement = document.querySelector(`[data-tag="${tag}"]`);
        if (tagElement) {
            tagElement.classList.add('active');
        }
        this.currentTag = tag;
        this.applyFilters();
    }

    loadMoreArticles() {
        const totalArticles = this.filteredArticles.length;
        const currentlyShown = this.currentPage * this.articlesPerPage;
        
        if (currentlyShown < totalArticles) {
            this.currentPage++;
            this.renderArticles();
        }
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;
        
        const totalArticles = this.filteredArticles.length;
        const currentlyShown = this.currentPage * this.articlesPerPage;
        
        if (currentlyShown >= totalArticles) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'flex';
            const remaining = totalArticles - currentlyShown;
            const btnText = loadMoreBtn.querySelector('span');
            if (btnText) {
                btnText.textContent = `LOAD MORE (${remaining} remaining)`;
            }
        }
    }

    renderSidebarContent() {
        this.renderTrendingList();
        this.renderRecentList();
    }

    renderTrendingList() {
        const trendingList = document.getElementById('trendingList');
        if (!trendingList) return;
        
        const trending = [...this.articles]
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);

        trendingList.innerHTML = trending.map(article => `
            <div class="news-trending-item" onclick="newsManager.openArticleModal(newsManager.articles.find(a => a.id === ${article.id}))">
                <div class="news-trending-item-image"></div>
                <div class="news-trending-item-content">
                    <div class="news-trending-item-title">${article.title}</div>
                    <div class="news-trending-item-date">${this.getTimeAgo(article.date)}</div>
                </div>
            </div>
        `).join('');
    }

    renderRecentList() {
        const recentList = document.getElementById('recentList');
        if (!recentList) return;
        
        const recent = [...this.articles]
            .sort((a, b) => b.date - a.date)
            .slice(0, 5);

        recentList.innerHTML = recent.map(article => `
            <div class="news-recent-item" onclick="newsManager.openArticleModal(newsManager.articles.find(a => a.id === ${article.id}))">
                <div class="news-recent-item-image"></div>
                <div class="news-recent-item-content">
                    <div class="news-recent-item-title">${article.title}</div>
                    <div class="news-recent-item-date">${this.getTimeAgo(article.date)}</div>
                </div>
            </div>
        `).join('');
    }

    openArticleModal(article) {
        const modal = document.getElementById('articleModal');
        const modalArticle = document.getElementById('modalArticle');
        
        if (!modal || !modalArticle) return;
        
        modalArticle.innerHTML = `
            <div class="modal-article-header">
                <div class="modal-article-meta">
                    <span class="modal-article-category">${article.category.replace('-', ' ').toUpperCase()}</span>
                    <span class="modal-article-date">${article.date.toLocaleDateString()}</span>
                </div>
                <h1 class="modal-article-title">${article.title}</h1>
                <div class="modal-article-author">By ${article.author}</div>
                <div class="modal-article-tags">
                    ${article.tags.map(tag => `<span class="modal-article-tag">#${tag}</span>`).join('')}
                </div>
            </div>
            <div class="modal-article-content">
                <p>${article.summary}</p>
                <br>
                <p>${article.content}</p>
                <br>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <br>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            <div class="modal-article-footer">
                <div class="modal-article-stats">
                    <span><i class="fas fa-eye"></i> ${this.formatNumber(article.views)} views</span>
                    <span><i class="fas fa-heart"></i> ${this.formatNumber(article.likes)} likes</span>
                </div>
                <div class="modal-article-share">
                    <button class="share-btn"><i class="fab fa-twitter"></i></button>
                    <button class="share-btn"><i class="fab fa-facebook"></i></button>
                    <button class="share-btn"><i class="fas fa-link"></i></button>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeArticleModal() {
        const modal = document.getElementById('articleModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(30, 30, 63, 0.95);
            border: 1px solid rgba(138, 43, 226, 0.3);
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            z-index: 1500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 8px 24px rgba(138, 43, 226, 0.3);
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}" style="color: ${type === 'success' ? '#4ade80' : type === 'error' ? '#ef4444' : '#7faafe'};"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;
        if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
        if (diffInMonths < 12) return `${diffInMonths}mo ago`;
        return `${Math.floor(diffInMonths / 12)}y ago`;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Initialize the news manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page with news content
    if (document.querySelector('.news-page-container')) {
        window.newsManager = new NewsManager();
        console.log('News page initialized successfully!');
    }
});

// Categories Cosmic Engine - Uniquely Named for No Conflicts

// Category definitions with cosmic themes and images
const cosmicCategoriesConstellations = {
    'shooter': {
        name: 'Shooter',
        image: 'images/category-shooter.jpg',
        description: 'Intense shooting and combat games'
    },
    'action': {
        name: 'Action',
        image: 'images/category-action.jpg',
        description: 'Fast-paced action adventures'
    },
    'racing': {
        name: 'Racing',
        image: 'images/category-racing.jpg',
        description: 'High-speed racing thrills'
    },
    'puzzle': {
        name: 'Puzzle',
        image: 'images/category-puzzle.jpg',
        description: 'Brain-bending puzzle challenges'
    },
    'platformer': {
        name: 'Platformer',
        image: 'images/category-platformer.jpg',
        description: 'Jumping and platform adventures'
    },
    'multiplayer': {
        name: 'Multiplayer',
        image: 'images/category-multiplayer.jpg',
        description: 'Play with friends online'
    },
    'io': {
        name: 'IO',
        image: 'images/category-io.jpg',
        description: 'Competitive IO games'
    },
    'idle': {
        name: 'Idle',
        image: 'images/category-idle.jpg',
        description: 'Relaxing idle experiences'
    },
    'sports': {
        name: 'Sports',
        image: 'images/category-sports.jpg',
        description: 'Sports and athletic games'
    },
    '3d': {
        name: '3D',
        image: 'images/category-3d.jpg',
        description: 'Immersive 3D experiences'
    },
    'arcade': {
        name: 'Arcade',
        image: 'images/category-arcade.jpg',
        description: 'Classic arcade fun'
    },
    'adventure': {
        name: 'Adventure',
        image: 'images/category-adventure.jpg',
        description: 'Epic adventure journeys'
    },
    'clicker': {
        name: 'Clicker',
        image: 'images/category-clicker.jpg',
        description: 'Addictive clicking games'
    },
    'cars': {
        name: 'Cars',
        image: 'images/category-cars.jpg',
        description: 'Car-based adventures'
    },
    '2 player': {
        name: '2-Player',
        image: 'images/category-2player.jpg',
        description: 'Two-player competitions'
    },
    'basketball': {
        name: 'Basketball',
        image: 'images/category-basketball.jpg',
        description: 'Basketball games and challenges'
    },
    '2048': {
        name: '2048',
        image: 'images/category-2048.jpg',
        description: '2048-style puzzle games'
    },
    'drawing': {
        name: 'Drawing',
        image: 'images/category-drawing.jpg',
        description: 'Creative drawing games'
    },
    'runner': {
        name: 'Runner',
        image: 'images/category-runner.jpg',
        description: 'Endless running adventures'
    },
    'watermelon': {
        name: 'Watermelon',
        image: 'images/category-watermelon.jpg',
        description: 'Fruit-themed games'
    },
    'fruit': {
        name: 'Fruit',
        image: 'images/category-fruit.jpg',
        description: 'Fresh fruit games'
    },
    'jumping': {
        name: 'Jumping',
        image: 'images/category-jumping.jpg',
        description: 'High-flying jump games'
    },
    'online': {
        name: 'Online',
        image: 'images/category-online.jpg',
        description: 'Connected online experiences'
    },
    'strategy': {
        name: 'Strategy',
        image: 'images/category-strategy.jpg',
        description: 'Strategic thinking games'
    },
    'parkour': {
        name: 'Parkour',
        image: 'images/category-parkour.jpg',
        description: 'Parkour and free-running'
    },
    'animal': {
        name: 'Animal',
        image: 'images/category-animal.jpg',
        description: 'Animal-themed adventures'
    },
    'satisfying': {
        name: 'Satisfying',
        image: 'images/category-satisfying.jpg',
        description: 'Satisfying gameplay experiences'
    },
    'endless': {
        name: 'Endless',
        image: 'images/category-endless.jpg',
        description: 'Never-ending gameplay'
    },
    'fishing': {
        name: 'Fishing',
        image: 'images/category-fishing.jpg',
        description: 'Fishing and aquatic games'
    },
    'bike': {
        name: 'Bike',
        image: 'images/category-bike.jpg',
        description: 'Motorcycle and bike games'
    },
    'levels': {
        name: 'Levels',
        image: 'images/category-levels.jpg',
        description: 'Level-based progression games'
    },
    'cooking': {
        name: 'Cooking',
        image: 'images/category-cooking.jpg',
        description: 'Cooking and food games'
    }
};

// Fallback images for categories without specific images
const cosmicCategoriesFallbackImages = {
    'shooter': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJzaG9vdGVyLWdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4YTJiZTIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0YjAwODIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNzaG9vdGVyLWdyYWQpIi8+PHBhdGggZD0iTTEwMCA1MEw3MCA4MEwxMzAgODBMMTAwIDUwWiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUwIiByPSIyMCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC42Ii8+PC9zdmc+',
    'action': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhY3Rpb24tZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzhhMmJlMiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzRiMDA4MiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2FjdGlvbi1ncmFkKSIvPjxwb2x5Z29uIHBvaW50cz0iMTAwLDUwIDEzMCw4MCA3MCw4MCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44Ii8+PHJlY3QgeD0iODAiIHk9IjEyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjYiLz48L3N2Zz4=',
    'racing': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJyYWNpbmctZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzhhMmJlMiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzRiMDA4MiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI3JhY2luZy1ncmFkKSIvPjxlbGxpcHNlIGN4PSIxMDAiIGN5PSIxMDAiIHJ4PSI2MCIgcnk9IjMwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjgiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjEyMCIgcj0iMTAiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIxMjAiIHI9IjEwIiBmaWxsPSIjZmZmIi8+PC9zdmc+',
    'puzzle': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwdXp6bGUtZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzhhMmJlMiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzRiMDA4MiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI3B1enpsZS1ncmFkKSIvPjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjgiLz48cmVjdCB4PSIxMTAiIHk9IjUwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNiIvPjxyZWN0IHg9IjUwIiB5PSIxMTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMTEwIiB5PSIxMTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44Ii8+PC9zdmc+',
    'platformer': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwbGF0Zm9ybWVyLWdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4YTJiZTIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0YjAwODIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNwbGF0Zm9ybWVyLWdyYWQpIi8+PHJlY3QgeD0iMjAiIHk9IjE2MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjgiLz48cmVjdCB4PSIxMjAiIHk9IjEyMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjgiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjE0MCIgcj0iMTUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuOSIvPjwvc3ZnPg==',
    'default': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJkZWZhdWx0LWdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4YTJiZTIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0YjAwODIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNkZWZhdWx0LWdyYWQpIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44Ii8+PC9zdmc+'
};

// Get unique categories from games database
function cosmicCategoriesExtractConstellations() {
    const uniqueTags = new Set();
    
    if (typeof allGamesDatabase !== 'undefined') {
        allGamesDatabase.forEach(game => {
            if (game.tags && Array.isArray(game.tags)) {
                game.tags.forEach(tag => uniqueTags.add(tag.toLowerCase()));
            }
        });
    }
    
    return Array.from(uniqueTags).sort();
}

// Filter games by category
function cosmicCategoriesFilterGamesByConstellation(category) {
    if (typeof allGamesDatabase === 'undefined') {
        return [];
    }
    
    return allGamesDatabase.filter(game => 
        game.tags && game.tags.some(tag => 
            tag.toLowerCase() === category.toLowerCase()
        )
    );
}

// Create game card HTML
function cosmicCategoriesCreateGameNebulaCard(game) {
    return `
        <div class="cosmic-categories-game-nebula-card" onclick="cosmicCategoriesNavigateToGame('${game.url}')">
            <img src="${game.image}" 
                 alt="${game.name}" 
                 class="cosmic-categories-game-star-image"
                 onerror="this.src='${cosmicCategoriesFallbackImages.default}'">
            <h4 class="cosmic-categories-game-title-aurora">${game.name}</h4>
        </div>
    `;
}

// Navigate to game
function cosmicCategoriesNavigateToGame(url) {
    window.location.href = url;
}

// Create category card HTML
function cosmicCategoriesCreateConstellationCard(category, categoryData, gameCount) {
    const categoryImage = cosmicCategoriesFallbackImages[category] || cosmicCategoriesFallbackImages.default;
    
    return `
        <div class="cosmic-categories-constellation-card" onclick="cosmicCategoriesToggleDimension('${category}')">
            <div class="cosmic-categories-star-header">
                <img src="${categoryImage}" 
                     alt="${categoryData.name}" 
                     class="cosmic-categories-stellar-image"
                     onerror="this.src='${cosmicCategoriesFallbackImages.default}'">
                <h3 class="cosmic-categories-cosmic-name">${categoryData.name}</h3>
                <span class="cosmic-categories-game-count-badge">${gameCount} ${gameCount === 1 ? 'Game' : 'Games'}</span>
            </div>
            <div class="cosmic-categories-expansion-portal" id="cosmic-portal-${category}">
                <div class="cosmic-categories-games-cosmos" id="cosmic-games-${category}">
                    <!-- Games will be loaded here -->
                </div>
            </div>
        </div>
    `;
}

// Configuration
const COSMIC_CATEGORIES_GAMES_PER_PAGE = 12;

// Modal state
let cosmicCategoriesCurrentModal = null;
let cosmicCategoriesCurrentPage = 1;
let cosmicCategoriesCurrentGames = [];

// Create modal HTML
function cosmicCategoriesCreateModal() {
    return `
        <div class="cosmic-categories-modal-overlay" id="cosmicCategoriesModalOverlay">
            <div class="cosmic-categories-modal-container">
                <div class="cosmic-categories-modal-header">
                    <h2 class="cosmic-categories-modal-title">
                        <img src="" alt="" class="cosmic-categories-modal-category-icon" id="cosmicModalCategoryIcon">
                        <span id="cosmicModalCategoryName">Category</span>
                    </h2>
                    <button class="cosmic-categories-modal-close" onclick="cosmicCategoriesCloseModal()">
                        ✕
                    </button>
                </div>
                <div class="cosmic-categories-modal-body">
                    <div class="cosmic-categories-modal-games-container">
                        <div class="cosmic-categories-modal-games-grid" id="cosmicModalGamesGrid">
                            <!-- Games will be loaded here -->
                        </div>
                    </div>
                    <div class="cosmic-categories-modal-pagination" id="cosmicModalPagination">
                        <!-- Pagination will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Open modal with category games
function cosmicCategoriesOpenModal(category) {
    // Ensure modal exists
    let modalOverlay = document.getElementById('cosmicCategoriesModalOverlay');
    if (!modalOverlay) {
        document.body.insertAdjacentHTML('beforeend', cosmicCategoriesCreateModal());
        modalOverlay = document.getElementById('cosmicCategoriesModalOverlay');
        
        // Close modal when clicking overlay
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                cosmicCategoriesCloseModal();
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('cosmic-categories-modal-active')) {
                cosmicCategoriesCloseModal();
            }
        });
    }
    
    // Get games for this category
    const games = cosmicCategoriesFilterGamesByConstellation(category);
    const categoryData = cosmicCategoriesConstellations[category] || {
        name: category.charAt(0).toUpperCase() + category.slice(1)
    };
    
    // Set modal content
    document.getElementById('cosmicModalCategoryName').textContent = categoryData.name;
    const iconImg = document.getElementById('cosmicModalCategoryIcon');
    iconImg.src = cosmicCategoriesFallbackImages[category] || cosmicCategoriesFallbackImages.default;
    iconImg.alt = categoryData.name;
    
    // Store current state
    cosmicCategoriesCurrentModal = category;
    cosmicCategoriesCurrentGames = games;
    cosmicCategoriesCurrentPage = 1;
    
    // Render games and pagination
    cosmicCategoriesRenderModalPage();
    
    // Show modal
    modalOverlay.classList.add('cosmic-categories-modal-active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close modal
function cosmicCategoriesCloseModal() {
    const modalOverlay = document.getElementById('cosmicCategoriesModalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('cosmic-categories-modal-active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Reset state
        cosmicCategoriesCurrentModal = null;
        cosmicCategoriesCurrentPage = 1;
        cosmicCategoriesCurrentGames = [];
    }
}

// Render current page of games
function cosmicCategoriesRenderModalPage() {
    const gamesGrid = document.getElementById('cosmicModalGamesGrid');
    const pagination = document.getElementById('cosmicModalPagination');
    
    if (!gamesGrid || !pagination) return;
    
    const totalGames = cosmicCategoriesCurrentGames.length;
    const totalPages = Math.ceil(totalGames / COSMIC_CATEGORIES_GAMES_PER_PAGE);
    const startIndex = (cosmicCategoriesCurrentPage - 1) * COSMIC_CATEGORIES_GAMES_PER_PAGE;
    const endIndex = startIndex + COSMIC_CATEGORIES_GAMES_PER_PAGE;
    const currentPageGames = cosmicCategoriesCurrentGames.slice(startIndex, endIndex);
    
    // Render games
    if (currentPageGames.length > 0) {
        gamesGrid.innerHTML = currentPageGames.map(cosmicCategoriesCreateModalGameCard).join('');
    } else {
        gamesGrid.innerHTML = '<div class="cosmic-categories-modal-no-games">No games found in this dimension...</div>';
    }
    
    // Render pagination
    if (totalPages > 1) {
        pagination.innerHTML = cosmicCategoriesCreatePaginationHTML(totalPages);
        pagination.style.display = 'flex';
    } else {
        pagination.style.display = 'none';
    }
}

// Create modal game card
function cosmicCategoriesCreateModalGameCard(game) {
    return `
        <div class="cosmic-categories-game-nebula-card" onclick="cosmicCategoriesNavigateToGame('${game.url}')">
            <img src="${game.image}" 
                 alt="${game.name}" 
                 class="cosmic-categories-game-star-image"
                 onerror="this.src='${cosmicCategoriesFallbackImages.default}'">
            <h4 class="cosmic-categories-game-title-aurora">${game.name}</h4>
        </div>
    `;
}

// Create pagination HTML
function cosmicCategoriesCreatePaginationHTML(totalPages) {
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="cosmic-categories-pagination-button" 
                onclick="cosmicCategoriesChangePage(${cosmicCategoriesCurrentPage - 1})"
                ${cosmicCategoriesCurrentPage === 1 ? 'disabled' : ''}>
            ‹ Previous
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === cosmicCategoriesCurrentPage;
        paginationHTML += `
            <button class="cosmic-categories-pagination-button ${isActive ? 'cosmic-categories-active-page' : ''}" 
                    onclick="cosmicCategoriesChangePage(${i})">
                ${i}
            </button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button class="cosmic-categories-pagination-button" 
                onclick="cosmicCategoriesChangePage(${cosmicCategoriesCurrentPage + 1})"
                ${cosmicCategoriesCurrentPage === totalPages ? 'disabled' : ''}>
            Next ›
        </button>
    `;
    
    // Page info
    const startItem = (cosmicCategoriesCurrentPage - 1) * COSMIC_CATEGORIES_GAMES_PER_PAGE + 1;
    const endItem = Math.min(cosmicCategoriesCurrentPage * COSMIC_CATEGORIES_GAMES_PER_PAGE, cosmicCategoriesCurrentGames.length);
    
    paginationHTML += `
        <div class="cosmic-categories-page-info">
            ${startItem}-${endItem} of ${cosmicCategoriesCurrentGames.length} games
        </div>
    `;
    
    return paginationHTML;
}

// Change page
function cosmicCategoriesChangePage(newPage) {
    const totalPages = Math.ceil(cosmicCategoriesCurrentGames.length / COSMIC_CATEGORIES_GAMES_PER_PAGE);
    
    if (newPage < 1 || newPage > totalPages) return;
    
    cosmicCategoriesCurrentPage = newPage;
    cosmicCategoriesRenderModalPage();
    
    // Scroll to top of games grid
    const gamesContainer = document.querySelector('.cosmic-categories-modal-games-container');
    if (gamesContainer) {
        gamesContainer.scrollTop = 0;
    }
}

// Update the toggle function to open modal instead
function cosmicCategoriesToggleDimension(category) {
    cosmicCategoriesOpenModal(category);
}

// Initialize categories page
function cosmicCategoriesInitializeUniverse() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;
    
    const categories = cosmicCategoriesExtractConstellations();
    
    if (categories.length === 0) {
        categoriesGrid.innerHTML = '<div class="cosmic-categories-void-message">No categories available. The universe is still expanding...</div>';
        return;
    }
    
    let categoriesHTML = '';
    
    categories.forEach(category => {
        const games = cosmicCategoriesFilterGamesByConstellation(category);
        const gameCount = games.length;
        
        if (gameCount > 0) {
            const categoryData = cosmicCategoriesConstellations[category] || {
                name: category.charAt(0).toUpperCase() + category.slice(1),
                description: `${category} games`
            };
            
            categoriesHTML += cosmicCategoriesCreateConstellationCard(category, categoryData, gameCount);
        }
    });
    
    if (categoriesHTML) {
        categoriesGrid.innerHTML = categoriesHTML;
    } else {
        categoriesGrid.innerHTML = '<div class="cosmic-categories-void-message">No games available in any category yet...</div>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure allGamesDatabase is loaded
    setTimeout(cosmicCategoriesInitializeUniverse, 100);
});

// Also initialize if script loads after DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cosmicCategoriesInitializeUniverse);
} else {
    setTimeout(cosmicCategoriesInitializeUniverse, 100);
}