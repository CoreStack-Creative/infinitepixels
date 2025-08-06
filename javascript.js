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
   { name: "1v1 Lol", link: "/game.html?game=1v1lol" },
   { name: "3D Formula Racing", link: "/game.html?game=3dformularacing" },
   { name: "Basket Random", link: "/game.html?game=basketrandom" },
   { name: "Cookie Clicker", link: "/game.html?game=cookieclicker" },
   { name: "Cube Arena 2048", link: "/game.html?game=cubearena2048" },
   { name: "Draw Climber", link: "/game.html?game=drawclimber" },
   { name: "Fruit Merge", link: "/game.html?game=fruitmerge" },
   { name: "Helix Jump", link: "/game.html?game=helixjump" },
   { name: "Masked Special Forces", link: "/game.html?game=maskedspecialforces" },
   { name: "Paper Io", link: "/game.html?game=paperio" },
   { name: "Parkour Block 3D", link: "/game.html?game=parkourblock3d" },
   { name: "Poly Track", link: "/game.html?game=polytrack" },
   { name: "Rodeo Stampede", link: "/game.html?game=rodeostampede" },
   { name: "Spiral Roll", link: "/game.html?game=spiralroll" },
   { name: "Subway Surfers", link: "/game.html?game=subwaysurfers" },
   { name: "Tiny Fishing", link: "/game.html?game=tinyfishing" },
   { name: "Bloxd io", link: "/game.html?game=bloxdio" },
   { name: "Moto X3M", link: "/game.html?game=motox3m" },
   { name: "Tall Man Run", link: "/game.html?game=tallmanrun" },
   { name: "Happy Wheels", link: "/game.html?game=happywheels" },
   { name: "Madalin Stunt Cars Pro", link: "/game.html?game=madalinstuntcarspro" },
   { name: "Fall Cars: Hexagon", link: "/game.html?game=fallcarshexagon" },
   { name: "Fruit Ninja", link: "/game.html?game=fruitninja" },
   { name: "Ball 2048", link: "/game.html?game=ball2048" },
   { name: "Ice Fishing", link: "/game.html?game=icefishing" },
   { name: "Stick Fighter 3D", link: "/game.html?game=stickfighter3d" },
   { name: "Papas Burgeria", link: "/game.html?game=papasburgeria" },
   { name: "Bullet Army Run", link: "/game.html?game=bulletarmyrun" },
   { name: "Survival Race", link: "/game.html?game=survivalrace" },
   { name: "Block Stack 3D", link: "/game.html?game=blockstack3d" },
   { name: "Rocket Bikes Highway Race", link: "/game.html?game=rocketbikeshighwayrace" },
   { name: "Offroad Cycle 3D", link: "/game.html?game=offroadcycle3d" },
   { name: "Funny Shooter 2", link: "/game.html?game=funnyshooter2" },
   { name: "Draw the Car Path", link: "/game.html?game=drawthecarpath" },
   { name: "Ninja Arashi", link: "/game.html?game=ninjaarashi" },
   { name: "Shell Shockers", link: "/game.html?game=shellschockers" },
   { name: "Smash Karts", link: "/game.html?game=smashkarts" },
   { name: "Ships 3D", link: "/game.html?game=ships3d" },
   { name: "Goober Dash", link: "/game.html?game=gooberdash" },
   { name: "Golf Clash", link: "/game.html?game=golfclash" }, 
   { name: "Similing Glass", link: "/game.html?game=similingglass" },
   { name: "Crowdy City IO", link: "/game.html?game=crowdycityio" }, 
   { name: "Archery King 3D", link: "/game.html?game=archeryking3d" },
   { name: "Scooter Touchgrind", link: "/game.html?game=scootertouchgrind" }
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
                    let destination = game.link;

                    // If link is relative (starts with "/"), prepend domain
                    if (destination.startsWith('/')) {
                        destination = 'https://www.infinite-pixels.com' + destination;
                    }

                    window.location.href = destination;
                }

                searchResults.classList.remove('active');
                searchInput.value = '';
            });
            searchResults.appendChild(resultElement);
        });

        searchResults.classList.add('active');
    }
}


// Fullscreen functionality - Native browser fullscreen on game container


if (fullscreenBtn) {
   fullscreenBtn.addEventListener('click', toggleFullscreen);
} else {
   console.log('Fullscreen button not found');
}

let exitNotification = null;

function toggleFullscreen() {
   if (!gameContainer || !fullscreenBtn) {
       console.log('Required elements for fullscreen not found');
       return;
   }
   
   if (!document.fullscreenElement) {
       enterNativeFullscreen();
   } else {
       exitNativeFullscreen();
   }
}

async function enterNativeFullscreen() {
   try {
       // Request fullscreen directly on the game container
       const element = gameContainer;
       
       if (element.requestFullscreen) {
           await element.requestFullscreen();
       } else if (element.mozRequestFullScreen) {
           await element.mozRequestFullScreen();
       } else if (element.webkitRequestFullscreen) {
           await element.webkitRequestFullscreen();
       } else if (element.msRequestFullscreen) {
           await element.msRequestFullscreen();
       }
       
   } catch (error) {
       console.error('Error entering fullscreen:', error);
   }
}

function exitNativeFullscreen() {
   if (document.exitFullscreen) {
       document.exitFullscreen();
   } else if (document.mozCancelFullScreen) {
       document.mozCancelFullScreen();
   } else if (document.webkitExitFullscreen) {
       document.webkitExitFullscreen();
   } else if (document.msExitFullscreen) {
       document.msExitFullscreen();
   }
}

function showExitNotification() {
   // Remove existing notification if any
   removeExitNotification();
   
   // Create the exit notification
   exitNotification = document.createElement('div');
   exitNotification.style.cssText = `
       position: fixed;
       top: 50%;
       left: 50%;
       transform: translateX(-50%) translateY(-50%);
       background: rgba(0, 0, 0, 0.8);
       color: white;
       padding: 8px 16px;
       border-radius: 4px;
       font-size: 14px;
       font-family: Arial, sans-serif;
       z-index: 10001;
       pointer-events: none;
       opacity: 0;
       transition: opacity 0.3s ease;
   `;
   exitNotification.textContent = `${window.location.hostname} — To exit full screen, press esc`;
   
   // Add to document
   document.body.appendChild(exitNotification);
   
   // Show notification briefly
   setTimeout(() => {
       if (exitNotification) {
           exitNotification.style.opacity = '1';
       }
   }, 100);
   
   setTimeout(() => {
       if (exitNotification) {
           exitNotification.style.opacity = '0';
       }
   }, 3000);
}

function removeExitNotification() {
   if (exitNotification && document.body.contains(exitNotification)) {
       document.body.removeChild(exitNotification);
       exitNotification = null;
   }
}

// Listen for fullscreen change events
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
   if (document.fullscreenElement || 
       document.webkitFullscreenElement || 
       document.mozFullScreenElement || 
       document.msFullscreenElement) {
       // Entered fullscreen
       isFullscreen = true;
       fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i><span>Exit Fullscreen</span>';
       
       // Add CSS to make the game fill the fullscreen container
       const gameFrame = document.getElementById('gameFrame');
       if (gameFrame) {
           gameFrame.style.width = '100%';
           gameFrame.style.height = '100vh';
       }
       
       // Hide other elements in the container during fullscreen
       const controlBar = document.getElementById('gameControlBar');
       const collapseArrow = document.getElementById('collapseArrow');
       
       if (controlBar) controlBar.style.display = 'none';
       if (collapseArrow) collapseArrow.style.display = 'none';
       
       // Show exit notification
       showExitNotification();
       
   } else {
       // Exited fullscreen
       isFullscreen = false;
       fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i><span>Fullscreen</span>';
       
       // Restore original game styles
       const gameFrame = document.getElementById('gameFrame');
       if (gameFrame) {
           gameFrame.style.width = '100%';
           gameFrame.style.height = '600px';
       }
       
       // Show other elements again
       const controlBar = document.getElementById('gameControlBar');
       const collapseArrow = document.getElementById('collapseArrow');
       
       if (controlBar) controlBar.style.display = '';
       if (collapseArrow) collapseArrow.style.display = '';
       
       // Remove exit notification
       removeExitNotification();
   }
}

// Show fullscreen exit message (keeping your original function for compatibility)
function showFullscreenMessage() {
   showExitNotification();
}

function removeFullscreenMessage() {
   removeExitNotification();
}

// Collapse arrow functionality (simplified for native fullscreen)
if (collapseArrow) {
   collapseArrow.addEventListener('click', () => {
       barCollapsed = !barCollapsed;

       if (gameControlBar) {
           if (barCollapsed) {
               gameControlBar.classList.add('collapsed');
               collapseArrow.classList.add('rotated');
           } else {
               gameControlBar.classList.remove('collapsed');
               collapseArrow.classList.remove('rotated');
           }
       }
   });
}

// Enhanced window resize handler
function handleResize() {
   const isMobile = window.innerWidth <= 768;

   if (isMobile && !sidebarCollapsed && sidebar && mainContent && sidebarToggle) {
       sidebar.classList.add('collapsed');
       mainContent.classList.add('expanded');
       sidebarCollapsed = true;
       sidebarToggle.classList.remove('selected');
   }

   // No special handling needed for native fullscreen
   if (!isFullscreen && gameContainer && gameCanvas) {
       const container = gameContainer.getBoundingClientRect();
       if (container.width > 0) {
           gameCanvas.style.width = '100%';
           gameCanvas.style.height = 'auto';
       }
   }
}

// Make sure resize handler is properly attached
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', () => {
   setTimeout(handleResize, 100);
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
       if (document.fullscreenElement) {
           exitNativeFullscreen();
       }
      
       // Close video modal if active
       const videoModal = document.getElementById('videoModal');
       if (videoModal && videoModal.classList.contains('active')) {
           closeVideoModal();
       }
   }
});


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
   'game.html?game=1v1lol',
   'game.html?game=3dformularacing',
   'game.html?game=basketrandom',
   'game.html?game=cookieclicker',
   'game.html?game=cubearena2048',
   'game.html?game=drawclimber',
   'game.html?game=fruitmerge',
   'game.html?game=helixjump',
   'game.html?game=maskedspecialforces',
   'game.html?game=paperio',
   'game.html?game=parkourblock3d',
   'game.html?game=polytrack',
   'game.html?game=rodeostampede',
   'game.html?game=spiralroll',
   'game.html?game=subwaysurfers',
   'game.html?game=tinyfishing',
   'game.html?game=bloxdio',
   'game.html?game=motox3m',
   'game.html?game=tallmanrun',
   'game.html?game=happywheels',
   'game.html?game=madalinstuntcarspro',
   'game.html?game=fallcarshexagon',
   'game.html?game=fruitninja',
   'game.html?game=ball2048',
   'game.html?game=icefishing',
   'game.html?game=stickfighter3d',
   'game.html?game=papasburgeria',
   'game.html?game=bulletarmyrun',
   'game.html?game=survivalrace',
   'game.html?game=blockstack3d',
   'game.html?game=rocketbikeshighwayrace',
   'game.html?game=offroadcycle3d',
   'game.html?game=funnyshooter2',
   'game.html?game=drawthecarpath',
   'game.html?game=ninjaarashi',
   'game.html?game=shellschockers',
   'game.html?game=smashkarts',
   'game.html?game=ships3d',
   'game.html?game=gooberdash',
   'game.html?game=golfclash',
   'game.html?game=similingglass',
   'game.html?game=crowdycityio',
   'game.html?game=archeryking3d',
   'game.html?game=scootertouchgrind'
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

document.addEventListener('DOMContentLoaded', function() {
    // Any other code that uses DOM elements should go here too
});

// Start redirect process when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Show redirect overlay almost immediately (100ms delay for smooth animation)
    setTimeout(showRedirectAndGo, 100);
});

// Enhanced games database with descriptions and game URLs
const gamesDatabase = [
 {
 id: 1,
 name: "1v1 Lol",
 image: "images/1v1lolimage.jpg",
 slug: "1v1lol",
 gameUrl: "https://1v1.lol/",
 tags: ["shooter", "action", "multiplayer"],
 description: "1v1.LOL is an online third-person shooter with cool building mechanics. Battle royale, build battle, box fight, zone wars and more game modes to enjoy!"
 },
 {
 id: 2,
 name: "3D Formula Racing",
 image: "images/3dformularacingimage.jpg",
 slug: "3dformularacing",
 gameUrl: "https://html5.gamemonetize.co/tia5pbecnefai0pnlkapzyzzfh0yobn4/",
 tags: ["racing", "cars", "3d"],
 description: "Experience the thrill of Formula 1 racing in this high-speed 3D racing game. Navigate challenging tracks and compete against other racers to reach the finish line first!"
 },
 {
 id: 3,
 name: "Basket Random",
 image: "images/basketrandomimage.jpg",
 slug: "basketrandom",
 gameUrl: "https://html5.gamemonetize.co/anaaahgt57d5t2tddrbc1m4qq97vz1jd/",
 tags: ["2 player", "basketball", "sports"],
 description: "Basket Random is a fun basketball game with ragdoll physics! Play against a friend or the computer in this wacky sports game where anything can happen."
 },
 {
 id: 4,
 name: "Cookie Clicker",
 image: "images/cookieclickerimage.jpg",
 slug: "cookieclicker",
 gameUrl: "https://html5.gamemonetize.co/z5n072q7gj0w969r5ul4ignnxe0fzsun/",
 tags: ["clicker", "idle", "cooking"],
 description: "The original idle clicker game! Click cookies to earn points and buy upgrades to generate even more cookies automatically. How many cookies can you make?"
 },
 {
 id: 5,
 name: "Cube Arena 2048",
 image: "images/cubearenaimage.jpg",
 slug: "cubearena2048",
 gameUrl: "https://html5.gamemonetize.co/83up5y2u78nvd5ngywugy6j4g3im4lda/",
 tags: ["3d", "2048", "io"],
 description: "Combine the classic 2048 puzzle with 3D cube mechanics! Merge cubes with the same numbers to create higher values while navigating a 3D arena."
 },
 {
 id: 6,
 name: "Draw Climber",
 image: "images/drawclimberimage.jpg",
 slug: "drawclimber",
 gameUrl: "https://html5.gamemonetize.co/0lkapk5bhk46tk0s8d971iyarszc8ib8/",
 tags: ["puzzle", "drawing", "runner"],
 description: "Draw legs for your character to help them climb over obstacles! Each obstacle requires different leg shapes, so be creative with your drawings!"
 },
 {
 id: 7,
 name: "Fruit Merge",
 image: "images/fruitmergeimage.jpg",
 slug: "fruitmerge",
 gameUrl: "https://html5.gamemonetize.co/rgz7sjhynwsheffgv4ijzz1nj2oa1nur/",
 tags: ["satisfying", "puzzle", "fruit"],
 description: "Drop and merge identical fruits to create new ones! Watch as small fruits combine into bigger ones in this relaxing and satisfying puzzle game."
 },
 {
 id: 8,
 name: "Helix Jump",
 image: "images/helixjumpimage.jpg",
 slug: "helixjump",
 gameUrl: "https://html5.gamemonetize.co/ghzimuehf6yw4vkdaywk1s9x3mrbgq0w/",
 tags: ["arcade", "endless", "platformer"],
 description: "Bounce the ball through the helix tower maze! Avoid the colored sections and try to reach the bottom. How far can you fall?"
 },
 {
 id: 9,
 name: "Masked Special Forces",
 image: "images/maskedspecialforcesimage.jpg",
 slug: "maskedspecialforces",
 gameUrl: "https://html5.gamemonetize.co/1s10wsxntjub41qo2puh7jlx3qmbvh5t/",
 tags: ["shooter", "online", "multiplayer"],
 description: "Join the special forces in this tactical multiplayer shooter! Work with your team to complete missions and eliminate enemies in various combat scenarios."
 },
 {
 id: 10,
 name: "Paper Io",
 image: "images/paperioimage.jpg",
 slug: "paperio",
 gameUrl: "https://html5.gamemonetize.co/1skj7a1hu68a1p31ag4ywljq4gb18oma/",
 tags: ["io", "strategy", "multiplayer"],
 description: "Conquer as much territory as possible in this addictive io game! Draw lines to claim areas while avoiding other players who can eliminate you."
 },
 {
 id: 11,
 name: "Parkour Block 3D",
 image: "images/parkourblock3dimage.jpg",
 slug: "parkourblock3d",
 gameUrl: "https://html5.gamemonetize.co/hrsxh2clxg229ty294gdlbjzeejglgmp/",
 tags: ["parkour", "3d", "platformer"],
 description: "Master the art of parkour in this 3D block world! Jump, slide, and climb through challenging obstacle courses. Test your skills and reflexes!"
 },
 {
 id: 12,
 name: "Poly Track",
 image: "images/polytrackimage.jpg",
 slug: "polytrack",
 gameUrl: "https://www.kodub.com/apps/polytrack",
 tags: ["racing", "cars", "online"],
 description: "Race through stylish low-poly tracks in this modern racing game! Navigate challenging courses with realistic physics and smooth controls."
 },
 {
 id: 13,
 name: "Rodeo Stampede",
 image: "images/rodeostampedeimage.jpg",
 slug: "rodeostampede",
 gameUrl: "https://html5.gamemonetize.co/p4y8uwto5cchbs371ua7hxqzidihi213/",
 tags: ["adventure", "animal", "racing"],
 description: "Lasso and tame wild animals in this endless adventure! Ride buffalo, elephants, and more while avoiding obstacles in the wild savanna."
 },
 {
 id: 14,
 name: "Spiral Roll",
 image: "images/spiralrollimage.jpg",
 slug: "spiralroll",
 gameUrl: "https://html5.gamemonetize.co/fq17wpd1ygq5kppyqq9souztit8jlkk0/",
 tags: ["platformer", "satisfying", "3d"],
 description: "Chip away at the spiral tower with your ball! Navigate through the colorful spiral while avoiding obstacles. It's oddly satisfying!"
 },
 {
 id: 15,
 name: "Subway Surfers",
 image: "images/subwaysurfersimage.jpg",
 slug: "subwaysurfers",
 gameUrl: "https://html5.gamemonetize.co/du2cejdc5we8szc7vgfdatel08oxr0zg/",
 tags: ["endless", "platformer", "parkour"],
 description: "Run as fast as you can in this endless runner! Dodge trains, collect coins, and surf through the subway while avoiding the grumpy inspector."
 },
 {
 id: 16,
 name: "Tiny Fishing",
 image: "images/tinyfishingimage.jpg",
 slug: "tinyfishing",
 gameUrl: "https://html5.gamemonetize.co/hzvsxelbew3y0v09vyql2n40kgtziqyg/",
 tags: ["idle", "fishing", "clicker"],
 description: "Cast your line and catch fish in this relaxing idle fishing game! Upgrade your equipment and discover new fish species in deeper waters."
 },
 {
 id: 17,
 name: "Bloxd io",
 image: "images/bloxdioimage.jpg",
 slug: "bloxdio",
 gameUrl: "https://bloxd.io/",
 tags: ["io", "parkour", "multiplayer"],
 description: "Block-style battle royale with parkour elements! Build, fight, and survive against other players in this unique multiplayer experience."
 },
 {
 id: 18,
 name: "Moto X3M",
 image: "images/motox3mimage.jpg",
 slug: "motox3m",
 gameUrl: "https://html5.gamemonetize.co/cwvgstrd6an0nqgcf0rdd7phev53fnm1/",
 tags: ["bike", "racing", "levels"],
 description: "Ride your dirt bike through challenging obstacle courses! Perform stunts and overcome deadly traps in this thrilling motorcycle racing game."
 },
 {
 id: 19,
 name: "Tall Man Run",
 image: "images/tallmanrunimage.jpg",
 slug: "tallmanrun",
 gameUrl: "https://html5.gamemonetize.co/skdbuby5hhfbfz0r7xl3jbcovwhugsfk/",
 tags: ["3d", "platformer", "runner"],
 description: "Run and grow taller by collecting the right items! Avoid obstacles that make you shorter and reach the finish line as tall as possible!"
 },
 {
 id: 20,
 name: "Happy Wheels",
 image: "images/happywheelsimage.jpg",
 slug: "happywheels",
 gameUrl: "https://html5.gamemonetize.co/2aibzvt72bgq8i17drkp5y9a6v7a4rq8/",
 tags: ["adventure", "racing", "sports"],
 description: "Navigate through dangerous obstacle courses in this physics-based game! Choose your character and vehicle, then try to reach the finish line in one piece!"
 },
 {
 id: 21,
 name: "Madalin Stunt Cars Pro",
 image: "images/madalinstuntcarsproimage.jpg",
 slug: "madalinstuntcarspro",
 gameUrl: "https://html5.gamemonetize.co/d452kzeh8w8ouiigleba5g52hgu805ls/",
 tags: ["multiplayer", "racing", "cars"],
 description: "Perform incredible stunts with supercars! Drive through massive stunt arenas and showcase your driving skills with realistic car physics."
 },
 {
 id: 22,
 name: "Ice Fishing",
 image: "images/icefishingimage.jpg",
 slug: "icefishing",
 gameUrl: "https://html5.gamemonetize.co/ixcjahmstfww53i0yvwn30089nd6e2ay/",
 tags: ["fishing", "3d", "sports"],
 description: "Try your luck at ice fishing in this 3D winter sports game! Drill holes in the ice and catch fish while enjoying the peaceful snowy environment."
 },
 {
 id: 23,
 name: "Stick Fighter 3D",
 image: "images/stickfighter3dimage.jpg",
 slug: "stickfighter3d",
 gameUrl: "https://html5.gamemonetize.co/vlskz7dtsxmpg34pu546de1wjng6ffob/",
 tags: ["action", "3d", "2 player"],
 description: "Engage in epic 3D stick figure battles! Fight against AI or challenge a friend in this action-packed fighting game with realistic physics."
 },
 {
 id: 24,
 name: "Fruit Ninja",
 image: "images/fruitninjaimage.jpg",
 slug: "fruitninja",
 gameUrl: "https://html5.gamemonetize.co/4kci7og3klgj0ivy2wz3gdvd9dth5e7n/",
 tags: ["fruit", "satisfying", "arcade"],
 description: "Slice and dice fruits with your finger! Avoid the bombs and try to cut as many fruits as possible in this satisfying arcade classic."
 },
 {
 id: 25,
 name: "Fall Cars: Hexagon",
 image: "images/fallcarshexagonimage.jpg",
 slug: "fallcarshexagon",
 gameUrl: "https://html5.gamemonetize.co/5ms4h5xfk8lssrl6iitqdpj8uk4tketp/",
 tags: ["cars", "2 player", "platformer"],
 description: "Race on hexagonal platforms that fall away! Be the last car standing in this thrilling multiplayer survival racing game."
 },
 {
 id: 26,
 name: "Ball 2048",
 image: "images/ball2048image.jpg",
 slug: "ball2048",
 gameUrl: "https://html5.gamemonetize.co/e3jt923v68e8vninc5fcg8jbzpy4p5tz/",
 tags: ["2048", "levels", "runner"],
 description: "Roll your ball and merge with others to create higher numbers! Navigate through levels while growing your ball in this 2048-inspired runner."
 },
 {
 id: 27,
 name: "Papas Burgeria",
 image: "images/papasburgeriaimage.jpg",
 slug: "papasburgeria",
 gameUrl: "https://html5.gamemonetize.co/uw4s71zy0s3jxo6hckel04mw9rbopba8/",
 tags: ["cooking", "clicker", "arcade"],
 description: "Run Papa's burger restaurant! Take orders, grill patties, and serve delicious burgers to satisfied customers in this time management cooking game."
 },
 {
 id: 28,
 name: "Bullet Army Run",
 image: "images/bulletarmyrunimage.jpg",
 slug: "bulletarmyrun",
 gameUrl: "https://html5.gamemonetize.co/05v9me4wnyc3flvn250njm13yjh1cacj/",
 tags: ["levels", "runner", "arcade"],
 description: "Run through enemy territory while shooting obstacles! Collect ammunition and power-ups as you advance through challenging military-themed levels."
 },
 {
 id: 29,
 name: "Ninja Arashi",
 image: "images/ninjaarashiimage.jpg",
 slug: "ninjaarashi",
 gameUrl: "https://html5.gamemonetize.co/5dgqcoefxg0lpgt7o5mduxysprpft7cz/",
 tags: ["adventure", "action", "platformer"],
 description: "Help the ninja Arashi save his son from the evil Orochi! Jump, dash, and fight through dangerous levels in this epic ninja adventure."
 },
 {
 id: 30,
 name: "Funny Shooter 2",
 image: "images/funnyshooter2image.jpg",
 slug: "funnyshooter2",
 gameUrl: "https://html5.gamemonetize.co/6qfki05meirgub3gv0l2qacr2g3wnsch/",
 tags: ["shooter", "action", "3d"],
 description: "Battle against funny red enemies in this 3D first-person shooter! Use various weapons and tactics to eliminate all enemies in each level."
 },
 {
 id: 31,
 name: "Survival Race",
 image: "images/survivalraceimage.jpg",
 slug: "survivalrace",
 gameUrl: "https://html5.gamemonetize.co/9km7avlf26r9se5gam8028uq4p6drmx1/",
 tags: ["racing", "multiplayer", "platformer"],
 description: "Race against other players while avoiding deadly obstacles! Only the fastest and smartest racers will survive to the end."
 },
 {
 id: 32,
 name: "Offroad Cycle 3D",
 image: "images/offroadcycle3dimage.jpg",
 slug: "offroadcycle3d",
 gameUrl: "https://html5.gamemonetize.co/su4m68j4kkt3jsap0867audlbk8hkrpc/",
 tags: ["racing", "bike", "3d"],
 description: "Take your mountain bike on challenging offroad trails! Navigate through rough terrain and perform stunts in this realistic 3D cycling game."
 },
 {
 id: 33,
 name: "Rocket Bike Highway Race",
 image: "images/rocketbikeshighwayraceimage.jpg",
 slug: "rocketbikeshighwayrace",
 gameUrl: "https://html5.gamemonetize.co/ia1hvdgxut4k7h3kjhjecyx7iwhxi010/",
 tags: ["racing", "bike", "3d"],
 description: "Race your rocket-powered bike through busy highways! Dodge traffic and use your rocket boost to reach incredible speeds in this futuristic racing game."
 },
 {
 id: 34,
 name: "Block Stack 3D",
 image: "images/blockstack3dimage.jpg",
 slug: "blockstack3d",
 gameUrl: "https://html5.gamemonetize.co/trltidnug856kmwd6pglqxsti7v8r3g9/",
 tags: ["3d", "puzzle", "endless"],
 description: "Stack blocks as high as possible in this 3D puzzle game! Time your drops perfectly to build the tallest tower without it falling over."
 },
 {
 id: 35,
 name: "Draw the Car Path",
 image: "images/drawthecarpathimage.jpg",
 slug: "drawthecarpath",
 gameUrl: "https://html5.gamemonetize.co/9nx8j6pdpcndxl3sxi5xlq9x8d4tc14m/",
 tags: ["drawing", "puzzle", "levels"],
 description: "Draw the path for cars to reach their parking spots! Plan your routes carefully to avoid collisions and get all cars safely parked."
 },
 {
 id: 36,
 name: "Shell Shockers",
 image: "images/shellshockersimage.jpg",
 slug: "shellshockers",
 gameUrl: "https://shellshock.io/",
 tags: ["shooter", "io", "multiplayer"],
 description: "Battle as an egg in this hilarious multiplayer first-person shooter! Crack your opponents while avoiding getting scrambled yourself."
 },
 {
 id: 37,
 name: "Smash Karts",
 image: "images/smashkartsimage.jpg",
 slug: "smashkarts",
 gameUrl: "https://smashkarts.io/",
 tags: ["racing", "action", "multiplayer"],
 description: "Race around tracks and battle other players with weapons! Collect power-ups and try to be the last kart standing in this action-packed racing game."
 },
 {
 id: 38,
 name: "Ships 3D",
 image: "images/ships3dimage.jpg",
 slug: "ships3d",
 gameUrl: "https://yp3d.com/ships3d/",
 tags: ["3d", "action", "multiplayer"],
 description: "Command your warship in epic naval battles! Engage in 3D maritime combat against other players and AI enemies on the high seas."
 },
 {
 id: 39,
 name: "Goober Dash",
 image: "images/gooberdashimage.jpg",
 slug: "gooberdash",
 gameUrl: "https://gooberdash.winterpixel.io",
 tags: ["io", "platformer", "multiplayer"],
 description: "Race through obstacle courses with other players! Navigate platforms, avoid traps, and be the first to cross the finish line in this multiplayer platformer."
 },
 {
 id: 40,
 name: "Golf Clash",
 image: "images/golfclashimage.jpg",
 slug: "golfclash",
 gameUrl: "https://html5.gamemonetize.co/ywl5omork0jwarou5xrxinfjgxphqh6s/",
 tags: ["sports", "arcade", "multiplayer"],
 description: "Tee off in this competitive golf game! Master your swing and compete against players worldwide in various golf courses and tournaments."
 },
 {
 id: 41,
 name: "Smiling Glass",
 image: "images/smilingglassimage.jpg",
 slug: "smilingglass",
 gameUrl: "https://html5.gamemonetize.co/58l05tjrdda0semxivccmttcg2laqsbv/",
 tags: ["satisfying", "puzzle", "clicker"],
 description: "Fill the glass with water and make it smile! Draw lines to guide the water flow and solve increasingly challenging physics-based puzzles."
 },
 {
 id: 42,
 name: "Crowdy City IO",
 image: "images/crowdycityioimage.jpg",
 slug: "crowdycityio",
 gameUrl: "https://html5.gamemonetize.co/3yrlza468z3vsm3r4mv8v9bi7iv2p3tl/",
 tags: ["io", "strategy", "multiplayer"],
 description: "Gather the biggest crowd in the city! Run around and collect followers while avoiding other players' crowds in this competitive io game."
 },
 {
 id: 43,
 name: "Archery King 3D",
 image: "images/archeryking3dimage.jpg",
 slug: "archeryking3d",
 gameUrl: "https://html5.gamemonetize.co/8zxe2n90tqn7nbpp6z3fqdq1xinsh5j4/",
 tags: ["3d", "strategy", "sports"],
 description: "Master the art of archery in this realistic 3D sports game! Aim carefully and account for wind and distance to hit bullseyes and become the archery champion."
 },
 {
 id: 44,
 name: "Scooter Touchgrind",
 image: "images/scootertouchgrindimage.jpg",
 slug: "scootertouchgrind",
 gameUrl: "https://html5.gamemonetize.co/jkgxa35eeoodbqfj9hlfya96yq75weoi/",
 tags: ["sports", "3d", "racing"],
 description: "Scooter Touchgrind Tricks 3D is a fun driving game where you control a scooter through exciting levels full of obstacles. Your goal is simply to reach the finish line without crashing! Along the way, you'll need to dodge obstacles and keep your balance as the tracks get harder. You can collect coins to unlock cooler scooters and try out different styles."
 }
];

// Make games database globally accessible
window.gamesDatabase = gamesDatabase;
window.allGamesDatabase = gamesDatabase; // Fallback for old format

// Game loader functionality for individual game pages
class GameLoader {
 constructor() {
 this.currentGame = null;
 this.init();
 }

 init() {
 // Get game slug from URL parameter
 const urlParams = new URLSearchParams(window.location.search);
 const gameSlug = urlParams.get('game');
 
 if (gameSlug) {
 this.loadGame(gameSlug);
 } else {
 this.showError('No game specified');
 }

 this.setupEventListeners();
 }

 loadGame(slug) {
 // Find game by slug
 const game = gamesDatabase.find(g => g.slug === slug);
 
 if (!game) {
 this.showError('Game not found');
 return;
 }

 this.currentGame = game;
 this.displayGame(game);
 this.loadRelatedGames(game);
 this.setupVotingSystem(game);
 }

 displayGame(game) {
 // Update page title
 document.title = `${game.name} - InfinitePixels`;
 const pageTitle = document.getElementById('pageTitle');
 if (pageTitle) pageTitle.textContent = `${game.name} - InfinitePixels`;

 // Update game iframe
 const gameFrame = document.getElementById('gameFrame');
 if (gameFrame) {
 gameFrame.src = game.gameUrl;
 gameFrame.title = game.name;
 }

 // Update game title
 const gameTitle = document.getElementById('gameTitle');
 if (gameTitle) gameTitle.textContent = game.name;

 // Update description
 const gameDescription = document.getElementById('gameDescription');
 if (gameDescription) gameDescription.textContent = game.description;

 // Update tags
 const genresContainer = document.getElementById('gameGenres');
 if (genresContainer) {
 genresContainer.innerHTML = '';
 game.tags.forEach(tag => {
 const tagElement = document.createElement('span');
 tagElement.className = 'genre-tag';
 tagElement.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
 genresContainer.appendChild(tagElement);
 });
 }

 // Update share link
 const shareLink = document.getElementById('shareLink');
 if (shareLink) {
 shareLink.value = `${window.location.origin}/games/game.html?game=${game.slug}`;
 }
 }

 loadRelatedGames(currentGame) {
 const container = document.getElementById('relatedGamesContainer');
 if (!container) return;
 
 // Find games with similar tags
 const relatedGames = gamesDatabase
 .filter(game => 
 game.id !== currentGame.id && 
 game.tags.some(tag => currentGame.tags.includes(tag))
 )
 .slice(0, 6);

 // If not enough related games, add random games
 if (relatedGames.length < 6) {
 const additionalGames = gamesDatabase
 .filter(game => 
 game.id !== currentGame.id && 
 !relatedGames.includes(game)
 )
 .sort(() => 0.5 - Math.random())
 .slice(0, 6 - relatedGames.length);
 
 relatedGames.push(...additionalGames);
 }

 // Display related games
 container.innerHTML = '<h3>Related Games</h3>';
 
 relatedGames.forEach(game => {
 const gameElement = document.createElement('div');
 gameElement.className = 'related-game-item';
 gameElement.innerHTML = `
 <img src="../${game.image}" alt="${game.name}" loading="lazy">
 <div class="game-info">
 <h4>${game.name}</h4>
 <div class="game-tags">
 ${game.tags.slice(0, 2).map(tag => 
 `<span class="tag">${tag}</span>`
 ).join('')}
 </div>
 </div>
 `;
 gameElement.addEventListener('click', () => {
 window.location.href = `game.html?game=${game.slug}`;
 });
 container.appendChild(gameElement);
 });
 }

 setupVotingSystem(game) {
 const thumbsUpBtn = document.getElementById('thumbsUpBtn');
 const thumbsDownBtn = document.getElementById('thumbsDownBtn');
 const floatingThumbs = document.getElementById('floatingThumbs');
 const voteLock = document.getElementById('voteLock');

 if (!thumbsUpBtn || !thumbsDownBtn) return;

 // Use game-specific storage key
 const voteKey = `${game.slug}Voted`;
 let voted = sessionStorage.getItem(voteKey) === '1';

 const createFloatingThumbs = (type, originBtn) => {
 if (!floatingThumbs) return;
 floatingThumbs.innerHTML = '';
 const count = 7;
 
 for (let i = 0; i < count; i++) {
 const el = document.createElement('span');
 el.className = 'floating-thumb';
 el.innerHTML = type === 'up'
 ? '<i class="fas fa-thumbs-up"></i>'
 : '<i class="fas fa-thumbs-down"></i>';
 
 el.style.fontSize = '1em';
 el.style.opacity = '0.85';
 el.style.color = type === 'up' ? '#4CAF50' : '#e74c3c';
 el.style.position = 'absolute';
 el.style.pointerEvents = 'none';
 
 const angle = Math.random() * 2 * Math.PI;
 const distance = 40 + Math.random() * 30;
 const x = Math.cos(angle) * distance;
 const y = Math.sin(angle) * distance * (type === 'up' ? -1 : 1);
 const delay = Math.random() * 0.15;
 
 let startX = 0, startY = 0;
 if (type === 'down' && originBtn && floatingThumbs) {
 const parentRect = originBtn.parentElement.getBoundingClientRect();
 const btnRect = originBtn.getBoundingClientRect();
 startX = btnRect.left - parentRect.left + btnRect.width / 2 - 14;
 startY = btnRect.top - parentRect.top + btnRect.height / 2 - 14;
 } else if (floatingThumbs) {
 startX = floatingThumbs.offsetWidth / 2;
 startY = floatingThumbs.offsetHeight / 2;
 }
 
 el.style.left = type === 'down' ? `${startX}px` : '50%';
 el.style.top = type === 'down' ? `${startY}px` : '50%';
 el.style.transform = 'translate(-50%, -50%)';
 el.style.animation = type === 'up'
 ? `thumbsUpFloatSmall 1.1s ${delay}s cubic-bezier(.4,1.4,.7,1) forwards`
 : `thumbsDownFloatSmall 1.1s ${delay}s cubic-bezier(.4,1.4,.7,1) forwards`;
 el.style.setProperty('--x', `${x}px`);
 el.style.setProperty('--y', `${y}px`);
 
 floatingThumbs.appendChild(el);
 }
 
 setTimeout(() => {
 if (floatingThumbs) floatingThumbs.innerHTML = '';
 }, 1300);
 };

 const lockVoting = () => {
 thumbsUpBtn.disabled = true;
 thumbsDownBtn.disabled = true;
 if (voteLock) {
 voteLock.style.display = 'flex';
 voteLock.style.animation = 'voteLockPop 0.5s cubic-bezier(.4,1.4,.7,1)';
 }
 };

 // On load, show lock if already voted
 if (voted) {
 lockVoting();
 }

 [thumbsUpBtn, thumbsDownBtn].forEach(btn => {
 btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.92)');
 btn.addEventListener('mouseup', () => btn.style.transform = '');
 btn.addEventListener('mouseleave', () => btn.style.transform = '');
 });

 thumbsUpBtn.addEventListener('click', function() {
 if (voted) return;
 lockVoting();
 createFloatingThumbs('up', thumbsUpBtn);
 sessionStorage.setItem(voteKey, '1');
 voted = true;
 });

 thumbsDownBtn.addEventListener('click', function() {
 if (voted) return;
 lockVoting();
 createFloatingThumbs('down', thumbsDownBtn);
 sessionStorage.setItem(voteKey, '1');
 voted = true;
 });
 }

 setupEventListeners() {
 // Share functionality
 const shareBtn = document.getElementById('shareBtn');
 const shareModal = document.getElementById('shareModal');
 const closeModal = document.getElementById('closeModal');
 const copyBtn = document.getElementById('copyBtn');
 const shareMessage = document.getElementById('shareMessage');

 if (shareBtn && shareModal) {
 shareBtn.addEventListener('click', () => {
 shareModal.style.display = 'flex';
 });
 }

 if (closeModal && shareModal) {
 closeModal.addEventListener('click', () => {
 shareModal.style.display = 'none';
 });
 }

 if (copyBtn) {
 copyBtn.addEventListener('click', () => {
 const shareLink = document.getElementById('shareLink');
 if (shareLink) {
 shareLink.select();
 document.execCommand('copy');
 if (shareMessage) {
 shareMessage.style.display = 'block';
 setTimeout(() => {
 shareMessage.style.display = 'none';
 }, 2000);
 }
 }
 });
 }

 // Fullscreen functionality
 const fullscreenBtn = document.getElementById('fullscreenBtn');
 const gameContainer = document.getElementById('gameContainer');

 if (fullscreenBtn && gameContainer) {
 fullscreenBtn.addEventListener('click', () => {
 if (gameContainer.requestFullscreen) {
 gameContainer.requestFullscreen();
 } else if (gameContainer.webkitRequestFullscreen) {
 gameContainer.webkitRequestFullscreen();
 } else if (gameContainer.msRequestFullscreen) {
 gameContainer.msRequestFullscreen();
 }
 });
 }

 // Close modal when clicking outside
 window.addEventListener('click', (e) => {
 const shareModal = document.getElementById('shareModal');
 if (shareModal && e.target === shareModal) {
 shareModal.style.display = 'none';
 }
 });
 }

 showError(message) {
 const gameTitle = document.getElementById('gameTitle');
 const gameDescription = document.getElementById('gameDescription');
 const gameFrame = document.getElementById('gameFrame');
 
 if (gameTitle) gameTitle.textContent = 'Error';
 if (gameDescription) gameDescription.textContent = message;
 if (gameFrame) gameFrame.style.display = 'none';
 }
}

// All Games Management System - Fixed to match CSS classes
class AllGamesManager {
 constructor() {
 // Use enhanced games database with fallback to old format
 this.gamesList = window.gamesDatabase || window.allGamesDatabase || [];
 this.filteredGamesList = [...this.gamesList];
 this.currentPageNumber = 1;
 this.itemsPerPage = 9;
 this.selectedFilterTags = new Set();
 this.currentSearchTerm = '';
 
 console.log('AllGamesManager initialized with', this.gamesList.length, 'games');
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
 // Search functionality - matches CSS classes
 const searchInputField = document.querySelector('.search-text-input');
 const clearSearchButton = document.querySelector('.search-clear-btn');
 
 if (searchInputField) {
 searchInputField.addEventListener('input', (e) => {
 this.currentSearchTerm = e.target.value.toLowerCase();
 this.applyFiltersAndSearch();
 this.toggleSearchClearVisibility();
 });
 }
 
 if (clearSearchButton) {
 clearSearchButton.addEventListener('click', () => {
 if (searchInputField) {
 searchInputField.value = '';
 this.currentSearchTerm = '';
 this.applyFiltersAndSearch();
 this.toggleSearchClearVisibility();
 searchInputField.focus();
 }
 });
 }
 
 // Filter functionality - matches CSS classes
 const tagFilterButton = document.querySelector('.tag-filter-button');
 const filterOptionsPanel = document.querySelector('.filter-options-panel');
 const resetFiltersButton = document.querySelector('.reset-filters-btn');
 
 if (tagFilterButton && filterOptionsPanel) {
 tagFilterButton.addEventListener('click', (e) => {
 e.stopPropagation();
 filterOptionsPanel.classList.toggle('active');
 tagFilterButton.classList.toggle('active');
 });
 }
 
 document.addEventListener('click', (e) => {
 if (filterOptionsPanel && tagFilterButton) {
 if (!filterOptionsPanel.contains(e.target) && !tagFilterButton.contains(e.target)) {
 filterOptionsPanel.classList.remove('active');
 tagFilterButton.classList.remove('active');
 }
 }
 });
 
 if (resetFiltersButton) {
 resetFiltersButton.addEventListener('click', () => {
 this.selectedFilterTags.clear();
 this.refreshFilterTagsDisplay();
 this.applyFiltersAndSearch();
 });
 }
 }

 toggleSearchClearVisibility() {
 const clearSearchButton = document.querySelector('.search-clear-btn');
 const searchInputField = document.querySelector('.search-text-input');
 
 if (clearSearchButton && searchInputField) {
 if (searchInputField.value.length > 0) {
 clearSearchButton.classList.add('visible');
 } else {
 clearSearchButton.classList.remove('visible');
 }
 }
 }
 
 createFilterTagsDisplay() {
 const uniqueTagsSet = new Set();
 this.gamesList.forEach(gameItem => {
 if (gameItem.tags) {
 gameItem.tags.forEach(tagName => uniqueTagsSet.add(tagName));
 }
 });
 
 const filterTagsContainer = document.querySelector('.available-filter-tags');
 if (!filterTagsContainer) return;
 
 filterTagsContainer.innerHTML = '';
 
 Array.from(uniqueTagsSet).sort().forEach(tagName => {
 const tagElement = document.createElement('div');
 tagElement.className = 'selectable-tag';
 tagElement.innerHTML = `
 <span class="tag-name">${tagName.charAt(0).toUpperCase() + tagName.slice(1)}</span>
 <span class="tag-count">(${this.getTagCount(tagName)})</span>
 `;
 tagElement.addEventListener('click', () => this.handleFilterTagToggle(tagName, tagElement));
 filterTagsContainer.appendChild(tagElement);
 });
 }
 
 getTagCount(tag) {
 return this.gamesList.filter(game => 
 game.tags && game.tags.some(t => t.toLowerCase() === tag.toLowerCase())
 ).length;
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
 const filterTagOptions = document.querySelectorAll('.selectable-tag');
 filterTagOptions.forEach(tagElement => {
 const tagText = tagElement.querySelector('.tag-name').textContent.toLowerCase();
 if (this.selectedFilterTags.has(tagText)) {
 tagElement.classList.add('active');
 } else {
 tagElement.classList.remove('active');
 }
 });
 }
 
 applyFiltersAndSearch() {
 this.filteredGamesList = this.gamesList.filter(gameItem => {
 // Search filter logic - enhanced to include descriptions
 const matchesSearchQuery = this.currentSearchTerm === '' || 
 gameItem.name.toLowerCase().includes(this.currentSearchTerm) ||
 (gameItem.tags && gameItem.tags.some(tagName => tagName.toLowerCase().includes(this.currentSearchTerm))) ||
 (gameItem.description && gameItem.description.toLowerCase().includes(this.currentSearchTerm));
 
 // Tag filter logic
 const matchesTagFilters = this.selectedFilterTags.size === 0 ||
 (gameItem.tags && Array.from(this.selectedFilterTags).some(selectedTag => 
 gameItem.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
 ));
 
 return matchesSearchQuery && matchesTagFilters;
 });
 
 this.currentPageNumber = 1;
 this.renderGameCards();
 this.renderPaginationControls();
 this.updateGameCountDisplay();
 }

 renderGameCards() {
 const gameCardsContainer = document.querySelector('.game-cards-grid');
 if (!gameCardsContainer) {
 console.error('Game cards container not found');
 return;
 }
 
 const startIndex = (this.currentPageNumber - 1) * this.itemsPerPage;
 const endIndex = startIndex + this.itemsPerPage;
 const currentPageGames = this.filteredGamesList.slice(startIndex, endIndex);
 
 console.log('Rendering games:', currentPageGames.length);
 
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
 
 gameCardsContainer.innerHTML = currentPageGames.map(gameItem => {
 // Create the game link - use new dynamic format if slug exists, fallback to old format
 const gameLink = gameItem.slug 
 ? `games/game.html?game=${gameItem.slug}`
 : gameItem.url || `games/${gameItem.name.toLowerCase().replace(/\s+/g, '')}.html`;
 
 return `
 <div class="individual-game-card" data-game="${gameItem.slug || gameItem.name.toLowerCase().replace(/\s+/g, '-')}">
 <div class="game-preview-image">
 <img src="${gameItem.image}" alt="${gameItem.name}" loading="lazy" onerror="this.src='images/placeholder-game.jpg'" />
 <div class="game-hover-overlay">
 <button class="game-play-button">
 <i class="fas fa-play"></i>
 <span>Play Now</span>
 </button>
 </div>
 </div>
 <div class="game-details-section">
 <h3>${gameItem.name}</h3>
 <div class="game-category-tags">
 ${gameItem.tags ? gameItem.tags.slice(0, 3).map(tagName => 
 `<span class="category-tag-item">${tagName.charAt(0).toUpperCase() + tagName.slice(1)}</span>`
 ).join('') : ''}
 </div>
 ${gameItem.description ? `
 <p class="game-description">${gameItem.description.substring(0, 100)}${gameItem.description.length > 100 ? '...' : ''}</p>
 ` : ''}
 </div>
 </div>
 `;
 }).join('');
 
 // Add click handlers for individual game cards
 document.querySelectorAll('.individual-game-card').forEach(cardElement => {
 cardElement.addEventListener('click', (e) => {
 const gameData = currentPageGames.find(game => 
 (game.slug || game.name.toLowerCase().replace(/\s+/g, '-')) === cardElement.dataset.game
 );
 if (gameData) {
 const gameLink = gameData.slug 
 ? `games/game.html?game=${gameData.slug}`
 : gameData.url || `games/${gameData.name.toLowerCase().replace(/\s+/g, '')}.html`;
 window.location.href = gameLink;
 }
 });
 });
 }

 renderPaginationControls() {
 const totalPagesCount = Math.ceil(this.filteredGamesList.length / this.itemsPerPage);
 const paginationContainer = document.querySelector('.page-navigation-controls');
 
 if (!paginationContainer || totalPagesCount <= 1) {
 if (paginationContainer) paginationContainer.innerHTML = '';
 return;
 }
 
 let paginationHTML = '';
 
 // Previous navigation button
 paginationHTML += `
 <button class="nav-page-button ${this.currentPageNumber === 1 ? 'disabled' : ''}" 
 data-page="${this.currentPageNumber - 1}" ${this.currentPageNumber === 1 ? 'disabled' : ''}>
 <i class="fas fa-chevron-left"></i>
 Previous
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
 paginationHTML += `<button class="nav-page-button" data-page="1">1</button>`;
 if (startPageNumber > 2) {
 paginationHTML += `<span class="pagination-dots">...</span>`;
 }
 }
 
 for (let pageNum = startPageNumber; pageNum <= endPageNumber; pageNum++) {
 paginationHTML += `
 <button class="nav-page-button ${pageNum === this.currentPageNumber ? 'current-page' : ''}" 
 data-page="${pageNum}">${pageNum}</button>
 `;
 }
 
 if (endPageNumber < totalPagesCount) {
 if (endPageNumber < totalPagesCount - 1) {
 paginationHTML += `<span class="pagination-dots">...</span>`;
 }
 paginationHTML += `<button class="nav-page-button" data-page="${totalPagesCount}">${totalPagesCount}</button>`;
 }
 
 // Next navigation button
 paginationHTML += `
 <button class="nav-page-button ${this.currentPageNumber === totalPagesCount ? 'disabled' : ''}" 
 data-page="${this.currentPageNumber + 1}" ${this.currentPageNumber === totalPagesCount ? 'disabled' : ''}>
 Next
 <i class="fas fa-chevron-right"></i>
 </button>
 `;
 
 paginationContainer.innerHTML = paginationHTML;
 
 // Add event listeners to pagination buttons
 paginationContainer.addEventListener('click', (e) => {
 if (e.target.matches('[data-page]') || e.target.closest('[data-page]')) {
 const button = e.target.matches('[data-page]') ? e.target : e.target.closest('[data-page]');
 if (!button.disabled && !button.classList.contains('disabled')) {
 const page = parseInt(button.dataset.page);
 this.navigateToPage(page);
 }
 }
 });
 }
 
 navigateToPage(pageNumber) {
 const totalPagesCount = Math.ceil(this.filteredGamesList.length / this.itemsPerPage);
 if (pageNumber >= 1 && pageNumber <= totalPagesCount) {
 this.currentPageNumber = pageNumber;
 this.renderGameCards();
 this.renderPaginationControls();
 this.updateGameCountDisplay();
 
 // Smooth scroll to top of games grid
 const gamesGrid = document.querySelector('.game-cards-grid');
 if (gamesGrid) {
 gamesGrid.scrollIntoView({ 
 behavior: 'smooth', 
 block: 'start' 
 });
 }
 }
 }
 
 updateGameCountDisplay() {
 const gameCountElement = document.querySelector('.results-counter');
 if (gameCountElement) {
 gameCountElement.textContent = `Showing ${this.filteredGamesList.length} games`;
 }
 }
}

// Global variable for external access
let allGamesController;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
 // Only initialize if we're on the games page (check for specific elements)
 if (document.querySelector('.game-cards-grid')) {
 allGamesController = new AllGamesManager();
 console.log('Games page initialized');
 }
 
 // Initialize GameLoader if we're on an individual game page
 if (document.getElementById('gameFrame')) {
 new GameLoader();
 console.log('Game page initialized');
 }
});

// Utility functions to add games from external scripts
function addNewGameToCollection(name, image, url, tags) {
 if (allGamesController) {
 allGamesController.gamesList.push({ name, image, url, tags });
 allGamesController.applyFiltersAndSearch();
 }
}

function addMultipleGamesToCollection(gamesArray) {
 if (allGamesController) {
 allGamesController.gamesList.push(...gamesArray);
 allGamesController.applyFiltersAndSearch();
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
        const categories = ['updates', 'news', 'huge updates', 'games', 'news'];
        const tags = ['update', 'news', 'huge updates', 'games', 'news', 'beta'];
        
        const sampleArticles = [
            {
                id: 1,
                title: "Website Now live!",
                summary: "InfinitePixels is now live for anyone to play at any time.",
                category: "updates",
                tags: ["update", "news"],
                date: new Date('2025-08-01'),
                author: "Dev Team",
                featured: true,
                importance: 10,
                likes: 1234,
                image: null
            },
            {
                id: 2,
                title: "Completed Random Games Page",
                summary: "JWe are pleased to announce that we have completed the random games page.",
                content: "That is right, there is now a random games page to keep you on your toes. If you are ever bored and in need of a new game that you might not have ever played before look no further than the random games page. All you have to do is click onto the page and then voila, you will be taken to a random game. We have an expansive game catalog and you never know what hidden gems you might be missing out on. This new feature makes it so that there is never a dull moment on InfinitePixels. - InfinitePixels Dev Team",
                category: "update",
                tags: ["update", "huge updates"],
                date: new Date('2025-07-30'),
                author: "Dev Team",
                featured: false,
                importance: 7,
                likes: 543,
                image: null
            },
            {
                id: 3,
                title: "New Games",
                summary: "We have just added a huge collection of new games to play.",
                content: "You might notice that the game catalog is looking extra full and you would be right. We have just added a huge amount of games including some popular ones you have definitely played before such as Basket Random or 1v1.LOL and some underground games that we think you’ll enjoy playing. If you have any more game suggestions reach out to contact.infintepixels.com and let us know. InfinitePixels Dev Team",
                category: "games",
                tags: ["games", "new"],
                date: new Date('2025-07-28'),
                author: "Community Team",
                featured: false,
                importance: 4,
                likes: 734,
                image: null
            },
            {
                id: 4,
                title: "Bug Fixes",
                summary: "We have fixed some bugs plaguing our website.",
                content: "It has come to our attention that there were some bugs on different games like paper.io. We believe to have fixed all of the bugs on the website as of now but were not perfect so if you notice any more persistent bug or any that appear no need to fear as you can always email us at contact.infinitepixels@gmail.com. - InfinitePixels Dev Team",
                category: "updates",
                tags: ["news, updates"],
                date: new Date('2025-07-25'),
                author: "Dev Team",
                featured: false,
                importance: 5,
                likes: 234,
                image: null
            },
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
                    return a.importance - b.importance;
                case 'importance':
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
        image: 'images/msfimage.jpg',
        description: 'Intense shooting and combat games'
    },
    'action': {
        name: 'Action',
        image: 'images/1v1lolimage.jpg',
        description: 'Fast-paced action adventures'
    },
    'racing': {
        name: 'Racing',
        image: 'images/3dformularacingimage.jpg',
        description: 'High-speed racing thrills'
    },
    'puzzle': {
        name: 'Puzzle',
        image: 'images/drawclimberimage.jpg',
        description: 'Brain-bending puzzle challenges'
    },
    'platformer': {
        name: 'Platformer',
        image: 'images/subwaysurfersimage.jpg',
        description: 'Jumping and platform adventures'
    },
    'multiplayer': {
        name: 'Multiplayer',
        image: 'images/bloxdioimage.jpg',
        description: 'Play with friends online'
    },
    'io': {
        name: 'Io',
        image: 'images/paperioimage.jpg',
        description: 'Competitive IO games'
    },
    'idle': {
        name: 'Idle',
        image: 'images/tinyfishingimage.jpg',
        description: 'Relaxing idle experiences'
    },
    'sports': {
        name: 'Sports',
        image: 'images/happywheelsimage.jpg',
        description: 'Sports and athletic games'
    },
    '3d': {
        name: '3D',
        image: 'images/blockstack3dimage.jpg',
        description: 'Immersive 3D experiences'
    },
    'arcade': {
        name: 'Arcade',
        image: 'images/helixjumpimage.jpg',
        description: 'Classic arcade fun'
    },
    'adventure': {
        name: 'Adventure',
        image: 'images/ninjaarashiimage.jpg',
        description: 'Epic adventure journeys'
    },
    'clicker': {
        name: 'Clicker',
        image: 'images/cookieclickerimage.jpg',
        description: 'Addictive clicking games'
    },
    'cars': {
        name: 'Cars',
        image: 'images/madalinstuntcarsproimage.jpg',
        description: 'Car-based adventures'
    },
    '2 player': {
        name: '2 Player',
        image: 'images/stickfighter3dimage.jpg',
        description: 'Two-player competitions'
    },
    'basketball': {
        name: 'Basketball',
        image: 'images/basketrandomimage.jpg',
        description: 'Basketball games and challenges'
    },
    '2048': {
        name: '2048',
        image: 'images/ball2048image.jpg',
        description: '2048-style puzzle games'
    },
    'drawing': {
        name: 'Drawing',
        image: 'images/drawthecarpathimage.jpg',
        description: 'Creative drawing games'
    },
    'runner': {
        name: 'Runner',
        image: 'images/tallmanrunimage.jpg',
        description: 'Endless running adventures'
    },
    'fruit': {
        name: 'Fruit',
        image: 'images/fruitmergeimage.jpg',
        description: 'Fresh fruit games'
    },
    'online': {
        name: 'Online',
        image: 'images/maskedspecialforcesimage.jpg',
        description: 'Connected online experiences'
    },
    'strategy': {
        name: 'Strategy',
        image: 'images/paperioimage.jpg',
        description: 'Strategic thinking games'
    },
    'parkour': {
        name: 'Parkour',
        image: 'images/parkourblock3dimage.jpg',
        description: 'Parkour and free-running'
    },
    'animal': {
        name: 'Animal',
        image: 'images/rodeostampedeimage.jpg',
        description: 'Animal-themed adventures'
    },
    'satisfying': {
        name: 'Satisfying',
        image: 'images/spiralrollimage.jpg',
        description: 'Satisfying gameplay experiences'
    },
    'endless': {
        name: 'Endless',
        image: 'images/subwaysurfersimage.jpg',
        description: 'Never-ending gameplay'
    },
    'fishing': {
        name: 'Fishing',
        image: 'images/icefishingimage.jpg',
        description: 'Fishing and aquatic games'
    },
    'bike': {
        name: 'Bike',
        image: 'images/rocketbikeshighwayraceimage.jpg',
        description: 'Motorcycle and bike games'
    },
    'levels': {
        name: 'Levels',
        image: 'images/bulletarmyrunimage.jpg',
        description: 'Level-based progression games'
    },
    'cooking': {
        name: 'Cooking',
        image: 'images/papasburgeriaimage.jpg',
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
    const categoryImage = categoryData.image || cosmicCategoriesFallbackImages.default;
    
    return `
        <div class="cosmic-categories-constellation-card" 
             onclick="cosmicCategoriesToggleDimension('${category}')"
             style="--category-bg-image: url('${categoryImage}')">
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
    iconImg.src = categoryData.image || cosmicCategoriesFallbackImages.default;
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

// About Page Interactions JavaScript - OPTIMIZED VERSION

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize about page functionality if we're on the about page
    if (document.querySelector('.about-hero-banner') || document.querySelector('.about-page-container')) {
        console.log('About page detected - initializing...');
        
        // Ensure animations are added first
        ensureAboutAnimations();
        
        // Initialize all functions
        initAboutScrollAnimations();
        initAboutFloatingElements();
        initAboutInfinityAnimation();
        initAboutStaggeredAnimations();
        initAboutHoverEffects();
        initAboutThemeObserver();
        
        // Update theme colors after a brief delay
        setTimeout(() => {
            updateAboutFloatingElementsForTheme();
        }, 50);
    }
});

// Add CSS animations first - moved to top priority
function ensureAboutAnimations() {
    // Check if animations already exist
    if (document.querySelector('#aboutPageAnimations')) return;
    
    const aboutAnimationStyles = document.createElement('style');
    aboutAnimationStyles.id = 'aboutPageAnimations';
    aboutAnimationStyles.textContent = `
        @keyframes aboutPixelFloat {
            0%, 100% { 
                transform: translateY(0px) rotate(0deg);
                opacity: 0.6;
            }
            33% { 
                transform: translateY(-20px) rotate(120deg);
                opacity: 1;
            }
            66% { 
                transform: translateY(10px) rotate(240deg);
                opacity: 0.8;
            }
        }
        
        .about-animate {
            animation: aboutSlideInUp 0.8s ease-out forwards;
        }
        
        @keyframes aboutSlideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .about-content-card {
            transition: all 0.3s ease-out;
        }
        
        .about-metric-box {
            transition: all 0.3s ease-out;
        }
        
        .about-floating-pixel {
            will-change: transform;
        }
        
        /* Ensure hero banner is visible */
        .about-hero-banner {
            position: relative;
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
        }
        
        .about-hero-content {
            position: relative;
            z-index: 10;
            text-align: center;
        }
    `;
    
    document.head.appendChild(aboutAnimationStyles);
}

// Scroll-triggered animations for about page
function initAboutScrollAnimations() {
    const aboutContentCards = document.querySelectorAll('.about-content-card');
    const aboutMetricBoxes = document.querySelectorAll('.about-metric-box');
    
    // Only proceed if elements exist
    if (aboutContentCards.length === 0 && aboutMetricBoxes.length === 0) {
        console.log('No about page elements found for scroll animations');
        return;
    }
    
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('about-animate');
                
                // Trigger counter animation for metric boxes
                if (entry.target.classList.contains('about-metric-box')) {
                    const metricValue = entry.target.querySelector('.about-metric-value');
                    if (metricValue && !metricValue.classList.contains('about-counted')) {
                        animateAboutCounter(metricValue);
                        metricValue.classList.add('about-counted');
                    }
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all content cards and metric boxes
    [...aboutContentCards, ...aboutMetricBoxes].forEach(item => {
        aboutObserver.observe(item);
    });
}

// Counter animation for about page statistics
function animateAboutCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    if (isNaN(target)) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const aboutTimer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(aboutTimer);
        }
        
        const displayValue = Math.floor(current);
        element.textContent = formatAboutNumber(displayValue);
    }, duration / steps);
}

// Format numbers with commas for readability
function formatAboutNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Create floating elements animation for about page - FIXED
function initAboutFloatingElements() {
    // Try both the container and the specific floating elements div
    let container = document.querySelector('.about-floating-elements') || document.querySelector('.about-hero-banner');
    
    if (!container) {
        console.log('About hero banner not found - skipping floating elements');
        return;
    }
    
    const aboutPixelColors = ['#ba68c8', '#42a5f5', '#8e24aa', '#1976d2', '#6a1b9a'];
    
    // Create floating elements
    for (let i = 0; i < 12; i++) {
        createAboutFloatingElement(container, aboutPixelColors[i % aboutPixelColors.length], i);
    }
}

function createAboutFloatingElement(container, color, index) {
    if (!container) return;
    
    const aboutPixel = document.createElement('div');
    aboutPixel.className = 'about-floating-pixel';
    aboutPixel.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 6}px;
        height: ${Math.random() * 10 + 6}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        animation: aboutPixelFloat ${6 + Math.random() * 4}s infinite ease-in-out;
        animation-delay: ${index * 0.6}s;
        top: ${Math.random() * 80 + 10}%;
        left: ${Math.random() * 80 + 10}%;
        opacity: ${0.6 + Math.random() * 0.4};
        box-shadow: 0 0 15px ${color};
    `;
    
    container.appendChild(aboutPixel);
}

// Initialize infinity symbol animation
function initAboutInfinityAnimation() {
    const infinitySymbol = document.querySelector('.about-infinity-symbol');
    if (!infinitySymbol) {
        console.log('Infinity symbol not found');
        return;
    }
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.1;
                infinitySymbol.style.transform = `rotate(${rate}deg)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Add staggered animation entrance for content cards
function initAboutStaggeredAnimations() {
    const aboutCards = document.querySelectorAll('.about-content-card');
    
    if (aboutCards.length === 0) {
        console.log('No about content cards found for staggered animations');
        return;
    }
    
    aboutCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// Add interactive hover effects to content cards
function initAboutHoverEffects() {
    // Content cards hover effects
    document.querySelectorAll('.about-content-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
            this.style.transition = 'all 0.3s ease-out';
            this.style.boxShadow = '0 25px 60px rgba(138, 43, 226, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Metric boxes hover effects
    document.querySelectorAll('.about-metric-box').forEach(metricBox => {
        metricBox.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 20px 60px rgba(138, 43, 226, 0.5)';
            this.style.transform = 'scale(1.08)';
            this.style.transition = 'all 0.3s ease-out';
            this.style.borderColor = '#8a2be2';
        });
        
        metricBox.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            this.style.transform = 'scale(1)';
            this.style.borderColor = 'rgba(138, 43, 226, 0.3)';
        });
    });
}

// Parallax scrolling effect for about hero section
let aboutScrollTicking = false;
window.addEventListener('scroll', function() {
    if (!aboutScrollTicking) {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const aboutHeroContent = document.querySelector('.about-hero-content');
            const aboutFloatingElements = document.querySelectorAll('.about-floating-pixel');
            const aboutInfinityBackdrop = document.querySelector('.about-infinity-backdrop');
            
            // Parallax effect for hero content
            if (aboutHeroContent) {
                aboutHeroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            // Parallax effect for infinity backdrop
            if (aboutInfinityBackdrop) {
                aboutInfinityBackdrop.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.2}px)`;
            }
            
            // Parallax effect for floating elements
            aboutFloatingElements.forEach((element, index) => {
                const speed = 0.1 + (index * 0.03);
                const currentTransform = element.style.transform || '';
                const cleanTransform = currentTransform.replace(/translateY\([^)]*\)/g, '');
                element.style.transform = `${cleanTransform} translateY(${scrolled * speed}px)`;
            });
            
            revealAboutOnScroll();
            aboutScrollTicking = false;
        });
        aboutScrollTicking = true;
    }
});

// Smooth reveal animation for content cards on scroll
function revealAboutOnScroll() {
    const aboutContentCards = document.querySelectorAll('.about-content-card:not(.about-animate)');
    
    aboutContentCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = 150;
        
        if (cardTop < window.innerHeight - cardVisible) {
            card.classList.add('about-animate');
        }
    });
}

// Enhanced mouse movement for floating elements
let mouseMoveThrottled = false;
document.addEventListener('mousemove', function(e) {
    if (!mouseMoveThrottled) {
        requestAnimationFrame(() => {
            const aboutFloatingElements = document.querySelectorAll('.about-floating-pixel');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            aboutFloatingElements.forEach((element, index) => {
                const speed = (index + 1) * 0.02;
                const x = (mouseX - 0.5) * speed * 50;
                const y = (mouseY - 0.5) * speed * 50;
                
                const existingTransform = element.style.transform || '';
                const baseTransform = existingTransform.replace(/translate\([^)]*\)/g, '');
                element.style.transform = `${baseTransform} translate(${x}px, ${y}px)`;
            });
            mouseMoveThrottled = false;
        });
        mouseMoveThrottled = true;
    }
});

// Theme-aware color updates for floating elements
function updateAboutFloatingElementsForTheme() {
    const isLightTheme = document.body.classList.contains('light-theme');
    const aboutFloatingElements = document.querySelectorAll('.about-floating-pixel');
    
    if (aboutFloatingElements.length === 0) {
        console.log('No floating elements found for theme update');
        return;
    }
    
    const lightColors = ['#6a1b9a', '#1565c0', '#8e24aa', '#1976d2', '#4a148c'];
    const darkColors = ['#ba68c8', '#42a5f5', '#8e24aa', '#1976d2', '#6a1b9a'];
    
    const colors = isLightTheme ? lightColors : darkColors;
    
    aboutFloatingElements.forEach((element, index) => {
        const color = colors[index % colors.length];
        element.style.background = color;
        element.style.boxShadow = `0 0 15px ${color}`;
    });
}

// Theme observer with better error handling
function initAboutThemeObserver() {
    try {
        const themeObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    updateAboutFloatingElementsForTheme();
                }
            });
        });

        themeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    } catch (error) {
        console.warn('Could not initialize theme observer:', error);
    }
}

// Debug function
function debugAboutPageElements() {
    console.log('=== About Page Debug Info ===');
    console.log('Hero banner:', document.querySelector('.about-hero-banner') ? 'Found' : 'Not found');
    console.log('Hero content:', document.querySelector('.about-hero-content') ? 'Found' : 'Not found');
    console.log('Floating elements container:', document.querySelector('.about-floating-elements') ? 'Found' : 'Not found');
    console.log('Content cards:', document.querySelectorAll('.about-content-card').length);
    console.log('Metric boxes:', document.querySelectorAll('.about-metric-box').length);
    console.log('Infinity symbol:', document.querySelector('.about-infinity-symbol') ? 'Found' : 'Not found');
    console.log('Page container:', document.querySelector('.about-page-container') ? 'Found' : 'Not found');
    console.log('Body classes:', document.body.className);
    console.log('===============================');
}

// Run debug after a short delay
setTimeout(debugAboutPageElements, 100);

// Cleanup function
function cleanupAboutPage() {
    console.log('About page cleanup performed');
}

// Export utilities
if (typeof window !== 'undefined') {
    window.aboutPageUtils = {
        debug: debugAboutPageElements,
        cleanup: cleanupAboutPage,
        updateTheme: updateAboutFloatingElementsForTheme
    };
}

/**
 * Related Games System
 * Dynamically displays games with similar tags to the current game
 */

/**
 * Finds games with similar tags to the current game
 * @param {string} currentGameName - Name of the current game
 * @param {number} maxResults - Maximum number of related games to return
 * @returns {Array} Array of related games
 */
function findRelatedGames(currentGameName, maxResults = 5) {
    // Find the current game
    const currentGame = allGamesDatabase.find(game => 
        game.name.toLowerCase() === currentGameName.toLowerCase()
    );
    
    if (!currentGame) {
        console.warn(`Game "${currentGameName}" not found in database`);
        return [];
    }
    
    const currentTags = currentGame.tags;
    
    // Calculate similarity scores for all other games
    const gamesWithScores = allGamesDatabase
        .filter(game => game.id !== currentGame.id) // Exclude current game
        .map(game => {
            const commonTags = game.tags.filter(tag => currentTags.includes(tag));
            const score = commonTags.length;
            return {
                ...game,
                similarityScore: score,
                commonTags: commonTags
            };
        })
        .filter(game => game.similarityScore > 0) // Only games with at least one matching tag
        .sort((a, b) => {
            // Sort by similarity score first, then by name for consistency
            if (b.similarityScore !== a.similarityScore) {
                return b.similarityScore - a.similarityScore;
            }
            return a.name.localeCompare(b.name);
        })
        .slice(0, maxResults);
    
    return gamesWithScores;
}

/**
 * Converts relative image paths to absolute URLs
 * @param {string} imagePath - Relative image path from the database
 * @returns {string} Absolute image URL
 */
function getAbsoluteImageUrl(imagePath) {
    // If already absolute, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
        return imagePath;
    }
    
    // If starts with /, it's absolute from root
    if (imagePath.startsWith('/')) {
        return imagePath;
    }
    
    // Convert relative path to absolute URL
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port ? ':' + window.location.port : '';
    return `${protocol}//${hostname}${port}/${imagePath}`;
}

/**
 * Renders the related games section
 * @param {string} currentGameName - Name of the current game
 */
function showRelatedGames(currentGameName) {
    const container = document.getElementById('relatedGamesContainer');
    if (!container) {
        console.error('Related games container not found');
        return;
    }
    
    const relatedGames = findRelatedGames(currentGameName, 6);
    
    if (relatedGames.length === 0) {
        container.innerHTML = `
            <h3>Related Games</h3>
            <div class="no-games">No similar games found</div>
        `;
        return;
    }
    
    const gamesHTML = relatedGames.map(game => {
        const absoluteImageUrl = getAbsoluteImageUrl(game.image);
        return `
            <div class="game-item" data-game="${game.name.toLowerCase().replace(/\s+/g, '-')}" onclick="navigateToGame('${game.url}')">
                <div class="game-thumbnail" style="background-image: url('${absoluteImageUrl}')"></div>
                <div class="game-details">
                    <h4>${game.name}</h4>
                    <p>Match: ${game.similarityScore} tag${game.similarityScore > 1 ? 's' : ''}</p>
                    <div class="game-tags">
                        ${game.commonTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <h3>Related Games</h3>
        <div class="related-games-grid">
            ${gamesHTML}
        </div>
    `;
}

/**
 * Navigates to a game page
 * @param {string} gameUrl - URL of the game
 */
function navigateToGame(gameUrl) {
    let finalUrl = gameUrl;
    
    // Check if URL is already absolute
    if (gameUrl.startsWith('http') || gameUrl.startsWith('//')) {
        finalUrl = gameUrl;
    } else if (gameUrl.startsWith('/')) {
        // Already absolute from root, keep as is
        finalUrl = gameUrl;
    } else if (gameUrl.startsWith('games/')) {
        // Convert to absolute URL with full domain
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port ? ':' + window.location.port : '';
        finalUrl = `${protocol}//${hostname}${port}/${gameUrl}`;
    } else {
        // For any other relative URL, make it absolute
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port ? ':' + window.location.port : '';
        finalUrl = `${protocol}//${hostname}${port}/${gameUrl}`;
    }
    
    // Navigate to the game page
    window.location.href = finalUrl;
}

/**
 * Gets the current game name from various sources
 * You can customize this function based on how you store the current game info
 * @returns {string|null} Current game name or null if not found
 */
function getCurrentGameName() {
    // Method 1: From data attribute on body
    const bodyGameName = document.body.dataset.currentGame;
    if (bodyGameName) return bodyGameName;
    
    // Method 2: From page title (assuming format like "Game Name - Your Site")
    const titleMatch = document.title.match(/^([^-]+)/);
    if (titleMatch) {
        const titleGameName = titleMatch[1].trim();
        // Check if this matches any game in our database
        const foundGame = allGamesDatabase.find(game => 
            game.name.toLowerCase() === titleGameName.toLowerCase()
        );
        if (foundGame) return foundGame.name;
    }
    
    // Method 3: From URL path (assuming format like /games/gamename.html)
    const urlPath = window.location.pathname;
    const urlMatch = urlPath.match(/\/games\/([^\/]+)\.html$/);
    if (urlMatch) {
        const urlGameName = urlMatch[1];
        // Try to find matching game by URL
        const foundGame = allGamesDatabase.find(game => 
            game.url.includes(urlGameName)
        );
        if (foundGame) return foundGame.name;
    }
    
    // Method 4: From meta tag
    const metaGame = document.querySelector('meta[name="game-name"]');
    if (metaGame) return metaGame.content;
    
    return null;
}

/**
 * Initialize related games for the current page
 * Call this function when the page loads
 */
function initializeRelatedGames() {
    const currentGameName = getCurrentGameName();
    
    if (currentGameName) {
        showRelatedGames(currentGameName);
    } else {
        // Fallback: show a random selection of games
        showRandomGames();
    }
}

/**
 * Shows a random selection of games when current game can't be determined
 * @param {number} count - Number of random games to show
 */
function showRandomGames(count = 6) {
    const container = document.getElementById('relatedGamesContainer');
    if (!container) return;
    
    // Get random games
    const shuffled = [...allGamesDatabase].sort(() => Math.random() - 0.5);
    const randomGames = shuffled.slice(0, count);
    
    const gamesHTML = randomGames.map(game => {
        const absoluteImageUrl = getAbsoluteImageUrl(game.image);
        return `
            <div class="game-item" data-game="${game.name.toLowerCase().replace(/\s+/g, '-')}" onclick="navigateToGame('${game.url}')">
                <div class="game-thumbnail" style="background-image: url('${absoluteImageUrl}')"></div>
                <div class="game-details">
                    <h4>${game.name}</h4>
                    <p>Try this game!</p>
                    <div class="game-tags">
                        ${game.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <h3>More Games</h3>
        <div class="related-games-grid">
            ${gamesHTML}
        </div>
    `;
}

/**
 * Advanced function to find related games by multiple criteria
 * @param {string} currentGameName - Name of the current game
 * @param {Object} options - Configuration options
 * @returns {Array} Array of related games
 */
function findAdvancedRelatedGames(currentGameName, options = {}) {
    const {
        maxResults = 6,
        minSimilarityScore = 1,
        prioritizeExactMatches = true,
        includePartialMatches = true
    } = options;
    
    const currentGame = allGamesDatabase.find(game => 
        game.name.toLowerCase() === currentGameName.toLowerCase()
    );
    
    if (!currentGame) return [];
    
    const currentTags = currentGame.tags;
    
    let candidates = allGamesDatabase
        .filter(game => game.id !== currentGame.id)
        .map(game => {
            const exactMatches = game.tags.filter(tag => currentTags.includes(tag));
            const score = exactMatches.length;
            
            return {
                ...game,
                similarityScore: score,
                commonTags: exactMatches,
                isExactMatch: score === currentTags.length && score === game.tags.length
            };
        })
        .filter(game => game.similarityScore >= minSimilarityScore);
    
    // Sort by priority: exact matches first, then by similarity score
    candidates.sort((a, b) => {
        if (prioritizeExactMatches && a.isExactMatch !== b.isExactMatch) {
            return b.isExactMatch - a.isExactMatch;
        }
        if (a.similarityScore !== b.similarityScore) {
            return b.similarityScore - a.similarityScore;
        }
        return a.name.localeCompare(b.name);
    });
    
    return candidates.slice(0, maxResults);
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeRelatedGames);

// Also provide a manual initialization function for dynamic content
window.RelatedGames = {
    show: showRelatedGames,
    find: findRelatedGames,
    findAdvanced: findAdvancedRelatedGames,
    init: initializeRelatedGames,
    showRandom: showRandomGames,
    getCurrentGame: getCurrentGameName
};