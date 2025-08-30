// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.getElementById('mainContent');
const gameCards = document.querySelectorAll('.game-card');
const navLinks = document.querySelectorAll('.nav-links a');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');


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
       
       // ADD THESE LINES: Toggle expanded class for news page elements
       const newsMainContent = document.querySelector('.news-page-container .news-main-content');
       const newsFooter = document.querySelector('.news-page-container .site-footer');
       
       if (newsMainContent) newsMainContent.classList.toggle('expanded');
       if (newsFooter) newsFooter.classList.toggle('expanded');
       
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


// Enhanced Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchIconBtn = document.getElementById('searchIconBtn');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchWrapper = document.querySelector('.search-wrapper');

    // Open search box
    function openSearch() {
        searchWrapper.classList.add('search-active');
        searchBox.classList.add('active');
        // Small delay to ensure animation starts, then focus input
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    }

    // Close search box
    function closeSearch() {
        searchWrapper.classList.remove('search-active');
        searchBox.classList.remove('active');
        searchInput.value = '';
        searchResults.classList.remove('active');
        searchInput.blur();
    }

    // Event listeners
    searchIconBtn.addEventListener('click', openSearch);

    // Close search when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchWrapper.contains(event.target) && !searchResults.contains(event.target)) {
            closeSearch();
        }
    });

    // Prevent closing when clicking inside search box
    searchBox.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Handle escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeSearch();
        }
    });

    // Your existing search functionality integrated
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

            // Check if games database is loaded
            if (!gamesDatabase || gamesDatabase.length === 0) {
                // Games not loaded yet, show loading message
                if (searchResults) {
                    searchResults.innerHTML = '<p class="loading-results">Loading games...</p>';
                    searchResults.classList.add('active');
                }
                return;
            }

            const filteredGames = gamesDatabase.filter(game =>
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
                    // Use the new data format with slug
                    if (game.slug) {
                        const destination = `https://www.infinite-pixels.com/game.html?game=${game.slug}`;
                        window.location.href = destination;
                    } else if (game.gameurl) {
                        // Fallback to direct game URL if no slug
                        window.location.href = game.gameurl;
                    }

                    searchResults.classList.remove('active');
                    searchInput.value = '';
                    closeSearch(); // Close the search box after selection
                });
                searchResults.appendChild(resultElement);
            });

            searchResults.classList.add('active');
        }
    }

    // Enhanced search button functionality
    // Search triggers automatically on input, no separate search button needed
});


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


// ========================================
// GLOBAL FUNCTION EXPORTS AND INITIALIZATION
// ========================================

// Export functions for global access and ensure they're available
window.ContentPageManager = {
    performContentSearch,
    displaySearchResults,
    initializePageSpecificFeatures,
    showNotification,
    scrollToResult
};

// Make sure global functions are available
if (typeof window.shareArticle === 'undefined') {
    window.shareArticle = function(platform, title) {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Check out this article: ${title}`);
        let shareUrl;
        
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };
}

if (typeof window.copyArticleLink === 'undefined') {
    window.copyArticleLink = function(title) {
        const url = window.location.href;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Article link copied to clipboard!');
            }).catch(() => {
                fallbackCopyToClipboard(url);
            });
        } else {
            fallbackCopyToClipboard(url);
        }
        
        function fallbackCopyToClipboard(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                showNotification('Article link copied to clipboard!');
            } catch (err) {
                showNotification('Unable to copy link. Please copy manually.');
            }
            
            document.body.removeChild(textArea);
        }
    };
}

if (typeof window.scrollToArticle === 'undefined') {
    window.scrollToArticle = function(index) {
        const articles = document.querySelectorAll('.blog-article');
        if (articles[index]) {
            const headerOffset = 100;
            const elementPosition = articles[index].getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };
}

// Enhanced initialization with multiple fallbacks
function initializeContentPages() {
    // Check if functions exist before calling
    if (typeof initializeFAQAccordion === 'function') initializeFAQAccordion();
    if (typeof initializeQuickLinks === 'function') initializeQuickLinks();
    if (typeof initializeBlogReadMore === 'function') initializeBlogReadMore();
    if (typeof initializeContentSearch === 'function') initializeContentSearch();
    if (typeof initializePageSpecificFeatures === 'function') initializePageSpecificFeatures();
}

// Multiple initialization approaches for maximum compatibility
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeContentPages, 100);
    });
} else {
    // DOM is already loaded
    setTimeout(initializeContentPages, 100);
}

// Backup initialization
window.addEventListener('load', function() {
    setTimeout(initializeContentPages, 200);
});

console.log('InfinitePixels content pages JavaScript loaded successfully');