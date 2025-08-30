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
// NEW PAGES INTERACTIVE FUNCTIONALITY
// ========================================

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });

    // Smooth scrolling for quick links
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Blog article "Read More" functionality
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const excerpt = this.previousElementSibling;
            const fullText = this.dataset.fullText;
            const shortText = this.dataset.shortText;
            
            if (this.classList.contains('expanded')) {
                excerpt.textContent = shortText;
                this.textContent = 'Read more';
                this.classList.remove('expanded');
            } else {
                excerpt.textContent = fullText;
                this.textContent = 'Read less';
                this.classList.add('expanded');
            }
        });
    });

    // Enhanced search functionality for content pages
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim().toLowerCase();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performContentSearch(query);
            }, 300);
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    // Initialize page-specific functionality
    initializePageSpecificFeatures();
});

// Content Search Function
function performContentSearch(query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    // Search through different content types based on current page
    const currentPage = window.location.pathname.split('/').pop();
    let searchItems = [];
    
    if (currentPage.includes('blog')) {
        searchItems = searchBlogContent(query);
    } else if (currentPage.includes('faq')) {
        searchItems = searchFAQContent(query);
    } else if (currentPage.includes('guides')) {
        searchItems = searchGuidesContent(query);
    } else if (currentPage.includes('reviews')) {
        searchItems = searchReviewsContent(query);
    } else if (currentPage.includes('tips')) {
        searchItems = searchTipsContent(query);
    }
    
    displaySearchResults(searchItems);
}

// Search Functions for Different Content Types
function searchBlogContent(query) {
    const articles = document.querySelectorAll('.blog-article, .featured-article');
    const results = [];
    
    articles.forEach(article => {
        const title = article.querySelector('h3')?.textContent?.toLowerCase() || '';
        const content = article.querySelector('.article-excerpt, .article-content')?.textContent?.toLowerCase() || '';
        const category = article.querySelector('.article-category')?.textContent?.toLowerCase() || '';
        
        if (title.includes(query) || content.includes(query) || category.includes(query)) {
            results.push({
                title: article.querySelector('h3')?.textContent || 'Article',
                excerpt: article.querySelector('.article-excerpt')?.textContent?.substring(0, 100) + '...' || '',
                element: article,
                type: 'Article'
            });
        }
    });
    
    return results;
}

function searchFAQContent(query) {
    const faqItems = document.querySelectorAll('.faq-item');
    const results = [];
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3, .faq-question h4')?.textContent?.toLowerCase() || '';
        const answer = item.querySelector('.faq-answer p')?.textContent?.toLowerCase() || '';
        
        if (question.includes(query) || answer.includes(query)) {
            results.push({
                title: item.querySelector('.faq-question h3, .faq-question h4')?.textContent || 'FAQ',
                excerpt: item.querySelector('.faq-answer p')?.textContent?.substring(0, 100) + '...' || '',
                element: item,
                type: 'FAQ'
            });
        }
    });
    
    return results;
}

function searchGuidesContent(query) {
    const guides = document.querySelectorAll('.guide-card');
    const results = [];
    
    guides.forEach(guide => {
        const title = guide.querySelector('h3')?.textContent?.toLowerCase() || '';
        const content = guide.querySelector('.guide-excerpt')?.textContent?.toLowerCase() || '';
        const category = guide.querySelector('.guide-category')?.textContent?.toLowerCase() || '';
        
        if (title.includes(query) || content.includes(query) || category.includes(query)) {
            results.push({
                title: guide.querySelector('h3')?.textContent || 'Guide',
                excerpt: guide.querySelector('.guide-excerpt')?.textContent?.substring(0, 100) + '...' || '',
                element: guide,
                type: 'Guide'
            });
        }
    });
    
    return results;
}

function searchReviewsContent(query) {
    const reviews = document.querySelectorAll('.review-card, .review-featured');
    const results = [];
    
    reviews.forEach(review => {
        const title = review.querySelector('h3, h4')?.textContent?.toLowerCase() || '';
        const content = review.querySelector('.review-excerpt')?.textContent?.toLowerCase() || '';
        
        if (title.includes(query) || content.includes(query)) {
            results.push({
                title: review.querySelector('h3, h4')?.textContent || 'Review',
                excerpt: review.querySelector('.review-excerpt')?.textContent?.substring(0, 100) + '...' || '',
                element: review,
                type: 'Review'
            });
        }
    });
    
    return results;
}

function searchTipsContent(query) {
    const tips = document.querySelectorAll('.tip-card, .category-section');
    const results = [];
    
    tips.forEach(tip => {
        const title = tip.querySelector('h3, h4')?.textContent?.toLowerCase() || '';
        const content = tip.querySelector('p, .tip-content')?.textContent?.toLowerCase() || '';
        
        if (title.includes(query) || content.includes(query)) {
            results.push({
                title: tip.querySelector('h3, h4')?.textContent || 'Tip',
                excerpt: tip.querySelector('p')?.textContent?.substring(0, 100) + '...' || '',
                element: tip,
                type: 'Tip'
            });
        }
    });
    
    return results;
}

// Display Search Results
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No results found</div>';
        searchResults.style.display = 'block';
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result-item" data-type="${result.type}">
            <div class="result-type">${result.type}</div>
            <h4 class="result-title">${result.title}</h4>
            <p class="result-excerpt">${result.excerpt}</p>
        </div>
    `).join('');
    
    searchResults.innerHTML = resultsHTML;
    searchResults.style.display = 'block';
    
    // Add click handlers to search results
    const resultItems = searchResults.querySelectorAll('.search-result-item');
    resultItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const targetElement = results[index].element;
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                searchResults.style.display = 'none';
                
                // Highlight the target element briefly
                targetElement.style.transition = 'all 0.3s ease';
                targetElement.style.backgroundColor = 'rgba(138, 43, 226, 0.1)';
                setTimeout(() => {
                    targetElement.style.backgroundColor = '';
                }, 2000);
            }
        });
    });
}

// Page-Specific Feature Initialization
function initializePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage.includes('blog')) {
        initializeBlogFeatures();
    } else if (currentPage.includes('reviews')) {
        initializeReviewsFeatures();
    } else if (currentPage.includes('guides')) {
        initializeGuidesFeatures();
    } else if (currentPage.includes('tips')) {
        initializeTipsFeatures();
    } else if (currentPage.includes('faq')) {
        initializeFAQFeatures();
    }
}

// Blog-specific features
function initializeBlogFeatures() {
    // Auto-expand long articles with "Read More" functionality
    const articles = document.querySelectorAll('.blog-article');
    articles.forEach(article => {
        const content = article.querySelector('.article-content');
        if (content && content.textContent.length > 500) {
            addReadMoreFunctionality(content);
        }
    });
    
    // Article sharing functionality
    initializeArticleSharing();
}

// Reviews-specific features
function initializeReviewsFeatures() {
    // Initialize rating interactions
    const ratingStars = document.querySelectorAll('.stars');
    ratingStars.forEach(stars => {
        const starElements = stars.querySelectorAll('i');
        starElements.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                highlightStars(starElements, index);
            });
        });
        
        stars.addEventListener('mouseleave', () => {
            resetStars(starElements);
        });
    });
}

// Guides-specific features
function initializeGuidesFeatures() {
    // Initialize guide difficulty indicators
    const difficultyBadges = document.querySelectorAll('.difficulty');
    difficultyBadges.forEach(badge => {
        const level = badge.textContent.trim().toLowerCase();
        badge.classList.add(`difficulty-${level}`);
    });
    
    // Initialize guide progress tracking
    initializeGuideProgress();
}

// Tips-specific features
function initializeTipsFeatures() {
    // Initialize tip favoriting
    initializeTipFavorites();
    
    // Initialize tip categories filtering
    initializeTipFiltering();
}

// FAQ-specific features
function initializeFAQFeatures() {
    // Initialize FAQ voting
    initializeFAQVoting();
    
    // Initialize FAQ search highlighting
    initializeFAQSearchHighlighting();
}

// Helper Functions
function addReadMoreFunctionality(content) {
    const text = content.textContent;
    const shortText = text.substring(0, 300) + '...';
    const fullText = text;
    
    if (text.length > 300) {
        content.innerHTML = `
            <span class="article-text">${shortText}</span>
            <button class="read-more-btn" data-short-text="${shortText}" data-full-text="${fullText}">
                Read more
            </button>
        `;
    }
}

function initializeArticleSharing() {
    const shareButtons = document.querySelectorAll('.share-article');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const articleTitle = this.closest('article').querySelector('h3').textContent;
            const articleUrl = window.location.href;
            
            if (navigator.share) {
                navigator.share({
                    title: articleTitle,
                    url: articleUrl
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(articleUrl).then(() => {
                    showNotification('Article link copied to clipboard!');
                });
            }
        });
    });
}

function highlightStars(stars, index) {
    stars.forEach((star, i) => {
        if (i <= index) {
            star.style.color = '#ffd700';
        } else {
            star.style.color = '#ddd';
        }
    });
}